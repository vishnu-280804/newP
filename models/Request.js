import db from '../config/database.js';

class Request {
  constructor(data) {
    this.customerId = data.customerId;
    this.laborerId = data.laborerId;
    this.jobType = data.jobType;
    this.description = data.description;
    this.location = data.location; // { latitude, longitude, address }
    this.estimatedHours = data.estimatedHours;
    this.budget = data.budget;
    this.urgency = data.urgency; // 'low', 'medium', 'high'
    this.status = data.status || 'pending'; // 'pending', 'accepted', 'declined', 'completed', 'cancelled'
    this.scheduledDate = data.scheduledDate;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async save() {
    const savedRequest = await db.insert('requests', this);
    return savedRequest;
  }

  static async findById(id) {
    return await db.findById('requests', id);
  }

  static async findByCustomerId(customerId) {
    return await db.find('requests', { customerId });
  }

  static async findByLaborerId(laborerId) {
    return await db.find('requests', { laborerId });
  }

  static async findPendingByLaborerId(laborerId) {
    return await db.find('requests', { laborerId, status: 'pending' });
  }

  static async updateStatus(requestId, status) {
    return await db.update('requests', { _id: requestId }, { 
      status, 
      updatedAt: new Date() 
    });
  }

  static async findActiveRequests() {
    return await db.find('requests', { 
      status: { $in: ['pending', 'accepted'] } 
    });
  }

  static async getRequestStats(userId, userType) {
    const query = userType === 'customer' ? { customerId: userId } : { laborerId: userId };
    const requests = await db.find('requests', query);
    
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      accepted: requests.filter(r => r.status === 'accepted').length,
      completed: requests.filter(r => r.status === 'completed').length,
      cancelled: requests.filter(r => r.status === 'cancelled').length
    };
  }
}

export default Request;