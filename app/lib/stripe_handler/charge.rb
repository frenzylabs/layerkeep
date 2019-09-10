class StripeHandler::Charge 
  def call(event)
    # Event handling
    Rails.logger.info("Stripe CHARGE Event #{event.type}:  id: #{event.data.object.id}")
    
    case event.type 
    when "charge.failed"
      Rails.logger.info("charge failed")
      inv = event.data.object.invoice
      if inv
        invoice = Stripe::Invoice.retrieve(inv)
        if invoice.subscription
          subscr = Subscription.find_by(stripe_id: invoice.subscription)
          subscr.reason = event.data.object.failure_message
          subscr.failure_code = event.data.object.failure_code
          subscr.save!
        end
      end

    when "charge.succeeded"
      Rails.logger.info("charge success")
    end
  end

end
