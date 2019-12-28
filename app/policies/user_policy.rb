class UserPolicy
  attr_reader :user, :other, :error_reason

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
    @other = record
    @error_reason = nil
  end

  def index?
    (user && (other.id == user.id || user.admin))
  end

  def show?
    (user && (other.id == user.id || user.admin))
  end

  def create?
    (user && (other.id == user.id || user.admin))
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

  def gcodes?
    show?
  end

  def destroy?
    (user && (other.id == user.id || user.admin))
  end
end
