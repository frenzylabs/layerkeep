class AddSliceAttachment < ActiveRecord::Migration[5.2]
  def change
    change_table :slices do |t|
      t.jsonb       :metadata,         default: {}
      t.jsonb       :log_data
      t.jsonb       :gcode_data
    end
  end
end
