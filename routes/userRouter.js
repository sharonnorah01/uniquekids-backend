const router = require('express').Router() //require the Router
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/auth')

//View all users in the database
router.get('/view', async(req, res) => { 
  try {
    const viewUsers = await User.find({});
    if (viewUsers) res.send(viewUsers)
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  } 
})

//Register a new user in the db
router.post('/register', async(req, res) => {
    try{
         let { email, password, passwordCheck, displayName } = req.body;

         //validate
      if (!email || !password || !passwordCheck)
        return res.status(400).json({ msg: "all fields are required" });
      
         if (password.length < 6)
           return res
             .status(400)
             .json({ msg: "password should be atleast 6 characters" });
         if (password !== passwordCheck)
           return res
             .status(400)
          .json({ msg: "Enter the same password twice" });
      
      //checking if user already exists
      const existingUser = await User.findOne({ email: email })
      console.log(existingUser)
        if (existingUser)
             return res
             .status(400)
          .json({ msg: "this user exists" });
      if (!displayName) displayName = email

      //hashing the user password using bcryptjs
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt)
      
      //saving the new user
      const newUser = new User({  //new user model
        email,
        password: passwordHash,
        displayName
      })
      const savedUser = await newUser.save()
      res.json(savedUser)
            
    } catch (err) {
      console.log(err)
        res.status(500).json({error: err.message})

       }   
})

//login an existing user 
router.post('/login', async (req, res) => {
  
  try {
    const { email, password } = req.body

    //login validation
     if (!email || !password)
      return res.status(400).json({ msg: "all fields are required" });
    
    const user = await User.findOne({ email: email })
    if (!user)
      return res.status(400).json({ msg: "no account with that email exists" });
    const isMatch = await (bcrypt.compare(password, user.password))
    if (!isMatch)
       return res
         .status(400)
        .json({ msg: "invalid password" });
    
    //craeting a jwt token
    const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN);
    res.json({
      token,
      user:{
      id: user._id,
      displayName: user.displayName,
      }
     
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  } 
  
})

//Deleting a logged in user
router.delete('/delete', auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser)
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  } 
  
})

//Checking if the token is valid
router.post('/tokenIsValid', async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token)
      return res.json(false)
    const verifiedToken = jwt.verify(token, process.env.JWT_TOKEN);
    if (!verifiedToken)
      return res.json(false);
    const user = await User.findById(verifiedToken.id);
    if (!user)
      return res.json(false)
    return res.json(true)
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  } 
})

//get logged in user
router.get("/", auth, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const user = await User.findById(req.user);
    res.json({
      displayName: user.displayName,
      id: user._id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  } 
});

module.exports = router;