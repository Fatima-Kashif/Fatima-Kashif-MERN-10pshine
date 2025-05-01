const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); 
const expect = chai.expect;

chai.use(chaiHttp);

describe('User Controller', () => {
  describe('POST /user/signup', () => {
    it('should register a new user', (done) => {
      chai.request(app)
        .post('/user/signup')
        .send({
          name: 'Test User',
          email: `user${Date.now()}@example.com`,
          password: 'password123'
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('msg').eql('Your account is successfully created');
          done();
        });
    });

    it('should not allow duplicate emails', (done) => {
      chai.request(app)
        .post('/user/signup')
        .send({
          name: 'Test User',
          email: `testuser@example.com`, 
          password: 'password123'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('msg').eql('This email has already been registered');
          done();
        });
    });
  });

  describe('POST /user/signin', () => {
    it('should login successfully with correct credentials', (done) => {
      chai.request(app)
        .post('/user/signin')
        .send({ email: `testuser@example.com`, password: 'password123' })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('msg').eql('Welcome to your account');
          expect(res.body).to.have.property('token');
          done();
        });
    });

    it('should fail with incorrect password', (done) => {
      chai.request(app)
        .post('/user/signin')
        .send({ email: `testuser@example.com`, password: 'wrongpass' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('msg').eql('Invalid email or password');
          done();
        });
    });
  });
});
