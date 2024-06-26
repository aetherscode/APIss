const express = require('express');
const cors = require('cors'); 
const { thinkany, GoodyAI, luminai, blackbox, CgtAi, Simsimi, leptonAi, yousearch, LetmeGpt, AoyoAi } = require('./scrape/scraper');
const { PlayStore, BukaLapak } = require('./scrape/search');
const config = require('./config');
const msg = config.messages;
const app = express();
const PORT = process.env.PORT || 3000;

app.set('json spaces', 4);

let totalRequests = 0;
let totalVisitors = 0;
const visitors = new Set();

const corsOptions = {
    origin: 'https://shannmoderz.rf.gd',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
    totalRequests++;
    if (req.path === '/') {
        const visitorIP = req.ip;
        if (!visitors.has(visitorIP)) {
            visitors.add(visitorIP);
            totalVisitors++;
        }
    }
    next();
});

app.get('/', (req, res) => {
    res.redirect('https://shannmoderz.rf.gd');
});

app.get('/stats', (req, res) => {
    res.json({
        status: true,
        code: 200,
        author: config.author,
        result: {
            totalRequests,
            totalVisitors
        }
    });
});

const requestan = (aiFunction) => async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).json({ status: false, code: 400, author: config.author, result: msg.query });
    }
    try {
        const result = await aiFunction(query);
        res.json({ status: true, code: 200, author: config.author, result: result });
    } catch (error) {
        res.status(500).json({ status: false, code: 500, author: config.author, result: msg.error });
    }
};

app.get('/ai/claude', requestan(thinkany));
app.get('/ai/goody', requestan(GoodyAI));
app.get('/ai/luminai', requestan(luminai));
app.get('/ai/blackbox', requestan(blackbox));
app.get('/ai/cgt', requestan(CgtAi));
app.get('/ai/simsimi', requestan(Simsimi));
app.get('/ai/lepton', requestan(leptonAi));
app.get('/ai/yousearch', requestan(yousearch));
app.get('/ai/letmegpt', requestan(LetmeGpt));
app.get('/ai/aoyo', requestan(AoyoAi));
app.get('/search/playstore', requestan(PlayStore));
app.get('./search/bukalapak', requestan(BukaLapak));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: false, code: 500, author: config.author, result: msg.error });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Author: ${config.author}`);
});