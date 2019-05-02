module LayerKeepErrors
  class LayerKeepError < StandardError
    attr_reader :status
    def initialize(msg="Revision Not Found", status=404)
      @status = status
      super(msg)
    end
  end
  class RevisionNotFound < LayerKeepError
    attr_reader :revision
    def initialize(msg="Revision Not Found", revision="")
      @revision = revision
      super(msg)
    end
  end

  class NotFound < LayerKeepError
    def initialize(msg="Not Found")
      super(msg)
    end
  end
end
