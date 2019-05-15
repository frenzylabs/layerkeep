module Admin
  class AdminPolicy 
    attr_reader :user, :repo

    class Scope
      attr_reader :user, :scope

      def initialize(user, scope)
        @user = user
        @scope = scope
      end

      def resolve
        # if user && user.id == scope.id 
        #   scope.repos
        # else
        #   scope.repos.where(is_private: false)
        # end
        scope
      end
    end



    def initialize(user, record)
      @user = user
      @repo = record
    end

    def index?
      @user.admin
    end

    def show?
      @user.admin
    end

    def create?
      @user.admin
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
      @user.admin
    end
  end 
end
