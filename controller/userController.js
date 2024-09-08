const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../models');
const CustomError = require('../helper/customError');
const Messages = require('../helper/errorMessage');
const { sendVerificationEmail } = require('../helper/mailer');

// Register Customer
exports.registerCustomer = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        status: false,
        message: "All fields (first name, last name, email, and password) are required.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: false,
        message: "Please enter a valid email address.",
      });
    }

    // Password strength validation
    if (password.length < 6) {
      return res.status(400).json({
        status: false,
        message: "Password should be at least 6 characters long.",
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: Messages.EMAIL_ALREADY_EXISTS,
      });
    }
    if (!process.env.EMAIL_USER) {
      return res.status(400).json({
        status: false,
        message: "Email configuration is missing. Please add your email and password for sending verification emails.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

  
    const verificationToken = uuidv4();

    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: 'customer',
      email_verification_token: verificationToken,
    });

  

    await sendVerificationEmail(email, verificationToken);


    res.status(201).json({
      status: true,
      message: Messages.REGISTRATION ,
    });

  } catch (error) {
    next(error);
  }
};


// Register Admin

exports.registerAdmin = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        status: false,
        message: "All fields (first name, last name, email, and password) are required.",
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: false,
        message: "Please enter a valid email address.",
      });
    }

    // Password strength validation
    if (password.length < 6) {
      return res.status(400).json({
        status: false,
        message: "Password should be at least 6 characters long.",
      });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser)return res.status(200).send({ status:false,message :Messages.EMAIL_ALREADY_EXISTS});

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();

    if (!process.env.EMAIL_USER) {
      return res.status(400).json({
        status: false,
        message: "Email configuration is missing. Please add your email and password for sending verification emails.",
      });
    }
    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: 'admin',
      email_verification_token: verificationToken,
    });

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      status: true ,
      message: Messages.ADMINISTRATION,
    });
  } catch (error) {
    next(error);
  }
};

// Email Verification

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ where: { email_verification_token: token } });
    if (!user) return res.status(400).send({ status:true ,message :Messages.INVALID_VERIFICATION_TOKEN});
    user.is_verified = true;
    user.email_verification_token = null;
    await user.save();

    res.status(200).send({status:true ,message:Messages.EMAIL_VERIFIED});
  } catch (error) {
    next(error);
  }
};

  
  // Admin login 

  exports.loginAdmin = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ where: { email } });
      if (!user)return res.status(404).send({ status:false ,message :Messages.USER_NOT_FOUND});
  
      if (user.role !== 'admin') return res.status(403).send({ status:false ,message :Messages.NOT_ALLOWED_LOGIN});
  

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword)return res.status(400).send({ status:false ,message :Messages.INVALID_PASSWORD});
  
  
      if (!user.is_verified) return res.status(400).send({ status:false ,message :Messages.EMAIL_NOT_VERIFIED});
  
      const token = await jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
   
      return res.status(200).send({status:true ,message: 'logged in successfully',role: user.role , token });

    } catch (error) {
      next(error);
    }
  };

  
  // Customer login 

  exports.loginCustomer = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ where: { email } });
      if (!user)return res.status(404).send({ status:false ,message :Messages.USER_NOT_FOUND});

      if (user.role !== 'customer') return res.status(403).send({ status:false ,message :Messages.NOT_ALLOWED_LOGIN});
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword)return res.status(400).send({ status:false ,message :Messages.INVALID_PASSWORD});
  
    
      if (!user.is_verified) return res.status(400).send({ status:false ,message :Messages.EMAIL_NOT_VERIFIED});

      const token = await jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
   
      return res.status(200).send({status:true ,message: 'logged in successfully',role: user.role , token });

    } catch (error) {
      next(error);
    }
  };

  