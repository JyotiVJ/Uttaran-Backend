const sequelize = require('../config/dbConfig').sequelize;
var DataTypes = require('sequelize/lib/data-types');



const AdminsModel = require('../models/admins')(sequelize, DataTypes);
const HomesModel  = require('../models/homes')(sequelize, DataTypes);
const EventsModel  = require('../models/events')(sequelize, DataTypes);
const AboutUsModel  = require('../models/aboutUs')(sequelize, DataTypes);
const MotivationModel  = require('../models/motivations')(sequelize, DataTypes);
const CountryModel  = require('../models/country')(sequelize, DataTypes);
const StateModel  = require('../models/states')(sequelize, DataTypes);
const CityModel  = require('../models/cities')(sequelize, DataTypes);


StateModel.belongsTo(CountryModel, { foreignKey: 'country_id', as: 'country_details' });
CityModel.belongsTo(CountryModel, { foreignKey: 'country_id', as: 'country_details' });
CityModel.belongsTo(StateModel, {foreignKey: 'state_id' , as: 'state_details'});
CountryModel.hasMany(StateModel, {foreignKey: 'country_id', as: 'states_count'});
StateModel.hasMany(CityModel, {foreignKey: 'state_id', as: 'cities_count'});
// Count 

module.exports.count = (whereData) => {
    return new Promise((resolve, reject) => {
        AdminsModel.count({
            where: whereData
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}


module.exports.countCountry = (whereData) => {
    return new Promise((resolve, reject) => {
        CountryModel.count({
            where: whereData
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

module.exports.countState = (whereData) => {
    return new Promise((resolve, reject) => {
        StateModel.count({
            where: whereData
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}


// Find One
module.exports.findOne = (whereData) => {
    return new Promise((resolve, reject) => {
        AdminsModel.findOne({
            where: whereData
        }).then(result => {

            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
 
            resolve(result);
            
        }).catch((error) => {
            reject(error);
        })
    })
}


// Find One
module.exports.findAll = (whereData) => {
    return new Promise((resolve, reject) => {
        AdminsModel.findAll({
            where: whereData
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}


// Create 
module.exports.create = (data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {}
            //if transaction exist
        if (t != null) options.transaction = t;
        AdminsModel.create(data, options)
            .then((result) => {
                result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            });
    })
}

// Create 
module.exports.createCountry = (data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {}
            //if trunsaction exist
        if (t != null) options.transaction = t;
        CountryModel.create(data, options)
            .then((result) => {
                result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            });
    })
}

// Update
module.exports.update = (where, data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
                where: where
            }
            //if trunsaction exist
        if (t != null) options.transaction = t;
        AdminsModel.update(data, options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}


// Find One
module.exports.findHome = (whereData) => {
    return new Promise((resolve, reject) => {
        HomesModel.findOne({
            where: whereData
        }).then(result => {

            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
 
            resolve(result);
            
        }).catch((error) => {
            reject(error);
        })
    })
}

//Find About Us
module.exports.findAboutUs = (whereData) => {
    return new Promise((resolve, reject) => {
        AboutUsModel.findOne({
            where: whereData
        }).then(result => {

            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
 
            resolve(result);
            
        }).catch((error) => {
            reject(error);
        })
    })
}


// Update Homes Data
module.exports.updateHomesDetails = (where, data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
                where: where
            }
        //if trunsaction exist
        if (t != null) options.transaction = t;
        HomesModel.update(data, options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}



// Update Update Data
module.exports.updateAboutUs = (where, data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
                where: where
            }
        //if trunsaction exist
        if (t != null) options.transaction = t;
        AboutUsModel.update(data, options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}


// Create 
module.exports.createNewEvent = (data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {}
            //if trunsaction exist
        if (t != null) options.transaction = t;
        EventsModel.create(data, options)
            .then((result) => {
                result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            });
    })
}


module.exports.findAndCountAllEvent = (where, data) => {
    return new Promise((resolve, reject) => {
        EventsModel.findAndCountAll({
            where: where,
            attributes: [
                'id', 
                'event_image', 
                'event_title',
                'event_location', 
                'event_date', 
                'event_description', 
                'event_type', 
                'event_status',
                'createdAt'
            ],
            order: [
                data.order
            ],
            offset: data.offset,
            limit: data.limit,
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

module.exports.findAndCountAllCountry = (where, data) => {
    return new Promise((resolve, reject) => {
        CountryModel.findAndCountAll({
            where: where,
            attributes: [

                'id', 
                'countryFlag', 
                'countryName',
                'countryStatus',
                'countrySymbol',

            ],
            include: [
                {
                    model: StateModel,
                    as: 'states_count',
                    attributes: ['id', 'state_name']
                },
            ],
            order: [
                data.order
            ],
            offset: data.offset,
            limit: data.limit,
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}


// Find One Event
module.exports.findOneEvent = (whereData) => {
    return new Promise((resolve, reject) => {
        EventsModel.findOne({
            where: whereData
        }).then(result => {

            console.log(result)
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            console.log(result)
            resolve(result);
            
        }).catch((error) => {
            reject(error);
        })
    })
}


// Update Event Data
module.exports.updateEventData = (where, data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
                where: where
            }
        //if trunsaction exist
        if (t != null) options.transaction = t;
        EventsModel.update(data, options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}
 

// Delete Event
module.exports.deleteEvent = (where, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
            where: where
        }
            //if trunsaction exist
        if (t != null) options.transaction = t;
        EventsModel.destroy(options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}


//Find Motivation
module.exports.findMotivation = (whereData) => {
    return new Promise((resolve, reject) => {
        MotivationModel.findOne({
            where: whereData
        }).then(result => {

            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
 
            resolve(result);
            
        }).catch((error) => {
            reject(error);
        })
    })
};

//Update Motivaiton

module.exports.updateMotivation = (where, data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
                where: where
            }
        //if trunsaction exist
        if (t != null) options.transaction = t;
        MotivationModel.update(data, options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}

//Update Country

module.exports.updateCountry = (where, data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
                where: where
            }
        //if trunsaction exist
        if (t != null) options.transaction = t;
        CountryModel.update(data, options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}

// Find One Country
// module.exports.findOneCountry = (whereData) => {
//     return new Promise((resolve, reject) => {
//         CountryModel.findOne({
//             where: whereData,
//             attributes: [

//                 'id', 
//                 'countryFlag', 
//                 'countryName',
//                 'countryStatus',
//                 'countrySymbol',

//             ],
//             include: [
//                 {
//                     model: StateModel,
//                     as: 'states_count',
//                     attributes: ['id', 'state_name']
//                 },
//             ],
//         }).then(result => {

//             result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
 
//             resolve(result);
            
//         }).catch((error) => {
//             reject(error);
//         })
//     })
// }

// update country status
module.exports.updateCountryStatus = (where, data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
                where: where
            }
        //if transaction exist
        if (t != null) options.transaction = t;
        CountryModel.update(data, options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}


// Delete Country
module.exports.deleteCountry = (where, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
            where: where
        }
            //if transaction exist
        if (t != null) options.transaction = t;
        CountryModel.destroy(options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}


// Find One Country
module.exports.findOneCountry = (whereData) => {
    return new Promise((resolve, reject) => {
        CountryModel.findOne({
            where: whereData,
            attributes: [

                'id', 
                'countryFlag', 
                'countryName',
                'countryStatus',
                'countrySymbol',

            ],
            include: [
                {
                    model: StateModel,
                    as: 'states_count',
                    attributes: ['id', 'state_name']
                },
            ],
        }).then(result => {
            console.log(result)
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            console.log(result)
            resolve(result);
            
        }).catch((error) => {
            reject(error);
        })
    })
}



///////////////////////////////////////////////////////// STATES ///////////////////////////////////////////////////

// Create State 
module.exports.createState = (data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {}
            //if transaction exist
        if (t != null) options.transaction = t;
        StateModel.create(data, options)
            .then((result) => {
                result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            });
    })
}

// Find And Count All States
module.exports.findAndCountAllStates = (where, data) => {
    return new Promise((resolve, reject) => { 
        StateModel.findAndCountAll({
            where: where,
            order: [
                data.order
            ],
            include: [{
                    model: CountryModel,
                    as: 'country_details',
                    attributes: ['id', 'countryName']
                },
                {
                    model: CityModel,
                    as: 'cities_count',
                    attributes: ['id', 'city_name']
                },
            ],
            //  include: [
            //     {
            //         model: CityModel,

            
            //         as: 'cities_count',
            //         attributes: ['id', 'city_name']
            //     },
            // ],
            offset: data.offset,
            limit: data.limit,
            }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

// Find And Count All States
module.exports.findAndCountAllStatesForCountry = (where, data) => {
    return new Promise((resolve, reject) => { 
        StateModel.findAndCountAll({
            where: where,
            include: [{
                    model: CountryModel,
                    as: 'country_details',
                    attributes: ['id', 'countryName']
                },
            ],
           
            }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}


// Find One State
module.exports.findOneState = (whereData) => {
    return new Promise((resolve, reject) => {
        StateModel.findOne({
            where: whereData,
            attributes: [
                'id', 
                'state_name', 
                'country_id',   
            ],
             include: [{
                    model: CountryModel,
                    as: 'country_details',
                    attributes: ['id', 'countryName']
                },
                 {
                    model: CityModel,
                    as: 'cities_count',
                    attributes: ['id', 'city_name']
                },
            ],
        }).then(result => {

            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
 
            resolve(result);
            
        }).catch((error) => {
            reject(error);
        })
    })
}

// Update State
module.exports.updateState = (where, data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
                where: where
            }
        //if transaction exist
        if (t != null) options.transaction = t;
        StateModel.update(data, options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}

//Update State Status
module.exports.updateStateStatus = (where, data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
                where: where
            }
        //if transaction exist
        if (t != null) options.transaction = t;
        StateModel.update(data, options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}


// Delete State
module.exports.deleteState = (where, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
            where: where
        }
            //if transaction exist
        if (t != null) options.transaction = t;
        StateModel.destroy(options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}


////////////////////////////////////////////////// CITIES ////////////////////////////////////////////////////////////

// Create City 
module.exports.createCities = (data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {}
            //if transaction exist
        if (t != null) options.transaction = t;
        CityModel.create(data, options)
            .then((result) => {
                result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            });
    })
}


// Find And Count All Cities
module.exports.findAndCountAllCities = (where, data) => {
    return new Promise((resolve, reject) => { 
        CityModel.findAndCountAll({
            where: where,
            order: [
                data.order
            ],
            include: [
                {
                    model: CountryModel,
                    as: 'country_details',
                    attributes: ['id', 'countryName']
                },
                {
                    model: StateModel,
                    as: 'state_details',
                    attributes: ['id', 'state_name']
                },
            ],
            offset: data.offset,
            limit: data.limit,
            }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

// Find One City
module.exports.findOneCity = (whereData) => {
    return new Promise((resolve, reject) => {
        CityModel.findOne({
            where: whereData,
            attributes: [
                'id', 
                'city_name',
                'state_id', 
                'country_id',   
            ],
             include: [
                {
                    model: CountryModel,
                    as: 'country_details',
                    attributes: ['id', 'countryName']
                },
                {
                    model: StateModel,
                    as: 'state_details',
                    attributes: ['id', 'state_name']
                },
            ],
        }).then(result => {

            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
 
            resolve(result);
            
        }).catch((error) => {
            reject(error);
        })
    })
}


// Update City
module.exports.updateCity = (where, data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
                where: where
            }
        //if transaction exist
        if (t != null) options.transaction = t;
        CityModel.update(data, options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}



// Delete City
module.exports.deleteCity = (where, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
            where: where
        }
            //if transaction exist
        if (t != null) options.transaction = t;
        CityModel.destroy(options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}