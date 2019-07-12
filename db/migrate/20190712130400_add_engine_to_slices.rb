class AddEngineToSlices < ActiveRecord::Migration[5.2]
  def change
    change_table :slices do |t|
      t.references  :slicer_engine,  index: true, foreign_key: true
    end    
  end
end
