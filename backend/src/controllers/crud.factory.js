export function createCrudController(Model, options = {}) {
  const populate = options.populate || [];

  async function list(req, res, next) {
    try {
      let query = Model.find();
      for (const path of populate) {
        query = query.populate(path);
      }
      const items = await query.sort({ createdAt: -1 });
      res.status(200).json({ items });
    } catch (error) {
      next(error);
    }
  }

  async function getById(req, res, next) {
    try {
      let query = Model.findById(req.params.id);
      for (const path of populate) {
        query = query.populate(path);
      }
      const item = await query;
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
      const item = await Model.create(req.body);
      res.status(201).json({ item });
    } catch (error) {
      next(error);
    }
  }

  async function update(req, res, next) {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
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
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Resource not found" });
      }
      res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  return { list, getById, create, update, remove };
}
