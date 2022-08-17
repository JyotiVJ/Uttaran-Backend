const JoiBase = require('joi');
const JoiDate = require('@hapi/joi-date');
const Joi     = JoiBase.extend(JoiDate); // extend Joi with Joi Date


// Login Schema
module.exports.loginSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

// Update Home Schema
module.exports.updateHomesSchema = Joi.object().keys({
    title_one: Joi.string().required(),
    title_two: Joi.string().required(),
    sub_title: Joi.string().required(),
    youtube_link: Joi.string().required()             
});


// Create Event Schema
module.exports.createEventSchema = Joi.object().keys({
    event_image: Joi.string().allow(null, ''),
    event_title: Joi.string().required(),
    event_date: Joi.string().required(),
    event_description: Joi.string().required(),
    event_location: Joi.string().required(),
    event_type: Joi.string().required()              
});

// Event Listing Schema
module.exports.listEventSchema = Joi.object().keys({
    page: Joi.number().required(),
    size: Joi.number().required().allow(null, ''),
    search: Joi.string().required().allow(null, ''),         
});

// Change Event Status Schema
module.exports.changeEventStatusSchema = Joi.object().keys({
    event_status: Joi.string().required(),         
});


// Update Event Schema
module.exports.updateEventSchema = Joi.object().keys({
    event_image: Joi.string().required().allow(null, ''),
    event_title: Joi.string().required(),
    event_date: Joi.string().required(),
    event_description: Joi.string().required(),
    event_location: Joi.string().required(),
    event_status: Joi.string().required(),
    event_type: Joi.string().required()              
});

module.exports.updateAboutUsSchema = Joi.object().keys({
    
    aboutUs_title: Joi.string().required(),
    aboutUs_image: Joi.string().required().allow(null, ''),
    aboutUs_body: Joi.string().required(),
   
});

module.exports.updateMotivationSchema = Joi.object().keys({

    motivation_title: Joi.string().required(),
    social: Joi.string().required().required(),
    cultural: Joi.string().required(),
    educational: Joi.string().required(),

});

module.exports.addCountry = Joi.object().keys({

    countryName: Joi.string().required(),
    countryFlag: Joi.string().required(),
    countrySymbol: Joi.string().required(),
    countryCode: Joi.string().required(),

});

module.exports.addStates = Joi.object().keys({

    country_id: Joi.string().required(),
    state_name: Joi.string().required(),
    
});

module.exports.changeStatusCountry = Joi.object().keys({
    countryStatus: Joi.string().required(),

});

module.exports.changeStatusState = Joi.object().keys({
    state_status: Joi.string().required(),

});


module.exports.addCities = Joi.object().keys({
    country_id: Joi.string().required(),
    state_id: Joi.string().required(),
    city_name: Joi.string().required(),

});

module.exports.changeStatusCity = Joi.object().keys({
    city_status: Joi.string().required(),

});


module.exports.addSongs = Joi.object().keys({
    name: Joi.string().required(),
    genre_id: Joi.string().required(),
    cover_picture: Joi.string().allow(null,''),
    length: Joi.string().required(),
    file_name: Joi.string().required(),
    details: Joi.string().required(),
    release_date: Joi.string().required(), 
    is_active: Joi.string().required(),


});


module.exports.addGenre = Joi.object().keys({
    name: Joi.string().required(), 
})


module.exports.addPodcast = Joi.object().keys({
    name: Joi.string().required(),
    cover_image: Joi.string().allow(null,''),
    length: Joi.string().allow(null,''),
    details: Joi.string().required(),

});

module.exports.addPodcastFile = Joi.object().keys({

    name: Joi.string().required(),
    podcast_category_id: Joi.string().required(),
    cover_picture: Joi.string().allow(null,''),
    length: Joi.string().allow(null,''),
    file_name: Joi.string().required(),
    details: Joi.string().required(),

});

module.exports.albumSongSchema = Joi.object().keys({
    album_name: Joi.string().required(),
    album_file: Joi.string().required(),  
});

module.exports.socialEventsSchema = Joi.object().keys({
    title: Joi.string().required(),
    socialPrimaryImage: Joi.string().required(),
    social_event_date: Joi.string().required(),
})
