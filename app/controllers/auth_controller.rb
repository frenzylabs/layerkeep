#
# auth_controller.rb
# LayerKeep
#
# Created by Wess Cope (me@wess.io) on 04/24/19
# Copyright 2018 WessCope
#

class AuthController < ApplicationController
  before_action :authenticate!
  before_action :get_user
  skip_before_action :get_user, only: :access_token

  def access_token
    app = Doorkeeper::Application.find_by(name: "Layerkeep")
    # token = Doorkeeper::AccessToken.matching_token_for(app, current_user, nil)
    expires_in = 43_000
    token = Doorkeeper::AccessToken.find_or_create_for(app, current_user.id, Doorkeeper::OAuth::Scopes.from_string(""), expires_in, false)
    
    render status: :ok, json: {token: token.token, created_at: token.created_at, expires_in: token.expires_in}
  end


  def get_user()    
    if params["user"].blank?
      @user ||= current_user
    else
      @user ||= (current_user && current_user.username == params["user"]) ? current_user : User.find_by!(username: params["user"] || "")
    end
  end

  def authenticate!
    if doorkeeper_token      
      doorkeeper_authorize!
    else
      authenticate_user!
    end
  end

  def authorize_user 
    authorize(get_user())
  end
end
