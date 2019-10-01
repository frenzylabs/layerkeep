class PrintsSerializer
  include FastJsonapi::ObjectSerializer
  set_type :print  # optional
  set_id :id # optional  
  
  attributes :name, :description, :job, :status, :created_at, :updated_at
  
  attribute :assets, if: Proc.new { |record, params|
    # The assets will be serialized only if the :assets key of params is true
    params && params[:assets] == true
  } do |object|
    AssetsSerializer.new(object.assets).as_json["data"]
  end

  attributes :slices do |object, params|
    sliceparams = {}
    sliceparams = { params: { files: true }} if params[:slice_details]
  
    SlicesSerializer.new(object.slices, sliceparams).as_json["data"]
  end
  

end
