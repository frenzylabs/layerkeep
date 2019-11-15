class ReposSerializer
  include FastJsonapi::ObjectSerializer
  set_type :repo  # optional
  set_id :id # optional  
  
  attribute :id, :name, :description, :path, :kind, :is_private, :remote_src_url, :user_id, :created_at, :updated_at
  
  attribute :branches do |repo, params|
    params[:branches] || {}
  end

  attribute :user_permissions do |object, params|
    if params[:current_user]
      policy = RepoPolicy.new(params[:current_user], object)
      {canManage: policy.create?, canView: true}
    else
      {canView: true}
    end
  end
end
