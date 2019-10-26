class CreatePrinters < ActiveRecord::Migration[5.2]
  def change
    create_table :printers do |t|
      t.citext      :name
      t.citext      :model
      t.string      :uuid
      t.string      :description
      t.references  :user,      index: true, foreign_key: true
      t.timestamps
    end

    add_index :printers, [:user_id, :name], unique: true

    change_table :prints do |t|
      t.references  :printer,  index: true, foreign_key: {on_delete: :nullify}
    end

    # create_table :print_configurations do |t|
    #   t.citext      :name,  null: false
    #   t.citext      :value,  null: false
    #   t.string      :description
    #   t.references  :print,      index: true, foreign_key: {on_delete: :cascade}
    #   t.timestamps
    # end

    # add_index :print_configurations, [:name]
  end
end
