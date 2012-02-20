require File.dirname(__FILE__) + '/acceptance_helper'

describe "Jasmine JS specs" do
  before do
    visit "/js/test/runner.html"
  end

  it "should *all* pass" do
    page.should have_selector ".alert-message"
    page.should_not have_selector ".alert-message.failed"
    page.should_not have_selector ".alert-message.error"
  end

  after do
    if page.has_selector? '.stackTrace'
      puts "Jasmine JS spec failed:"
      puts find('.stackTrace').text
    end
  end

end