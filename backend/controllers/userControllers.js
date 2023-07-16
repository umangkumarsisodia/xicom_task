const User = require("../models/user");
const Address = require("../models/userAddress");
const Docs = require("../models/userDocs");

exports.createUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    dob,
    r_street1,
    r_street2,
    p_street1,
    p_street2,
  } = req.body;

  try {
    const newUser = await User.create({ firstName, lastName, email, dob });

    const newAddress = await Address.create({
      r_street1,
      r_street2,
      p_street1,
      p_street2,
      userId: newUser.id,
    });

    const newDocs = await Docs.create({
      userId: newUser.id,
    });

    req.files.forEach(
      async (element) => {
        const _newPath =
          "http://localhost:3589/" + element.path.replace(/\\/g, "/");
        await Docs.findByIdAndUpdate(newDocs.id, {
          $push: { docs: _newPath },
        });
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ success: true, msg: "Data saved successfully!!" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ msg: error });
  }
};

exports.findUserByEmail = async (req, res) => {
  const { email } = req.query;
  try {
    const findUser = await User.findOne({ email });
    if (findUser) {
      return res
        .status(200)
        .json({ success: true, msg: "A user exists with same email id." });
    }

    return res
    .status(200)
    .json({ success: false, msg: "No user exists with same email id." });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ msg: error });
  }
};
