#
# content_controller.rb
# LayerKeep
#
# Created by Kevin Musselman (kmussel@gmail.io) on 04/27/19
# Copyright 2018 LayerKeep
#

class ContentController < AuthController
  before_action :get_user
  before_action :get_repo
  before_action :init_git_data

  def show
    file = nil
    if @repo_handler.filepath.length > 0
      file = file_response(response, @repo_handler, params[:download])
    end

    if file
      git_command = "show"
      download_name = @repo_handler.filepath.gsub(/\//, "-")
    else
      git_command = "archive"
      download_names = [@repo.name.gsub(/\/\./, "")]
      download_names << @repo_handler.filepath.gsub(/\//, "-") unless @repo_handler.filepath.blank?
      download_name = download_names.join("-").downcase + ".zip"
      response.headers['X-Content-Disposition'] = "attachment; filename=#{download_name}"
    end
    
    response.headers['X-Repo-Commit'] = @repo_handler.current_commit.oid
    response.headers['X-Accel-Redirect'] =  "@repo" 

    response.headers['X-Repo-Path'] =  @repo.path
    response.headers['X-File-Path'] = @repo_handler.filepath
    response.headers['X-Git-Command'] = git_command
    response.headers['X-File-Name'] = download_name
    
    head :ok and return
  end

  

  def file_response(response, repo_handler, force_download = false)
    file = nil
    repo_handler.current_commit.tree.walk_blobs do |rootpath, f|
      fullname = rootpath + f[:name]
      if fullname == repo_handler.filepath
        file = f
        break
      end  
    end

    return nil unless file 

    if force_download
      response.headers['X-Content-Type'] = "application/force-download" 
      response.headers['X-Content-Disposition'] = "attachment; filename=#{repo_handler.filepath.gsub(/\//, "-")}"
    else
      fileobject = repo_handler.repo.lookup(file[:oid])
      mimetype = FileMagic.mime().buffer(fileobject.content)
      response.headers['X-Content-Type'] = mimetype
      response.headers['X-Content-Disposition'] = "inline"
    end
    file
  end


  def get_user()
    @user ||= User.find_by!(username: params["user"] || "")
  end

  def get_repo()
    @repo = @user.repos.where(kind: params[:kind], name: params.fetch("repo_name", "")).first!
    @git_repo = Rugged::Repository.init_at("#{Rails.application.config.settings["repo_mount_path"]}/#{@repo.path}/.", :bare)
  end

  def init_git_data
    @repo_handler = RepoFilesHandler.new(@git_repo, params)
    if params["view"] == 'tree' && (@repo_handler.filepath.nil? or @repo_handler.filepath.length > 0)
      redirect_to(:action => "show", revision: @repo_handler.revision, filepath: @repo_handler.filepath)
    end
  end
end
