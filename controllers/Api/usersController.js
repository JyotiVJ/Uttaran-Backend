/*!
 * UsersController.js
 * Containing all the controller actions related to `USER`
 * Author: Jayanta Mondal
 * Date: 8th January, 2022`
 * MIT Licensed
 */
/**
 * Module dependencies.
 * @private
 */ 



// ################################ Sequelize ################################ //
const sequelize = require('../../config/dbConfig').sequelize;

// ################################ Response Messages ################################ //
const responseMessages = require('../../ResponseMessages');

// ################################ NPM Packages ################################ //
const md5    = require('md5');
const jwt    = require('jsonwebtoken');
const moment = require('moment');
const sharp  = require('sharp');
const path   = require('path');


const commonFunction = require('../../helpers/commonFunction');

// ################################ Globals ################################ //
const jwtOptionsAccess  = global.constants.jwtAccessTokenOptions;
const jwtOptionsRefresh = global.constants.jwtRefreshTokenOptions;


//################################ Repositories ###################################//

const userRepositories = require('../../repositories/UsersRepositories');

//################################ Repositories ###################################//



/*
|------------------------------------------------ 
| API name          :  registerUser
| Response          :  Respective response message in JSON format
| Logic             :  Register User
| Request URL       :  BASE_URL/api/register
| Request method    :  POST
| Author            :  Jayanta Mondal
|------------------------------------------------
*/

