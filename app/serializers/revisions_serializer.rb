class RevisionsSerializer
  include FastJsonapi::ObjectSerializer
  set_type :revision  # optional
  set_id :oid # optional
  # def add_attributes()

  # end
  # atr do |obj|

  # object.attributes.each do |attr| 
  #   attribute attr
  # end
  # end
  # attribute :base_path, :project_name, :profile_name, :profile_commit, 
  #           :project_filename, :project_commit, :status,  :filepath, :created_at, :updated_at

  attributes :oid, :message, :time, :committer, :tree
  

end
