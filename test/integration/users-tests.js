var assert = require('assert');
var request = require('supertest')
var server = require('../../src/server.js');
var dbTools = require('../test-db-tools');
var config = require('config');

describe('Integration tests: users', function(){
    var url = 'http://localhost:' + config.get('TestSettings.port');
    
    var adminUser = {
        id: 1,
        username: 'admin',
        role: 3
    };
    
    before('Initialize server', function() {
        dbTools.initializeTestData();
        server.start(config.get('TestSettings.port'));
    });
    
    after('Stop server', function() {
        server.stop();
    });
    
    describe('#users()', function(){
        it('should return list of users', function (done){
            request(url)
            .get('/api/users')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res){
                if (err) {
                    assert.fail('Error: ' + err);
                    done();
                    return;
                }

                var user = res.body[0];
                assert.equal(adminUser.id, user.id);
                assert.equal(adminUser.username, user.username);
                assert.equal(adminUser.role, user.role);

                done();
            });
        });
    });

    describe('#user()', function(){
        describe('GET', function() {
            it('should return single matching user', function (done){
                request(url)
                    .get('/api/user/1')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res){
                        if (err) {
                            assert.fail('Error: ' + err);
                            done();
                            return;
                        }

                        var user = res.body;
                        assert.equal(adminUser.id, user.id);
                        assert.equal(adminUser.username, user.username);
                        done();
                    });
            });

            it('should return 404 if user doesn\'t exists', function (done){
                request(url)
                    .get('/api/user/666')
                    .expect(404)
                    .end(function(err, res){
                        if (err) {
                            assert.fail('Error: ' + err);
                            done();
                            return;
                        }

                        done();
                    });
            });
        });

        describe('POST', function(){
            it('should update user data', function(done){
                var newUserName = 'testhermanni';
                var newRole = 3;

                request(url)
                    .post('/api/user/1')
                    .send({username: newUserName})
                    .expect(200)
                    .end(function(err, res){
                        if (err) {
                            assert.fail('Error: ' + err);
                            done();
                            return;
                        }

                        request(url)
                            .get('/api/user/1')
                            .end(function(err, res){
                                if (err) {
                                    assert.fail('Error: ' + err);
                                    done();
                                    return;
                                }

                                var user = res.body;
                                assert.equal(1, user.id);
                                assert.equal(newUserName, user.username);
                                assert.equal(newRole, user.role);
                                done();
                            });

                    });
            });

            it('should return 404 if user doesn\'t exist', function(done){
                request(url)
                    .post('/api/user/666')
                    .send({username: 'never'})
                    .expect(404)
                    .end(function(err, res){
                        if (err) {
                            assert.fail('Error: ' + err);
                            done();
                            return;
                        }

                        done();
                    });
            });
        });
    });
});