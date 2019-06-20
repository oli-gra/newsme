// Import              <- BLOCK ->

// Import core packages
import React, { useState, useEffect } from 'react'
import { useRoutes, navigate } from 'hookrouter'
import axios from 'axios'

// Import firebase packages for auth & store
import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import config from '../config'

// Import test framework
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

//Import components
import AddNews from './AddNews'
import Navbar from './Navbar'
import News from './News'
import Profile from './Profile'
import Login from './Login'
import PostBox from './PostBox'
import PopMenu from './PopMenu'
import NotFoundPage from './NotFoundPage'

// Import style
import '../style/app.css'
import '../style/dark'

//  Servers                <- BLOCK ->
const actionCodeSettings = {
  handleCodeInApp: true,
  url: 'http://localhost:3000', // React app
}
// Init node server hookup
const url = 'http://localhost:3003' // Node server

// Init testing framework for TTD
Enzyme.configure({ adapter: new Adapter() })

// Init firebase
firebase.initializeApp(config.firebase)
const firebaseAppAuth = firebase.auth()
// const providers = { googleProvider: new firebase.auth.GoogleAuthProvider(), }

const App = ({ user, signOut }) => {

  const [news, setNews] = useState([])
  const [postbox, setPostbox] = useState(false)
  const [newsposts, setNewsposts] = useState(null)
  const [popmenu, setPopmenu] = useState(false)
  const [found, setFound] = useState([])

  const email = window.localStorage.getItem('emailForSignIn')

  useEffect(() => {
    if (user) {
      axios.get(url + '/news?uid=' + user.uid)
        .then(res => setNews(res.data))
    }
  }, [user])

  const getNews = () =>
    axios.get(url + '/news?uid=' + user.uid)
      .then(res => setNews(res.data))

  const postUser = puser => {
    if (!puser) {
      puser = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        location: ''
      }
    }
    axios.post(url + '/users', puser)
      .catch(err => console.log(err))
  }

  useEffect(() => {
    if (!email && firebase.auth().isSignInWithEmailLink(window.location.href)) {
      return navigate('/')
    }
    if (email && firebase.auth().signInWithEmailLink(email, window.location.href)
      .then(() => window.localStorage.removeItem('emailForSignIn'))
      .then(() => postUser())
      .then(() => navigate('/'))
      .catch(error => console.log(error))) {
    }
  }, [email])

  const getLikes = () =>
    axios.get(`${url}/likes?uid=${user.uid}`)


  // like news
  const updateNews = nid =>
    axios.patch(url + '/news?uid=' + user.uid + '&nid=' + nid)
      .then(res => {
        const likedNews = res.data.value
        setNews(news.map(n =>
          n._id === likedNews._id
            ? n = likedNews
            : n
        ))
      })
      .catch(err => console.log(err))


  const searchNews = search => {
    axios.get(url + `/search?q=${search}`)
      .then(res => setFound(res.data))
  }

  const postNews = news =>
    axios.post(url + '/news', news)
      .then(res => setNews([...news, res.data.ops[0]]))
      .catch(err => console.log(err))

  const postUrl = newsUrl =>
    axios.post(url + `/news/url?url=${newsUrl}&uid=${user.uid}`)
      .then(res => setNews([...news, res.data.ops[0]]))
      .catch(err => console.log(err))

  const getUsersNews = uid =>
    axios.get(url + '/news?uid=' + uid)
      .then(res => setFound(res.data))

  // Helpers       <- BLOCK ->

  const handleUrl = url => {
    postUrl(url)
    return navigate('/')
  }

  const handleFile = (file, title) => {
    const storageRef = firebase.storage().ref()
    const imageRef = storageRef.child(file.name)
    imageRef.put(file)
      .then(() => console.log(`✅ uploaded ${imageRef.fullPath}`))
      .then(() => storageRef.child(file.name).getDownloadURL())
      .then(url => postNews({
        title: title,
        image: url,
        uid: user.uid
      }))
    return navigate('/')
  }

  const handleLogin = email => {
    firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
      .then(() => window.localStorage.setItem('emailForSignIn', email))
      .then(() => navigate('/'))
      .catch(error => console.log(error))
  }

  const handlePostBox = newsId => {
    setNewsposts(newsId)
    return setPostbox(!postbox)
  }

  const handlePopMenu = () =>
    setPopmenu(!popmenu)

  // Render logic               <- BLOCK ->

  let postboxComponent
  let popmenuComponent
  let getlinkComponent
  let navbarComponent
  let routes
  let showNews

  if (postbox) {
    postboxComponent = <PostBox
      handlePostBox={handlePostBox}
      userId={user.uid}
      newsId={newsposts}
      getNews={getNews}
    />
  }
  if (popmenu) {
    popmenuComponent = <PopMenu
      handlePopMenu={handlePopMenu}
      signOut={signOut}
    />
  }

  found.length > 0 ? showNews = found : showNews = news

  // Routing               <- BLOCK ->

  if (user) {
    routes = {
      '/': () => <News
        getNews={getUsersNews}
        news={showNews}
        handlePostBox={handlePostBox}
        handleNewsLike={updateNews}
      />,
      '/login': () => <Login
        handleLogin={handleLogin}
      />,
      '/profile': () => <Profile
        postUser={postUser}
        fuser={user}
        getLikes={getLikes}
      />,
      '/new': () => <AddNews
        handleUrl={handleUrl}
        handleFile={handleFile}
      />
    }
    navbarComponent = <Navbar
      searchNews={searchNews}
      popmenu={handlePopMenu} />
  } else {
    routes = {
      '/': () => <Login
        handleLogin={handleLogin}
      />,
    }
  }

  const routeResult = useRoutes(routes)
  return (
    <>
      {getlinkComponent}
      {navbarComponent}
      {postboxComponent}
      {popmenuComponent}
      {routeResult || <NotFoundPage user={user} />}
    </>
  )
}

export default withFirebaseAuth({
  // providers,
  firebaseAppAuth,
})(App)