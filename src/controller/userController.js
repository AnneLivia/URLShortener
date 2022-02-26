import UserModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// import dotenv from 'dotenv';
// dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
class Controller {
  hashPassword(password) {
    // I can pass an undefined password in case i don't update it, so use try and catch
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      return hash;
    } catch (err) {
      console.error(err);
      // password is undefined if it got here
      return undefined;
    }
  }

  async index(req, res) {
    if (req.loggedUser.role !== "Administrator")
      return res
        .status(403)
        .json({ message: "You are not allowed to see all users." }); // 403 Forbidden
    // only see all users if it is the administrator
    const users = await UserModel.find().lean();
    res.json({ users });
  }

  async login(req, res) {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }).lean();

    if (!user) return res.status(404).json({ message: "User not found!" }); // 404 = not found

    if (bcrypt.compareSync(password, user.password)) {
      delete user.password;

      const token = jwt.sign(user, JWT_SECRET);

      return res.json({ token });
    }

    return res.status(403).json({ message: "Invalid password" }); // 403 = forbidden
  }

  async getOne(req, res) {
    const { id } = req.params;
    try {
      const user = await UserModel.findById(id);

      // if user exists allow this request only if the current user logged is an administrator or
      // the user has the same id as the specified in params
      if (user) {
        // user._id.equals(string) = user._id is an instance of ObjectId, 
        // to campare their values it's necessary to use the ObjectID.equals method
        // or document._id.toString() can also works
        // or id === req.loggedUser._id = because both are string 
        if ( req.loggedUser.role === "Administrator" ||
          user._id.equals(req.loggedUser._id) ) { 
          return res.json({ user });
        }

        return res
          .status(403)
          .json({
            message: "You are not allowed to see this user's information.",
          });
      }

      res.status(404).json({ message: "User not found!" });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Unexpected error!" });
    }
  }

  async store(req, res) {
    const { name, email, password, phones } = req.body;

    try {
      if (await UserModel.findOne({ email }))
        return res.status(400).json({ message: "User already exists!" });

      const user = await UserModel.create({
        name,
        email,
        password: this.hashPassword(password),
        phones,
      });

      // user.password = undefined; // to hide the password
      res.json({ user });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Unexpected error!" });
    }
  }

  async update(req, res) {
    const { id } = req.params;

    // only allow update if logged user has the same id as the specified in params
    if (id !== req.loggedUser._id)
      return res.status(403).json({message: "You are not allowed to update this user's information"});

    try {
      const { email, password, phones, name, role } = req.body;

      const user = await UserModel.findByIdAndUpdate(
        id,
        { email, name, password: this.hashPassword(password), phones, role },
        { new: true, runValidators: true }
      );
      if (user) {
        return res.json({ user });
      }

      res.status(404).json({ message: "User not found!" });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Unexpected error!" });
    }
  }

  async remove(req, res) {
    const id = req.params.id;

    // only allow update if logged user has the same id as the specified in params
    if (id !== req.loggedUser._id)
      return res.status(403).json({message: "You are not allowed to delete this user"});

    try {
      const user = await UserModel.deleteOne({_id : id });

      if (user)
        return res.json({ message: "User was removed!", user/*user: user.email // o deleteOne retorna boolean e não o objeto*/ });

      res.status(404).json({ message: "User not found!" });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Unexpected error!" });
    }
  }
}

export default Controller;
