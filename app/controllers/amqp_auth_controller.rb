#
# amqp_auth_controller.rb
# LayerKeep
#
# Created by Kevin Musselman (kevin@frenzylabs.com) on 08/03/19
# Copyright 2018 Frenzylabs
#

class AmqpAuthController < ApplicationController

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
end
