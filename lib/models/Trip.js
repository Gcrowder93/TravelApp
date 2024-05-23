const pool = require('../utils/pool');

module.exports = class Trip {
  id;
  location;
  startDate;
  endDate;
  userId;

  constructor(row) {
    this.id = row.id;
    this.location = row.location;
    this.startDate = new Date(row.start_date).toLocaleDateString('en-US');
    this.endDate = new Date(row.end_date).toLocaleDateString('en-US');
    this.userId = row.users_id;
  }

  static async insert({ location, startDate, endDate, userId }) {
    const { rows } = await pool.query(
      'INSERT INTO trips (location, start_date, end_date, users_id) VALUES ($1, $2, $3, $4) RETURNING *;',
      [location, startDate, endDate, userId]
    );
    return new Trip(rows[0]);
  }

  static async getTrips() {
    const { rows } = await pool.query('SELECT * FROM trips');
    return rows.map((row) => new Trip(row));
  }

  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM trips WHERE id=$1', [id]);
    if (!rows[0]) return null;
    return new Trip(rows[0]);
  }

  static async deleteById(id) {
    const { rows } = await pool.query(
      'DELETE FROM trips WHERE id=$1 RETURNING *;',
      [id]
    );
    if (!rows[0]) return null;
    return new Trip(rows[0]);
  }

  static async updateById(id, { location, startDate, endDate }) {
    const existingTrip = await Trip.getById(id);

    if (!existingTrip) return null;
    const newLocation = location ?? existingTrip.location;
    const newStartDate = startDate ?? existingTrip.startDate;
    const newEndDate = endDate ?? existingTrip.endDate;

    const { rows } = await pool.query(
      'UPDATE trips SET location=$2, start_date=$3, end_date=$4 WHERE id=$1 RETURNING *;',
      [id, newLocation, newStartDate, newEndDate]
    );
    return new Trip(rows[0]);
  }

  async getFlights() {
    const { rows } = await pool.query(
      `
      SELECT
        flight_id,
  	    location,
  	    airline,
        departure,
        arrival,
        flight_number,
        trips_id
      FROM
  	    flights
      WHERE
  	    trips_id = $1 -- The join isn't necessary here because you already have the trip id in the flights table
      `,
      [this.id]
    );
    this.flights = rows;
    return this;
  }

  async getLodging() {
    const { rows } = await pool.query(
      `
      SELECT
        lodging_id, name_of_place, contact_info, price_per_night, check_in, check_out, address_1, address_2, city, state, zip, trips_id
      FROM
  	    lodging
      WHERE
  	    trips_id = $1 -- same case here
      `,
      [this.id]
    );
    this.lodging = rows;
    return this;
  }

  async getGroup() {
    const { rows } = await pool.query(
      `
      SELECT
        guest_id,
        name,
        email,
        phone_number,
        emergency_contact
      FROM
        guests
      WHERE
        trips_id = $1 -- this should likely still be a junction/many-to-many
      `,
      [this.id]
    );
    this.guests = rows;
    return this;
  }
};
