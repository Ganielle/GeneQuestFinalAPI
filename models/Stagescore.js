const mongoose = require("mongoose");

const StagescoreSchema = new mongoose.Schema(
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
        score: {
            type: Number
        }
    },
    {
        timestamps: true
    }
)

const Stagescore = mongoose.model("Stagescore", StagescoreSchema)
module.exports = Stagescore