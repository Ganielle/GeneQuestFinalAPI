const { default: mongoose } = require("mongoose")
const Scores = require("../models/Score")
const Unlock = require("../models/Unlock")
const Stagescore = require("../models/Stagescore")

exports.savescore = async (req, res) => {
    const {id, username} = req.user

    const {song, score} = req.body

    await Scores.create({owner: new mongoose.Types.ObjectId(id), song: song, amount: score})
    .catch(err => {
        console.log(`There's a problem saving the score for ${username}. Error: ${err}`)
    })

    let canunlock = false;
    let tempscore = 0;

    let songtounlock = "";

    switch (song){
        case "Scales and Triads":

            tempscore = 150 * 0.5;

            if (score >= tempscore)
                canunlock = true;

            songtounlock = "Arpeggio"
        break;
        case "Arpeggio":
            
            tempscore = 150 * 0.5;

            if (score >= tempscore)
                canunlock = true;

            songtounlock = "Circular 5th Major"
        break;
        case "Circular 5th Major":
            
            tempscore = 150 * 0.5;

            if (score >= tempscore)
                canunlock = true;

            songtounlock = "Circular 9th Major"
        break;
        case "Circular 9th Major":
            
            tempscore = 150 * 0.5;

            if (score >= tempscore)
                canunlock = true;

            songtounlock = "Looper 1"
        break;
        case "Looper 1":
            
            tempscore = 150 * 0.5;

            if (score >= tempscore)
                canunlock = true;

            songtounlock = "Looper 2"
        break;
        case "Looper 2":

            tempscore = 150 * 0.75;

            if (score >= tempscore){
                await Finalassessment.findOneAndUpdate({owner: new mongoose.Types.ObjectId(id), unlock: 0}, {unlock: 1})
            }

        break;
    }

    if (canunlock == true)
        await Unlock.findOneAndUpdate({owner: new mongoose.Types.ObjectId(id), song: songtounlock}, {locked: 0})

    return res.json({message: "success"})
}

exports.getscore = async (req, res) => {
    const {id} = req.user

    const {level, studentid} = req.query

    const result = await Stagescore.find({owner: new mongoose.Types.ObjectId(studentid), level: level})
    .sort({ amount: -1 })

    const data = {
        stage1: {
            score: 0
        },
        stage2: {
            score: 0
        },
        stage3: {
            score: 0
        },
        stage4: {
            score: 0
        }
    }

    result.forEach(tempdata => {
        const {stage, level, score} = tempdata

        data[`stage${stage}`]["score"] = score
    })

    return res.json({message: "success", data: data})
}

exports.getleaderboard = async (req, res) => {
    const {id, username} = req.user

    const {section} = req.query

    const result = await Scores.aggregate([
        {
            $lookup: {
                from: "users", // Join with the users collection
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },
        { $unwind: "$ownerDetails" }, // Flatten the owner details
        { 
            $match: { "ownerDetails.section": parseInt(section) } // Filter users by section
        },
        { 
            $sort: { amount: -1 } // Sort scores in descending order
        },
        {
            $group: {
                _id: "$owner", // Group by owner (user ID)
                maxAmount: { $first: "$amount" }, // Get the highest score for each user
                username: { $first: "$ownerDetails.username" } // Keep username
            }
        },
        {
            $project: {
                _id: 0, // Exclude MongoDB's default _id field
                username: 1,
                amount: "$maxAmount"
            }
        },
        {
            $sort: { amount: -1 } // Sort again to maintain order after grouping
        }
    ]);

    return res.json({ message: "success", data: result });
}

exports.getscorehistory = async (req, res) => {
    const {id, username} = req.user
    const {songname} = req.query

    if (!songname){
        return res.status(400).json({message: "failed", data: "Please select a valid song first!"})
    }

    const scorehistorydata = await Scores.find({owner: new mongoose.Types.ObjectId(id), song: songname})
    .limit(10)
    .then(data => data)

    return res.json({message: "success", data: scorehistorydata})
}