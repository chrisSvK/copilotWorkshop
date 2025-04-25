class Task {
  constructor(id, title, description, dueDate, assigneeId) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.assigneeId = assigneeId;
    this.completed = false;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  markComplete() {
    this.completed = true;
    this.updatedAt = new Date().toISOString();
    return this;
  }

  updateDetails(updates) {
    const allowedUpdates = ['title', 'description', 'dueDate', 'assigneeId'];
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        this[key] = updates[key];
      }
    });
    this.updatedAt = new Date().toISOString();
    return this;
  }

  isOverdue() {
    if (!this.dueDate || this.completed) return false;
    return new Date(this.dueDate) < new Date();
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      dueDate: this.dueDate,
      assigneeId: this.assigneeId,
      completed: this.completed,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isOverdue: this.isOverdue()
    };
  }
}

module.exports = Task;
