class ReposSerializer
  include FastJsonapi::ObjectSerializer
  set_type :repo  # optional
  set_id :id # optional  
  
  attribute :id, :name, :description, :path, :kind, :is_private, :user_id, :created_at, :updated_at
  
  attribute :branches do |repo, params|
    params[:branches] || []
  end

end
