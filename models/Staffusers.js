const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const StaffusersSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            index: true // Automatically creates an index on 'amount'
        },
        password: {
            type: String
        },
        token: {
            type: String
        },
        bandate: {
            type: String
        },
        status: {
            type: String,
            default: "active",
            index: true // Automatically creates an index on 'amount'
        },
        auth: {
            type: String,
            index: true
        }
    },
    {
        timestamps: true
    }
)

StaffusersSchema.pre("save", async function (next) {
    if (!this.isModified){
        next();
    }

    this.password = await bcrypt.hashSync(this.password, 10)
})

StaffusersSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

const Staffusers = mongoose.model("Staffusers", StaffusersSchema)
module.exports = Staffusers