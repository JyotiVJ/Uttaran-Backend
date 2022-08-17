const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');


/* ############################################ Middlewares ############################################ */
const validateRequest = require('../middlewares/ValidateRequest');
const authenticationMiddleware = require('../middlewares/AuthenticationMiddleware');


/* ############################################ Joi Validation Schema ################################ */
const adminsValidationSchema = require('../validation-schemas/AdminsValidationSchemas'); 


/* ######################## Controllers ############################################ */
const adminsController = require('../controllers/Admin/adminsController'); 
const countryController = require('../controllers/Admin/countryController');
const songController  = require('../controllers/Admin/songController');
const genreController = require('../controllers/Admin/genreController');
const podcastController = require('../controllers/Admin/podcastController');
const albumController = require('../controllers/Admin/albumController');
const eventController = require('../controllers/Admin/eventController');
const educationalEvent = require('../controllers/Admin/educationalEvent');
const {upload} = require("../helpers/file-uploader");

const { filename } = require('script/client');


// SET STORAGE FOR EVENT PICTURE
var storageEventPicture = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = 'uploads/events';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

// SET STORAGE FOR Country Flag
var storageCountryFlag = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = 'uploads/events';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

// SET STORAGE FOR Song File
var storageSongFile = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = 'uploads/songs';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

// SET STORAGE FOR Song File
var storageSongImage = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = 'uploads/songs';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

// SET STORAGE FOR EVENT PICTURE
var storageAboutUsPicture = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = 'uploads/aboutUs';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

// SET STORAGE FOR PODCAST FILE
var storagePodcastFile = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = 'uploads/podcasts';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})


// SET STORAGE FOR EVENT PICTURE
var storagePodcastImage = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = 'uploads/podcast_image';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

// SET STORAGE FOR EVENT PICTURE
var storagePodcastUrlImage = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = 'uploads/podcast_image';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

// SET STORAGE FOR ALBUM PICTURE
var storageAlbumlCover = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = 'uploads/albums_songs';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

// SET STORAGE FOR SOCIAL EVENTS
var storageSocialEvents = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = 'uploads/social_events';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});


var uploadEventsPicture = multer({ storage: storageEventPicture });
var uploadAboutUsPicture = multer({ storage: storageAboutUsPicture });
var uploadCountryFlag = multer({ storage: storageCountryFlag });
var uploadSongFile = multer({storage: storageSongFile});
var uploadSongImage = multer({storage: storageSongImage});
var uploadPodcastFile = multer({storage: storagePodcastFile});
var uploadPodcastImage = multer({storage: storagePodcastImage});
var uploadPodImage = multer({storage: storagePodcastUrlImage});
var uploadAlbumSong = multer({storage: storageAlbumlCover});
var uploadSocialEvents = multer({storage: storageSocialEvents}); 

// ################################### AUTH ########################################### //
router.post('/login', validateRequest.validate(adminsValidationSchema.loginSchema, 'body'), adminsController.adminLogin); // System Login Route


// ################################## Homes ########################################### //
router.get('/fetch-homes', authenticationMiddleware.authenticateAdminRequestAPI, adminsController.getHomes); // Fetch Home Route
router.put('/update-homes', authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminsValidationSchema.updateHomesSchema, 'body'), adminsController.updateHomes); // Update Home Route

 
// ################################## Events ########################################### //
router.post('/upload-event-image',authenticationMiddleware.authenticateAdminRequestAPI,  uploadEventsPicture.single('file'), adminsController.uploadEventCoverImage); // Upload Event Image
router.post('/create-event',authenticationMiddleware.authenticateAdminRequestAPI,   validateRequest.validate(adminsValidationSchema.createEventSchema, 'body'), adminsController.createEvent); // Create Event
router.get('/event-list',authenticationMiddleware.authenticateAdminRequestAPI,   validateRequest.validate(adminsValidationSchema.listEventSchema, 'query'), adminsController.eventList);
router.get('/event-details/:event_id',authenticationMiddleware.authenticateAdminRequestAPI,   adminsController.eventDetails);
router.put('/change-event-status/:event_id', authenticationMiddleware.authenticateAdminRequestAPI,  validateRequest.validate(adminsValidationSchema.changeEventStatusSchema, 'query'), adminsController.changeStatusOfEvent); // Change Status Event
router.put('/update-event/:event_id', authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminsValidationSchema.updateEventSchema, 'body'), adminsController.updateEvent); // Update Event
router.delete('/delete-event/:event_id', authenticationMiddleware.authenticateAdminRequestAPI, adminsController.deleteEvent); // Delete Event


// #################################### About Us ###################################### //
router.get('/fetch-aboutUs', authenticationMiddleware.authenticateAdminRequestAPI, adminsController.getAboutUs); // Fetch About Us Route
router.put('/update-aboutUs', authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminsValidationSchema.updateAboutUsSchema, 'body'), adminsController.updateAboutUs); // Update About us Route
router.post('/upload-aboutUs-image',authenticationMiddleware.authenticateAdminRequestAPI,  uploadAboutUsPicture.single('file'), adminsController.uploadAboutUsImage); // Upload Event Image

