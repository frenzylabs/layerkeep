#
# user_controller.rb
# LayerKeep
#
# Created by Wess Cope (me@wess.io) on 04/24/19
# Copyright 2018 WessCope
#

class UsersController < AuthController
  skip_before_action :get_user, only: [:index, :settings]
  skip_before_action :authenticate!, only: :index
  
  def index
  end


  def settings
    user              = current_user
    user_params       = params[:user]
    username          = user_params[:username] || @user.username
    email             = user_params[:email] || @user.email
    current_password  = user_params[:password][:current]
    new_password      = user_params[:password][:new]
    
    updated = {
      # username: username,
      email:    email
    }

    if !current_password.empty? && !new_password.empty?
      updated[:current_password]  = current_password
      updated[:password]          = new_password

      if user.update_with_password(updated)
        bypass_sign_in(user)
  
        render json: {'success' => {username: username, email: email}}
      else
        render json: {'error' => user.errors.full_messages}, status: 400
      end
    else
      if user.update(updated)
        bypass_sign_in(user)
  
        render json: {'success' => {username: username, email: email}}
      else
        render json: {'error' => user.errors.full_messages}, status: 400
      end  
    end
  end

  def features
    @user ||= User.find_by!(username: params["user"] || "")
    authorize(@user, :show?)
    render json: @user.subscription_handler.features
  end

  def me
    # binding.pry
    render json: current_user.to_json(except: ["stripe_id"]) if current_user
  end

end
