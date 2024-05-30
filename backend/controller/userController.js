const asyncHandler = require("express-async-handler")

const registerUser = asyncHandler( async (req, res) => {
    const { name, email, password } = req.body
    
    // Validation
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Please fill in all the required Fields")
    }

    // Password Validation
    if (password.length < 6) {
        res.status(400)
        throw new Error("Password must be greater than 6 Characters")
    }
    

    
});

module.exports = {
  registerUser,
};
