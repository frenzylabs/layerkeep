class PrintersController < AuthController
  respond_to :json
  skip_before_action :authenticate!, only: [:show, :index]

  def new
  end

  def index
    respond_to do |format|
      format.html {}
      format.json {
        # authorize(@user)
        # if !request.format.json?
        #   request.format = :json
        # end
        
        filter_params = (params[:q] && params.permit([q: [:name, :model]])[:q]) || {} 

        printers = policy_scope(@user, policy_scope_class: PrinterPolicy::Scope)

        if filter_params["name"]
          printers = prints.where(name: filter_params["name"])
        elsif filter_params["model"]
          printers = prints.where(model: filter_params["model"])
        end
        

        printers = printers.page(params["page"]).per(params["per_page"])

        meta = {canView: true}
        if current_user
          policy = UserPolicy.new(current_user, @user)
          meta[:canManage] = policy.create?
        end

        serializer = paginate(printers, nil, {meta: meta})
        respond_with(serializer)    
      }
    end
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
    # authorize(@user)
    @printer = @user.printers.find_by!(id: params[:id])
    authorize(@printer)
    respond_to do |format|
      format.html {}
      format.json {
        @printerhash = PrintersSerializer.new(@printer, { params: { prints: true, current_user: current_user }}).serializable_hash
        respond_with @printerhash #, json: printer  
      }
    end
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
