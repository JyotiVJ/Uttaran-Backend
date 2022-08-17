const sequelize = require('../config/dbConfig').sequelize;
var  DataTypes = require('sequelize/lib/data-types');

const EducationalEventModel = require('../models/educationalEvents')(sequelize, DataTypes);




module.exports.createSocialEvent = (data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {}
        //if transaction exist
        if (t != null) options.transaction = t;
        EducationalEventModel.create(data, options)
            .then((result) => {
                result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            });
    })
}




module.exports.updateEducationalEvent = (where, data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
                where: where
            }
            //if trunsaction exist
        if (t != null) options.transaction = t;
        EducationalEventModel.update(data, options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}

