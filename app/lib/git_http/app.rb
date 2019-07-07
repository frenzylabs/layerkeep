require 'pathname'
require 'rack/request'
require 'rack/response'
require 'time'
require 'zlib'

require 'grack/app'

##
# A namespace for all Grack functionality.
module GitHttp
  ##
  # A Rack application for serving Git repositories over HTTP.
  class App < Grack::App

    ##
    # Creates a new instance of this application with the configuration provided
    # by _opts_.
    #
    # @param [Hash] opts a hash of supported options.
    # @option opts [String] :root (Dir.pwd) a directory path containing 1 or
    #   more Git repositories.
    # @option opts [#call] :git_adapter_factory (->{ GitAdapter.new }) a
    #   call-able object that creates Git adapter instances per request.
    def initialize(app, opts = {})
      @app                 = app
      @root                = Pathname.new(opts.fetch(:root, '.')).expand_path
      @git_adapter_factory =
        opts.fetch(:git_adapter_factory, ->{ GitHttp::AuthAdapter.new })
    end

    ##
    # The Rack handler entry point for this application.  This duplicates the
    # object and uses the duplicate to perform the work in order to enable
    # thread safe request handling.
    #
    # @param [Hash] env a Rack request hash.
    #
    # @return a Rack response object.
    def call(env)
      dup._call(env)
    end

    protected

    ##
    # The real request handler.
    #
    # @param [Hash] env a Rack request hash.
    #
    # @return a Rack response object.
    def _call(env)
      @git = @git_adapter_factory.call
      @env = env
      @git.user = User.find_by(username: env['REMOTE_USER'])
      @request = Rack::Request.new(env)
      route
    end

    ##
    # @return [Boolean] +true+ if the request is authorized; otherwise, +false+.
    def authorized?
      return git.allow_pull? if need_read?
      return git.allow_push?
    end

    ##
    # Routes requests to appropriate handlers.  Performs request path cleanup
    # and several sanity checks prior to attempting to handle the request.
    #
    # @return a Rack response object.
    def route
      # Sanitize the URI:
      # * Unescape escaped characters
      # * Replace runs of / with a single /
      path_info = Rack::Utils.unescape(request.path_info).gsub(%r{/+}, '/')

      ROUTES.each do |path_matcher, verb, handler|
        path_info.match(path_matcher) do |match|
          @repository_uri = match[1].downcase
          @request_verb = verb

          return method_not_allowed unless verb == request.request_method
          return bad_request if bad_uri?(@repository_uri)

          git.repo_path       = @repository_uri[0] == "/" ? @repository_uri[1..-1] : @repository_uri
          git.repository_path = root + @repository_uri
          return not_found unless git.exist? && git.repo

          return send(handler, *match[2..-1])
        end
      end
      not_found
    end

    ##
    # Processes pack file exchange requests for both push and pull.  Ensures
    # that the request is allowed and properly formatted.
    #
    # @param [String] pack_type the type of pack exchange to perform per the
    #   request.
    #
    # @return a Rack response object.
    def handle_pack(pack_type)
      $tracker.track(git.user.id, "Git", {pack_type: pack_type})
      super(pack_type)
    end
  end
end
