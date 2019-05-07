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
    repo = @user.repos.find_by(kind: params["kind"], name: params["repo_name"])
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
        commit_id, names = RepoFilesHandler.new(@git_repo, params).insert_files(@user, files)
      end
      @repo.save!

      render json: @repo.to_json
    else
      render status: 400, json: @repo.errors.to_json
    end
  end

  def get_user()
    @user ||= User.find_by!(username: params["user"] || "")
  end
end
