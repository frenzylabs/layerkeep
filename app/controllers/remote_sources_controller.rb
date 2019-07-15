class RemoteSourcesController < AuthController
  respond_to :json

  def new
  end

  def index
    if !request.format.json?
      request.format = :json
    end
    remote_sources = RemoteSource.where(active: true)
              .order("name desc")
              .page(params["page"]).per(params["per_page"])
    
    serializer = paginate(remote_sources)
    respond_with(serializer)
  end
end
