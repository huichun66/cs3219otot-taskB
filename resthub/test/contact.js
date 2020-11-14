//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Contact = require('../contactModel');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Contacts', () => {
    beforeEach((done) => { //Before each test we empty the database
        setTimeout(done, 10000);

        Contact.deleteMany({}, (err) => {
           done();
        });
    });

    /*
    * Test the /GET route
    */
    describe('/GET contacts', () => {
        it('it should GET all the contacts', (done) => {
        chai.request(server)
            .get('/api/contacts')
            .end((err, res) => {
                console.log("API response is " + res.body);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('data');
                res.body.data.length.should.be.eql(0);
                done();
            });
        });
    });

    /*
    * Test the /POST route
    */
    describe('/POST contact', () => {
    it('It should create a new contact record in the database', (done) => {
        let contact = {
            name: "Jamie Oliver",
            email: "jamie.oliver@hotmail.com",
            phone: "92258713",
            gender: "Male"
        }
        chai.request(server)
            .post('/api/contacts')
            .send(contact)
            .end((err, res) => {
                console.log("API response is " + res.body);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('New contact created!');
                res.body.should.have.property('data');
                res.body.data.should.have.property('_id');
                res.body.data.should.have.property('name');
                res.body.data.should.have.property('email');
                res.body.data.should.have.property('phone');
                res.body.data.should.have.property('gender');
            done();
            });
        });
    });

    /*
    * Test the /PUT route
    */
   describe('/PUT contact', () => {
    it('It should update a contact record details given the id', (done) => {
        let contact = new Contact({
            name: "Jamie Oliver",
            email: "jamie.oliver@hotmail.com",
            phone: "92258713",
            gender: "Male"
        })
        contact.save((err, contact) => {
            chai.request(server)
            .put('/api/contacts/' + contact.id)
            .send({name: "Jamie Oliver", email: "jamie.oliver.uk@hotmail.com", phone: "92258713", gender: "Male"})  //update Jamie Oliver's email
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Contact Info updated');
                res.body.data.should.have.property('email').eql('jamie.oliver.uk@hotmail.com');
            done();
            });
        });
    });
  });

});