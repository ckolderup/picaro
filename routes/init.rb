class Picaro < Sinatra::Application
  enable :sessions
  register Sinatra::Subdomain

  require_relative 'main'
  require_relative 'account'
  require_relative 'find'

  require_relative 'api/find'
end

