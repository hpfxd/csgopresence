const client = require("discord-rich-presence")("423856039071449088");
const http = require('http');

const port = 1331;
const host = '127.0.0.1';
const started = new Date();

let activity = null;
let json = {};

server = http.createServer( function(req, res) {

    if (req.method === 'POST') {
        res.writeHead(200, {'Content-Type': 'text/html'});

        var body = '';
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            json = JSON.parse(body);

            if (
                json.hasOwnProperty("provider") &&
                json.provider.hasOwnProperty("name") &&
                json.provider.name === "Counter-Strike: Global Offensive" &&
                json.hasOwnProperty("player")
            ) {
                console.log("updated");
            } else {
                console.log("not updated (invalid json)");
            }

            res.end( '' );
        });
    } else {
        console.log("Not expecting other request types...");
        res.writeHead(200, {'Content-Type': 'text/html'});
        var html = '<html><body>hello! this server is for <a href="//i.tooger.life/git/csgopresence/readme.html">csgopresence</a> by <a href="mailto:hpf@waifu.club">hpfxd</a></body></html>';
        res.end(html);
    }

});

server.listen(port, host);
console.log('Listening at http://' + host + ':' + port);

setInterval(updatePresence, 15*1000);
updatePresence();

function updatePresence() {
    let state = "none";
    let team = "none";
    let teamtext = "none";
    let details = "none";
    try {
        state = json.player.activity;

        if (json.player.team === "CT") {
            team = "ct";
            teamtext = "Counter Terrorists";
        } else if (json.player.team === "T") {
            team = "t";
            teamtext = "Terrorists";
        } else {
            team = "tct";
            team = json.player.team;
        }
    } catch (e) {
    }
    let playing = false;

    if (state === "menu") {
        state = "In the menus";
        details = `Steam Name: ${json.player.name}`;
    } else if (state === "playing") {
        state = `Playing ${capitalizeFirstLetter(json.map.mode)} on ${json.map.name}`;

        let stats = "loading...";
        if (json.player.hasOwnProperty("match_stats")) {
            stats = `Kills/Assists/Deaths: ${json.player.match_stats.kills}/${json.player.match_stats.assists}/${json.player.match_stats.deaths}`
        }

        details = stats;
        playing = true;
    } else {
        state = "In an unknown place...";
        details = "Where could he be? 😱";
    }

    client.updatePresence({
        state: details,
        details: state,
        largeImageKey: playing ? json.map.name : "csgo",
        largeImageText: state,
        smallImageKey: team,
        started: started,
        smallImageText: teamtext,
        instance: false
    });
}

function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}