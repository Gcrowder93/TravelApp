const fetch = require('cross-fetch');

module.exports = class YelpService {
  static async getYelp(location) {
    try {
      const resp = await fetch(
        `https://api.yelp.com/v3/businesses/search?location=${location}&limit=3`,
        {
          headers: {
            Authorization: `Bearer ${process.env.YELP_API}`,
          },
        }
      );

      const data = await resp.json();

      return { statusCode: 200, body: data };
    } catch (error) {
      error.statusCode = 500;
      error.message = 'Yelp API not working';
      throw error;
    }
    // getYelp will need to take in a city (city be a query param in our route)
  }
};
