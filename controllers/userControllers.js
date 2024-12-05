const ToDo = require("../models/toDo")

exports.postAddToDo = async (req, res) => {
  try {
    const { toDoName, toDoDescription, toDoACT, toDoStatus, toDoCreationDate } = req.body;

    // console.log(toDoName, toDoDescription, toDoACT, toDoStatus, toDoCreationDate);

    if (!toDoName || !toDoDescription || !toDoACT || !toDoStatus || !toDoCreationDate) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const toDo = new ToDo({
      toDoName,
      toDoDescription,
      toDoACT,
      toDoStatus,
      toDoCreationDate,
    })

    const savedToDo = await toDo.save();
    res.status(201).json({ message: 'To-do item saved successfully', data: savedToDo });
  } catch (err) {
    console.error("Error [To do item Save]", err.message)
    res.status(400).json({ error: err.message })
  }
}

exports.getToDoList = async (req, res) => {

  try {
    const toDos = await ToDo.find();

    res.status(200).json({ Message: 'Fetch Success.[Todo items]', data: toDos })

  } catch (err) {
    console.error("Error[Fetch ToDos]:", err.message)
    res.status(500).json({ error: 'Failure[Fetch to do items.]' })
  }

}

exports.putEditToDo = async (req, res) => {
  try {
    const { _id } = req.params;
    const { toDoName, toDoDescription, toDoACT, toDoStatus, toDoCreationDate, toDoEditionDate } = req.body; // Extract fields to update from the request body

    if (!_id) {
      return res.status(400).json({ error: "To-do ID is required." });
    }

    // const _id = new mongoose.Types.ObjectId(`${id}`);

    // if (!mongoose.Types.ObjectId.isValid(_id)) {
    //   return res.status(400).json({ error: "Invalid To-do ID." });
    // }

    const updatedToDo = await ToDo.findByIdAndUpdate(
      _id,
      {
        toDoName,
        toDoDescription,
        toDoACT,
        toDoStatus,
        toDoCreationDate,
        toDoEditionDate
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
}

exports.patchUpdateToDoStatus = async (req, res) => {
  try {
    const { _id } = req.params;
    const { toDoStatus, toDoEditionDate } = req.body; // Only extract the status field

    if (!_id) {
      return res.status(400).json({ error: "To-do ID is required." });
    }

    if (!toDoStatus) {
      return res.status(400).json({ error: "To-do status is required." });
    }

    if (!toDoEditionDate) {
      return res.status(400).json({ error: "To-do Edition date is required." });
    }

    const updatedToDo = await ToDo.findByIdAndUpdate(
      _id,
      { toDoStatus, toDoEditionDate },
      { new: true, runValidators: true } // Return the updated document and run schema validation
    );

    if (!updatedToDo) {
      return res.status(404).json({ error: "To-do item not found." });
    }

    res.status(200).json({ message: "To-do status updated successfully", data: updatedToDo });
  } catch (err) {
    console.error("Error [Update To-Do Status]:", err.message);
    res.status(500).json({ error: "Failed to update to-do status." });
  }
}

exports.deleteDeleteToDo = async (req, res) => {
  try {
    const { _id } = req.params;

    if (!_id) {
      return res.status(400).json({ error: "To-do ID is required." });
    }

    const deletedToDo = await ToDo.findByIdAndDelete(_id);

    if (!deletedToDo) {
      return res.status(404).json({ error: "To-do item not found." });
    }

    res.status(200).json({ message: "To-do item deleted successfully", data: deletedToDo });
  } catch (err) {
    console.error("Error [Delete To-Do]:", err.message);
    res.status(500).json({ error: "Failed to delete to-do item." });
  }
}
