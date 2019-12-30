require 'status_handler'
module AMQPConnectionManager

  mattr_accessor :amqp_connection, :amqp_users_connection
  mattr_accessor :publish_channel
  mattr_accessor :subscribers

  def self.start_status_handler
    self.subscribers ||= []
    status_handeler = StatusHandler.new
    self.subscribers << status_handeler
    status_handeler.start()
  end
  
  def self.establish_connection    
    Rails.logger.info("The rabbit = #{Rails.application.config.settings["rabbitmq_url"]}")
    self.amqp_connection = Bunny.new(Rails.application.config.settings["rabbitmq_url"]).tap do |c|
      c.start
    end
    
  end

  def self.establish_users_connection 
    Rails.logger.info("The rabbit users= #{Rails.application.config.settings["rabbitmq_url"]}")
    self.amqp_users_connection = Bunny.new("#{Rails.application.config.settings["rabbitmq_url"]}/users").tap do |c|
      c.start
    end
  end
end
