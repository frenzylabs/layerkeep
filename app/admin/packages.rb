ActiveAdmin.register Package do
  menu parent: 'Billing'
# See permitted parameters documentation:
# https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
#
permit_params do
  permitted = [:name, :lookup_name, :description, :is_private, :active, :package_plans]
  permitted << [package_plans_attributes: [:plan_id, :_destroy, :id]]
  permitted
end
# permit_params :list, :of, :attributes, :on, :model
#
# or
#
# permit_params do
#   permitted = [:permitted, :attributes]
#   permitted << :other if params[:action] == 'create' && current_user.admin?
#   permitted
# end
  includes :package_plans
  # includes :plans, through: :package_plans

  controller do
    # def permitted_params
    #   params.permit!
    # end

    def update
      Rails.logger.info(params[:package])
      pkg = Package.find(params[:id])
      Rails.logger.info(pkg.package_plans)
      res = pkg.update(permitted_params[:package])
      Rails.logger.info(res.inspect)
      # binding.pry
      params[:package][:package_plans_attributes].each do |k, pp|
        Rails.logger.info(pp)
        if !pp["id"].blank?
          pplan = PackagePlan.find(pp["id"])
          if pp["_destroy"] == "1"
            pplan.destroy
          else
            pplan.update({"plan_id": pp["plan_id"]})
          end
        end

      end
      render action: :edit
    end
  end

  show do
    attributes_table do
      row :name
      row :lookup_name
      row :description
      row :active
      row :is_private
    end

    panel 'Subscription' do
      table_for package do 
        column(:subscriptions) { |pkg| link_to('Subscriptions', admin_subscriptions_path(q: {package_id_eq: pkg.id})) }
        column(:count) { |subscr| package.subscriptions.count }
      end
    end

    panel 'Plans' do
      table_for package.package_plans do 
        
        column(:name) { |pp| link_to pp.plan.name, [ :admin, pp.plan ] }
        column(:nickname) { |pp| link_to pp.plan.nickname, [ :admin, pp.plan ] }
        column(:amount) { |pp| pp.plan.amount }
      end
    end
  end


  form do |f|
    f.semantic_errors # shows errors on :base
    f.inputs
    f.has_many :package_plans, :allow_destroy => true do |pp|
      pp.input :plan, as: :select, :collection => Plan.all.map{ |plan|  [plan.nickname, plan.id] }  
    end
    
    f.actions         # adds the 'Submit' and 'Cancel' buttons
    # f.has_many :plans do |a|
    #   a.input :name
    # end
    # f.has_many :plans do |plan|
    #   plan.inputs "Photos" do
    #     photo.input :field_name 
    #     #repeat as necessary for all fields
    #   end
    # end
  end

  # form do |f|
  #   f.semantic_errors # shows errors on :base
  #   f.inputs do 
  #     f.input :stripe_id
  #   end
  #   f.inputs          # builds an input field for every attribute
    
  #   f.actions         # adds the 'Submit' and 'Cancel' buttons
  # end

end
