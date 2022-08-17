const sequelize = require('../config/dbConfig').sequelize;
var DataTypes = require('sequelize/lib/data-types');


/// ##################### tables required ###################### //
const PodcastCategoryModel = require('../models/podcast_category')(sequelize, DataTypes);
const PodcastModel = require('../models/podcast')(sequelize, DataTypes);

PodcastModel.belongsTo(PodcastCategoryModel, { foreignKey: 'podcast_category_id', as: 'podcast_category_details' });



module.exports.countPodcast = (whereData) => {
    return new Promise((resolve, reject) => {
        PodcastCategoryModel.count({
            where: whereData
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}


module.exports.countPodcastFile = (whereData) => {
    return new Promise((resolve, reject) => {
        PodcastModel.count({
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
        PodcastCategoryModel.findAndCountAll({
            where: where,
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

module.exports.findAndCountAllPodcast = (where, data) => {
    return new Promise((resolve, reject) => {
        PodcastModel.findAndCountAll({
            where: where,
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
module.exports.findOnePodcastCategory = (whereData) => {
    return new Promise((resolve, reject) => {
        PodcastCategoryModel.findOne({
            where: whereData,
        }).then(result => {
            result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}



module.exports.findOnePodcast = (whereData) => {
    return new Promise((resolve, reject) => {
        PodcastModel.findOne({
            where: whereData,
            include: [
                {
                    model: PodcastCategoryModel,
                    as: 'podcast_category_details',
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



module.exports.deletePodcastCategory = (where, t = null) => { 
    return new Promise((resolve, reject) => {
        let options = {
            where: where
        }
        //if transaction exist
        if (t != null) options.transaction = t;
        PodcastCategoryModel.destroy(options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}

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

module.exports.deletePodcastCategory = (where, t = null) => { 
    return new Promise((resolve, reject) => {
        let options = {
            where: where
        }
            //if transaction exist
        if (t != null) options.transaction = t;
        PodcastCategoryModel.destroy(options).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}


module.exports.createPodcastCategory = (data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {}
            //if transaction exist
        if (t != null) options.transaction = t;
        PodcastCategoryModel.create(data, options)
            .then((result) => {
                result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            });
    })
}

module.exports.createPodcast = (data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {}
            //if transaction exist
        if (t != null) options.transaction = t;
        PodcastModel.create(data, options)
            .then((result) => {
                result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            });
    })
}


module.exports.updatePodcastCategory = (where,data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
        	where: where
        }
            //if transaction exist
        if (t != null) options.transaction = t;
        PodcastCategoryModel.update(data, options)
            .then((result) => {
                result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            });
    })
}


module.exports.updatePodcast = (where,data, t = null) => {
    return new Promise((resolve, reject) => {
        let options = {
            where: where
        }
            //if transaction exist
        if (t != null) options.transaction = t;
        PodcastModel.update(data, options)
            .then((result) => {
                result = JSON.parse(JSON.stringify(result).replace(/\:null/gi, "\:\"\""));
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            });
    })
}