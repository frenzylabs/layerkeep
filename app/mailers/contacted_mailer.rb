#
# approved_mailer.rb
# LayerKeep
#
# Created by Wess Cope (me@wess.io) on 06/19/19
# Copyright 2018 WessCope
#

class ContactedMailer < ApplicationMailer

  def notify(contact)
    @contact = contact
  
    mail(to: "contact@layerkeep.com", reply: contact.email, subject: "Web Contact Form: #{contact.subject}")
  end
  
end

