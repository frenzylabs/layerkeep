#
# content_controller.rb
# LayerKeep
#
# Created by Kevin Musselman (kmussel@gmail.io) on 04/27/19
# Copyright 2018 LayerKeep
#

class PlansController < ApplicationController

  def index
    plans = Plan.where(active: true, is_private: false)
    plansserializer = PlansSerializer.new(plans)  
    render json: plansserializer
  end

  def new
  end
end
