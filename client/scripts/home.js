var React = require('react');

/** Attendees */

var AttendingApp = require('../components/AttendingApp.js');
var attendingAppTarget = document.getElementById('react-attending');
if (attendingAppTarget) {
	React.render(<AttendingApp />, attendingAppTarget);
}

/** Hero (RSVP Button) */

var HeroApp = require('../components/HeroApp.js');
var heroAppTarget = document.getElementById('react-hero-button');
if (heroAppTarget) {
	React.render(<HeroApp />, heroAppTarget);
}

/* Table for Chat Page */

var ChatTable = require('../components/ChatTable.js')
var chatTableTarget = document.getElementById('react-chat-table');
if (chatTableTarget) {
	React.render(<ChatTable />, chatTableTarget);
}