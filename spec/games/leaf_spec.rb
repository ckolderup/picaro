require File.dirname(__FILE__) + '/../acceptance_helper'

describe "Playing Picaro" do

  context '/leaf' do
    before do
      play '/leaf'
      take_screenshot
      latest_update.should have_content 'You see a Rake and a Leaf.'
    end

    describe "using" do
      let(:use)      { find('#footer-use a') }
      let(:take)      { find('#footer-take a') }

      let(:take_menu) { find('#action-take') }
      let(:use_menu) { find('#action-use') }

      let(:leaf_link) { action_link 'take', 'leaf' }
      let(:rake_link) { action_link "take", "rake" }

      context "the rake on the leaf" do
        it "tells the player why the leaf can't be taken, leaving it in the take menu" do
          take.click
          leaf_link.should be_visible
          leaf_link.click
          lat.should have_content("You can't take the Leaf. You're not tall enough.")

          take.click
          leaf_link.should be_visible
        end

        it "is possible after taking the rake" do
          take.click
          rake_link.click

          latest_update.should have_content 'You take the Rake.'

          use.click
          leaf_link.click

          latest_update.should have_content('You\'re able to catch the leaf on one of the rake\'s rusty tines and bring it on down.')
          page.should_not have_selector action_link('use', 'leaf')
          page.should_not have_selector action_link('take', 'leaf')
        end
      end
    end
  end
end