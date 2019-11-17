class PrintsController < AuthController
  respond_to :json

  def new
  end

  def index
    authorize(@user)
    if !request.format.json?
      request.format = :json
    end
    
    filter_params = (params[:q] && params.permit([q: [:printer_id, :slice_id, :project_id, :profile_id]])[:q]) || {} 

    prints = @user.prints

    prints = prints.where(printer_id: filter_params["printer_id"]) if filter_params["printer_id"]

    if filter_params["slice_id"]
      prints = prints.where(slice_id: filter_params["slice_id"])
    elsif filter_params["project_id"] || filter_params["profile_id"]
      repos = [filter_params["project_id"], filter_params["profile_id"]].compact      
      prints = prints.joins(slices: :files).where("slice_files.repo_id IN (?)", repos).group("prints.id, slices.id").having("COUNT(slice_files.id) = #{repos.count}") 
    end

    prints = prints.page(params["page"]).per(params["per_page"]).order("prints.job desc") 

    serializer = paginate(prints)
    respond_with(serializer)    
  end

  def create
    authorize(@user)
    print_params = print_post_params

    prnt = @user.prints.build(print_params)
    job = (@user.prints.maximum("job") || 0) + 1
    prnt.job = job
    if (print_params[:slice_id])
      slice = Slice.find_by!(id: print_params[:slice_id], user_id: @user.id)
      prnt.slice_id = slice.id
    end
    if (print_params[:printer_id])
      printer = Printer.find_by!(id: print_params[:printer_id], user_id: @user.id)
      prnt.printer_id = printer.id
    end

    if prnt.valid? && prnt.save
      handle_print_files(prnt, print_files[:files] || [])
      prnt = PrintsSerializer.new(prnt).serializable_hash
      respond_with prnt, json: prnt
    else
      render status: 400, json: {error: prnt.errors}
    end
  end

  def update
    authorize(@user)
    print_params = print_post_params

    prnt = @user.prints.find_by!(id: params[:id])
    # prnt = Print.find(params[:id])
    if (print_params[:printer_id])
      printer = Printer.find_by!(id: print_params[:printer_id], user_id: @user.id)
      prnt.printer_id = printer.id
    end

    if (print_params[:slice_id])
      slice = Slice.find_by!(id: print_params[:slice_id], user_id: @user.id)
      prnt.slice_id = slice.id
    end
    
    prnt.assign_attributes(print_params)
    prnt.save
    handle_print_files(prnt, print_files[:files] || [])

    
    prnt = PrintsSerializer.new(prnt, { params: { printer: true, assets: true }}).serializable_hash
    respond_with prnt, json: prnt  
    # respond_with(prnt)
  end

  def show
    authorize(@user)
    prnt = @user.prints.find_by!(id: params[:id])
    # prnt = Print.find_by!(id: params[:id], user_id: @user.id)
    
    prnt = PrintsSerializer.new(prnt, { params: { printer: true, assets: true, slice_details: true }}).serializable_hash
    respond_with(prnt)
  end

  def destroy
    authorize(@user)
    prnt = @user.prints.find_by!(id: params[:id])
    # prnt = Print.find_by!(id: params[:id], user_id: @user.id)
    throw not_found unless prnt

    prnt.destroy()

    if prnt.valid? 
      render json: {"success": "Deleted #{prnt.name}"}
    else
      render status: 400, json: {"error": prnt.errors} 
    end
  end

  def handle_print_files(prnt, files)
    files.each do |f| 
      asset = @user.assets.where(filepath: f, owner_type: "Print").last
      if asset 
        filepath = "users/#{@user.id}/prints/#{prnt.id}/#{asset.name}"
        af = asset.file
        begin
          asset.file_attacher._promote(location: filepath)
          asset.file_attacher.cache.delete(af)
          asset.owner_id = prnt.id
          asset.save
        rescue Exception => e
          Rails.logger.error("Could Not Save Print asset #{prnt.id}, #{f}")
        end
      end
    end
  end

  # def presign
  #   Rails.logger.info(params)
  #   prnt = Print.find(params[:id])
  #   request.env["REQUEST_METHOD"] = "GET"
  #   blob_params = params.require("blob")

  #   fname = "#{@user.id}/prints/#{params[:id]}/#{params["blob"]["filename"]}"

  #   # t.string      :name,  null: false
  #   # t.string      :filepath,  null: false
  #   # t.string      :bucket,    null: false
  #   # t.string      :content_type
  #   # t.string      :kind
  #   # t.jsonb       :file_data,         default: '{}'
  #   # t.references  :user,      index: true, foreign_key: true
  #   # t.references  :print,      index: true, foreign_key: true
  #   # {"blob"=>{"filename"=>"3DBenchy_-_Dualprint_-_Hull_Box_Bridge_walls_Rod-holder_Chimney_-_3DBenchy.com_preview_featured.jpg", "content_type"=>"image/jpeg", "byte_size"=>44901, "checksum"=>"kFxRENWDJCKMmRPwSRsdsw=="}
  #   asset_params = {
  #     name: blob_params["filename"],
  #     filepath: fname,
  #     bucket: "layerkeep",
  #     content_type: blob_params["content_type"],
  #     metadata: blob_params,
  #     file_data: {"id": fname, storage: 'cache', metadata: blob_params}

  #   }
  #   prnt.assets.create(asset_params)

  #   generate_filename = ->(req) { "#{@user.id}/prints/#{params[:id]}/#{params["blob"]["filename"]}" }
  #   set_rack_response Shrine.presign_response(:cache, request.env, presign_location: generate_filename)
  # end

  # def set_rack_response((status, headers, body))
  #   # {
  #   #   "signed_id":"******",
  #   #   "direct_upload": {
  #   #     "url": "https://***.s3.us-east-2.amazonaws.com/******",
  #   #     "headers": { ... }
  #   #   },
  #   #   ...
  #   # }
  #   self.status = status
  #   self.headers.merge!(headers)
  #   self.response_body = body
  # end

  def print_post_params
    params.require(:print).permit(:name, :description, :printer_id, :slice_id)
  end

  def print_files
    params.require(:print).permit(files: [])
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
end
