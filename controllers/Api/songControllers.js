/*!
 * UsersController.js
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


const commonFunction = require('../../helpers/commonFunction');

// ################################ Globals ################################ //
const jwtOptionsAccess  = global.constants.jwtAccessTokenOptions;
const jwtOptionsRefresh = global.constants.jwtRefreshTokenOptions;


//################################ Repositories ###################################//

const userRepositories = require('../../repositories/UsersRepositories');
const songRepositories = require('../../repositories/SongRepositories');
//################################ Repositories ###################################//

const { getAudioDurationInSeconds } = require('get-audio-duration');

module.exports.upcomingSongList = (req, res) => {
    (async() => {
        let purpose = "Fetch Song List";
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
                is_active: '1',
                release_date: {
                  $gte: moment().format('Y-MM-DD')
                }
            }

           // console.log(where)

            if (queryParam.search) {
                where.name = { $like: `%${queryParam.search}%` };
            }

            let songList = await songRepositories.findAndCountAll(where, data);
            let songListNormal = await songRepositories.findAndCountAll(where, data);

            // const dATA =  songList.rows.forEach((item , index) => {
            //  item.name
            //   const found = songList.rows.find(element =>  element.name == "Zaarorat");

            //     console.log(found)             
            // });

            
               const found = songList.rows.find(element =>  element.name == "Zaarorat");
              console.log(found)

            return res.send({
                status: 200,
                msg: responseMessages.fetchSongSuccess,
                data: songList,
                purpose: purpose
            })
            //console.log(songList)

        } catch (e) {
            console.log("Song List ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}

module.exports.previousSongList = (req, res) => {
    (async() => {
        let purpose = "Fetch Released Song List";
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
                is_active: '1',
                release_date: {
                  $lte: moment().format('Y-MM-DD')
                }
            }

           // console.log(where)

            if (queryParam.search) {
                where.name = { $like: `%${queryParam.search}%` };
            }

            let songList = await songRepositories.findAndCountAll(where, data);
            let songListNormal = await songRepositories.findAndCountAll(where, data);

             songList.rows.forEach((item , index) => {
             item.release_date = moment(item.release_date).format('DD-MM-Y H:mm:ss'),
             item.createdAt = moment(item.createdAt).format('DD-MM-Y H:mm:ss')
             console.log(item)
             
            });

            return res.send({
                status: 200,
                msg: responseMessages.fetchSongSuccess,
                data: songList,
                purpose: purpose
            })
            console.log(songList)

        } catch (e) {
            console.log("Song List ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}

module.exports.uploadSong = (req, res) => {
    (async() => {
        let purpose = "Upload Song";
        try {
            console.log("FILE : ", req.file);
            let filePath = `${global.constants.songs_url}/${req.file.filename}`;
            let streamPath = path.join(global.appPath, filePath);
            let fileDuration = 0;

            getAudioDurationInSeconds(streamPath).then((duration) => {
                fileDuration = duration;

                return res.status(200).send({
                    status: 200,
                    msg: responseMessages.songUpload,
                    data: {
                        filePath: filePath,
                        fileDuration: parseInt(fileDuration)
                    },
                    purpose: purpose
                })
            });
        } catch (err) {
            console.log("Upload Song : ", err);
            return res.status(500).send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}
