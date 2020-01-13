require 'zip'

class RepoFilesHandler
  attr_accessor :repo, :current_branch, :current_commit, :revision, :filepath

  def initialize(git_repo, params)
    @repo = git_repo
    @revision = params['revision']
    @filepath = params['filepath'] 
    set_commit(@revision, @filepath)
  end

  def insert_files(current_user, files, message = nil)

    if files.is_a?(ActionController::Parameters)
      files.permit!
      files = files.to_h
    end
    
    return nil if files.nil? or files.count < 1

    index = @repo.index
    index.read_tree(@current_branch.target.tree)
    @names = []

    removeTopDir = false
    if files.instance_of?(Zip::File)
      res = files.inject([]){ |paths, n| dir = n.name.split("/").first; paths <<  dir }
      if (res.to_set.length == 1 && !files.get_entry(res[0]).file?)
        removeTopDir = true
      end
    end
    
    hasKeyPath = true if files.is_a?(Hash)

    files.each do |file|
      name = ""
      if @filepath.length > 1
        prefix = @filepath + "/"
      else
        prefix = ""
      end
      if hasKeyPath
        keypath, f = file
        paths = keypath.split("/")
        startpos = 0
        
        if paths.length > 1
          startpos = 1 if paths[0] == ""
          endpos = paths.length - 1
          if startpos == endpos
            keypath = ""
          else
            keypath = paths[startpos...endpos].join('/') + "/"
          end
        else
          keypath = ""
        end

        prefix = prefix + keypath
      else
        f = file
      end
        

      case f
      when String
        tmppath = f.split("/")
        tmpkey = tmppath[0]
        name = tmppath[1...].join('/')
        

        dirpath = File.join(@repo.path, ".tmpfiles", tmpkey)
        filepath = File.join(@repo.path, ".tmpfiles", f)
        next unless File.exist?(filepath)
        fp = File.open(filepath)
        oid = @repo.write(fp.read(), :blob)
        fp.close()
        
      when Zip::Entry
        next unless f.file?
        name = removeTopDir ? f.name.split("/")[1..-1].join("/") : f.name
        oid = @repo.write(f.get_input_stream.read(), :blob)
      when Array
        if f.length > 1 
          name = f[0]
          fp = f[1]
          oid = @repo.write(fp.read(), :blob)
        else
          next
        end
      else
        next unless f.respond_to?(:read)
        if f.respond_to?(:original_filename)
          name = f.original_filename
        elsif f.respond_to?(:path)
          name = f.path.split("/").last
        else
         next
        end

        if f.respond_to?(:content_type)
          if  (f.content_type =~ /image\//) != nil
            prefix = "images/"
          end
        end
        oid = @repo.write(f.read(), :blob)
      end
      @names << name
      index.add(:path => prefix + name, :oid => oid, :mode => 0100644)
    end
    
    msg = ""
    if @names.count > 1
      msg = "and #{@names.count - 1} more"
    end

    options = {}
    options[:tree]       = index.write_tree(@repo)
    options[:author]     = { :email => current_user.email, :name => current_user.username, :time => Time.now }
    options[:committer]  = { :email => current_user.email, :name => current_user.username, :time => Time.now }
    options[:message]    =  message || "Uploading File #{@names[0]} #{msg}"
    options[:parents]    = @repo.empty? ? [] : [ @current_commit ].compact
    options[:update_ref] = 'HEAD'

    commit_id = Rugged::Commit.create(@repo, options)

    cleanup_tmp_files(files)
    [commit_id, @names]
  end

  def cleanup_tmp_files(files)
    dirpath = File.join(@repo.path, ".tmpfiles")
    files.each do |f| 
      if f.is_a?(File)
        File.delete(f.path)
      elsif f.is_a?(String)
        filepath = File.join(dirpath, f)
        File.delete(filepath) if File.exist?(filepath)
      end
    end

    
    Dir.glob(dirpath + "/*").each { |d| 
      k, t = d.split(dirpath + "/")
      FileUtils.rm_rf(d) if (Time.at(t.to_i).utc + 1.hour) < DateTime.now.utc
    }

    Dir.glob(dirpath + "/**/*").select { |d|
      File.directory?(d)
    }.reverse_each { |d| 
      if ((Dir.entries(d) - %w[ . .. ]).empty?)
        Dir.rmdir(d)
      end
    } 
  end


  def process_new_files(dbrepo, commit_id, names)
    if commit_id 
      process_files = []
      names.each do |f| 
        ext = f.split(".").last().downcase
        if ["stl", "obj"].include?(ext) 
          process_files << f
        end
      end

      if process_files.length > 0
        generate_imgs = {
          repo_path: dbrepo.path,
          repo_name: dbrepo.name.downcase(),
          commit: commit_id,
          image_type: "png",
          file_paths: process_files
        }
        res = Publisher.publish(generate_imgs.to_json, "files.new")
        puts "Publish Res = #{res.inspect}"
      end
    end
  end

  def set_commit(branch = nil, filepath = nil)
    branch ||= 'master'    

    begin
      if @repo.head_unborn?
        options = {message: "HEAD", parents: [], update_ref: 'HEAD', tree: @repo.index.write_tree}
        @commit_id = Rugged::Commit.create(@repo, options)
      end
      
      obj = @repo.lookup(@repo.rev_parse_oid(branch))
      @current_commit =
      case obj.type 
        when :commit then obj
        else raise LayerKeepErrors::RevisionNotFound.new("Revision #{branch} Not Found")
      end
      @revision = branch
      @current_branch = @repo.branches[@revision] || @repo.branches.find {|b| b.target_id == @current_commit.oid }
      if !@current_branch
        branches = `cd #{@repo.path}; git for-each-ref --contains #{@current_commit.oid} --format="%(refname:short)"`
        branchlookup = (branches.lines.first || "master").chomp
        @current_branch = @repo.branches[branchlookup]
      end
      @filepath = sanitize_filepath(filepath || "")
    rescue Rugged::InvalidError, Rugged::ReferenceError
      branchpaths = branch.split('/')
      if branchpaths.length > 1
        branch = branchpaths[0...-1].join('/')
        filepath = [branchpaths[-1], filepath].compact.join('/').strip
        set_commit(branch, filepath)
      else
        matches = branch.match(/^(.*)(\.json)$/)
        if matches && matches.length > 2
          set_commit(matches[1], filepath)
        else
          raise LayerKeepErrors::RevisionNotFound.new()
        end
      end
    end
  end

  def sanitize_filepath(filepath)
    filepath.gsub(/[^0-9A-z.\-\/\s\(\)]/, "")
  end

  def list_files(params = {})
    recursive = params[:recursive] || false
    start_commit = self.current_commit
    @filepath = self.filepath.chomp("/")
    rootpath = @filepath.blank? ? "" : @filepath + "/"
    pathmatch = Regexp.new("(?:#{@filepath}(?:\/))?([^\/]+)", "m")
    file_paths = file_list(start_commit, @filepath, nil, recursive)

    @files = []

    walker = Rugged::Walker.new(self.repo)
    walker.sorting(Rugged::SORT_DATE)
    walker.push(start_commit)    
    walker.inject(@files) do |a, c|
      break if file_paths.empty?
      if c.parents.first 
        c.parents.first.diff(c, paths: file_paths).deltas.each do |d|
          if recursive
            filename = filepath = d.new_file[:path]
            filetype = :blob
          else
            filename, filetype = build_filepath(d.new_file[:path], pathmatch)          
            filepath = rootpath + filename
          end
          if file_paths.delete(filepath)
            a << {name: filename, path: filepath, type: filetype, author: c.author, date: c.time, commit: c.oid, subject: c.message.split("\n").first, message: c.message}
          end
        end
      else
        c.diff(paths: file_paths).deltas.each do |d| 
          if recursive
            filepath = d.new_file[:path]
            filetype = :blob
          else
            filename, filetype = build_filepath(d.old_file[:path], pathmatch)          
            filepath = rootpath + filename
          end

          if file_paths.delete(filepath) 
            a << {name: filename, path: filepath, type: filetype, author: c.author, date: c.time, commit: c.oid, subject: c.message.split("\n").first, message: c.message}
          end
        end
      end
      a
    end
    
    @metadata = {last_committed_at: self.current_commit.time, 
                last_commit_message: self.current_commit.message,
                commit_id:  self.current_commit.oid,
                current_branch: self.current_branch.name, 
                head: self.current_branch.target_id == self.current_commit.oid,
                revision: self.revision, 
                filepath: self.filepath}
    {data: @files, meta: @metadata}
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
