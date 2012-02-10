require File.dirname(__FILE__) + '/../acceptance_helper'

describe "Playing Picaro/leaf_user: " do

  before { play '/leaf_user' }

  describe "using" do
    let(:use)       { find('#footer-use a') }
    let(:take)      { find('#footer-take a') }
    let(:take_menu) { find('#action-take') }
    let(:use_menu)  { find('#action-use') }

    context "the rake on the leaf" do
      it "takes the leaf and wins the game" do
        latest_update.should have_content 'You see a Rake and a Leaf.'

        take.click
        action_link('take', 'rake').click
        latest_update.should have_content 'You take the Rake.'

        use.click
        use_menu.should be_visible
        action_link('use', 'rake').click
        use_menu.should be_visible

        #using the rake on the leaf
        action_link('use', 'leaf').click

        # the events fire too fast to catch all of them as the latest update... perhaps implement a brief wait in game code?
        older_updates.any? {|node| node.text == 'You take the Leaf.'}.should be_true
        older_updates.any? {|node| node.text == "You're able to catch the leaf on one of the rake\'s rusty tines and bring it on down."}.should be_true
        latest_update.should have_content('Using the leaf, you cure scabies.')

        page.should have_no_selector action_link_selector('take', 'leaf')
        page.should have_no_selector action_link_selector('take', 'rake')
      end
    end

  end
end