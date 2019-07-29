#
# content_controller.rb
# LayerKeep
#
# Created by Kevin Musselman (kmussel@gmail.io) on 04/27/19
# Copyright 2018 LayerKeep
#

class UserCardsController < AuthController
  before_action :authorize_user

  def index
    cardsserializer = UserCardsSerializer.new(@user.user_cards)  
    render json: cardsserializer
  end

  def show
  end

  def new
  end

  def update
    
  end


  def create
    # customer = if current_user.stripe_id?
    #              Stripe::Customer.retrieve(current_user.stripe_id)
    #            else
    #              Stripe::Customer.create(email: current_user.email, metadata: {user_id: current_user.id})
    #            end

    # subscription = customer.subscriptions.create(
    #   source: params[:stripeToken],
    #   plan: "monthly"
    # )

    # options = {
    #   stripe_id: customer.id,
    #   stripe_subscription_id: subscription.id,
    # }

    # # Only update the card on file if we're adding a new one
    # options.merge!(
    #   card_last4: params[:card_last4],
    #   card_exp_month: params[:card_exp_month],
    #   card_exp_year: params[:card_exp_year],
    #   card_type: params[:card_brand]
    # ) if params[:card_last4]

    # current_user.update(options)

    redirect_to root_path
  end

  def update

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

  def get_user
    @user ||= User.find_by!(username: params["user"] || "")
  end

  def authorize_user 
    authorize(get_user())
  end

end
