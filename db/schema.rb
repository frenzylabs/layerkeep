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

ActiveRecord::Schema.define(version: 2019_07_21_170525) do

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

  create_table "oauth_access_grants", force: :cascade do |t|
    t.bigint "resource_owner_id", null: false
    t.bigint "application_id", null: false
    t.string "token", null: false
    t.integer "expires_in", null: false
    t.text "redirect_uri", null: false
    t.datetime "created_at", null: false
    t.datetime "revoked_at"
    t.string "scopes"
    t.index ["application_id"], name: "index_oauth_access_grants_on_application_id"
    t.index ["resource_owner_id"], name: "index_oauth_access_grants_on_resource_owner_id"
    t.index ["token"], name: "index_oauth_access_grants_on_token", unique: true
  end

  create_table "oauth_access_tokens", force: :cascade do |t|
    t.bigint "resource_owner_id"
    t.bigint "application_id", null: false
    t.string "token", null: false
    t.string "refresh_token"
    t.integer "expires_in"
    t.datetime "revoked_at"
    t.datetime "created_at", null: false
    t.string "scopes"
    t.string "previous_refresh_token", default: "", null: false
    t.index ["application_id"], name: "index_oauth_access_tokens_on_application_id"
    t.index ["refresh_token"], name: "index_oauth_access_tokens_on_refresh_token", unique: true
    t.index ["resource_owner_id"], name: "index_oauth_access_tokens_on_resource_owner_id"
    t.index ["token"], name: "index_oauth_access_tokens_on_token", unique: true
  end

  create_table "oauth_applications", force: :cascade do |t|
    t.string "name", null: false
    t.string "uid", null: false
    t.string "secret", null: false
    t.text "redirect_uri", null: false
    t.string "scopes", default: "", null: false
    t.boolean "confidential", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["uid"], name: "index_oauth_applications_on_uid", unique: true
  end

  create_table "plans", force: :cascade do |t|
    t.string "stripe_id"
    t.bigint "product_id"
    t.string "nickname"
    t.string "name"
    t.integer "amount", default: 0
    t.string "interval", default: "month"
    t.integer "trial_period", default: 0
    t.string "description", default: ""
    t.jsonb "metadata", default: {}
    t.boolean "active", default: true
    t.boolean "is_private", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["product_id"], name: "index_plans_on_product_id"
  end

  create_table "products", force: :cascade do |t|
    t.string "stripe_id"
    t.string "name"
    t.string "status"
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "remote_sources", force: :cascade do |t|
    t.string "name", null: false
    t.string "display_name", null: false
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_remote_sources_on_name", unique: true
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
    t.bigint "remote_source_id"
    t.string "remote_src_url"
    t.index ["remote_source_id"], name: "index_repos_on_remote_source_id"
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

  create_table "slicer_engines", force: :cascade do |t|
    t.string "name", null: false
    t.string "version", null: false
    t.jsonb "options", default: "{}"
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "slices", force: :cascade do |t|
    t.string "name", null: false
    t.string "path", null: false
    t.jsonb "options", default: "{}"
    t.string "status", default: "waiting"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "log_path"
    t.bigint "slicer_engine_id"
    t.jsonb "metadata", default: {}
    t.jsonb "log_data"
    t.jsonb "gcode_data"
    t.index ["slicer_engine_id"], name: "index_slices_on_slicer_engine_id"
    t.index ["user_id"], name: "index_slices_on_user_id"
  end

  create_table "subscription_items", force: :cascade do |t|
    t.string "stripe_id"
    t.bigint "user_id"
    t.bigint "plan_id"
    t.bigint "subscription_id"
    t.jsonb "metadata", default: {}
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["plan_id"], name: "index_subscription_items_on_plan_id"
    t.index ["subscription_id"], name: "index_subscription_items_on_subscription_id"
    t.index ["user_id"], name: "index_subscription_items_on_user_id"
  end

  create_table "subscriptions", force: :cascade do |t|
    t.string "stripe_id"
    t.bigint "user_id"
    t.bigint "plan_id"
    t.integer "current_period_end"
    t.string "status"
    t.boolean "is_trial", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["plan_id"], name: "index_subscriptions_on_plan_id"
    t.index ["user_id"], name: "index_subscriptions_on_user_id"
  end

  create_table "user_cards", force: :cascade do |t|
    t.string "stripe_id"
    t.bigint "user_id"
    t.string "name"
    t.string "last4"
    t.integer "exp_month"
    t.integer "exp_year"
    t.string "brand"
    t.string "status"
    t.string "country"
    t.string "address_zip"
    t.string "address_zip_check"
    t.string "cvc_check"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_cards_on_user_id"
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
    t.boolean "admin", default: false
    t.boolean "approved", default: false
    t.datetime "approved_on"
    t.boolean "active", default: false
    t.string "stripe_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "oauth_access_grants", "oauth_applications", column: "application_id"
  add_foreign_key "oauth_access_grants", "users", column: "resource_owner_id"
  add_foreign_key "oauth_access_tokens", "oauth_applications", column: "application_id"
  add_foreign_key "oauth_access_tokens", "users", column: "resource_owner_id"
  add_foreign_key "plans", "products"
  add_foreign_key "repos", "users"
  add_foreign_key "slice_files", "repos"
  add_foreign_key "slice_files", "slices"
  add_foreign_key "slices", "slicer_engines"
  add_foreign_key "slices", "users"
  add_foreign_key "subscription_items", "plans"
  add_foreign_key "subscription_items", "subscriptions", on_delete: :cascade
  add_foreign_key "subscription_items", "users"
  add_foreign_key "subscriptions", "plans"
  add_foreign_key "subscriptions", "users"
  add_foreign_key "user_cards", "users", on_delete: :cascade
end
