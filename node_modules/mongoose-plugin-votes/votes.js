'use strict';
/* jshint node: true */

var _ = require('lodash-node/modern');

/**
 * @module mongoose-plugin-votes
 * @example
```js
var votesPlugin = require('mongoose-plugin-votes');
var schema = Schema({...});
schema.plugin(votesPlugin[, OPTIONS]);
```
*/

module.exports = function votesPlugin(schema, options) {
  /**
   * @param {object} [options]
   * @param {string} options.path=votes - the path to create the propterty for storing votes.
   * @param {object} options.options - property options to set (`type` will always be `Array`). `(e.g. {select: false})`
   * @param {string} options.voteMethodName=vote - the method name to set a vote.
   * @param {string} options.unvoteMethodName=unvote - the method name to unset a vote.
   * @param {object} options.votes
   * @param {string} options.votes.ref - the reference model to use `(e.g. {votes: {ref: 'ModelRefName'}})`
   * @param {object} options.votes.options - votes property options to set (`type` will always be `String`). `(e.g. {votes: {options: {select: false}}})`
  */
  options = _.merge({
    path: 'votes',
    options: {},
    voteMethodName: 'vote',
    unvoteMethodName: 'unvote',
    votes: {
      ref: undefined,
      options: {}
    }
  }, options || {});

  schema.path(options.path, _.defaults(
    {type: [
      _.defaults(
        options.votes.ref ?
          {type: schema.constructor.Types.ObjectId, ref: options.votes.ref} :
          {type: String},
        options.votes.options
      )
    ]},
    options.options
  ));

  /**
   * The `vote` method appends the passed in value to the `votes` path array
   * @function vote
   * @param {*} voter - If using a reference pass in the ObjectId or the document
  */
  schema.method(options.voteMethodName, function vote(voter) {
    // Add voter if not already in set
    this[options.path].addToSet(voter);
  });

  /**
   * The `unvote` method removes the passed in value from the `votes` path array
   * @function unvote
   * @param {*} voter - If using a reference pass in the ObjectId or the document
  */
  schema.method(options.unvoteMethodName, function unvote(voter) {
    // Remove voter if in set
    this[options.path].pull(voter);
  });
};
