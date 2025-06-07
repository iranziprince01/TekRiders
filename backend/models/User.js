const { usersDb } = require('../db');
const bcrypt = require('bcryptjs');

class User {
  constructor(data) {
    this.email = data.email;
    this.phone = data.phone;
    this.password = data.password;
    this.role = data.role;
    this.type = 'user';
    this.createdAt = new Date().toISOString();
  }

  static async findByEmail(email) {
    try {
      const query = {
        selector: {
          email: email
        },
        use_index: ['email-index'],
        fields: ['_id', '_rev', 'email', 'phone', 'password', 'role', 'resetToken', 'resetTokenExpiry']
      };
      
      const result = await usersDb.find(query);
      return result.docs[0] || null;
    } catch (err) {
      console.error('Error finding user by email:', err);
      throw err;
    }
  }

  static async findByPhone(phone) {
    try {
      const query = {
        selector: {
          phone: phone
        },
        use_index: ['phone-index'],
        fields: ['_id', '_rev', 'email', 'phone', 'password', 'role', 'resetToken', 'resetTokenExpiry']
      };
      
      const result = await usersDb.find(query);
      return result.docs[0] || null;
    } catch (err) {
      console.error('Error finding user by phone:', err);
      throw err;
    }
  }

  static async create(userData) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword
      });

      const result = await usersDb.insert(user);
      return {
        _id: result.id,
        _rev: result.rev,
        ...user
      };
    } catch (err) {
      console.error('Error creating user:', err);
      throw err;
    }
  }

  static async update(id, rev, updates) {
    try {
      const user = await usersDb.get(id);
      const updatedUser = {
        ...user,
        ...updates,
        _rev: rev
      };

      if (updates.password) {
        updatedUser.password = await bcrypt.hash(updates.password, 10);
      }

      console.log('Updating user document:', { id, updates, updatedUser });
      const result = await usersDb.insert(updatedUser);
      console.log('User document updated result:', result);
      return {
        _id: result.id,
        _rev: result.rev,
        ...updatedUser
      };
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  }

  static async delete(id, rev) {
    try {
      await usersDb.destroy(id, rev);
      return true;
    } catch (err) {
      console.error('Error deleting user:', err);
      throw err;
    }
  }

  static async validatePassword(user, password) {
    try {
      return await bcrypt.compare(password, user.password);
    } catch (err) {
      console.error('Error validating password:', err);
      throw err;
    }
  }
}

module.exports = User; 