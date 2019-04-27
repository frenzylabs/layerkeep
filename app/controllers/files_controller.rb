#
# files_controller.rb
# LayerKeep
#
# Created by Kevin Musselman (kmussel@gmail.io) on 04/27/19
# Copyright 2018 LayerKeep
#


class FilesController < AuthController
  before_action :get_user
  before_action :get_repo
  before_action :init_git_data

  def index
    start_commit = @repo_handler.current_commit

    @filepath = @repo_handler.filepath.chomp("/")
    rootpath = @filepath.blank? ? "" : @filepath + "/"
    pathmatch = Regexp.new("(?:#{@filepath}(?:\/))?([^\/]+)", "m")
    file_paths = file_list(start_commit, @filepath)

    @files = []

    walker = Rugged::Walker.new(@git_repo)
    walker.sorting(Rugged::SORT_DATE)
    walker.push(start_commit)    
    walker.inject(@files) do |a, c|
      break if file_paths.empty?
      if c.parents.first 
        c.parents.first.diff(c, paths: file_paths).deltas.each do |d| 
          filename, filetype = build_filepath(d.new_file[:path], pathmatch)          
          filepath = rootpath + filename
          if file_paths.delete(filepath)
            a << {name: filename, path: filepath, type: filetype, author: c.author, date: c.time, commit: c.oid, subject: c.message.split("\n").first, message: c.message}
          end
        end
      else
        c.diff(paths: file_paths).deltas.each do |d| 
          filename, filetype = build_filepath(d.old_file[:path], pathmatch)
          filepath = rootpath + filename
          if file_paths.delete(filepath) 
            a << {name: filename, path: filepath, type: filetype, author: c.author, date: c.time, commit: c.oid, subject: c.message.split("\n").first, message: c.message}
          end
        end
      end
      a
    end

    render json: @files
  end

  def show
    @file = nil
    @repo_handler.current_commit.tree.walk_blobs do |rootpath, f|
      fullname = rootpath + f[:name]
      if fullname == @repo_handler.filepath
        @file = f
        break
      end  
    end

    throw not_found unless @file 
    
    render json: @file
  end

  def create
    if @repo_handler.current_branch.name != @repo_handler.revision
      render status: 400, json: {'error': 'You must be on a branch to upload'} and return
    end
    files = params.require(:files)

    commit_id, names = @repo_handler.insert_files(current_user, files)

    if commit_id
      render json: {'commit_id': commit_id, 'names': names}
    else
      render status: 400, json: {'error': 'Error uploading files'}
    end

  end

  

  def build_filepath(filepath, pathmatch)
    filetype = :blob
    matches = filepath.scan(pathmatch)
    filename = matches[0].first || filepath
    if matches.count > 1
      filetype = :tree
    end
    [filename, filetype]
  end


  def file_list(start_commit, filepath, pathmatch = nil)
    filepath = filepath.chomp("/")
    pathmatch ||= Regexp.new("(?:#{filepath}(?:\/))?([^\/]+)", "m")
    current_files = []
    start_commit.tree.walk(:postorder).inject(current_files) do |a, (rootpath, f)| 
      rootpath = rootpath.chomp("/") + "/" if f[:type] == :tree
      fullname = rootpath + f[:name]
      if fullname.starts_with?(filepath) && fullname.scan(pathmatch).count < 2
        a.push(f) 
      end
      a
    end

    rootpath = filepath.blank? ? "" : filepath + "/"
    file_paths = current_files.map { |f| rootpath + f[:name] }
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
