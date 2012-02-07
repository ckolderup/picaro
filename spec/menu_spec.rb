require File.dirname(__FILE__) + '/acceptance_helper'

describe Picaro do
  context 'the application root' do
    it "should help a man see about a horse" do
      visit '/'
      selector('body').text.should match /You have plenty of room for a horse/
    end
  end

  context '/play' do
    before do
      play '/leaf'
      find('#game p.new').should have_content 'You see a Leaf and a Rake.'
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

    describe "looking" do
      let(:look)      { find('#footer-look a') }
      let(:look_menu) { find('#action-look') }
      let(:leaf_link) { find('a[data-action-id="lookLeaf"]') }
      let(:rake_link) { find('a[data-action-id="lookRake"]') }
      let(:game_text) { find('#game p.new') }

      it "updates the game text and closes the menu" do
        look_menu.should be_invisible
        look.click
        look_menu.should be_visible

        leaf_link.click
        game_text.should have_content 'It seems rather far away.'

        look.click
        rake_link.click
        game_text.should have_content 'The rake is a bit rusty.'
      end
    end

    describe "taking" do
      let(:take)      { find('#footer-take a') }
      let(:take_menu) { find('#action-take') }
      let(:leaf_link) { find('a[data-action-id="takeLeaf"]') }
      let(:rake_link) { find('a[data-action-id="takeRake"]') }
      let(:game_text) { find('#game p.new') }

      context "the rake" do
        it "updates the game text and removes it from the take menu" do
          take_menu.should be_invisible
          take.click

          take_menu.should be_visible
          rake_link.click
          game_text.should have_content('You take the Rake.')

          take.click
          page.should_not have_selector 'a[data-action-id="takeRake"]'
        end
      end

      context "the leaf" do
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

          take.click
          leaf_link.click
          game_text.should have_content('You take the Leaf.')
          page.should_not have_selector 'a[data-action-id="takeLeaf"]'
        end
      end
    end

  end
end