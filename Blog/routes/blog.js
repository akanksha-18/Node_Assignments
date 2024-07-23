// const { Router } = require("express");
// const multer = require('multer');
// const path = require('path');
// const Blog = require('../models/blog');
// const Comment=require('../models/comment');

// const router = Router();

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.resolve(`./public/uploads/`));
//     },
//     filename: function (req, file, cb) {
//         const fileName = `${Date.now()}-${file.originalname}`;
//         cb(null, fileName);
//     }
// });

// const upload = multer({ storage: storage });

// router.get('/add-new', (req, res) => {
//     return res.render('addBlog', {
//         user: req.user,
//     });
// });
// router.get('/:id',async(req,res)=>{
//     const blog=await Blog.findById(req.params.id).populate('createdBy')
//     const comments=await Comment.find({blogId:req.params.id}).populate('createdBy')
//     console.log("cooments",comments);
//     return res.render('blog',{
//         user:req.user,
//         blog,
//         comments,
//     })
// })

// router.post('/comment/:blogId',async(req,res)=>{
//     await Comment.create({
//         content:req.body.content,
//         blogId:req.params.blogId,
//         createdBy:req.user._id
//     })
//     return res.redirect(`/blog/${req.params.blogId}`);
// })

// router.post('/', upload.single('coverImage'), async (req, res) => {
//     const { title, body } = req.body;
//     const blog = await Blog.create({
//         body,
//         title,
//         createdBy: req.user._id,
//         coverImageURL: `/uploads/${req.file.filename}` // Corrected here
//     });
//     return res.redirect(`/blog/${blog._id}`);
// });

// module.exports = router;

const { Router } = require("express");
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blog');
const Comment = require('../models/comment');

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

router.get('/add-new', (req, res) => {
    return res.render('addBlog', {
        user: req.user,
    });
});

router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('createdBy');
        const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy');
        if (!blog) {
            return res.status(404).send('Blog not found');
        }
        return res.render('blog', {
            user: req.user,
            blog,
            comments,
        });
    } catch (error) {
        return res.status(500).send('Server error');
    }
});

router.post('/comment/:blogId', async (req, res) => {
    try {
        await Comment.create({
            content: req.body.content,
            blogId: req.params.blogId,
            createdBy: req.user._id
        });
        return res.redirect(`/blog/${req.params.blogId}`);
    } catch (error) {
        return res.status(500).send('Server error');
    }
});

router.post('/', upload.single('coverImage'), async (req, res) => {
    try {
        const { title, body } = req.body;
        const blog = await Blog.create({
            body,
            title,
            createdBy: req.user._id,
            coverImageURL: `/uploads/${req.file.filename}`
        });
        return res.redirect(`/blog/${blog._id}`);
    } catch (error) {
        return res.status(500).send('Server error');
    }
});

// DELETE route for blog
router.delete('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).send('Blog not found');
        }

        if (blog.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).send('You are not authorized to delete this blog');
        }

        await Blog.findByIdAndDelete(req.params.id);
        await Comment.deleteMany({ blogId: req.params.id });
        // return res.status(200).send('Blog deleted successfully');
        return res.redirect('/');
    } catch (error) {
        return res.status(500).send('Server error');
    }
});

module.exports = router;
