const express = require('express');
const authController = require('../controller/userController');
const errorHandler = require('../helper/errorHandel'); 

const router = express.Router();

router.post('/register/customer', (req, res, next) => {
  req.body.role = 'customer'; 
  authController.registerCustomer(req, res, next);
});

router.post('/register/admin', (req, res, next) => {
  req.body.role = 'admin'; 
  authController.registerAdmin(req, res, next);
});

router.get('/verify/:token', authController.verifyEmail);

router.post('/login/admin', authController.loginAdmin);
router.post('/login/customer', authController.loginCustomer);

router.use(errorHandler);



module.exports = router;
