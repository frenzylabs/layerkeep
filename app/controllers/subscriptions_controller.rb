#
# content_controller.rb
# LayerKeep
#
# Created by Kevin Musselman (kmussel@gmail.io) on 04/27/19
# Copyright 2018 LayerKeep
#

class SubscriptionsController < AuthController
  before_action :authorize_user

  def index
    subserializer = SubscriptionsSerializer.new(@user.subscriptions.includes(items: :plan))
    render json: subserializer
  end

  def show
  end

  def new
  end


  # {
  #   "id": "tok_1F0uYpFWeOOVL99K2KERxTb0",
  #   "object": "token",
  #   "card": {
  #     "id": "card_1F0uYpFWeOOVL99KI2Z80f6z",
  #     "object": "card",
  #     "address_city": null,
  #     "address_country": null,
  #     "address_line1": null,
  #     "address_line1_check": null,
  #     "address_line2": null,
  #     "address_state": null,
  #     "address_zip": "29678",
  #     "address_zip_check": "unchecked",
  #     "brand": "Visa",
  #     "country": "US",
  #     "cvc_check": "unchecked",
  #     "dynamic_last4": null,
  #     "exp_month": 11,
  #     "exp_year": 2021,
  #     "funding": "credit",
  #     "last4": "4242",
  #     "metadata": {
  #     },
  #     "name": "layerkeep",
  #     "tokenization_method": null
  #   },
  #   "client_ip": "75.181.34.118",
  #   "created": 1564251843,
  #   "livemode": false,
  #   "type": "card",
  #   "used": false
  # }

  
  def create
    plan = Plan.find(params[:plan_id])
    customer = stripe_customer(params)
    
    if params[:source_token]

      card = params[:source_token][:card]
      card_params = {
        stripe_id: card[:id],
        last4: card[:last4],
        exp_month: card[:exp_month],
        exp_year: card[:exp_year],
        brand: card[:brand],
        status: 'active'
      }
      @user.user_cards.create(card_params)
    end
    @user.update({stripe_id: customer.id})

    sis = @user.subscription_items.joins(:plan).where(:plans => {:product_id => plan.product_id}).includes(:subscription)
    if sis.empty? 
      user_sub = 
        if plan.trial_period > 0 
          create_trial_subscription(customer, @user, plan)
        else
          subscription = @user.subscriptions.find_by(is_trial: false)
          if subscription 
            create_subscription_item(@user, subscription, plan)
            subscription.reload
          else
            stripe_options = {
              items: [{plan: plan.stripe_id}]
            }
            create_subscription(customer, @user, plan, stripe_options)
          end
        end
      render json: SubscriptionsSerializer.new(user_sub)
    else
      render status: 404, json: {error: 'Subscription Already Exist'}
    end
  end

  def update

  end

  def destroy
    customer = Stripe::Customer.retrieve(@user.stripe_id)
    customer.subscriptions.retrieve(current_user.stripe_subscription_id).delete
    current_user.update(stripe_subscription_id: nil)

    redirect_to root_path, notice: "Your subscription has been canceled."
  end

  def stripe_customer(params)
    @customer ||= if @user.stripe_id?
                    cus = Stripe::Customer.retrieve(@user.stripe_id)
                    if params[:source_token]
                    cus = Stripe::Customer.update(cus.id, {source: params[:source_token][:id]})
                    end
                    cus
                  else
                    customer_options = {email: @user.email, metadata: {user_id: @user.id}}
                    customer_options[:source] = params[:source_token][:id] if params[:source_token]
                    Stripe::Customer.create(customer_options)
                  end
  end

  def get_user
    @user ||= User.find_by!(username: params["user"] || "")
  end

  def authorize_user 
    authorize(get_user())
  end


  def create_trial_subscription(customer, user, plan)
    trial_end = (Time.now  + 7.days).to_i
    stripe_options = {
      items: [{plan: plan.stripe_id}],
      trial_end: trial_end,
      cancel_at: trial_end
    }

    create_subscription(customer, user, plan, stripe_options, true)
  end


  def create_subscription(customer, user, plan, stripe_options, is_trial = false)
    stripe_subscription = customer.subscriptions.create(stripe_options)
    
    items = stripe_subscription.items.data.collect do |item| 
      {stripe_id: item.id, plan_id: plan.id, user_id: user.id, metadata: item.metadata.to_hash}
    end
    usersuboptions = {
      stripe_id: stripe_subscription.id, 
      user_id: user.id, 
      plan_id: plan.id, 
      current_period_end: stripe_subscription.current_period_end,
      status: stripe_subscription.status,
      is_trial: is_trial
    }
    Subscription.transaction do
      subscription = user.subscriptions.create(usersuboptions)
      subscription.items.create(items)
      subscription
    end
    
    # items: items

  end

  def create_subscription_item(user, subscription, plan)
    stripe_sub_item = Stripe::SubscriptionItem.create({
      subscription: subscription.stripe_id,
      plan: plan.stripe_id,
      quantity: 1,
    })

    user.subscription_items.create({
      stripe_id: stripe_sub_item.id,
      plan_id: plan.id,
      subscription_id: subscription.id
    })
  end
end
