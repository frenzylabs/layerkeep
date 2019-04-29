class CreateRepos < ActiveRecord::Migration[5.2]
  def change
#    execute "CREATE EXTENSION IF NOT EXISTS citext"
    create_table :repos do |t|
      t.citext   :name,      null: false
      t.string   :description,        null: true
      t.string   :oid,                null: true
      t.string   :latest_commit_id,   null: true
      t.string   :path,               null: false
      t.string   :kind,               null: false, default: 'projects'
      t.boolean  :is_private,         default:  false
      t.references :user, index: true, foreign_key: true
      t.timestamps
    end
    add_index :repos, [:user_id, :kind, :name]
  end
end
