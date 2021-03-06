// load server modules
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const assert = require('assert')
const { MongoClient, ObjectId } = require('mongodb')
const axios = require('axios')
const path = require("path")
require("dotenv").config()

// load Aylien concept extraction NLP
const AYLIENTextAPI = require('aylien_textapi')
const tag = new AYLIENTextAPI({
   application_id: process.env.aylienId || '3f8986e2',
   application_key: process.env.aylienKey || '38fad21cfc8214953f171446db384f60'
})

// server settings
const app = express()
// in charge of sending static files requests to the client
app.use(express.static(path.join(__dirname, "client", "build")))


const PORT = process.env.PORT || 3003
const dbName = 'newsme'
const client = new MongoClient(process.env.uri || 'mongodb+srv://admin:nagMf1981@cluster0-exit3.mongodb.net/newsme?retryWrites=true&w=majority',
   { useNewUrlParser: true })

const getTags = (text) => {
   return new Promise((resolve, reject) =>
      tag.concepts({
         'text': text
      }, function (err, res) {
         if (!err) {
            const concepts = res.concepts
            const keys = Object.keys(concepts)
            resolve(keys.map(key => concepts[key].surfaceForms[0].string))
         } else {
            reject(err)
         }
      })
   )
}

const getUrl = (newsUrl, callback) => {
   const api = process.env.linkpreview || '5cf66e9a3ee398f1413c110295f3ea61b667558c6f9b8'
   const url = `http://api.linkpreview.net/?key=${api}&q=${newsUrl}`
   axios.get(url).then(res => callback(res.data))

}

const insertTags = (db, uid, tags) => {
   const users = db.collection('users')
   users.updateOne(
      { uid: uid },
      {
         $push: { tags: { $each: tags } }
      },
      { upsert: true }
   )
}

const insertFollow = (db, uid, fid) => {
   const users = db.collection('users')
   users.updateOne(
      { uid: uid },
      {
         $push: { follow: fid }
      },
      { upsert: true }
   )
}

const insertNews = function (db, news, callback) {
   const collection = db.collection('news')
   getTags(news.title)
      .then(data => {
         insertTags(db, news.uid, data)
         collection.insertOne({
            uid: news.uid,
            title: news.title,
            description: news.description,
            image: news.image,
            url: news.url,
            date: new Date,
            likes: [],
            posts: [],
            tags: data
         }, function (err, result) {
            assert.equal(err, null)
            callback(result)
         })
      })
}

const insertUser = function (db, user, callback) {
   const collection = db.collection('users')
   console.log(user)
   collection.updateOne(
      { uid: user.uid },
      {
         $set: {
            displayName: user.displayName,
            email: user.email,
            photoUrl: user.photoUrl,
            location: user.location,
            follow: [],
         }
      },
      { upsert: true },
      function (err, result) {
         assert.equal(err, null)
         callback(result)
      }
   )
}

const insertPost = function (db, post, callback) {
   let collection = db.collection('posts')
   collection.insertOne(
      {
         nid: post.nid,
         uid: post.uid,
         content: post.content,
         date: new Date,
         likes: []
      }, function (err, result) {
         assert.equal(err, null)
         callback(result)
      }
   )
}

const removeDocument = function (db, callback) {
   const collection = db.collection('news');
   collection.deleteMany({ title: '' }, function (err, result) {
      assert.equal(err, null);
      callback(result);
   });
}

const likeNews = function (db, uid, nid, callback) {
   const collection = db.collection('news')
   collection.findOneAndUpdate(
      { _id: ObjectId(nid) },
      { $addToSet: { likes: uid } },
      { returnOriginal: false },
      function (err, result) {
         assert.equal(err, null)
         insertTags(db, uid, result.value.tags)
         callback(result)
      }
   )
}

const likePost = function (db, pid, uid, callback) {
   const collection = db.collection('posts')
   collection.findOneAndUpdate(
      { _id: ObjectId(pid) },
      { $addToSet: { likes: uid } },
      { returnOriginal: false },
      function (err, result) {
         assert.equal(err, null)
         callback(result)
      }
   )
}

const findNews = function (db, user, callback) {
   const collection = db.collection('news')
   collection.find({
      $or: [
         { uid: user.uid },
         { likes: `${user.uid}` }
      ]
   })
      .toArray(function (err, docs) {
         assert.equal(err, null)
         callback(docs)
      })
}

const searchNews = function (db, search, callback) {
   const news = db.collection('news')
   news.find({ $text: { $search: search } })
      .toArray(function (err, docs) {
         assert.equal(err, null)
         callback(docs)
      })
}

