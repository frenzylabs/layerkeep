class SlicesController < AuthController
  before_action :get_user
  respond_to :json

  def new
  end

  def index
    authorize(@user)
    if !request.format.json?
      request.format = :json
    end
    slices = Slice.where(user_id: @user.id)
    if params["repo_id"] 
      slices = slices.joins(:project_files).where(slice_files: {repo_id: params["repo_id"]})
      slices = slices.where(slice_files: {filepath: params["repo_filepath"]}) if (params["repo_filepath"]) 
    end

    slices = slices.includes(:project_files, :profile_files)
              .order("slices.id desc")
              .page(params["page"]).per(params["per_page"])
    
    serializer = paginate(slices)
    respond_with(serializer)
  end

  def create
    slicer_engine = SlicerEngine.find(params["engine_id"])
    
    project_params = params.require("projects")
    projects = slice_files(project_params, "projects")
    throw record_not_found and return if projects.empty?
    profiles = slice_files(params["profiles"] || [], "profiles")
    
    slice_name = ""
    projects.reduce(slice_name) do |name, pf| 
      name << (pf[:filepath].gsub(/[\/\.]/, "_") + "-" + pf[:commit][0...6] + "-").downcase;
    end
    slice_name << "#{Time.now.utc.to_i}.gcode"
    slices_path = "#{current_user.username}/slices/#{slice_name}"

    slice = Slice.new({name: slice_name, path: slices_path, user_id: current_user.id, slicer_engine_id: slicer_engine.id}) 
    begin
      Slice.transaction do
        slice.save!
        slice.project_files.build(projects)
        slice.profile_files.build(profiles)
        if slice.valid?
          slice.save!
        end
      end

      if slice.valid?
        slice_params = {
          slice_id: slice.id,
          name: slice_name,
          path: slices_path,
          status: "waiting",
          projects: projects,
          profiles: profiles
        }

        res = Publisher.publish_header(slice_params.to_json, "slice.new", {"service": "slicer", "slicer": slicer_engine.name.downcase, "slicer-version": slicer_engine.version})
        puts "Publish Slice Res = #{res.inspect}"
        $tracker.track(current_user.id, "Slice Created")
        render json: slice
      else
        Rails.logger.info("Slice Invalid: #{slice.errors}")
        render json: slice.errors
      end
    rescue => e
      Rails.logger.info("ERror with slicing #{e}")

    end
  end

  def show
    authorize(@user)
    slice = Slice.find_by!(id: params[:id], user_id: @user.id)
    
    slice = SlicesSerializer.new(slice).serializable_hash
    respond_with(slice)
  end

  def destroy
    authorize(@user)
    slice = Slice.find_by!(id: params[:id], user_id: @user.id)
    throw not_found unless slice
    
    if !(slice.path.nil? || slice.path.blank?)
      mount_path = Rails.application.config.settings["repo_mount_path"]
      file_path = File.expand_path("#{mount_path}/#{slice.path}")
      File.delete(file_path) if File.exist?(file_path)
    end
    res = slice.destroy()
    Rails.logger.info("slice destroy = #{res.inspect}")
    render json: {"success": res}
    
  end

  def gcodes 
    authorize(@user)
    @slice = Slice.find(params[:id])

    if params[:logpath]
      filepath = @slice.log_path
      $tracker.track(current_user.id, "Download Gcodes Logfile")
    else
      filepath = @slice.path
      $tracker.track(current_user.id, "Download Gcodes")
    end

    send_file("#{Rails.application.config.settings["repo_mount_path"]}/" + filepath.downcase, filename: filepath.split("/").last, disposition: :inline)
  end

  def slice_files(file_params, kind)
    file_params.reduce([]) do | acc, file_attr|
      return acc if file_attr.empty?
      repo = @user.repos.where(kind: kind, id: file_attr.fetch("id", "")).first!
      git_repo = Rugged::Repository.init_at("#{Rails.application.config.settings["repo_mount_path"]}/#{repo.path}/.", :bare)

      revision = file_attr["revision"] || "master"
      commit = git_repo.rev_parse_oid(revision) || git_repo.rev_parse_oid("master")

      acc << {
        repo_id: repo.id,
        repo_path: repo.path,
        commit: commit, 
        filepath: sanitize_filepath(file_attr["filepath"] || "")
      }
    end
  end

  def sanitize_filepath(filepath)
    filepath.gsub(/[^0-9A-z.\-\/]/, "")
  end  

  def get_user()
    @user ||= User.find_by!(username: params["user"] || "")
  end
end
