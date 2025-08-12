import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    OutputUrl: {
      type: String,
      required: [true, "Project Output URL is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    GitHubUrl: {
      type: String,
      required: [true, "Project GitHub URL is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
