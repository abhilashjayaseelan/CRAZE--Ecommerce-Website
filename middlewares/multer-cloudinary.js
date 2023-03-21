const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// configuration
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

// upload
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ecommerce-products',
        allowedFormats: ['jpg', 'jpeg', 'png'],
        public_id: (req, file) => {
            // remove the file extension from the file name
            const fileName = file.originalname.split('.').slice(0, -1).join('.');
            return fileName;
        },
    },
});

const upload = multer({ storage: storage }).array('images', 10);

module.exports = upload;
