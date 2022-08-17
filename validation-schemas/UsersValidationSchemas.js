const JoiBase = require('joi');
const JoiDate = require('@hapi/joi-date');
const Joi     = JoiBase.extend(JoiDate); // extend Joi with Joi Date



// Create User Schema
module.exports.userUpdateSchema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().allow(null, ''),
});

// OTP Verification Schema
module.exports.otpVerificationSchema = Joi.object().keys({
    otp: Joi.string().required(),
    email: Joi.string().email().required()
});

// Reset Password Schema
module.exports.resetPassSchema = Joi.object().keys({
    password: Joi.string().required().min(6),
    confirm_password: Joi.string().equal(Joi.ref('password')).required().messages({
        'any.only': `Confirm Password should match with Password`,
    }), //Confirm password must be same as password
    otp: Joi.string().required()
});

// Forgot Password Schema
module.exports.forgotPassSchema = Joi.object().keys({
    email: Joi.string().required(),
}); 

// Login Schema
module.exports.loginSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports.listUpcomingEventSchema = Joi.object().keys({
    page: Joi.number().required(),
    search: Joi.string().required().allow(null, ''),  
})

module.exports.listPreviousEventSchema = Joi.object().keys({
    page: Joi.number().required(),
})



module.exports.listUpcomingSongRelease = Joi.object().keys({
    page: Joi.number().required(),
    search: Joi.string().required().allow(null, ''),  
});


module.exports.albumSongSchema = Joi.object().keys({
    album_name: Joi.string().required(),
    album_file: Joi.string().required(),  
});

module.exports.listPodcast = Joi.object().keys({
    page: Joi.number().required(),
    size: Joi.string().required().allow(null, ''),  
});
