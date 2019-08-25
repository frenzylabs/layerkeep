class PlansSerializer
  include FastJsonapi::ObjectSerializer
  set_type :plan  # optional
  set_id :id # optional  
  
  attributes :product_id, :amount, :interval, :name, :nickname, :description, :trial_period, :features, :active, :created_at, :updated_at
  
  # belongs_to :product

end
