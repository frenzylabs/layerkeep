class SlicerEnginesController < AuthController
  skip_before_action :get_user
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
end
