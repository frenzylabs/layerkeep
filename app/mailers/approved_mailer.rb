#
# approved_mailer.rb
# LayerKeep
#
# Created by Wess Cope (me@wess.io) on 06/19/19
# Copyright 2018 WessCope
#

class ApprovedMailer < ApplicationMailer

  def notify(user)
    @user = user
  
    mail(to: @user.email, subject: "Welcome to the LayerKeep beta!")
  end
  
end

