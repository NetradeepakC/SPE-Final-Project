import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js'; 

chai.use(chaiHttp);

const assert = chai.assert;

// describe('Register Route', () => {
//   // Example test case for a successful registration
//   it('should register a new user', async () => {
//     const newUser = {
//       firstName: 'qwer',
//       lastName: 'erty',
//       email: 'qwerasfd@example.com',
//       password: 'password123'
//     };

//     const response = await chai
//       .request(app)
//       .post('/auth/register')
//       .send(newUser);
//     assert.equal(response.status, 201);
//   });
//   it('should give invalid request because of missing data',async() =>{
//     const newUser = {
//         firstName: 'qwery',
//         lastName: 'erty',
//         email: 'qwer@example.com',
//     };
//     const response = await chai
//       .request(app)
//       .post('/auth/register')
//       .send(newUser);
//     assert.equal(response.status, 500);
//   });
// });

chai.use(chaiHttp);
const expect = chai.expect;

describe('auth controller', () => {
  it('should log in a user with valid credentials', async () => {
    const userData = {
        email: "Manan.Patel@iiitb.ac.in",
        password: "Manan.Patel@iiitb.ac.in"    
    };

    const response = await chai
      .request(app)
      .post('/auth/login')
      .send(userData);

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('token');
    expect(response.body).to.have.property('user');
    expect(response.body.user).to.have.property('email').equal(userData.email);
  });

  it('should return an error for an invalid user', async () => {
    const invalidUserData = {
        email: 'nonexistentuser@example.com',
        password: 'invalidpassword',
    };

    const response = await chai
        .request(app)
        .post('/auth/login')
        .send(invalidUserData);

    expect(response).to.have.status(400);
    expect(response.body).to.have.property('msg').equal("User does not exist. ");
  });

  it('should return an error for invalid credentials', async () => {
    const invalidCredentials = {
        email: 'Manan.Patel@iiitb.ac.in',
        password: 'wrongpassword',
    };

    const response = await chai
        .request(app)
        .post('/auth/login')
        .send(invalidCredentials);

    expect(response).to.have.status(400);
    expect(response.body).to.have.property('msg').equal('Invalid credentials. ');
  });
});

describe('User controller', () => {
    it('should return user with the given id', async () => {
        const userData = {
            email: "Manan.Patel@iiitb.ac.in",
            password: "Manan.Patel@iiitb.ac.in"    
        };
        let response = await chai
        .request(app)
        .post('/auth/login')
        .send(userData);
        let id = response.body.user._id;
        let token = response.body.token
        response = await chai
        .request(app)
        .get('/users/'+id)
        .set('Authorization','Bearer '+token);

        expect(response).to.have.status(200);
    });

    it('Should give a 403 because of no token', async () => {
        const userData = {
            email: "Manan.Patel@iiitb.ac.in",
            password: "Manan.Patel@iiitb.ac.in"    
        };
        let response = await chai
        .request(app)
        .post('/auth/login')
        .send(userData);
        let id = response.body.user._id;
        response = await chai
        .request(app)
        .get('/users/'+id);

        expect(response).to.have.status(403);
        expect(response.body).to.have.property('message').equal('Access Denied');
    });

    it('Invalid token', async () => {
        // const id= "6578182504faa71b7866f06e";
        const userData = {
            email: "Manan.Patel@iiitb.ac.in",
            password: "Manan.Patel@iiitb.ac.in"    
        };
        let response = await chai
        .request(app)
        .post('/auth/login')
        .send(userData);
        let id = response.body.user._id;
        let token = response.body.token
        response = await chai
        .request(app)
        .get('/users/'+id)
        .set('Authorization','Bearer 123');

        expect(response).to.have.status(500);
        expect(response.body).to.have.property('error').equal('jwt malformed');
    });
  });

// after(function () {
//     if (this.currentTest.state === 'failed') {
//       process.exitCode = 1; // Set exit code to indicate test failure
//     }
//   });
afterEach(function(){
    if(this.currentTest.state === 'failed'){
        process.exit(1);
    }
});

after(function(){
    process.exit(0);
})