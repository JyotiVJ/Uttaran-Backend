  /*!
 * PodcastController.js
 * Containing all the controller actions related to `ADMIN`
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
const podcastRepositories = require('../../repositories/PodcastRepositories');

const { getAudioDurationInSeconds } = require('get-audio-duration');



module.exports.addPodcastCategory = (req, res) => {

    (async() => {

        let purpose = "Podcast Category Create";

        try {
            let body = req.body;
            console.log(body)
            let podcastCount = await podcastRepositories.countPodcast({ name: body.name });

            if (podcastCount == 0) {
                let podcast;
                await sequelize.transaction(async(t) => {
                    let createPodcastCategory = {
                        name: body.name,
                        cover_image: body.cover_image,
                        length: body.length,
                        file_name: body.file_name,
                        details: body.details,
                        
                    }

                    podcast = await podcastRepositories.createPodcastCategory(createPodcastCategory, t);
                })

                
                return res.send({
                    status: 200,
                    msg: responseMessages.createPodcastCategory,
                    data: podcast,
                    purpose: purpose
                })
            } else {
                return res.send({
                    status: 409,
                    msg: responseMessages.duplicatePodcast,
                    data: {},
                    purpose: purpose
                })
                console.log(podcast);
            }
        } catch (e) {
            console.log("Podcast  ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }

    })()
}


module.exports.updatePodcastCategory = (req, res) => {
    (async() => {
        let purpose = "Update Country";
        try {
             
            let params   = req.params;
            let body     = req.body;
            let where    = {};
            let podcast_category_id = params.podcast_category_id;
            
            await sequelize.transaction(async(t)=>{

                let updateData = {
                        name: body.name,
                        cover_picture: body.cover_picture,
                        length: body.length,
                        file_name: body.file_name,
                        details: body.details,
                }

                where = {
                    id: podcast_category_id
                }

                await podcastRepositories.updatePodcastCategory(where, updateData, t);
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

module.exports.fetchPodcastCategoryList = (req, res) => {
    (async() => {
        let purpose = "Fetch Podcast Category List";
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

            let podacstCategoryList = await podcastRepositories.findAndCountAll(where, data);

            return res.send({
                status: 200,
                msg: responseMessages.fetchPodcastCategoryList,
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


module.exports.fetchPodcastCategoryDetails = (req, res) => {
    (async() => {
        let purpose = "Fetch Podcast Category Details";
        try {
            
            where = {
                id:  req.params.podcast_category_id,
            }

            let podacastDetails = await podcastRepositories.findOnePodcastCategory(where);

            return res.send({
                status: 200,
                msg: responseMessages.fetchPodcastCategoryDetails,
                data: podacastDetails,
                purpose: purpose
            })
            console.log(podacastDetails)
 
        } catch (e) {
            console.log("Podcast Category Details ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}


module.exports.uploadPodcast = (req, res) => {
    (async() => {
        let purpose = "Upload Podcast";
        try {

                 console.log("FILE : ", req.file);
                    let filePath = `${global.constants.podcasts_url}/${req.file.filename}`;
                    let streamPath = path.join(global.appPath, filePath);
                    let fileDuration = 0;

                    getAudioDurationInSeconds(streamPath).then((duration) => {
                        fileDuration = duration;

                        return res.status(200).send({
                            status: 200,
                            msg: responseMessages.podcastUpload,
                            data: {
                                filePath: filePath,
                                fileDuration: parseInt(fileDuration)
                            },
                            purpose: purpose
                        })
                    });
        } catch (err) {
            console.log("Upload Podcast Url  : ", err);
            return res.status(500).send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}


module.exports.uploadPodcastCoverImage = (req, res) => {
    (async() => {
        let purpose = "Upload Podcast Cover Image";
        try {

            //console.log(req)

            if(req.file) {
                 let filePath = `${global.constants.podcasts_cover_url}/${req.file.filename}`;

                let compressPath = path.join(__dirname, '../../', 'uploads', 'podcast_image', 'podcasts_cover_url_' + Date.now() + '.jpeg');
                //let filePath = `${global.constants.podcasts_cover_url}/`+'podcasts_cover_url_' + Date.now() + '.jpeg';
                
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
                    msg: responseMessages.podcastImageCover,
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


module.exports.deletePodcastCategory = (req, res) => {
    (async()=> {
        let purpose = "Podcast Category Delete";
        try {
            
            let podcastCategoryId      = req.params.podcast_category_id;
            
            let podcastCategoryDetails = await podcastRepositories.findOnePodcastCategory({ id: podcastCategoryId });

            if(podcastCategoryDetails) {

                await sequelize.transaction(async(t)=>{
                    await podcastRepositories.deletePodcastCategory({ id: podcastCategoryId }, t);
                })

                return res.status(200).send({
                    status: 200,
                    msg: responseMessages.podcastCategoryDelete,
                    data: {},
                    purpose: purpose
                })
            }
            else {
                return res.status(404).send({
                    status: 404,
                    msg: responseMessages.podcastCategoryNotFound,
                    data: {},
                    purpose: purpose
                })
            }
        }
        catch(err) {
            console.log("Podcast Category  Error : ", err);
            return res.status(500).send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}


module.exports.addPodcast = (req, res) => {

    (async() => {

        let purpose = "Podcast Create";

        try {
            let body = req.body;
            console.log(body)
            let podcastCount = await podcastRepositories.countPodcastFile({ name: body.name });

            if (podcastCount == 0) {
                let podcast;
                await sequelize.transaction(async(t) => {
                    let createPodcastCategory = {
                        name: body.name,
                        podcast_category_id: body.podcast_category_id,
                        cover_picture: body.cover_picture,
                        length: body.length,
                        file_name: body.file_name,
                        details: body.details,  
                    }

                    podcast = await podcastRepositories.createPodcast(createPodcastCategory, t);
                })

                
                return res.send({
                    status: 200,
                    msg: responseMessages.createPodcast,
                    data: podcast,
                    purpose: purpose
                })
            } else {
                return res.send({
                    status: 409,
                    msg: responseMessages.duplicatePodcast,
                    data: {},
                    purpose: purpose
                })
                console.log(podcast);
            }
        } catch (e) {
            console.log("Podcast  ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }

    })()
}



module.exports.uploadPodCoverImage = (req, res) => {
    (async() => {
        let purpose = "Upload Podcast Image";
        try {

            //console.log(req)

            if(req.file) {
                // let filePath = `${global.constants.podcasts_cover_url}/${req.file.filename}`;

                let compressPath = path.join(__dirname, '../../', 'uploads', 'podcast_image', 'podcasts_cover_url_' + Date.now() + '.jpeg');
                let filePath = `${global.constants.podcasts_cover_url}/`+'podcasts_cover_url_' + Date.now() + '.jpeg';
                
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
                    msg: responseMessages.podcastImageCover,
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
            console.log("Upload Podcast Cover Image : ", err);
            return res.status(500).send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}


module.exports.updatePodcast = (req, res) => {
    (async() => {
        let purpose = "Update Podcast";
        try {
             
            let params   = req.params;
            let body     = req.body;
            let where    = {};
            let podcast_id = params.podcast_id;
            
            await sequelize.transaction(async(t)=>{

                let updateData = {

                        name: body.name,
                        podcast_category_id: body.podcast_category_id,
                        cover_picture: body.cover_picture,
                        length: body.length,
                        file_name: body.file_name,
                        details: body.details,  
                   }

                where = {
                    id: podcast_id
                  }

                await podcastRepositories.updatePodcast(where, updateData, t);
            })

            return res.send({
                status: 200,
                msg: responseMessages.podcastUpdated,
                data: {},
                purpose: purpose
            })
            console.log(updateData)

        } catch (e) {
            console.log("Podcast Details Update ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}


module.exports.fetchPodcastList = (req, res) => {
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


            if (queryParam.search) {
                where.name = { $like: `%${queryParam.search}%` };
            }

            let podacastList = await podcastRepositories.findAndCountAllPodcast(where,data);

            return res.send({
                status: 200,
                msg: responseMessages.fetchPodcastList,
                data: podacastList,
                purpose: purpose
            })
            console.log(podacastList);

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


module.exports.fetchPodcastDetails = (req, res) => {
    (async() => {
        let purpose = "Fetch Podcast Details";
        try {
            
            where = {
                id:  req.params.podcast_id,
            }

            let podacastDetails = await podcastRepositories.findOnePodcast(where);

            return res.send({
                status: 200,
                msg: responseMessages.fetchPodcastDetails,
                data: podacastDetails,
                purpose: purpose
            })
            console.log(podacastDetails)
 
        } catch (e) {
            console.log("Podcast Category Details ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}
