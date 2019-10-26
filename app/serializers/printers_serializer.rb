class PrintersSerializer
  include FastJsonapi::ObjectSerializer
  set_type :printer  # optional
  set_id :id # optional  
  
  attributes :id, :name, :model, :uuid, :description, :created_at, :updated_at
  
  attribute :prints, if: Proc.new { |record, params|
    # The prints will be serialized only if the :assets key of params is true
    params && params[:prints] == true
  } do |object|
    PrintsSerializer.new(object.prints).as_json["data"]
  end

end
