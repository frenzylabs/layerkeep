#
# routes.rb
# LayerKeep
#
# Created by Wess Cope (me@wess.io) on 04/23/19
# Copyright 2018 WessCope
#

Rails.application.routes.draw do
  # User
  get 'user', to: 'user#index'

  authenticated :user do
    root to: redirect("/user")
  end

  root to: 'main#index'

  devise_for :users

  concern :repo_files do |options|
    options ||= {}
    get ':repo_name/revisions', {action: 'index', to: 'revisions#index', as: "default_#{options[:as_kind]}_revisions", defaults: {revision: 'master'}}.merge(options)
    get ':repo_name/revisions/:revision', {action: 'index', to: 'revisions#index', as: "#{options[:as_kind]}_revisions", defaults: {revision: 'master'}, constraints: { revision: /.*/ }}.merge(options)
    get ':repo_name/revision/:revision', {action: 'show', to: 'revisions#show', as: "show_#{options[:as_kind]}_revision", constraints: { view: 'files', revision: /.*/ }}.merge(options)
    # get ':repo_name/content/:revision', {action: 'show', to: 'content#show', as: "download_#{options[:as_kind]}_files", constraints: { view: 'files', revision: /.*/ }}.merge(options)
    get ':repo_name/files/:revision/:filepath', {action: 'show', to: 'files#show', as: "edit_#{options[:as_kind]}_files", constraints: { view: 'files', revision: /.*/, filepath: /.*/ }}.merge(options)
    get ':repo_name/tree/:revision', {action: 'index', to: 'files#index', as: "#{options[:as_kind]}_revision_tree", defaults: {view: 'tree'}, constraints: { revision: /.*/ }}.merge(options)
    post ':repo_name/tree/:revision', {action: 'create', to: 'files#create', as: "create_#{options[:as_kind]}_revision_file", defaults: {view: 'tree'}, constraints: { revision: /.*/ }}.merge(options)
    get ':repo_name', {action: 'show', to: 'repos#show', as: "edit_#{options[:as_kind]}"}.merge(options)
    get '/', {action: 'index', to: 'repos#index', as: "#{options[:as_kind]}"}.merge(options)
    post '/', {action: 'create', to: 'repos#create', as: "create_#{options[:as_kind]}"}.merge(options)

    # get 'upload', {action: 'new', as: "new_#{options[:controller]}"}.merge(options)
    # get ':tree/:treebranch', {action: 'index', as: "#{options[:controller]}", defaults: {tree: 'tree', treebranch: 'master'}, constraints: { tree: 'tree', treebranch: /.*/ }}.merge(options)
    # get ':files/:treebranch/:filename', {action: 'show', as: "edit_#{options[:controller]}", defaults: {files: 'files'}, constraints: { files: /files|content/, treebranch: /.*/, filename: /.*/ }}.merge(options)
    # delete ':files/:treebranch/:filename', {action: 'destroy', as: "destroy_#{options[:controller]}", defaults: {files: 'files'}, constraints: { files: 'files', treebranch: /.*/, filename: /.*/ }}.merge(options)
    # post 'upload/:treebranch', {action: 'create', as: "upload_#{options[:controller]}", defaults: {treebranch: 'master'}, constraints: { treebranch: /.*/ }}.merge(options)    
  end

  get ':user/profiles/:repo_name/content/:revision', {action: 'show', to: 'content#show', as: "download_profiles_files", constraints: { view: 'files', revision: /.*/ }, defaults: {kind: 'profiles'}}
  get ':user/projects/:repo_name/content/:revision', {action: 'show', to: 'content#show', as: "download_projects_files", constraints: { view: 'files', revision: /.*/ }, defaults: {kind: 'projects'}}

  
  scope ':user', constraints: lambda { |req| req.format == :json } do

    resources :slices, constraints: lambda { |req| req.format == :json }

    scope 'profiles', defaults: {kind: 'profiles'} do
      concerns :repo_files, as_kind: 'profiles'
    end

    scope 'projects', defaults: {kind: 'projects'} do
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
