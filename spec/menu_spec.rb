# encoding: utf-8
require File.dirname(__FILE__) + '/acceptance_helper'

describe "Picaro menus" do
  before do
    play '/leaf'
  end

  context "opening and closing menus" do
    it "shows and hides the UI actions" do
      page.should have_selector "#footer-look"
      page.should have_selector "#footer-take"
      page.should have_selector "#footer-use"
      page.should have_selector "#footer-talk"
      page.should have_selector "#footer-attack"

      find('#action-look').should be_invisible
      find('#action-take').should be_invisible
      find('#action-use').should be_invisible
      find('#action-talk').should be_invisible
      find('#action-attack').should be_invisible

      click_on 'Look'
      find('#action-look').should be_visible

      click_on 'Talk'
      find('#action-talk').should be_visible
      find('#action-look').should be_invisible

      click_on 'Take'
      find('#action-take').should be_visible
      find('#action-talk').should be_invisible
    end
  end

end