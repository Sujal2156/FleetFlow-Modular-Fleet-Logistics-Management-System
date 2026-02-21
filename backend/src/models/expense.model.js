import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    expenseId: { type: String, required: true, unique: true, trim: true },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    fuelLiters: { type: Number, required: true, min: 0 },
    fuelCost: { type: Number, required: true, min: 0 },
    miscExpense: { type: Number, default: 0, min: 0 },
    expenseDate: { type: Date, required: true },
  },
  { timestamps: true }
);

expenseSchema.virtual("totalOperationalCost").get(function totalOperationalCost() {
  return Number(this.fuelCost || 0) + Number(this.miscExpense || 0);
});

expenseSchema.set("toJSON", { virtuals: true });
expenseSchema.set("toObject", { virtuals: true });

export default mongoose.model("Expense", expenseSchema);
