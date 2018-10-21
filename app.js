const express = require('express');
const PORT = process.env.PORT || 3128 ;
const cache = require('memory-cache');
const app = express();

const scraper = require('./scraper.js')


let memCache = new cache.Cache();
let cacheMiddleware = (duration) => {
    return (req, res, next) => {
        let key =  '__express__' + req.originalUrl || req.url
        let cacheContent = memCache.get(key);
        if(cacheContent){
            res.send( cacheContent );
            return
        }else{
            res.sendResponse = res.send
            res.send = (body) => {
                memCache.put(key,body,duration*1000);
                res.sendResponse(body)
            }
            next()
        }
    }
}

app.get('/company/:ticker', cacheMiddleware(300), function(req, res){
    res.json(scraper.getLinks(req.params.ticker).map(scraper.getArticle))
});


app.listen(PORT, function(){
    console.log(`App running on port ${PORT}`);
});

