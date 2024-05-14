const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Schema models
const Course = require('../models/course.model');
const Teacher = require('../models/teacher.model');
const User = require('../models/user.model');
const Comment= require('../models/comment.model')

const mockCourseData = [
    {
        imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
        title: 'Graphic Design Fundamentals',
        lead: 'Learn the basics of graphic design from industry professionals.',
        category: 'Design',
        difficultyLevel: 'Beginner',
        description: 'This course covers the fundamental principles of graphic design, including color theory, typography, and layout design.',
        whatYouWillLearn: ['Color theory', 'Typography', 'Layout design'],
        price: 29.99,
        duration: 30,
        requirements: ['Basic computer skills', 'No prior design experience required'],
        videos: ['https://youtu.be/CgkZ7MvWUAA?si=lqjwLGuLH5HcudPq', 'https://youtu.be/CgkZ7MvWUAA?si=lqjwLGuLH5HcudPq'],
        owner: null // Will be filled in after teacher creation
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
        title: 'Web Development Bootcamp',
        lead: 'Get started with web development in this comprehensive bootcamp.',
        category: 'Development',
        difficultyLevel: 'Intermidiate',
        description: 'This bootcamp covers HTML, CSS, JavaScript, and more to kickstart your career in web development.',
        whatYouWillLearn: ['HTML', 'CSS', 'JavaScript', 'Backend development'],
        price: 49.99,
        duration: 60,
        requirements: ['Basic understanding of HTML and CSS'],
        videos: ['https://youtu.be/CgkZ7MvWUAA?si=lqjwLGuLH5HcudPq', 'https://youtu.be/CgkZ7MvWUAA?si=lqjwLGuLH5HcudPq'],
        owner: null // Will be filled in after teacher creation
    },

];

const mockTeacherData = [
    {
        name: "John",
        surname: "Doe",
        jobOccupation: "Web Developer",
        description: "Experienced web developer with a passion for teaching.",
        imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
        linkedin: "https://www.linkedin.com/in/johndoe",
        website: "https://www.johndoe.com",
        youtube: "https://www.youtube.com/johndoe",
        user: null // Will be filled in after user creation
    },
    {
        name: "Jane",
        surname: "Smith",
        jobOccupation: "Graphic Designer",
        description: "Passionate graphic designer with years of industry experience.",
        imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
        linkedin: "https://www.linkedin.com/in/janesmith",
        website: "https://www.janesmith.com",
        youtube: "https://www.youtube.com/janesmith",
        user: null // Will be filled in after user creation
    },
    
];

const mockUserData = [
    {
        username: "john_doe",
        email: "john@example.com",
        // Password: password123
        password: '$2b$10$N4ywq2TWqNRWt79APf3V8Obw3yWZ6U8eYKDadCLcBRVcW3YnJ9V/W',
        role: "Student",
        imageUrl: "https://www.cmcaindia.org/wp-content/uploads/2015/11/default-profile-picture-gmail-2.png",
        favCourses: [],
        favTeachers: []
    },
    {
        username: "jane_smith",
        email: "jane@example.com",
        // Password: securepassword
        password: '$2b$10$JbTXhaU7mqnycS0QNVcV/OsoR9g5KU71Y5oGt/2/2vN8JiGj77fuG',
        role: "Teacher",
        imageUrl: "https://www.cmcaindia.org/wp-content/uploads/2015/11/default-profile-picture-gmail-2.png",
        favCourses: [],
        favTeachers: []
    },
    {
        username: "admin123",
        email: "admin@example.com",
        // Password: adminpassword
        password: '$2b$10$P1r5T3g5zZ0spxYqAKs./eJHmVd5rWhtXLZ20Nes/I8nES6NBSSb6',
        role: "Student",
        imageUrl: "https://www.cmcaindia.org/wp-content/uploads/2015/11/default-profile-picture-gmail-2.png",
        favCourses: [],
        favTeachers: []
    },
    
];
const mockCommentData = [
    {
        user: 'userId1', 
        course: 'courseId1', 
        content: "This course is amazing! I learned so much.",
        upvotes: 10,
        downvotes: 2
    },
    {
        user: 'userId2', 
        course: 'courseId1',
        content: "I found this course really helpful for beginners.",
        upvotes: 5,
        downvotes: 1
    },
    {
        user: 'userId3', 
        course:' courseId2', 
        content: "I didn't like this course. It was too advanced for me.",
        upvotes: 2,
        downvotes: 8
    },
    
];
// Database connection
mongoose.connect('mongodb://localhost:27017/projetE', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const seedDatabase = async () => {
    try {
      // Clear existing data
      await Promise.all([Course.deleteMany(), Teacher.deleteMany(), User.deleteMany(), Comment.deleteMany()]);
  
      // Encrypt passwords
      const saltRounds = 10;
      const encryptedMockUserData = mockUserData.map(user => {
        const passwordHash = bcrypt.hashSync(user.password, saltRounds);
        return { ...user, passwordHash };
      });
  
      // Insert mock users
      const insertedUsers = await User.insertMany(encryptedMockUserData);
      console.log('Inserted mock users:', insertedUsers.length);
  
      // Extract user ObjectIds
      const userIds = insertedUsers.map(user => user._id);
  
      // Modify teacher data to include user ObjectIds
      const teachersWithUserIds = mockTeacherData.map((teacher, index) => ({
        ...teacher,
        user: userIds[index % userIds.length], // Round-robin assignment of user ObjectIds
      }));
  
      // Insert mock teachers with corresponding user ObjectIds
      const insertedTeachers = await Teacher.insertMany(teachersWithUserIds);
      console.log('Inserted mock teachers:', insertedTeachers.length);
  
      // Fill in owner field in mock courses with teacher ObjectIds
      mockCourseData.forEach((course, index) => {
        course.owner = insertedTeachers[index % insertedTeachers.length]._id;
      });
  
      // Insert mock courses
      const insertedCourses = await Course.insertMany(mockCourseData);
      console.log('Inserted mock courses:', insertedCourses.length);
  
      // Create comments with random users and courses
      const insertedComments = await Comment.insertMany(mockCommentData.map(comment => ({
        ...comment,
        user: userIds[Math.floor(Math.random() * userIds.length)], // Assign random user
        course: insertedCourses[Math.floor(Math.random() * insertedCourses.length)]._id // Assign random course
      })));
      console.log('Inserted mock comments:', insertedComments.length);
  
      console.log('Seed completed successfully.');
    } catch (error) {
      console.error('Seed failed:', error);
    } finally {
      mongoose.disconnect();
    }
  };
  
  // Run seed function
  seedDatabase();
