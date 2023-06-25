const { pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class playlistSongsService {
  constructor() {
    this.pool = new pool();
    this._cacheservice = cacheService;
  }
  async getSongsFromPlaylist(id) {
    try {
      const result = await this._cacheservice.get(`playlistSongs:${id}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT songs.id, songs.title, songs.performer FROM playlist_songs 
                LEFT JOIN songs ON songs.id = playlist_songs.song_id
                WHERE playlist_id = $1`,
        values: [id],
      };

      const result = await this._pool.query(query);

      if (!result.rowCount) {
        throw new InvariantError('Gagal ambil lagu dari playlist')
      }

      await this._cacheservice.set(`playlistSongs:${id}`, JSON.stringify(result.rows));
      return result.rows;

    }

  }
}

module.exports = playlistSongsService;
