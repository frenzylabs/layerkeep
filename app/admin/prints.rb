ActiveAdmin.register Print do
  form partial: 'form'
  
  controller do
    def permitted_params
      params.permit!
    end
  end

  show do |f|
    attributes_table *default_attribute_table_rows
    # default_main_content
    panel 'Assets' do
      table_for f.assets do 
        
        # column(:id) { |v| link_to v.id, [ :admin, f, v ] }        
        column(:name) 
        column(:filepath) 
        column(:owner) 
        column(:metadata) 
        column(:created_at) 
      end
    end
    active_admin_comments
  end

  # form do |f|
  #   f.semantic_errors # shows errors on :base
  #   f.inputs
    
  #   f.has_many :assets, :allow_destroy => true do |ass|
  #     ass.input :asset
  #   #   ass.input :plan, as: :select, :collection => Plan.all.map{ |plan|  [plan.nickname, plan.id] }  
  #   end
    
  #   f.actions
  # end

end
