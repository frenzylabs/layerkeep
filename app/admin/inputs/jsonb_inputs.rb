class JsonbInput < Formtastic::Inputs::TextInput

  def current_value
    (object.public_send(method) || {}).to_json
  end

  def input_html_options
    { value: current_value, class: 'js-jsoneditor' }.merge(super)
  end

  def to_html
    input_wrapping do
      label_html << builder.text_area(method, input_html_options)
    end
  end

end