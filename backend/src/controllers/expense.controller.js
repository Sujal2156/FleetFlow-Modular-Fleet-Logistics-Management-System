import Expense from "../models/expense.model.js";

async function list(req, res, next) {
  try {
    const items = await Expense.find()
      .populate("trip")
      .populate("vehicle")
      .populate("driver")
      .sort({ createdAt: -1 });
    res.status(200).json({ items });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const item = await Expense.findById(req.params.id)
      .populate("trip")
      .populate("vehicle")
      .populate("driver");
    if (!item) {
      return res.status(404).json({ message: "Resource not found" });
    }
    res.status(200).json({ item });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const item = await Expense.create(req.body);
    const populated = await Expense.findById(item._id)
      .populate("trip")
      .populate("vehicle")
      .populate("driver");
    res.status(201).json({ item: populated });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const item = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("trip")
      .populate("vehicle")
      .populate("driver");

    if (!item) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.status(200).json({ item });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const item = await Expense.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Resource not found" });
    }
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    next(error);
  }
}

export const expenseController = { list, getById, create, update, remove };
