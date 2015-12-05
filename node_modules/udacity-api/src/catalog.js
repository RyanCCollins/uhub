var request = require('request');
var box = require('bx');

/**
* Create a new Catalog.
* @constructor
*/
var Catalog = function() {
    this.cache = new box();
    this.options = {
        url: 'https://www.udacity.com/public-api/v0/courses?projection=internal'
    };
};

/**
* Clear all stored catalog data.
*/
Catalog.prototype.clear = function() {
    this.cache.clear();
};

/**
* Get custom catalog data; checks cache before sending request.
* @private
*
* @param {function} cb - Callback function
*/
Catalog.prototype._get = function(cb) {
    var self = this;
    var catalog = self.cache.get('catalog');

    if (catalog) {
        cb(undefined, catalog);
    } else {
        request.get(this.options, function(err, res, body) {
            var data = JSON.parse(body);

            if (err) {
                cb(err);
            } else {
                switch(res.statusCode) {
                    case 404:
                        cb(new Error('404 page not found'));
                        break;
                    case 500:
                        cb(new Error('500 server error'));
                        break;
                    default:
                        self.cache.put('catalog', data, 60000);
                        cb(undefined, data);
                }
            }
        });
    }
};

/**
* Get all catalog data.
*
* @param {function} cb - Callback function
*/
Catalog.prototype.catalog = function(cb) {
    this._get(function(err, data) {
        if (err) {
            cb(err);
        } else {
            data ? cb(undefined, data) : cb(new Error('catalog not found'));
        }
    });
};

/**
* Get all course data.
*
* @param {function} cb - Callback function
*/
Catalog.prototype.courses = function(cb) {
    this._get(function(err, data) {
        if (err) {
            cb(err);
        } else {
            var courses = data.courses;
            courses ? cb(undefined, courses) : cb(new Error('courses not found'));
        }
    });
};

/**
* Get data for a specific course.
*
* @param {string} id - Course key
* @param {function} cb - Callback function
*/
Catalog.prototype.course = function(id, cb) {
    this._get(function(err, data) {
        if (err) {
            cb(err);
        } else {
            var course = data.courses.filter(function(c) {
                return c.key === id;
            })[0];
            course ? cb(undefined, course) : cb(new Error('course "' + id + '" not found'));
        }
    });
};

/**
* Get the instructors from one course.
*
* @param {string} id - Course key
* @param {function} cb - Callback function
*/
Catalog.prototype.instructors = function(id, cb) {
    this.course(id, function(err, data) {
        if (err) {
            cb(err);
        } else {
            data.instructors ? cb(undefined, data.instructors) : cb(new Error('course "' + id + '" instructors not found'));
        }
    });
};

/**
* Get all track data.
*
* @param {function} cb - Callback function
*/
Catalog.prototype.tracks = function(cb) {
    this._get(function(err, data) {
        if (err) {
            cb(err);
        } else {
            var tracks = data.tracks;
            tracks ? cb(undefined, tracks) : cb(new Error('tracks not found'));
        }
    });
};

/**
* Get data for a specific track.
*
* @param {string} name - Track name
* @param {function} cb - Callback function
*/
Catalog.prototype.track = function(name, cb) {
    this._get(function(err, data) {
        if (err) {
            cb(err);
        } else {
            var track = data.tracks.filter(function(t) {
                return t.name === name;
            })[0];
            track ? cb(undefined, track) : cb(new Error('track "' + name + '" not found'));
        }
    });
};

/**
* Get all degree data.
*
* @param {function} cb - Callback function
*/
Catalog.prototype.degrees = function(cb) {
    this._get(function(err, data) {
        if (err) {
            cb(err);
        } else {
            var degrees = data.degrees;
            degrees ? cb(undefined, degrees) : cb(new Error('degrees not found'));
        }
    });
};

/**
* Get data for a specific degree.
*
* @param {string} id - Degree id
* @param {function} cb - Callback function
*/
Catalog.prototype.degree = function(id, cb) {
    this._get(function(err, data) {
        if (err) {
            cb(err);
        } else {
            var degree = data.degrees.filter(function(d) {
                return d.key === id;
            })[0];
            degree ? cb(undefined, degree) : cb(new Error('degree "' + id + '" not found'));
        }
    });
};

module.exports = Catalog;
