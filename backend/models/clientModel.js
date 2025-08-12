import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  projectDescription: {
    type: String,
    required: true,
  },
  star: {
    type: Number,
    required: true,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
});

const client = mongoose.model("Client", clientSchema);

export default client;
