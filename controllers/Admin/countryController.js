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
// ################################ Globals ################################ //
const jwtOptionsAccess  = global.constants.jwtAccessTokenOptions;
const jwtOptionsRefresh = global.constants.jwtRefreshTokenOptions;


//################################ Repositories ###################################//

const userRepositories  = require('../../repositories/UsersRepositories');
const adminRepositories = require('../../repositories/AdminsRepositories');

//################################ Repositories ###################################//

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

module.exports.addCountry = (req, res) => {

    (async() => {

        let purpose = "Country Add";

        try {
            let body = req.body;
            //console.log(body)
            let countryCount = await adminRepositories.countCountry({ countryName: body.countryName });

            if (countryCount == 0) {
                let country;
                await sequelize.transaction(async(t) => {
                    let createCountry = {
                        countryName: body.countryName,
                        countryCode: body.countryCode,
                        countrySymbol: body.countrySymbol,
                        countryFlag: body.countryFlag,
                        
                    }

                    country = await adminRepositories.createCountry(createCountry, t);
                })

                
                return res.send({
                    status: 200,
                    msg: responseMessages.addSuccessFully,
                    data: country,
                    purpose: purpose
                })
            } else {
                return res.send({
                    status: 409,
                    msg: responseMessages.duplicateCountry,
                    data: {},
                    purpose: purpose
                })
            }
        } catch (e) {
            console.log("Country  ERROR : ", e);
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
| API name          :  uploadCountryFlag
| Response          :  Respective response message in JSON format
| Logic             :  Upload Country Flag
| Request URL       :  BASE_URL/admin/upload-country-flag
| Request method    :  POST
| Author            :  Jyoti Vankala
|------------------------------------------------
*/

module.exports.uploadCountryFlag = (req, res) => {
    (async() => {
        let purpose = "Upload Country Flag";
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
| API name          :  fetchCountryList
| Response          :  Respective response message in JSON format
| Logic             :  Fetch Event List Data
| Request URL       :  BASE_URL/admin/fetch-country-list
| Request method    :  GET
| Author            :  Jyoti Vankala
|------------------------------------------------
*/

module.exports.fetchCountryList = (req, res) => {
    (async() => {
        let purpose = "Fetch Country List";
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
                countryStatus: '1',
            }

            if (queryParam.search) {
                where.countryName = { $like: `%${queryParam.search}%` };
            }

            let countryList = await adminRepositories.findAndCountAllCountry(where, data);

            return res.send({
                status: 200,
                msg: responseMessages.fetchCountrySuccess,
                data: countryList,
                purpose: purpose
            })

        } catch (e) {
            console.log("Country List ERROR : ", e);
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
| API name          :  updateCountry
| Response          :  Respective response message in JSON format
| Logic             :  Update Country Data
| Request URL       :  BASE_URL/admin/update-country/:country_id
| Request method    :  GET
| Author            :  Jyoti Vankala
|------------------------------------------------
*/

module.exports.updateCountry = (req, res) => {
    (async() => {
        let purpose = "Update Country";
        try {
             
            let params   = req.params;
            let body     = req.body;
            let where    = {};
            let country_id = params.country_id;
            
            await sequelize.transaction(async(t)=>{

                let updateData = {
                   countryName: body.countryName,
                        countryCode: body.countryCode,
                        countrySymbol: body.countrySymbol,
                        countryFlag: body.countryFlag,
                }

                where = {
                    id: country_id
                }

                await adminRepositories.updateCountry(where, updateData, t);
            })

            return res.send({
                status: 200,
                msg: responseMessages.countryUpdated,
                data: {},
                purpose: purpose
            })

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


/*
|------------------------------------------------ 
| API name          :  updateCountry
| Response          :  Respective response message in JSON format
| Logic             :  Update Country Data
| Request URL       :  BASE_URL/admin/update-country/:country_id
| Request method    :  GET
| Author            :  Jyoti Vankala
|------------------------------------------------
*/

module.exports.fetchCountryDetails = (req, res) => {
    (async() => {
        let purpose = "Fetch Country Details";
        try {
            
            where = {
                id:  req.params.country_id,
            }

            let countryDetails = await adminRepositories.findOneCountry(where);

            return res.send({
                status: 200,
                msg: responseMessages.fetchCountryDetails,
                data: countryDetails,
                purpose: purpose
            })

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

/*
|------------------------------------------------ 
| API name          :  updateCountryStatus
| Response          :  Respective response message in JSON format
| Logic             :  Update Country Data
| Request URL       :  BASE_URL/admin/update-country-status/:country_id
| Request method    :  GET
| Author            :  Jyoti Vankala
|------------------------------------------------
*/

module.exports.updateCountryStatus = (req, res) => {
    (async() => {
        let purpose = "Update Country Status";
        try {
             
            let params   = req.params;
            let body     = req.query;
            let where    = {};
            let country_id = params.country_id;
            
            await sequelize.transaction(async(t)=>{

                let updateData = {
                   countryStatus: body.countryStatus,
                }

                where = {
                    id: country_id
                }

                await adminRepositories.updateCountryStatus(where, updateData, t);
            })

            return res.send({
                status: 200,
                msg: responseMessages.countryUpdated,
                data: {},
                purpose: purpose
            })

        } catch (e) {
            console.log("Country Status ERROR : ", e);
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
| API name          :  deleteCountry
| Response          :  Respective response message in JSON format
| Logic             :  Event Delete
| Request URL       :  BASE_URL/admin/country-delete/<< Country ID >>
| Request method    :  DELETE
| Author            :  Jyoti Vankala
|------------------------------------------------
*/
module.exports.deleteCountry = (req, res) => {
    (async()=> {
        let purpose = "Country Delete";
        try {
            
            let countryId      = req.params.country_id;
            
            let countryDetails = await adminRepositories.findOneCountry({ id: countryId });

            if(countryDetails) {

                await sequelize.transaction(async(t)=>{
                    await adminRepositories.deleteCountry({ id: countryId }, t);
                })

                return res.status(200).send({
                    status: 200,
                    msg: responseMessages.countryDelete,
                    data: {},
                    purpose: purpose
                })
            }
            else {
                return res.status(404).send({
                    status: 404,
                    msg: responseMessages.countryNotFound,
                    data: {},
                    purpose: purpose
                })
            }
        }
        catch(err) {
            console.log("Country  Error : ", err);
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
| API name          :  addState
| Response          :  Respective response message in JSON format
| Logic             :  Upload State 
| Request URL       :  BASE_URL/admin/add-state
| Request method    :  POST
| Author            :  Jyoti Vankala
|------------------------------------------------
*/

module.exports.addState = (req, res) => {

    (async() => {

        let purpose = "State Create";

        try {
            let body = req.body;
           
            let countryFind = await adminRepositories.countCountry({ id: body.country_id });

            if (countryFind != 0) {
                let state;
                await sequelize.transaction(async(t) => {
                    let createStates = {
                        country_id : body.country_id,
                        state_name : body.state_name, 
                    }

                    state = await adminRepositories.createState(createStates, t);
                })

                
                return res.send({
                    status: 200,
                    msg: responseMessages.stateSaved,
                    data: state,
                    purpose: purpose
                })
            } else {
                return res.send({
                    status: 409,
                    msg: responseMessages.duplicateState,
                    data: {},
                    purpose: purpose
                })
            }
        } catch (e) {
            console.log("States Save  ERROR : ", e);
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
| API name          :  fetchStateList
| Response          :  Respective response message in JSON format
| Logic             :  Fetch Event List Data
| Request URL       :  BASE_URL/admin/fetch-state-list
| Request method    :  GET
| Author            :  Jyoti Vankala
|------------------------------------------------
*/

module.exports.fetchStatesList = (req, res) => {
    (async() => {
        let purpose = "Fetch State List";
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
            //     state_status: '1',
            // }

            if (queryParam.search) {
                where.state_name = { $like: `%${queryParam.search}%` };
            }

            let stateList = await adminRepositories.findAndCountAllStates(where, data);

            return res.send({
                status: 200,
                msg: responseMessages.fetchStateSuccess,
                data: stateList,
                purpose: purpose
            })

        } catch (e) {
            console.log("State List ERROR : ", e);
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
| API name          :  Fetch States Under Particular Country
| Response          :  Respective response message in JSON format
| Logic             :  Fetch Event List Data
| Request URL       :  BASE_URL/admin/fetch-state-list-under-country/:country_id
| Request method    :  GET
| Author            :  Jyoti Vankala
|------------------------------------------------
*/

module.exports.fetchStatesUnderCountry = (req, res) => {
    (async() => {
        let purpose = "Fetch State List Under A Particular Country";
        try {
             
            let queryParam = req.params;
            let where      = {};
            let data       = {};
            
            
            where = {
                 country_id:  req.params.country_id,
            }


            let stateList = await adminRepositories.findAndCountAllStatesForCountry(where, data);

            return res.send({
                status: 200,
                msg: responseMessages.fetchStateSuccess,
                data: stateList,
                purpose: purpose
            })

        } catch (e) {
            console.log("State List ERROR : ", e);
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
| API name          :  updateCountry
| Response          :  Respective response message in JSON format
| Logic             :  Update Country Data
| Request URL       :  BASE_URL/admin/update-country/:country_id
| Request method    :  GET
| Author            :  Jyoti Vankala
|------------------------------------------------
*/

module.exports.fetchStateDetails = (req, res) => {
    (async() => {
        let purpose = "Fetch State Details";
        try {
            
            where = {
                id:  req.params.state_id,
            }

            let stateDetails = await adminRepositories.findOneState(where);

            return res.send({
                status: 200,
                msg: responseMessages.fetchStateDetails,
                data: stateDetails,
                purpose: purpose
            })

        } catch (e) {
            console.log("State Details ERROR : ", e);
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
| API name          :  updateState
| Response          :  Respective response message in JSON format
| Logic             :  Update Country Data
| Request URL       :  BASE_URL/admin/update-state/:state_id
| Request method    :  GET
| Author            :  Jyoti Vankala
|------------------------------------------------
*/

module.exports.updateState = (req, res) => {
    (async() => {
        let purpose = "Update State";
        try {
             
            let params   = req.params;
            let body     = req.body;
            let where    = {};
            let state_id = params.state_id;
            
            await sequelize.transaction(async(t)=>{

                let updateData = {
                        country_id : body.country_id,
                        state_name : body.state_name, 
                    }

                where = {
                    id: state_id
                }

                await adminRepositories.updateState(where, updateData, t);
            })

            return res.send({
                status: 200,
                msg: responseMessages.stateUpdated,
                data: {},
                purpose: purpose
            })

        } catch (e) {
            console.log("State Updated ERROR : ", e);
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
| API name          :  updateState
| Response          :  Respective response message in JSON format
| Logic             :  Update Country Data
| Request URL       :  BASE_URL/admin/update-state/:state_id
| Request method    :  GET
| Author            :  Jyoti Vankala
|------------------------------------------------
*/
module.exports.updateStateStatus = (req, res) => {
    (async() => {
        let purpose = "Update State Status";
        try {
             
            let params   = req.params;
            let body     = req.body;
            let where    = {};
            let state_id = params.state_id;
            
            await sequelize.transaction(async(t)=>{

                let updateData = {
                        state_status: body.state_status,
                    }

                where = {
                    id: state_id
                }

                await adminRepositories.updateState(where, updateData, t);
            })

            return res.send({
                status: 200,
                msg: responseMessages.stateUpdated,
                data: {},
                purpose: purpose
            })

        } catch (e) {
            console.log("State Updated ERROR : ", e);
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
| API name          :  deleteState
| Response          :  Respective response message in JSON format
| Logic             :  State Delete
| Request URL       :  BASE_URL/admin/country-delete/<< State ID >>
| Request method    :  DELETE
| Author            :  Jyoti Vankala
|------------------------------------------------
*/
module.exports.deleteState = (req, res) => {
    (async()=> {
        let purpose = "State Delete";
        try {
            
            let stateId      = req.params.state_id;
            
            let stateDetails = await adminRepositories.findOneCountry({ id: stateId });

            if(stateDetails) {

                await sequelize.transaction(async(t)=>{
                    await adminRepositories.deleteState({ id: stateId }, t);
                })

                return res.status(200).send({
                    status: 200,
                    msg: responseMessages.stateDelete,
                    data: {},
                    purpose: purpose
                })
            }
            else {
                return res.status(404).send({
                    status: 404,
                    msg: responseMessages.stateNotFound,
                    data: {},
                    purpose: purpose
                })
            }
        }
        catch(err) {
            console.log("Country  Error : ", err);
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
| API name          :  addCities
| Response          :  Respective response message in JSON format
| Logic             :  Upload State 
| Request URL       :  BASE_URL/admin/add-city
| Request method    :  POST
| Author            :  Jyoti Vankala
|------------------------------------------------
*/

module.exports.addCities = (req, res) => {

    (async() => {

        let purpose = "City Create";

        try {
            let body = req.body;
           
            let countryFind = await adminRepositories.countCountry({ id: body.country_id });
            let stateFind   = await adminRepositories.countState({ id: body.state_id });

            if (countryFind != 0 && stateFind != 0) {
                let city;
                await sequelize.transaction(async(t) => {
                    let createCities = {
                        country_id : body.country_id,
                        state_id :   body.state_id,
                        city_name : body.city_name, 
                    }

                    city = await adminRepositories.createCities(createCities, t);
                })

                
                return res.send({
                    status: 200,
                    msg: responseMessages.citySaved,
                    data: city,
                    purpose: purpose
                })
            } else {
                return res.send({
                    status: 409,
                    msg: responseMessages.duplicateCity,
                    data: {},
                    purpose: purpose
                })
            }
        } catch (e) {
            console.log("Cities Save  ERROR : ", e);
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
| API name          :  Fetch Cities List
| Response          :  Respective response message in JSON format
| Logic             :  Fetch Event List Data
| Request URL       :  BASE_URL/admin/fetch-cities-list
| Request method    :  GET
| Author            :  Jyoti Vankala
|------------------------------------------------
*/

module.exports.fetchCitiesList = (req, res) => {
    (async() => {
        let purpose = "Fetch Cities List";
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
                city_status: '1',
            }

            if (queryParam.search) {
                where.city_name = { $like: `%${queryParam.search}%` };
            }

            let cityList = await adminRepositories.findAndCountAllCities(where, data);

            return res.send({
                status: 200,
                msg: responseMessages.fetchCityList,
                data: cityList,
                purpose: purpose
            })

        } catch (e) {
            console.log("City List ERROR : ", e);
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
| API name          :  Fetch City Details
| Response          :  Respective response message in JSON format
| Logic             :  Fetch City Details
| Request URL       :  BASE_URL/admin/fetch-cities-details/:city_id
| Request method    :  GET
| Author            :  Jyoti Vankala
|------------------------------------------------
*/

module.exports.fetchCityDetails = (req, res) => {
    (async() => {
        let purpose = "Fetch City Details";
        try {
            
            where = {
                id:  req.params.city_id,
            }

            let cityDetails = await adminRepositories.findOneCity(where);

            return res.send({
                status: 200,
                msg: responseMessages.fetchCityDetails,
                data: cityDetails,
                purpose: purpose
            })

        } catch (e) {
            console.log("City Details ERROR : ", e);
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
| API name          :  Update Cities
| Response          :  Respective response message in JSON format
| Logic             :  Update City Data
| Request URL       :  BASE_URL/admin/update-city/:state_id
| Request method    :  PUT
| Author            :  Jyoti Vankala
|------------------------------------------------
*/

module.exports.updateCities = (req, res) => {
    (async() => {
        let purpose = "Update City";
        try {
             
            let params   = req.params;
            let body     = req.body;
            let where    = {};
            let city_id = params.city_id;
            
            await sequelize.transaction(async(t)=>{

                let updateData = {
                        state_id   : body.state_id,
                        country_id : body.country_id,
                        city_name  : body.city_name, 
                    }

                where = {
                    id: city_id
                }

                await adminRepositories.updateCity(where, updateData, t);
            })

            return res.send({
                status: 200,
                msg: 'City Updated Successfully',
                data: {},
                purpose: purpose
            })

        } catch (e) {
            console.log("City Updated ERROR : ", e);
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
| API name          :  Update City
| Response          :  Respective response message in JSON format
| Logic             :  Update City Data
| Request URL       :  BASE_URL/admin/update-city/:city_id
| Request method    :  PATCH
| Author            :  Jyoti Vankala
|------------------------------------------------
*/
module.exports.updateCitiesStatus = (req, res) => {
    (async() => {
        let purpose = "Update City Status";
        try {
             
            let params   = req.params;
            let body     = req.query;
            let where    = {};
            let city_id = params.city_id;
            
            await sequelize.transaction(async(t)=>{

                let updateData = {
                        city_status: body.city_status,
                    }

                where = {
                    id: city_id,

                }

                await adminRepositories.updateCity(where, updateData, t);
            })

            return res.send({
                status: 200,
                msg: 'City Status Changed Successfully',
                data: {},
                purpose: purpose
            })

        } catch (e) {
            console.log("City Updated ERROR : ", e);
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
| API name          :  Delete City
| Response          :  Respective response message in JSON format
| Logic             :  City Delete
| Request URL       :  BASE_URL/admin/country-delete/<< City ID >>
| Request method    :  DELETE
| Author            :  Jyoti Vankala
|------------------------------------------------
*/
module.exports.deleteCity = (req, res) => {
    (async()=> {
        let purpose = "City Delete";
        try {
            
            let cityId      = req.params.city_id;
            
            let cityDetails = await adminRepositories.findOneCountry({ id: cityId });

            if(cityDetails) {

                await sequelize.transaction(async(t)=>{
                    await adminRepositories.deleteCity({ id: cityId }, t);
                })

                return res.status(200).send({
                    status: 200,
                    msg: responseMessages.cityDelete,
                    data: {},
                    purpose: purpose
                })
            }
            else {
                return res.status(404).send({
                    status: 404,
                    msg: responseMessages.cityNotFound,
                    data: {},
                    purpose: purpose
                })
            }
        }
        catch(err) {
            console.log("Country  Error : ", err);
            return res.status(500).send({
                status: 500,
                msg: responseMessages.serverError,
                data: {},
                purpose: purpose
            })
        }
    })()
}




