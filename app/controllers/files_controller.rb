#
# files_controller.rb
# LayerKeep
#
# Created by Kevin Musselman (kmussel@gmail.io) on 04/27/19
# Copyright 2018 LayerKeep
#


class FilesController < RepoAuthController

  def index
    respond_to do |format|
      format.html {}
      format.json {
        @filehash = @repo_handler.list_files(params)
        render json: @filehash

        # recursive = params[:recursive] || false
        # start_commit = @repo_handler.current_commit
        # @filepath = @repo_handler.filepath.chomp("/")
        # rootpath = @filepath.blank? ? "" : @filepath + "/"
        # pathmatch = Regexp.new("(?:#{@filepath}(?:\/))?([^\/]+)", "m")
        # file_paths = file_list(start_commit, @filepath, nil, recursive)

        # @files = []

        # walker = Rugged::Walker.new(@git_repo)
        # walker.sorting(Rugged::SORT_DATE)
        # walker.push(start_commit)    
        # walker.inject(@files) do |a, c|
        #   break if file_paths.empty?
        #   if c.parents.first 
        #     c.parents.first.diff(c, paths: file_paths).deltas.each do |d|
        #       if recursive
        #         filename = filepath = d.new_file[:path]
        #         filetype = :blob
        #       else
        #         filename, filetype = build_filepath(d.new_file[:path], pathmatch)          
        #         filepath = rootpath + filename
        #       end
        #       if file_paths.delete(filepath)
        #         a << {name: filename, path: filepath, type: filetype, author: c.author, date: c.time, commit: c.oid, subject: c.message.split("\n").first, message: c.message}
        #       end
        #     end
        #   else
        #     c.diff(paths: file_paths).deltas.each do |d| 
        #       if recursive
        #         filepath = d.new_file[:path]
        #         filetype = :blob
        #       else
        #         filename, filetype = build_filepath(d.old_file[:path], pathmatch)          
        #         filepath = rootpath + filename
        #       end

        #       if file_paths.delete(filepath) 
        #         a << {name: filename, path: filepath, type: filetype, author: c.author, date: c.time, commit: c.oid, subject: c.message.split("\n").first, message: c.message}
        #       end
        #     end
        #   end
        #   a
        # end
        
        # metadata = {last_committed_at: @repo_handler.current_commit.time, 
        #             last_commit_message: @repo_handler.current_commit.message,
        #             commit_id:  @repo_handler.current_commit.oid,
        #             current_branch: @repo_handler.current_branch.name, 
        #             head: @repo_handler.current_branch.target_id == @repo_handler.current_commit.oid,
        #             revision: @repo_handler.revision, 
        #             filepath: @repo_handler.filepath}
        # render json: {data: @files, meta: metadata}
      }
    end
  end

  def show
    respond_to do |format|
      format.html {        
      }
      format.json {

        @file = nil
        @repo_handler.current_commit.tree.walk_blobs do |rootpath, f|
          fullname = rootpath + f[:name]
          if fullname == @repo_handler.filepath
            @file = f
            break
          end  
        end

        throw record_not_found unless @file 

        metadata = {
          last_committed_at: @repo_handler.current_commit.time, 
          last_commit_message: @repo_handler.current_commit.message,
          commit_id:  @repo_handler.current_commit.oid,
          current_branch: @repo_handler.current_branch.name, 
          revision: @repo_handler.revision, 
          filepath: @repo_handler.filepath
        }

        render json: {data: @file, meta: metadata} 
      }
    end
  end

  def create
    files   = params.require(:files)
    message = params[:message]

    commit_id, names = @repo_handler.insert_files(current_user, files, message)
    @repo_handler.process_new_files(@repo, commit_id, names)

    if commit_id
      render json: {'commit_id': commit_id, 'names': names}
    else
      render status: 400, json: {'error': 'Error uploading files'}
    end

  end


  def upload
    if @repo_handler.current_branch.target_id != @repo_handler.current_commit.oid
      render status: 400, json: {'error': 'You must be on the latest revision to upload'} and return
    end

    file   = params.require(:file)
    file.permit!
    fparam = file.to_h
    filepath = fparam.keys.first
    fileobj = fparam[filepath]

    tmppath = nil
    errormsg = ""
    begin
      dt = "#{DateTime.now.utc.to_i}"
      paths = filepath.split("/")
      fname = paths.pop()
      dirpath = File.join(@repo_handler.repo.path, ".tmpfiles", dt)

      nesteddirpath = File.join(dirpath, *paths)
      FileUtils.mkdir_p(nesteddirpath) unless Dir.exist?(nesteddirpath)

      path = File.join(dirpath, filepath)
      File.open(path, "wb") { |f| f.write(fileobj.read) }
      tmppath = File.join(dt, filepath)
    rescue => e
      errormsg = "Could not upload file: #{e.inspect}"
      logger.error(errormsg)
    end

    if tmppath
      render json: {'path': tmppath, 'name': filepath}
    else
      render status: 400, json: {'error': 'Error uploading files', 'reason': errormsg}
    end

  end

  def clear_uploads
    files  = params.require(:files)
    @repo_handler.cleanup_tmp_files(files)

    render json: {'deleted': "ok"}
  end


  def destroy
    if @repo_handler.current_branch.target_id != @repo_handler.current_commit.oid
      render status: 400, json: {'error': 'You must be on the latest revision to delete'} and return
    end

    current_repo = @repo_handler.repo
    index = current_repo.index
    index.read_tree(@repo_handler.current_branch.target.tree)
    
    index.remove_all(@repo_handler.filepath)

    options = {}
    options[:tree] = index.write_tree(current_repo)

    options[:author] = { :email => current_user.email, :name => current_user.username, :time => Time.now }
    options[:committer] = { :email => current_user.email, :name => current_user.username, :time => Time.now }
    options[:message] ||= "Deleted file #{@repo_handler.filepath}"
    options[:parents] = current_repo.empty? ? [] : [ @repo_handler.current_commit ].compact
    options[:update_ref] = 'HEAD'

    @commit_id = Rugged::Commit.create(current_repo, options)
    render json: {'success': "Deleted #{@repo_handler.filepath}"}
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

  def file_list(start_commit, filepath, pathmatch = nil, recursive = true)
    filepath = filepath.chomp("/")
    pathmatch ||= Regexp.new("(?:#{filepath}(?:\/))?([^\/]+)", "m")
    current_files = []
    start_commit.tree.walk(:postorder).inject(current_files) do |a, (rootpath, f)| 

      fullname = rootpath + f[:name]
      if fullname.starts_with?(filepath) && (recursive || fullname.scan(pathmatch).count < 2)
        if recursive
          if f[:type] != :tree 
            a.push(fullname) 
          end
        else
          a.push(fullname) 
        end
      end
      a
    end

    current_files
  end
end
