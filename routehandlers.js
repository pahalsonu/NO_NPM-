const fileSystem = require("./data");
const config = require("./config");



const handlers = {};
handlers._users = {};
handlers.users = (data, callback) => {

    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) !== -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405, { "Error": "Invalid HTTP Method. Request Failed." });
    }

}

handlers._users.post = (bodyData, callback) => {

    const firstName = typeof (bodyData.payload.firstName) === 'string' && bodyData.payload.firstName.trim().length > 0 ? bodyData.payload.firstName.trim() : false;
    const lastName = typeof (bodyData.payload.lastName) === 'string' && bodyData.payload.lastName.trim().length > 0 ? bodyData.payload.lastName.trim() : false;
    const phone = typeof (bodyData.payload.phone) === 'string' && bodyData.payload.phone.trim().length === 10 ? bodyData.payload.phone.trim() : false;
    const password = typeof (bodyData.payload.password) === 'string' && bodyData.payload.password.length >= 6 ? bodyData.payload.password : false;
    const tosAgreement = typeof (bodyData.payload.tosAgreement) === 'boolean' && bodyData.payload.tosAgreement === true ? true : false;
    const email = typeof (bodyData.payload.email) === 'string' && bodyData.payload.email.length >= 4 ? bodyData.payload.email : false;


    const date = new Date();
    const id = date.toLocaleString();

    if (firstName && lastName && phone && password && tosAgreement && email) {
        fileSystem.read('users', phone, (err, data) => {
            if (err) {

                const Hpassword = config.hash(password);
                if (Hpassword) {
                    const indivisualData = {
                        'firstName': firstName,
                        'lastName': lastName,
                        'phone': phone,
                        'hashedPassword': Hpassword,
                        'tosAgreement': true,
                        'email': email,
                        'ID': id,

                    }


                    fileSystem.create('users', phone, indivisualData, (err) => {
                        if (!err) {
                            callback(200, { "Success": "User Registered" })
                        } else {
                            callback(500, { "err": "Could not create new user" })
                        }
                    })
                } else {
                    callback(400, { 'err': "pass can not be" })
                }
            }

            else {
                callback(400, { "User": "Already Exist" })
            }

        })
    } else {
        callback(400, { "Missing": "Fields" })
    }


}


module.exports = handlers;