#
# auth_controller.rb
# LayerKeep
#
# Created by Wess Cope (me@wess.io) on 04/24/19
# Copyright 2018 WessCope
#

class AuthController < ApplicationController
  before_action :authenticate_user!
  skip_before_action :authenticate_user!, only: [:stomp]
  

  def stomp
    if params["username"] == "rabbit" || params["vhost"] != "users"
      render status: :ok, json: "deny" and return
    end

    user = User.find_by(username: params["username"])
    render status: :ok, json: "deny" and return unless user

    permission = "allow"
    if params["kind"] == "user" 
      token = user.access_tokens.where(token: params["password"]).first
      if token.nil? || !token.accessible?
        permission = "deny"
      end
    else
      if params["resource"] == "exchange"
        if params["name"] != "amq.topic" || params["permission"] != "read"
          permission = "deny"
        end
      elsif params["resource"] == "topic"
        unless params["name"] == "amq.topic" && (params["routing_key"] == "LK.#" || params["routing_key"] == params["username"])
          permission = "deny"
        end
      elsif params["resource"] == "queue"
        if params["name"].match(/stomp-.*/).nil?
          permission = "deny"
        end
      end
    end
    render status: :ok, json: permission and return
  end

  def access_token
    app = Doorkeeper::Application.find_by(name: "Layerkeep")
    # token = Doorkeeper::AccessToken.matching_token_for(app, current_user, nil)
    expires_in = 43_000
    token = Doorkeeper::AccessToken.find_or_create_for(app, current_user.id, Doorkeeper::OAuth::Scopes.from_string(""), expires_in, false)
    
    render status: :ok, json: {token: token.token, created_at: token.created_at, expires_in: token.expires_in}
  end
end
