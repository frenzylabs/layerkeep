class Subscription < ApplicationRecord
  belongs_to :user
  belongs_to :package
  has_many :items, class_name: 'SubscriptionItem'
  accepts_nested_attributes_for :items
end