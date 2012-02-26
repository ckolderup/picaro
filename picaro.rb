require 'sinatra'
require 'data_mapper'
require 'rack'
require 'sinatra/flash'
require 'andand'
require 'httparty'

use Rack::Session::Cookie

class Picaro < Sinatra::Application
  enable :sessions
  register Sinatra::Flash

  set :root, File.dirname(__FILE__)
end

require_relative 'models/init'
require_relative 'routes/init'
