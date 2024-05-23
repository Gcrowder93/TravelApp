const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const GitHubService = require('../services/GitHubService');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const IS_DEPLOYED = process.env.NODE_ENV === 'production';

module.exports = Router()
  .get('/login', async (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`
    );
  })
  .get('/login/callback', async (req, res, next) => {
    try {
      const { code } = req.query;
      const payload = await GitHubService.signIn(code);

      res
        .cookie(process.env.COOKIE_NAME, payload, {
          httpOnly: true,
          secure: IS_DEPLOYED,
          sameSite: IS_DEPLOYED ? 'none' : 'strict',
          maxAge: ONE_DAY_IN_MS,
        })
        // Probably better to end this request with `.send` than to redirect again.
        // Let the client determine where to go next.
        .redirect(
          process.env.NODE_ENV === 'test'
            ? '/api/v1/trips'
            : `${process.env.FRONT_END}/trips`
        );
    } catch (error) {
      next(error);
    }
  })
  .get('/me', authenticate, async (req, res) => {
    res.send(req.user);
  })
  .delete('/login', (req, res) => {
    res
      // You should normally pass in the same options that were used to create the cookie here: 
      .clearCookie(process.env.COOKIE_NAME, {
        httpOnly: true,
        secure: IS_DEPLOYED,
        sameSite: IS_DEPLOYED ? 'none' : 'strict',
        maxAge: ONE_DAY_IN_MS,
      })
      .json({ success: true, message: 'Successfully signed out' });
  });
