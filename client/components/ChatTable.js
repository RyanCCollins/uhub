var React = require('react');
var request = require('superagent');
var ChatStore = require('../stores/ChatStore');

var ChatTable = React.createClass({

	getInitialState: function() {
		return {
			isReady: ChatStore.isLoaded(),
			rooms: ChatStore.getRooms()
		};
	},

	componentDidMount: function() {
		ChatStore.addChangeListener(this.updateStateFromStore);
	},

	componentWillUnmount: function() {
		ChatStore.removeChangeListener(this.updateStateFromStore);
	},

	updateStateFromStore: function() {
		this.setState({
			isReady: ChatStore.isLoaded(),
			rooms: ChatStore.getRooms()
		});
	},

	renderHeading: function() {
		if (!this.state.isReady) return <h3 className="heading-with-line">...</h3>;
		var count = this.state.users ? this.state.users.length : '...';
		var plural = count === 1 ? ' person is' : ' people are';
		return <h3 className="heading-with-line"> {count + plural} chatting now.</h3>;
	},

	render: function() {
		var usersList;
		if (this.state.isReady) {
			usersList = this.state.users.map(function(person) {
				return <li key={person.id}><a href={person.url}><img width="40" height="40" alt={person.name} className="img-circle" src={person.photo ? person.photo : "/images/avatar.png"} /></a></li>
			});
		}
		return (
			<div>
				<section className="chatting">
					{this.renderHeading()}
					<ul className="list-unstyled list-inline text-center attendees-list">
						{usersList}
					</ul>
				</section>
			</div>
			//<div>
			// 	{this.renderHeading()}
			// 	<div className="hero-button">
			// 		<div id="chats" data-id={this.state.chats._id} className="form-row meetup-toggle">
			// 			<div className="col-xs-6">
			// 				<button type="button" onClick={this.toggleRSVP.bind(this, true)} className={"btn btn-lg btn-block btn-default js-rsvp-attending" + attending}>Yes</button>
			// 			</div>
			// 			<div className="col-xs-6">
			// 				<button type="button" onClick={this.toggleRSVP.bind(this, false)} className={"btn btn-lg btn-block btn-default js-rsvp-decline" + notAttending}>No</button>
			// 			</div>
			// 		</div>
			// 	</div>
			// </div>
		);
	}

});

module.exports = AttendingApp;