const express = require("express");
const bodyParser = require("body-parser");
const uuid = require("uuid");
const app = express();
const mongoose = require("mongoose");
const Task = require("./model/task");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect("mongodb+srv://hhargr836:Panther4487@cluster0.raw15kd.mongodb.net/TaskManager")
  .then(() => console.log("Connected to database"))
  .catch(err => console.error(err))

app.get("/", async (req, res) => {
    const tasks = await Task.find({});
    tasks.reverse();
    res.status(200).render("index", { tasks });
});

app.post("/createTask", (req, res) => {
    const newTask = new Task({task: req.body.task});
    newTask.save({})
      .then(data => console.log(data))
      .catch(err => console.log(err));

    res.status(200).redirect("/");
});

app.post("/editTask", (req, res) => {
    const newTask = req.body.new_task;
    const taskId = req.body.id;

    Task.findOneAndUpdate({ _id: taskId }, { task: newTask })
      .catch(err => console.error(err))

    res.status(200).redirect("/");
});


app.post("/deleteTask", (req, res) => {
    const taskId = req.body.id;

    Task.deleteOne({ _id: taskId })
      .catch(err => console.error(err))

    res.status(200).redirect("/");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is live at port ${PORT}`));
