const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'akankshadubey2559@gmail.com',
            pass: 'rsug ywgg rusr ygjm' 
        }
    });

    // Email options
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'recipient@example.com', 
        subject: `New message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('An error occurred while sending the email.');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email sent successfully!');
        }
    });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

