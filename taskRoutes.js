const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// ---------------- CREATE TASK (Admin only) ----------------
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;

    // Only Admin can create tasks
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only Admin can create tasks" });
    }

    if (!title || !assignedTo) {
      return res.status(400).json({ message: "Title and assignedTo required" });
    }

    // Check assigned user exists
    const user = await User.findById(assignedTo);
    if (!user) {
      return res.status(404).json({ message: "Assigned user not found" });
    }

    const task = new Task({
      title,
      description,
      assignedTo,
      createdBy: req.user.userId
    });

    await task.save();

    res.status(201).json({
      message: "Task created",
      task
    });

  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ message: "Error creating task" });
  }
});


// ---------------- GET MY TASKS ----------------
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.userId })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name");

    res.json(tasks);

  } catch (err) {
    console.error("Fetch tasks error:", err);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});


// ---------------- UPDATE STATUS ----------------
router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Only assigned user OR admin can update
    if (
      task.assignedTo.toString() !== req.user.userId &&
      req.user.role !== "Admin"
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    task.status = status || task.status;
    await task.save();

    res.json({
      message: "Task updated",
      task
    });

  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ message: "Error updating task" });
  }
});

module.exports = router;

// ---------------- DASHBOARD ----------------
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const tasks = await Task.find({ assignedTo: userId });

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "Completed").length;
    const pending = tasks.filter(t => t.status === "Pending").length;

    const overdue = tasks.filter(t => {
      return t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "Completed";
    }).length;

    res.json({
      total,
      completed,
      pending,
      overdue
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Error fetching dashboard" });
  }
});