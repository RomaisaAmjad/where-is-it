const Router = require('express');
const itemRoutes = require('./item.route');
const router = Router();

router.use('/items', itemRoutes);

module.exports = router;
