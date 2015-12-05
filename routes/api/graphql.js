// var GraphQL = require('graphql');
// var keystone = require('keystone');

// var Meetup = keystone.list('Meetup');
// var Talk = keystone.list('Talk');

// function getMeetup (id) {
// 	if (id === 'next') {
// 		return Meetup.model.findOne().sort('-startDate').where('state', 'active');
// 	} else if (id === 'last') {
// 		return Meetup.model.findOne().sort('-startDate').where('state', 'past');
// 	} else {
// 		return Meetup.model.findById(id);
// 	}
// }

// var meetupStateEnum = new GraphQL.GraphQLEnumType({
// 	name: 'MeetupState',
// 	description: 'The state of the meetup',
// 	values: {
// 		draft: {
// 			value: 'draft',
// 			description: 'Draft'
// 		},
// 		scheduled: {
// 			value: 'scheduled',
// 			description: 'Scheduled'
// 		},
// 		active: {
// 			value: 'active',
// 			description: 'Active'
// 		},
// 		past: {
// 			value: 'past',
// 			description: 'Past'
// 		},
// 	},
// });

// var meetupType = new GraphQL.GraphQLObjectType({
// 	name: 'Meetup',
// 	fields: () => ({
// 		id: {
// 			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
// 			description: 'The id of the meetup.',
// 		},
// 		name: {
// 			type: GraphQL.GraphQLString,
// 			description: 'The name of the meetup.',
// 		},
// 		publishedDate: {
// 			type: GraphQL.GraphQLString,
// 		},
// 		state: {
// 			type: meetupStateEnum,
// 		},
// 		startDate: {
// 			type: GraphQL.GraphQLString,
// 		},
// 		endDate: {
// 			type: GraphQL.GraphQLString,
// 		},
// 		place: {
// 			type: GraphQL.GraphQLString,
// 		},
// 		map: {
// 			type: GraphQL.GraphQLString,
// 		},
// 		description: {
// 			type: GraphQL.GraphQLString,
// 		},
// 		maxRSVPs: {
// 			type: GraphQL.GraphQLInt,
// 		},
// 		totalRSVPs: {
// 			type: GraphQL.GraphQLInt,
// 		},
// 	}),
// });

// var talkType = new GraphQL.GraphQLObjectType({
// 	name: 'Talk',
// 	fields: () => ({
// 		id: {
// 			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
// 			description: 'The id of the talk.',
// 		},
// 		name: {
// 			type: GraphQL.GraphQLString,
// 			description: 'The title of the talk.',
// 		},
// 		isLightningTalk: {
// 			type: GraphQL.GraphQLBoolean,
// 			description: 'Whether the talk is a Lightning talk',
// 		},
// 		meetup: {
// 			type: meetupType,
// 			description: 'The Meetup the talk is scheduled for',
// 		},
// 		// TODO: who (relationship to User)
// 		description: {
// 			type: GraphQL.GraphQLString,
// 		},
// 		slides: {
// 			type: GraphQL.GraphQLString,
// 		},
// 		link: {
// 			type: GraphQL.GraphQLString,
// 		},
// 	}),
// });

// function getTalk (id) {
// 	return Talk.model.findById(id);
// }

// var schema = new GraphQL.GraphQLSchema({
// 	query: new GraphQL.GraphQLObjectType({
// 		name: 'RootQueryType',
// 		fields: () => ({
// 			meetup: {
// 				type: meetupType,
// 				args: {
// 					id: {
// 						description: 'id of the meetup, can be "next" or "last"',
// 						type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString)
// 					},
// 				},
// 				resolve: (root, args) => getMeetup(args.id),
// 			},
// 			talk: {
// 				type: talkType,
// 				args: {
// 					id: {
// 						description: 'id of the talk',
// 						type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString)
// 					},
// 				},
// 				resolve: (root, args) => getTalk(args.id),
// 			},
// 		}),
// 	}),
// });

// module.exports = function (req, res) {
// 	GraphQL.graphql(schema, req.body)
// 		.then((result) => {
// 			res.send(JSON.stringify(result, null, 2));
// 		});
// }
