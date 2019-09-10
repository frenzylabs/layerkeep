class AddFeatureDetailsToPlans < ActiveRecord::Migration[5.2]
  def change
    add_column :plans, :feature_details, :jsonb
  end
end
