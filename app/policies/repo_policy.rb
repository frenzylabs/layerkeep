class RepoPolicy
  attr_reader :user, :repo, :error_reason

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      if user && (user.id == scope.id || user.admin)
        scope.repos
      else
        scope.repos.where(is_private: false)
      end
    end
  end



  def initialize(user, record)
    @user = user
    @repo = record
    @error_reason = nil
  end

  def private_repo_enabled
    if repo.user.subscription_handler.features["project"]["private_repos"] 
      true
    else
      Rails.logger.info("Private repos not enabled")
      @error_reason = {feature_disabled: 'Private Repos'}      
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
    user && repo.user_id == user.id
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
    if repo.user.subscription_handler.features["project"]["private_repos"]
      [:name, :description, :is_private]
    else
      [:name, :description]
    end
  end
end
