'use strict';
/* jshint node: true, jasmine: true */

var mongoose = require('mongoose');
var faker = require('faker');
var votes = require('./votes');
var Schema = mongoose.Schema;
var connection;

// Mongoose uses internal caching for models.
// While {cache: false} works with most models, models using references
// use the internal model cache for the reference.
// This removes the mongoose entirely from node's cache
delete require.cache.mongoose;

var blogData = {
  title: faker.lorem.sentence(),
  blog: faker.lorem.paragraphs()
};

beforeAll(function (done) {
  connection = mongoose.createConnection('mongodb://localhost/unit_test');
  connection.once('connected', function () {
    done();
  });
});

afterAll(function (done) {
  connection.db.dropDatabase(function (err, result) {
    connection.close(function () {
      done();
    });
  });
});

describe('Mongoose plugin: votes', function () {
  var schema;

  describe('with plugin declaration', function () {
    beforeEach(function () {
      schema = blogSchema();
    });

    it('should add `votes` path, `vote` and `unvote` methods to the schema', function () {
      schema.plugin(votes);
      expect(schema.pathType('votes')).toBe('real');
      expect(schema.path('votes').caster.instance).toBe('String');
      expect(schema.methods.vote).toBeDefined();
      expect(schema.methods.unvote).toBeDefined();
    });

    describe('with options', function () {
      it('should add `likes` path, `like` and `unlike` methods to the schema', function () {
        schema.plugin(votes, {path: 'likes', voteMethodName: 'like', unvoteMethodName: 'unlike'});
        expect(schema.pathType('likes')).toBe('real');
        expect(schema.path('likes').caster.instance).toBe('String');
        expect(schema.methods.like).toBeDefined();
        expect(schema.methods.unlike).toBeDefined();
      });

      it('should add a reference for `votes` to the schema', function () {
        schema.plugin(votes, {votes: {ref: 'User'}});
        expect(schema.pathType('votes')).toBe('real');
        expect(schema.path('votes').caster.instance).toBe('ObjectID');
      });

      it('should not allow path type for `votes` to be overwritten', function () {
        schema.plugin(votes, {options: {type: String}});
        expect(schema.path('votes').instance).toBe('Array');
      });

      it('should not allow path type for `votes` item to be overwritten', function () {
        schema.plugin(votes, {votes: {options: {type: Boolean}}});
        expect(schema.path('votes').caster.instance).toBe('String');
      });

      it('should make `votes` not selected', function () {
        schema.plugin(votes, {options: {select: false}});
        expect(schema.path('votes').selected).toBe(false);
      });

      it('should make `votes` item not selected', function () {
        schema.plugin(votes, {votes: {options: {select: false}}});
        expect(schema.path('votes').caster.selected).toBe(false);
      });
    });
  });

  describe('with documents', function () {
    var Blog;
    var blog;

    beforeAll(function () {
      var schema = blogSchema();
      schema.plugin(votes);

      Blog = model(schema);
    });

    beforeEach(function() {
      blog = new Blog();
    });

    it('should set `votes` to an empty array', function () {
      expect(blog.votes.length).toBe(0);
    });

    it('should allow a voter to vote only once', function () {
      var voter = faker.name.findName();

      blog.vote(voter);
      expect(blog.votes.length).toBe(1);
      expect(blog.votes[0]).toBe(voter);

      blog.vote(voter);
      expect(blog.votes.length).toBe(1);
    });

    it('should allow multiple users to vote', function () {
      var voter = faker.name.findName();
      var otherVoter = faker.name.findName();

      blog.vote(voter);
      expect(blog.votes.length).toBe(1);
      expect(blog.votes[0]).toBe(voter);

      blog.vote(otherVoter);
      expect(blog.votes.length).toBe(2);
      expect(blog.votes[1]).toBe(otherVoter);
    });

    it('should allow a user to "unvote" their vote', function () {
      var voter = faker.name.findName();
      var otherVoter = faker.name.findName();

      blog.vote(voter);
      expect(blog.votes.length).toBe(1);
      expect(blog.votes[0]).toBe(voter);

      blog.vote(otherVoter);
      expect(blog.votes.length).toBe(2);
      expect(blog.votes[1]).toBe(otherVoter);

      blog.unvote(voter);
      expect(blog.votes.length).toBe(1);
      expect(blog.votes[0]).toBe(otherVoter);
    });
  });
});

function model(name, schema) {
  if (arguments.length === 1) {
    schema = name;
    name = 'Model';
  }

  // Specifying a collection name allows the model to be overwritten in
  // Mongoose's model cache
  return connection.model(name, schema, name);
}

function blogSchema() {
  return new Schema({
    title: String,
    blog: String,
    created: {type: Date, 'default': Date.now}
  });
}
