var format = require('util').format;
var request = require('request');
var box = require('bx');

/**
* Create a new User.
* @constructor
*
* @param {string} email
* @param {string} password
*/
var User = function(email, password) {
    this.cookies = request.jar();
    this.cache = new box();
    this.creds = {
        udacity: {
            username: email,
            password: password
        }
    };
    this.urls = {
        auth: 'https://www.udacity.com/api/session',
        account: 'https://www.udacity.com/api/users/me',
        node_progress: 'https://www.udacity.com/api/nodes/%s/state?fresh=true',
        node_info: 'https://www.udacity.com/api/nodes?keys%5B%5D=%s',
        classroom: 'https://www.udacity.com/course/viewer#!/'
    };
};

/**
* Clear all data in the cache.
*/
User.prototype.clear = function() {
    this.cache.clear();
};

/**
* Checks if a user is logged in; if not, log them in.
* @private
*
* @param {function} cb - Callback function
*/
User.prototype._auth = function(cb) {
    var self = this;
    var session = self.cache.get('session');
    var options = {
        url: self.urls.auth,
        jar: self.cookies,
        json: self.creds
    };

    if (session) {
        cb(undefined, session);
    } else {
        request.post(options, function(err, res, body) {
            if (err) {
                cb(err);
            } else {
                switch (res.statusCode) {
                    case 404:
                        cb(new Error('404 page not found'));
                        break;
                    case 500:
                        cb(new Error('500 server error'));
                        break;
                    default:
                        var data = JSON.parse(body.slice(4));
                        self.cache.put('session', data);
                        cb(undefined, data);
                }
            }
        });
    }
};

/**
* Get a user's account data.
*
* @param {function} cb - Callback function
*/
User.prototype.account = function(cb) {
    var self = this;
    var account = self.cache.get('account');
    var session = self.cache.get('session');
    var options = {
        url: self.urls.account,
        jar: self.cookies
    };

    var getAccount = function(callback) {
        request.get(options, function(err, res, body) {
            if (err) {
                callback(err);
            } else {
                switch (res.statusCode) {
                    case 404:
                        callback(new Error('404 page not found'));
                        break;
                    case 500:
                        callback(new Error('500 server error'));
                        break;
                    default:
                        var data = JSON.parse(body.slice(4)).user;
                        self.cache.put('account', data);
                        callback(undefined, data);
                }
            }
        });
    };

    if (account && session) {
        cb(undefined, account);
    } else {
        if (session) {
            getAccount(cb);
        } else {
            self._auth(function(err) {
                if (err) {
                    cb(err);
                } else {
                    getAccount(cb);
                }
            });
        }
    }
};

/**
* Get a user's Udacity ID.
*
* @param {function} cb - Callback function
*/
User.prototype.key = function(cb) {
    this.account(function(err, data) {
        if (err) {
            cb(err);
        } else {
            var key = data.key;
            key ? cb(undefined, key) : cb(new Error('key not found'));
        }
    });
};

/**
* Get a user's name.
*
* @param {function} cb - Callback function
*/
User.prototype.name = function(cb) {
    this.account(function(err, data) {
        if (err) {
            cb(err);
        } else {
            var name = data.first_name + ' ' + data.last_name;
            name ? cb(undefined, name) : cb(new Error('name not found'));
        }
    });
};

/**
* Get a user's nickname.
*
* @param {function} cb - Callback function
*/
User.prototype.nickname = function(cb) {
    this.account(function(err, data) {
        if (err) {
            cb(err);
        } else {
            var nickname = data.nickname;
            nickname ? cb(undefined, nickname) : cb(new Error('nickname not found'));
        }
    });
};

/**
* Get a user's email address.
*
* @param {function} cb - Callback function
*/
User.prototype.email = function(cb) {
    this.account(function(err, data) {
        if (err) {
            cb(err);
        } else {
            var email = data.email.address;
            email ? cb(undefined, email) : cb(new Error('email not found'));
        }
    });
};

/**
* Get a user's email preferences.
*
* @param {function} cb - Callback function
*/
User.prototype.emailPreferences = function(cb) {
    this.account(function(err, data) {
        if (err) {
            cb(err);
        } else {
            if (data.email_preferences) {
                var prefs = {
                    employer_sharing: data.employer_sharing,
                    newsletter: data.email_preferences.master_ok,
                    course_emails: data.email_preferences.ok_course,
                    user_research: data.email_preferences.ok_user_research
                };

                cb(undefined, prefs);
            } else {
                cb(new Error('email preferences not found'));
            }
        }
    });
};

/**
* Get a user's website preferences.
*
* @param {function} cb - Callback function
*/
User.prototype.sitePreferences = function(cb) {
    this.account(function(err, data) {
        if (err) {
            cb(err);
        } else {
            var prefs = data.site_preferences;
            prefs ? cb(undefined, prefs) : cb(new Error('site preferences not found'));
        }
    });
};

/**
* Get an array of courses the user is enrolled in.
*
* @param {function} cb - Callback function
*/
User.prototype.enrollments = function(cb) {
    this.account(function(err, data) {
        if (err) {
            cb(err);
        } else {
            var enrollments = data._enrollments;
            if (enrollments && enrollments.length > 0) {
                var courses = [];
                for (var i in enrollments) {
                    courses.push(enrollments[i].node_key);
                }
                cb(undefined, courses);
            } else {
                cb(new Error('no course enrollments found'));
            }
        }
    });
};

