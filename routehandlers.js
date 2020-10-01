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

//API to register a user

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



// handlers._users.get = (data, callback) => {
//     console.log("yes")
//     fileSystem.readAllFiles('users',(err, data) =>{
//         console.log("yes")
//         if(!err&data){
//             console.log("yes")
//             callback(200, data )
//         }else{
//             callback(400, {'error' : "no data for all files"})
//         }


//     })
// }



// get user datt by phone
handlers._users.get = (data, callback) => {

    let phone = data.searchParameters.phone;

    phone = typeof (phone) === 'string' && phone.trim().length === 10 ? phone : false;

    if (phone) {
console.log(phone)
        fileSystem.read('users', phone, (err, data) => {

           
            if (!err && data) {
               
                callback(200, data)
            } else {
                callback(405, {"err" : "unable to read file"})
            }

        })

    } else {
        callback(400, { "err": "Phone No. not valid" })
    }
}


//update the file by put method
handlers._users.put = (data, callback) => {
  
    const phone = typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone : false ;
    const firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length >= 1 ? data.payload.firstName: false ;
    const lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length>= 1 ? data.payload.lastName : false ;
    const password= typeof(data.payload.password) === 'string' && data.payload.password.trim().length >= 6 ? data.payload.password : false ;
    const email  = typeof(data.payload.email ) === 'string' && data.payload.email.trim().length >= 1 ? data.payload.email : false ;
if(phone){
    
    fileSystem.read("users", phone, (err, data) => {
       if(!err && data){
callback(200, {"success" : "opened"})
       }else{
           callback(400, {err})
       }
    })

}else{
    callback(400, {'err' : "missing fields"})
}

}


module.exports = handlers;

//API to get data of all user

