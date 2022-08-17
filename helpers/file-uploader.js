const multer = require("multer");
const { MulterError } = require("multer");



const storage = multer.memoryStorage({
    destination: (request, file, callback) => {
        callback(null, "");
    },
});

const fileFilter = (request, file, callback) => {
    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "application/pdf"
    ) {
        callback(null, true);
    } else {
        callback(new Error("Unsupported File Type"), null);
    }
};

const upload = multer({
    storage,
    limit: {
        fileSize: 1024 * 1024 * 8,
    },
    // fileFilter
});

exports.upload = upload;

exports.uploadArrayImages =
    (fieldName, maxCount = 3) =>
        (request, response, next) => {
            const uploadObject = upload.array(fieldName, maxCount);
            uploadObject(request, response, async (error) => {
                if (error instanceof MulterError) {
                    return response.status(400).json({
                        message: getMulterErrorMessage(error.code),
                    });
                } else if (error) {
                    return response.status(400).json({
                        message: error.message,
                    });
                } else {
                    next();
                }
            });
        };

exports.uploadS3File = async function (params) {
    return await new Promise((resolve, reject) => {
        s3.upload(params, (err, data) =>
            err == null ? resolve(data) : reject(err)
        );
    });
};

exports.checkS3File = async function (params) {
    return await new Promise((resolve, reject) => {
        s3.headObject(params, (err, data) =>
            err == null ? resolve(data) : reject(err)
        );
    });
};

exports.deleteS3File = async function (fileObject) {
    s3.headObject(
        {
            Bucket: process.env.AWS_BUCKET,
            Key: fileObject,
        },
        (err, data) =>
            err == null
                ? s3.deleteObject(
                    {
                        Bucket: process.env.AWS_BUCKET,
                        Key: fileObject,
                    },
                    (err, data) => {
                        err == null
                            ? console.log("File Object Been Deleted Deleted")
                            : console.log("Unable To Delete The File");
                    }
                )
                : console.log("File Object Not Found")
    );
};

const getMulterErrorMessage = (errorCode) => {
    const errorMessages = {
        LIMIT_PART_COUNT: "Too many parts",
        LIMIT_FILE_SIZE: "File too large", 
        LIMIT_FILE_COUNT: "Too many files",
        LIMIT_FIELD_KEY: "Field name too long",
        LIMIT_FIELD_VALUE: "Field value too long",
        LIMIT_FIELD_COUNT: "Too many fields",
        LIMIT_UNEXPECTED_FILE: "Unexpected or too many fields",
        MISSING_FIELD_NAME: "Field name missing",
    };
    return errorMessages[errorCode];
};
