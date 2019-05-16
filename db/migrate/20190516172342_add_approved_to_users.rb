class AddApprovedToUsers < ActiveRecord::Migration[5.2]
  def change
    change_table :users do |t|
      t.boolean :approved, :default => false
      t.datetime :approved_on 
      t.boolean :active, :default => false

    end    
  end
end
