class UserCardsSerializer
  include FastJsonapi::ObjectSerializer
  set_type :user_card  # optional
  set_id :id # optional  
  
  attributes :brand, :last4, :exp_month, :exp_year, :updated_at, :status, :created_at, :updated_at

end
