// const express=require("express");
// const {connectToMongoDB}=require("./connection");
// const urlRoute=require("./routes/url");
// const URL=require("./models/url");
// const app=express();
// const PORT=8001;
// connectToMongoDB('mongodb://localhost:27017/short-url')
// .then(()=>console.log("Mongoose connected"));
// app.use(express.json());
// app.use("/url",urlRoute);
// app.get('/:shortId',async (req,res)=>{
//    const shortId=req.params.shortId;
//     const entry= await URL.findOneAndUpdate({
//     shortId
//    },{
//      $push:{
//         visitHistory:{
//             timestamp:Date.now(),
//         }
//      }
//    })
//    res.redirect(entry.redirectURL)
// })
// app.listen(PORT,()=>console.log('Server started at PORT'+PORT));



const express = require("express");
const { connectToMongoDB } = require("./connection");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const shortid = require('shortid');
const cors = require('cors');

const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url')
    .then(() => console.log("Mongoose connected"));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/url", urlRoute);

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/url/shorten', async (req, res) => {
    const { originalUrl } = req.body;
    const shortId = shortid.generate();
    const shortUrl = `http://localhost:${PORT}/${shortId}`;
    
    await URL.create({
        shortId: shortId,
        redirectURL: originalUrl,
        visitHistory: [],
    });

    res.json({ shortUrl });
});

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                }
            }
        }
    );
    if (entry) {
        res.redirect(entry.redirectURL);
    } else {
        res.status(404).send('Short URL not found');
    }
});

app.listen(PORT, () => console.log('Server started at PORT ' + PORT));