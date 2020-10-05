// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for cards
const Card = require('../models/card')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX '/cards'
router.get('/cards', requireToken, (req, res, next) => {
  Card.find()
    .then(cards => {
      return cards.map(card => card.toObject())
    })
    .then(cards => res.status(200).json({ cards: cards }))
    .catch(next)
})
// // INDEX '/cards/cosmetics'
// router.get('/cards/cosmetics', (req, res, next) => {
//   Card.find()
//     .then(cards => {
//       return cards.map(card => card.toObject())
//     })
//     .then(cards => res.status(200).json({ cards: cards }))
//     .catch(next)
// })
// // INDEX '/cards/wearables'
// router.get('/cards/wearables', (req, res, next) => {
//   Card.find()
//     .then(cards => {
//       return cards.map(card => card.toObject())
//     })
//     .then(cards => res.status(200).json({ cards: cards }))
//     .catch(next)
// })
// // INDEX '/cards/services'
// router.get('/cards/services', (req, res, next) => {
//   Card.find()
//     .then(cards => {
//       return cards.map(card => card.toObject())
//     })
//     .then(cards => res.status(200).json({ cards: cards }))
//     .catch(next)
// })

// SHOW /cards/:id
router.get('/cards/:id', requireToken, (req, res, next) => {
  Card.findById(req.params.id)
    .then(handle404)
    .then(card => res.status(200).json({ card: card.toObject() }))
    .catch(next)
})
// // SHOW /cards/cosmetics/:id
// router.get('/cards/cosmetics/:id', (req, res, next) => {
//   Card.findById(req.params.id)
//     .then(handle404)
//     .then(card => res.status(200).json({ card: card.toObject() }))
//     .catch(next)
// })
// // SHOW /cards/wearables/:id
// router.get('/cards/wearables/:id', (req, res, next) => {
//   Card.findById(req.params.id)
//     .then(handle404)
//     .then(card => res.status(200).json({ card: card.toObject() }))
//     .catch(next)
// })
// // SHOW /cards/services/:id
// router.get('/cards/services/:id', (req, res, next) => {
//   Card.findById(req.params.id)
//     .then(handle404)
//     .then(card => res.status(200).json({ card: card.toObject() }))
//     .catch(next)
// })

// POST /cards-create
router.post('/cards-create', requireToken, (req, res, next) => {
  // set owner of new card to be current user
  req.body.card.owner = req.user.id

  Card.create(req.body.card)
    // respond to succesful `create` with status 201 and JSON of new "card"
    .then(card => {
      res.status(201).json({ card: card.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// PATCH /cards/:id
router.patch('/cards/:id/update', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.card.owner

  Card.findById(req.params.id)
    .then(handle404)
    .then(card => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, card)

      // pass the result of Mongoose's `.update` to the next `.then`
      return card.updateOne(req.body.card)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// // PATCH /cards/cosmetics/:id
// router.patch('/cards/cosmetics/:id', requireToken, removeBlanks, (req, res, next) => {
//   // if the client attempts to change the `owner` property by including a new
//   // owner, prevent that by deleting that key/value pair
//   delete req.body.card.owner
//
//   Card.findById(req.params.id)
//     .then(handle404)
//     .then(card => {
//       // pass the `req` object and the Mongoose record to `requireOwnership`
//       // it will throw an error if the current user isn't the owner
//       requireOwnership(req, card)
//
//       // pass the result of Mongoose's `.update` to the next `.then`
//       return card.updateOne(req.body.card)
//     })
//     // if that succeeded, return 204 and no JSON
//     .then(() => res.sendStatus(204))
//     // if an error occurs, pass it to the handler
//     .catch(next)
// })
//
// // PATCH /cards/wearables/:id
// router.patch('/cards/wearables/:id', requireToken, removeBlanks, (req, res, next) => {
//   // if the client attempts to change the `owner` property by including a new
//   // owner, prevent that by deleting that key/value pair
//   delete req.body.card.owner
//
//   Card.findById(req.params.id)
//     .then(handle404)
//     .then(card => {
//       // pass the `req` object and the Mongoose record to `requireOwnership`
//       // it will throw an error if the current user isn't the owner
//       requireOwnership(req, card)
//
//       // pass the result of Mongoose's `.update` to the next `.then`
//       return card.updateOne(req.body.card)
//     })
//     // if that succeeded, return 204 and no JSON
//     .then(() => res.sendStatus(204))
//     // if an error occurs, pass it to the handler
//     .catch(next)
// })
//
// // PATCH /cards/services/:id
// router.patch('/cards/services/:id', requireToken, removeBlanks, (req, res, next) => {
//   // if the client attempts to change the `owner` property by including a new
//   // owner, prevent that by deleting that key/value pair
//   delete req.body.card.owner
//
//   Card.findById(req.params.id)
//     .then(handle404)
//     .then(card => {
//       // pass the `req` object and the Mongoose record to `requireOwnership`
//       // it will throw an error if the current user isn't the owner
//       requireOwnership(req, card)
//
//       // pass the result of Mongoose's `.update` to the next `.then`
//       return card.updateOne(req.body.card)
//     })
//     // if that succeeded, return 204 and no JSON
//     .then(() => res.sendStatus(204))
//     // if an error occurs, pass it to the handler
//     .catch(next)
// })

// DELETE /cards/:id
router.delete('/cards/:id', requireToken, (req, res, next) => {
  Card.findById(req.params.id)
    .then(handle404)
    .then(card => {
      // throw an error if current user doesn't own `card`
      requireOwnership(req, card)
      // delete the card ONLY IF the above didn't throw
      card.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// // DELETE /cards/cosmetics/:id
// router.delete('/cards/cosmetics/:id', requireToken, (req, res, next) => {
//   Card.findById(req.params.id)
//     .then(handle404)
//     .then(card => {
//       // throw an error if current user doesn't own `card`
//       requireOwnership(req, card)
//       // delete the card ONLY IF the above didn't throw
//       card.deleteOne()
//     })
//     // send back 204 and no content if the deletion succeeded
//     .then(() => res.sendStatus(204))
//     // if an error occurs, pass it to the handler
//     .catch(next)
// })
//
// // DELETE /cards/wearables/:id
// router.delete('/cards/wearables/:id', requireToken, (req, res, next) => {
//   Card.findById(req.params.id)
//     .then(handle404)
//     .then(card => {
//       // throw an error if current user doesn't own `card`
//       requireOwnership(req, card)
//       // delete the card ONLY IF the above didn't throw
//       card.deleteOne()
//     })
//     // send back 204 and no content if the deletion succeeded
//     .then(() => res.sendStatus(204))
//     // if an error occurs, pass it to the handler
//     .catch(next)
// })
//
// // DELETE /cards/services/:id
// router.delete('/cards/services/:id', requireToken, (req, res, next) => {
//   Card.findById(req.params.id)
//     .then(handle404)
//     .then(card => {
//       // throw an error if current user doesn't own `card`
//       requireOwnership(req, card)
//       // delete the card ONLY IF the above didn't throw
//       card.deleteOne()
//     })
//     // send back 204 and no content if the deletion succeeded
//     .then(() => res.sendStatus(204))
//     // if an error occurs, pass it to the handler
//     .catch(next)
// })

module.exports = router
