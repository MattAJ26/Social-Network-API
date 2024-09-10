const router = require('express').Router();
const thoughtRoutes = require('./thoughtRoutes');
const userRoutes = require('./userRoutes');
// All of these routes are prefixed with '/api' 
router.use('/thoughts', thoughtRoutes);  // 'api/thoughts'
router.use('/users', userRoutes);    // '/api/users'

module.exports = router;
