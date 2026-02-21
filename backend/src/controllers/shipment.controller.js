import Shipment from "../models/shipment.model.js";
import { createCrudController } from "./crud.factory.js";

export const shipmentController = createCrudController(Shipment);
