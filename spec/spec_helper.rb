# encoding: utf-8
require 'bundler/setup'
require 'sinatra'
require File.dirname(__FILE__) + '/../picaro'

Picaro.environment = :test
Bundler.require :default, Picaro.environment
require 'rspec'

RSpec.configure do |config|
  # config.before(:each) { Machinist.reset_before_test }
end
