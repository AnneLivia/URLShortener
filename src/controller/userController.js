import UserModel from "../models/userModel.js";

const controller = {
  index: async (req, res) => {
    const users = await UserModel.find().lean();
    res.json({users});
  },

  getOne: async (req, res) => {
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
  },

  store: async (req, res) => {
    const {name, email, password, phones} = req.body;

    try {
        const user = await UserModel.create( {
            name, 
            email, 
            password,
            phones
        } )

        user.password = undefined; // to hide the password
        res.json({user})
    } catch (err) {
        console.error(err);
        res.status(400).json({message: "Unexpected error!"});
    }

  },

  update: async (req, res) => {
    const {id} = req.params;
    try {  
        const {email, password, phones, name, role} = req.body;
        const user = await UserModel.findByIdAndUpdate(id, 
            {email, name, password, phones, role}, 
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
  },

  remove: async (req, res) => {
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
  },
  
};

export default controller;
