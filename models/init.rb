DataMapper.setup(:default, ENV['DATABASE_URL'] || "sqlite://#{Dir.pwd}/picaro.db")

require_relative 'user'
require_relative 'game'
require_relative 'version'
require_relative 'url'

DataMapper.auto_upgrade!
