class StripeHandler::Plan 
  def call(event)
    # Event handling
    Rails.logger.info("Stripe Plan EVENT #{event.type}:  id: #{event.data.object.id}")

    case event.type 
    when "plan.created"
      plan = Plan.find_by(stripe_id: event.data.object.id)
      unless plan
        params = plan_params(event.data.object)
        product = Product.find_by(stripe_id: event.data.object[:product])
        create_plan(params, product)
        Rails.logger.info("plan created")
      end
      
    when "plan.updated"
      plan = Plan.find_by(stripe_id: event.data.object.id)
      params = plan_params(event.data.object)
      if plan
        plan.update(params)      
        Rails.logger.info("plan updated")
      else
        product = Product.find_by(stripe_id: event.data.object[:product])
        create_plan(params.merge({is_private: true}), product)
        Rails.logger.info("plan created")
      end
    when "plan.deleted"
      Rails.logger.info("plan deleted")
      plan = Plan.find_by(stripe_id: event.data.object.id)
      Rails.logger.info(plan)
      if plan
        plan.destroy!
      end
    end
  end

  def plan_params(plan)        
    features = {}
    if plan[:metadata]["features"]
      begin
        features = JSON.parse(plan[:metadata]["features"])        
      rescue => exception
        features = {}
      end
      plan[:metadata]["features"] = features
    end
    pparams = {
      stripe_id: plan[:id],
      nickname: plan[:nickname],
      amount:  plan[:amount],
      interval: plan[:interval],
      metadata: plan[:metadata],
      features: features,
      active: plan[:active]
    }
    pparams[:description] = plan[:description] if plan[:description]
    pparams
  end

  # {
  #   "id": "plan_FURIH3AQEnWl0j",
  #   "object": "plan",
  #   "active": true,
  #   "aggregate_usage": null,
  #   "amount": 0,
  #   "billing_scheme": "per_unit",
  #   "created": 1563905356,
  #   "currency": "usd",
  #   "interval": "month",
  #   "interval_count": 1,
  #   "livemode": false,
  #   "metadata": {},
  #   "nickname": "free",
  #   "product": "prod_FTehhGrCmGslwc",
  #   "tiers": null,
  #   "tiers_mode": null,
  #   "transform_usage": null,
  #   "trial_period_days": 7,
  #   "usage_type": "licensed"
  # }

  def create_plan(params, product, update_stripe = false)
      params[:product_id] = product.id if product
      Plan.create(params)
  end
end
