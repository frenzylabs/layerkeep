class StripeHandler::Customer 
  def call(event)
    # Event handling
    Rails.logger.info("Stripe Customer EVENT #{event.type}:  id: #{event.data.object.id}")

    case event.type 
    when "customer.updated"
      Rails.logger.info("customer updated")
    when "customer.deleted"
      Rails.logger.info("customer deleted")
      user = User.find_by(stripe_id: event.data.object.id)      
      if (user) 
        Rails.logger.info(user)
        user.user_cards.destroy_all
        user.subscriptions.destroy_all
        user.stripe_id = ""
        user.save!
      else
        Rails.logger.error("Customer deleted with no user object")
      end
    when "customer.source.created"
      Rails.logger.info("customer source created")
    when "customer.source.deleted"
      Rails.logger.info("customer source deleted")
      if (event.data.object.object == "card")
        card = UserCard.find_by(stripe_id: event.data.object.id)        
        card.destroy! if card
      end
    end
  end

  def add_card(user, card)    
      card_params = {
        stripe_id: card[:id],
        name: card[:name],
        last4: card[:last4],
        exp_month: card[:exp_month],
        exp_year: card[:exp_year],
        brand: card[:brand],
        country: card[:country],
        address_zip: card[:address_zip],
        address_zip_check: card[:address_zip_check],
        cvc_check: card[:cvc_check],
        status: 'active'
      }
      user.user_cards.create(card_params)
  end
end
