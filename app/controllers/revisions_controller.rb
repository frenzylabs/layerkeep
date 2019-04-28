#
# files_controller.rb
# LayerKeep
#
# Created by Kevin Musselman (kmussel@gmail.io) on 04/27/19
# Copyright 2018 LayerKeep
#


class RevisionsController < AuthController
  before_action :get_user
  before_action :get_repo
  before_action :init_git_data

  def index
    walker = Rugged::Walker.new(@git_repo)
    walker.sorting(Rugged::SORT_DATE)

    walker.push(@repo_handler.current_commit)    
    revisions = []
    walker.inject(revisions) do |a, c|
      if @repo_handler.filepath.blank? 
        a << c
      else

        if c.parents.first 
          c.parents.first.diff(c, paths: [@repo_handler.filepath]).deltas.each do |d| 
            a << c 
          end
          a
        else
          c.diff(paths: [@repo_handler.filepath]).deltas.each do |d| 
            a << c 
          end
          a
        end
      end
    end
    render json: revisions
  end

  def show
    parent = @repo_handler.current_commit.parents.first
    changes = parent ? parent.diff(@repo_handler.current_commit) : []

    res = []
    changes.each do |c|
      if c.bytesize > 10000
        res << c.header
      else
        res << c
      end
    end
    render json: {"message" => res.join("\n")}
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
  end
end
