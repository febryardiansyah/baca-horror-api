const express = require('express')
const app = express()
const cors = require('cors')
const db = require('./src/database/database')
const userRoutes = require('./src/routes/user.route')
const storyRoutes = require('./src/routes/story.route')
const config = require('./src/config/config')

const PORT = process.env.PORT || 3000

db.sync({ logging: false }).then(() => {
    console.log(`Database synced`);
}).catch((err) => {
    console.log(`Database failed sync: ${err}`);
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(userRoutes)
app.use(storyRoutes)

app.use('*', (req, res) => {
    return res.status(404).send({
        message: 'API path not found'
    })
})

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}, MODE: ${config.SERVER.mode}`);
})