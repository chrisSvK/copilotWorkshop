class Comment {
  constructor(id, content, taskId, userId) {
    this.id = id;
    this.content = content;
    this.taskId = taskId;
    this.userId = userId;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  updateContent(newContent) {
    this.content = newContent;
    this.updatedAt = new Date().toISOString();
    return this;
  }

  isEdited() {
    return this.createdAt !== this.updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      content: this.content,
      taskId: this.taskId,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      edited: this.isEdited()
    };
  }
}

module.exports = Comment;
