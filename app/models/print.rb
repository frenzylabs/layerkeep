class Print < ApplicationRecord
  has_many :assets, as: :owner, dependent: :destroy
  belongs_to :slices, class_name: "Slice", foreign_key: "slice_id", optional: true
  belongs_to :user
  belongs_to :printer, optional: true
end