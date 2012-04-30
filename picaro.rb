require 'sinatra'
require 'data_mapper'
require 'rack'
require 'sinatra/flash'
require 'andand'
require 'httparty'
require File.dirname(__FILE__) + '/app/lib/ruby_ext'
require File.dirname(__FILE__) + '/app/lib/game_file_helpers'

use Rack::Session::Cookie

class Picaro < Sinatra::Application
  enable :sessions
  helpers Sinatra::GameFileHelpers

  register Sinatra::Flash

  set :root, File.dirname(__FILE__)
end

require_relative 'models/init'
require_relative 'routes/init'
