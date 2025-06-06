const { coursesDb } = require('../db');

class Course {
  constructor(data) {
    this.title = data.title;
    this.description = data.description;
    this.status = 'pending';
    this.instructorId = data.instructorId;
    this.type = 'course';
    this.createdAt = new Date().toISOString();
  }

  static async create(data) {
    const course = new Course(data);
    const result = await coursesDb.insert(course);
    return { _id: result.id, _rev: result.rev, ...course };
  }

  static async findByStatus(status) {
    const result = await coursesDb.find({ selector: { status } });
    return result.docs;
  }

  static async updateStatus(id, status) {
    const doc = await coursesDb.get(id);
    doc.status = status;
    const result = await coursesDb.insert(doc);
    return { _id: result.id, _rev: result.rev, ...doc };
  }
}

module.exports = Course;
