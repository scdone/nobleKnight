import React from "react"
import { Link , useNavigate } from 'react-router-dom'

function Login(props) {

    let navigate = useNavigate()

    const handleClickAsGuest = () => {
        navigate('/getname')
    }

    const handleUserLogin = () => {
        navigate('/playerhistory')
    }

    return (
        <section className='login-section'>
                <div className="login-form column1">
                    <h2>Login</h2>
                <form className="user-login">
                    <label><b>username</b></label>
                    <br/>
                    <input type="text" placeholder="enter username" name="uname" id="username-input" required />
                    <br/>
                    <label><b>password</b></label>
                    <br/>
                    <input type="text" placeholder="enter password" name="passw" id="password-input" required />
                    <br/>
                    <input type="submit" id="login-submit-button" onClick={handleUserLogin}/>
                    <br/>
                    <Link to='/createaccount' id="create-acct-link">don't have an account? <br/> create one here</Link>
                </form>
                </div>
                <div className="play-as-guest column2">
                    <h2 className="play-guest">Play as Guest</h2>
                    <button className="enter-welcome-btn" onClick={handleClickAsGuest}>ENTER</button>
                </div>
        </section>

    )
}

export default Login
