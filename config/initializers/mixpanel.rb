require 'mixpanel-ruby'
$tracker = Mixpanel::Tracker.new(Rails.application.config.settings["mixpanel_token"])

if Rails.env.development? 
  #silence local SSL errors
  Mixpanel.config_http do |http|
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE
  end
end