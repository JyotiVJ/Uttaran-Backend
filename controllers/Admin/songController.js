/*!
 * CountryController.js
 * Containing all the controller actions related to `USER`
 * Author: Jyoti Vankala
 * Date: 3rd May, 2022`
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

const userRepositories  = require('../../repositories/UsersRepositories');
const adminRepositories = require('../../repositories/AdminsRepositories');
const songRepositories = require('../../repositories/SongRepositories');

const { getAudioDurationInSeconds } = require('get-audio-duration');

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


module.exports.addSongs = (req, res) => {

    (async() => {

        let purpose = "Songs Create";

        try {
            let body = req.body;
            //console.log(body)
            let songCount = await songRepositories.countSongs({ name: body.name });

            if (songCount == 0) {
                let song;
                await sequelize.transaction(async(t) => {
                    let createSong = {
                        name: body.name,
                        cover_picture: body.cover_picture,
                        genre_id: body.genre_id,
                        length: body.length,
                        file_name: body.file_name,
                        details: body.details,
                        release_date: body.release_date,
                        is_active: body.is_active,
                        
                    }

                    song = await songRepositories.createSong(createSong, t);
                })

                
                return res.send({
                    status: 200,
                    msg: responseMessages.songCreated,
                    data: song,
                    purpose: purpose
                })
            } else {
                return res.send({
                    status: 409,
                    msg: responseMessages.duplicateSong,
                    data: {},
                    purpose: purpose
                })
                console.log(song);
            }
        } catch (e) {
            console.log("Song  ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }

    })()
}

module.exports.uploadSongFile = (req, res) => {

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
            console.log("Upload Song Url  : ", err);
            return res.status(500).send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}


module.exports.uploadSongImage = (req, res) => {
    (async() => {
        let purpose = "Upload Song Image";
        try {

         

            if(req.file) {

                let compressPath = path.join(__dirname, '../../', 'uploads', 'songs', 'song_cover_' + Date.now() + '.jpeg');
                let filePath = `${global.constants.song_cover}/`+'song_cover_' + Date.now() + '.jpeg';
                
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
                    msg: responseMessages.songImage,
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


module.exports.updateSong = (req, res) => {
    (async() => {
        let purpose = "Update Country";
        try {
             
            let params   = req.params;
            let body     = req.body;
            let where    = {};
            let song_id = params.song_id;
            
            await sequelize.transaction(async(t)=>{

                let updateData = {

                        name: body.name,
                        cover_picture: body.cover_picture,
                        length: body.length,
                        file_name: body.file_name,
                        details: body.details,
                        release_date: body.release_date,
                        is_active: body.is_active,
                }

                where = {
                    id: song_id
                }

                await songRepositories.updateSong(where, updateData, t);
            })

            return res.send({
                status: 200,
                msg: responseMessages.songUpdated,
                data: {},
                purpose: purpose
            })
            console.log(updateData)

        } catch (e) {
            console.log("Country Details ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}


module.exports.fetchSongList = (req, res) => {
    (async() => {
        let purpose = "Fetch Song List";
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
                where.name = { $like: `%${queryParam.search}%` };
            }

            let songList = await songRepositories.findAndCountAll(where, data);

            let testData = [];

            songList.forEach(element => {
               testData.push(element.name)
                console.log(testData.join(','));
                });

            return res.send({
                status: 200,
                msg: responseMessages.fetchSongList,
                data: songList,
                purpose: purpose
            })
            console.log(songList);

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


module.exports.fetchSongDetails = (req, res) => {
    (async() => {
        let purpose = "Fetch Song Details";
        try {
            
            where = {
                id:  req.params.song_id,
            }

            let songDetails = await songRepositories.findOneSong(where);

            return res.send({
                status: 200,
                msg: responseMessages.songDetails,
                data: songDetails,
                purpose: purpose
            })

        } catch (e) {
            console.log("Song Details ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}


module.exports.deleteSong = (req, res) => {
    (async()=> {
        let purpose = "Song Delete";
        try {
            
             where = {
                id:  req.params.song_id,
            }
            
            let songDetails = await songRepositories.findOneSong(where);
            console.log(songDetails)
            if(songDetails) {

                await sequelize.transaction(async(t)=>{
                    await songRepositories.deleteSong(where, t);
                })

                return res.status(200).send({
                    status: 200,
                    msg: responseMessages.songDelete,
                    data: {},
                    purpose: purpose
                })
            }
            else {
                return res.status(404).send({
                    status: 404,
                    msg: responseMessages.songNotFound,
                    data: {},
                    purpose: purpose
                })
            }
        }
        catch(err) {
            console.log("Song  Error : ", err);
            return res.status(500).send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}




