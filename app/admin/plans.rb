ActiveAdmin.register Plan do
  menu parent: 'Billing'
  # See permitted parameters documentation:
  # https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
  #
  # permit_params :stripe_id, :nickname, :name, :amount, :active
  #
  # or
  #
  # permit_params do
  #   permitted = [:permitted, :attributes]
  #   permitted << :other if params[:action] == 'create' && current_user.admin?
  #   permitted
  # end
  
  # belongs_to :product
  includes package_plans: :package
  
  # create_table "plans", force: :cascade do |t|
  #   t.string "stripe_id"
  #   t.bigint "product_id"
  #   t.string "nickname"
  #   t.string "name"
  #   t.integer "amount", default: 0
  #   t.string "interval", default: "month"
  #   t.integer "trial_period", default: 0
  #   t.string "description", default: ""
  #   t.jsonb "metadata", default: {}
  #   t.boolean "active", default: true
  #   t.boolean "is_private", default: false
  #   t.datetime "created_at", null: false
  #   t.datetime "updated_at", null: false
  #   t.index ["product_id"], name: "index_plans_on_product_id"
  # end
  
  # create_table "products", force: :cascade do |t|
  #   t.string "stripe_id"
  #   t.string "name"
  #   t.string "status"
  #   t.boolean "active", default: true
  #   t.datetime "created_at", null: false
  #   t.datetime "updated_at", null: false
  # end
  
  
    controller do
      def permitted_params
        params.permit!
      end
    end
  
    form do |f|
      f.semantic_errors # shows errors on :base
      f.inputs do 
        f.input :stripe_id
      end
      f.inputs          # builds an input field for every attribute
      
      f.actions         # adds the 'Submit' and 'Cancel' buttons
    end

    # form do |f|
    #   f.inputs do
    #     f.input :stripe_id
    #     f.input :stripe_product_id
    #     f.input :name
    #     f.input :nickname
    #     f.input :amount
    #     f.input :description
    #     f.input :active
    #   end
    #   f.actions
    # end
  
end  