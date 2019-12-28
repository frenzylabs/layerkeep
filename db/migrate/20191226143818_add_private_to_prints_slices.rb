class AddPrivateToPrintsSlices < ActiveRecord::Migration[5.2]
  def change
    change_table :prints do |t|
      t.boolean  :is_private,         default:  false
    end
    change_table :printers do |t|
      t.boolean  :is_private,         default:  false
    end
    change_table :slices do |t|
      t.boolean  :is_private,         default:  false
    end
  end
end
