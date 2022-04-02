const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
const { SECRET_KEY } = require("../../config");


function generateToken(user){
    return jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

}


const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validatiors");

module.exports = {
  Mutation: {
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);
      const user = await User.findOne({ username });
      if(!valid){
        throw new UserInputError("Errors", { errors });
      }
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);
     
      if (!match) {
        errors.general = "User not found";
        throw new UserInputError("Wrong credentials", { errors });
      }
      const token = generateToken(user)
      return {
          ...user._doc,
          id: user._id,
          token
      }
    },
    async register(
      _,
      { registerInput: { username, email, password, comfirmPassword } },
      context,
      info
    ) {
      // Validate user data
      const { errors, valid } = validateRegisterInput(
        username,
        email,
        password,
        comfirmPassword
      );

      console.log(errors, valid);
      if (!valid) {
        throw new UserInputError("Errors", {
          errors,
        });
      }

      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email: email,
        username: username,
        password: password,
        createdAt: new Date().toISOString(),
      });

      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("user is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }
      const res = await newUser.save();
      const token = generateToken(res)
      return {
        ...res._doc,
        id: res.id,
        token,
      };
    },
  },
};
