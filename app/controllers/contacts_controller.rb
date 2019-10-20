#
# main_controller.rb
# LayerKeep
#
# Created by Wess Cope (me@wess.io) on 04/23/19
# Copyright 2018 WessCope
#

class ContactsController < ApplicationController
  def index
  end

  def create
    
    #   binding.pry
    # # 
    contact_params = permitted_params
    contact_params["user_id"] = current_user.id if current_user
    contact = Contact.create(contact_params)
    if contact.valid?
      begin
        ContactedMailer.notify(contact).deliver
      rescue => e
        Rails.logger.error("Could Not Send Email")
      end
      render status: 200, json: {"success": "Message Sent"}
    else
      render status: 400, json: {"errors": contact.errors}
    end

    
  end

  def permitted_params
    params.require("contact").permit("first_name", "last_name", "subject", "email", "message")
  end
end
