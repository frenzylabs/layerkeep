class CreateSlices < ActiveRecord::Migration[5.2]
  def change
    create_table :slices do |t|
        t.string      :name,            null: false
        t.string      :path,            null: false
        t.jsonb       :options,         default: '{}'
        t.string      :status,          default: 'waiting'
        t.references  :user,      index: true, foreign_key: true

        t.timestamps
    end

    create_table :slice_files do |t|
      t.string      :commit,    null: false
      t.string      :filepath,  null: false
      t.string      :repo_path, null: false
      t.string      :kind,      null: false
      t.references  :slice,    index: false, foreign_key: true
      t.references  :repo,     index: true, foreign_key: true

      t.timestamps
    end
    add_index :slice_files, [:slice_id, :kind]

  end
end
