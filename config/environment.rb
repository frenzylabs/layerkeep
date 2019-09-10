# Load the Rails application.
require_relative 'application'

# Initialize the Rails application.
Rails.application.initialize!


require 'stripe'
Stripe.api_key = Rails.application.config.settings["stripe"]["secret_key"]