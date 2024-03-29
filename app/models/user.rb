#
# user.rb
# LayerKeep
#
# Created by Wess Cope (me@wess.io) on 04/23/19
# Copyright 2018 WessCope
#

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable  
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable         
  # has_and_belongs_to_many :organizations  
  has_one  :layerkeep_subscription, -> { where(name: 'layerkeep' ) }, class_name: 'Subscription'
  has_many :subscriptions
  has_many :subscription_items
  has_many :user_cards
  has_many :slices
  has_many :printers
  has_many :prints
  has_many :assets


  validates :username, length: {minimum: 2}
  validates_format_of :username, :with => /\A[0-9a-zA-Z][a-zA-Z0-9\-_]*[a-zA-Z0-9]\Z/i, :on => :create

  has_many :repos, class_name: 'Repo'
  has_many :profiles, -> { where(kind: 'profile') }, class_name: 'Repo'
  has_many :projects, -> { where(kind: 'project') }, class_name: 'Repo'

  has_many :access_grants,
           class_name: 'Doorkeeper::AccessGrant',
           foreign_key: :resource_owner_id,
           dependent: :delete_all # or :destroy if you need callbacks

  has_many :access_tokens,
           class_name: 'Doorkeeper::AccessToken',
           foreign_key: :resource_owner_id,
           dependent: :delete_all # or :destroy if you need callbacks
  
  attr_accessor :login

  def active_for_authentication?
    super && active? && approved?
  end
  
  def inactive_message
    self.approved? ? (self.active? ? super : "User Not Active") : "User Has Not Been Approved" 
  end

  def self.find_for_database_authentication(warden_conditions) 
    conditions = warden_conditions
    login = conditions.delete(:login)

    where(conditions).where(["lower(username) = :value OR lower(email) = :value", {value: login.strip.downcase}]).first
  end

  def self.send_reset_password_instructions attributes = {}
    recoverable = find_recoverable_or_initialize_with_errors(reset_password_keys, attributes, :not_found)
    recoverable.send_reset_password_instructions if recoverable.persisted?
    recoverable
  end

  def self.find_recoverable_or_initialize_with_errors required_attributes, attributes, error = :invalid
    (case_insensitive_keys || []).each {|k| attributes[k].try(:downcase!)}

    attributes = attributes.slice(*required_attributes)
    attributes.delete_if {|_key, value| value.blank?}

    if attributes.keys.size == required_attributes.size
      if attributes.key?(:login)
        login = attributes.delete(:login)
        record = find_record(login)
      else
        record = where(attributes).first
      end
    end

    unless record
      record = new

      required_attributes.each do |key|
        value = attributes[key]
        record.send("#{key}=", value)
        record.errors.add(key, value.present? ? error : :blank)
      end
    end
    record
  end

  def self.find_record login
    where(["username = :value OR email = :value", {value: login}]).first
  end

  def subscription_handler
    @subscription_handler ||= SubscriptionHandler.new(self)
  end
  def has_valid_subscription(nickname) 

  end
end
