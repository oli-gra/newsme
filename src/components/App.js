// Import              <- BLOCK ->

// Import core packages
import React, { useState, useEffect } from 'react'
import { useRoutes, navigate } from 'hookrouter'
import axios from 'axios'

// Import firebase packages for auth & store
import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app'
import 'firebase/auth'
// import "firebase/firestore"
import 'firebase/storage'
import firebaseConfig from '../firebaseConfig'

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
import '../style/darkmode'

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
firebase.initializeApp(firebaseConfig)
const firebaseAppAuth = firebase.auth()
// const providers = { googleProvider: new firebase.auth.GoogleAuthProvider(), }

const App = ({ user, signOut }) => {

  const [news, setNews] = useState([])
  const [postbox, setPostbox] = useState(false)
  const [newsposts, setNewsposts] = useState(null)
  const [popmenu, setPopmenu] = useState(false)
  const [fetched, setFetched] = useState(false)

  useEffect(() => {
    const email = window.localStorage.getItem('emailForSignIn')
    if (!email && firebase.auth().isSignInWithEmailLink(window.location.href)) {
      return navigate('/login')
    }
    if (email && firebase.auth().signInWithEmailLink(email, window.location.href)
      .then(() => window.localStorage.removeItem('emailForSignIn'))
      .then(() => postUser())
      .catch(error => console.log(error))) {
      return navigate('/')
    }
    if (user && !fetched) {
      setFetched(true)
      getNews()
    }
  })

  // API                  <- BLOCK ->

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
    axios.post(url + '/users', puser).catch(err => console.log(err))
  }

  // like news
  const updateNews = nid => {
    let uid = user.uid
    axios.patch(url + '/news?uid=' + uid + '&nid=' + nid)
      .catch(err => console.log(err))
  }

  const postNews = news =>
    axios.post(url + '/news', news)
      .then(res => setNews([...news, res.data.ops[0]]))
      .catch(err => console.log(err))


  const getNews = () =>
    axios.get(url + '/news?uid=' + user.uid)
      .then(res => setNews(res.data))

  // Helpers       <- BLOCK ->

  const handleNews = news => {
    news.uid = user.uid
    postNews(news)
    return navigate('/')
  }

  const handleFile = (file, headline) => {
    const storageRef = firebase.storage().ref()
    const imageRef = storageRef.child(file.name)
    imageRef.put(file)
      .then(() => console.log(`✅ uploaded ${imageRef.fullPath}`))
      .then(() => storageRef.child(file.name).getDownloadURL()
        .then(url => {
          let news = {
            title: headline,
            image: url,
            uid: user.uid
          }
          postNews(news)
        }))
    return navigate('/')
  }

  const handleLogin = email => {
    firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
      .then(() => window.localStorage.setItem('emailForSignIn', email))
      .catch(error => console.log(error))
    return navigate('/')
  }

  const handlePostBox = newsId => {
    setNewsposts(newsId)
    return setPostbox(!postbox)
  }

  const handlePopMenu = () =>
    setPopmenu(!popmenu)


  // Render                <- BLOCK ->

  let postboxComponent
  let popmenuComponent
  if (postbox) {
    postboxComponent = <PostBox
      handlePostBox={handlePostBox}
      userId={user.uid}
      newsId={newsposts}
    />
  }
  if (popmenu) {
    popmenuComponent = <PopMenu
      handlePopMenu={handlePopMenu}
    />
  }

  let routes
  user ? routes = {
    '/': () => <News
      news={news}
      handlePostBox={handlePostBox}
      handleNewsLike={updateNews}
    />,
    '/login': () => <Login
      handleLogin={handleLogin}
    />,
    '/profile': () => <Profile
      postUser={postUser}
      fuser={user}
      signOut={signOut}
    />,
    '/new': () => <AddNews
      handleNews={handleNews}
      handleFile={handleFile}
    />
  } : routes = {
    '/login': () => <Login
      handleLogin={handleLogin}
    />
  }
  const routeResult = useRoutes(routes)
  return (
    <>
      <Navbar popmenu={handlePopMenu} />
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