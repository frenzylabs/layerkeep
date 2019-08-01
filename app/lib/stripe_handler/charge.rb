class StripeHandler::Charge 
  def call(event)
    # Event handling
    Rails.logger.info("Customer EVENT")
    Rails.logger.info(event.data.object.id)
    case event.type 
    when "charge.failed"
      Rails.logger.info("charge failed")
    when "charge.succeeded"
      Rails.logger.info("charge success")
    end
  end

end
