const mongoose = require("mongoose");
const { randomBytes, createHmac } = require("crypto");
const { generateUserToken } = require("../services/auth");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImgUrl: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;

  next();
});

userSchema.static(
  "comparePasswordAndCreateToken",
  async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) {
      throw new Error("User was not found!");
    }

    const salt = user.salt;
    const hashedPassword = user.password;

    const enteredPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (hashedPassword !== enteredPassword) {
      throw new Error("Incorrect Password!");
    }

    const token = generateUserToken(user);
    return token;
  }
);

module.exports = mongoose.model("user", userSchema);
