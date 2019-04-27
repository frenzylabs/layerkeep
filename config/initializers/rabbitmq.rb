require 'status_handler'
module AMQPConnectionManager

  mattr_accessor :amqp_connection
  mattr_accessor :publish_channel
  mattr_accessor :subscribers

  def self.establish_connection    
    self.amqp_connection = Bunny.new(Rails.application.config.settings["rabbitmq_url"]).tap do |c|
      c.start

    end
    self.subscribers ||= []
    status_handeler = StatusHandler.new
    self.subscribers << status_handeler
    status_handeler.start()    
  end
end
