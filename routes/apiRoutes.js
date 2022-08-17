const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {upload} = require("../helpers/file-uploader");


/* ############################################ Middlewares ############################################ */
const validateRequest = require('../middlewares/ValidateRequest');
const authenticationMiddleware = require('../middlewares/AuthenticationMiddleware');


/* ############################################ Joi Validation Schema ################################ */
const usersValidationSchema = require('../validation-schemas/UsersValidationSchemas'); 


/* ######################## Controllers ############################################ */
const usersController   = require('../controllers/Api/usersController'); 
const songController    = require('../controllers/Api/songControllers');
const albumController   = require('../controllers/Api/albumController');
const podcastController = require('../controllers/Api/podcastController'); 
const eventController   = require('../controllers/Api/eventController');

const { filename } = require('script/client');

// SET STORAGE FOR PROFILE PICTURE
var storageProfilePicture = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = 'uploads/profile';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})



// SET STORAGE FOR SONG
var storageSong = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = 'uploads/songs';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, 'song_' + Date.now() + path.extname(file.originalname))
    }
})

// SET STORAGE FOR ALbums
var storageAlbums = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = 'uploads/albums';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: function(req, file, cb) {
         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

// SET STORAGE FOR EVENT PICTURE
var storageAlbumSong = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = 'uploads/albums_songs';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})


var uploadImagePicture = multer({ storage: storageProfilePicture });
var uploadSong = multer({ storage: storageSong });
var uploadAlbums = multer({storage: storageAlbums});
var uploadAlbumSong = multer({storage: storageAlbumSong});




// ################################### AUTH ########################################### //
router.post('/register', validateRequest.validate(usersValidationSchema.userRegisterSchema, 'body'), usersController.registerUser); // User Registration Route
router.post('/login', validateRequest.validate(usersValidationSchema.loginSchema, 'body'), usersController.userLogin); // System Login Route
router.get('/fetch-user-details', authenticationMiddleware.authenticateRequestAPI, usersController.fetchUserDetails); // Fetch User Details
router.post('/upload-profile-image', authenticationMiddleware.authenticateRequestAPI,  uploadImagePicture.single('file'), usersController.uploadProfileImage); // Upload Event Image
router.put('/update-details', authenticationMiddleware.authenticateRequestAPI, validateRequest.validate(usersValidationSchema.userUpdateSchema, 'body'),  usersController.updateUserName); // Update Details Image
router.post('/forgot-password', validateRequest.validate(usersValidationSchema.forgotPassSchema, 'body'), usersController.forgotPassword); // Forgot Password Route
router.post('/verify-otp-pot', validateRequest.validate(usersValidationSchema.otpVerificationSchema, 'body'), usersController.verifyOTPOT); // Verifing OTP
router.post('/reset-password', validateRequest.validate(usersValidationSchema.resetPassSchema, 'body'), usersController.resetPassword); // Reset Password Route

 

// ######################################################## EVENTS ################################################################ //
router.get('/upcoming-event-fetching-list',authenticationMiddleware.authenticateRequestAPI, validateRequest.validate(usersValidationSchema.listUpcomingEventSchema, 'query'), usersController.upcomingEventList);
router.get('/previous-event-fetching-list', validateRequest.validate(usersValidationSchema.listPreviousEventSchema, 'query'), usersController.previousEventList);

// #################################### About Us ###################################### //

router.get('/fetch-aboutUs', usersController.getAboutUs); // Fetch About Us Route
router.get('/fetch-home', usersController.getHome); // Fetch About Us Route

// #################################### Motivation ###################################### //
router.get('/fetch-motivation', usersController.getMotivation); // Fetch Motivation Route


// ###################################################### Songs ################################################################ //
router.get('/upcoming-song-fetching-list',authenticationMiddleware.authenticateRequestAPI, validateRequest.validate(usersValidationSchema.listUpcomingSongRelease, 'query'), songController.upcomingSongList);
router.get('/released-song-fetching-list',authenticationMiddleware.authenticateRequestAPI, validateRequest.validate(usersValidationSchema.listUpcomingSongRelease, 'query'), songController.previousSongList);
router.post('/upload-song', authenticationMiddleware.authenticateRequestAPI, uploadSong.single('file'), songController.uploadSong); // Upload Song



// ######################################################## Albums ################################################ //
router.post('/upload-album-image', authenticationMiddleware.authenticateRequestAPI,  uploadAlbums.array('files',3), usersController.uploadAlbumImages); // Upload Image
router.post('/upload-album-song',authenticationMiddleware.authenticateRequestAPI,  uploadAlbumSong.single('file'), albumController.uploadAlbumSong); // Upload Album Song
router.post('/create-album',authenticationMiddleware.authenticateRequestAPI, validateRequest.validate(usersValidationSchema.albumSongSchema, 'body'), albumController.createAlbum); // Reset Password Route


router.post('/create-album-images', authenticationMiddleware.authenticateRequestAPI,
    upload.fields([
        {
            name: "file[]",
            maxCount: 6,
        },
    ]),
    albumController.createAlbumPhotoes);

router.get('/album-song-fetching-list',authenticationMiddleware.authenticateRequestAPI, albumController.albumFetchList);
router.get('/fetch-album-song/:album_id',authenticationMiddleware.authenticateRequestAPI, albumController.albumSongDetailsFetch);
router.delete('/album-delete/:album_id', authenticationMiddleware.authenticateRequestAPI, albumController.albumSongDelete); // Album Details

// ####################################################### SOCIAL EVENTS ###################################################### //
router.get('/upcoming-social-event-fetching-list',authenticationMiddleware.authenticateRequestAPI, eventController.upcomingSocialEventList);
router.get('/previous-social-event-fetching-list',authenticationMiddleware.authenticateRequestAPI, eventController.previousSocialEventList);




// ########################################## Podcasts ########################################## //

router.get('/podcast-fetch-list',authenticationMiddleware.authenticateRequestAPI, validateRequest.validate(usersValidationSchema.listPodcast, 'query'), podcastController.podcastList);

module.exports = router;        