const express = require('express')
const path = require('path')

const router = express.Router()

module.exports = ({BACKENDURL, FRONTENDURL}) => {
  // BACKENDURL/avatars
  router.get('/:name', (req, res, next) => {
    res.sendFile(path.resolve(__dirname, '../', 'Avatars', req.params.name))
  })

  return router
}
