import express from 'express'
import dotnev from 'dotenv'
import webpack from 'webpack'
import helmer from 'helmet'
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { renderRoutes } from 'react-router-config'
import { StaticRouter } from 'react-router-dom'
import cookieParser from 'cookie-parser'
import boom from '@hapi/boom'
import passport from 'passport'
import axios from 'axios'
import serverRoutes from '../frontend/routes/serverRouter'
import reducer from '../frontend/reducers';
//import Layout from '../frontend/components/Layout'
//import initialState from '../frontend/initialState';
import getManifest from './getManifest';

dotnev.config();

const { ENV, PORT } = process.env
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())

require('./util/auth/strategies/basic')

if (ENV === 'development') {
  console.log('Development config')
  const webpackConfig = require('../../webpack.config')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const compiler = webpack(webpackConfig)
  const serverConfig = { port: PORT, hot: true }

  app.use(webpackDevMiddleware(compiler, serverConfig))
  app.use(webpackHotMiddleware(compiler))
} else {
  app.use((req, res, next) => {
    if (!req.hashManifest) req.hashManifest = getManifest();
    next();
  })
  app.use(express.static(`${__dirname}/public`))
  app.use(helmer())
  app.use(helmer.permittedCrossDomainPolicies())
  app.disable('x-powered-by')
}

const setResponse = (html, preloadedState, manifest) => {
  const mainStyles = manifest ? manifest['main.css'] : 'assets/app.css';
  const mainBuild = manifest ? manifest['main.js'] : 'assets/app.js';
  const vendorBuild = manifest ? manifest['vendors.js'] : 'assets/vendor.js';
  return (`<!DOCTYPE html><html>
  <head>
    <meta charset="UTF-8">
    <title>Plazi Video</title>
    <link rel="stylesheet" href="${mainStyles}" type="text/css">
  </head>
  <body>
      <div id="app">${html}</div>
      <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
      </script>
      <script src="${mainBuild}" type="text/javascript"></script>
      <script src="${vendorBuild}" type="text/javascript"></script>
  </body>
  </html>`)
}

