jest.mock('../db/SimulateFail.js')
const service = require('./UsersService.js');
const SimulateFail = require('../db/SimulateFail.js');
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

describe('createID', () => {
  test('should return HTTP 200', () => {
    expect.assertions(1);
    return expect(service.createID()).resolves.toMatchObject({code: 200});
  });

  test('should return an object with a UUID in it', () => {
    expect.assertions(1);
    var matchObject = {payload: {id:expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)}};
    return expect(service.createID()).resolves.toMatchObject(matchObject);
  });
});

describe('createUser', () => {
  test('should return HTTP 201', () => {
    SimulateFail.shouldFail.mockImplementation(() => false);
    expect.assertions(1);
    return expect(service.createUser({ updateUser: {name: "testUser" }})).resolves.toMatchObject({code: 201});
  });

  test('should return HTTP 500 when simulating failure', () => {
    SimulateFail.shouldFail.mockImplementation(() => true);
    expect.assertions(1);
    return expect(service.createUser({ updateUser: {name: "testUser" }})).rejects.toMatchObject({code: 500});
  });

  test('should create a user', () => {
    SimulateFail.shouldFail.mockImplementation(() => false);
    expect.assertions(2);
    return new Promise(resolve => {
      service.createUser({ updateUser: { name: "testUser" } }).then(result => {
        db.get("select * from user where id = ?", [result.payload.id], (err, row) => {
          expect(err).toBeNull();
          expect(row).toMatchObject({ name: "testUser" });
          resolve();
        });
      });
    });
  });
});

describe('createUser', () => {
  test('should return HTTP 200', () => {
    expect.assertions(1);
    var newId = uuidv4()
    return new Promise(resolve => {
      db.run('INSERT INTO user (id, name) VALUES (?,?)', [newId, "testUser"],
      function (err, result) {
        expect.assertions(1);
        expect(err).toBeNull();
        expect(service.loadUserById({userId:newId})).resolves.toMatchObject({code: 200});
        resolve();
      });
    });
  });

  test('should return HTTP 404 when user does not exist', () => {
    // expect.assertions(1);
    return expect(service.loadUserById("doesNotExist")).rejects.toMatchObject({code: 404});
  });
});
