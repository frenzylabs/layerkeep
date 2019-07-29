class CreateBillingTables < ActiveRecord::Migration[5.2]
  def change
    change_table :users do |t|
      t.string :stripe_id
    end    

    create_table :products do |t|
      t.string    :stripe_id
      t.string    :name
      t.string    :status
      t.boolean   :active, default: true
      t.timestamps
    end

    create_table :plans do |t|
      t.string      :stripe_id
      t.references  :product, index: true, foreign_key: true
      t.string      :nickname
      t.string      :name
      t.integer     :amount,       default: 0
      t.string      :interval,     default: 'month'
      t.integer     :trial_period, default: 0
      t.string      :description,  default: ""
      t.jsonb       :metadata,     default: {}
      t.boolean     :active,       default: true
      t.boolean     :is_private,   default: false
      t.timestamps
    end

    create_table :subscriptions do |t|
      t.string      :stripe_id
      t.references  :user, index: true, foreign_key: true
      t.references  :plan, index: true, foreign_key: true
      t.integer     :current_period_end
      t.string      :status
      t.boolean     :is_trial, default: false
      t.timestamps
    end

    create_table :subscription_items do |t|
      t.string     :stripe_id
      t.references :user, index: true, foreign_key: true
      t.references :plan, index: true, foreign_key: true
      t.references :subscription, index: true, foreign_key: {on_delete: :cascade}
      t.jsonb      :metadata,         default: {}
      t.string     :status
      t.timestamps
    end

    create_table :user_cards do |t|
      t.string     :stripe_id
      t.references :user, index: true, foreign_key: {on_delete: :cascade}
      t.string     :name
      t.string     :last4
      t.integer    :exp_month
      t.integer    :exp_year
      t.string     :brand
      t.string     :status
      t.string     :country
      t.string     :address_zip
      t.string     :address_zip_check
      t.string     :cvc_check
      t.timestamps
    end

  end
end


