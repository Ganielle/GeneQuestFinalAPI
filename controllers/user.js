const { default: mongoose } = require("mongoose")
const Users = require("../models/Users")
const Unlock = require("../models/Unlock")
const Score = require("../models/Score")
const Stagescore = require("../models/Stagescore")

exports.createuser = async (req, res) => {
    const {username, password, gender} = req.body

    if (!username){
        return res.status(400).json({message: "failed", data: "Please enter your username first"})
    }
    else if (!password){
        return res.status(400).json({message: "failed", data: "Please enter your password first"})
    }

    const existing = await Users.find({username: { $regex: new RegExp('^' + username + '$', 'i') }})
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem getting the list of users. Error ${err}`)

        return res.status(400).json({message: "bad-request", data: "There's a problem with the server! Please contact customer support."})
    })

    if (existing.length > 0){
        return res.status(400).json({message: "failed", data: "User already exists"})
    }

    const userdata = await Users.create({username: username, password: password, gender: gender})
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem getting the list of users. Error ${err}`)

        return res.status(400).json({message: "bad-request", data: "There's a problem with the server! Please contact customer support."})
    })

    const stagesunlocked = [
        {
            owner: new mongoose.Types.ObjectId(userdata._id),
            level: 1,
            stage: 1,
            locked: 0,
            played: 0
        },
        {
            owner: new mongoose.Types.ObjectId(userdata._id),
            level: 1,
            stage: 2,
            locked: 1,
            played: 0
        },
        {
            owner: new mongoose.Types.ObjectId(userdata._id),
            level: 1,
            stage: 3,
            locked: 1,
            played: 0
        },
        {
            owner: new mongoose.Types.ObjectId(userdata._id),
            level: 2,
            stage: 1,
            locked: 1,
            played: 0
        },
        
        {
            owner: new mongoose.Types.ObjectId(userdata._id),
            level: 2,
            stage: 2,
            locked: 1,
            played: 0
        },
        
        {
            owner: new mongoose.Types.ObjectId(userdata._id),
            level: 2,
            stage: 3,
            locked: 1,
            played: 0
        },
    ]

    await Unlock.bulkWrite(
        stagesunlocked.map((stagedata) => ({
            insertOne: { document: stagedata },
        }))
    )
    .catch(err => {
        console.log(`There's a problem unlock data ${err}`)
        return res.status(400).json({message: "failed", data: "There's a problem creating user account. Please contact customer support for more details"})
    })

    await Score.create({owner: new mongoose.Types.ObjectId(userdata._id), amount: 0})
    .catch(err => {
        console.log(`There's a problem creating score data ${err}`)
        return res.status(400).json({message: "failed", data: "There's a problem creating user account. Please contact customer support for more details"})
    })

    const stagesscores = [
        {
            owner: new mongoose.Types.ObjectId(userdata._id),
            level: 1,
            stage: 1,
            score: 0
        },
        {
            owner: new mongoose.Types.ObjectId(userdata._id),
            level: 1,
            stage: 2,
            score: 0
        },
        {
            owner: new mongoose.Types.ObjectId(userdata._id),
            level: 1,
            stage: 3,
            score: 0
        },
        {
            owner: new mongoose.Types.ObjectId(userdata._id),
            level: 2,
            stage: 1,
            score: 0
        },
        
        {
            owner: new mongoose.Types.ObjectId(userdata._id),
            level: 2,
            stage: 2,
            score: 0
        },
        
        {
            owner: new mongoose.Types.ObjectId(userdata._id),
            level: 2,
            stage: 3,
            score: 0
        },
    ]
    await Stagescore.bulkWrite(
        stagesscores.map((stagedata) => ({
            insertOne: { document: stagedata },
        }))
    )
    .catch(err => {
        console.log(`There's a problem creating song stages data ${err}`)
        return res.status(400).json({message: "failed", data: "There's a problem creating user account. Please contact customer support for more details"})
    })

    return res.json({message: "success"})
}

