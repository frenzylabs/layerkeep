class SlicesSerializer
  include FastJsonapi::ObjectSerializer
  set_type :slice  # optional
  set_id :id # optional  
  
  attributes :id, :path, :gcode_data, :log_data, :name, :status, :created_at, :updated_at
  
  attributes :project_files, if: Proc.new { |record, params|
    # The files will be serialized only if the :files key of params is true
    params && params[:files] == true
  } do |object|
    pfiles = object.files.select { |f| f.kind == 'project'}
    SliceFilesSerializer.new(pfiles).as_json["data"]
  end
  attributes :profile_files, if: Proc.new { |record, params|
    # The files will be serialized only if the :files key of params is true
    params && params[:files] == true
  } do |object|
    pfiles = object.files.select { |f| f.kind == 'profile'}
    SliceFilesSerializer.new(pfiles).as_json["data"]
  end

  attribute :slicer_engine do |object|
    SlicerEnginesSerializer.new(object.slicer_engine).as_json["data"]
  end

  # belongs_to :slicer_engine, serializer: SlicerEnginesSerializer
  

end
