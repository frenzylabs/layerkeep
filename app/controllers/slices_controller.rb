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
    project_params = params.require("projects")
    projects = slice_files(project_params, "projects")
    profiles = slice_files(params["profiles"] || [], "profiles")
    
    slice_name = ""
    projects.reduce(slice_name) do |name, pf| 
      name << (pf[:filepath].gsub(/[\/\.]/, "_") + "-" + pf[:commit][0...6] + "-");
    end
    slice_name << "#{Time.now.utc.to_i}.gcode"
    slices_path = "#{current_user.username}/slices/#{slice_name}"


    slice = Slice.new({name: slice_name, path: slices_path, user_id: current_user.id}) 
    begin
      Slice.transaction do
        slice.save!
        slice.project_files.build(projects)
        slice.profile_files.build(profiles)
        if slice.valid?
          slice.save!

          slice_params = {
            slice_id: slice.id,
            name: slice_name,
            path: slices_path,
            status: "waiting",
            projects: projects,
            profiles: profiles
          }
          res = Publisher.publish_header(slice_params.to_json, "slice.new", {"service": "slicer", "slicer": "slic3r", "slicer-version": "1.3.0"})
          puts "Publish Res = #{res.inspect}"
          render json: slice
        else
          Rails.logger.info("Slice Invalid: #{slice.errors}")
          render json: slice.errors
        end
      end
    rescue 

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
    send_file("#{Rails.application.config.settings["repo_mount_path"]}/" + @slice.path.downcase, filename: @slice.path.split("/").last, disposition: :inline)
  end

  def slice_files(file_params, kind)
    file_params.reduce([]) do | acc, file_attr|
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
