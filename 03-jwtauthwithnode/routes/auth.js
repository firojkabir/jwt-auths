const router = require("express").Router()
const { check, validationResult } = require("express-validator")
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")

const { users } = require("../db")

router.post("/signup", [
    check("email", "Please provide a valid email")
        .isEmail(),
    check("password", "Password must be upto 6 characters")
        .isLength({
            min: 6
        })
], async (req, res) => {
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
        return res.status(400).json({
            "errors": [
                {
                    "msg": "User email already exists!!!"
                }
            ]
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    users.push({
        email,
        password: hashedPassword
    })

    const token = await JWT.sign({
        email
    }, "hsfkhwehg35625jkhs34jkhfh56jdjlsn", {
        expiresIn: 3600000
    })

    res.json({
        token
    })
})

router.post("/login", async (req, res) => {
    const { password, email } = req.body

    let user = users.find((user) => {
        return user.email === email
    })

    if (!user) {
        return res.status(400).json({
            "errors": [
                {
                    "msg": "Invalid credentials!!!"
                }
            ]
        })
    }

    let isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        return res.status(400).json({
            "errors": [
                {
                    "msg": "Invalid credentials!!!"
                }
            ]
        })
    }

    const token = await JWT.sign({
        email
    }, "hsfkhwehg35625jkhs34jkhfh56jdjlsn", {
        expiresIn: 3600000
    })

    res.json({
        token
    })
})

router.get("/all", (req, res) => {
    res.json(users)
})

module.exports = router
