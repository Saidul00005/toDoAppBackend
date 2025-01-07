import ToDo from "../models/toDo.js";
import User from "../models/user.js";

export const postAddToDo = [async (req, res) => {
  try {
    const { toDoName, toDoDescription, toDoACT, toDoStatus, toDoCreationDate } = req.body;

    // console.log(req.user.id)

    const userId = req.user.id;

    if (!toDoName || !toDoDescription || !toDoACT || !toDoStatus || !toDoCreationDate) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found. Invalid user ID.' });
    }

    const toDo = new ToDo({
      toDoName,
      toDoDescription,
      toDoACT,
      toDoStatus,
      toDoCreationDate,
      userId,
    });

    const savedToDo = await toDo.save();
    return res.status(201).json({ message: 'To-do item saved successfully', data: savedToDo });

  } catch (err) {
    console.error("Error [To do item Save]:", err.message);
    return res.status(400).json({ error: err.message });
  }
}];

export const getToDoList = [async (req, res) => {

  try {
    const userId = req.user.id;
    const toDos = await ToDo.find({ userId });

    res.status(200).json({ Message: 'Fetch Success.[Todo items]', data: toDos })

  } catch (err) {
    console.error("Error[Fetch ToDos]:", err.message)
    res.status(500).json({ error: 'Failure[Fetch to do items.]' })
  }

}]

export const putEditToDo = [async (req, res) => {
  try {
    const { _id } = req.params;
    const { toDoName, toDoDescription, toDoACT, toDoStatus, toDoCreationDate, toDoEditionDate } = req.body; // Extract fields to update from the request body
    const userId = req.user.id;

    if (!_id) {
      return res.status(400).json({ error: "To-do ID is required." });
    }

    // const _id = new mongoose.Types.ObjectId(`${id}`);

    // if (!mongoose.Types.ObjectId.isValid(_id)) {
    //   return res.status(400).json({ error: "Invalid To-do ID." });
    // }

    if (!toDoName || !toDoDescription || !toDoACT || !toDoStatus || !toDoCreationDate || !toDoEditionDate) {
      return res.status(400).json({ error: "All items are required." });
    }

    const toDo = await ToDo.findById(_id);
    if (!toDo) {
      return res.status(404).json({ error: "To-do item not found." });
    }

    if (toDo.userId.toString() !== userId) {
      return res.status(403).json({ error: "You can only delete your own to-do items." });
    }

    const updatedToDo = await ToDo.findByIdAndUpdate(
      _id,
      {
        toDoName,
        toDoDescription,
        toDoACT,
        toDoStatus,
        toDoCreationDate,
        toDoEditionDate,
        userId
      },
      { new: true, runValidators: true } // Return the updated document and run schema validation
    );

    if (!updatedToDo) {
      return res.status(404).json({ error: "To-do item not found." });
    }

    res.status(200).json({ message: "To-do item updated successfully", data: updatedToDo });
  } catch (err) {
    console.error("Error [Edit To-Do]:", err.message);
    res.status(500).json({ error: "Failed to update to-do item." });
  }
}]

export const patchUpdateToDoStatus = [async (req, res) => {
  try {
    const { _id } = req.params;
    const { toDoStatus, toDoEditionDate } = req.body;
    const userId = req.user.id;  // Access authenticated user ID from session

    if (!_id) {
      return res.status(400).json({ error: "To-do ID is required." });
    }

    if (!toDoStatus) {
      return res.status(400).json({ error: "To-do status is required." });
    }

    if (!toDoEditionDate) {
      return res.status(400).json({ error: "To-do Edition date is required." });
    }

    // Find the to-do item by ID and check if it belongs to the authenticated user
    const toDo = await ToDo.findById(_id);

    if (!toDo) {
      return res.status(404).json({ error: "To-do item not found." });
    }

    if (toDo.userId.toString() !== userId) {
      return res.status(403).json({ error: "You can only update your own to-do items." });
    }

    // Update the to-do status
    const updatedToDo = await ToDo.findByIdAndUpdate(
      _id,
      { toDoStatus, toDoEditionDate },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "To-do status updated successfully", data: updatedToDo });
  } catch (err) {
    console.error("Error [Update To-Do Status]:", err.message);
    res.status(500).json({ error: "Failed to update to-do status." });
  }
}]

export const deleteDeleteToDo = [async (req, res) => {
  try {
    const { _id } = req.params;
    const userId = req.user.id;  // Access authenticated user ID from session

    if (!_id) {
      return res.status(400).json({ error: "To-do ID is required." });
    }

    // Find the to-do item by ID and check if it belongs to the authenticated user
    const toDo = await ToDo.findById(_id);
    if (!toDo) {
      return res.status(404).json({ error: "To-do item not found." });
    }

    if (toDo.userId.toString() !== userId) {
      return res.status(403).json({ error: "You can only delete your own to-do items." });
    }

    // Delete the to-do item
    const deletedToDo = await ToDo.findByIdAndDelete(_id);

    res.status(200).json({ message: "To-do item deleted successfully", data: deletedToDo });
  } catch (err) {
    console.error("Error [Delete To-Do]:", err.message);
    res.status(500).json({ error: "Failed to delete to-do item." });
  }
}]
