const db = require('../config/db.js')
const { ObjectId } = require('mongodb');


class AuthUserAssociation {
    constructor(authProviderId, authId, userId) {
      this._id = new ObjectId();
      this.authProvider_id = authProviderId;
      this.auth_id = authId;
      this.user_id = userId;
      this.connected = false;
    }

    async find_user_association(authId){
      await db.connect()
      const conn = db.getConnection();

      const collection = conn.collection('authUserAssociation');

      const userAssociation = await collection.findOne({ authId: authId });
      return userAssociation
    }
  }
module.exports = new AuthUserAssociation;