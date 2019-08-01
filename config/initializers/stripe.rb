# config/initializers/stripe.rb
Stripe.api_key             = ENV['STRIPE_SECRET_KEY']     # e.g. sk_live_...
StripeEvent.signing_secret = Rails.application.config.settings["stripe"]["signing_secret"] # e.g. whsec_...

StripeEvent.configure do |events|
  events.subscribe 'charge.failed' do |event|
    Rails.logger.info("STRIPE charge EVENT #{event}")
    # Define subscriber behavior based on the event object
    event.class       #=> Stripe::Event
    event.type        #=> "charge.failed"
    event.data.object #=> #<Stripe::Charge:0x3fcb34c115f8>
  end

  events.subscribe 'customer.subscription.', StripeHandler::Subscription.new
  events.subscribe 'customer.deleted', StripeHandler::Customer.new
  events.subscribe 'customer.updated', StripeHandler::Customer.new
  events.subscribe 'customer.source.', StripeHandler::Customer.new

  events.subscribe 'product.', StripeHandler::Product.new
  events.subscribe 'plan.', StripeHandler::Plan.new
  
  

  # events.all do |event|
  #   Rails.logger.info("STRIPE EVENT #{event}")
  #   # Handle all event types - logging, etc.
  # end
end