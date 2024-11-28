const ToDo = require("../models/toDo")

exports.postAddToDo = async (req, res) => {
  try {
    const { toDoName, toDoDescription, toDoACT, toDoStatus, toDoCreationDate } = req.body;

    console.log(toDoName, toDoDescription, toDoACT, toDoStatus, toDoCreationDate);

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