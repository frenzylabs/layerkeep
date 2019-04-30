class Slice < ApplicationRecord
  belongs_to :user

  has_many :files, foreign_key: :slice_id, class_name: "SliceFile", :dependent => :destroy
  has_many :project_files, -> { where(kind: "project") }, foreign_key: :slice_id, foreign_type: :kind, class_name: "SliceFile"
  has_many :profile_files, -> { where(kind: "profile") }, foreign_key: :slice_id, foreign_type: :kind, class_name: "SliceFile"
end
