#
# auth_controller.rb
# LayerKeep
#
# Created by Wess Cope (me@wess.io) on 04/24/19
# Copyright 2018 WessCope
#

class AuthController < ApplicationController
  before_action :authenticate_user!
end
