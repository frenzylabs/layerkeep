class Contact < ApplicationRecord
  belongs_to :user, optional: true
  validates :first_name, :email, :message, presence: true
end