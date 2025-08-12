import Contact from "../models/contactModel.js"; // Keep the import
import nodemailer from "nodemailer"; // Keep the import

export const submitContactForm = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const contactMessage = new Contact({ name, email, message });
    await contactMessage.save();

    // No need to require again, just use the imported nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your app password (not regular password)
      },
      tls: {
        rejectUnauthorized: false, // Optional: If you're having TLS issues
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: "New Contact Form Submission",
      text: message,
    });

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send message." });
  }
};
