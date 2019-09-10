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

    def update
      Rails.logger.info("UPDATE SUB: #{params}")
      subscription = Subscription.find(params["id"])
      subparams = params[:subscription]
      package = Package.find_by(id: subparams[:package_id])
      if package and subscription.package_id != package.id 
        plan_hash =  package.plans.to_h { |x| [x.stripe_id, x.id] }
        stripe_plans = package.plans.collect {|pl| { plan: pl.stripe_id } }
        subscription.items.each do |si|
          plan = package.plans.find { |x| x.id == si.plan_id }
          if !plan
            stripe_plans << {id: si.stripe_id, deleted: true }
            si.destroy
          end
        end

        stripe_options = {
          items: stripe_plans
        }
        
        stripe_subscription = Stripe::Subscription.update(subscription.stripe_id, stripe_options)

        items = stripe_subscription.items.data.collect do |item| 
          { stripe_id: item.id, plan_id: plan_hash[item.plan.id], user_id: subscription.user_id, metadata: item.metadata.to_hash }
        end

        usersuboptions = {
          stripe_id: stripe_subscription.id, 
          user_id: subscription.user_id,
          current_period_end: stripe_subscription.current_period_end,
          status: stripe_subscription.status,
          package_id: package.id
        }
    
        Subscription.transaction do
          subscription.update(usersuboptions)
          subscription.items.create(items)
          subscription.reload
        end
      end
      redirect_to action: :show
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
