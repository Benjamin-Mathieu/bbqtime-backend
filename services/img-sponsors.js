const express = require('express');
const router = express.Router();
const fs = require("fs");

router.get("/sponsors/urls", async (req, res) => {
    const path = process.env.IMG_SPONSOR_PATH;
    console.log("path", path, typeof path);

    let array_files = [];

    try {
        fs.readdir(path, (err, files) => {
            files.forEach(file => {
                array_files.push(process.env.URL_BACK + "/img/sponsors/" + file);
            });

            res.status(200).send({ "imgs": array_files });
        });
    } catch (error) {
        throw error;
    }
});

router.get("/sponsors/:filename", async (req, res) => {
    console.log("params", req.params.filename);
    const path = process.env.IMG_SPONSOR_PATH + req.params.filename;
    console.log("path", path);

    try {
        fs.readFile(path, (err, data) => {
            res.writeHead(200, { "Content-Type": "image/jpeg" });
            res.end(data);
        });
    } catch (err) {
        res.status(500).send({ "message": "Erreur lecture image" });
    }
})

module.exports = router;