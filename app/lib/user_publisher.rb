module UserPublisher
  def self.publish_header(message = "", route = "#", headers = {}, exchange = "amq.headers")
    channel.confirm_select
    x        = channel.headers(exchange, durable: true)
    x.publish(message,
              routing_key: route,
              persistent: true,
              content_type: 'application/json',
              app_id: 'layerkeep',
              headers:  headers
             )
    confirmed = channel.wait_for_confirms
    fail PublisherError unless confirmed
    confirmed
  rescue => e
    puts "PUBLISH EXCEPTION = #{e.inspect}"
    false
  end

  def self.publish(message = "", route = "LK.#", exchange = "amq.topic")
    # channel.confirm_select
    x        = channel.topic(exchange, durable: true)
    x.publish(message,
              routing_key: route, persistent: true,
              content_type: 'application/json',
              app_id: 'layerkeep'
             )
    # confirmed = channel.wait_for_confirms
    # fail PublisherError unless confirmed
    # confirmed
  rescue => e
    puts "PUBLISH EXCEPTION = #{e.inspect}"
    false
  end  

  def self.channel
    @channel ||= connection.create_channel
  end

  def self.connection
    AMQPConnectionManager.establish_users_connection if AMQPConnectionManager.amqp_users_connection.nil?
    @connection ||= AMQPConnectionManager.amqp_users_connection
  end

  def self.close
    @connection.close unless @connection.closed?
    @connection = nil
    @channel = nil
  end
end