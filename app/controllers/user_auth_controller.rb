#
# auth_controller.rb
# LayerKeep
#
# Created by Wess Cope (me@wess.io) on 04/24/19
# Copyright 2018 WessCope
#

class UserAuthController < ApplicationController
  before_action :get_user
  before_action :authorize_user


  def authorize_repo 
    authorize(@user)
  end

  def get_user
    @user ||= User.find_by!(username: params["user"] || "")
  end


end
