import express from 'express'
import User from '../Models/userModel';
import { generateToken, isAuth } from '../utils';
import expressAsyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs';

const userRouter = express.Router();

userRouter.post(
  '/signin',
  expressAsyncHandler(async(req, res) => {
    const user = await User.findOne({ email: req.body.email });
    console.log(user)
    console.log(req.body)

    if(user) {
      if(bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user) 
        });
      return;
      }
  }
  res.status(401).send({message: 'Invalid email or password'})
})
)

userRouter.post('/signup',
  expressAsyncHandler(async(req, res) =>{
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user) 
    });
  })
);

userRouter.put('/profile', isAuth, expressAsyncHandler(async(req, res)=> {
  const user = await User.findById(req.user._id);
  console.log(user);
  if(user){
    user.name =req.body.name || user.name;
    user.email =req.body.email || user.email;
    if(req.body.password) {
      user.password = bcrypt.hashSync(req.body.password, 8)
    }
    const updatedUser = await user.save();
    res.send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser)
    });
  } else {
    res.status(404).send({message: 'User Not Found'})
  }
})

)

export default userRouter;
