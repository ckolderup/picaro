class Picaro < Sinatra::Application
  enable :sessions

  require 'yaml'

  require_relative 'main'
  require_relative 'account'
  require_relative 'find'
  require_relative 'editor'

  require_relative 'api/find'

  require_relative 'errors'
end