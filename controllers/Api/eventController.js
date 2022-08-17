 /*!
 * EventController.js
 * Containing all the controller actions related to `API`
 * Author: Jyoti Vankala
 * Date: 17TH May, 2022`
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
| Request URL       :  BASE_URL/api/upcoming-social-event-fetching-list
| Request method    :  POST
| Author            :  Jyoti Vankala
|------------------------------------------------
*/


module.exports.upcomingSocialEventList = (req, res) => {
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
                //is_active: '1',
                 social_event_date: {
                  $gte: moment().format('Y-MM-DD')
                }
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

module.exports.previousSocialEventList = (req, res) => {
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
                //is_active: '1',
                 social_event_date: {
                  $lte: moment().format('Y-MM-DD')
                }
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






