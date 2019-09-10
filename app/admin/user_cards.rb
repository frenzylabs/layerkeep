ActiveAdmin.register UserCard do
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

  controller do
    def permitted_params
      params.permit!
    end

    def destroy      
      card = UserCard.find(params[:id])
      card.destroy
      if card.user.stripe_id
        Stripe::Customer.delete_source(
          card.user.stripe_id,
          card.stripe_id
        )
      end
      
      Rails.logger.info(card)
      redirect_to action: :index
    end
  end

end
