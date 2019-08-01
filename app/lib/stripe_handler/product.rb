class StripeHandler::Product 
  def call(event)
    # Event handling
    Rails.logger.info("Product EVENT")
    Rails.logger.info(event.data.object.id)
    case event.type 
    when "product.created"
      params = product_params(event.data.object)
      params[:status] = 'active'
      create_product(params)
      Rails.logger.info("product created")
    when "product.updated"
      prod = Product.find_by(stripe_id: event.data.object.id)
      params = product_params(event.data.object)
      if prod
        prod.update(params)
        Rails.logger.info("prod updated")
      else
        product = Product.find_by(stripe_id: event.data.object[:product])
        create_product(params)
        Rails.logger.info("prod created")
      end
      Rails.logger.info("product created")      
    when "product.deleted"
      Rails.logger.info("customer deleted")
      prod = Product.find_by(stripe_id: event.data.object.id)
      Rails.logger.info(prod)
      if prod
        prod.active = false
        prod.status = 'deleted'
        prod.save!
      end
    end
  end

  def product_params(product) 
    {
      stripe_id: product[:id],
      name: product[:name],
      active: product[:active]
    }
  end

  def create_product(params, update_stripe = false)
      Product.create(params)
  end
end
