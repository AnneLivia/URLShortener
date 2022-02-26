import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      // Mongoose replaces {VALUE} with the value being validated
      enum: {
        values: ["Administrator", "User"],
        message: "{VALUE} is not supported",
      },
      required: true,
      default: "User",
    },
    // Arrays implicitly have a default value of [] (empty array).
    phones: [String],
    // with select it is possible to specify if the path should be included or excluded from query results by default
    password: { type: String, required: true, /*select: false*/},
  },
  {
    timestamps: true,
  }
);

/*
// encryting the password with bcryptjs
userSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});*/

// mongo middleware that removes all documents from a specific user, when this user is deleted
userSchema.post("deleteOne", async function(next) {
  // 'this' referesents the query used inside the deleteOne method 
  // calling deleteOne does not return the _id, in order to get it, i need to use getFilter()["_id"], 
  // _id was passed in the query .deleteOne({_id : id }). So I can get it. getFilter = returns what I passed to the query
  const user = this.getFilter()['_id'];
  try {
    await mongoose.model('shortener').deleteMany({user}, next);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

const UserModel = mongoose.model("users", userSchema);

export default UserModel;
