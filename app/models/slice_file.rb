class SliceFile < ApplicationRecord
  # can't use belongs_to :slice because of `conflict method slice already defined by Active Record`
  belongs_to :slices, class_name: "Slice", foreign_key: "slice_id"   
  belongs_to :repo

  # belongs_to :sliceable, :polymorphic => true, foreign_key: "slice_id", foreign_type: "kind", class_name: "Slice"

  # belongs_to :pslice, polymorphic: true
end
