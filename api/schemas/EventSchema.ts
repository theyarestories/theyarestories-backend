import { Schema, model } from "mongoose";
import { EventType, IEvent } from "@/interfaces/event/IEvent";

export const EventSchema = new Schema<IEvent>(
  {
    type: {
      type: String,
      enum: Object.values(EventType),
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
