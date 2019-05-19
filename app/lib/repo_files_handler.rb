class RepoFilesHandler
  attr_accessor :repo, :current_branch, :current_commit, :revision, :filepath

  def initialize(git_repo, params)
    @repo = git_repo
    @revision = params['revision']
    @filepath = params['filepath'] 
    set_commit(@revision, @filepath)
  end

  def insert_files(current_user, files, message = nil)
    return nil if files.nil? or files.length < 1

    index = @repo.index
    index.read_tree(@current_branch.target.tree)
    @names = []
    files.each do |f| 
      name = f.original_filename
      @names << name
      prefix = ""
      if  (f.content_type =~ /image\//) != nil
        prefix = "images/"      
      end      
      oid = @repo.write(f.read(), :blob)
      index.add(:path => prefix + name, :oid => oid, :mode => 0100644)
    end
    

    options = {}
    options[:tree]       = index.write_tree(@repo)
    options[:author]     = { :email => current_user.email, :name => current_user.username, :time => Time.now }
    options[:committer]  = { :email => current_user.email, :name => current_user.username, :time => Time.now }
    options[:message]    =  message || "Uploading Files #{@names.join(',')}"
    options[:parents]    = @repo.empty? ? [] : [ @current_commit ].compact
    options[:update_ref] = 'HEAD'

    commit_id = Rugged::Commit.create(@repo, options)
    [commit_id, @names]
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
        branches = `cd #{@repo.path}; git branch --contains #{@current_commit.oid} --format="%(refname:short)"`
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
