#
# approved_mailer.rb
# LayerKeep
#
# Created by Wess Cope (me@wess.io) on 06/19/19
# Copyright 2018 WessCope
#

class UserMailer < ApplicationMailer

  def new_user(user)
    @user = user
  
    mail(to: "contact@layerkeep.com", subject: "New User #{user.username}")
  end
  
end

