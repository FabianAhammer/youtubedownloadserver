const fs = require('fs');
const ytdl = require('ytdl-core');
var cors = require('cors')
const ytsr = require('ytsr');
var express = require('express')
var app = express();
const prism = require('prism-media');
app.use(express.json());
app.use(cors());
app.options('*', cors());

let filter;
let results = [];
let query = "";


app.get('/searchSong', function (req, res) {
    ytsr.getFilters(req.query.searchString, function (err, filters) {
        if (err) throw err;
        filter = filters.get('Type').find(o => o.name === 'Video');
        var options = {
            limit: 20,
            nextpageRef: filter.ref,
        }
        ytsr(null, options, function (err, searchResults) {
            if (err) resp = err;
            resp = searchResults;
            query = resp.query;
            results = resp.items;
            res.json(results);
        });

    });
});

app.post('/downloadSong', function (req, res) {
    var url = req.body.link;
    res.attachment("song.mp3");
    ytdl(url, { filter: 'audioonly' }).pipe(res);
});

app.listen(3000);

console.log('Node server running on port 3000');