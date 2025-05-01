// test/notes.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Notes Controller', () => {
  let token='';
  let noteId='';

  const testUser = {
    email: 'testuser@example.com',
    password: 'password123'
  };

  before((done) => {
    chai.request(app)
      .post('/user/signin')
      .send(testUser)
      .end((err, res) => {
        if (err) return done(err);
        token = res.body.token;
        console.log('Token acquired:', token);
        done();
      });
  });

  describe('POST /notes/createnote', () => {
    it('should create a note successfully', (done) => {
      chai.request(app)
        .post('/notes/createnote')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Sample Note',
          content: 'This is a test note.',
          favourite: true,
          pinned: false
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
        expect(res.body).to.have.property('note');
        noteId = res.body.note._id;
        done();
        });
    });

    it('should fail when title is missing', (done) => {
      chai.request(app)
        .post('/notes/createnote')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Missing title' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('msg').eql('Title is required');
          done();
        });
    });
  });

  describe('GET /notes/getnotes', () => {
    it('should fetch all notes', (done) => {
      chai.request(app)
        .get('/notes/getnotes')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('data');
          done();
        });
    });
  });

  describe('PUT /notes/updatenote/:id', () => {
    it('should update the created note', (done) => {
      chai.request(app)
        .put(`/notes/updatenote/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Updated content' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('note');
          done();
        });
    });
  });

  describe('DELETE /notes/deletenote/:id', () => {
    it('should delete the created note', (done) => {
      chai.request(app)
        .delete(`/notes/deletenote/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('msg').eql('Note deleted');
          done();
        });
    });
  });
});
