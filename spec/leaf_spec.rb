require File.dirname(__FILE__) + '/acceptance_helper'

describe Picaro do
  context 'the application root' do

    it "should help a man see about a horse" do
      visit '/'
      selector('body').text.should match /You have plenty of room for a horse/
    end
  end

  context '/play' do
    it "has basic interface elements" do
      play '/leaf'
      puts selector('body').text
      selector('#footer-talk').should_not be_nil
    end
  end
end