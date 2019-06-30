class SlicerEnginesSerializer
  include FastJsonapi::ObjectSerializer
  set_type :slicer_engine  # optional
  set_id :id # optional  
  
  attributes :name, :version, :created_at, :updated_at

end
