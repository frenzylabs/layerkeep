#
# auth_controller.rb
# LayerKeep
#
# Created by Wess Cope (me@wess.io) on 04/24/19
# Copyright 2018 WessCope
#

class OauthTokensController < Doorkeeper::TokensController
  def create
    app = Doorkeeper::Application.find_by(name: params[:app])
    request.params["client_id"] = app.uid
    request.params["client_secret"] = app.secret
    super
  end
end