// #################################### Motivation ###################################### //
router.get('/fetch-motivation', authenticationMiddleware.authenticateAdminRequestAPI, adminsController.getMotivation); // Fetch Motivation Route
router.put('/update-motivation', authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminsValidationSchema.updateMotivationSchema, 'body'), adminsController.updateMotivation); // Update Motivation Route


//######################################################## Country ###############################################################//
router.post('/add-country',authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminsValidationSchema.addCountry, 'body'), countryController.addCountry); // Create Country
router.post('/upload-country-flag',authenticationMiddleware.authenticateAdminRequestAPI,  uploadCountryFlag.single('file'), countryController.uploadCountryFlag); // Upload Event Image
router.get('/fetch-country-list', authenticationMiddleware.authenticateAdminRequestAPI, countryController.fetchCountryList); // Fetch Country List Route
router.put('/update-country/:country_id',authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminsValidationSchema.addCountry, 'body'), countryController.updateCountry); // Update Country
router.get('/fetch-country-details/:country_id',authenticationMiddleware.authenticateAdminRequestAPI, countryController.fetchCountryDetails); // Fetch Country Details
router.patch('/update-country-status/:country_id',authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminsValidationSchema.changeStatusCountry, 'query'), countryController.updateCountryStatus); // Update Country Status
router.delete('/delete-country/:country_id', authenticationMiddleware.authenticateAdminRequestAPI, countryController.deleteCountry); // Delete Country



//#################################################### States ########################################################//
router.post('/add-state',authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminsValidationSchema.addStates, 'body'), countryController.addState); // Create State
router.get('/fetch-state-list', authenticationMiddleware.authenticateAdminRequestAPI, countryController.fetchStatesList); // Fetch State List Route
router.get('/fetch-state-details/:state_id',authenticationMiddleware.authenticateAdminRequestAPI, countryController.fetchStateDetails); // Fetch State Details
router.put('/update-state/:state_id',authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminsValidationSchema.addStates, 'body'), countryController.updateState); // Update State
router.patch('/update-state-status/:state_id',authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminsValidationSchema.changeStatusState, 'body'), countryController.updateStateStatus); // Update State Status
router.delete('/delete-state/:state_id', authenticationMiddleware.authenticateAdminRequestAPI, countryController.deleteState); // Delete State
router.get('/fetch-state-list-under-country/:country_id',authenticationMiddleware.authenticateAdminRequestAPI, countryController.fetchStatesUnderCountry); // Fetch State Details


// ################################################## Cities ########################################################### //
router.post('/add-cities',authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminsValidationSchema.addCities, 'body'), countryController.addCities); // Create Cities
router.get('/fetch-cities-list', authenticationMiddleware.authenticateAdminRequestAPI, countryController.fetchCitiesList); // Fetch City List Route
router.get('/fetch-cities-details/:city_id',authenticationMiddleware.authenticateAdminRequestAPI, countryController.fetchCityDetails); // Fetch City Details
router.put('/update-city/:city_id',authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminsValidationSchema.addCities, 'body'), countryController.updateCities); // Update State
router.patch('/update-city-status/:city_id',authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminsValidationSchema.changeStatusCity, 'query'), countryController.updateCitiesStatus); // Update State
router.delete('/delete-city/:city_id', authenticationMiddleware.authenticateAdminRequestAPI, countryController.deleteCity); // Delete State

// ################################################ Songs ############################################################### //
router.post('/upload-song-file',authenticationMiddleware.authenticateAdminRequestAPI,  uploadSongFile.single('file'), songController.uploadSongFile); // Upload Song File
router.post('/upload-song-image',authenticationMiddleware.authenticateAdminRequestAPI,  uploadSongImage.single('file'), songController.uploadSongImage); // Upload Song Image
router.post('/add-songs',authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminsValidationSchema.addSongs, 'body'), songController.addSongs)
router.put('/update-songs/:song_id',authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminsValidationSchema.addSongs, 'body'), songController.updateSong)
router.get('/fetch-songs-list', authenticationMiddleware.authenticateAdminRequestAPI, songController.fetchSongList); // Fetch Song List Route
router.get('/fetch-songs-details/:song_id',authenticationMiddleware.authenticateAdminRequestAPI, songController.fetchSongDetails)
router.delete('/delete-song/:song_id', authenticationMiddleware.authenticateAdminRequestAPI, songController.deleteSong); // Delete Song


// ############################################### Genres ################################################################ //
router.post('/add-genre',authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminsValidationSchema.addGenre, 'body'), genreController.addGenre)
router.put('/update-genre/:genre_id',authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminsValidationSchema.addGenre, 'body'), genreController.updateGenre)
router.get('/fetch-genre-list', authenticationMiddleware.authenticateAdminRequestAPI, genreController.fetchGenreList); // Fetch Genre List Route
router.get('/fetch-genre-details/:genre_id',authenticationMiddleware.authenticateAdminRequestAPI, genreController.fetchGenreDetails)


