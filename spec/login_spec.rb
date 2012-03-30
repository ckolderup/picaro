# encoding: utf-8
require File.dirname(__FILE__) + '/acceptance_helper'

describe Picaro do
  context 'visiting the application root' do
    it "should help a man see about a horse" do
      visit '/'
      selector('body').text.should match /You have plenty of room for a horse/
    end
  end
end