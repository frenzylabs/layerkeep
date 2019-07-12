ActiveAdmin.register Slice do
# See permitted parameters documentation:
# https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
#
# permit_params :list, :of, :attributes, :on, :model
#
# or
#
# permit_params do
#   permitted = [:permitted, :attributes]
#   permitted << :other if params[:action] == 'create' && current_user.admin?
#   permitted
# end
includes :project_files
includes :slicer_engine
# sidebar "Slice Details", only: [:show, :edit] do
#   ul do
#     li link_to "Tickets",    admin_slice_slice_files_path(resource)
#   end
# end
# form title: 'A custom title' do |f|
#   inputs 'Details' do
#     input :title
#     input :published_at, label: "Publish Post At"
#     li "Created at #{f.object.created_at}" unless f.object.new_record?
#     input :category
#   end
#   panel 'Markup' do
#     "The following can be used in the content below..."
#   end
#   inputs 'Content', :body
#   para "Press cancel to return to the list without saving."
#   actions
# end

# form do |f|
#   f.inputs 'Details' do
#     f.input :name
#     f.input :created_at, label: 'Publish Post At'
#   end
  
#   f.inputs do
#     # f.has_many :project_files do |t|
#     # end
#     # f.has_many :slice_files, new_record: false, heading: 'Themes',
#     # allow_destroy: true do |t|
#     #   t.input :commit
#     #   t.input :filepath
#     #   t.input :repo_path
#     #   t.input :kind
#     #   t.input :repo_id
      
#     #   t.string "commit", null: false
#     # t.string "filepath", null: false
#     # t.string "repo_path", null: false
#     # t.string "kind", null: false
#     # t.bigint "slice_id"
#     # t.bigint "repo_id"
#     # t.datetime "created_at", null: false
#     # t.datetime "updated_at", null: false
#     # t.index ["repo_id"], name: "index_slice_files_on_repo_id"
#     # t.index ["slice_id", "kind"], name: "index_slice_files_on_slice_id_and_kind"
#     # end
#   end
  
#   f.actions
# end
end
