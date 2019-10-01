class AssetsSerializer
  include FastJsonapi::ObjectSerializer
  set_type :asset  # optional
  set_id :id # optional  
  
  attributes :name, :content_type, :metadata, :owner_type, :created_at, :updated_at
  
  attribute :owner, if: Proc.new { |record, params| 
    params && params[:owner] == true 
  }
  # belongs_to :owner, polymorphic: true, if: Proc.new { |record, params| params && params[:owner] == true }
  
  # attributes :assets
  # attributes :slice
  

end
