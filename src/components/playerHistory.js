import { useHistory, withRouter } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import axios from 'axios'



function PlayerHistory(props) {

    const [loading, setLoading] = useState(true)
    const [previousGames, setPreviousGames] = useState(null)

    let history = useHistory()

    function getPlayerHistoryFront() {
        if (!previousGames) {
            axios.get('/api/playerhistory')
                .then(res => {
                  setPreviousGames(res.data)
                  setLoading(false)
                })
        }
        
      }

      useEffect(()=>{
          getPlayerHistoryFront()
        }, [previousGames])



    const handleNewGameButton = () => {
        history.push("/getname")
    }

    function handleLogout() {
        props.setLoading(true)
        axios.get(`/auth/logout`)
            .then(() => {
              props.setUser(null)
              props.setLoading(false)
            })
        history.push('/')
      }

      console.log(props.user)
    return (

        <section className='player-history-section'>
            <h1 id="previous-games-title">Welcome, {props.user.username} </h1>
            <section id="previous-games-container">
                <h1 id="previous-games">Previous Games</h1>
                <ul>
                {
                loading? 
                <li>loading . . . </li> :
                previousGames.map(({ game_date, knight_name, score, game_id }) => <li key={game_id} >{`${game_date}  -  Score: ${score}  -  ${knight_name}`}</li>)
                                    
                }
                </ul>         
            </section>
            <button id="start-new-game-button" onClick={handleNewGameButton}>Start New Game</button>
            <br/>
            <br/>
            <button onClick={handleLogout}>Logout</button>
        </section>

    )
}

export default withRouter(PlayerHistory)