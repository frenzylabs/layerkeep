#
# routes.rb
# LayerKeep
#
# Created by Wess Cope (me@wess.io) on 04/23/19
# Copyright 2018 WessCope
#


Rails.application.routes.draw do
  mount StripeEvent::Engine, at: '/stripe' # provide a custom path
  use_doorkeeper do
    controllers :tokens => 'oauth_tokens'
  end
  
  devise_for :users, controllers: { sessions: "users/sessions", registrations: "users/registrations" }

  ## Admin subdomain routes
  scope path: '/', constraints: { subdomain: 'admin' } do
    authenticated :user, lambda { |u| u.admin? } do
      ActiveAdmin.routes(self)
      root to: redirect {|params, request| 
        current_user = request.env["warden"].user(:user)
        "/admin/"
      }
    end
    # Redirect Non Admin User back to regular subdomain
    authenticated :user, lambda { |u| !u.admin? } do
      root to: redirect {|params, request| 
        current_user = request.env["warden"].user(:user)
        "#{request.scheme}://#{request.domain}/"
      }
    end
    authenticate :user, lambda { |u| u.admin? } do
      root to: 'active_admin/devise/sessions#new' 
    end
    match '*path', to: redirect('/'), via: :all
  end

  unauthenticated :user do
    get '/projects/new', to: redirect {|params, req|
      req.session[:redirect_uri] = req.fullpath
      '/users/sign_in'
    }
  end

  authenticated :user do    
    get '/projects/new', to: redirect {|params, req|
      current_user = req.env["warden"].user(:user)
      current_user ? "/#{current_user.username}#{req.fullpath}" : '/'
    }

    root to: redirect {|params, request| 
      current_user = request.env["warden"].user(:user)
      current_user ? "/#{current_user.username}/projects/" : '/'
    }
  end
  
  
  post 'contact-us', to: 'contacts#create'
  # get 'contact-us', to: 'contacts#index'

  post 'oauth/access_tokens', to: 'auth#access_token'

  root to: 'main#index'

  # Stomp calls come from Rabbitmq 
  get '/auth/:kind', to: 'amqp_auth#stomp'
  post '/auth/:kind', to: 'amqp_auth#stomp'
  get '/auth', to: 'amqp_auth#stomp'
  post '/auth', to: 'amqp_auth#stomp'

  post 'user/settings', to: 'users#settings'



  
  

  concern :repo_files do |options|
    options ||= {}
    get ':repo_name/revisions', {action: 'index', to: 'revisions#index', as: "default_#{options[:as_kind]}_revisions", defaults: {revision: 'master'}}.merge(options)
    get ':repo_name/revisions/:revision', {action: 'index', to: 'revisions#index', as: "#{options[:as_kind]}_revisions", defaults: {revision: 'master'}, constraints: { revision: /.*/ }}.merge(options)
    get ':repo_name/revision/:revision', {action: 'show', to: 'revisions#show', as: "show_#{options[:as_kind]}_revision", constraints: { view: 'files', revision: /.*/ }}.merge(options)
    # get ':repo_name/content/:revision', {action: 'show', to: 'content#show', as: "download_#{options[:as_kind]}_files", constraints: { view: 'files', revision: /.*/ }}.merge(options)
    get ':repo_name/files/:revision/:filepath', {action: 'show', to: 'files#show', as: "edit_#{options[:as_kind]}_files", constraints: { view: 'files', revision: /.*/, filepath: /.*/ }}.merge(options)
    delete ':repo_name/files/:revision/:filepath', {action: 'destroy', to: 'files#destroy', as: "destroy_#{options[:as_kind]}_files", constraints: { view: 'files', revision: /.*/, filepath: /.*/ }}.merge(options)
    get ':repo_name/tree/:revision', {action: 'index', to: 'files#index', as: "#{options[:as_kind]}_revision_tree", defaults: {view: 'tree'}, constraints: { revision: /.*/ }}.merge(options)
    post ':repo_name/tree/:revision', {action: 'create', to: 'files#create', as: "create_#{options[:as_kind]}_revision_file", defaults: {view: 'tree'}, constraints: { revision: /.*/ }}.merge(options)

    post ':repo_name/upload', {action: 'create', to: 'files#upload', as: "upload_#{options[:as_kind]}_revision_file", defaults: {view: 'tree'}}.merge(options)
    post ':repo_name/clear_uploads', {action: 'destroy', to: 'files#clear_uploads', as: "clear_upload_#{options[:as_kind]}_revision_file", defaults: {view: 'tree'}}.merge(options)

    get ':repo_name', {action: 'show', to: 'repos#show', as: "edit_#{options[:as_kind]}"}.merge(options)
    patch ':repo_name', {action: 'update', to: 'repos#update', as: "update_#{options[:as_kind]}"}.merge(options)
    delete ':repo_name', {action: 'destroy', to: 'repos#destroy', as: "delete_#{options[:as_kind]}"}.merge(options)
    get '/', {action: 'index', to: 'repos#index', as: "#{options[:as_kind]}"}.merge(options)
    post '/', {action: 'create', to: 'repos#create', as: "create_#{options[:as_kind]}"}.merge(options)
  end

  get ':user/profiles/:repo_name/content/:revision', {action: 'show', to: 'content#show', as: "download_profiles_files", constraints: { view: 'files', revision: /.*/ }, defaults: {kind: 'profiles'}}
  get ':user/projects/:repo_name/content/:revision', {action: 'show', to: 'content#show', as: "download_projects_files", constraints: { view: 'files', revision: /.*/ }, defaults: {kind: 'projects'}}

  
  scope '/', constraints: GitHttp::Constraint.new do
    mount GitHttp::Engine => '/'
  end

  # defaults format: :json do
  concern :user_routes do |options|
  
    get 'features', to: 'users#features'
    scope 'billing' do
      resources :subscriptions
      patch 'subscription_items/:item_id', to: 'subscription_items#update'
      resources :cards, controller: 'user_cards'
    end
    # post 'assets/:owner/presign', to: 'assets#presign'
    # post 'assets/:owner/:owner_id/presign', to: 'assets#presign'

    post ':owner/assets/presign', to: 'assets#presign', constraints: { owner: /(slices|prints)/ }
    get ':owner/:owner_id/assets/:id/download', to: 'assets#download', constraints: { owner: /(slices|prints)/ }

    get 'slices/:id/gcodes', to: 'slices#gcodes', constraints: { id: /\d+/ }
    post 'slices/generate', to: 'slices#generate'    
    # , constraints: lambda { |req| req.format == :json } 
    resources :slices do
      resources :assets do
        member do
          get "download", to: 'assets#download'
        end
      end
    end

    # resources :prints, constraints: lambda { |req| req.format == :json } do
    #   resources :assets
    # end
    resources :prints do
      resources :assets
    end

    resources :printers do
      collection do
        get 'printer_count', to: 'printers#printer_count'
      end
    end

    # resources :gcodes, controller: 'gcodes', constraints: lambda { |req| req.format == :json }
    # post 'gcodes/presign', to: 'gcodes#presign'
    # constraints: lambda { |req| req.accept.match?(/json/) && req.format == :json } 
    scope 'profiles', defaults: {kind: 'profiles'} do
      concerns :repo_files, as_kind: "#{options[:prefix] || ""}profiles"
    end

    scope 'projects', defaults: {kind: 'projects'} do
      concerns :repo_files, as_kind: "#{options[:prefix] || ""}projects"
      
    end
  end
  
  scope "api", as: "api", defaults: {format: :json} do
    post 'user/settings', to: 'users#settings'
    get '/users/me', to: 'users#me'
    get '/slicer_engines', to: 'slicer_engines#index'
    get '/remote_sources', to: 'remote_sources#index'
  
    get '/packages', to: 'packages#index'
    get '/plans', to: 'plans#index'
    get '/products', to: 'products#index'
    scope ':user' do
      concerns :user_routes, prefix: "api_"
    end
  end

  scope ':user', as: 'user', defaults: {format: :html} do
    concerns :user_routes
    get '/', to: redirect {|params, req|
      user = req.params[:user]
      "/#{user}/projects"
    }
  end

#     /:username/profiles/
# ReposController get from repos table where kind = profiles
# /:username/profiles/:profile_name/:kind/:branch_or_commit_oid/
# /kmussel/profiles/settings.ini/  
# /kmussel/profiles/settings.ini/tree/123123123   ->  view 
# /kmussel/profiles/settings.ini/file/123123123/filename   ->  view single file details
# /kmussel/profiles/settings.ini/content/master
# /:username/profiles/:profile_name/upload
# would replace the current file in 


  # REACT

  get '*page', to: 'users#index', constraints: ->(req) do
    req.format = :html
    !req.xhr? 
  end

end
