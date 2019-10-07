ActiveAdmin.register Doorkeeper::Application do
  permit_params :name, :scopes, :confidential, :redirect_uri
  controller do
    def permitted_params
      params.permit!
    end
  end
end