class StripeHandler::Subscription 
  def call(event)
    # Event handling
    Rails.logger.info("Subscription EVENT")
    Rails.logger.info(event.data.object.id)
    case event.type 
    when "customer.subscription.updated"
      Rails.logger.info("subscription updated")
      subscription = Subscription.find_by(stripe_id: event.data.object.id)
      Rails.logger.info(subscription)
    when "customer.subscription.trial_will_end"
      Rails.logger.info("subscription trial will end")
    when "customer.subscription.deleted"
      Rails.logger.info("subscription deleted")
      user = User.find_by(stripe_id: event.data.object["customer"])      
      Rails.logger.info(user)

    end
  end

end
