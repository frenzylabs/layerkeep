class SlicesSerializer
  include FastJsonapi::ObjectSerializer
  set_type :slice  # optional
  set_id :id # optional  
  
  attributes :path, :name, :status, :created_at, :updated_at
  
  attributes :project_files
  attributes :profile_files
  

end
