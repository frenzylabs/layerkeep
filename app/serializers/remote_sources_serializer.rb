class RemoteSourcesSerializer
  include FastJsonapi::ObjectSerializer
  set_type :remote_source  # optional
  set_id :id # optional  
  
  attributes :name, :display_name, :created_at, :updated_at

end
