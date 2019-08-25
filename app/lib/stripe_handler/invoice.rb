class StripeHandler::Invoice 
  def call(event)
    # Event handling
    Rails.logger.info("Stripe Invoice Event #{event.type}:  id: #{event.data.object.id}")
    Rails.logger.info(event.data.object.id)
    case event.type 
    when "invoice.payment_succeeded"
      Rails.logger.info("payment succeeded")
      sub_id = event["data"]["object"]["subscription"]
      user_sub = Subscription.find_by(stripe_id: sub_id)
      if user_sub
        stripe_sub = Stripe::Subscription.retrieve(sub_id)
        if stripe_sub
          user_sub.current_period_end = (stripe_sub.current_period_end + (5 * 86400))
          user_sub.failure_code = ""
          user_sub.reason = ""
          user_sub.save!
        end
      else
        Rails.logger.error("No LK Sub")
      end
    end
  end

end
