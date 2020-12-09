module.exports = app => {

    app.use('/api/courses', require('./courses.routes.js'))
    app.use('/api/teachers', require('./teachers.routes.js'))
    app.use('/api/files', require('./files.routes.js'))
    app.use('/api', require('./auth.routes.js'))
}