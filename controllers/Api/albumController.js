/*!
 * AlbumController.js
 * Containing all the controller actions related to `USER`
 * Author: Jyoti Vankala
 * Date: 13th May, 2022`
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
const fs     = require("fs");
const crypto = require("crypto");


const commonFunction = require('../../helpers/commonFunction');

// ################################ Globals ################################ //
const jwtOptionsAccess  = global.constants.jwtAccessTokenOptions;
const jwtOptionsRefresh = global.constants.jwtRefreshTokenOptions;


//################################ Repositories ###################################//

const userRepositories = require('../../repositories/UsersRepositories');
const albumRepositories = require('../../repositories/AlbumRepositories')

//################################ Repositories ###################################//

const { getAudioDurationInSeconds } = require('get-audio-duration');

var DataTypes = require('sequelize/lib/data-types');

//const AlbumModel = require('../models/album')(sequelize, DataTypes);
const AlbumImages = require('../../models/album_images')(sequelize, DataTypes);


module.exports.uploadAlbumSong = (req, res) => {
    (async() => {
        let purpose = "Upload Album Song";
        try {

                 console.log("FILE : ", req.file);
                    let filePath = `${global.constants.album_song_url}/${req.file.filename}`;
                    let streamPath = path.join(global.appPath, filePath);
                    let fileDuration = 0;

                    getAudioDurationInSeconds(streamPath).then((duration) => {
                        fileDuration = duration;

                        return res.status(200).send({
                            status: 200,
                            msg: responseMessages.albumUpload,
                            data: {
                                filePath: filePath,
                                fileDuration: parseInt(fileDuration)
                            },
                            purpose: purpose
                        })
                    });
        } catch (err) {
            console.log("Upload Album Song Url  : ", err);
            return res.status(500).send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}


module.exports.createAlbum = (req, res) => {

    (async() => {

        let purpose = "Album Create";

        try {

            let body = req.body;
            console.log(body)
            let albumCount = await albumRepositories.count({ album_name: body.album_name });

            if (albumCount == 0) {
                let album;
                await sequelize.transaction(async(t) => {
                    let createAlbumSong = {

                        album_name: body.album_name,
                        album_file: body.album_file,

                    }
                    album = await albumRepositories.createAlbumSong(createAlbumSong, t);
                })

                return res.send({
                    status: 200,
                    msg: responseMessages.createAlbumSong,
                    data: album,
                    purpose: purpose
                })
            } else {
                return res.send({
                    status: 409,
                    msg: responseMessages.duplicateAlbum,
                    data: {},
                    purpose: purpose
                })
                console.log(album);
            }

        } catch (e) {
            console.log("Album  ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }

    })()
}


module.exports.createAlbumPhotoes = (req, res) => {

    (async() => {

        let purpose = "Album Photo Create";
         const transaction = await sequelize.transaction();

        try {
            // let body = req.body;
            // console.log(body)
            // let albumCount = await albumRepositories.count({ album_name: body.album_name });

            // if (albumCount == 0) {
            //     let album;
            //     await sequelize.transaction(async(t) => {
            //         let createAlbumSong = {

            //             album_name: body.album_name,
            //             album_file: body.album_file,

            //         }
            //         album = await albumRepositories.createAlbumSong(createAlbumSong, t);


            //     })
            //     console.log(album);

            // }

           // Upload Additional Images
            if (req.files['file[]']) {

                 const imageCount = await AlbumImages.count({
                        where: {
                            album_id: req.body.album_id
                        }
                    });



                 // Check How Many Old Images Have Before
               const allowedImagesCount = 6 - Number.parseInt(imageCount);

                if (req.files['file[]'].length > allowedImagesCount) {
                    await transaction.rollback();
                    return res.send({
                    status: 400,
                    msg:`Maximum Allowed Additional Images Is 6 And You Already Have ${imageCount} Images, Delete Old Images To Add More`,
                })
               }
            
                for await (let image of req.files['file[]']) {
                    // Generate Dynamic File Name And Save The Image Into Local Storage
                    const customFileName = `image-additional-${crypto.randomBytes(18).toString("hex")}`;
                    const imageBufferData = image.buffer;
                    const imageExtension  = path.extname(image.originalname);
                    console.log(imageExtension)
                    const imageFileName   = "/albums/" + customFileName + imageExtension;
                    // Save To Local
                    fs.writeFileSync('./uploads/' + imageFileName, imageBufferData);
                    // Update File Path Into Data Object
                    await AlbumImages.create({
                        album_images: imageFileName,
                        album_id: req.body.album_id
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
            console.log("Album  ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }

    })()
}


module.exports.albumFetchList = (req, res) => {
    (async() => {
        let purpose = "Fetch Album List";
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

           // console.log(where)

            if (queryParam.search) {
                where.album_name = { $like: `%${queryParam.search}%` };
            }

            let albumList = await albumRepositories.findAndCountAll(where, data);
            console.log(albumList)
            
            return res.send({
                status: 200,
                msg: responseMessages.fetchAlbumSuccess,
                data: albumList,
                purpose: purpose
            })
            console.log(albumList)

        } catch (e) {
            console.log("Album List ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}


module.exports.albumSongDetailsFetch = (req, res) => {
    (async() => {
        let purpose = "Fetch Album Song Details";
        try {
            
            where = {
                id:  req.params.album_id,
            }

            let albumSongDetails = await albumRepositories.findOneAlbumSong(where);

            return res.send({
                status: 200,
                msg: responseMessages.fetchAlbumDetails,
                data: albumSongDetails,
                purpose: purpose
            })
            console.log(albumSongDetails)
 
        } catch (e) {
            console.log("Album Song Details ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}

module.exports.albumSongDelete = (req, res) => {
    (async()=> {
        let purpose = "Album Song Delete";
        try {
            
             where = {
                id:  req.params.album_id,
            }

            let albumDetails = await albumRepositories.findOneAlbumSong(where);
            console.log(albumDetails)
            if(albumDetails) {

                await sequelize.transaction(async(t)=>{
                    await albumRepositories.deleteAlbumSong(where, t);
                })

                return res.status(200).send({
                    status: 200,
                    msg: responseMessages.albumDelete,
                    data: {},
                    purpose: purpose
                })
            }
            else {
                return res.status(404).send({
                    status: 404,
                    msg: responseMessages.albumNotFound,
                    data: {},
                    purpose: purpose
                })
            }
        }
        catch(err) {
            console.log("Album  Error : ", err);
            return res.status(500).send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}



