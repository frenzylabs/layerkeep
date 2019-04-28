module Publisher
  # def publish(payload)
  #   channel_pool.with do |channel|
  #     configure_channel(channel).publish(payload.to_json)
  #   end
  # end
  # def channel_pool
  #   @channel_pool ||= AMQPConnectionManager.channel_pool
  # end

  def self.publish(message = "", route = "#", exchange = "amq.topic")
    channel.confirm_select
    x        = channel.topic(exchange, durable: true)
    x.publish(message,
              routing_key: route, persistent: true,
              content_type: 'application/json',
              app_id: 'layerkeep'
             )
    confirmed = channel.wait_for_confirms
    fail PublisherError unless confirmed
    confirmed
  rescue => e
    puts "PUBLISH EXCEPTION = #{e.inspect}"
    false
  end

  def self.bind_queue(queue_name, routing_key)
    x    = channel.topic("streams", :durable => true)
    q    = channel.queue(queue_name, :durable => true).bind(x, :routing_key => routing_key)
    q
  rescue => e
    puts "BIND EXCEPTION = #{e.inspect}"
    false
  end   

  def self.channel
    @channel ||= connection.create_channel
  end

  def self.connection
    @connection ||= AMQPConnectionManager.amqp_connection
  end

  def self.close
    @connection.close unless @connection.closed?
    @connection = nil
    @channel = nil
  end
end