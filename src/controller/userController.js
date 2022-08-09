const mongoose = require("mongoose")
const userModel = require("../model/userModel.js")
let validator = require('../controller/validateController')
const upload = require('../controller/awsController')
const bcrypt = require('bcrypt')

const jwt = require("jsonwebtoken")


//POST /register
const createuser = async function (req, res) {
    try {
        let data = req.body
        let files = req.files;
        // console.log(files)
        if (!validator.isValidRequestBody(data)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide user details' })
            return
        }


        if (files && files.length > 0) {

            var uploadedFileURL = await upload.uploadFile(files[0]);

        } else {
            res.status(400).send({ status: false, message: "nothing to write" })
        }

        const { firstName, lastName, email, age, password } = req.body


        if (!validator.isValid(firstName)) {
            return res.status(400).send({ status: false, message: ' Please provide firstname' })
        }
        if (!validator.isValid(lastName)) {
            return res.status(400).send({ status: false, message: ' Please provide lastname' })
        }

        if (!validator.isValid(age)) {
            return res.status(400).send({ status: false, message: ' Please provide lname' })
        }
        if (!(age > 18)) {
            return res.status(400).send({ status: false, message: ' Please provide valid age' })
        }

        const isEmailAlreadyUsed = await userModel.findOne({ email });

        if (isEmailAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${email} email address is already registered` })
        }

        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: ' Please provide password' })
        }
        if (!(password.trim().length > 7 && password.trim().length < 16)) {
            return res.status(400).send({ status: false, message: ' Please provide valid password' })
        }

        const userDetails = { firstName, lastName, email, profileImage: uploadedFileURL, age, password }

        // generate salt to hash password
        const salt = await bcrypt.genSalt(10);
        // now we set user password to hashed password
        userDetails.password = await bcrypt.hash(userDetails.password, salt);


        let saveduser = await userModel.create(userDetails);
        res.status(201).send({ status: true, message: "User created successfully", data: saveduser });

    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, msg: err.message })
    }
}

// login
const login = async function (req, res) {
    try {

        const requestBody = req.body
        if (!validator.isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'value in request body is required' })
            return
        }

        let email = req.body.email
        let password = req.body.password

        if (!validator.isValid(email)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid email' })
            return
        }
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({ status: false, message: `Email should be a valid email address` })
            return
        }

        if (!validator.isValid(password)) {
            res.status(400).send({ status: false, message: 'password must be present' })
            return
        }

        if (email && password) {

            let User = await userModel.findOne({ email: email })

            const passvalid = await bcrypt.compare(password, User.password)
            const Token = jwt.sign({
                userId: User._id,

                iat: Math.floor(Date.now() / 1000), 
                exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60 
            }, "Group9")
            res.header('x-api-key', Token)



            res.status(200).send({ status: true, msg: "User login successfull", data: { userId: User._id, Token: Token } })
        } else {
            res.status(400).send({ status: false, Msg: "Invalid Credentials" })
        }

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

//GET /user/:userId/profile 
const getUser = async function (req, res) {
    try {
        let decodedtokenUserId = req.user
        const userId = req.params.userId

        if (!(validator.isValid(userId))) {
            return res.status(400).send({ status: false, message: 'Please provide valid userId' })
        }

        if (!validator.isValidObjectId(userId) && !isValidObjectId(decodedtokenUserId)) {
            return res.status(404).send({ status: false, message: "userId or token is not valid" })
        }
        const searchprofile = await userModel.findOne({ _id: userId })
        if (!searchprofile) {
            return res.status(404).send({ status: false, message: 'profile does not exist' })
        }

        if (!(decodedtokenUserId === userId)) {
            res.status(400).send({ status: false, message: "userId in url param and in token is not same" })
        }

        const Data = await userModel.find({ _id: userId })
        return res.status(200).send({ status: true, message: 'user profile details', data: Data })

    } catch (error) {

        return res.status(500).send({ success: false, error: error.message });
    }
}

//PUT /user/:userId/profile (Authentication required)
const UpdateUser = async (req, res) => {

    userId = req.params.userId;
    const requestBody = req.body;
    const profileImage = req.files
    TokenDetail = req.user

    if (!validator.isValidRequestBody(requestBody)) {
        return res.status(400).send({ status: false, message: 'No paramateres passed. Book unmodified' })
    }
    const UserFound = await userModel.findOne({ _id: userId })


    if (!UserFound) {
        return res.status(404).send({ status: false, message: `User not found with given UserId` })
    }
    if (!(TokenDetail === userId)) {
        res.status(400).send({ status: false, message: "userId in url param and in token is not same" })
    }



    var { firstName, lastName, email, age, password } = requestBody

    if (Object.prototype.hasOwnProperty.call(requestBody, 'email')) {
        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(requestBody.email))) {
            res.status(400).send({ status: false, message: `Email should be a valid email address` })
            return
        };


        const isEmailAlreadyUsed = await userModel.findOne({ email: requestBody.email });
        if (isEmailAlreadyUsed) {
            res.status(400).send({ status: false, message: `${requestBody.email} email address is already registered` })
            return
        };
    }
   

    if (Object.prototype.hasOwnProperty.call(requestBody, 'password')) {
        requestBody.password = requestBody.password.trim();
        if (!(requestBody.password.length > 7 && requestBody.password.length < 16)) {
            res.status(400).send({ status: false, message: "password should  between 8 and 15 characters" })
            return
        };

        var salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(requestBody.password, salt)
        console.log(password)
        requestBody.password = password;
    }
    if (profileImage && profileImage.length > 0) {
        var uploadedFileURL = await upload.uploadFile(profileImage[0]);
        console.log(uploadedFileURL)
        requestBody.profileImage = uploadedFileURL
    };


    
    requestBody.UpdatedAt = new Date()
    const UpdateData = { firstName, lastName, profileImage: uploadedFileURL, email, age, password }
    const upatedUser = await userModel.findOneAndUpdate({ _id: userId }, UpdateData, { new: true })
    res.status(200).send({ status: true, message: 'User updated successfully', data: upatedUser });

}

const deleteUser = async function (req, res) {
    try {

        const userId = req.params.userId
        if (userId == ':userId') return res.status(400).send({ status: false, message: "Please Enter User Id" })
        let obj = { _id: userId, isDeleted: false }

        if (!(validator.isValid(userId))) {
            return res.status(400).send({ status: false, message: `this userId is not valid` })
        }


        let deletedUser = await userModel.findOneAndUpdate(obj, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
        if (!deletedUser) {
            return res.status(404).send({ status: false, message: 'User Not Found !!!' })
        }

        return res.status(200).send({ status: true, message: "successfully deleted" })

    } catch (err) {

        res.status(500).send({ message: "Error", error: err.message })
    }
};


module.exports = { createuser, login, getUser, UpdateUser, deleteUser }
