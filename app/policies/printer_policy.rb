class PrinterPolicy
  attr_reader :user, :repo, :error_reason

  # class Scope
  #   attr_reader :user, :scope

  #   def initialize(user, scope)
  #     @user = user
  #     @scope = scope
  #   end

  #   def resolve
  #     if user && (user.id == scope.id || user.admin)
  #       scope.repos
  #     else
  #       scope.repos.where(is_private: false)
  #     end
  #   end
  # end



  def initialize(user, record)
    @user = user
    @printer = record
    @error_reason = nil
  end

  def can_create_printer
    print_features = user.subscription_handler.features["print"]
    if print_features
      if print_features["printers"] == "unlimited"
        true
      else
        numPrinters = @user.printers.count
        if print_features["printers"].to_i > numPrinters
          true
        else
          Rails.logger.info("Max Printer Count Reached")
          @error_reason = {max_count_reached: 'You have reach your allowed printer count'}      
          false
        end    
      end
    else
      Rails.logger.info("No Print Features Enabled")
      @error_reason = {feature_disabled: 'Print Disabled'}      
      false
    end
  end

  def index?
    !repo.is_private || (user && repo.user_id == user.id)
  end

  def show?
    !repo.is_private || (user && repo.user_id == user.id && private_repo_enabled)
  end

  def create?
    can_create_printer
  end

  def new?
    create?
  end

  def update?
    create?
  end

  def edit?
    update?
  end

  def destroy?
    user && repo.user_id == user.id
  end

  

  def permitted_attributes_for_update
    if repo.user.subscription_handler.features["project"]["private_repos"]
      [:description, :is_private]
    else
      [:description]
    end
  end

  def permitted_attributes_for_create
    features = repo.user.subscription_handler.features
    if features && features["project"] && features["project"]["private_repos"]
      repo_create_attributes + [:is_private]
    else
      repo_create_attributes
    end
  end

  private 
  def repo_create_attributes
    [:name, :description]
  end
  
end
