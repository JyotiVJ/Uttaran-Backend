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

const educationalRepositories = require('../../repositories/educationalRepositories');

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

module.exports.createEducationalEvent = (req, res) => {

    (async() => {

        let purpose = "Educational Event Create";

        try {
            let body = req.body;
            console.log(body)
           // let songCount = await eventRepositories.countSongs({ name: body.name });

                let educationalEvent;
                await sequelize.transaction(async(t) => {
                    let createSocialEvent = {
                        title: body.title,
                    }

                    educationalEvent = await educationalRepositories.createSocialEvent(createSocialEvent, t);
                })

                return res.send({
                    status: 200,
                    msg: 'Educational Event Created Successfully',
                    data: educationalEvent,
                    purpose: purpose
                })
		       } catch (e) {
		           console.log("Educational Social Event ERROR : ", e);
		            return res.send({
		                status: 500,
		                msg: responseMessages.serverError,
		                data: {},
		                purpose: purpose
		            })
		        }

    })()
}


module.exports.updateEducationalEvent = (req, res) => {
    (async() => {
        let purpose = "Update Educational Event";
        try {
             
            let params   = req.params;
            let body     = req.body;
            let where    = {};
            let educational_event_id = params.educational_event_id;
            
            await sequelize.transaction(async(t)=>{

                let updateData = {
                        title: body.title,
                 
                    }

                where = {
                    id: educational_event_id
                }

                await educationalRepositories.updateEducationalEvent(where, updateData, t);
            })

            return res.send({
                status: 200,
                msg: 'Educational Event Updated Successfully',
                data: {},
                purpose: purpose
            })
            console.log(updateData)

        } catch (e) {
            console.log("Educational Event Update ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}















