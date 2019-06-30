#
# repos_controller.rb
# LayerKeep
#
# Created by Kevin Musselman (kmussel@gmail.io) on 04/27/19
# Copyright 2018 LayerKeep
#

class ReposController < AuthController
  before_action :get_user
  respond_to :json

  def index
    repos = policy_scope(@user, policy_scope_class: RepoPolicy::Scope).where(kind: params["kind"]).
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
    
    @repo        = Repo.new(post_params.permit(:name, :description))
    @repo.kind   = params[:kind]
    @repo.user   = @user

    authorize @repo

    repo_path = "#{@user.username}/#{params["kind"]}/#{@repo.name.downcase}" if @repo.name
    @repo.path = repo_path

    if @repo.valid?
      @git_repo = Rugged::Repository.init_at("#{Rails.application.config.settings["repo_mount_path"]}/#{repo_path}/.", :bare)
      files = params.fetch(:files, nil)
      if files
        repo_handler = RepoFilesHandler.new(@git_repo, params)
        commit_id, names = repo_handler.insert_files(@user, files)
        repo_handler.process_new_files(@repo, commit_id, names)
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
end
