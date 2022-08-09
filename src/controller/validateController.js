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

function validatePIN(pin) {
    if(pin.length === 4 ||  pin.length === 6 ) {
      if( /[0-9]/.test(pin))  {
        return true;
      }else {return false;}
    }else {
        return false;
        }
  }

  let isValidPhone = function(str) {

    if (/^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(str)) {
        return true
    }
    return false
}


let isValidObjectId = function(ObjectId){
    return mongoose.Types.ObjectId.isValid(ObjectId)
}



const isValidStatus = function(title) {
    return ['pending', 'completed', 'cancled'].indexOf(title) !== -1
}
const isValidavailableSizes = function (value) {
    let avilable = ["S", "XS", "M", "X", "L", "XXL", "XL"]
    value = value.split(",")
    for (let x of value) {
        if (avilable.includes(x) == false) {
            return false
        }
    }
    return true;
}




const isValidNumber = function (value) {
    if (typeof (value) === Number ) { return true } }




module.exports = {isValidRequestBody,validString ,isValid , isValidPhone, isValidObjectId,validatePIN,isValidavailableSizes,isValidNumber,isValidStatus}//