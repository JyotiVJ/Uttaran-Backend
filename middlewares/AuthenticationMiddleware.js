const jwt = require('jsonwebtoken');
const responseMessages = require('../ResponseMessages');
 
const adminRepositories = require('../repositories/AdminsRepositories');
const userRepositories = require('../repositories/UsersRepositories');

// ################################ Globals ################################ //
const jwtOptionsAccess = global.constants.jwtAccessTokenOptions;


// Admin Authentication
module.exports.authenticateAdminRequestAPI = async (req, res, next) => {
    try{
        if (req.headers.authorization) {
            let accessToken = req.headers.authorization.split(' ')[1]; 
            jwt.verify(accessToken, jwtOptionsAccess.secret, async (err, decodedToken) => {
                if (err) {

                   console.log(err)
                    return res.status(401).json({
                        status: 401,
                        msg: responseMessages.authFailure,
                    })
                }
                else {

                    let userCount = await adminRepositories.count({ id: decodedToken.user_id } );
                    
                    if(userCount > 0) {
                        req.headers.userID = decodedToken.user_id;
                        next();
                    }
                    else{
                        return res.status(401).json({
                            status: 401,
                            msg: responseMessages.authFailure,
                        })
                    }
                }
            });
        }
        else {
            return res.status(401).json({
                status: 401,
                msg: responseMessages.authRequired
            })
        }
    }
    catch(err) {
        console.log("Admin Middleware Error : ", e);
        res.status(500).json({
            status: 500,
            msg: responseMessages.serverError,
        })
    }
}

//User Authentication
module.exports.authenticateRequestAPI = async (req, res, next) => {
       try{
        if (req.headers.authorization) {
            let accessToken = req.headers.authorization.split(' ')[1]; 
            jwt.verify(accessToken, jwtOptionsAccess.secret, async (err, decodedToken) => {
                if (err) {

                   console.log(err)
                    return res.status(401).json({
                        status: 401,
                        msg: responseMessages.authFailure,
                    })
                }
                else {

                    let userCount = await userRepositories.count({ id: decodedToken.user_id } );
                    
                    if(userCount > 0) {
                        req.headers.userID = decodedToken.user_id;
                        next();
                    }
                    else{
                        return res.status(401).json({
                            status: 401,
                            msg: responseMessages.authFailure,
                        })
                    }
                }
            });
        }
        else {
            return res.status(401).json({
                status: 401,
                msg: responseMessages.authRequired
            })
        }
    }
    catch(err) {
        console.log("Admin Middleware Error : ", e);
        res.status(500).json({
            status: 500,
            msg: responseMessages.serverError,
        })
    }
}