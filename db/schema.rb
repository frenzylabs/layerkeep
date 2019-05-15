# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_05_15_181417) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "citext"
  enable_extension "plpgsql"

  create_table "active_admin_comments", force: :cascade do |t|
    t.string "namespace"
    t.text "body"
    t.string "resource_type"
    t.bigint "resource_id"
    t.string "author_type"
    t.bigint "author_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id"
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id"
  end

  create_table "repos", force: :cascade do |t|
    t.citext "name", null: false
    t.string "description"
    t.string "oid"
    t.string "latest_commit_id"
    t.string "path", null: false
    t.string "kind", default: "projects", null: false
    t.boolean "is_private", default: false
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "kind", "name"], name: "index_repos_on_user_id_and_kind_and_name"
    t.index ["user_id"], name: "index_repos_on_user_id"
  end

  create_table "slice_files", force: :cascade do |t|
    t.string "commit", null: false
    t.string "filepath", null: false
    t.string "repo_path", null: false
    t.string "kind", null: false
    t.bigint "slice_id"
    t.bigint "repo_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["repo_id"], name: "index_slice_files_on_repo_id"
    t.index ["slice_id", "kind"], name: "index_slice_files_on_slice_id_and_kind"
  end

  create_table "slices", force: :cascade do |t|
    t.string "name", null: false
    t.string "path", null: false
    t.jsonb "options", default: "{}"
    t.string "status", default: "waiting"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_slices_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "username"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "repos", "users"
  add_foreign_key "slice_files", "repos"
  add_foreign_key "slice_files", "slices"
  add_foreign_key "slices", "users"
end
