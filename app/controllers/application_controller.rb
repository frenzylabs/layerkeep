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
      format.json { render status: 404, :json => {"error": "#{exception.message}"} }
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
    if request.format != :json
      request.format = :html
    end
    respond_to do |format|
      format.html { render status: 401, :file => File.join(Rails.root, 'public', '401.html') }
      format.json { render status: 401, :json => {"error": "Not Authorized"} }
    end
  end

  def after_sign_in_path_for(resource)
    "/#{current_user.username}/projects/"
  end

  def record_not_found
    raise LayerKeepErrors::NotFound.new()  
  end

  def not_found
    raise ActionController::RoutingError.new('Not Found')
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

    if options[:meta].blank? 
      options[:meta] = { total: items.total_count, last_page: items.total_pages, current_page: items.current_page }
    end
    serializer.new(items, options)
  end
  

  protected
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:username, :email, :password, :password_confirmation])
    devise_parameter_sanitizer.permit(:sign_in, keys: [:login, :password, :password_confirmation])
    devise_parameter_sanitizer.permit(:account_update, keys: [:username, :email, :password, :password_confirmation, :current_password])
  end

  private 
  def layout_by_resource
    if user_signed_in?
      "application"
    elsif devise_controller?
      "onboarding"
    else
      "landing"
    end
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

    if options[:meta].blank? 
      options[:meta] = { total: items.total_count, last_page: items.total_pages, current_page: items.current_page }
    end
    serializer.new(items, options)
  end

end
