class SubscriptionItemsSerializer
  include FastJsonapi::ObjectSerializer
  set_type :subscription  # optional
  set_id :id # optional  
  
  attributes :subscription_id, :status, :metadata, :created_at, :updated_at
  
  attribute :plan do |object|
    PlansSerializer.new(object.plan).as_json["data"]
  end
  # has_one :plan, serializer: PlansSerializer
  

end
