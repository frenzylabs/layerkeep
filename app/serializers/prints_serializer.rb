class PrintsSerializer
  include FastJsonapi::ObjectSerializer
  set_type :print  # optional
  set_id :id # optional  
  
  attributes :name, :description, :job, :status, :created_at, :updated_at

  attribute :printer, if: Proc.new { |record, params|
    # The assets will be serialized only if the :assets key of params is true
    params && params[:printer] == true
  } do |object|
    PrintersSerializer.new(object.printer).as_json["data"]
  end

  attribute :assets, if: Proc.new { |record, params|
    # The assets will be serialized only if the :assets key of params is true
    params && params[:assets] == true
  } do |object|
    AssetsSerializer.new(object.assets).serializable_hash[:data]
  end

  attributes :slices do |object, params|
    sliceparams = {}
    sliceparams = { params: { files: true }} if params[:slice_details]
  
    SlicesSerializer.new(object.slices, sliceparams).serializable_hash[:data]
    # SlicesSerializer.new(object.slices, sliceparams).as_json["data"]
  end

  attribute :user_permissions do |object, params|
    if params[:current_user]
      policy = PrintPolicy.new(params[:current_user], object)
      {canManage: policy.create?, canView: true}
    else
      {canView: true}
    end
  end
  

end
