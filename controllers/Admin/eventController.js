 /*!
 * EventController.js
 * Containing all the controller actions related to `ADMIN`
 * Author: Jyoti Vankala
 * Date: 14TH May, 2022`
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
const crypto = require("crypto");
const fs     = require("fs");

var DataTypes = require('sequelize/lib/data-types');
//################################ Repositories ###################################//

const eventRepositories = require('../../repositories/EventsRepositories');

const { getAudioDurationInSeconds } = require('get-audio-duration');

const SocialEventImages = require('../../models/social_event_images')(sequelize, DataTypes);

/*
|------------------------------------------------ 
| API name          :  addCountry
| Response          :  Respective response message in JSON format
| Logic             :  Upload Country 
| Request URL       :  BASE_URL/admin/add-country
| Request method    :  POST
| Author            :  Jyoti Vankala
|------------------------------------------------
*/


module.exports.uploadSocialPrimaryImage = (req, res) => {
    (async() => {
        let purpose = "Upload Social Event Image";
        try {

            if(req.file) {

                let compressPath = path.join(__dirname, '../../', 'uploads', 'social_event_img_url_' + Date.now() + '.jpeg');
              //  let filePath = `${global.constants.social_event_img_url}/`+'social_event_img_url_' + Date.now() + '.jpeg';

                let filePath = `${global.constants.social_event_img_url}/${req.file.filename}`;
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
                    msg: responseMessages.social_events_image,
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
            console.log("Upload Socila Event Primary Image : ", err);
            return res.status(500).send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}


module.exports.createSocialEvent = (req, res) => {

    (async() => {

        let purpose = "Songs Create";

        try {
            let body = req.body;
            console.log(body)
           // let songCount = await eventRepositories.countSongs({ name: body.name });

                let socialEvent;
                await sequelize.transaction(async(t) => {
                    let createSocialEvent = {
                        title: body.title,
                        socialPrimaryImage: body.socialPrimaryImage,
                        social_event_date: body.social_event_date,     
                    }

                    socialEvent = await eventRepositories.createSocialEvent(createSocialEvent, t);
                })

                return res.send({
                    status: 200,
                    msg: responseMessages.socialEventCreated,
                    data: socialEvent,
                    purpose: purpose
                })
		       } catch (e) {
		           console.log("Social Event ERROR : ", e);
		            return res.send({
		                status: 500,
		                msg: responseMessages.serverError,
		                data: {},
		                purpose: purpose
		            })
		        }

    })()
}



module.exports.updateSocialEvent = (req, res) => {
    (async() => {
        let purpose = "Update Social Event";
        try {
             
            let params   = req.params;
            let body     = req.body;
            let where    = {};
            let social_event_id = params.social_event_id;
            
            await sequelize.transaction(async(t)=>{

                let updateData = {
                        title: body.title,
                        socialPrimaryImage: body.socialPrimaryImage,
                        social_event_date : body.social_event_date ,       
                    }

                where = {
                    id: social_event_id
                }

                await eventRepositories.updateSocialEvent(where, updateData, t);
            })

            return res.send({
                status: 200,
                msg: responseMessages.socialEventUpdate,
                data: {},
                purpose: purpose
            })
            console.log(updateData)

        } catch (e) {
            console.log("Social Event Update ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}

module.exports.fetchSocialEventList = (req, res) => {
    (async() => {
        let purpose = "Fetch List";
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
                is_active: '1',
            }

            if (queryParam.search) {
                where.title = { $like: `%${queryParam.search}%` };
            }

            let socialEventList = await eventRepositories.findAndCountAllSocialEvent(where, data);

          
            return res.send({
                status: 200,
                msg: responseMessages.fetchSocialEventList,
                data: socialEventList,
                purpose: purpose
            })

        } catch (e) {
            console.log("Social Event List ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}

module.exports.uploadSocialEventImages = (req, res) => {

    (async() => {

        let purpose = "Social Event Images Upload";
        const transaction = await sequelize.transaction();

        try { 
          // Upload Additional Images
            if (req.files['file[]']) {

                 const imageCount = await SocialEventImages.count({
                        where: {
                            social_event_id: req.body.social_event_id
                        }
                    });

                 // Check How Many Old Images Have Before
               const allowedImagesCount = 3 - Number.parseInt(imageCount);

                if (req.files['file[]'].length > allowedImagesCount) {
                    await transaction.rollback();
                    return res.send({
                    status: 400,
                    msg:`Maximum Allowed Additional Images Is 3 And You Already Have ${imageCount} Images, Delete Old Images To Add More`,
                 })
                }
            
                for await (let image of req.files['file[]']) {

                    // Generate Dynamic File Name And Save The Image Into Local Storage
                    const customFileName = `image-additional-${crypto.randomBytes(18).toString("hex")}`;
                    const imageBufferData = image.buffer;
                    const imageExtension  = path.extname(image.originalname);
                    console.log(imageExtension)
                    const imageFileName   = "/social_events/" + customFileName + imageExtension;
                    // Save To Local
                    fs.writeFileSync('./uploads/' + imageFileName, imageBufferData);
                    // Update File Path Into Data Object
                    await SocialEventImages.create(
                    {
                        images: imageFileName,
                        social_event_id: req.body.social_event_id
                    }, {transaction});
                }

                // Commit To DB
                await transaction.commit();
            }

             return res.send({
                    status: 200,
                    
                    msg: responseMessages.createAlbumSong,
                    purpose: purpose
                })
            
        } catch (e) {
            console.log("Album Image ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }

    })()
}



module.exports.sociaEventDetailsFetch = (req, res) => {
    (async() => {
        let purpose = "Fetch Event Details";
        try {
            
            where = {
                id:  req.params.social_event_id,
            }

            let socialEventDetails = await eventRepositories.findOne(where);

            return res.send({
                status: 200,
                msg: responseMessages.socialEventDetails,
                data: socialEventDetails,
                purpose: purpose
            })

        } catch (e) {
            console.log("Social Details ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}

module.exports.deleteSocialEvent = (req, res) => {
    (async()=> {
        let purpose = "Social Event Delete";
        try {
            
             where = {
                id:  req.params.social_event_id,
            }

            let socialEventDetails = await eventRepositories.findOne(where);
            console.log(socialEventDetails)
            if(socialEventDetails) {

                await sequelize.transaction(async(t)=>{
                    await eventRepositories.deleteSocialEvent(where, t);
                })

                return res.status(200).send({
                    status: 200,
                    msg: responseMessages.socialEventDelete,
                    data: {},
                    purpose: purpose
                })
            }
            else {
                return res.status(404).send({
                    status: 404,
                    msg: responseMessages.socialEventNotFound,
                    data: {},
                    purpose: purpose
                })
            }
        }
        catch(err) {
            console.log("Social Event  Error : ", err);
            return res.status(500).send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}



module.exports.deleteSocialEventImage = (req, res) => {
    (async()=> {
        let purpose = "Social Event Image Delete";
        try {
            
             where = {
                id:  req.params.social_event_image_id,
            }

            let socialEventDetails = await SocialEventImages.count({
                where: {
                    id:  req.params.social_event_image_id,
                }
            });
            console.log(socialEventDetails)
            if(socialEventDetails) {

                await sequelize.transaction(async(t)=>{
                    await SocialEventImages.destroy({
                       where: {
                    id:  req.params.social_event_image_id,
                }
                 }, t);
                })

                return res.status(200).send({
                    status: 200,
                    msg: responseMessages.socialEventDelete,
                    data: {},
                    purpose: purpose
                })
            }
            else {
                return res.status(404).send({
                    status: 404,
                    msg: responseMessages.socialEventNotFound,
                    data: {},
                    purpose: purpose
                })
            }
        }
        catch(err) {
            console.log("Social Event Image Error : ", err);
            return res.status(500).send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}


