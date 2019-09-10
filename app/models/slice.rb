class Slice < ApplicationRecord
  belongs_to :user
  belongs_to :slicer_engine, optional: true
  
  has_many :files, foreign_key: :slice_id, class_name: "SliceFile", :dependent => :destroy, inverse_of: :slices
  has_many :project_files, -> { where(kind: "project") }, foreign_key: :slice_id, foreign_type: :kind, class_name: "SliceFile"
  has_many :profile_files, -> { where(kind: "profile") }, foreign_key: :slice_id, foreign_type: :kind, class_name: "SliceFile"

  accepts_nested_attributes_for :files, allow_destroy: true

  include SliceUploader::Attachment.new(:log)
  include SliceUploader::Attachment.new(:gcode)

end
