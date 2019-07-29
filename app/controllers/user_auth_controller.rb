#
# auth_controller.rb
# LayerKeep
#
# Created by Wess Cope (me@wess.io) on 04/24/19
# Copyright 2018 WessCope
#

class RepoAuthController < ApplicationController
  before_action :get_user
  before_action :get_repo
  before_action :authorize_repo
  before_action :init_git_data


  def authorize_repo 
    authorize(@repo)
  end

  def get_user
    @user ||= User.find_by!(username: params["user"] || "")
  end

  def get_repo
    @repo = @user.repos.where(kind: params[:kind], name: params.fetch("repo_name", "")).first!
    @git_repo = Rugged::Repository.init_at("#{Rails.application.config.settings["repo_mount_path"]}/#{@repo.path}/.", :bare)
  end

  def init_git_data
    @repo_handler = RepoFilesHandler.new(@git_repo, params)
    # if params["view"] == 'tree' && (@repo_handler.filepath.nil? or @repo_handler.filepath.length > 0)
    #   redirect_to(:action => "show", revision: @repo_handler.revision, filepath: @repo_handler.filepath)
    # end
  end
end
