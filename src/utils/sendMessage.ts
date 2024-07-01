// import nodemailer from 'nodemailer'
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'your_email@gmail.com', // Your email address
//       pass: 'your_password' // Your password for Gmail
//     }
//   });


// You
// how to use nodemailer in node js exepress
// ChatGPT
// ChatGPT
// Using Nodemailer with Node.js and Express is a straightforward process. Nodemailer is a popular module for sending emails from Node.js applications. Here's a step-by-step guide on how to set it up:

// Step 1: Set Up Your Node.js Project
// First, make sure you have Node.js installed on your machine. You can initialize a new Node.js project using npm (Node Package Manager):

// bash
// Copy code
// mkdir myemailapp
// cd myemailapp
// npm init -y
// Step 2: Install Nodemailer
// Next, install Nodemailer in your project. You can do this via npm:

// bash
// Copy code
// npm install nodemailer
// Step 3: Create a Node.js File (e.g., app.js)
// Create a file named app.js (or any other name you prefer) in your project directory. This will be your main Node.js application file.

// Step 4: Require Nodemailer and Express
// In app.js, require both Nodemailer and Express:

// javascript
// Copy code
// const express = require('express');
// const nodemailer = require('nodemailer');
// const bodyParser = require('body-parser'); // To parse incoming request bodies

// const app = express();
// const port = 3000; // Choose any port you prefer

// // Middleware to parse JSON and URL-encoded bodies
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Configure Nodemailer with your SMTP settings
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'your_email@gmail.com', // Your email address
//     pass: 'your_password' // Your password for Gmail
//   }
// });
// // // Replace 'your_email@gmail.com' and 'your_password' with your actual Gmail email address and password. Note that for production applications, it's recommended to use environment variables to store sensitive information like passwords.

// // Step 5: Create an Express Route to Send Emails
// // Add a route in app.js to handle sending emails. For example:

// // javascript
// // Copy code
// // app.post('/send-email', (req, res) => {
// //   const { to, subject, text } = req.body;

// //   const mailOptions = {
// //     from: 'your_email@gmail.com',
// //     to,
// //     subject,
// //     text
// //   };

// //   transporter.sendMail(mailOptions, function(error, info){
// //     if (error) {
// //       console.log(error);
// //       res.status(500).send('Error sending email');
// //     } else {
// //       console.log('Email sent: ' + info.response);
// //       res.send('Email sent successfully');
// //     }
// //   });
// // });