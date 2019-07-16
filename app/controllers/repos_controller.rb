#
# repos_controller.rb
# LayerKeep
#
# Created by Kevin Musselman (kmussel@gmail.io) on 04/27/19
# Copyright 2018 LayerKeep
#
require 'zip'

class ReposController < AuthController
  before_action :get_user
  respond_to :json

  def index
    repos = policy_scope(@user, policy_scope_class: RepoPolicy::Scope).where(kind: params["kind"]).order("updated_at desc").
                        page(params["page"]).per(params["per_page"])
    
    serializer = paginate(repos)
    render json: serializer
  end

  def show
    repo = @user.repos.find_by!(kind: params["kind"], name: params["repo_name"])
    authorize repo

    git_repo = Rugged::Repository.init_at("#{Rails.application.config.settings["repo_mount_path"]}/#{repo.path}/.", :bare)
    branches = git_repo.branches.collect {|branch| branch.name } 

    reposerializer = ReposSerializer.new(repo, {params: {branches: branches}})
    
    render json: reposerializer #repo.to_hash.merge({branches: branches})
  end

  def create
    post_params = params[:repo]
    commit_message = nil
    post_params[:description] ||= ""

    @repo        = Repo.new(post_params.permit(:name, :description))
    @repo.kind   = params[:kind]
    @repo.user   = @user

    authorize @repo

    repo_path = "#{@user.username}/#{params["kind"]}/#{@repo.name.downcase}" if @repo.name
    @repo.path = repo_path

    if @repo.valid?
      
      if post_params[:remote_source_id]
        remote_source = RemoteSource.find(post_params[:remote_source_id])
        if remote_source.name == "thingiverse"
          files, commit_message = create_from_thingiverse(post_params)
          @repo.remote_src_url = "https://www.thingiverse.com/thing:#{post_params[:thing_id]}"
          @repo.remote_source_id = remote_source.id

          @repo.description = "Created From: #{@repo.remote_src_url} \n" + @repo.description
        end
      else
        files = params.fetch(:files, nil)
      end
      @git_repo = Rugged::Repository.init_at("#{Rails.application.config.settings["repo_mount_path"]}/#{repo_path}/.", :bare)
      
      if files
        repo_handler = RepoFilesHandler.new(@git_repo, params)
        logger.info(files)
        commit_id, names = repo_handler.insert_files(@user, files, commit_message)
        if post_params[:remote_source_id]
          begin
            File.delete(files.name) if files.instance_of?(Zip::File) && File.exist?(files.name)
          rescue Exception => e
            logger.error("Could not delete tmp file: #{e.inspect}")
          end
        else
          repo_handler.process_new_files(@repo, commit_id, names)
        end
      end
      @repo.save!

      $tracker.track(current_user.id, "Repo Created", {kind: @repo.kind, name: @repo.name})
      render json: @repo.to_json
    else
      $tracker.track(current_user.id, "Repo Creation Failed", {kind: @repo.kind, name: @repo.name, errors: @repo.errors})
      render status: 400, json: @repo.errors.to_json
    end
  end

  def update
    repo = @user.repos.find_by!(kind: params["kind"], name: params["repo_name"])
    authorize repo

    if repo.update(params.permit(:description))
      render json: repo.to_json
    else
      render status: 400, json: @repo.errors.to_json
    end
  end

  def destroy
    repo = @user.repos.find_by!(kind: params["kind"], name: params["repo_name"])
    authorize repo

    if params.require(:confirmed)
      res = FileUtils.rm_rf("#{Rails.application.config.settings["repo_mount_path"]}/#{repo.path}")
      des = repo.destroy()

      render status: 200, json: {"success": true}
    else
      render status: 400, json: {"error": "Please confirm you want to delete this repo"}
    end
  end

  def get_user()
    @user ||= User.find_by!(username: params["user"] || "")
  end


  def create_from_thingiverse(params) 
    conn = Faraday.new(:url => "https://api.thingiverse.com") do |con|
      con.response :json, :content_type => /\bjson$/
      con.adapter  Faraday.default_adapter  # make requests with Net::HTTP
    end
    
    resp = conn.get do |req|
      req.url "/things/#{params[:thing_id]}/packageURL"
      req.headers['Authorization'] = "Bearer #{Rails.application.config.settings["thingiverse_api_token"]}"
    end

    logger.info(resp.body)

    error_msg = "Error Retrieving From Thingiverse"
    error_msg += ": #{resp.body['error']}" if resp.body["error"]
    if resp.body["public_url"]
      uri = URI(resp.body["public_url"])
      code, tmpfilepath = download_to_tmp_path(uri)        
      logger.info(tmpfilepath)

      if code != 200 
        raise LayerKeepErrors::LayerKeepError.new(error_msg, code) and return 
      end

      files = Zip::File.open(tmpfilepath)
      commit_message = "Created From Thingiverse #{params[:thing_id]}"
      return files, commit_message
    end

    raise LayerKeepErrors::LayerKeepError.new(error_msg, resp.status) and return 
    
  end

  def download_to_tmp_path(url, query = nil)
    uri = URI(url)
    if query
      uri.query = URI.encode_www_form query
    end

    Net::HTTP.start(uri.host, uri.port, :use_ssl => (uri.scheme == 'https')) do |http|
      request = Net::HTTP::Get.new uri.request_uri
      http.request request do |response|
        case response
        when Net::HTTPForbidden 
          return response.code, "Forbidden"
        when Net::HTTPOK
          ext = ".zip"
          tmp = Tempfile.create([ 'repo', ext ])
          tmp_path = tmp.path
          tmp.close
          File.open tmp_path, 'wb' do |io|
            response.read_body do |chunk|
              io.write chunk
            end
          end
          return 200, tmp_path
        else
          return 400, "Error"
        end
      end
    end
    return 400, "Error"
  end


end
