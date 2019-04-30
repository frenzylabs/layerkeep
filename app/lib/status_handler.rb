class StatusHandler

  DEFAULT_RETRY_TIMEOUT = 15

  def initialize(opts = {})
    puts "INIT RABBITMQ StatusHandler"
    @retries_left = @max_retries = opts['max_retries'] || -1
    @retry_timeout = opts['retry_timeout'] || DEFAULT_RETRY_TIMEOUT
  end

  def start    
    @status_thread = Thread.new { run }
    
  end

  def stop
    self.close() 
    @status_thread.join    
  end

  def run
    begin
      puts "INSIDE RUN Status here"
      setup_slice_status_subscriber

    rescue => ex
      puts "** RABBITMQ STATUS ERROR #{ex.inspect}"
      @retries_left -= 1 if @retries_left > 0
      if @retries_left != 0
        sleep(@retry_timeout)
        retry
      end
    end
  end

  def setup_slice_status_subscriber
    self.status_channel.prefetch(10)
    q = self.status_channel.queue('slice_status', durable: true)
    q.bind(status_exchange, routing_key: 'slice.status.#').subscribe(manual_ack: true) do |meta, properties, payload|
    
      puts "Status Meta Content #{meta.inspect}"
      puts "Status Payload #{payload.inspect}"

      begin
        content = JSON.parse(payload)
        
        if content["slice_id"] 
          slice = Slice.find(content["slice_id"])

          status = meta[:routing_key].split(".").last

          unless ["complete", "failed"].include?(slice.status)
            slice.filepath = content["filepath"] if content["filepath"] 
            slice.status = status
            slice.save!
          end
        end

        status_channel.acknowledge(meta.delivery_tag)
      rescue => e
        puts "Slice Status Processing Error #{e.inspect}"
      end
    end
  end

  def status_exchange
    @status_exchange ||= status_channel.topic('amq.topic', durable: true)
  end

  def status_channel
    @status_channel ||= connection.create_channel
  end

  def connection
    @connection ||= AMQPConnectionManager.amqp_connection
  end

  def close
    @connection.close unless @connection.closed?
    @connection = nil
    @status_channel = nil
  end
end