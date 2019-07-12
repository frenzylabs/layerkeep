#
# routes.rb
# LayerKeep
#
# Created by Wess Cope (me@wess.io) on 04/23/19
# Copyright 2018 WessCope
#


Rails.application.routes.draw do

  use_doorkeeper
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

  authenticated :user do
    root to: redirect {|params, request| 
      current_user = request.env["warden"].user(:user)
      current_user ? "/#{current_user.username}/projects/" : '/'
    }
  end

  post 'oauth/access_tokens', to: 'auth#access_token'

  root to: 'main#index'

  
  get '/auth/:kind', to: 'auth#stomp'
  post '/auth/:kind', to: 'auth#stomp'
  get '/auth', to: 'auth#stomp'
  post '/auth', to: 'auth#stomp'

  post 'user/settings', to: 'user#settings'

  get '/slicer_engines', to: 'slicer_engines#index'

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

  scope ':user' do
    get 'slices/:id/gcodes', to: 'slices#gcodes', as: "show_gcodes", constraints: { id: /\d+/ }
    resources :slices, constraints: lambda { |req| req.format == :json }

    scope 'profiles', defaults: {kind: 'profiles'}, constraints: lambda { |req| req.xhr? && req.format == :json } do
      concerns :repo_files, as_kind: 'profiles'
    end

    scope 'projects', defaults: {kind: 'projects'}, constraints: lambda { |req| req.xhr? && req.format == :json } do
      concerns :repo_files, as_kind: 'projects'
      
    end
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

  get '*page', to: 'user#index', constraints: ->(req) do
    req.format = :html
    !req.xhr? 
  end

end
