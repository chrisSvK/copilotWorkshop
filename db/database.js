const fs = require('fs').promises;
const path = require('path');

class Database {
  constructor(dataFolder) {
    this.dataFolder = dataFolder;
    this.collections = {};
  }

  async initialize() {
    try {
      await fs.mkdir(this.dataFolder, { recursive: true });
      console.log(`Database initialized at ${this.dataFolder}`);
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  async loadCollection(collectionName) {
    try {
      const filePath = path.join(this.dataFolder, `${collectionName}.json`);
      try {
        const data = await fs.readFile(filePath, 'utf8');
        this.collections[collectionName] = JSON.parse(data);
      } catch (error) {
        if (error.code === 'ENOENT') {
          this.collections[collectionName] = [];
          await this.saveCollection(collectionName);
        } else {
          throw error;
        }
      }
      return this.collections[collectionName];
    } catch (error) {
      console.error(`Error loading collection ${collectionName}:`, error);
      throw error;
    }
  }

  async saveCollection(collectionName) {
    try {
      const filePath = path.join(this.dataFolder, `${collectionName}.json`);
      await fs.writeFile(
        filePath, 
        JSON.stringify(this.collections[collectionName], null, 2)
      );
      return true;
    } catch (error) {
      console.error(`Error saving collection ${collectionName}:`, error);
      throw error;
    }
  }

  async findById(collectionName, id) {
    if (!this.collections[collectionName]) {
      await this.loadCollection(collectionName);
    }
    return this.collections[collectionName].find(item => item.id === id);
  }

  async findAll(collectionName, filter = {}) {
    if (!this.collections[collectionName]) {
      await this.loadCollection(collectionName);
    }
    
    if (Object.keys(filter).length === 0) {
      return this.collections[collectionName];
    }
    
    return this.collections[collectionName].filter(item => {
      return Object.keys(filter).every(key => item[key] === filter[key]);
    });
  }

  async insert(collectionName, data) {
    if (!this.collections[collectionName]) {
      await this.loadCollection(collectionName);
    }
    
    this.collections[collectionName].push(data);
    await this.saveCollection(collectionName);
    return data;
  }

  async update(collectionName, id, data) {
    if (!this.collections[collectionName]) {
      await this.loadCollection(collectionName);
    }
    
    const index = this.collections[collectionName].findIndex(item => item.id === id);
    if (index === -1) return null;
    
    this.collections[collectionName][index] = {
      ...this.collections[collectionName][index],
      ...data
    };
    
    await this.saveCollection(collectionName);
    return this.collections[collectionName][index];
  }

  async delete(collectionName, id) {
    if (!this.collections[collectionName]) {
      await this.loadCollection(collectionName);
    }
    
    const index = this.collections[collectionName].findIndex(item => item.id === id);
    if (index === -1) return false;
    
    this.collections[collectionName].splice(index, 1);
    await this.saveCollection(collectionName);
    return true;
  }
}

module.exports = new Database(path.join(__dirname, '../data'));
