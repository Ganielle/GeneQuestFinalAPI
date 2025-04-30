const { default: mongoose } = require("mongoose")
const AnswerPunettSquare = require("../models/AnswerPunettSquare")
const Multiplechoiceanswer = require("../models/Multiplechoiceanswer")

exports.getviewanswer = async (req, res) => {
    const {id} = req.user

    const {level, stage} = req.query

    const tempval = await AnswerPunettSquare.findOne({owner: new mongoose.Types.ObjectId(id), level: level, stage: stage})
    .catch(err => {
        console.log(`There's a problem getting the punnett square answer for level: ${level} stage: ${stage}`)

        return res.status(400).json({message: "bad-request", data: "There's a problem with the server! Please try again later"})
    })

    if (!tempval){
        return res.status(400).json({message: "failed", data: "You haven't played or unlocked this stage yet!"})
    }

    const tempdata = {
        type: "",
        level: 0,
        stage: 0,
        squareanswer: {},
        multiplechoiceanswer: {}
    }
    
    tempdata.type = tempval.type
    tempdata.level = tempval.level
    tempdata.stage = tempval.stage

    tempval.answer.forEach(temp => {
        const {index, data} = temp

        tempdata.squareanswer[index] = data
    })

    const tempvalchoice = await Multiplechoiceanswer.findOne({owner: new mongoose.Types.ObjectId(id), level: level, stage: stage})
    .catch(err => {
        console.log(`There's a problem getting the punnett square answer for level: ${level} stage: ${stage}`)

        return res.status(400).json({message: "bad-request", data: "There's a problem with the server! Please try again later"})
    })

    if (!tempval){
        return res.status(400).json({message: "failed", data: "You haven't played or unlocked this stage yet!"})
    }

    tempvalchoice.answer.forEach(temp => {
        const {index, data} = temp

        tempdata.multiplechoiceanswer[index] = data
    })

    return res.json({message: "success", data: tempdata})
}