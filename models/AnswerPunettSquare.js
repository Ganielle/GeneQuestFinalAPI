const mongoose = require("mongoose");

const AnswerPunettSquareSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            index: true // Automatically creates an index on 'amount'
        },
        chapter: {
            type: String
        },
        index: {
            type: number
        },
        answer: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

const AnswerPunettSquare = mongoose.model("AnswerPunettSquare", AnswerPunettSquareSchema)
module.exports = AnswerPunettSquare