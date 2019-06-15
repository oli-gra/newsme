// load server modules
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const assert = require('assert')
const { MongoClient, ObjectId } = require('mongodb')
const axios = require('axios')

// load Aylien concept extraction NLP
const secrets = require('../secrets')
const AYLIENTextAPI = require('aylien_textapi')
const tag = new AYLIENTextAPI({
   application_id: secrets.aylienId,
   application_key: secrets.aylienKey
})

// server settings
const app = express()
const PORT = 3003
const url = secrets.uri
const dbName = 'newsme'
const client = new MongoClient(url, { useNewUrlParser: true })

const flattenObj = obj =>
   Object.assign(
      {},
      ...function _flatten(o) {
         return [].concat(...Object.keys(o)
            .map(k =>
               typeof o[k] === 'object' ?
                  _flatten(o[k]) :
                  ({ [k]: o[k] })
            )
         );
      }(obj)
   )

const getTags = (text, callback) =>
   tag.concepts({
      'text': text
   }, function (err, res) {
      if (err === null) {
         callback(flattenObj(res.string))
      }
   })

const getUrl = (newsUrl, callback) => {
   const api = secrets.linkpreview
   const url = `http://api.linkpreview.net/?key=${api}&q=${newsUrl}`
   axios.get(url).then(res => callback(res.data))

}

const insertNews = function (db, news, callback) {
   const collection = db.collection('news')
   console.log(getTags(news.title))
   collection.insertOne({
      uid: news.uid,
      title: news.title,
      description: news.description,
      image: news.image,
      url: news.url,
      date: new Date,
      likes: [],
      posts: [],
      tags: []
   }, function (err, result) {
      assert.equal(err, null)
      callback(result)
   })
}

function newsTitleIndex(db, callback) {
   const collection = db.collection('news')
   collection.createIndex(
      { title: "text" }, function (err, result) {
         callback(result)
      }
   )
}

const insertUser = function (db, user, callback) {
   const collection = db.collection('users')
   collection.updateOne(
      { uid: user.uid },
      {
         $set: {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            location: user.location
         }
      },
      { upsert: true },
      function (err, result) {
         console.log(result)
         assert.equal(err, null)
         callback(result)
      }
   )
}

const insertPost = function (db, post, callback) {
   // Get the documents collection
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
         callback(result)
      }
   )
}

const findNews = function (db, user, callback) {
   const collection = db.collection('news')
   collection.find({ uid: user.uid })
      .toArray(function (err, docs) {
         assert.equal(err, null)
         callback(docs)
      })
}

const searchNews = function (db, search, callback) {
   const news = db.collection('news')
   news.find({ '$text': { '$search': search } })
      .toArray(function (err, docs) {
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
   newsTitleIndex(db, function (res) {
      console.log(`✅ news title index ${res}`)
   })

   // routes                   <- BLOCK ->

   app.get('/search', (req, res) => {
      searchNews(db, req.query.q, found => {
         if (found) {
            res.status(200)
            res.send(found)
         } else { res.status(404) }

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
            res.status(404)
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

   app.listen(PORT, () => {
      console.log(`✅ server is on port ${PORT} `)
   })
})