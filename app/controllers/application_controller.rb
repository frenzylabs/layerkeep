#
# application_controller.rb
# LayerKeep
#
# Created by Wess Cope (me@wess.io) on 04/23/19
# Copyright 2018 WessCope
#

class ApplicationController < ActionController::Base
  skip_before_action :verify_authenticity_token

  layout :layout_by_resource

  before_action :configure_permitted_parameters, if: :devise_controller?

  rescue_from ActiveRecord::RecordNotFound, :with => :record_not_found

  def record_not_found(exception)
    respond_to do |format|
      format.html { render status: 404, :file => File.join(Rails.root, 'public', '404.html') }
      format.json { render status: 404, :json => {"error": "#{exception.message}"} }
    end
  end

  def after_sign_in_path_for(resource)
    "/user/"
  end

  def not_found
    raise ActionController::RoutingError.new('Not Found')
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
