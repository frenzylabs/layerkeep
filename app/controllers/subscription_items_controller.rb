#
# content_controller.rb
# LayerKeep
#
# Created by Kevin Musselman (kmussel@gmail.io) on 04/27/19
# Copyright 2018 LayerKeep
#

class SubscriptionItemsController < AuthController
  before_action :authorize_user

  def index
    render json: @user.user_subscriptions
  end

  def show
  end

  def new
  end


  def create    
  end

  def update
    plan = Plan.find(params[:plan_id])  
    # authorize plan (user.admin)  if plan.is_private 
    
    # if user.has_valid_credit_card || params[:card_token] 

    customer = if @user.stripe_id?
                  cust = Stripe::Customer.retrieve(@user.stripe_id)
                  if params[:source_token]
                    Stripe::Customer.update(
                      cust.id,
                      {
                        source: params[:source_token][:id]
                      }
                    )
                  else
                    cust
                  end

                else
                  customer_options = {email: @user.email, metadata: {user_id: @user.id}}
                  customer_options[:source] = params[:source_token][:id] if params[:source_token]
                  Stripe::Customer.create(customer_options)
                end

    if params[:source_token]
      card = params[:source_token][:card]
      StripeHandler::Customer.new().add_card(@user, card)
    end

    item = @user.subscription_items.where(id: params[:item_id]).first
    if item.subscription.is_trial
      upgrade_trial_subscription(customer, plan)
      
    else
      stripe_item = Stripe::SubscriptionItem.update(
        item.stripe_id,
        {
          plan: plan.stripe_id
        }
      )
      item.plan_id = plan.id
      item.save!
    end
    
  end

  def destroy
    customer = Stripe::Customer.retrieve(current_user.stripe_id)
    customer.subscriptions.retrieve(current_user.stripe_subscription_id).delete
    current_user.update(stripe_subscription_id: nil)

    redirect_to root_path, notice: "Your subscription has been canceled."
  end

  def stripe_customer
    @customer ||= if current_user.stripe_id?
                    Stripe::Customer.retrieve(current_user.stripe_id)
                  else
                    Stripe::Customer.create(email: current_user.email)
                  end
  end

  def upgrade_trial_subscription(customer, plan)
    subscription = @user.subscriptions.find_by(is_trial: false)

    if subscription       
      subitem = subscription.items.joins(:plan).where(:plans => {:product_id => plan.product_id}).first
      if subitem 
        stripe_item = Stripe::SubscriptionItem.update(
          subitem.stripe_id,
          {
            plan: plan.stripe_id
          }
        )
        subitem.plan_id = plan.id
        subitem.save!

      else
        stripe_sub_item = Stripe::SubscriptionItem.create({
          subscription: subscription.stripe_id,
          plan: plan.stripe_id,
          quantity: 1,
        })
  
        @user.subscription_items.create({
          stripe_id: stripe_sub_item.id,
          plan_id: plan.id,
          subscription_id: subscription.id
        })
        subscription.reload
      end
    else
      stripe_subscription = customer.subscriptions.create(
        items: [{plan: plan.stripe_id}]
      )
      items = stripe_subscription.items.data.collect do |item| 
        {stripe_id: item.id, plan_id: plan.id, user_id: @user.id, metadata: item.metadata.to_hash}
      end
      usersuboptions = {
        stripe_id: stripe_subscription.id, 
        user_id: @user.id, 
        plan_id: plan.id, 
        current_period_end: stripe_subscription.current_period_end,
        status: stripe_subscription.status,
        is_trial: false
      }
      Subscription.transaction do
        usersub = @user.subscriptions.create(usersuboptions)
        usersub.items.create(items)
        usersub
      end
    end    
  end
end
