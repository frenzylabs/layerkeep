class CreateRemoteSources < ActiveRecord::Migration[5.2]
  def change
    create_table :remote_sources do |t|
      t.string      :name,            null: false
      t.string      :display_name,    null: false
      t.boolean     :active,          default: true
      
      t.timestamps
    end
    add_index :remote_sources, :name, unique: true

    change_table :repos do |t|
      t.references  :remote_source,  index: true
      t.string  :remote_src_url
    end
  end
end
