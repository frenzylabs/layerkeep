ActiveAdmin.register User do
  permit_params :email, :username, :password, :password_confirmation, :approved, :stripe_id, :active

  includes :subscriptions

  index do
    selectable_column
    id_column
    column :email
    column :username
    column :active
    column :approved
    column :approved_on
    column :current_sign_in_at
    column :sign_in_count
    column :stripe_id
    column :created_at
    actions
  end

  filter :email
  filter :username
  filter :active
  filter :approved
  filter :current_sign_in_at
  filter :sign_in_count
  filter :created_at
  
  controller do
    def update
      user_params = permitted_params[:user]
      if user_params[:password].blank?
        user_params.delete(:password)
        user_params.delete(:password_confirmation)
      end

      if user_params[:approved] == "1" 
        user_params[:approved_on] = DateTime.now.utc
      else
        user_params[:approved] = false
      end

      u = User.find(params[:id])
      is_approved = u.approved
      u.approved_on = nil
      u.update(user_params)

      if !is_approved && user_params[:approved] == "1" 
        ApprovedMailer.notify(u).deliver
      end

      render action: :edit
    end
  end
  
  show do
    # Also works for default content
    # attributes_table do
    #   default_attribute_table_rows.each do |field|
    #     row field
    #   end
    default_main_content
    panel "Billing" do
      table_for user.subscriptions do
        column "Subscriptions" do |subscription|
          link_to subscription.name, [ :admin, subscription ]
        end
      end

      table_for user.user_cards do
        column "User Cards" do |card|
          link_to card.last4, [ :admin, card ]
        end
      end
    end
    # attributes_table do
    #   row :title
    #   row :author
    #   row :description
    #   table_for article.categories.order('name ASC') do
    #     column "Categories" do |category|
    #       link_to category.name, [ :admin, category ]
    #     end
    #   end
    # end
  end

  form do |f|
    f.inputs do
      f.input :email
      f.input :username
      f.input :password
      f.input :password_confirmation
      f.input :approved
      f.input :active
      f.input :stripe_id
    end
    f.actions
  end


end
