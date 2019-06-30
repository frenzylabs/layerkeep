class CreateSlicerEngines < ActiveRecord::Migration[5.2]
  def change
    create_table :slicer_engines do |t|
      t.string      :name,            null: false
      t.string      :version,         null: false
      t.jsonb       :options,         default: '{}'
      t.boolean     :active,          default: true
      
      t.timestamps
    end
  end
end
