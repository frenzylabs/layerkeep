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

  def get_user
    @user ||= User.find_by!(username: params["user"] || "")
  end

  def authorize_user 
    authorize(get_user())
  end

end
