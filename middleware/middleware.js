//  Import here your User schema for checking of accounts
const Users = require("../models/Users")
const Staffusers = require("../models/Staffusers")

const fs = require('fs');
const path = require("path");
const publicKey = fs.readFileSync(path.resolve(__dirname, "../keys/public-key.pem"), 'utf-8');
const jsonwebtokenPromisified = require('jsonwebtoken-promisified');

const verifyJWT = async (token) => {
    try {
        const decoded = await jsonwebtokenPromisified.verify(token, publicKey, { algorithms: ['RS256'] });
        return decoded;
    } catch (error) {
        console.error('Invalid token:', error.message);
        throw new Error('Invalid token');
    }
};

exports.protectplayer = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.json({ message: 'Unauthorized' });
    }

    try {
        if (!token.startsWith("Bearer")) {
            return res.json({ message: 'Unauthorized' });
        }
        const headerpart = token.split(' ')[1];

        const decodedToken = await verifyJWT(headerpart);

        const user = await Users.findOne({ username: decodedToken.username });
        
        if (!user) {
            
            const staff = await Staffusers.findOne({ username: decodedToken.username });
            
            if (!staff) {
                res.clearCookie('sessionToken', { path: '/' });
                return res.json({ message: 'Unauthorized' });
            }
        }

        // if (decodedToken.token != user.token) {
        //     res.clearCookie('sessionToken', { path: '/' });
        //     return res.json({ message: 'duallogin', data: `Your account had been opened on another device! You will now be logged out.` });
        // }

        req.user = decodedToken;
        next();
    } catch (ex) {
        console.log(`Error in protectplayer middleware: ${ex.message}`);
        return res.json({ message: 'Unauthorized' });
    }
};

exports.protectteacher = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.json({ message: 'Unauthorized' });
    }

    try {
        if (!token.startsWith("Bearer")) {
            return res.json({ message: 'Unauthorized' });
        }
        const headerpart = token.split(' ')[1];

        const decodedToken = await verifyJWT(headerpart);

        const user = await Staffusers.findOne({ username: decodedToken.username });
        
        if (!user) {
            res.clearCookie('sessionToken', { path: '/' });
            return res.json({ message: 'Unauthorized' });
        }

        // if (decodedToken.token != user.token) {
        //     res.clearCookie('sessionToken', { path: '/' });
        //     return res.json({ message: 'duallogin', data: `Your account had been opened on another device! You will now be logged out.` });
        // }

        req.user = decodedToken;
        next();
    } catch (ex) {
        console.log(`Error in protectteacher middleware: ${ex.message}`);
        return res.json({ message: 'Unauthorized' });
    }
};

// exports.protectsuperadmin = async (req, res, next) => {
//     const token = req.headers.cookie?.split('; ').find(row => row.startsWith('sessionToken='))?.split('=')[1]

//     if (!token){
//         return res.status(401).json({ message: 'Unauthorized', data: "You are not authorized to view this page. Please login the right account to view the page." });
//     }

//     try{
//         const decodedToken = await verifyJWT(token);

//         if (decodedToken.auth != "superadmin"){
//             return res.status(401).json({ message: 'Unauthorized', data: "You are not authorized to view this page. Please login the right account to view the page." });
//         }

//         const user = await Staffusers.findOne({username: decodedToken.username})
//         .then(data => data)

//         if (!user){
//             res.clearCookie('sessionToken', { path: '/' })
//             return res.status(401).json({ message: 'Unauthorized', data: "You are not authorized to view this page. Please login the right account to view the page." });
//         }

//         if (user.status != "active"){
//             res.clearCookie('sessionToken', { path: '/' })
//             return res.status(401).json({ message: 'failed', data: `Your account had been ${user.status}! Please contact support for more details.` });
//         }

//         if (decodedToken.token != user.webtoken){
//             res.clearCookie('sessionToken', { path: '/' })
//             return res.status(401).json({ message: 'duallogin', data: `Your account had been opened on another device! You will now be logged out.` });
//         }

//         req.user = decodedToken;
//         next();
//     }
//     catch(ex){
//         return res.status(401).json({ message: 'Unauthorized', data: "You are not authorized to view this page. Please login the right account to view the page." });
//     }
// }