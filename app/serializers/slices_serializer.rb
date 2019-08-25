class SlicesSerializer
  include FastJsonapi::ObjectSerializer
  set_type :slice  # optional
  set_id :id # optional  
  
  attributes :id, :path, :gcode_data, :log_data, :name, :status, :created_at, :updated_at
  
  attributes :project_files
  attributes :profile_files
  attribute :slicer_engine do |object|
    SlicerEnginesSerializer.new(object.slicer_engine).as_json["data"]
  end

  # belongs_to :slicer_engine, serializer: SlicerEnginesSerializer
  

end
