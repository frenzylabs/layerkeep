class Asset < ApplicationRecord
  belongs_to :owner, polymorphic: true, optional: true
  belongs_to :user
  include AssetUploader::Attachment.new(:file)
end