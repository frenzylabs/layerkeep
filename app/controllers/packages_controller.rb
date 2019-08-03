#
# content_controller.rb
# LayerKeep
#
# Created by Kevin Musselman (kmussel@gmail.io) on 04/27/19
# Copyright 2018 LayerKeep
#

class PackagesController < ApplicationController
  def index
    packages = Package.where(active: true, is_private: false)
    serializer = PackagesSerializer.new(packages.includes(:plans))
    render json: serializer
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

  
end
