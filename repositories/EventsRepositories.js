const sequelize = require('../config/dbConfig').sequelize;
var  DataTypes = require('sequelize/lib/data-types');

const SocialEventModel = require('../models/social_events')(sequelize, DataTypes);
const SocialEventImages = require('../models/social_event_images')(sequelize, DataTypes);

SocialEventModel.hasMany(SocialEventImages, { foreignKey:'social_event_id', as:'images_social' });

module.exports.findAndCountAllSocialEvent = (where, data) => {
    return new Promise((resolve, reject) => {
        SocialEventModel.findAll({
            where: where,
            attributes: [
                'id', 
                'title',
                'socialPrimaryImage',
                'social_event_date', 
            ],
            include: [
                // {
                //  model: SocialEventImages,
                //  as: 'images_social',
                //  attributes: ['id','images'],
                //  [sequelize.literal(`CONCAT("/uploads",album_images)`
                //  ),'album_images'],
                // },

                {
                 model: SocialEventImages,
                 as: 'images_social',
                 attributes: [
                 ['id','social_event_image_id'],
                 [sequelize.literal(`CONCAT("/uploads", images)`
                 ),'images'],
                ]
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

module.exports.createSocialEvent = (data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {}
        //if transaction exist
        if (t != null) options.transaction = t;
        SocialEventModel.create(data, options)
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
module.exports.updateSocialEvent = (where, data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
                where: where
            }
            //if trunsaction exist
        if (t != null) options.transaction = t;
        SocialEventModel.update(data, options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}


// Find One
module.exports.findOne = (whereData) => {
    return new Promise((resolve, reject) => {
        SocialEventModel.findOne({
            where: whereData,
            include: [
               {
                 model: SocialEventImages,
                 as: 'images_social',
                 attributes: [
                 ['id','social_event_image_id'],
                 [sequelize.literal(`CONCAT("/uploads", images)`
                 ),'images'],
                ]
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


module.exports.deleteSocialEvent = (where, t = null) => { 
    return new Promise((resolve, reject) => { 
        let options = {
            where: where
        }
            //if transaction exist
        if (t != null) options.transaction = t;
        SocialEventModel.destroy(options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}