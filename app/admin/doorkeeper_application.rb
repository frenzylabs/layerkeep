ActiveAdmin.register Doorkeeper::Application do
  permit_params :name, :scopes, :confidential, :redirect_uri
end