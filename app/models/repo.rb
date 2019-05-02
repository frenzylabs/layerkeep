class Repo < ApplicationRecord
  belongs_to :user

  validates :name, presence: true
  validates_format_of :name, :with => /\A[a-zA-Z][a-zA-Z0-9-]*[a-zA-Z0-9]\Z/i, :on => :create
  validates :name, uniqueness: {scope: [:user, :kind], case_sensitive: false}
end
