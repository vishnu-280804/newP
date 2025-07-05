import db from '../config/database.js';

export class Notification {
  constructor(notificationData) {
    this.userId = notificationData.userId;
    this.title = notificationData.title;
    this.message = notificationData.message;
    this.type = notificationData.type || 'info';
    this.read = notificationData.read || false;
    this.relatedId = notificationData.relatedId;
  }

  // Save notification to database
  async save() {
    return await db.insert('notifications', this);
  }

  // Find notification by ID
  static async findById(id) {
    return await db.findById('notifications', id);
  }

  // Find all notifications
  static async find(query = {}) {
    return await db.find('notifications', query);
  }

  // Find notifications by user
  static async findByUser(userId) {
    return await db.find('notifications', { userId });
  }

  // Update notification
  static async updateById(id, updateData) {
    return await db.update('notifications', { _id: id }, updateData);
  }

  // Delete notification
  static async deleteById(id) {
    return await db.delete('notifications', { _id: id });
  }

  // Mark as read
  static async markAsRead(id) {
    return await this.updateById(id, { read: true });
  }

  // Mark all as read for user
  static async markAllAsReadForUser(userId) {
    const notifications = await this.findByUser(userId);
    const updatePromises = notifications.map(notification => 
      this.updateById(notification._id, { read: true })
    );
    return await Promise.all(updatePromises);
  }
}

export default Notification;