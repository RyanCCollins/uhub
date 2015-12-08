mongoose-plugin-votes
====================

[ ![Codeship Status for CentralPing/mongoose-plugin-votes](https://codeship.com/projects/5e028730-4b42-0132-fafd-5634b05c27e4/status)](https://codeship.com/projects/46705)
[ ![Code Climate for CentralPing/mongoose-plugin-votes](https://codeclimate.com/github/CentralPing/mongoose-plugin-votes/badges/gpa.svg)](https://codeclimate.com/github/CentralPing/mongoose-plugin-votes)
[ ![Dependency Status for CentralPing/mongoose-plugin-votes](https://david-dm.org/CentralPing/mongoose-plugin-votes.svg)](https://david-dm.org/CentralPing/mongoose-plugin-votes)

A [mongoose.js](https://github.com/LearnBoost/mongoose/) plugin that provides `vote` and `unvote` methods for model instances. The method names are configurable (e.g. `like` and `unlike`).

*Note: document changes are not persisted until document is saved.*

## Installation

`npm i --save mongoose-plugin-votes`

## API Reference
**Example**  
```js
var votesPlugin = require('mongoose-plugin-votes');
var schema = Schema({...});
schema.plugin(votesPlugin[, OPTIONS]);
```
<a name="module_mongoose-plugin-votes..options"></a>
### mongoose-plugin-votes~options
**Kind**: inner property of <code>[mongoose-plugin-votes](#module_mongoose-plugin-votes)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>object</code> |  |  |
| options.path | <code>string</code> | <code>&quot;votes&quot;</code> | the path to create the propterty for storing votes. |
| options.options | <code>object</code> |  | property options to set (`type` will always be `Array`). `(e.g. {select: false})` |
| options.voteMethodName | <code>string</code> | <code>&quot;vote&quot;</code> | the method name to set a vote. |
| options.unvoteMethodName | <code>string</code> | <code>&quot;unvote&quot;</code> | the method name to unset a vote. |
| options.votes | <code>object</code> |  |  |
| options.votes.ref | <code>string</code> |  | the reference model to use `(e.g. {votes: {ref: 'ModelRefName'}})` |
| options.votes.options | <code>object</code> |  | votes property options to set (`type` will always be `String`). `(e.g. {votes: {options: {select: false}}})` |

<a name="module_mongoose-plugin-votes..vote"></a>
### mongoose-plugin-votes~vote(voter)
The `vote` method appends the passed in value to the `votes` path array

**Kind**: inner method of <code>[mongoose-plugin-votes](#module_mongoose-plugin-votes)</code>  

| Param | Type | Description |
| --- | --- | --- |
| voter | <code>\*</code> | If using a reference pass in the ObjectId or the document |

<a name="module_mongoose-plugin-votes..unvote"></a>
### mongoose-plugin-votes~unvote(voter)
The `unvote` method removes the passed in value from the `votes` path array

**Kind**: inner method of <code>[mongoose-plugin-votes](#module_mongoose-plugin-votes)</code>  

| Param | Type | Description |
| --- | --- | --- |
| voter | <code>\*</code> | If using a reference pass in the ObjectId or the document |


## Examples

### With Strings
```js
var votesPlugin = require('mongoose-plugin-votes');
var schema = Schema({foo: String});
schema.plugin(votesPlugin);

var Foo = mongoose.model('Foo', schema);
var foo = Foo(); // foo.votes --> []
foo.vote('candy'); // foo.votes --> ['candy']
foo.vote('candy'); // foo.votes --> ['candy']
foo.vote('ice cream'); // foo.votes --> ['candy', 'ice cream']
foo.unvote('candy'); // foo.votes --> ['ice cream']
```

### With References
```js
var votesPlugin = require('mongoose-plugin-votes');
var schema = Schema({foo: String});
schema.plugin(votesPlugin, {votes: {ref: 'UserModel'}});

var Foo = mongoose.model('Foo', schema);
var foo = Foo(); // foo.votes --> []
foo.vote(userA); // foo.votes --> [{_id: '507f191e810c19729de860ea'}]
foo.vote(userA.id); // foo.votes --> [{_id: '507f191e810c19729de860ea'}]
foo.vote(userB); // foo.votes --> [{_id: '507f191e810c19729de860ea'}, {_id: '507f191e810c19729de970fb'}]
foo.unvote(userA); // foo.votes --> [{_id: '507f191e810c19729de970fb'}]
```

# License

Apache 2.0
