class Package < ApplicationRecord
  has_many :package_plans
  has_many :plans, :through => :package_plans  # Edit :needs to be plural same as the has_many relationship   
  has_many :subscriptions

  accepts_nested_attributes_for :package_plans
end