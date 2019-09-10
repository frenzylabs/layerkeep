class Plan < ApplicationRecord
  belongs_to :product
  has_many :package_plans
  has_many :packages, :through => :package_plans  # Edit :needs to be plural same as the has_many relationship   
  
end