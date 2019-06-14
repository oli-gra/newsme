// load server modules
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const assert = require('assert')
const { MongoClient, ObjectId } = require('mongodb')

// server settings
const app = express()
const uri = require('../secrets')
// const routes = express.Router()
const PORT = 3003
const url = uri
const dbName = 'newsme'
const client = new MongoClient(url, { useNewUrlParser: true })

const insertNews = function (db, news, callback) {
   const collection = db.collection('news')
   collection.insertOne({
      uid: news.uid,
      title: news.title,
      description: news.description,
      image: news.image,
      date: new Date,
      likes: [],
      posts: [],
   }, function (err, result) {
      assert.equal(err, null)
      callback(result)
   })
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
         // let collection = db.collection('news')
         // collection.updateOne(
         //    { _id: result.ops[0]._id },
         //    { $push: { posts: result.id } },
         //    function (err, result) {
         //       assert.equal(err, null)
         //       assert.equal(1, result.result.posts)
         //
         //    })
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
   collection.find({ uid: user.uid }).toArray(function (err, docs) {
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

   // routes                   <- BLOCK ->

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