/**
* Get progress in a course. Returns an object containing information about
* the progress in a course and the most recently visited lesson as well.
*
* @param {string} id - Course key
* @param {function} cb - Callback function
*/
User.prototype.progress = function(id, cb) {
    var self = this;
    var courseData = self.cache.get(id);

    var dateSort = function(a, b) {
        var dateA = new Date(a.time);
        var dateB = new Date(b.time);

        if (dateA > dateB) return -1;
        if (dateA < dateB) return 1;
        return 0;
    };

    var getLessonInfo = function(options, courseData) {
        request.get(options, function(err, res, body) {
            if (err) {
                cb(err);
            } else {
                switch (res.statusCode) {
                    case 404:
                        cb(new Error('404 page not found'));
                        break;
                    case 500:
                        cb(new Error('500 server error'));
                        break;
                    default:
                        var lessonInfo = JSON.parse(body.slice(4)).references.Node[courseData.current_lesson.key];
                        if (!lessonInfo) {
                            cb(new Error('lesson info not found'));
                        } else {
                            courseData.current_lesson.title = lessonInfo.title;
                            courseData.current_lesson.quiz_count = lessonInfo._synopsis.quiz_count;
                            courseData.current_lesson.morsel_count = lessonInfo._synopsis.morsel_count;

                            self.cache.put(id, courseData, 600000);
                            cb(undefined, courseData);
                        }
                }
            }
        });
    };

    var getLessonProgress = function(options, courseData) {
        request.get(options, function(err, res, body) {
            if (err) {
                cb(err);
            } else {
                switch (res.statusCode) {
                    case 404:
                        cb(new Error('404 page not found'));
                        break;
                    case 500:
                        cb(new Error('500 server error'));
                        break;
                    default:
                        var lessonProgress = JSON.parse(body.slice(4)).nodestates[0];
                        courseData.current_lesson.quizzes_completed = lessonProgress.completed_quiz_count;
                        courseData.current_lesson.morsels_completed = lessonProgress.completed_morsel_count;
                        courseData.current_lesson.completed = lessonProgress.node_completed;
                        options.url = format(self.urls.node_info, courseData.current_lesson.key);

                        getLessonInfo(options, courseData);
                }
            }
        });
    };

    var getCourseInfo = function(options, courseData) {
        request.get(options, function(err, res, body) {
            if (err) {
                cb(err);
            } else {
                switch (res.statusCode) {
                    case 404:
                        cb(new Error('404 page not found'));
                        break;
                    case 500:
                        cb(new Error('500 server error'));
                        break;
                    default:
                        var courseInfo = JSON.parse(body.slice(4)).references.Node[id];
                        if (!courseInfo) {
                            cb(new Error('no course info found'));
                        } else {
                            courseData.title = courseInfo.title;
                            courseData.quiz_count = courseInfo._synopsis.quiz_count;
                            courseData.morsel_count = courseInfo._synopsis.morsel_count;
                            options.url = format(self.urls.node_progress, courseData.current_lesson.key);

                            getLessonProgress(options, courseData);
                        }
                }
            }
        });
    };

    var getCourseProgress = function(options, courseData) {
        request.get(options, function(err, res, body) {
            if (err) {
                cb(err);
            } else {
                switch (res.statusCode) {
                    case 404:
                        cb(new Error('404 page not found'));
                        break;
                    case 500:
                        cb(new Error('500 server error'));
                        break;
                    default:
                        var courseProgress = JSON.parse(body.slice(4)).nodestates[0];
                        if (!courseProgress) {
                            cb(new Error('progress in course "' + id + '" not found'));
                        } else {
                            var lastCourse, lastLesson, lastExam, lastMorsel, lastLessonKey;
                            var mostRecentPage = courseProgress.last_interactions.sort(dateSort)[0];
                            var lastVisited = new Date(mostRecentPage.time);
                            var now = new Date();

                            courseData.completed = courseProgress.node_completed;
                            courseData.quizzes_completed = courseProgress.completed_quiz_count;
                            courseData.morsels_completed = courseProgress.completed_morsel_count;
                            courseData.last_visited = lastVisited.toISOString();
                            courseData.time_away_ms = now - lastVisited;

                            for (var i in mostRecentPage.content_context) {
                                var k = mostRecentPage.content_context[i].node_ref.key;
                                switch (mostRecentPage.content_context[i].tag) {
                                    case 'c-':
                                        lastCourse = 'c-' + k;
                                        break;
                                    case 'l-':
                                        lastLessonKey = k;
                                        lastLesson = '/l-' + k;
                                        break;
                                    case 'e-':
                                        lastExam = '/e-' + k;
                                        break;
                                    case 'm-':
                                        lastMorsel = '/m-' + k;
                                        break;
                                    default:
                                        cb(new Error('unrecognized url'));
                                }
                            }

                            courseData.most_recent_url = self.urls.classroom + lastCourse + lastLesson;
                            if (lastExam) {
                                courseData.most_recent_url += lastExam;
                            }
                            courseData.most_recent_url += lastMorsel;
                            courseData.current_lesson = {
                                key: lastLessonKey
                            };

                            options.url = format(self.urls.node_info, id);
                            getCourseInfo(options, courseData);
                        }
                }
            }
        });
    };

    if (courseData) {
        cb(undefined, courseData);
    } else {
        self.enrollments(function(err, data) {
            if (err) {
                cb(err);
            } else {
                if (data.indexOf(id) === -1) {
                    cb(new Error('user not enrolled in course "' + id + '"'));
                } else {
                    courseData = { key: id };
                    var options = {
                        url: format(self.urls.node_progress, id),
                        jar: self.cookies
                    };

                    getCourseProgress(options, courseData);
                }
            }
        });
    }
};

module.exports = User;
