   /*!
 * PodcastController.js
 * Containing all the controller actions related to `USER`
 * Author: Jyoti Vankala
 * Date: 14Th May, 2022`
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


//################################ Repositories ###################################//
const podcastRepositories = require('../../repositories/PodcastRepositories');

const { getAudioDurationInSeconds } = require('get-audio-duration');


module.exports.podcastList = (req, res) => {
    (async() => {
        let purpose = "Fetch Podcast List";
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

            // where = {
            //     is_active: '1',
            // }

            if (queryParam.search) {
                where.name = { $like: `%${queryParam.search}%` };
            }

            let podacstCategoryList = await podcastRepositories.findAndCountAllPodcast(where, data);

            return res.send({
                status: 200,
                msg: responseMessages.fetchPodcastList,
                data: podacstCategoryList,
                purpose: purpose
            })
            console.log(podacstCategoryList);

        } catch (e) {
            console.log("Podcast List ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}