#
# assets.rb
# LayerKeep
#
# Created by Wess Cope (me@wess.io) on 04/23/19
# Copyright 2018 WessCope
#

Rails.application.config.assets.version = '1.0'
Rails.application.config.assets.paths << Rails.root.join('node_modules')
Rails.application.config.assets.paths << Rails.root.join('vendor/assets')
Rails.application.config.assets.paths << Rails.root.join('vendor/bundle')
# Rails.application.config.assets.paths += Dir["#{Rails.root}/vendor/**/*"].sort_by { |dir| -dir.size }
# Rails.application.config.assets.precompile << %r{webfonts/.*$}
Rails.application.config.assets.precompile << %r{active_admin.css}

