config = {
  :root => Rails.application.config.settings["repo_mount_path"],
  :git_adapter_factory => ->{ GitHttp::AuthAdapter.new }
}


GitHttpApp = GitHttp::App.new(Rails.application, config)

module GitHttp
  class Engine < Rails::Engine
    middleware.use Rack::Auth::Basic, "" do |username, password|
      user = User.find_by(username: username)
      if user && user.valid_password?(password)
        true
      else
        false
      end
    end
    endpoint GitHttpApp
  end
end