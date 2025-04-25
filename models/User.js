class User {
  constructor(id, name, email, role = 'user') {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.createdAt = new Date().toISOString();
    this.lastLogin = null;
  }

  updateProfile(updates) {
    Object.assign(this, updates);
    return this;
  }

  changeRole(newRole) {
    if (!['user', 'admin', 'editor'].includes(newRole)) {
      throw new Error(`Invalid role: ${newRole}`);
    }
    this.role = newRole;
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt,
      lastLogin: this.lastLogin
    };
  }
}

module.exports = User;
