/* eslint-disable no-unused-vars */
const Service = require('./Service');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const SimulateFail = require('../db/SimulateFail');
const toneClient = require('finn-tone-api');

/**
* Create a new UUID
*
* returns Object
* */
const createID = () => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse(
        { id:uuidv4()}
        ));
    } catch (e) {
      reject(Service.rejectResponse(
        {'error': e.message || 'Invalid input'},
        e.status || 405,
      ));
    }
  },
);

/**
* Create a new user
*
* updateUser UpdateUser The user to create
* returns User
* */
const createUser = ({updateUser}) => new Promise(
  async (resolve, reject) => {
    try {

      // Simulate a problem with the db
      if (SimulateFail.shouldFail()) {
        reject(Service.rejectResponse({'error':"Unable to create user"}, 500));
        return;
      }

      newId = uuidv4();
      db.run('INSERT INTO user (id, name) VALUES (?,?)',
      [newId, updateUser.name],
      function (err, result) {
          if (err){
            reject(Service.rejectResponse({'error':err.message}, 500));
          } else {
            resolve(Service.successResponse({id: newId, name: updateUser.name}, 201));
          }
      });

    } catch (e) {
      reject(Service.rejectResponse(
        {'error': e.message || 'Invalid input'},
        e.status || 405,
      ));
    }
  },
);

/**
* Get user details
*
* userId String The id of the user to retrieve
* returns User
* */
const loadUserById = ({ userId }) => new Promise(
  async (resolve, reject) => {
    try {
      db.get("select * from user where id = ?", [userId], (err, row) => {
        if (err) {
          reject(Service.rejectResponse({'error':err.message}, 500));
        } else {
          if (row == undefined) {
            reject(Service.rejectResponse({'error':'User not found'}, 404));
          } else {
            // Make a call to the tone service to get tone for the user
            // Should be configured to call the tone service internally via k8s DNS rather than out through the public internet
            var api = new toneClient.ToneApi();
            api.loadToneByUserId(row.id, (error, data, response) =>{
              if (error) {
                // Opt for partial failure here
                resolve(Service.successResponse(row));
              } else {
                row.tone = response.body.tone;
                resolve(Service.successResponse(row));
              }
            });

          }
        }
      });

    } catch (e) {
      reject(Service.rejectResponse(
        {'error': e.message || 'Invalid input'},
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  createID,
  createUser,
  loadUserById,
};
