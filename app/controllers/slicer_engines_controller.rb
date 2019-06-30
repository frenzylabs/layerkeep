class SlicerEnginesController < AuthController
  # before_action :get_user
  respond_to :json

  def new
  end

  def index
    if !request.format.json?
      request.format = :json
    end
    engines = SlicerEngine.where(active: true)
              .order("name desc")
              .page(params["page"]).per(params["per_page"])
    
    serializer = paginate(engines)
    respond_with(serializer)
  end

  # def create
  #   project_params = params.require("projects")
  #   projects = slice_files(project_params, "projects")
  #   throw record_not_found and return if projects.empty?
  #   profiles = slice_files(params["profiles"] || [], "profiles")
    
  #   slice_name = ""
  #   projects.reduce(slice_name) do |name, pf| 
  #     name << (pf[:filepath].gsub(/[\/\.]/, "_") + "-" + pf[:commit][0...6] + "-").downcase;
  #   end
  #   slice_name << "#{Time.now.utc.to_i}.gcode"
  #   slices_path = "#{current_user.username}/slices/#{slice_name}"


  #   slice = Slice.new({name: slice_name, path: slices_path, user_id: current_user.id}) 
  #   begin
  #     Slice.transaction do
  #       slice.save!
  #       slice.project_files.build(projects)
  #       slice.profile_files.build(profiles)
  #       if slice.valid?
  #         slice.save!
  #       end
  #     end

  #     if slice.valid?
  #       slice_params = {
  #         slice_id: slice.id,
  #         name: slice_name,
  #         path: slices_path,
  #         status: "waiting",
  #         projects: projects,
  #         profiles: profiles
  #       }
  #       res = Publisher.publish_header(slice_params.to_json, "slice.new", {"service": "slicer", "slicer": "slic3r", "slicer-version": "1.3.0"})
  #       puts "Publish Slice Res = #{res.inspect}"
  #       $tracker.track(current_user.id, "Slice Created")
  #       render json: slice
  #     else
  #       Rails.logger.info("Slice Invalid: #{slice.errors}")
  #       render json: slice.errors
  #     end
  #   rescue 

  #   end
  # end

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


  def sanitize_filepath(filepath)
    filepath.gsub(/[^0-9A-z.\-\/]/, "")
  end  

  def get_user()
    @user ||= User.find_by!(username: params["user"] || "")
  end
end
