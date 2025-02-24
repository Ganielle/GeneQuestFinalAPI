const Staffusers = require("../models/Staffusers")

exports.initserver = async() => {

    console.log("Starting init server")

    const admin = await Staffusers.findOne({username: "genequestadmin"})
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem initializing admin user. Error: ${err}`)

        return
    })

    if (!admin){
        await Staffusers.create({username: "genequestadmin", password: "3dN6Ix5YPmKm", token: "", bandate: "", status: "active", auth: "superadmin"})
        .catch(err => {
            console.log(`There's a problem creating admin user. Error: ${err}`)
    
            return
        })
    }
    
    console.log("Done init server")
}