class PackagesSerializer
  include FastJsonapi::ObjectSerializer
  set_type :package  # optional
  set_id :id # optional  
  
  attributes :name, :description, :created_at, :updated_at
  
  attribute :plans do |object|
    PlansSerializer.new(object.plans).as_json["data"]
  end

end
