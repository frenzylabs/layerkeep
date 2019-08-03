ActiveAdmin.register Subscription do
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
  includes :items

  controller do
    def permitted_params
      params.permit!
    end

    def destroy
      subscription = Subscription.find(params["id"])
      subscription.destroy
      if subscription.stripe_id.length > 0
        Stripe::Subscription.delete(subscription.stripe_id)
      end
      redirect_to action: "index"      
    end
  end
end