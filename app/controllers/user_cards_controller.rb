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
    cardsserializer = UserCardsSerializer.new(@user.user_cards.where(status: 'active').order("updated_at DESC").first)
    render json: cardsserializer
  end

  def show
  end

  def new
  end

  def update
    
  end


  def create
    customer = stripe_customer(@user, params)
    if params[:source_token]
      card = params[:source_token][:card]
      card = StripeHandler::Customer.new().add_card(@user, card)
      render json: UserCardsSerializer.new(card) and return
    end

    redirect_to root_path
  rescue Stripe::CardError => e
    # Since it's a decline, Stripe::CardError will be caught
    body = e.json_body
    err  = body[:error]
    Rails.logger.info(body)
    render status: 400, json: body
  rescue Stripe::RateLimitError => e
    # Too many requests made to the API too quickly
  rescue Stripe::InvalidRequestError => e
    # Invalid parameters were supplied to Stripe's API
  rescue Stripe::AuthenticationError => e
    # Authentication with Stripe's API failed
    # (maybe you changed API keys recently)
  rescue Stripe::APIConnectionError => e
    # Network communication with Stripe failed
  rescue Stripe::StripeError => e
    # Display a very generic error to the user, and maybe send
    # yourself an email
  rescue => e
    # Something else happened, completely unrelated to Stripe
    Rails.logger.info(e)
    render status: 400, json: {error: "#{e}"}
  end

  def destroy
    customer = stripe_customer(@user, params)
    card = UserCard.find(params[:id])
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
end
