class SliceFilesSerializer
  include FastJsonapi::ObjectSerializer
  set_type :slice_file  # optional
  set_id :id # optional  

  attributes :id, :repo_id, :kind, :filepath, :commit, :created_at, :updated_at
  
  attribute :repo_path do |object| 
    object.repo.path
  end

  attribute :repo_name do |object| 
    object.repo.name
  end
  

  # belongs_to :slicer_engine, serializer: SlicerEnginesSerializer
  

end
