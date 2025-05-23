
//  Import all mandatory schemas and delete this if necessary
const Users = require("../models/Users")
const Staffusers = require("../models/Staffusers")

const fs = require('fs')

const bcrypt = require('bcrypt');
const jsonwebtokenPromisified = require('jsonwebtoken-promisified');
const path = require("path");

const privateKey = fs.readFileSync(path.resolve(__dirname, "../keys/private-key.pem"), 'utf-8');
const { default: mongoose } = require("mongoose");

const encrypt = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

exports.authlogin = async(req, res) => {
    const { username, password } = req.query;

    Users.findOne({ username: { $regex: new RegExp('^' + username + '$', 'i') } })
    .then(async user => {
        if (user && (await user.matchPassword(password))){
            if (user.status != "active"){
                return res.status(401).json({ message: 'failed', data: `Your account had been ${user.status}! Please contact support for more details.` });
            }

            const token = await encrypt(privateKey)

            await Users.findByIdAndUpdate({_id: user._id}, {$set: {token: token}}, { new: true })
            .then(async (tempdata) => {
                const payload = { id: user._id, username: user.username, status: user.status, token: token, auth: "player" }

                let jwtoken = ""

                try {
                    jwtoken = await jsonwebtokenPromisified.sign(payload, privateKey, { algorithm: 'RS256' });
                } catch (error) {
                    console.error('Error signing token:', error.message);
                    return res.status(500).json({ error: 'Internal Server Error', data: "There's a problem signing in! Please contact customer support for more details! Error 004" });
                }

                return res.json({message: "success", data: {
                    auth: "player",
                    token: jwtoken,
                    gender: tempdata.gender,
                    section: tempdata.section
                }})
            })
            .catch(err => res.status(400).json({ message: "bad-request2", data: "There's a problem with your account! There's a problem with your account! Please contact customer support for more details."  + err }))
        }
        else{
            return res.status(400).json({message: "failed", data: "No user found! Please enter correct credentials"})
        }
    })
    .catch(err => res.status(400).json({ message: "bad-request1", data: "There's a problem with your account! There's a problem with your account! Please contact customer support for more details." }))
}

exports.authteacherlogin = async(req, res) => {
    const { username, password } = req.query;

    Staffusers.findOne({ username: { $regex: new RegExp('^' + username + '$', 'i') } })
    .then(async user => {
        if (user && (await user.matchPassword(password))){
            if (user.status != "active"){
                return res.status(401).json({ message: 'failed', data: `Your account had been ${user.status}! Please contact support for more details.` });
            }

            const token = await encrypt(privateKey)

            await Staffusers.findByIdAndUpdate({_id: user._id}, {$set: {token: token}}, { new: true })
            .then(async () => {
                const payload = { id: user._id, username: user.username, status: user.status, token: token, auth: "Teacher" }

                let jwtoken = ""

                try {
                    jwtoken = await jsonwebtokenPromisified.sign(payload, privateKey, { algorithm: 'RS256' });
                } catch (error) {
                    console.error('Error signing token:', error.message);
                    return res.status(500).json({ error: 'Internal Server Error', data: "There's a problem signing in! Please contact customer support for more details! Error 004" });
                }

                return res.json({message: "success", data: {
                    auth: user.auth,
                    token: jwtoken
                }})
            })
            .catch(err => res.status(400).json({ message: "bad-request2", data: "There's a problem with your account! There's a problem with your account! Please contact customer support for more details."  + err }))
        }
        else{
            return res.status(400).json({message: "failed", data: "No user found! Please enter correct credentials"})
        }
    })
    .catch(err => res.status(400).json({ message: "bad-request1", data: "There's a problem with your account! There's a problem with your account! Please contact customer support for more details." }))
}

exports.authsuperadminlogin = async(req, res) => {
    const { username, password } = req.query;

    Staffusers.findOne({ username: { $regex: new RegExp('^' + username + '$', 'i') } })
    .then(async user => {
        if (user && (await user.matchPassword(password))){
            if (user.status != "active"){
                return res.status(401).json({ message: 'failed', data: `Your account had been ${user.status}! Please contact support for more details.` });
            }

            const token = await encrypt(privateKey)

            await Staffusers.findByIdAndUpdate({_id: user._id}, {$set: {token: token}}, { new: true })
            .then(async () => {
                const payload = { id: user._id, username: user.username, status: user.status, token: token, auth: "Superadmin" }

                let jwtoken = ""

                try {
                    jwtoken = await jsonwebtokenPromisified.sign(payload, privateKey, { algorithm: 'RS256' });
                } catch (error) {
                    console.error('Error signing token:', error.message);
                    return res.status(500).json({ error: 'Internal Server Error', data: "There's a problem signing in! Please contact customer support for more details! Error 004" });
                }

                return res.json({message: "success", data: {
                    auth: user.auth,
                    token: jwtoken
                }})
            })
            .catch(err => res.status(400).json({ message: "bad-request2", data: "There's a problem with your account! There's a problem with your account! Please contact customer support for more details."  + err }))
        }
        else{
            return res.status(400).json({message: "failed", data: "No user found! Please enter correct credentials"})
        }
    })
    .catch(err => res.status(400).json({ message: "bad-request1", data: "There's a problem with your account! There's a problem with your account! Please contact customer support for more details." }))
}

// exports.logout = async (req, res) => {
//     res.clearCookie('sessionToken', { path: '/' })
//     return res.json({message: "success"})
// }