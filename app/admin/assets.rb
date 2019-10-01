ActiveAdmin.register Asset do
  # belongs_to :owner, polymorphic: true

  show do |f|
    attributes_table do
      default_attribute_table_rows.each do |field|
        if field == :owner 
          row :owner do |o|
            link_to 'Owner', [:admin, o.owner]
          end
        else
          row field
        end
      end
    end
    # attributes_table do
    #   row :name
    #   row :lookup_name
    #   row :description
    #   row :active
    #   row :is_private
    # end
    # attributes_table *default_attribute_table_rows
    # default_main_content
    # panel "Owner" do
      # link_to 'Owner' , [:admin, f.owner]
    # end
    
    active_admin_comments
  end
end
