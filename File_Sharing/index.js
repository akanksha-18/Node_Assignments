// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const session = require('express-session');
// const multer = require('multer');
// const path = require('path');
// const bcrypt = require('bcrypt');


// const app = express();
// const port =process.env.PORT|| 3000;

// // Connect to MongoDB
// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('Could not connect to MongoDB', err));
// // Import models
// const User = require('./models/User');
// const File = require('./models/File');

// // Middleware
// app.set('view engine', 'ejs');
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true
// }));

// //Multer configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });
// const upload = multer({ storage: storage });

// // Routes
// app.get('/', (req, res) => {
//   res.render('index');
// });

// // GET route to display the registration form
// app.get('/register', (req, res) => {
//   res.render('register', { message: req.query.message });
// });

// // POST route to handle the registration form submission
// app.post('/register', async (req, res) => {
//   try {
//     const existingUser = await User.findOne({ username: req.body.username });
//     if (existingUser) {
//       return res.redirect('/register?message=Username already taken');
//     }

//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     const user = new User({
//       username: req.body.username,
//       password: hashedPassword
//     });
//     await user.save();
//     res.redirect('/login?message=Registration successful. Please log in.');
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.redirect('/register?message=Error during registration');
//   }
// });
// app.get('/login', (req, res) => {
//   res.render('login', { message: req.query.message });
// });

// app.post('/login', async (req, res) => {
//   const user = await User.findOne({ username: req.body.username });
//   if (!user) {
//     // User not found
//     return res.redirect('/login?message=User not registered');
//   }
  
//   const isMatch = await bcrypt.compare(req.body.password, user.password);
//   if (isMatch) {
//     req.session.userId = user._id;
//     res.redirect('/dashboard');
//   } else {
//     // Incorrect password
//     res.redirect('/login?message=Incorrect username or password');
//   }
// });

// app.get('/dashboard', async (req, res) => {
//   if (req.session.userId) {
//     const user = await User.findById(req.session.userId);
//     const files = await File.find({ owner: req.session.userId });
//     res.render('dashboard', { user: user, files: files });
//   } else {
//     res.redirect('/login');
//   }
// });

// app.post('/upload', upload.single('file'), async (req, res) => {
//   if (req.session.userId) {
//     const file = new File({
//       name: req.file.originalname,
//       path: req.file.filename,
//       owner: req.session.userId
//     });
//     await file.save();
//     res.redirect('/dashboard');
//   } else {
//     res.redirect('/login');
//   }
// });



// app.get('/download/:fileId', async (req, res) => {
//   if (req.session.userId) {
//     const file = await File.findOne({ _id: req.params.fileId, owner: req.session.userId });
//     if (file) {
//       res.download('public/uploads/' + file.path, file.name);
//     } else {
//       res.send('File not found');
//     }
//   } else {
//     res.redirect('/login');
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });


require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Import models
const User = require('./models/User');
const File = require('./models/File');

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

// GET route to display the registration form
app.get('/register', (req, res) => {
  res.render('register', { message: req.query.message });
});

// POST route to handle the registration form submission
app.post('/register', async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.redirect('/register?message=Username already taken');
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword
    });
    await user.save();
    res.redirect('/login?message=Registration successful. Please log in.');
  } catch (error) {
    console.error('Registration error:', error);
    res.redirect('/register?message=Error during registration');
  }
});

app.get('/login', (req, res) => {
  res.render('login', { message: req.query.message });
});

app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.redirect('/login?message=User not registered');
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (isMatch) {
      req.session.userId = user._id;
      res.redirect('/dashboard');
    } else {
      res.redirect('/login?message=Incorrect username or password');
    }
  } catch (error) {
    console.error('Login error:', error);
    res.redirect('/login?message=Error during login');
  }
});

app.get('/dashboard', async (req, res) => {
  try {
    if (req.session.userId) {
      const user = await User.findById(req.session.userId);
      const files = await File.find({ owner: req.session.userId });
      res.render('dashboard', { user: user, files: files });
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Dashboard error:', error);
    res.redirect('/login?message=Error loading dashboard');
  }
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.redirect('/login');
    }

    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const file = new File({
      name: req.file.originalname,
      path: req.file.filename,
      owner: req.session.userId
    });

    await file.save();
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).send('An error occurred during upload: ' + error.message);
  }
});

app.get('/download/:fileId', async (req, res) => {
  try {
    if (req.session.userId) {
      const file = await File.findOne({ _id: req.params.fileId, owner: req.session.userId });
      if (file) {
        res.download(path.join(uploadDir, file.path), file.name);
      } else {
        res.status(404).send('File not found');
      }
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).send('An error occurred during download: ' + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
