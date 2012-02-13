require File.dirname(__FILE__) + '/acceptance_helper'

describe "Navigating between rooms" do
  before { play '/hmm' }

  let(:move_action)  { find "#header-move" }
  let(:compass_rose) { find('#move-compass') }
  let(:room_header)  { find('#header h2') }

  it "starts with a compas rose" do
    move_action.should be_visible
    compass_rose.should_not be_visible

    move_action.click
    compass_rose.should be_visible

    find('#move-compass-north')[:class].should be_empty
    find('#move-compass-east')[:class].should be_empty
    find('#move-compass-south')[:class].should be_empty
    find('#move-compass-west')[:class].should == "disabled"
  end

  it "updates the room header and game status" do
    room_header.text.should == "LIVING ROOM"
    latest_update.text.should match /You see a Coffee Table, a Couch, a Jackalope and a Pair of Sunglasses./

    move_action.click
    click_compass_direction :north

    room_header.text.should == "KITCHEN"
    latest_update.text.should match /You are in the kitchen./
    latest_update.text.should match /You see a Stove./

    move_action.click
    find('#move-compass-north')[:class].should == "disabled"
    find('#move-compass-east')[:class].should == "disabled"
    find('#move-compass-west')[:class].should == "disabled"
    find('#move-compass-south')[:class].should be_empty

    click_compass_direction :south
    room_header.text.should == "LIVING ROOM"
    latest_update.text.should match /You see a Coffee Table, a Couch, a Jackalope and a Pair of Sunglasses./
  end

  it "can get pretty twisty" do
    room_header.text.should == "LIVING ROOM"
    move_action.click

    click_compass_direction :east
    room_header.text.should == "BATHROOM"
    move_action.click

    click_compass_direction :west
    room_header.text.should == "LIVING ROOM"
    move_action.click

    click_compass_direction :south
    room_header.text.should == "JOE'S ROOM"
    move_action.click

    click_compass_direction :north
    room_header.text.should == "LIVING ROOM"
  end
end