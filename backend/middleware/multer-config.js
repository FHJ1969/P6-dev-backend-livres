const multer = require('multer');
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.memoryStorage();

const upload = multer({ storage: storage }).single('image');

module.exports = (req, res, next) => {
    upload(req, res, async (err) => {
        if (err)             
            return res.status(500).json({ error: err.message });

        if (!req.file)  {
            if (req.params.id) {
                next();
                return;
            }
            return res.status(400).json({ error: 'Vous devez sélectionner un fichier' });
        }           
        
        const extension = MIME_TYPES[req.file.mimetype];
        if (!extension)
            return res.status(400).json({ error: "Le type de fichier n'est pas valide" });
        
        const nameWithoutExt = req.file.originalname
            .replace(" ", "_")
            .replace(path.extname(req.file.originalname), "");
        const newFileName = `${Date.now()}_${nameWithoutExt}.webp`;

        const destinationDirectory = "./images";
        fs.access(destinationDirectory, (error) => {
            if (error) {
                fs.mkdirSync(destinationDirectory);
            }
        });

        try {
            await sharp(req.file.buffer)
                .resize(600, 600, {
                    fit: 'inside',
                })
                .webp({ quality: 20 })
                .toFile(path.join(destinationDirectory, newFileName));

            req.file.filename = newFileName;
            next();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};
