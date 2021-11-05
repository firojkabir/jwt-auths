const router = require("express").Router()
const { check, validationResult } = require("express-validator")
const { users } = require("../db")

router.post("/signup", [
    check("email", "Please provide a valid email")
        .isEmail(),
    check("password", "Password must be upto 6 characters")
        .isLength({
            min: 6
        })
], (req, res) => {
    const { password, email } = req.body

    // Input Validation
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    // Existing User Validation
    let user = users.find((user) => {
        return user.email === email
    })

    if (user) {
        res.status(400).json({
            "errors": [
                {
                    "msg": "User email already exists!!!"
                }
            ]
        })
    }

    res.send("Validation passed!!")
})

module.exports = router
