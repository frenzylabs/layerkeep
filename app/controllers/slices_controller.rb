class SlicesController < AuthController
  respond_to :json

  def new
  end

  def index
    authorize(@user)
    if !request.format.json?
      request.format = :json
    end
    slices = Slice.where(user_id: @user.id)    
    filter_params = (params[:q] && params.permit([q: [:name, :project_id, :profile_id, :repo_filepath]])[:q]) || {} 

    if !filter_params["name"].blank?
      slices = slices.where("name ILIKE ?", "%#{filter_params["name"]}%")      
    end
    if filter_params["project_id"] || filter_params["profile_id"]
      repos = [filter_params["project_id"], filter_params["profile_id"]].compact      
      slices = slices.joins(:files).where("slice_files.repo_id IN (?)", repos).group("slices.id").having("COUNT(slice_files.id) = #{repos.count}") # =>  filter_params["project_id"])
      slices = slices.where(slice_files: {filepath: filter_params["repo_filepath"]}) if (filter_params["repo_filepath"]) 
    end

    # if filter_params["project_id"]
    #   slices = slices.joins(:project_files).where(slice_files: {repo_id: filter_params["repo_id"]})
    #   slices = slices.where(slice_files: {filepath: filter_params["repo_filepath"]}) if (filter_params["repo_filepath"]) 
    # end
    # if params["repo_id"] 
    #   slices = slices.joins(:project_files).where(slice_files: {repo_id: params["repo_id"]})
    #   slices = slices.where(slice_files: {filepath: params["repo_filepath"]}) if (params["repo_filepath"]) 
    # end

    slices = slices.includes(:slicer_engine).includes(:files)
              .order("slices.updated_at desc")
              .page(params["page"]).per(params["per_page"])
    # slices = slices.includes(:project_files, :profile_files, :slicer_engine)
    #           .order("slices.id desc")
    #           .page(params["page"]).per(params["per_page"])
    
    serializer = paginate(slices, "SlicesSerializer", {params: { files: true }})
    respond_with(serializer)
  end

  # {
  #   slices: {
  #     gcode: {file: filepath},
  #     projects: [],
  #     profiles: []
  #   }
  # }

  def create
    authorize(@user)
    slice_params = params.require("slice")
    
    gcode_path = slice_params.require("gcode").require("file")
    
    asset = @user.assets.where(filepath: gcode_path).first

    dt = DateTime.now.utc.to_i
    namearr = asset.name.split(".")
    sindex = namearr.count > 1 ? -1 : 1
    npath = namearr[0...sindex].join("")
    filepath = "users/#{@user.id}/gcodes/#{npath}-#{dt}/#{asset.name}"

    slice_attrs = {
      name: asset.name,
      path: filepath,
      status: "success",
      metadata: asset.metadata,
      gcode_data: asset.file_data,
      description: slice_params["description"] || ""
    }

    projects = slice_files(slice_params["projects"] || [], "projects")
    profiles = slice_files(slice_params["profiles"] || [], "profiles")
    slice_files = projects + profiles

    slice_attrs[:files_attributes] = slice_files if slice_files.length > 0
        
    slice = @user.slices.new()
    slice.attributes = slice_attrs
    slice.gcode_attacher.set(asset.file)


    Slice.transaction do
      slice.save

      Rails.logger.info(slice)
      if slice.valid?
        asset.destroy

        slice = SlicesSerializer.new(slice, { params: { files: true }}).serializable_hash
        render json: slice
      else
        render status: 400, json: { error: slice.errors }
      end
    end
  end

  def update
    authorize(@user)
    slice = Slice.includes(:files).find_by!(id: params[:id], user_id: @user.id)

    slice_params = params.require("slice")
    
    slice_attrs = {}

    gcode_path = slice_params.dig(:gcode, :file)
    if gcode_path    
      asset = @user.assets.where(filepath: gcode_path).first

      dt = DateTime.now.utc.to_i
      namearr = asset.name.split(".")
      sindex = namearr.count > 1 ? -1 : 1
      npath = namearr[0...sindex].join("")
      filepath = "users/#{@user.id}/gcodes/#{npath}-#{dt}/#{asset.name}"

      slice_attrs = slice_attrs.merge({
        name: asset.name,
        path: filepath,
        status: "success",
        metadata: asset.metadata,
        description: slice_params["description"] || slice.description
      })

      slice.gcode_attacher.set(asset.file)
    end


    # [{"id"=>"130", "repoId"=>"2", "commit"=>"46e486a7bb555c872c6b96e75f16785cb2d69cd9", "filepath"=>"fdmextruder.def.json"}]
    projects = slice_files(slice_params["projects"] || [], "projects")
    profiles = slice_files(slice_params["profiles"] || [], "profiles")
    slice_files = projects + profiles

    slice_attrs[:files_attributes] = slice_files if slice_files.length > 0
    slice.attributes = slice_attrs

    if slice.save
      asset.destroy if asset

      slice = SlicesSerializer.new(slice, {params: { files: true }}).serializable_hash
      respond_with slice, json: slice  
    else
      render status: 400, json: { error: slice.errors }
    end
  end


  def generate
    slicer_engine = SlicerEngine.find(params["engine_id"])
    
    project_params = params.require("projects")
    projects = slice_files(project_params, "projects")
    throw record_not_found and return if projects.empty?
    profiles = slice_files(params["profiles"] || [], "profiles")
    slice_files = projects + profiles
    
    slice_name = ""
    projects.reduce(slice_name) do |name, pf| 
      name << (pf[:filepath].gsub(/[\/\.]/, "_") + "-" + pf[:commit][0...6] + "-").downcase;
    end
    slice_name << "#{Time.now.utc.to_i}.gcode"


    slice_attrs = {
      name: slice_name,
      path: "",
      slicer_engine_id: slicer_engine.id
    }

    slice_attrs[:files_attributes] = slice_files if slice_files.length > 0
        
    slice = @user.slices.new()
    slice.attributes = slice_attrs

    begin
      Slice.transaction do
        slice.save!
      end

      if slice.valid?
        slice_params = {
          user_id: @user.id,
          slice_id: slice.id,
          name: slice_name,
          path: slice_name,
          status: "waiting",
          projects: projects,
          profiles: profiles
        }

        res = Publisher.publish_header(slice_params.to_json, "slice.new", {"service": "slicer", "slicer": slicer_engine.name.downcase, "slicer-version": slicer_engine.version})
        puts "Publish Slice Res = #{res.inspect}"
        $tracker.track(current_user.id, "Slice Generated", {user_id: @user.id})
        render json: slice
      else
        Rails.logger.info("Slice Invalid: #{slice.errors}")
        render status: 400, json: { error: slice.errors }
      end
    rescue => e
      Rails.logger.error("ERror with slicing #{e}")
      render status: 400, json: {error: "#{e}"}
    end
  end

  def show
    authorize(@user)
    slice = Slice.includes([files: [:repo]]).find_by!(id: params[:id], user_id: @user.id)
    
    slice = SlicesSerializer.new(slice, {params: { files: true }}).serializable_hash
    respond_with(slice)
  end

  def destroy
    authorize(@user)
    slice = Slice.find_by!(id: params[:id], user_id: @user.id)
    throw not_found unless slice

    slice.destroy()

    if slice.valid? 
      render json: {"success": "Deleted #{slice.name}"}
    else
      render status: 400, json: {"error": slice.errors} 
    end
  end

  def gcodes 
    authorize(@user)
    @slice = Slice.find_by!(id: params[:id], user_id: @user.id)

    if params[:logpath]
      fileurl = @slice.log_url(response_content_disposition: "attachment; filename=\"#{@slice.name}.log\"")
      $tracker.track(current_user.id, "Download Gcodes Logfile")
    else
      fileurl = @slice.gcode_url(response_content_disposition: "attachment; filename=\"#{@slice.name}\"")
      $tracker.track(current_user.id, "Download Gcodes")
    end
    redirect_to fileurl
  end

  def slice_files(file_params, kind)
    file_params.reduce([]) do | acc, file_attr|
      return acc if file_attr.empty?
      repo = @user.repos.where(kind: kind, id: file_attr.fetch("repo_id", "")).first!
      git_repo = Rugged::Repository.init_at("#{Rails.application.config.settings["repo_mount_path"]}/#{repo.path}/.", :bare)

      revision = file_attr["revision"] || "master"
      commit = git_repo.rev_parse_oid(revision) || git_repo.rev_parse_oid("master")

      sfattrs = {
        repo_id: repo.id,
        repo_path: repo.path,
        commit: commit, 
        kind: (kind == "profiles" ? "profile" : "project"),
        filepath: sanitize_filepath(file_attr["filepath"] || "")
      }

      
      sfattrs[:id] = file_attr["id"] if file_attr["id"]
      sfattrs[:_destroy] = '1' if file_attr["deleted"] == true
      acc << sfattrs
    end
  end

  def sanitize_filepath(filepath)
    filepath.gsub(/[^0-9A-z_.\-\/]/, "")
  end
end
