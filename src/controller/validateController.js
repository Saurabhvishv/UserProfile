const mongoose = require('mongoose')

const isValid = function (value) {

    if (typeof value === 'undefined'|| value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}


const validString = function(value) {
    if (typeof value === 'string' && value.trim().length === 0) return false //it checks whether the string contain only space or not 
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}


let isValidObjectId = function(ObjectId){
    return mongoose.Types.ObjectId.isValid(ObjectId)
}



module.exports = {isValidRequestBody,validString ,isValid , isValidAge, isValidObjectId}