class RevisionsSerializer
  include FastJsonapi::ObjectSerializer
  set_type :revision  # optional
  set_id :oid # optional

  attributes :oid, :message, :time, :committer, :tree
  

end
