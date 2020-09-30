const { fstat } = require('fs');
const editPath = require('path');
const fs = require('fs')

const mainDataPath = editPath.join(__dirname, './.data/');

console.log(mainDataPath)

fileSystem = {};


//lets create an create key which is having function for creation new file and writing data into ir
//function takes params as required in fs.open,write and close 
fileSystem.create = (dir, file, AnyData, callback) => {
    fs.open(mainDataPath + dir + '/' + file + '.json', 'wx', (err, fd) => {

        if (!err && fd) {
            
            const anyDataString = JSON.stringify(AnyData)

            fs.writeFile(fd, anyDataString, (err) => {
                if (!err) {
                    fs.close(fd, (err) => {
                        if (!err) {
                            callback(false)

                        } else {
                            callback('Error in Closing file');
                        }
                    })
                }
                else {
                    callback('Error in Writing file')
                }
            })

        }
        else {

            callback("Unable to Open file");


        }

    })
}

// a simple function to read file if file is at given path,, taking dir, file and callback as params returing data written in file

fileSystem.read = (dir, file, callback) => {
    fs.readFile(mainDataPath + dir + '/ ' + file + '.json', (err, dataToResponse) => {
        if (!err) {
            callback(err, dataToResponse);
        } else{
            callback('File cant read')

        }
    })
}

// a function to update a parameter in existed file if file is already existed,
 fileSystem.update = (dir, file, bodyDataAddition, callback) => {
     fs.open(mainDataPath + dir + '/' + file + '.json', 'r+', (err, fd) =>{
         if(!err){
            const bodyDataAdditionInString = JSON.stringify(bodyDataAddition);
            //update the file
            fs.ftruncate(fileDescriptor, (err) =>{
                if(!err){
                    fs.writeFile(fd, bodyDataAddition, (err) =>{
                        if(!err){
                            fs.close(fd,(err) => {
                                if(!err){
                                    callback(false)
                                }else{
                                    callback('Error in closing after updation')
                                }

                            })
                        }
                        else{ callback('error in writing  new data in truncated file')

                        }

                    })

                }else {
                    callback('error in updating file')
                }
            })
         }
         else{
             callback('error in onening file for updation')
         }

     })

 }

 ////Delete the File

 fileSystem.delete = (dir, file, callback) => {
   
    fs.unlink(mainDataPath + dir + '/' + file + '.json', (err) => {
        if (!err) {
            callback(false);
        } else {
            callback("Error in Deleting File");
        }
    })
}

module.exports = fileSystem;