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
        

    files.each do |f|
      name = ""
      prefix = ""
      case f
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
        name = f.original_filename
        if  (f.content_type =~ /image\//) != nil
          prefix = "images/"
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
    [commit_id, @names]
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
end
