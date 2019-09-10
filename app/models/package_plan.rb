class PackagePlan < ApplicationRecord
  belongs_to :package
  belongs_to :plan
end