const express = require("express");
const bodyParser = require("body-parser");
const uuid = require("uuid");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));


const tasks = [];


app.get("/", (req, res) => {
    res.status(200).render("index", { tasks });
});

app.post("/createTask", (req, res) => {
    tasks.push({ id: uuid.v4(), task: req.body.task });
    console.log(tasks);
    res.status(200).redirect("/");
});

app.post("/editTask", (req, res) => {
    const task_id = req.body.id;
    const index = tasks.findIndex(task => task.id === task_id);
    tasks[index].task = req.body.new_task;
    res.status(200).redirect("/");
});


app.post("/deleteTask", (req, res) => {
    const task_id = req.body.task_id;
    const index = tasks.findIndex(task => task.id === task_id);
    tasks.splice(index, 1);
    res.status(200).redirect("/");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is live at port ${PORT}`));
