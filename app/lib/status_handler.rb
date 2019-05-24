class StatusHandler

  DEFAULT_RETRY_TIMEOUT = 15

  def initialize(opts = {})
    puts "INIT RABBITMQ StatusHandler"
    @status_queue_name = "svc.slice_status"
    @retries_left = @max_retries = opts['max_retries'] || -1
    @retry_timeout = opts['retry_timeout'] || DEFAULT_RETRY_TIMEOUT
  end

  def queue_name 
    @status_queue_name
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
    opts = {durable: true, arguments: {"x-dead-letter-exchange" => "DLX"}}
    if self.connection.queue_exists?(self.queue_name)
      opts[:passive] = true
    end
    q = self.status_channel.queue(self.queue_name, opts)
    q.bind(status_exchange, routing_key: 'slice.status.#').subscribe(manual_ack: true) do |meta, properties, payload|
    
      puts "Status Meta Content #{meta.inspect}"
      puts "Status Payload #{payload.inspect}"

      begin
        content = JSON.parse(payload)
        
        if content["slice_id"] 
          slice = Slice.includes([:user, project_files: :repo]).find(content["slice_id"])
          
          status = meta[:routing_key].split(".").last

          unless ["complete", "failed", "success"].include?(slice.status)
            slice.filepath = content["filepath"] if content["filepath"] 
            slice.status = status
            slice.save!
            project_name = slice.project_files.first.repo.name
            body = {
              id: slice.id,
              kind: 'slice',
              status: status,
              message: "Slice for #{project_name} has status: #{status}",
              path: "/#{slice.user.username}/projects/#{project_name}/slices/#{slice.id}"
            }
            UserPublisher.publish(body.to_json, slice.user.username)
          end
        end
        puts "ABOUT TO ACKNOWLEDGE"
        self.status_channel.acknowledge(meta.delivery_tag)
      rescue => e
        puts "Slice Status Processing Error #{e.inspect}"
        self.status_channel.reject(meta.delivery_tag, !meta.redelivered?)
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
    AMQPConnectionManager.establish_connection unless AMQPConnectionManager.amqp_connection
    @connection ||= AMQPConnectionManager.amqp_connection
  end

  def close
    @connection.close unless @connection.closed?
    @connection = nil
    @status_channel = nil
  end
end