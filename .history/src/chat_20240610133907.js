const messageSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  sender: String,
  message: String,
  dateTime: { type: Date, default: Date.now },
});

// Create and export the Task model
const Task = mongoose.model('Task', taskSchema);

// Create and export the User model
const User = mongoose.model('User', userSchema);

const Message = mongoose.model('Message', messageSchema);

module.exports = { User, Task, Message };