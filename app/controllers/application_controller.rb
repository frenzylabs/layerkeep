#
# application_controller.rb
# LayerKeep
#
# Created by Wess Cope (me@wess.io) on 04/23/19
# Copyright 2018 WessCope
#

class ApplicationController < ActionController::Base
  include Pundit
  skip_before_action :verify_authenticity_token

  layout :layout_by_resource

  before_action :configure_permitted_parameters, if: :devise_controller?

  rescue_from ActiveRecord::RecordNotFound, :with => :handle_record_not_found
  rescue_from LayerKeepErrors::LayerKeepError, :with => :layerkeep_error
  rescue_from Pundit::NotAuthorizedError, :with => :user_not_authorized


  def handle_record_not_found(exception)
    respond_to do |format|
      
      format.html { render status: 404, :file => File.join(Rails.root, 'public', '404.html') }
      format.json { render status: 404, :json => {"error": "Record Not Found"} }
    end
  end

  def layerkeep_error(exception)
    respond_to do |format|
      format.html { render status: exception.status, :file => File.join(Rails.root, 'public', '404.html') }
      format.json { render status: exception.status, :json => {"error": "#{exception.message}"} }
    end
  end

  def user_not_authorized(exception)
    logger.info(request.format)
    error_reason = exception.policy.error_reason || {}
    
    if request.format != :json
      request.format = :html
    end
    respond_to do |format|
      format.html { render status: 403, :file => File.join(Rails.root, 'public', '401.html') }
      format.json { render status: 403, :json => {"error": "Not Authorized"}.merge(error_reason) }
    end
  end

  def after_sign_in_path_for(resource)
    if session["redirect_uri"]
      "/#{current_user.username}#{session["redirect_uri"]}"
    else
      "/#{current_user.username}/projects/"
    end
  end

  def record_not_found
    raise LayerKeepErrors::NotFound.new()  
  end

  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end


  def access_denied(som) 
    logger.info("some = #{som.inspect}")
    raise LayerKeepErrors::NotFound.new()  
  end

  def paginate(items, serializer = nil, options = {})    
    serializer_name = ""
    if serializer.nil?
      serializer_name = "#{controller_name}_serializer".camelize      
    elsif serializer.is_a? String 
      serializer_name = serializer
    end

    begin
      serializer =  serializer_name.constantize
    rescue
      serializer = DefaultSerializer
    end

    options[:meta] = { total: items.total_count, last_page: items.total_pages, current_page: items.current_page }.merge(options[:meta] || {})    
    serializer.new(items, options)
  end

  def devise_current_user
    @devise_current_user ||= warden.authenticate(scope: :user)
  end
  
  def current_user
    @current_user ||= if doorkeeper_token 
              User.find(doorkeeper_token.resource_owner_id)
          else
            devise_current_user
          end
  end

  protected
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:username, :email, :password, :password_confirmation])
    devise_parameter_sanitizer.permit(:sign_in, keys: [:login, :password, :password_confirmation])
    devise_parameter_sanitizer.permit(:account_update, keys: [:username, :email, :password, :password_confirmation, :current_password])
  end

  private 
  def layout_by_resource
    if devise_controller?
      "onboarding"
    else
      "application"
    end
  end
  

  # def paginate(items, serializer = nil, options = {})    
  #   serializer_name = ""
  #   if serializer.nil?
  #     serializer_name = "#{controller_name}_serializer".camelize      
  #   elsif serializer.is_a? String 
  #     serializer_name = serializer
  #   end

  #   begin
  #     serializer =  serializer_name.constantize
  #   rescue
  #     serializer = DefaultSerializer
  #   end

  #   if options[:meta].blank? 
  #     options[:meta] = { total: items.total_count, last_page: items.total_pages, current_page: items.current_page }
  #   end
  #   serializer.new(items, options)
  # end

end
