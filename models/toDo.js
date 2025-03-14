import mongoose from 'mongoose'

const ToDoSchema = new mongoose.Schema({
  toDoName: {
    type: String,
    required: [true, 'To-do name is required'],
    trim: true,
    minlength: [3, 'To-do name must be at least 3 characters long'],
    maxlength: [100, 'To-do name must not exceed 100 characters'],
  },
  toDoDescription: {
    type: String,
    required: [true, 'To-do description is required'],
    trim: true,
    minlength: [10, 'To-do description must be at least 10 characters long'],
    maxlength: [500, 'To-do description must not exceed 500 characters'],
  },
  toDoACT: {
    type: Date,
    required: [true, 'Assumptive completion time is required'],
    validate: {
      validator: function (value) {
        return value > new Date(); // Ensure the ACT is in the future
      },
      message: 'Assumptive completion time must be a future date',
    },
  },
  toDoStatus: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'], // Restrict status to specific values
    default: 'Pending',
    required: [true, 'To-do status is required'],
  },
  toDoCreationDate: {
    type: Date,
    default: Date.now, // Automatically set the creation date to now
  },
  toDoEditionDate: {
    type: Date,
    default: null, // Initially null, only set on edit
  },
  userId: {
    type: String,
    required: [true, 'User ID is required']
  },
});

ToDoSchema.index({ userId: 1, toDoCreationDate: -1 });
ToDoSchema.index({ userId: 1, toDoName: 'text' });

const ToDo = mongoose.model('ToDo', ToDoSchema);

export default ToDo
