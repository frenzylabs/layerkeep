#
# content_controller.rb
# LayerKeep
#
# Created by Kevin Musselman (kmussel@gmail.io) on 04/27/19
# Copyright 2018 LayerKeep
#

class ProductsController < ApplicationController
  
  def index
    products = Product.includes(:plans).where(active: true, plans: {is_private: false})
    productsserializer = ProductsSerializer.new(products, {include: [:plans]})
    render json: productsserializer
  end

  def new
  end
end
