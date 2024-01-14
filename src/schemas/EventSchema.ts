import { Schema, model } from "mongoose";
import { IEvent } from "@/interfaces/event/IEvent";

export const EventSchema = new Schema<IEvent>(
  {
    type: {
      type: String,
      enum: ["visit"],
      required: [true, "Please, add the event type"],
    },
    metadata: {
      type: Schema.Types.Mixed,
      required: [true, "Please, add the event metadata"],
    },
  },
  { timestamps: true }
);

const EventModel = model<IEvent>("Event", EventSchema);

export default EventModel;
