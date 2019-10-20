class CreateContacts < ActiveRecord::Migration[5.2]
  def change
    create_table :contacts do |t|
      t.string :first_name
      t.string :last_name
      t.string :username
      t.string :message
      t.string :subject
      t.string :email
      t.boolean :responded, default: false
      t.boolean :active, default: true
      t.references  :user,  index: false, null: true
      t.timestamps
    end
  end
end