exports.listusers = async (req, res) => {
    const {id} = req.user

    const {page, limit} = req.query

    const pageOptions = {
        page: parseInt(page) || 0,
        limit: parseInt(limit) || 10,
    };

    const teachers = await Users.find()
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem getting user list. Error ${err}`)

        return res.status(400).json({message: "bad-request", data: "There's a problem with the server! Please contact customer support for more details"})
    })

    const totalteachers = await Users.countDocuments()
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem getting users count. Error ${err}`)

        return res.status(400).json({message: "bad-request", data: "There's a problem with the server! Please contact customer support for more details"})
    })

    const data = {
        users: [],
        totalpages: Math.ceil(totalteachers / pageOptions.limit)
    }

    teachers.forEach((tempdata) => {
        const {_id, username} = tempdata

        data["users"].push({
            id: _id,
            username: username
        })
    })

    return res.json({message: "success", data: data})
}

exports.getlockedstages = async (req, res) => {
    const { id, username } = req.user;

    const lockeddata = await Unlock.find({ owner: new mongoose.Types.ObjectId(id) })
        .then(data => data)
        .catch(err => {
            console.log(`There's a problem with getting the song data for ${username}. Error: ${err}`);

            return res.status(400).json({
                message: "failed",
                data: "There's a problem with the server. Please contact customer support for more details"
            });
        });

    if (!lockeddata) return; // Prevent further execution if an error occurred

    const data = {
        level1: {},
        level2: {}
    };

    let level1Locked = true;
    let level2Locked = true;

    lockeddata.forEach(tempdata => {
        const { _id, owner, level, stage, locked, played } = tempdata;

        if (!data[`level${level}`]) {
            data[`level${level}`] = {};
        }

        data[`level${level}`][stage] = {
            id: _id,
            owner: owner,
            locked: locked,
            played: played
        };

        // If any stage is unlocked (locked === 0), mark level as unlocked
        if (level === 1 && locked === 0) {
            level1Locked = false;
        }
        if (level === 2 && locked === 0) {
            level2Locked = false;
        }
    });

    // Add the lock status at the bottom
    data.level1locked = level1Locked;
    data.level2locked = level2Locked;

    return res.json({ message: "success", data: data });
};

exports.unlockstages = async (req, res) => {
    const {id} = req.user
    const {level, stage, score} = req.body

    await Unlock.findOneAndUpdate({owner: new mongoose.Types.ObjectId(id), level: level, stage: stage}, {locked: 0})
    .catch(err => {
        console.log(`There's a problem saving new unlock data for id: ${id}  level: ${level}  stage: ${stage}. Error: ${err}`)

        return res.status(400).json({message: "bad-request", data: "There's a problem with the server. Please try again later"})
    })

    if (level == 1 && stage >= 5){
        await Unlock.findOneAndUpdate({owner: new mongoose.Types.ObjectId(id), level: 2, stage: 1}, {locked: 0})
        .catch(err => {
            console.log(`There's a problem saving new unlock data for id: ${id}  level: ${level}  stage: ${stage}. Error: ${err}`)

            return res.status(400).json({message: "bad-request", data: "There's a problem with the server. Please try again later"})
        })
    }

    await Unlock.findOneAndUpdate({owner: new mongoose.Types.ObjectId(id), level: level, stage: (stage - 1)}, {played: 1})
    .catch(err => {
        console.log(`There's a problem saving played unlock data for id: ${id}  level: ${level}  stage: ${stage}. Error: ${err}`)

        return res.status(400).json({message: "bad-request", data: "There's a problem with the server. Please try again later"})
    })

    await Score.findOneAndUpdate({owner: new mongoose.Types.ObjectId(id)}, {$inc: {amount: score}})
    .catch(err => {
        console.log(`There's a problem saving score data for id: ${id}  level: ${level}  stage: ${stage}  score: ${score}. Error: ${err}`)

        return res.status(400).json({message: "bad-request", data: "There's a problem with the server. Please try again later"})
    })
    
    await Stagescore.findOneAndUpdate({owner: new mongoose.Types.ObjectId(id), level: level, stage: (stage - 1)}, {score: score})
    .catch(err => {
        console.log(`There's a problem saving score data for id: ${id}  level: ${level}  stage: ${stage}  score: ${score}. Error: ${err}`)

        return res.status(400).json({message: "bad-request", data: "There's a problem with the server. Please try again later"})
    })

    return res.json({message: "success"})
}