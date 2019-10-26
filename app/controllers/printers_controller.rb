class PrintersController < AuthController
  respond_to :json

  def new
  end

  def index
    authorize(@user)
    if !request.format.json?
      request.format = :json
    end
    
    filter_params = (params[:q] && params.permit([q: [:name, :model]])[:q]) || {} 

    printers = @user.printers

    if filter_params["name"]
      printers = prints.where(name: filter_params["name"])
    elsif filter_params["model"]
      printers = prints.where(model: filter_params["model"])
    end
    

    printers = printers.page(params["page"]).per(params["per_page"])

    serializer = paginate(printers)
    respond_with(serializer)    
  end

  def create
    authorize(@user)
    Pundit.authorize(@user, Printer, :create?)
    # unless PrinterPolicy.new(@user, Printer).create?
    #   raise Pundit::NotAuthorizedError, "not allowed to create? Printer"
    # end
    printer_params = printer_post_params
    printer = @user.printers.build(printer_params)

    if printer.valid? && printer.save
      printer = PrintersSerializer.new(printer).serializable_hash
      respond_with printer, json: printer
    else
      render status: 400, json: {error: printer.errors}
    end
  end

  def update
    authorize(@user)
    printer_params = printer_post_params
    printer = @user.printers.find_by!(id: params[:id])

    printer.assign_attributes(printer_params)
    printer.save

    printer = PrintersSerializer.new(printer, { params: { prints: true }}).serializable_hash
    respond_with printer, json: printer  
  end

  def show
    authorize(@user)
    printer = @user.printers.find_by!(id: params[:id])

    printer = PrintersSerializer.new(printer, { params: { prints: true }}).serializable_hash
    respond_with printer, json: printer  
  end

  def destroy
    authorize(@user)
    printer = @user.printers.find_by!(id: params[:id])
    # prnt = Print.find_by!(id: params[:id], user_id: @user.id)
    throw not_found unless printer

    printer.destroy()

    if printer.valid? 
      render json: {"success": "Deleted #{printer.name}"}
    else
      render status: 400, json: {"error": printer.errors} 
    end
  end

  def printer_count
    authorize(@user, :show?)
    render json: {"count": @user.printers.count}
  end

  def printer_post_params
    params.require(:printer).permit(:name, :model, :uuid, :description)
  end
end
