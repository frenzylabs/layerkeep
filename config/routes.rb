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

  # FOR REACT ONCE WE DASHBOARD
  #
  # get '*page', to: 'main#index', constraints: ->(req) do
  #   !req.xhr? && req.format.html?
  # end

end
