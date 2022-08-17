const sequelize = require('../config/dbConfig').sequelize;
var  DataTypes = require('sequelize/lib/data-types');



const AlbumModel = require('../models/album')(sequelize, DataTypes);
const AlbumImages = require('../models/album_images')(sequelize, DataTypes);


 AlbumModel.hasMany(AlbumImages, { foreignKey:'album_id', as:'images' });


module.exports.count = (whereData) => {
    return new Promise((resolve, reject) => {
        AlbumModel.count({
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
module.exports.createAlbumSong = (data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {}
            //if transaction exist
        if (t != null) options.transaction = t;
        AlbumModel.create(data, options)
            .then((result) => {
                result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            });
    })
}

//Find And Count ALL
module.exports.findAndCountAll = (where, data) => {
    return new Promise((resolve, reject) => {
        AlbumModel.findAll({
            where: where,
            attributes: [
                'id', 
                'album_name',
                'album_file', 
            ],
            include: [
                {
                 model: AlbumImages,
                 as: 'images',
                 attributes: [
                 ['id','album_id'],
                 [sequelize.literal(`CONCAT("/uploads",album_images)`
                 ),'album_images'],
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


// Find One
module.exports.findOneAlbumSong = (whereData) => {
    return new Promise((resolve, reject) => {
        AlbumModel.findOne({
            where: whereData,
            include: [
                {
                 model: AlbumImages,
                 as: 'images',
                 attributes: [
                 ['id','album_id'],
                 [sequelize.literal(`CONCAT("/uploads",album_images)`
                 ),'album_images'],
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

module.exports.deleteAlbumSong = (where, t = null) => { 
    return new Promise((resolve, reject) => {
        let options = {
            where: where
        }
            //if transaction exist
        if (t != null) options.transaction = t;
        AlbumModel.destroy(options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}