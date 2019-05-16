class RepoPolicy
  attr_reader :user, :repo

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
  end

  def index?
    !repo.is_private || (user && repo.user_id == user.id)
  end

  def show?
    !repo.is_private || (user && repo.user_id == user.id)
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
end
