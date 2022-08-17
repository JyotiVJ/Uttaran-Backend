const sequelize = require('../config/dbConfig').sequelize;
var DataTypes = require('sequelize/lib/data-types');

const UsersModel = require('../models/users')(sequelize, DataTypes);
const EventsModel  = require('../models/events')(sequelize, DataTypes);
const AboutUsModel  = require('../models/aboutUs')(sequelize, DataTypes);
const HomesModel  = require('../models/homes')(sequelize, DataTypes);
const MotivationModel  = require('../models/motivations')(sequelize, DataTypes);
// Count
module.exports.count = (whereData) => {
    return new Promise((resolve, reject) => {
        UsersModel.count({where:whereData}).then(result => {

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
        UsersModel.findOne({
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
        UsersModel.findAll({
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
            //if trunsaction exist
        if (t != null) options.transaction = t;
        UsersModel.create(data, options)
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
        UsersModel.update(data, options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
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
