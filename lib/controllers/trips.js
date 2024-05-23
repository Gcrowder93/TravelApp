const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Trip = require('../models/Trip');

module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
    try {
      const trip = await Trip.insert(req.body);
      res.send(trip);
    } catch (error) {
      next(error);
    }
  })
  .get('/', authenticate, async (req, res, next) => {
    try {
      const trips = await Trip.getTrips();
      res.send(trips);
    } catch (error) {
      next(error);
    }
  })

  .get('/:id', async (req, res) => {
    const trip = await Trip.getById(req.params.id);
    await Promise.all([
      trip.getFlights(),
      trip.getGroup(),
      trip.getLodging(),
    ])
    res.send(trip);
  })

  .delete('/:id', async (req, res) => {
    const trip = await Trip.deleteById(req.params.id);
    res.send(trip);
  })

  .patch('/:id', async (req, res) => {
    const trip = await Trip.updateById(req.params.id, req.body);
    res.send(trip);
  });
