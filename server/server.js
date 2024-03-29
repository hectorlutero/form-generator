const express = require("express");
const multer = require('multer');
const app = express();

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Set the destination folder where files will be uploaded
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Set the file name to be saved
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post('/api/v1/', upload.any(), (req, res) => {
    console.log(req.headers); // Headers
    console.log(req.files); // Files
    console.log(req.body); // Other form fields
    return res.status(200).json(req.body);
});

const port = 8080;

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
