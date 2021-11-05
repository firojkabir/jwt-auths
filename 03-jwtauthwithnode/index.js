const express = require('express')
const auth = require('./routes/auth')

const app = express()

app.use(express.json())

app.use('/auth', auth)

app.get('/', (req, res) => {
    res.send("Welcome to the app!")
})

app.listen(3001, () => console.log("App is running on 3001 port!!"))
