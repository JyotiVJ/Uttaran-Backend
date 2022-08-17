/*!
 * AdminsController.js
 * Containing all the controller actions related to `USER`
 * Author: Jyoti Vankala
 * Date: 6th May, 2022`
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
// ################################ Globals ################################ //
const jwtOptionsAccess  = global.constants.jwtAccessTokenOptions;
const jwtOptionsRefresh = global.constants.jwtRefreshTokenOptions;


//################################ Repositories ###################################//

const userRepositories  = require('../../repositories/UsersRepositories');
const adminRepositories = require('../../repositories/AdminsRepositories');

//################################ Repositories ###################################//


/*
|------------------------------------------------ 
| API name          :  adminLogin
| Response          :  Respective response message in JSON format
| Logic             :  User Login
| Request URL       :  BASE_URL/admin/login
| Request method    :  POST
| Author            :  Jayanta Mondal
|------------------------------------------------
*/
module.exports.adminLogin = (req, res) => {
    (async() => {
        let purpose = "Admin Login";
        try {
            let body = req.body;

            //console.log(body);
            let whereData = {
                email: body.email,
                password: md5(body.password),
            }
            let adminData = await adminRepositories.findOne(whereData);

            //console.log(adminData)

            if (adminData) {

                let jwtOptionsAccess  = global.constants.jwtAccessTokenOptions;
                let jwtOptionsRefresh = global.constants.jwtRefreshTokenOptions;

                let accessToken       = jwt.sign({ user_id: adminData.id, email: adminData.email }, jwtOptionsAccess.secret, jwtOptionsAccess.options);
                let refreshToken      = jwt.sign({ user_id: adminData.id, email: adminData.email }, jwtOptionsRefresh.secret, jwtOptionsRefresh.options);

                delete adminData.password;
                
                adminData['access_token']  = accessToken;
                adminData['refresh_token'] = refreshToken;

                //console.log(adminData)

                return res.send({
                    status: 200,
                    msg: responseMessages.loginSuccess,
                    data: adminData,
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
| API name          :  getHomes
| Response          :  Respective response message in JSON format
| Logic             :  Fetch Home Data
| Request URL       :  BASE_URL/admin/fetch-homes
| Request method    :  GET
| Author            :  Jayanta Mondal
|------------------------------------------------ 
*/

module.exports.getHomes = (req, res) => {
    (async() => {
        let purpose = "Fetch Homes";
        try {

            let getHomeData = await adminRepositories.findHome({});

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
| API name          :  updateHomes
| Response          :  Respective response message in JSON format
| Logic             :  Update Home Data
| Request URL       :  BASE_URL/admin/update-homes
| Request method    :  PUT
| Author            :  Jayanta Mondal
|------------------------------------------------
*/

module.exports.updateHomes = (req, res) => {
    (async() => {
        let purpose = "Update Homes";
        try {

            let body = req.body;

            await sequelize.transaction(async(t)=>{

                let updateData = {
                    title_one: body.title_one,
                    title_two: body.title_two,
                    sub_title: body.sub_title,
                    youtube_link: body.youtube_link
                }

                let where = {
                    id: 1
                }

                await adminRepositories.updateHomesDetails(where, updateData, t);
            })

            return res.send({
                status: 200,
                msg: responseMessages.updateHomes,
                data: body,
                purpose: purpose
            })

        } catch (e) {
            console.log("Update Homes ERROR : ", e);
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
| API name          :  uploadEventCoverImage
| Response          :  Respective response message in JSON format
| Logic             :  Upload Event Cover Image
| Request URL       :  BASE_URL/admin/upload-event-image
| Request method    :  POST
| Author            :  Jayanta Mondal
|------------------------------------------------
*/
module.exports.uploadEventCoverImage = (req, res) => {
    (async() => {
        let purpose = "Upload Event Cover Image";
        try {

            //console.log(req)

            if(req.file) {

                let compressPath = path.join(__dirname, '../../', 'uploads', 'events', 'event_cover_' + Date.now() + '.jpeg');
                let filePath = `${global.constants.event_cover_image}/`+'event_cover_' + Date.now() + '.jpeg';
                
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
                    msg: responseMessages.eventImageUpload,
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
            console.log("Upload Event Cover Image : ", err);
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
| API name          :  createEvent
| Response          :  Respective response message in JSON format
| Logic             :  Create New Event
| Request URL       :  BASE_URL/artist/create-event
| Request method    :  POST
| Author            :  Jayanta Mondal
|------------------------------------------------
*/
module.exports.createEvent = (req, res) => {
    (async()=>{
        let purpose = "Create New Event";
        try {
             
            let body = req.body;
            let eventDetails  = null;
           
            await sequelize.transaction(async(t) => {

                let insertData = {
                    event_image: body.event_image,
                    event_title: body.event_title,
                    event_description: body.event_description,
                    event_location: body.event_location,
                    event_date: body.event_date,
                    event_type: body.event_type,
                }

                eventDetails = await adminRepositories.createNewEvent(insertData, t);
                 
            })
             
            
            return res.status(200).send({
                status: 200,
                msg: responseMessages.eventCreate,
                data: eventDetails,
                purpose: purpose
            })
        }   
        catch(err) {
            console.log("Create New Song Error : ", err);
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
| API name          :  eventList
| Response          :  Respective response message in JSON format
| Logic             :  Fetch Event List Data
| Request URL       :  BASE_URL/admin/event-list
| Request method    :  GET
| Author            :  Jayanta Mondal
|------------------------------------------------
*/

module.exports.eventList = (req, res) => {
    (async() => {
        let purpose = "Fetch Event List";
        try {
             
            let queryParam = req.query;
            let where      = {};
            let data       = {};
            
            let page = queryParam.page ? parseInt(queryParam.page) : 1;
            let size = queryParam.size ? parseInt(queryParam.size) : 10;
            
            data.limit = size;
        
            data.offset = data.limit ? data.limit * (page - 1) : null;
            data.order = [
                ['id', 'DESC']
            ];

            where = {
                event_status: '1',
                // event_date: {
                //   $gte: moment().format('Y-MM-DD H:mm:ss')
                // }
            }

            //console.log(where)

            if (queryParam.search) {
                where.event_title = { $like: `%${queryParam.search}%` };
            }

            let eventsList = await adminRepositories.findAndCountAllEvent(where, data);

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
| API name          :  eventDetails
| Response          :  Respective response message in JSON format
| Logic             :  Fetch Event List Data
| Request URL       :  BASE_URL/admin/event-details/:event_id
| Request method    :  GET
| Author            :  Jayanta Mondal
|------------------------------------------------
*/

module.exports.eventDetails = (req, res) => {
    (async() => {
        let purpose = "Fetch Event Details";
        try {
             
            let params     = req.params;
            let where      = {};
            let event_id   = params.event_id;
            where = {
                id: event_id
            }
            let eventsDetails = {}
            eventsDetails     = await adminRepositories.findOneEvent(where);

            if(eventsDetails==null){
                eventsDetails = {}
            }

            return res.send({
                status: 200,
                msg: responseMessages.fetchEventDetails,
                data: eventsDetails,
                purpose: purpose
            })

        } catch (e) {
            console.log("Event Details ERROR : ", e);
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
| API name          :  changeStatusOfEvent
| Response          :  Respective response message in JSON format
| Logic             :  Change Event Status
| Request URL       :  BASE_URL/admin/change-event-status/:event_id
| Request method    :  GET
| Author            :  Jayanta Mondal
|------------------------------------------------
*/

module.exports.changeStatusOfEvent = (req, res) => {
    (async() => {
        let purpose = "Change Event Status";
        try {
             
            let params       = req.params;
            let queryParams  = req.query;
            let where        = {};
            let event_id   = params.event_id;
            
            await sequelize.transaction(async(t)=>{

                let updateData = {
                    event_status: queryParams.event_status,
                }

                where = {
                    id: event_id
                }

                await adminRepositories.updateEventData(where, updateData, t);
            })

            return res.send({
                status: 200,
                msg: responseMessages.eventStatusChange,
                data: {},
                purpose: purpose
            })

        } catch (e) {
            console.log("Event Details ERROR : ", e);
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
| API name          :  updateEvent
| Response          :  Respective response message in JSON format
| Logic             :  Update Event Data
| Request URL       :  BASE_URL/admin/update-event/:event_id
| Request method    :  GET
| Author            :  Jayanta Mondal
|------------------------------------------------
*/

module.exports.updateEvent = (req, res) => {
    (async() => {
        let purpose = "Change Event Status";
        try {
             
            let params   = req.params;
            let body     = req.body;
            let where    = {};
            let event_id = params.event_id;
            
            await sequelize.transaction(async(t)=>{

                let updateData = {
                    event_image: body.event_image,
                    event_title: body.event_title,
                    event_location: body.event_location,
                    event_date: body.event_date,
                    event_description: body.event_description,
                    event_type: body.event_type,
                    event_status: body.event_status,
                }

                where = {
                    id: event_id
                }

                await adminRepositories.updateEventData(where, updateData, t);
            })

            return res.send({
                status: 200,
                msg: responseMessages.eventUpdate,
                data: {},
                purpose: purpose
            })

        } catch (e) {
            console.log("Event Details ERROR : ", e);
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
| API name          :  deleteEvent
| Response          :  Respective response message in JSON format
| Logic             :  Event Delete
| Request URL       :  BASE_URL/admin/event-delete/<< Event ID >>
| Request method    :  DELETE
| Author            :  Jayanta Mondal
|------------------------------------------------
*/
module.exports.deleteEvent = (req, res) => {
    (async()=> {
        let purpose = "Event Delete";
        try {
            
            let eventID      = req.params.event_id;
            
            let eventDetails = await adminRepositories.findOneEvent({ id: eventID });

            if(eventDetails) {

                await sequelize.transaction(async(t)=>{
                    await adminRepositories.deleteEvent({ id: eventID }, t);
                })

                return res.status(200).send({
                    status: 200,
                    msg: responseMessages.eventDelete,
                    data: {},
                    purpose: purpose
                })
            }
            else {
                return res.status(404).send({
                    status: 404,
                    msg: responseMessages.eventNotFound,
                    data: {},
                    purpose: purpose
                })
            }
        }
        catch(err) {
            console.log("Song Listing Error : ", err);
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
| API name          :  getHomes
| Response          :  Respective response message in JSON format
| Logic             :  Fetch About Us Data
| Request URL       :  BASE_URL/admin/fetch-aboutUs
| Request method    :  GET
| Author            :  Jyoti Vankala
|------------------------------------------------ 
*/

module.exports.getAboutUs = (req, res) => {
    (async() => {
        let purpose = "Fetch About Us";
        try {

            let getAboutUsData = await adminRepositories.findAboutUs({});

            return res.send({
                status: 200,
                msg: responseMessages.fetchAboutUs,
                data: getAboutUsData,
                purpose: purpose
            })

        } catch (e) {
            console.log("Fetch About Us ERROR : ", e);
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
| API name          :  uploadAboutUsImage
| Response          :  Respective response message in JSON format
| Logic             :  Upload About Us Image
| Request URL       :  BASE_URL/admin/upload-aboutUs-image
| Request method    :  PUT
| Author            :  Jyoti Vankala
|------------------------------------------------ 
*/


module.exports.uploadAboutUsImage = (req, res) => {
    (async() => {
        let purpose = "Upload About Us Image";
        try {

            //console.log(req)

            if(req.file) {

                let compressPath = path.join(__dirname, '../../', 'uploads', 'aboutUs', 'about_us_' + Date.now() + '.jpeg');
                let filePath = `${global.constants.aboutUs_image}/`+'about_us_' + Date.now() + '.jpeg';
                
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
                    msg: responseMessages.aboutUsImageUpload,
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
            console.log("Upload About Us Image : ", err);
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
| API name          :  updateAboutUs
| Response          :  Respective response message in JSON format
| Logic             :  Update Home Data
| Request URL       :  BASE_URL/admin/fetch-aboutUs
| Request method    :  PUT
| Author            :  Jyoti Vankala
|------------------------------------------------
*/

module.exports.updateAboutUs = (req, res) => {
    (async() => {
        let purpose = "Update About Us";
        try {

            let body = req.body;
            console.log(body);
            await sequelize.transaction(async(t)=>{

                let updateData = {
                    aboutUs_title: body.aboutUs_title,
                    aboutUs_body: body.aboutUs_body,
                    aboutUs_image: body.aboutUs_image,
                }

                let where = {
                    id: 1
                }

                await adminRepositories.updateAboutUs(where, updateData, t);
            })

            return res.send({
                status: 200,
                msg: responseMessages.updateAboutUs,
                data: body,
                purpose: purpose
            })

        } catch (e) {
            console.log("Update Homes ERROR : ", e);
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
| Request URL       :  BASE_URL/admin/fetch-motivation
| Request method    :  GET
| Author            :  Jyoti Vankala
|------------------------------------------------ 
*/

module.exports.getMotivation = (req, res) => {
    (async() => {
        let purpose = "Fetch Motivation";
        try {

            let getMotivationData = await adminRepositories.findMotivation({});

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


/*
|------------------------------------------------ 
| API name          :  updateMotivation
| Response          :  Respective response message in JSON format
| Logic             :  Update Home Data
| Request URL       :  BASE_URL/admin/fetch-aboutUs
| Request method    :  PUT
| Author            :  Jyoti Vankala
|------------------------------------------------
*/

module.exports.updateMotivation = (req, res) => {
    (async() => {
        let purpose = "Update Motivation";
        try {

            let body = req.body;
            console.log(body);
            await sequelize.transaction(async(t)=>{

                let updateData = {
                    motivation_title: body.motivation_title,
                    social: body.social,
                    cultural: body.cultural,
                    educational: body.educational,
                }

                let where = {
                    id: 1
                }

                await adminRepositories.updateMotivation(where, updateData, t);
            })

            return res.send({
                status: 200,
                msg: responseMessages.updateMotiavtion,
                data: body,
                purpose: purpose
            })

        } catch (e) {
            console.log("Update Homes ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}
