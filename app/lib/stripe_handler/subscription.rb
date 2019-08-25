class StripeHandler::Subscription 
  def call(event)
    # Event handling
    Rails.logger.info("Stripe Subscription EVENT #{event.type}:  id: #{event.data.object.id}")

    case event.type 
    when "customer.subscription.updated"
      subscription = Subscription.find_by(stripe_id: event.data.object.id)
      if subscription
        Rails.logger.info(subscription)
        update_params = {
          status: event.data.object.status
        }
        if event.data.object.status == "active"
          update_params[:current_period_end] = (event.data.object.current_period_end + (5 * 86400)) 
          update_params[:failure_code] = ""
          update_params[:reason] = ""
        end

        subscription.update(update_params)
      end
    when "customer.subscription.trial_will_end"
      Rails.logger.info("subscription trial will end")
    when "customer.subscription.deleted"
      subscription = Subscription.find_by(stripe_id: event.data.object.id)
      if subscription
        Rails.logger.info(subscription)
        subscription.destroy!
        # user = User.find_by(stripe_id: event.data.object["customer"])      
        # Rails.logger.info(user)
      else
        Rails.logger.error("Deleted Stripe Subscription with no layerkeep subscription ")
      end


    end
  end

  # stripe_subscription = Stripe::Subscription.update(subscription.stripe_id, stripe_options)
  # def update_subscription(stripe_subscription, subscription, plan_hash, stripe_options, package, sub_opts = {})
    
    
  #   items = stripe_subscription.items.data.collect do |item| 
  #     { stripe_id: item.id, plan_id: plan_hash[item.plan.id], user_id: subscription.user_id, metadata: item.metadata.to_hash }
  #   end
  #   usersuboptions = {
  #     stripe_id: stripe_subscription.id, 
  #     user_id: subscription.user_id,
  #     current_period_end: stripe_subscription.current_period_end,
  #     status: stripe_subscription.status
  #   }.merge(sub_opts)
  #   usersuboptions[:package_id] = package.id if package

  #   Subscription.transaction do
  #     subscription.update(usersuboptions)
  #     subscription.items.create(items)
  #     subscription.reload
  #   end
  # end

end
