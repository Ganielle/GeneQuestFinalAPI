const { default: mongoose } = require("mongoose");
const Staffusers = require("../models/Staffusers")
const { ObjectId } = require('mongodb');

exports.createteacher = async (req, res) => {
    const {username, password} = req.body

    if (!username){
        return res.status(400).json({message: "failed", data: "Please enter your username first"})
    }
    else if (!password){
        return res.status(400).json({message: "failed", data: "Please enter your password first"})
    }

    const existing = await Staffusers.find({username: { $regex: new RegExp('^' + username + '$', 'i') }})
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem getting the list of users. Error ${err}`)

        return res.status(400).json({message: "bad-request", data: "There's a problem with the server! Please contact customer support."})
    })

    if (existing.length > 0){
        return res.status(400).json({message: "failed", data: "User already exists"})
    }

    await Staffusers.create({username: username, password: password, token: "", bandate: "", status: "active", auth: "Teacher"})
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem getting the list of users. Error ${err}`)

        return res.status(400).json({message: "bad-request", data: "There's a problem with the server! Please contact customer support."})
    })

    return res.json({message: "success"})
}

exports.listteachers = async (req, res) => {
    const {id} = req.user

    const {page, limit} = req.query

    const pageOptions = {
        page: parseInt(page) || 0,
        limit: parseInt(limit) || 10,
    };

    const teachers = await Staffusers.find({auth: "Teacher"})
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem getting teacher list. Error ${err}`)

        return res.status(400).json({message: "bad-request", data: "There's a problem with the server! Please contact customer support for more details"})
    })

    const totalteachers = await Staffusers.countDocuments({auth: "Teacher"})
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem getting clients count. Error ${err}`)

        return res.status(400).json({message: "bad-request", data: "There's a problem with the server! Please contact customer support for more details"})
    })

    const data = {
        teachers: [],
        totalpages: Math.ceil(totalteachers / pageOptions.limit)
    }

    teachers.forEach((tempdata) => {
        const {_id, username} = tempdata

        data["teachers"].push({
            id: _id,
            username: username
        })
    })

    return res.json({message: "success", data: data})
}

exports.deleteteacher = async (req, res) => {
    const {id} = req.user

    const {teacherid} = req.body

    if (!teacherid){
        return res.status(400).json({message: "failed", data: "Please select a valid user before deleting."})
    }
    else if (!ObjectId.isValid(teacherid)){
        return res.status(400).json({message: "failed", data: "The selected user is not valid! Please don't tamper with the app"})
    }

    await Staffusers.deleteOne({_id: new mongoose.Types.ObjectId(teacherid)})
    .catch(err => {
        console.log(`There's a problem with deleting teacher ${teacherid}. Error: ${err}`)

        return res.status(400).json({message: "bad-request", data: "There's a problem with the server. Please try again later."})
    })


    return res.json({message: "success"})
}