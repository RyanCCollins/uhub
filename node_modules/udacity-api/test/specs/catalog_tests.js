var expect = require('chai').expect;
var Catalog = require('../../src/udacity').Catalog;

var find = function(arr, key, value) {
    for (var i in arr) {
        if (arr[i].hasOwnProperty(key)) {
            if (arr[i][key] === value) {
                return arr[i];
            }
        }
    }
};

describe('Udacity API: Catalog Tests', function() {
    var cat = new Catalog();

    it('should have the correct url', function() {
        expect(cat.options.url).to.equal('https://www.udacity.com/public-api/v0/courses?projection=internal');
    });

    describe('Function: Catalog.prototype.catalog', function() {
        it('should return all data when no filter is passed in', function(done) {
            cat._get(function(err, data) {
                cat.catalog(function(err2, data2) {
                    expect(err).to.equal(undefined);
                    expect(err2).to.equal(undefined);
                    expect(data).to.eql(data2);
                    done();
                });
            });
        });

        it('should return an array of arrays for the track course lists', function(done) {
            cat.catalog(function(err, data) {
                expect(err).to.equal(undefined);

                var output = [];
                var t = data.tracks;
                for (var i in t) {
                    output.push(t[i].courses);
                }

                expect(output instanceof Array).to.equal(true);
                for (var j in output) {
                    expect(output[j] instanceof Array).to.equal(true);
                }
                done();
            });
        });
    });

    describe('Function: Catalog.prototype.courses', function() {
        it('should return all courses and have the correct values for cs101', function(done) {
            cat.courses(function(err, data) {
                expect(err).to.equal(undefined);

                var cs101 = find(data, 'key', 'cs101');
                expect(cs101).not.to.equal(undefined);
                expect(cs101).to.contain.keys([
                    'instructors',
                    'subtitle',
                    'key',
                    'image',
                    'syllabus'
                ]);
                expect(cs101.title).to.equal('Intro to Computer Science');
                done();
            });
        });
    });

    describe('Function: Catalog.prototype.course', function() {
        it('should grab the correct data for cs101', function(done) {
            cat.course('cs101', function(err, data) {
                expect(err).to.equal(undefined);

                var cs101 = data;
                expect(cs101).not.to.equal(undefined);
                expect(cs101).to.contain.keys([
                    'instructors',
                    'subtitle',
                    'key',
                    'image',
                    'syllabus'
                ]);
                expect(cs101.title).to.equal('Intro to Computer Science');
                done();
            });
        });

        it('should throw an error when an invalid course id is searched for', function(done) {
            cat.course('aaaaaaaa', function(err, data) {
                expect(err instanceof Error).to.equal(true);
                expect(err.message).to.equal('course "aaaaaaaa" not found');
                expect(data).to.equal(undefined);
                done();
            });
        });
    });

    describe('Function: Catalog.prototype.tracks', function() {
        it('should return all tracks and have correct info for Data Science', function(done) {
            cat.tracks(function(err, data) {
                expect(err).to.equal(undefined);

                var dataScience = find(data, 'name', 'Data Science');
                expect(dataScience).not.to.equal(undefined);
                expect(dataScience).to.contain.keys([
                    'courses',
                    'name',
                    'description'
                ]);
                expect(dataScience.name).to.equal('Data Science');
                expect(dataScience.courses instanceof Array).to.equal(true);
                done();
            });
        });
    });

    describe('Function: Catalog.prototype.track', function() {
        it('should return one object with the correct keys', function(done) {
            cat.track('Data Science', function(err, data) {
                expect(err).to.equal(undefined);
                expect(data).to.contain.keys([
                    'courses',
                    'name',
                    'description'
                ]);
                expect(data.courses instanceof Array).to.equal(true);
                done();
            });
        });

        it('should throw an error when an invalid name is passed in', function(done) {
            cat.track('ABCDEFG', function(err, data) {
                expect(data).to.equal(undefined);
                expect(err instanceof Error).to.equal(true);
                expect(err.message).to.equal('track "ABCDEFG" not found');
                done();
            });
        });
    });

    describe('Function: Catalog.prototype.instructors', function() {
        it('should get the instructors for cs101', function(done) {
            cat.instructors('cs101', function(err, data) {
                expect(err).to.equal(undefined);
                var daveEvans = find(data, 'name', 'Dave Evans');

                expect(daveEvans).not.to.equal(undefined);
                expect(daveEvans.bio).to.contain('Professor of Computer Science');
                done();
            });
        });

        it('should throw an error for a nonexistant course', function(done) {
            cat.instructors('aaaaaaaa', function(err, data) {
                expect(data).to.equal(undefined);
                expect(err instanceof Error).to.equal(true);
                expect(err.message).to.equal('course "aaaaaaaa" not found');
                done();
            });
        });
    });

    describe('Function: Catalog.prototype.degrees', function() {
        it('should get all degree data', function(done) {
            cat.degrees(function(err, data) {
                expect(err).to.equal(undefined);
                var dataSciND = find(data, 'title', 'Data Analyst Nanodegree');

                expect(dataSciND).not.to.equal(undefined);
                expect(dataSciND.title).to.equal('Data Analyst Nanodegree');
                expect(dataSciND).to.contain.keys([
                    'title',
                    'subtitle',
                    'tracks',
                    'syllabus',
                    'key'
                ]);
                done();
            });
        });
    });

    describe('Function: Catalog.prototype.degree', function() {
        it('should get the data for nd002', function(done) {
            cat.degree('nd002', function(err, data) {
                expect(err).to.equal(undefined);
                expect(data).not.to.equal(undefined);
                expect(data.title).to.equal('Data Analyst Nanodegree');
                done();
            });
        });

        it('should throw an error for a nonexistant degree', function(done) {
            cat.degree('aaaaaaaa', function(err, data) {
                expect(data).to.equal(undefined);
                expect(err instanceof Error).to.equal(true);
                expect(err.message).to.equal('degree "aaaaaaaa" not found');
                done();
            });
        });
    });
});
