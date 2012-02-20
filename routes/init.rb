class Picaro < Sinatra::Application
  enable :sessions

  require_relative 'main'
  require_relative 'account'
  require_relative 'find'

  require_relative 'api/find'

  require_relative 'errors'
end

