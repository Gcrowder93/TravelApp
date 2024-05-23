const { Router } = require('express');
const Lodging = require('../models/Lodging');

// All of these routes should be protected
module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const hotel = await Lodging.insert(req.body);
      res.send(hotel);
    } catch (error) {
      next(error);
    }
  })
  .get('/:id', async (req, res, next) => {
    try {
      const hotel = await Lodging.getHotelById(req.params.id, req.body);
      res.send(hotel);
    } catch (error) {
      next(error);
    }
  })
  .patch('/:id', async (req, res, next) => {
    try {
      const hotel = await Lodging.updateHotelById(req.params.id, req.body);
      res.send(hotel);
    } catch (error) {
      next(error);
    }
  })
  .delete('/:id', async (req, res, next) => {
    try {
      const lodging = await Lodging.deleteById(req.params.id);
      res.send(lodging);
    } catch (error) {
      next(error);
    }
  });
