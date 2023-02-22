import './App.css';
import { useState, useEffect } from 'react';
import Navbar from './components/navbar';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

function App(props) {
  const CLIENT_ID = "e2dfc94c4855417e850b8f3c33c46667"
  const REDIRECT_URI = "http://localhost:3000/"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  const [token, setToken] = useState("")
  const [userID, setUserId] = useState("")
  const [username, setUsername] = useState("")
  const [pfp, setPFP] = useState("")
  const [loading, setLoading] = useState(false)
  let song = ""

  useEffect(() => {
      const hash = window.location.hash
      let token = window.localStorage.getItem("token")
      if (!token && hash) {
          token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
          window.location.hash = ""
          window.localStorage.setItem("token", token)
      }
      setToken(token)
  }, [])

  const getProfileData = async (e) => {
    const {data} = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).catch(response => console.log(response));
    setUserId(data.id)
    setUsername(data.display_name)
    setPFP(data.images[0].url)
  }
  
  getProfileData()

  const logout = () => {
    setToken("")
    setUsername("")
    window.localStorage.removeItem("token")
    window.localStorage.removeItem("username")
  }

  if (props.logout === true) {
    logout()
    window.location.href = "/";
  }

  const [searchKey, setSearchKey] = useState("")
  const [songData, setSongData] = useState()

  const searchSong = async (e) => {
    e.preventDefault()
    if (searchKey != "") {
        setLoading(true)
    }
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            q: searchKey,
            type: "track"
        }
    }).catch(response => console.log("Error"));
    song = {id: data.tracks.items[0].id, loggedIn: token, logout: logout, pfp: pfp, user: userID}
    setSongData(song)
    setSongData((state) => {
        return state;
      });
    setLoading(false)
  }

  return (
    <>
    <div>
        <Navbar loggedIn={token} logout={logout} pfp={pfp} />
        {!token ?
        <div id="login-content">
            <div id="login-container">
                <div className="login">
                    <img className='logo-img' alt='logo' src={require('./images/logo.png')} />
                    <h1>MusicMaster</h1>
                    <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user-top-read&response_type=${RESPONSE_TYPE}`}><button id="login-button" className="big-btn">Log in with Spotify</button></a>
                </div>
            </div>
        </div> : 
        <div id="login-content">
            <div id="login-container">
                <div className="login">
                    <img className='logo-img' alt='logo' src={require('./images/logo.png')} />
                    <h1>Welcome back, {username}!</h1>
                    <p>Search for a song and MusicMaster will come up with personalized recommendations for you!</p>
                    <br></br>
                    <form onSubmit={searchSong}>
                        <input type="text" onChange={e => setSearchKey(e.target.value)} placeholder="Enter song name"/>
                        <br></br>
                        <br></br>
                        {loading ? <button id="login-button" className="big-btn" style={{backgroundColor: "#ff5300"}} >Searching...</button> : <button type={'submit'} id="login-button" className="big-btn">Search</button>}
                    </form>
                    {songData ? <Navigate to="/song" state={JSON.parse(JSON.stringify(songData))} replace={true} /> : <></>}
                </div>
            </div>
        </div>}
    </div>
    </>
  );
}

export default App;