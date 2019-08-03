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


  def create
    customer = stripe_customer(@user, params)
    if params[:source_token]
      card = params[:source_token][:card]
      StripeHandler::Customer.new().add_card(@user, card)
    end
    @user.update({stripe_id: customer.id})

    package = Package.find(params[:package_id])
    
    if package
      subscription = @user.subscriptions.where(name: 'layerkeep').first
      if subscription
        render status: 404, json: {error: 'Subscription Already Exist'}
      else 
        plan_hash =  package.plans.to_h { |x| [x.stripe_id, x.id] }        
        stripe_plans = package.plans.collect {|pl| { plan: pl.stripe_id } }
        stripe_options = {
          items: stripe_plans
        }
        usersuboptions = {
          name: 'layerkeep'
        }
        subscription = create_subscription(customer, @user, plan_hash, stripe_options, package, usersuboptions)
        render json: SubscriptionsSerializer.new(subscription)
      end

    else
      render status: 404, json: {error: 'Package Not Found'}
    end
  end

  def update
    customer = stripe_customer(@user, params)
    if params[:source_token]
      card = params[:source_token][:card]
      StripeHandler::Customer.new().add_card(@user, card)
    end
    @user.update({stripe_id: customer.id})

    package = Package.find(params[:package_id])
    subscription = @user.subscriptions.where(name: 'layerkeep').first
    if !subscription
      render status: 404, json: {error: 'Subscription Not Found'}
    else
      plan_hash =  package.plans.to_h { |x| [x.stripe_id, x.id] }
      stripe_plans = package.plans.collect {|pl| { plan: pl.stripe_id } }
      subscription.items.each do |si|
        plan = package.plans.find { |x| x.id == si.plan_id }
        if !plan
          stripe_plans << {id: si.stripe_id, deleted: true }
          si.destroy
        end
      end

      stripe_options = {
        items: stripe_plans
      }
      usersuboptions = {
        name: 'layerkeep'
      }
      
      subscription = update_subscription(subscription, plan_hash, stripe_options, package, usersuboptions)
      render json: SubscriptionsSerializer.new(subscription)
    end

  end

  def destroy
    redirect_to root_path, notice: "Your subscription has been canceled."
  end

  def stripe_customer(user, params)
    @customer ||= if user.stripe_id?
                    cus = Stripe::Customer.retrieve(user.stripe_id)
                    if params[:source_token]
                    cus = Stripe::Customer.update(cus.id, {source: params[:source_token][:id]})
                    end
                    cus
                  else
                    customer_options = {email: user.email, metadata: {user_id: user.id}}
                    customer_options[:source] = params[:source_token][:id] if params[:source_token]
                    Stripe::Customer.create(customer_options)
                  end
  end


  def create_subscription(customer, user, plan_hash, stripe_options, package, sub_opts = {})
    stripe_subscription = customer.subscriptions.create(stripe_options)
    
    items = stripe_subscription.items.data.collect do |item| 
      {stripe_id: item.id, plan_id: plan_hash[item.plan.id], user_id: user.id, metadata: item.metadata.to_hash}
    end
    usersuboptions = {
      stripe_id: stripe_subscription.id, 
      user_id: user.id, 
      current_period_end: stripe_subscription.current_period_end,
      status: stripe_subscription.status
    }.merge(sub_opts)
    usersuboptions[:package_id] = package.id if package
    Subscription.transaction do
      subscription = user.subscriptions.create(usersuboptions)
      subscription.items.create(items)
      subscription.reload
    end
  end

  def update_subscription(subscription, plan_hash, stripe_options, package, sub_opts = {})
    stripe_subscription = Stripe::Subscription.update(subscription.stripe_id, stripe_options)
    
    items = stripe_subscription.items.data.collect do |item| 
      { stripe_id: item.id, plan_id: plan_hash[item.plan.id], user_id: subscription.user_id, metadata: item.metadata.to_hash }
    end
    usersuboptions = {
      stripe_id: stripe_subscription.id, 
      user_id: subscription.user_id,
      current_period_end: stripe_subscription.current_period_end,
      status: stripe_subscription.status
    }.merge(sub_opts)
    usersuboptions[:package_id] = package.id if package

    Subscription.transaction do
      subscription.update(usersuboptions)
      subscription.items.create(items)
      subscription.reload
    end
  end
end
