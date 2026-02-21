import Vehicle from "../models/vehicle.model.js";
import { createCrudController } from "./crud.factory.js";

export const vehicleController = createCrudController(Vehicle);
