const mongoose = require("mongoose");

const ScoreSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            index: true // Automatically creates an index on 'amount'
        },
        amount: {
            type: Number
        }
    },
    {
        timestamps: true
    }
)

const Scores = mongoose.model("Scores", ScoreSchema)
module.exports = Scores