class CreateAssets < ActiveRecord::Migration[5.2]
  def change
    create_table :assets do |t|
      t.string      :name,  null: false
      t.string      :filepath
      t.string      :content_type
      t.string      :kind
      t.jsonb       :metadata,         default: {}
      t.jsonb       :file_data
      t.bigint      :owner_id, null: true
      t.string      :owner_type
      t.references  :user,      index: true, foreign_key: true
      t.timestamps
    end
    add_index :assets, [:owner_type, :owner_id]


    change_table :slices do |t|
      t.text       :description,         default: ''
    end
  end
end
