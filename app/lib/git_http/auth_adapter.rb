
class GitHttp::AuthAdapter < Grack::GitAdapter

  attr_reader :repo, :repo_path, :user

  def user=(user)
    @user = user
  end

  def repo_path=(path)
    @repo_path = path
  end

  def repo
    @repo ||= Repo.find_by(path: @repo_path)
  end

  def allow_push?
    return @repo && (@repo.user_id == @user.id || @user.admin)
  end

  ##
  # Determines whether or not fetches/pulls from the requested repository are
  # allowed.
  #
  # @return [Boolean] +true+ if fetches are allowed, +false+ otherwise.
  def allow_pull?
    return @repo && (@repo.user_id == @user.id || !@repo.is_private || @user.admin)
  end

end
