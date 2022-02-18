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

const UserModel = mongoose.model("users", userSchema);

export default UserModel;
