const mongoose = require("mongoose");

const multiplechoiceanswerSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            index: true // Automatically creates an index on 'amount'
        },
        level: {
            type: Number
        },
        stage: {
            type: Number
        },
        answer: [{
            index: {
                type: String
            },
            data: {
                type: String
            }
        }]
    },
    {
        timestamps: true
    }
)

const Multiplechoiceanswer = mongoose.model("Multiplechoiceanswer", multiplechoiceanswerSchema)
module.exports = Multiplechoiceanswer