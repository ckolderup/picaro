require File.dirname(__FILE__) + '/acceptance_helper'

describe Picaro do

  context 'taking' do
    before do
      play '/leaf_user'
      find('#game p.new').should have_content 'You see a Leaf and a Rake.'
    end

    describe "using" do
      let(:use)      { find('#footer-use a') }
      let(:take)      { find('#footer-take a') }

      let(:take_menu) { find('#action-take') }
      let(:use_menu) { find('#action-use') }

      let(:leaf_link) { find('a[data-action-id="takeLeaf"]') }
      let(:rake_link) { find('a[data-action-id="takeRake"]') }
      let(:game_text) { find('#game p.new') }

      context "the rake on the leaf" do
        it "tells the player why the leaf can't be taken, leaving it in the take menu" do
          take.click
          leaf_link.should be_visible
          leaf_link.click
          game_text.should have_content("You can't take the Leaf. You're not tall enough.")

          take.click
          leaf_link.should be_visible
        end

        it "is possible after taking the rake" do
          take.click
          rake_link.click
          game_text.should have_content('You take the Rake.')

          use.click
          leaf_link.click

          game_text.should have_content('You\'re able to catch the leaf on one of the rake\'s rusty tines and bring it on down.')
          page.should_not have_selector 'a[data-action-id="useLeaf"]'
          page.should_not have_selector 'a[data-action-id="takeLeaf"]'
        end
      end
    end
  end
end