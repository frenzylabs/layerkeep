class Printer < ApplicationRecord
  has_many :prints  
  belongs_to :user

  validates :name, uniqueness: {scope: [:user], case_sensitive: false}
  
end