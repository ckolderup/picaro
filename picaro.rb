require 'sinatra'
require 'data_mapper'
require 'rack'
require 'sinatra/flash'
require 'sinatra/subdomain'
require 'andand'

use Rack::Session::Cookie

class Picaro < Sinatra::Application
  enable :sessions
  register Sinatra::Flash
end

require_relative 'email'
require_relative 'models/init'
require_relative 'routes/init'
