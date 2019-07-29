class SubscriptionsSerializer
  include FastJsonapi::ObjectSerializer
  set_type :subscription  # optional
  set_id :id # optional  
  
  attributes :status, :is_trial, :current_period_end, :created_at, :updated_at
  
  attribute :items do |object|
    SubscriptionItemsSerializer.new(object.items).as_json["data"]
  end
  # has_many :items, serializer: SubscriptionItemsSerializer, if: Proc.new { |record| record.items.any? }
  
end
