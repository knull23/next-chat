import nodemailer from "nodemailer";

const mailHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed. Use POST." });
  }

  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ message: "Email and message are required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.SMTP_USER, // Your email
        pass: process.env.SMTP_PASS, // App password
      },
    });

    const mailData = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Verify your email",
      text: message,
    };

    const info = await transporter.sendMail(mailData);
    res.status(200).json({ message: "Email sent successfully", info });
  } catch (err) {
    console.error("Error sending email:", err.message);
    res.status(500).json({ message: `An error occurred: ${err.message}` });
  }
};

export default mailHandler;

