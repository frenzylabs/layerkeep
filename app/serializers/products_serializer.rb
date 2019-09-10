class ProductsSerializer
  include FastJsonapi::ObjectSerializer
  set_type :product  # optional
  set_id :id # optional  
  
  attributes :name, :status, :active, :created_at, :updated_at
  
  has_many :plans, serializer: PlansSerializer, if: Proc.new { |record| record.plans.any? }
  

end
