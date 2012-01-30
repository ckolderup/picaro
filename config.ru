require 'rubygems'
require 'bundler'

Bundler.require

require './picaro'
run Sinatra::Application
