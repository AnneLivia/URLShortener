import UserModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

// import dotenv from 'dotenv';
// dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
class Controller {

  hashPassword (password) {

    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        return hash;

    } catch(err) {
        console.error(err);
    }
  }

 async index (req, res) {
    const users = await UserModel.find().lean();
    res.json({users});
  }

  async login(req, res) {
      
    const {email, password} = req.body;

    const user = await UserModel.findOne({email}).lean();

    if (!user)
        return res.status(404).json({message: "User not found!"}); // 404 = not found
        
    try {
        if (bcrypt.compareSync(password, user.password)) {
            delete user.password;

            const token = jwt.sign(user, JWT_SECRET);

            return res.json({token});
        }
    } catch (err) {
        console.error(err);
        return res.status(400).json({message: "Unexpected error!"});
    }

    return res.status(403).json({message: "Invalid password"}); // 403 = forbidden
  }

  async getOne (req, res) {
    const {id} = req.params;
    try {
        const user = await UserModel.findById(id);

        if (user) {
            return res.json({user});
        }

        res.status(404).json({message: "User not found!"});

    } catch (err) {
        console.error(err);
        res.status(400).json({message: "Unexpected error!"});
    }
  }

 async  store (req, res) {
    const {name, email, password, phones} = req.body;

    try {

        if (await UserModel.findOne({email}))
            return res.status(400).json({message: "User already exists!"});

        const user = await UserModel.create( {
            name, 
            email, 
            password: this.hashPassword(password),
            phones
        } )

        // user.password = undefined; // to hide the password
        res.json({user})
    } catch (err) {
        console.error(err);
        res.status(400).json({message: "Unexpected error!"});
    }

  }

  async update (req, res) {
    const {id} = req.params;
    try {  
        const {email, password, phones, name, role} = req.body;
        const user = await UserModel.findByIdAndUpdate(id, 
            {email, name, password: this.hashPassword(password), phones, role}, 
            {new: true, runValidators: true }
        );
        if (user) {
            return res.json({user});
        }

        res.status(404).json({message: "User not found!"});

    } catch (err) {
        console.error(err);
        res.status(400).json({message: "Unexpected error!"});
    }
  }

  async remove (req, res) {
    const id = req.params.id;
    try {
        const user = await UserModel.findByIdAndDelete(id);

        if (user) 
            return res.json({message: "User was removed!", user: user.email});

        res.status(404).json({message: "User not found!"});

    } catch (err) {
        console.error(err);
        res.status(400).json({message: "Unexpected error!"});
    }
  }
  
};

export default Controller;
