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

    fs.readFile(mainDataPath + dir + '/' + file + '.json', 'utf-8', (err, data) => {
        console.log(mainDataPath + dir + '/'+ file + '.json')
        if (!err && data) {        
           
            callback(false, data);
        } else {
            console.log(err)
            callback(err, data)

        }
    })
}

// a function to update a parameter in existed file if file is already existed,
fileSystem.update = (dir, file, bodyDataAddition, callback) => {
    fs.open(mainDataPath + dir + '/' + file + '.json', 'r+', (err, fd) => {
        if (!err) {
            const bodyDataAdditionInString = JSON.stringify(bodyDataAddition);
            //update the file
            fs.ftruncate(fileDescriptor, (err) => {
                if (!err) {
                    fs.writeFile(fd, bodyDataAddition, (err) => {
                        if (!err) {
                            fs.close(fd, (err) => {
                                if (!err) {
                                    callback(false)
                                } else {
                                    callback('Error in closing after updation')
                                }

                            })
                        }
                        else {
                            callback('error in writing  new data in truncated file')

                        }

                    })

                } else {
                    callback('error in updating file')
                }
            })
        }
        else {
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



//read all files 

// fileSystem.readAllFiles = (dir, callback) => {
//     var allFiles = [];
//     var allFilesData = [];
//     let filesNumbers = 0;
//     fs.readdir(mainDataPath + dir + '/'  , (err, files) => {
//         if (!err) {
//                 files.forEach(file => {
//                 allFiles.push(file.split('.')[0]);
//                 fileSystem.read(dir, file, (err, fileData) =>{

//                     if(!err && fileData){
//                         allFiles.data(fileData);
//                         filesNumbers++ ;
//                         if(files.length ===filesNumbers){
//                             callback(200, allFilesData)

//                         }else {
//                             callback( 400, {'error' : "in reading all file data"})
//                         }

//                     } else{
//                         callback(400, {'err': 'reading file data'})
//                     }

//                 })
//             })

//         } else {
//             callback(400, { "error": 'reading all files' })
//         }
//     })
// }





module.exports = fileSystem;

//