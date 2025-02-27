const mongoose = require("mongoose");

const UnlockSchema = new mongoose.Schema(
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
        locked: {
            type: Number
        },
        played: {
            type: Number
        }
    },
    {
        timestamps: true
    }
)

const Unlock = mongoose.model("Unlock", UnlockSchema)
module.exports = Unlock