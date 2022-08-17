const sequelize = require('../config/dbConfig').sequelize;
var DataTypes = require('sequelize/lib/data-types');


/// ##################### tables required ###################### //
const SongsModel = require('../models/songs')(sequelize, DataTypes);
const GenreModel = require('../models/genre')(sequelize,DataTypes);
const EventModel = require('../models/events')(sequelize, DataTypes);


//########################## Joining The Tables #################################### // 

SongsModel.belongsTo(GenreModel, { foreignKey: 'genre_id', as: 'genre_details' });
GenreModel.hasMany(SongsModel, { foreignKey: 'genre_id', as: 'song_details' });
GenreModel.hasOne(SongsModel, { foreignKey: 'genre_id', as: 'song_count' });



//  ############################## Queries ############################## //
module.exports.countSongs = (whereData) => {
    return new Promise((resolve, reject) => {
        SongsModel.count({
            where: whereData
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

module.exports.countGenre = (whereData) => {
    return new Promise((resolve, reject) => {
        GenreModel.count({
            where: whereData
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}


module.exports.findAndCountAll = (where, data) => {
    return new Promise((resolve, reject) => {
        SongsModel.findAll({
            where: where,
            attributes: [
                'id', 
                'name',
                'cover_picture', 
                'length',
                'file_name', 
                'release_date', 
                'is_active', 
            ],
            include: [
                {
                    model: GenreModel,
                    as: 'genre_details',
                    attributes: ['id', 'name']
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

module.exports.findAndCountAllGenre = (where, data) => {
    return new Promise((resolve, reject) => {
        GenreModel.findAndCountAll({
            where: where,
            attributes: [
                'id', 
                'name',
            ],
            include: [
                {
                    model: SongsModel,
                    as: 'song_details',
                    attributes: ['id', 'name','length']
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
module.exports.findOneSong = (whereData) => {
    return new Promise((resolve, reject) => {
        SongsModel.findOne({
            where: where,
            include: [
                {
                    model: GenreModel,
                    as: 'genre_details',
                    attributes: ['id', 'name']
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


module.exports.findOneGenre = (whereData) => {
    return new Promise((resolve, reject) => {
        GenreModel.findOne({
            where: where,
             include: [
                {
                    model: SongsModel,
                    as: 'song_details',
                    attributes: ['id', 'name','length']
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


// Create 
module.exports.createSong = (data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {}
            //if trunsaction exist
        if (t != null) options.transaction = t;
        SongsModel.create(data, options)
            .then((result) => {
                result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            });
    })
}


module.exports.createGenre = (data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {}
            //if trunsaction exist
        if (t != null) options.transaction = t;
        GenreModel.create(data, options)
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
module.exports.updateSong = (where,data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
        	where: where
        }
            //if transaction exist
        if (t != null) options.transaction = t;
        SongsModel.update(data, options)
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
module.exports.updateGenre = (where,data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
            where: where
        }
            //if transaction exist
        if (t != null) options.transaction = t;
        GenreModel.update(data, options)
            .then((result) => {
                result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            });
    })
}


// Delete Country
module.exports.deleteSong = (where, t = null) => { 
    return new Promise((resolve, reject) => {
        let options = {
            where: where
        }
            //if transaction exist
        if (t != null) options.transaction = t;
        SongsModel.destroy(options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}