module.exports.registerUser = (req, res) => {

	(async() => {

		let purpose = "Register User";

		try {
            let body = req.body;
            //console.log(body)
            let userCount = await userRepositories.count({ email: body.email });

            if (userCount == 0) { 
                let userData;
                await sequelize.transaction(async(t) => {
                    let createUserData = {
                        name: body.name,
                        email: body.email,
                        mobile: body.mobile,
                        password: md5(body.password),
                    }

                    userData = await userRepositories.create(createUserData, t);
                })

                delete userData.password;
                
                let accessToken = jwt.sign({ user_id: userData.id, email: userData.email }, jwtOptionsAccess.secret, jwtOptionsAccess.options);
                let refreshToken = jwt.sign({ user_id: userData.id, email: userData.email }, jwtOptionsRefresh.secret, jwtOptionsRefresh.options);

                userData['access_token']    = accessToken;
                userData['refresh_token']   = refreshToken;

                return res.send({
                    status: 200,
                    msg: responseMessages.registrationSuccess,
                    data: userData,
                    purpose: purpose
                })
            } else {
                return res.send({
                    status: 409,
                    msg: responseMessages.duplicateEmail,
                    data: {},
                    purpose: purpose
                })
            }
        } catch (e) {
            console.log("REGISTER USER ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }

	})()
}


/*
|------------------------------------------------ 
| API name          :  userLogin
| Response          :  Respective response message in JSON format
| Logic             :  User Login
| Request URL       :  BASE_URL/api/login
| Request method    :  POST
| Author            :  Jayanta Mondal
|------------------------------------------------
*/
module.exports.userLogin = (req, res) => {
    (async() => {
        let purpose = "User Login";
        try {
            let body = req.body;

            //console.log(body);
            let whereData = {
                email: body.email,
                password: md5(body.password),
            }
            let userData = await userRepositories.findOne(whereData);

            //console.log(userData)

            if (userData) {

                let jwtOptionsAccess  = global.constants.jwtAccessTokenOptions;
                let jwtOptionsRefresh = global.constants.jwtRefreshTokenOptions;

                let accessToken       = jwt.sign({ user_id: userData.id, email: userData.email }, jwtOptionsAccess.secret, jwtOptionsAccess.options);
                let refreshToken      = jwt.sign({ user_id: userData.id, email: userData.email }, jwtOptionsRefresh.secret, jwtOptionsRefresh.options);

                delete userData.password;
                
                userData['access_token']  = accessToken;
                userData['refresh_token'] = refreshToken;

                //console.log(userData)

                return res.send({
                    status: 200,
                    msg: responseMessages.loginSuccess,
                    data: userData,
                    purpose: purpose
                })
            } else {
                return res.send({
                    status: 403,
                    msg: responseMessages.invalidCreds,
                    data: {},
                    purpose: purpose
                })
            }
        } catch (e) {
            console.log("User Login ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}


/*
|------------------------------------------------ 
| API name          :  Fetch User Details
| Response          :  Respective response message in JSON format
| Logic             :  User Login
| Request URL       :  BASE_URL/api/fetch-user-details
| Request method    :  GET
| Author            :  Jyoti Vankala
|------------------------------------------------
*/
module.exports.fetchUserDetails = (req, res) => {
    (async() => {
        let purpose = "Fetch User Details";
        try {
            let userID = req.headers.userID;

            let userCount = await userRepositories.count({ id: userID });
           
            if (userCount > 0) {
                let userDetails = await userRepositories.findOne({ id: userID });
                

                return res.send({
                    status: 200,
                    msg: responseMessages.userDetailsFetch,
                    data: {
                        user_details: userDetails
                    },
                    purpose: purpose
                }) 
            } else {
                return res.send({
                    status: 500,
                    msg: responseMessages.userNotFound,
                    data: {},
                    purpose: purpose
                })
            }
        } catch (err) {
            console.log("Fetch User Details ERROR : ", err);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}


/*
|------------------------------------------------ 
| API name          :  Upload Profile Image
| Response          :  Respective response message in JSON format
| Logic             :  User Login
| Request URL       :  BASE_URL/api/upload-profile-image
| Request method    :  POST
| Author            :  Jyoti Vankala
|------------------------------------------------
*/
module.exports.uploadProfileImage = (req, res) => {
    (async() => {
        let purpose = "Upload Profile Image";
        try {


            if(req.file) {

                let compressPath = path.join(__dirname, '../../', 'uploads', 'profile', 'profile_image_' + Date.now() + '.jpeg');
                let filePath = `${global.constants.profile_image}/`+'profile_image_' + Date.now() + '.jpeg';
                
                sharp(req.file.path).resize(1080,786).jpeg({
                    quantity:80,
                    chromaSubsampling: '4:4:4'
                }).toFile(compressPath,(err,info)=>{
                    if (err) {
                        console.log(err)
                    }else{
                        console.log(info)
                    }
                })


                return res.status(200).send({
                    status: 200,
                    msg: responseMessages.profileImageUpload,
                    data: {
                        filePath: filePath
                    },
                    purpose: purpose
                })
            } else {
                return res.status(404).json({
                    status: 404,
                    msg: responseMessages.fileNotFound,
                    data: {},
                    purpose: purpose
                })
            }
        } catch (err) {
            console.log("Upload Profile Cover Image : ", err);
            return res.status(500).send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}



/*
|------------------------------------------------ 
| API name          :  Upload Profile Image
| Response          :  Respective response message in JSON format
| Logic             :  User Login
| Request URL       :  BASE_URL/api/upload-profile-image
| Request method    :  POST
| Author            :  Jyoti Vankala
|------------------------------------------------
*/

module.exports.updateUserName = (req, res) => {
    (async() => {
        let purpose = "Update User ";
        try {
            let userID = req.headers.userID;

            let userCount = await userRepositories.count({ id: userID });

            if (userCount > 0) {
                await userRepositories.update({ id: userID }, {
                        name: req.body.name,
                        email: req.body.email,
                        mobile: req.body.mobile,
                        });
                let userDetails = await userRepositories.findOne({ id: userID });
                

                return res.send({
                    status: 200,
                    msg: 'User Updated Successfully',
                    data: {
                        user_details: userDetails
                    },
                    purpose: purpose
                })
            } else {
                return res.send({
                    status: 500,
                    msg: responseMessages.userNotFound,
                    data: {},
                    purpose: purpose
                })
            }
        } catch (err) {
            console.log("Name Update ERROR : ", err);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}


/*
|------------------------------------------------ 
| API name          :  Forgot Password
| Response          :  Respective response message in JSON format
| Logic             :  User Login
| Request URL       :  BASE_URL/api/forgot-password
| Request method    :  POST
| Author            :  Jyoti Vankala
|------------------------------------------------
*/

module.exports.forgotPassword = (req, res) => {
    (async() => {
        let purpose = "Forgot Password"
        try {
            let body = req.body;
            let userDetails = await userRepositories.findOne({ email: body.email });

            if (!userDetails) {
                return res.send({
                    status: 404,
                    msg: responseMessages.invalidUser,
                    data: userDetails,
                    purpose: purpose
                })
            }

            const otpValue = Math.floor(1000 + Math.random() * 9000);
            let updateData = await userRepositories.update({ id: userDetails.id }, { otp: otpValue });

            if (updateData[0] == 1) {
                let mailData = {
                    toEmail: userDetails.email,
                    subject: 'We sent you an OTP to reset your password',
                    // html: `<p>Your OTP is <b>${otpValue}</b></p>`,
                    html: `<body style="background: #f2f2f2;">
                    <div style="width:100%; max-width:600px; margin:0 auto; padding:40px 15px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:8px 0;text-align: center; background:#7f7e7e;">
                      <tr>
                        <th scope="col"><img src="logo.png" alt="" width="150" /></th>
                      </tr>
                    </table>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:60px 40px;text-align: left; background:#fff;">
                      <tr>
                        <th scope="col">
                        <p style="font-size:17px; font-weight:500; color:#000; line-height:24px;">Hi ${userDetails.full_name},</p>
                        <p style="font-size:17px; font-weight:500; color:#000; line-height:24px; margin-top: 20px;">Please use the following code to authorize your device: <strong style="font-size:20px; color:#ff301e;"> ${otpValue}</strong></p>
                        <p style="font-size:17px; font-weight:500; color:#000; line-height:24px; margin-top: 20px;">If you don't recognize this activity, please <a href="#" style="color:#ff301e; margin:0 2px;">reset your password</a>
                          immediately. You can also reach us by responding to this email.</p>
                        <p style="font-size:17px; font-weight:500; color:#000; line-height:24px; margin-top: 20px;">Thanks for your time,</p>
                        <p style="font-size:17px; font-weight:500; color:#000; line-height:24px;">The Kawawa Sound Team </p>    
                        
                        </th>
                      </tr>
                    </table>
                    
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:20px 0;text-align: center; background:#f2f2f2;">
                      <tr>
                        <th scope="col">
                        <p style="font-size:15px; font-weight:500; color:rgb(82, 82, 82)"><a href="#" style="color:rgb(82, 82, 82); margin:0 2px;">Terms & Condition</a> I <a href="#" style="color:rgb(82, 82, 82); margin:0 2px;">Privacy Policy</a> I <a href="#" style="color:rgb(82, 82, 82); margin:0 2px;">Rate App</a></p>
                        <p style="font-size:15px; font-weight:500; color:rgb(82, 82, 82); margin-top: 8px;">655 Montgomery Street, Suite 490, Dpt 17022, San Francisco, CA 94111</p>
                        <p style="font-size:15px; font-weight:500; color:rgb(82, 82, 82); margin-top: 8px;">© 2021 Kawawa Sound Inc.</p>
                        </th>
                      </tr>
                    </table>
                    </div>
                    </body>`
                }
                await commonFunction.sendMail(mailData);

                return res.send({
                    status: 200,
                    msg: responseMessages.otpSendMessgae,
                    data: {},
                    purpose: purpose
                })
            }
            console.log("UPDATE : ", updateData);
        } catch (e) {
            console.log("Forgot Password ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}



/*
|------------------------------------------------ 
| API name          :  Verify Otp
| Response          :  Respective response message in JSON format
| Logic             :  User Login
| Request URL       :  BASE_URL/api/verify-otp-pot
| Request method    :  POST
| Author            :  Jyoti Vankala
|------------------------------------------------
*/

module.exports.verifyOTPOT = (req, res) => {
    (async() => {
        let purpose = "Verify OTP";
        try {
            let body = req.body;
            let whereData = {
                otp: body.otp,
                email: body.email
            }
            let checkOTP = await userRepositories.findOne(whereData)

            if (checkOTP) {
                return res.send({
                    status: 200,
                    msg: 'OTP IS Valid',
                    data: {},
                    purpose: purpose
                })
                console.log(checkOTP);
            } else {
                return res.send({
                    status: 403,
                    msg: responseMessages.invalidOTP,
                    data: {},
                    purpose: purpose
                })
            }

        } 
        catch (e) {
            console.log("Verify OTP ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}



/*
|------------------------------------------------ 
| API name          :  Reset Password 
| Response          :  Respective response message in JSON format
| Logic             :  User Login
| Request URL       :  BASE_URL/api/reset-password
| Request method    :  POST
| Author            :  Jyoti Vankala
|------------------------------------------------
*/

module.exports.resetPassword = (req, res) => {
    (async() => {
        let purpose = "Reset Password";
        try {
            let body = req.body;
            let userDetails = await userRepositories.findOne({ otp: body.otp });

            if (userDetails) {
                let updateData = await userRepositories.update({ id: userDetails.id }, { password: md5(body.password), otp: null });

                if (updateData[0] == 1) {
                    return res.send({
                        status: 200,
                        msg: 'Password Reseted Successfully',
                        data: {},
                        purpose: purpose
                    })
                } else {
                    return res.send({
                        status: 500,
                        msg: responseMessages.serverError,
                        data: {},
                        purpose: purpose
                    })
                }
            } else {
                return res.send({
                    status: 404,
                    msg: responseMessages.invalidOTP,
                    data: {},
                    purpose: purpose
                })
            }
        } catch (e) {
            console.log("Reset Password ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}




/*
|------------------------------------------------ 
| API name          :  upcomingEventList
| Response          :  Respective response message in JSON format
| Logic             :  Fetch Upcoming Event List
| Request URL       :  BASE_URL/api/upcoming-event-fetching-list
| Request method    :  GET
| Author            :  Jyoti Vankala
|------------------------------------------------ 
*/


module.exports.upcomingEventList = (req, res) => {
    (async() => {
        let purpose = "Fetch Upcoming Event List";
        try {
             
            let queryParam = req.query;
            let where      = {};
            let data       = {};
            
            let page = queryParam.page ? parseInt(queryParam.page) : 1;
            data.limit = 10;
            data.offset = data.limit ? data.limit * (page - 1) : null;
            data.order = [
                ['id', 'DESC']
            ];

            where = {
                event_status: '1',
                event_date: {
                  $gte: moment().format('Y-MM-DD H:mm:ss')
                }
            }

            //console.log(where)

            if (queryParam.search) {
                where.event_title = { $like: `%${queryParam.search}%` };
            }

            let eventsList = await userRepositories.findAndCountAllEvent(where, data);

             eventsList.rows.forEach((item , index) => {
             item.event_date = moment(item.event_date).format('DD-MM-Y H:mm:ss'),
             item.createdAt = moment(item.createdAt).format('DD-MM-Y H:mm:ss')
             console.log(item)
             
            });

            return res.send({
                status: 200,
                msg: responseMessages.fetchEventSuccess,
                data: eventsList,
                purpose: purpose
            })

        } catch (e) {
            console.log("Event List ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}


/*
|------------------------------------------------ 
| API name          :  previousEventList
| Response          :  Respective response message in JSON format
| Logic             :  Fetch Previous Event List
| Request URL       :  BASE_URL/api/previous-event-fetching-list
| Request method    :  GET
| Author            :  Jyoti Vankala
|------------------------------------------------ 
*/

module.exports.previousEventList = (req, res) => {
    (async() => {
        let purpose = "Fetch Previous Event List";
        try {
             
            let queryParam = req.query;
            let where      = {};
            let data       = {};
            
            let page = queryParam.page ? parseInt(queryParam.page) : 1;
            data.limit = 10;
            data.offset = data.limit ? data.limit * (page - 1) : null;
            data.order = [
                ['id', 'DESC']
            ];

            where = {
                event_status: '1',
                event_date: {
                  $lte: moment().format('Y-MM-DD H:mm:ss')
                }
            }

            //console.log(where)

            if (queryParam.search) {
                where.event_title = { $like: `%${queryParam.search}%` };
            }

            let eventsList = await userRepositories.findAndCountAllEvent(where, data);

             eventsList.rows.forEach((item , index) => {
             item.event_date = moment(item.event_date).format('DD-MM-Y H:mm:ss'),
             item.createdAt = moment(item.createdAt).format('DD-MM-Y H:mm:ss')
             console.log(item)
             
            });

            return res.send({
                status: 200,
                msg: responseMessages.fetchEventSuccess,
                data: eventsList,
                purpose: purpose
            })

        } catch (e) {
            console.log("Event List ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}



/*
|------------------------------------------------ 
| API name          :  getHomes
| Response          :  Respective response message in JSON format
| Logic             :  Fetch About Us Data
| Request URL       :  BASE_URL/api/fetch-aboutUs
| Request method    :  GET
| Author            :  Jyoti Vankala
|------------------------------------------------ 
*/

module.exports.getAboutUs = (req, res) => {
    (async() => {
        let purpose = "Fetch About Us";
        try {

            let getHomeData = await userRepositories.findAboutUs({});

            return res.send({
                status: 200,
                msg: responseMessages.fetchAboutUs,
                data: getHomeData,
                purpose: purpose
            })

        } catch (e) {
            console.log("Fetch Homes ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}

/*
|------------------------------------------------ 
| API name          :  getHomes
| Response          :  Respective response message in JSON format
| Logic             :  Fetch Home Data
| Request URL       :  BASE_URL/admin/fetch-home
| Request method    :  GET
| Author            :  Jyoti Vankala
|------------------------------------------------ 
*/

module.exports.getHome = (req, res) => {
    (async() => {
        let purpose = "Fetch Homes";
        try {

            let getHomeData = await userRepositories.findHome({});

            return res.send({
                status: 200,
                msg: responseMessages.fetchHomeSuccess,
                data: getHomeData,
                purpose: purpose
            })

        } catch (e) {
            console.log("Fetch Homes ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}




/*
|------------------------------------------------ 
| API name          :  getMotivation
| Response          :  Respective response message in JSON format
| Logic             :  Fetch About Us Data
| Request URL       :  BASE_URL/api/fetch-motivation
| Request method    :  GET
| Author            :  Jyoti Vankala
|------------------------------------------------ 
*/

module.exports.getMotivation = (req, res) => {
    (async() => {
        let purpose = "Fetch Motivation";
        try {

            let getMotivationData = await userRepositories.findMotivation({});

            return res.send({
                status: 200,
                msg: responseMessages.fetchMotivation,
                data: getMotivationData,
                purpose: purpose
            })

        } catch (e) {
            console.log("Fetch Motivation ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}


// module.exports.uploadAlbumImages = (req, res) => {
//     (async() => {
//         let purpose = "Upload Albums Image";
//         try {


//             if(req.files) {
//                 console.log(req.files)

//                 let compressPath = path.join(__dirname, '../../', 'uploads', 'podcast_image', 'podcasts_cover_url_' + Date.now() + '.jpeg');
//                 let filePath = `${global.constants.podcasts_cover_url}/`+'podcasts_cover_url_' + Date.now() + '.jpeg';

//                 sharp(req.files.path).resize(1080,786).jpeg({
//                     quantity:80,
//                     chromaSubsampling: '4:4:4'
//                 }).toFile(compressPath,(err,info)=>{
//                     if (err) {
//                         console.log(err)
//                     }else{
//                         console.log(info)
//                     }
//                 })


//                 return res.status(200).send({
//                     status: 200,
//                     msg: responseMessages.profileImageUpload,
//                     // data: {
//                     //     filePath: filePath
//                     // },
//                     purpose: purpose
//                 })
//             } else {
//                 return res.status(404).json({
//                     status: 404,
//                     msg: responseMessages.fileNotFound,
//                     data: {},
//                     purpose: purpose
//                 })
//             }
//         } catch (err) {
//             console.log("Upload Profile Cover Image : ", err);
//             return res.status(500).send({
//                 status: 500,
//                 msg: responseMessages.serverError,
//                 data: {},
//                 purpose: purpose
//             })
//         }
//     })()
// }


module.exports.uploadAlbumImages = (req, res) => {
    (async() => {
        let purpose = "Upload Picture";
        try {

            let filePath;
             req.files.forEach((item , index) => {
             filePath = req.files
             //console.log(item) 
             });

            req.files.forEach(element => {
             //  filePath.push(element.name)
             filePath.push(`${global.constants.album_cover_url}/${element.filename}`);
                
            });

      
            return res.status(200).send({
                status: 200,
                msg: responseMessages.albumUpload,
                data: filePath,
                purpose: purpose
            })
        } catch (err) {
            console.log("Upload Images ERROR : ", err);
            return res.status(500).send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}