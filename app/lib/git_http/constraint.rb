class GitHttp::Constraint
  def initialize
  end
 
  def matches?(request)
    path_info = Rack::Utils.unescape(request.path_info).gsub(%r{/+}, '/')
    Grack::App::ROUTES.each do |path_matcher, verb, handler|
      path_info.match(path_matcher) do |match|
        return false unless verb == request.request_method
        return true
      end
    end
    false
  end
end