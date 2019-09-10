class SliceUploader < Shrine
  def generate_location(io, context)
    if context[:record]
      if context[:name] == :log
        context[:record][:log_data]["id"]
      else
        context[:record][:path]
      end
    else
      super
    end
  end
end