const countNewsLikes = function (db, uid, callback) {
   const news = db.collection('news')
   news.aggregate([
      {
         $match: { uid: uid },
      },
      {
         $project: {
            item: 1,
            likes: { $cond: { if: { $isArray: "$likes" }, then: { $size: "$likes" }, else: null } }
         }
      }
   ]).toArray(function (err, docs) {
      assert.equal(err, null)
      callback(docs.map(doc => doc.likes).reduce((a, b) => a + b))
   })
}

const countPostLikes = function (db, uid, likes, callback) {
   const posts = db.collection('posts')
   posts.aggregate([
      {
         $match: { uid: uid },
      },
      {
         $project: {
            item: 1,
            likes: { $cond: { if: { $isArray: "$likes" }, then: { $size: "$likes" }, else: null } }
         }
      }
   ]).toArray(function (err, docs) {
      assert.equal(err, null)
      docs.length > 0
         ? callback(docs.map(doc => doc.likes).reduce((a, b) => a + b))
         : callback(0)
   })
}

const countFollows = function (db, uid, callback) {
   const users = db.collection('users')
   users.find({
      $or: [
         { follow: `${uid}` }
      ]
   }).toArray(function (err, docs) {
      assert.equal(err, null)
      callback(docs)
   })
}

const findUser = function (db, uid, callback) {
   const collection = db.collection('users')
   collection.findOne({ uid: uid }, function (err, doc) {
      assert.equal(err, null)
      callback(doc)
   })
}

const findPosts = function (db, news, callback) {
   const collection = db.collection('posts')
   collection.find({ nid: news.nid }).toArray(function (err, docs) {
      assert.equal(err, null)
      callback(docs)
   })
}

// Hook up to server
client.connect(err => {
   assert.equal(null, err)
   console.log(`✅ hooked up to ${dbName} database`)

   const db = client.db(dbName)
   app.use(cors())
   app.use(bodyParser.json())

   // indicies                 <- BLOCK ->
   const news = db.collection('news')
   news.createIndex(
      {
         title: "text",
         tags: "text"
      })

   // routes                   <- BLOCK ->

   app.get('/search', (req, res) => {
      searchNews(db, req.query.q, found => {
         if (found) {
            res.status(200)
            res.send(found)
         } else { res.sendStatus(404) }

      })
   })

   app.post('/users', (req, res) => {
      insertUser(db, req.body, user => {
         res.status(200)
         res.send(user)
      })
   })

   app.post('/posts/new', (req, res) => {
      insertPost(db, req.body, post => {
         res.status(200)
         res.send(post)
      })
   })

   app.get('/posts', (req, res) => {
      findPosts(db, req.query, posts => {
         if (posts === null) {
            res.sendStatus(404)
         } else {
            res.status(200)
            res.send(posts)
         }
      })
   })

   app.get('/news', (req, res) => {
      findNews(db, req.query, news => {
         res.status(200)
         res.send(news)
      })
   })

   app.patch('/posts', (req, res) => {
      likePost(db, req.query.pid, req.query.uid, post => {
         res.status(200)
         res.send(post)
      })
   })

   app.post('/news/url', (req, res) => {
      getUrl(req.query.url, news => {
         news.uid = req.query.uid
         insertNews(db, news, done => {
            res.status(200)
            res.send(done)
         })
      })
   })

   app.post('/news', (req, res) => {
      insertNews(db, req.body, news => {
         res.status(200)
         res.send(news)
      })
   })

   app.patch('/news', (req, res) => {
      likeNews(db, req.query.uid, req.query.nid, news => {
         res.status(200)
         res.send(news)
      })
   })

   app.get('/user', (req, res) => {
      findUser(db, req.query.uid, user => {
         res.status(200)
         res.send(user)
      })
   })

   app.delete('/news', (req, res) => {
      removeDocument(db, news => {
         res.status(200)
         res.send(news)
      })
   })

   app.get('/likes', (req, res) => {
      countNewsLikes(db, req.query.uid, newslikes => {
         countPostLikes(db, req.query.uid, newslikes, postlikes => {
            res.status(200)
            res.send({ "likes": `${newslikes + postlikes}` })
         })
      })
   })

   app.get('/follows', (req, res) => {
      countFollows(db, req.query.uid, follows => {
         res.send({ "follows": `${follows.length}` })
         res.status(200)
      })
   })

   app.get('/blasts', (req, res) => {
      findNews(db, req.query, news => {
         res.send({ "blasts": `${news.length}` })
         res.status(200)
      })
   })

   app.post('/follows', (req, res) => {
      insertFollow(db, req.query.uid, req.query.fid)
      res.status(200)
   })

   app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "client", "build", "index.html"));
   })
   app.listen(PORT, () => {
      console.log(`✅ server is on port ${PORT} `)
   })
})