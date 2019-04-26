#
# main_controller.rb
# LayerKeep
#
# Created by Wess Cope (me@wess.io) on 04/23/19
# Copyright 2018 WessCope
#

class ReposController < AuthController
  before_action :get_user

  def index
    logger.info("hi")
    repos = @user.repos.where(kind: params["kind"])

    render json: repos
  end

  def show
    repo = @user.repos.find_by(kind: params["kind"], name: params["repo_name"])
    render json: repo
  end

  def create
    post_params = params[:repo]

    
    @repo        = Repo.new(post_params.permit(:name, :description))
    @repo.kind   = params[:kind]
    @repo.user   = @user

    repo_path = "#{@user.username}/#{params["kind"]}/#{@repo.name.downcase}" if @repo.name
    @repo.path = repo_path

    if @repo.valid?
      @git_repo = Rugged::Repository.init_at("#{Rails.application.config.settings["repo_mount_path"]}/#{repo_path}/.", :bare)
      @repo.save!

      render json: @repo.to_json
    else
      render status: 400, json: @repo.errors.to_json
    end
  end

  def about
  end

  def contact
  end

  def get_user()
    @user ||= User.find_by(username: params["user"] || "")
  end
end
