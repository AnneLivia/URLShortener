const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

// Middleware to allow receive json from body

app.use(express.json());

// objeto usuario
const users = [ 
    {
        id: crypto.randomUUID(),
        name:"Livia",
        email: "annelivia16@gmail.com"
    }
]

// get all users
app.get("/api/user", (request, response, next) => {
    response.send({users});
});

// Get a specific user by passing a id (params)
app.get("/api/user/:id", (request, response, next) => {
    
    const id = request.params.id;

    const user = users.find(user => user.id === id);

    if (user)
        return response.send({user});
    
    response.status(404).send({message: "user not found!"});
});

app.post("/api/user", (request, response, next) => {

    const {email, name} = request.body;

    const user = {id: crypto.randomUUID(), 
                  name, 
                  email};

    users.push(user);

    response.send({user});
});

app.put("/api/user/:id", (request, response, next) => {
    const id = request.params.id;

    // verifying if this id exists
    const user = users.find(user => user.id === id);

    if (user) {
        // obtaining the data
        const {email, name} = request.body;
        
        // receives email and name, but if undefined (not passed through body), receives the current data
        user.name = name || user.name;
        user.email = email || user.email;

        return response.send({user});
    }

    response.status(404).send({message: "user not found!"});
});

app.delete("/api/user/:id", (request, response, next) => {
    const id = request.params.id;

    const index = users.findIndex(user => user.id === id);

    if (index != -1) {
        const deleted_user = users.splice(index, 1);

        return response.send({deleted_user});
    }

    response.status(404).send({message: "user not found!"});
});

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});
