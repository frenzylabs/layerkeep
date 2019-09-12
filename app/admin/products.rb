ActiveAdmin.register Product do
  menu parent: 'Billing'
# See permitted parameters documentation:
# https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
#
# permit_params :list, :of, :attributes, :on, :model
#
# or
#
# permit_params do
#   permitted = [:permitted, :attributes]
#   permitted << :other if params[:action] == 'create' && current_user.admin?
#   permitted
# end

  includes :plans

  controller do
    def permitted_params
      params.permit!
    end
  end
#   t.string "stripe_id"
#   t.string "name"
#   t.string "status"
#   t.boolean "active", default: true

  form do |f|
    f.inputs do
      f.input :stripe_id
      f.input :name
      f.input :lookup_name
      f.input :status
      f.input :active
    end
    f.actions
  end

end
