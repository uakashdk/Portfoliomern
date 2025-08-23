import ExperienceModel from "../models/ExperienceModel.js";

export const createExperience = async (req, res) => {
  try {
    const {
      title,
      description,
      companyName,
      location,
      employmentType,
      startDate,
      endDate,
      isCurrent,
      technologies,
    } = req.body;

    const requiredFields = {
      title,
      description,
      companyName,
      location,
      employmentType,
      startDate,
      technologies,
    };
    for (let field in requiredFields) {
      if (!requiredFields[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    const techArray = Array.isArray(technologies)
      ? technologies
      : technologies.split(",");

    const newExperience = new ExperienceModel({
      title,
      description,
      companyName,
      location,
      employmentType,
      startDate,
      endDate,
      isCurrent: isCurrent || false,
      technologies: techArray,
    });

    await newExperience.save();

    res.status(201).json({
      success: true,
      message: "Experience saved successfully",
      data: newExperience,
    });
  } catch (error) {
    console.error("Error in createExperience:", error);
    res.status(500).json({
      success: false,
      message: "Error while creating Experience",
      error: error.message,
    });
  }
};
export const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      companyName,
      location,
      employmentType,
      startDate,
      endDate,
      isCurrent,
      technologies,
    } = req.body;

    // Validate ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Experience ID format",
      });
    }

    // Required fields validation
    const requiredFields = {
      title,
      description,
      companyName,
      location,
      employmentType,
      startDate,
      technologies,
    };

    for (let field in requiredFields) {
      if (!requiredFields[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    const updatedExperience = await ExperienceModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        companyName,
        location,
        employmentType,
        startDate,
        endDate,
        isCurrent,
        technologies,
      },
      { new: true }
    );

    if (!updatedExperience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      Experience: updatedExperience,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while updating Experience",
      error: error.message,
    });
  }
};

export const GetExperience = async (req, res) => {
  try {
    const experience = await ExperienceModel.find();
    res.status(200).json({
      success: true,
      message: "Experience received successfully",
      experience,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while fetching Experience",
      error: error.message,
    });
  }
};

export const DeleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const experience = await ExperienceModel.findByIdAndDelete(id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting experience",
      error: error.message,
    });
  }
};
