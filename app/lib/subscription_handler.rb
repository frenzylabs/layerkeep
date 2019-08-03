require 'zip'

class SubscriptionHandler
  attr_accessor :user, :features

  def initialize(user)
    @user = user
    @products = Hash[Product.all.map {|pr| [pr.id, pr] }]
    @base_features = free_features
    
  end

  def free_features
    pkg = Package.find_by(name: 'free')
    plans = (pkg and pkg.plans) || []
    plans.reduce({}) do |acc, pl| 
      prod_name = @products[pl.product_id].lookup_name
      acc[prod_name] = (acc[prod_name] || {}).merge(pl.features)
      acc
    end
  end

  def features
    @features ||= user_features
  end

  def user_features 
    subs = user.subscriptions.where('current_period_end > ?', Time.now.to_i).includes(items: :plan)
    user_features = subs.reduce({}) do |acc, s|
      s.items.each do |item| 
        prod_name = @products[item.plan.product_id].lookup_name
        acc[prod_name] = (acc[prod_name] || {}).merge(item.plan.features)
        acc
      end
      acc
    end
    @base_features.merge(user_features)
  end
end
