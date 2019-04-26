class Repo < ApplicationRecord
  belongs_to :user

  validates :name, presence: true
  validates :name, uniqueness: {scope: [:user, :kind], case_sensitive: false}
end
