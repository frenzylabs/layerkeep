class SlicePolicy
  attr_reader :user, :record, :error_reason

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      if user && (user.id == scope.id || user.admin)
        scope.slices
      else
        scope.slices.where(is_private: false)
      end
    end
  end



  def initialize(user, record)
    @user = user
    @record = record
    @error_reason = nil
  end
  def private_repo_enabled
    if record.user.subscription_handler.features["project"]["private_repos"] 
      true
    else
      Rails.logger.info("Private Slices are not enabled")
      @error_reason = {feature_disabled: 'Private Slices'}
      false
    end
  end

  def index?
    !record.is_private || (user && record.user_id == user.id)
  end

  def show?
    !record.is_private || (user && record.user_id == user.id && private_repo_enabled)
  end

  def create?
    user && record.user_id == user.id
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
    user && record.user_id == user.id
  end

  def upload?
    create?
  end

  def gcodes?
    show?
  end

  def clear_uploads?
    create?
  end
  

  def permitted_attributes_for_update
    if record.user.subscription_handler.features["project"]["private_repos"]
      [:description, :is_private]
    else
      [:description]
    end
  end

  def permitted_attributes_for_create
    features = record.user.subscription_handler.features
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
