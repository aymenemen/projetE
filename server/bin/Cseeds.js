const mongoose = require('mongoose');
const Comment = require('./models/comment.model');



const mockCommentData = [
    {
        user: userId1, 
        course: courseId1, 
        content: "This course is amazing! I learned so much.",
        upvotes: 10,
        downvotes: 2
    },
    {
        user: userId2, 
        course: courseId1,
        content: "I found this course really helpful for beginners.",
        upvotes: 5,
        downvotes: 1
    },
    {
        user: userId3, 
        course: courseId2, 
        content: "I didn't like this course. It was too advanced for me.",
        upvotes: 2,
        downvotes: 8
    },
    
];

// Function to insert mock comments into the database
const seedComments = async () => {
    try {
        // Clear existing comments
        await Comment.deleteMany();

        // Insert mock comments
        const insertedComments = await Comment.insertMany(mockCommentData);
        console.log('Inserted mock comments:', insertedComments.length);

        console.log('Seed completed successfully.');
    } catch (error) {
        console.error('Seed failed:', error);
    } finally {
        mongoose.disconnect();
    }
};

// Run seed function
seedComments();
