class SubscriptionItem < ApplicationRecord
  belongs_to :user
  belongs_to :plan
  belongs_to :subscription
end