var expect = require('chai').expect;
var User = require('../../src/udacity').User;
var $USER = process.env.USER;
var $PW = process.env.PW;

describe('Udacity API: User tests', function() {
    var me = new User($USER, $PW);
    var fake = new User('fake', 'fake');

    describe('Account info tests', function() {
        it('Function: User.prototype.account', function(done) {
            me.account(function(err, data) {
                expect(err).to.equal(undefined);
                expect(data).to.be.a('object');
                done();
            });
        });

        it('Function: User.prototype.key', function(done) {
            me.key(function(err, data) {
                expect(err).to.equal(undefined);
                expect(data).to.be.a('string');
                expect(isNaN(data)).to.equal(false);
                done();
            });
        });

        it('Function: User.prototype.name', function(done) {
            me.name(function(err, data) {
                expect(err).to.equal(undefined);
                expect(data).to.be.a('string');
                expect(data).to.equal('Ty-Lucas Kelley');
                done();
            });
        });

        it('Function: User.prototype.nickname', function(done) {
            me.nickname(function(err, data) {
                expect(err).to.equal(undefined);
                expect(data).to.be.a('string');
                expect(data).to.equal('Ty');
                done();
            });
        });

        it('Function: User.prototype.email', function(done) {
            me.email(function(err, data) {
                expect(err).to.equal(undefined);
                expect(data).to.be.a('string');
                expect(data).to.contain('ty');
                done();
            });
        });

        it('Function: User.prototype.emailPreferences', function(done) {
            me.emailPreferences(function(err, data) {
                expect(err).to.equal(undefined);
                expect(data).to.be.a('object');
                expect(data).to.have.keys([
                    'newsletter',
                    'employer_sharing',
                    'course_emails',
                    'user_research'
                ]);
                done();
            });
        });

        it('Function: User.prototype.sitePreferences', function(done) {
            me.sitePreferences(function(err, data) {
                expect(err).to.equal(undefined);
                expect(data).to.be.a('object');
                expect(data).to.have.keys([
                    'auto_advance',
                    'video_quality',
                    'use_html5_player',
                    'playback_rate'
                ]);
                done();
            });
        });

        it('Function: User.prototype.enrollments', function(done) {
            me.enrollments(function(err, data) {
                expect(err).to.equal(undefined);
                expect(data).to.be.a('array');
                expect(data.length).not.to.equal(0);
                done();
            });
        });

        it('Function: User.prototype.progress', function(done) {
            me.progress('cs101', function(err, data) {
                expect(err).to.equal(undefined);
                expect(data).to.be.a('object');
                expect(data).to.have.keys([
                    'key',
                    'completed',
                    'current_lesson',
                    'morsel_count',
                    'last_visited',
                    'morsels_completed',
                    'most_recent_url',
                    'quiz_count',
                    'quizzes_completed',
                    'time_away_ms',
                    'title'
                ]);
                expect(data.current_lesson).to.be.a('object');
                done();
            });
        });
    });

    describe('Error handling tests', function() {
        it('Function: User.prototype.account', function(done) {
            fake.account(function(err, data) {
                expect(data).to.equal(undefined);
                expect(err instanceof Error).to.equal(true);
                expect(err.message).to.equal('404 page not found');
                done();
            });
        });

        it('Function: User.prototype.progress', function(done) {
            me.progress('aaaaaa', function(err, data) {
                expect(data).to.equal(undefined);
                expect(err instanceof Error).to.equal(true);
                expect(err.message).to.equal('user not enrolled in course "aaaaaa"');
                done();
            });
        });
    });
});
