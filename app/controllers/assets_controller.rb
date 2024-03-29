class AssetsController < AuthController
  respond_to :json
  respond_to :html, only: [:show]
  skip_before_action :authenticate!, only: [:show, :download]

  def new
  end

  def index  
  end

  def create    
  end

  def update    
  end



  def show
    asset = Asset.includes(:owner).find_by!(id: params[:id], user_id: @user.id)
    authorize(asset.owner)

    respond_to do |format|
      format.html { 
        fileurl = asset.file_url(response_content_disposition: "attachment; filename=\"#{asset.name}\"")
        # response.headers['X-Accel-Redirect'] =  fileurl 
        # head :ok and return
        redirect_to fileurl and return
       }
      format.json { 
        asset = AssetsSerializer.new(asset, { params: { owner: true }}).serializable_hash
        respond_with asset
      }
    end
    # respond_with(asset)
    # respond_with asset, json: asset  
  end

  def download
    # authorize(@user, :show?)
    asset = Asset.find_by!(id: params[:id], user_id: @user.id)
    authorize(asset.owner, :show?)
    fileurl = asset.file_url(response_content_disposition: "attachment; filename=\"#{asset.name}\"")
    # fileurl = asset.file_url

    $tracker.track((current_user ? current_user.id : "Anonymous"), "Download Asset file")    
    Rails.logger.info(fileurl)
    redirect_to fileurl
  end

  def destroy
    authorize(@user)
    asset = Asset.find_by!(id: params[:id], user_id: @user.id)
    throw not_found unless asset

    asset.destroy()

    if asset.valid? 
      render json: {"success": "Deleted #{asset.name}"}
    else
      render status: 400, json: {"error": slice.errors} 
    end
  end

  def presign
    request.env["REQUEST_METHOD"] = "GET"
    blob_params = params.require("blob")

    dt = DateTime.now.utc.to_date.iso8601

    owner = params[:owner] || "assets"
    owner_type = owner.camelize.singularize

    name = sanitize_filepath(params["blob"]["filename"])
    fpath = "#{dt}/#{@user.id}/#{owner}/#{name}"


    asset_params = {
      name: name,
      filepath: fpath,
      content_type: blob_params["content_type"],
      metadata: blob_params,
      owner_type: owner_type,
      file_data: {"id": fpath, storage: 'cache', metadata: blob_params}
    }

    asset_params[:owner_id] = params[:owner_id] if (params[:owner_id])

    asset = @user.assets.where(filepath: fpath).first
    if asset 
      asset.update(asset_params)
    else
      asset = @user.assets.create(asset_params)
    end


    generate_filename = ->(req) { fpath }
    set_rack_response Shrine.presign_response(:cache, request.env, presign_location: generate_filename)
  end

  def set_rack_response((status, headers, body))
    # {
    #   "signed_id":"******",
    #   "direct_upload": {
    #     "url": "https://***.s3.us-east-2.amazonaws.com/******",
    #     "headers": { ... }
    #   },
    #   ...
    # }
    self.status = status
    self.headers.merge!(headers)
    self.response_body = body
  end

  def sanitize_filepath(filepath)
    filepath.gsub(/[^0-9A-z_.\-\/]/, "")
  end
end
