const { allEvents, firstEvent, events, lastEvents } = require('./events')

const { DateTime } = require('luxon')

require('dotenv').config()
const {CONNECTION_STRING} = process.env
const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs')

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

let newGameId = 7

module.exports = {
    getAllEvents: (req, res) => {
        function randomizeEvents(arr) {
            for(let i = arr.length - 1; i > 0; i--){
                let j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr
        }
        let randomEvents = randomizeEvents(events);

        allEvents.push(firstEvent[0])
        randomEvents.forEach((evt) => {
            allEvents.push(evt)
        })
        allEvents.push(lastEvents[0], lastEvents[1]);

        res.status(200).send(allEvents)
        },
    createAccount: async (req, res) => {
        try {
            const { username, password } = req.body
            const existingUser = await sequelize.query(`SELECT * FROM users
            WHERE username = '${username}'`)

            if(existingUser[0][0]) {
                return res.status(409).send('username already exists')
            }

            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)

            let user = await sequelize.query(`INSERT INTO users
            (username, password)
            VALUES ('${username}', '${hash}')
            RETURNING *;`)

            user = user[0][0]
            delete user.password

            req.session.user = user

            res.status(200).send(req.session.user)

        } catch (error) {
            console.log(error)            
        }
    },
    login: async (req, res) => {
        try {
            const { username, password } = req.body
            const existingUser = await sequelize.query(`SELECT * FROM users
            WHERE username = '${username}'`)

            if(!existingUser[0][0]) {
                return res.status(400).send('error logging in')
            }

            const isAuthenticated = bcrypt.compareSync(password, existingUser[0][0].password)

            if(!isAuthenticated) {
                return res.status(400).send('error logging in')
            }

            delete existingUser[0][0].password
            req.session.user = existingUser[0][0]
            res.status(200).send(req.session.user)

        } catch(error) {
            console.log(error)
        }
    },
    logout: (req, res) => {
        try {
            req.session.destroy()
            res.sendStatus(200)
        } catch (error) {
            console.log(error)
        }
     },
    getPlayerHistory: async (req, res) => {
        const { id } = req.session.user
        const previousGames = await sequelize.query(`SELECT game_date, knight_name, score, game_id
        FROM playthroughs 
        WHERE user_id = ${id};`)

        res.status(200).send(previousGames[0])
    },
    getLeaderboard: async (req, res) => {
        const leaderboard = await sequelize.query(`SELECT playthroughs.game_date, users.username, playthroughs.game_id, playthroughs.score
        FROM playthroughs
        JOIN users
        ON playthroughs.user_id = users.id
        ORDER BY score desc
        LIMIT 5;`)

         console.log(leaderboard)

        res.status(200).send(leaderboard)
    },
    saveGame: async (req, res) => {

        const { user_id, knight_name, score } = req.body
        let now = Date.now()
        let dateNow = new DateTime(now)
        let game_date = dateNow.toISODate()
        await sequelize.query(`INSERT INTO playthroughs (user_id, game_date, knight_name, score) VALUES(${user_id}, '${game_date}', '${knight_name}', ${score});`)
        res.status(200).send('game saved successfully')
    }
}
