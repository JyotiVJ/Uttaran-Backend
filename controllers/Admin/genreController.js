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

const songRepositories = require('../../repositories/SongRepositories');

module.exports.addGenre = (req, res) => {

    (async() => {

        let purpose = "Genre Create";

        try {
            let body = req.body;
            //console.log(body)
            let genreCount = await songRepositories.countGenre({ name: body.name });

            if (genreCount == 0) {
                let genre;
                await sequelize.transaction(async(t) => {
                    let genreCount = {
                        name: body.name,
                        
                    }

                    genre = await songRepositories.createGenre(genreCount, t);
                })

                
                return res.send({
                    status: 200,
                    msg: responseMessages.genreCreated,
                    data: genre,
                    purpose: purpose
                })
            } else {
                return res.send({
                    status: 409,
                    msg: responseMessages.duplicateGenre,
                    data: {},
                    purpose: purpose
                })
                console.log(genre);
            }
        } catch (e) {
            console.log("Genre  ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }

    })()
}

module.exports.updateGenre = (req, res) => {
    (async() => {
        let purpose = "Update Genre";
        try {
             
            let params   = req.params;
            let body     = req.body;
            let where    = {};
            let genre_id = params.genre_id;
            
            await sequelize.transaction(async(t)=>{

                let updateData = {
                        name: body.name,   
                }

                where = {
                    id: genre_id
                }

                await songRepositories.updateGenre(where, updateData, t);
            })

            return res.send({
                status: 200,
                msg: responseMessages.genreUpdated,
                data: {},
                purpose: purpose
            })
            console.log(updateData)

        } catch (e) {
            console.log("Genre Details ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}

module.exports.fetchGenreList = (req, res) => {
    (async() => {
        let purpose = "Fetch Genre List";
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


           let genreList = await songRepositories.findAndCountAllGenre(where, data);

            genreList.rows.forEach((element) => {
               element.name 	
               element.createdAt = moment(element.createdAt).format('DD-MM-Y H:mm:ss')
               console.log(element)
             
            });//Looping Array of Objects With Foreach
           // var result = Array(genreList);
            return res.send({
                status: 200,
                msg: responseMessages.fetchGenreList,
                data: genreList,
                purpose: purpose
            })

        } catch (e) {
            console.log("Genre List ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}

module.exports.fetchGenreDetails = (req, res) => {
    (async() => {
        let purpose = "Fetch Genre Details";
        try {
            
            where = {
                id:  req.params.genre_id,
            }

            let genreDetails = await songRepositories.findOneGenre(where);

            return res.send({
                status: 200,
                msg: responseMessages.fetchGenreDetails,
                data: genreDetails,
                purpose: purpose
            })
            console.log(genreDetails)
 
        } catch (e) {
            console.log("Genre Details ERROR : ", e);
            return res.send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}