// ############################################## Podcast Category ############################################################## //
router.post('/add-podacast-category',authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminsValidationSchema.addPodcast, 'body'), podcastController.addPodcastCategory)
router.put('/update-podacast-category/:podcast_category_id',authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminsValidationSchema.addPodcast, 'body'), podcastController.updatePodcastCategory)
router.get('/fetch-podcast-category-list', authenticationMiddleware.authenticateAdminRequestAPI, podcastController.fetchPodcastCategoryList); // Fetch Podcast List Route
router.post('/upload-podcast-image',authenticationMiddleware.authenticateAdminRequestAPI,  uploadPodcastImage.single('file'), podcastController.uploadPodcastCoverImage); // Upload Song Image
router.get('/fetch-podcast-category-details/:podcast_category_id',authenticationMiddleware.authenticateAdminRequestAPI, podcastController.fetchPodcastCategoryDetails)
router.delete('/delete-podcast-category/:podcast_category_id', authenticationMiddleware.authenticateAdminRequestAPI, podcastController.deletePodcastCategory); // Delete Podcast Category



// ############################################# Podcast ############################################### //
router.post('/upload-podcast',authenticationMiddleware.authenticateAdminRequestAPI,  uploadPodcastFile.single('file'), podcastController.uploadPodcast); // Upload Podcast File 
router.post('/add-podcast',authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminsValidationSchema.addPodcastFile, 'body'), podcastController.addPodcast)
router.post('/upload-pod-image',authenticationMiddleware.authenticateAdminRequestAPI,  uploadPodImage.single('file'), podcastController.uploadPodCoverImage); // Upload Podcast Image
router.put('/update-podacast/:podcast_id',authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminsValidationSchema.addPodcastFile, 'body'), podcastController.updatePodcast) //Update Podcast
router.get('/fetch-podcast-list', authenticationMiddleware.authenticateAdminRequestAPI, podcastController.fetchPodcastList); // Fetch Podcast List Route
router.get('/fetch-podcast-details/:podcast_id',authenticationMiddleware.authenticateAdminRequestAPI, podcastController.fetchPodcastDetails)


// ############################################ Album ################################################# //
router.post('/upload-album-cover',authenticationMiddleware.authenticateAdminRequestAPI,  uploadAlbumSong.single('file'), albumController.uploadAlbumCover); // Upload Album Cover File 
router.post('/upload-album-images',authenticationMiddleware.authenticateAdminRequestAPI,
    upload.fields([
        {
            name: "file[]",
            maxCount: 3,
        },
    ]),
    albumController.uploadAlbumImages);

router.post('/create-album',authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminsValidationSchema.albumSongSchema, 'body'), albumController.createAlbum)
router.get('/album-fetch-list',authenticationMiddleware.authenticateAdminRequestAPI, albumController.albumFetchList);
router.get('/fetch-album-song/:album_id',authenticationMiddleware.authenticateAdminRequestAPI, albumController.albumDetailsFetch);
router.delete('/album-delete/:album_id', authenticationMiddleware.authenticateRequestAPI, albumController.albumDelete); // Album Delete

// ########################################### SOCIAL EVENTS ############################################## //

router.post('/upload-social-event-primary-image',authenticationMiddleware.authenticateAdminRequestAPI,  uploadSocialEvents.single('file'), eventController.uploadSocialPrimaryImage); // Upload Social Primary Image File 
router.post('/create-social-event', authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminsValidationSchema.socialEventsSchema, 'body'), eventController.createSocialEvent) //Create Social Event
router.put('/update-social-event/:social_event_id',authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminsValidationSchema.socialEventsSchema, 'body'), eventController.updateSocialEvent) //Update Social Event
router.get('/social-events-fetch-list',authenticationMiddleware.authenticateAdminRequestAPI, eventController.fetchSocialEventList);

router.post('/upload-social-events-images',authenticationMiddleware.authenticateAdminRequestAPI,
    upload.fields([
        {
            name: "file[]",
            maxCount: 3,
        },
    ]),
    eventController.uploadSocialEventImages);
router.get('/fetch-social-event/:social_event_id',authenticationMiddleware.authenticateAdminRequestAPI, eventController.sociaEventDetailsFetch);
router.delete('/delete-social-event/:social_event_id', authenticationMiddleware.authenticateAdminRequestAPI, eventController.deleteSocialEvent); // Delete Social Event
router.delete('/delete-social-event-image/:social_event_image_id', authenticationMiddleware.authenticateAdminRequestAPI, eventController.deleteSocialEventImage); // Delete Social Event



// ########################################## Educational Events ########################################### //
router.post('/create-educational-events',authenticationMiddleware.authenticateAdminRequestAPI, educationalEvent.createEducationalEvent); // Upload Social Primary Image File 
router.put('/update-educational-events/:educational_event_id',authenticationMiddleware.authenticateAdminRequestAPI, educationalEvent.updateEducationalEvent) //Update Educational Event

module.exports = router;