const renderApp = (req, res) => {

  let initialState;
  const { email, name, id } = req.cookies

  if (id) {
    initialState = {
      user: {
        email, name, id
      },
      myList: [],
      trends: [
        {
          'id': 2,
          'slug': 'tvshow-2',
          'title': 'In the Dark',
          'type': 'Scripted',
          'language': 'English',
          'year': 2009,
          'contentRating': '16+',
          'duration': 164,
          'cover': 'http://dummyimage.com/800x600.png/99118E/ffffff',
          'description': 'Vestibulum ac est lacinia nisi venenatis tristique',
          'source': 'https://mdstrm.com/video/58333e214ad055d208427db5.mp4'
        },
        {
          'id': 3,
          'slug': 'tvshow-3',
          'title': 'Instinct',
          'type': 'Adventure',
          'language': 'English',
          'year': 2002,
          'contentRating': '16+',
          'duration': 137,
          'cover': 'http://dummyimage.com/800x600.png/302140/ffffff',
          'description': 'Vestibulum ac est lacinia nisi venenatis tristique',
          'source': 'https://mdstrm.com/video/58333e214ad055d208427db5.mp4'
        },
        {
          'id': 4,
          'slug': 'tvshow-4',
          'title': 'Grand Hotel',
          'type': 'Comedy',
          'language': 'English',
          'year': 2014,
          'contentRating': '16+',
          'duration': 163,
          'cover': 'http://dummyimage.com/800x600.png/5472FF/ffffff',
          'description': 'Vestibulum ac est lacinia nisi venenatis tristique',
          'source': 'https://mdstrm.com/video/58333e214ad055d208427db5.mp4'
        },
        {
          'id': 5,
          'slug': 'tvshow-5',
          'title': 'Stargate Atlantis',
          'type': 'Scripted',
          'language': 'English',
          'year': 2014,
          'contentRating': '16+',
          'duration': 194,
          'cover': 'http://dummyimage.com/800x600.png/B36F20/ffffff',
          'description': 'Vestibulum ac est lacinia nisi venenatis tristique',
          'source': 'https://mdstrm.com/video/58333e214ad055d208427db5.mp4'
        },
        {
          'id': 6,
          'slug': 'tvshow-6',
          'title': 'Final Space',
          'type': 'Scripted',
          'language': 'English',
          'year': 2017,
          'contentRating': '16+',
          'duration': 124,
          'cover': 'http://dummyimage.com/800x600.png/CCC539/ffffff',
          'description': 'Vestibulum ac est lacinia nisi venenatis tristique',
          'source': 'https://mdstrm.com/video/58333e214ad055d208427db5.mp4'
        },
        {
          'id': 7,
          'slug': 'tvshow-7',
          'title': 'The InBetween',
          'type': 'Drama',
          'language': 'English',
          'year': 2011,
          'contentRating': '16+',
          'duration': 179,
          'cover': 'http://dummyimage.com/800x600.png/FF7A90/ffffff',
          'description': 'Vestibulum ac est lacinia nisi venenatis tristique',
          'source': 'https://mdstrm.com/video/58333e214ad055d208427db5.mp4'
        }
      ],
      originals: [
        {
          'id': 8,
          'slug': 'tvshow-8',
          'title': 'Stargate Atlantis',
          'type': 'Action',
          'language': 'English',
          'year': 2012,
          'contentRating': '16+',
          'duration': 148,
          'cover': 'http://dummyimage.com/800x600.png/306880/ffffff',
          'description': 'Vestibulum ac est lacinia nisi venenatis tristique',
          'source': 'https://mdstrm.com/video/58333e214ad055d208427db5.mp4'
        },
        {
          'id': 9,
          'slug': 'tvshow-9',
          'title': 'Alien Highway',
          'type': 'Action',
          'language': 'English',
          'year': 2019,
          'contentRating': '16+',
          'duration': 128,
          'cover': 'http://dummyimage.com/800x600.png/604180/ffffff',
          'description': 'Vestibulum ac est lacinia nisi venenatis tristique',
          'source': 'https://mdstrm.com/video/58333e214ad055d208427db5.mp4'
        },
        {
          'id': 10,
          'slug': 'tvshow-10',
          'title': 'Elementary',
          'type': 'Animation',
          'language': 'English',
          'year': 2011,
          'contentRating': '16+',
          'duration': 346,
          'cover': 'http://dummyimage.com/800x600.png/FF91BA/ffffff',
          'description': 'Vestibulum ac est lacinia nisi venenatis tristique',
          'source': 'https://mdstrm.com/video/58333e214ad055d208427db5.mp4'
        },
        {
          'id': 11,
          'slug': 'tvshow-11',
          'title': 'Strange Angel',
          'type': 'War',
          'language': 'English',
          'year': 2015,
          'contentRating': '16+',
          'duration': 226,
          'cover': 'http://dummyimage.com/800x600.png/45807C/ffffff',
          'description': 'Vestibulum ac est lacinia nisi venenatis tristique',
          'source': 'https://mdstrm.com/video/58333e214ad055d208427db5.mp4'
        },
        {
          'id': 12,
          'slug': 'tvshow-12',
          'title': 'Private Eyes',
          'type': 'Comedy',
          'language': 'English',
          'year': 2018,
          'contentRating': '16+',
          'duration': 190,
          'cover': 'http://dummyimage.com/800x600.png/577380/ffffff',
          'description': 'Vestibulum ac est lacinia nisi venenatis tristique',
          'source': 'https://mdstrm.com/video/58333e214ad055d208427db5.mp4'
        },
        {
          'id': 13,
          'slug': 'tvshow-13',
          'title': 'NCIS: Los Angeles',
          'type': 'Drama',
          'language': 'English',
          'year': 2010,
          'contentRating': '16+',
          'duration': 160,
          'cover': 'http://dummyimage.com/800x600.png/5472FF/ffffff',
          'description': 'Vestibulum ac est lacinia nisi venenatis tristique',
          'source': 'https://mdstrm.com/video/58333e214ad055d208427db5.mp4'
        }
      ]
    }
  } else {
    initialState = {
      user: {},
      myList: [],
      trends: [],
      originals: []
    }
  }

  const store = createStore(reducer, initialState);
  const preloadedState = store.getState()
  const isLogged = (initialState.user.id)
  const html = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={{}}>
        {renderRoutes(serverRoutes(isLogged))}
      </StaticRouter>
    </Provider>
  )
  res.send(setResponse(html, preloadedState, req.hashManifest))
}

app.post('/auth/sign-in', async function (req, res, next) {
  //const { rememberMe } = req.body
  passport.authenticate('basic', function (error, data) {

    try {
      if (error || !data) {
        next(boom.unauthorized())
      }

      req.login(data, { session: false }, async function (error) {
        if (error) {
          next(error)
        }

        const { token, ...user } = data
        res.cookie('token', token, {
          httpOnly: !(ENV === 'development'),
          secure: !(ENV === 'development'),
          //maxAge: rememberMe ? THIRTY_DAYS_IN_SEC : TWO_HOURS_IN_SEC
        })

        res.status(200).json(user)
      })

    } catch (error) {
      next(error)
    }
  })(req, res, next);
})

app.post('/auth/sign-up', async function (req, res, next) {
  const { body: user } = req;

  try {
    const userData = await axios({
      url: `${process.env.API_URL}/api/auth/sign-up`,
      method: 'post',
      data: {
        'email': user.email,
        'name': user.name,
        'password': user.password
      }
    })

    res.status(201).json({
      name: req.body.name,
      email: req.body.email,
      id: userData.data.id
    })
  } catch (error) {
    next(error)
  }

})

app.get('*', renderApp);

app.listen(PORT, (err) => {
  if (err) console.log(err)
  else console.log(`Server running on port ${PORT}`)
})
