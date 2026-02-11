import { User } from "../models/customer.models.js";

const getUsers = async (req, res) => {
  try {
    // console.log("getUsers");

    const users = await User.aggregate([
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "user_id",
          as: "user_bookings",
        },
      },
      {
        $addFields: {
          no_of_bookings: {
            $size: "$user_bookings",
          },
        },
      },
      {
        $project: {
          user_bookings: 0,
        },
      },
    ]);

    // console.log("Sending data");

    return res.status(200).json({ users });
  } catch (error) {
    console.log(error);
  }
};

const getTotalUsers = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        return res.status(200).json({total: totalUsers});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const ADMIN_EMAILS = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(",").map((email) => email.trim().toLowerCase())
  : []

const createUser = async (req, res) => {
  try {
    const { clerk_id, name, email, phone, driving_license_no, role } = req.body

    if (!clerk_id && !email) {
      return res.status(400).json({ message: "clerk_id or email is required" })
    }

    const normalizedEmail = email?.toLowerCase()
    const calculatedRole =
      role || (normalizedEmail && ADMIN_EMAILS.includes(normalizedEmail) ? "admin" : "user")

    const query = clerk_id ? { clerk_id } : { email: normalizedEmail }

    let user = await User.findOne(query)

    if (!user && normalizedEmail) {
      user = await User.findOne({ email: normalizedEmail })
    }

    if (user) {
      user.name = name || user.name
      user.email = normalizedEmail || user.email
      user.phone = phone || user.phone
      user.driving_license_no = driving_license_no || user.driving_license_no
      user.role = calculatedRole || user.role
      await user.save()

      return res.status(200).json({
        message: "User updated successfully",
        user,
      })
    }

    const newUser = new User({
      clerk_id,
      name,
      email: normalizedEmail,
      phone,
      driving_license_no,
      role: calculatedRole,
    })

    await newUser.save()

    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message || "Could not create user" })
  }
}

export { getUsers, getTotalUsers, createUser };