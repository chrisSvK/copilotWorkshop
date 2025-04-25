const database = require('../db/database');
const { delay } = require('../utils');

class NotificationService {
  constructor() {
    this.channels = {
      email: new EmailChannel(),
      sms: new SMSChannel(),
      push: new PushChannel()
    };
    this.queue = [];
    this.processing = false;
  }

  async sendNotification(userId, message, channel = 'email', priority = 'normal') {
    const user = await database.findById('users', userId);
    
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }
    
    if (!this.channels[channel]) {
      throw new Error(`Invalid notification channel: ${channel}`);
    }
    
    const notification = {
      id: Date.now().toString(),
      userId,
      message,
      channel,
      priority,
      status: 'queued',
      createdAt: new Date().toISOString()
    };
    
    this.queue.push(notification);
    await database.insert('notifications', notification);
    
    if (!this.processing) {
      this.processQueue();
    }
    
    return notification;
  }
  
  async processQueue() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }
    
    this.processing = true;
    
    const priorityOrder = { high: 0, normal: 1, low: 2 };
    this.queue.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    
    const notification = this.queue.shift();
    
    try {
      const user = await database.findById('users', notification.userId);
      
      if (!user) {
        throw new Error(`User not found: ${notification.userId}`);
      }
      
      const channel = this.channels[notification.channel];
      await channel.send(user, notification.message);
      
      notification.status = 'sent';
      notification.sentAt = new Date().toISOString();
    } catch (error) {
      notification.status = 'failed';
      notification.error = error.message;
    }
    
    notification.updatedAt = new Date().toISOString();
    await database.update('notifications', notification.id, notification);
    
    await delay(100);
    this.processQueue();
  }
}

class EmailChannel {
  async send(user, message) {
    console.log(`[EMAIL] To: ${user.email}, Message: ${message}`);
    await delay(300);
    return true;
  }
}

class SMSChannel {
  async send(user, message) {
    console.log(`[SMS] To: ${user.phone || 'No phone number'}, Message: ${message}`);
    await delay(200);
    return true;
  }
}

class PushChannel {
  async send(user, message) {
    console.log(`[PUSH] To: User ID ${user.id}, Message: ${message}`);
    await delay(150);
    return true;
  }
}

module.exports = new NotificationService();
