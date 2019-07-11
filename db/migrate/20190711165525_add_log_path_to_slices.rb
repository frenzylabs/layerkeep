class AddLogPathToSlices < ActiveRecord::Migration[5.2]
  def change
    change_table :slices do |t|
      t.string  :log_path
    end    
  end
end
