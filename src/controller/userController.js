import {users} from '../models/userModel.js';
import crypto from 'crypto';

const controller = {
    index: (req, res) => {
        res.json({users});
    },

    getOne: (req, res) => {
        const id = req.params.id;
        const user = users.find(user => id === user.id);
        if(user) {
            return res.status(200).json({user});
        }

        res.status(404).json({message: "User not found!"});
    },

    store: (req, res) => {
        const {email, name} = req.body;

        const user = {
            id: crypto.randomUUID(),
            name,
            email
        };

        users.push(user);

        res.json({user});
    },

    update: (req, res) => {
        const id = req.params.id;

        const user = users.find(user => user.id === id);

        if (user) {
            const {name, email} = req.body;
            
            user.name = name || user.name;
            user.email = email || user.email;

           return res.json({user});
        }

        res.status(404).json({message: "User not found!"});
    },

    remove: (req, res) => {
        const id = req.params.id;

        const index = users.findIndex(user => user.id == id);

        if (index !== -1) {

            const user_deleted = users.splice(index, 1);

            return res.json({message: "User deleted successfully.", user_deleted})
        }

        res.status(404).json({message: "User not found!"});
    },
}

export default controller;