import Driver from "../models/driver.model.js";
import { createCrudController } from "./crud.factory.js";

export const driverController = createCrudController(Driver);
