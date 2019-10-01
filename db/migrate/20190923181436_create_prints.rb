class CreatePrints < ActiveRecord::Migration[5.2]
  def change
    create_table :prints do |t|
      t.string      :name      
      t.string      :description
      t.string      :status,      default: 'created'
      t.bigint      :job,       default: 0
      t.references  :user,      index: true, foreign_key: true
      t.references  :slice,     index: false, null: true
      t.timestamps
    end

    create_table :metadata do |t|
      t.string      :name,  null: false
      t.string      :value,  null: false
      t.string      :description            
      t.bigint      :owner_id, null: true
      t.string      :owner_type
      t.references  :user,      index: true, foreign_key: true
      t.timestamps
    end
    add_index :metadata, [:owner_type, :owner_id]
    add_index :metadata, [:user_id, :name, :value]

  end
end
