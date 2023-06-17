import './login.css';
import Logo from '../images/logo.png';
import LoginBtn from '../components/login-btn';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {

    const [username, setUsername] = useState();
    const [searchKey, setSearchKey] = useState();
    const [loading, setLoading] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const storage = window.localStorage.getItem("username");
        if (storage) {
            setUsername(storage);
        }
    }, [])

    const searchSong = async (e) => {
        e.preventDefault()
        if (searchKey === "" || searchKey === undefined) {
            return;
        }
        setLoading(true);
        const {data} = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem("token")}`
            },
            params: {
                q: searchKey,
                type: "track"
            }
        }).catch(response => console.log("Error"));
        const songID = data.tracks.items[0].id
        setLoading(false)
        navigate(`/song/${songID}`);
      }


    return (
        <>
            <div className='login-container'>
                <div className='login-logo-container'>
                    <img className='login-logo' src={Logo} alt='MusicMaster Logo' />
                </div>
                <div className='login-title-container'>
                    <h1 className='login-title'>MusicMaster</h1>
                </div>
                {username ? 
                <>
                    <div className='login-description-container'>
                        <h2 className='login-description-title'>Welcome back, {username}!</h2>
                        <p className='login-description'>Search for a song and MusicMaster will come up with personalized recommendations for you!</p>
                        <form className='search-form' onSubmit={searchSong}>
                            <input type="text" onChange={e => setSearchKey(e.target.value)} placeholder="Enter song name"/>
                            <button id="login-button" className="big-btn search-btn" style={loading ? {backgroundColor: "#ff5300"} : {}}>{loading ? "Searching..." : "Search"}</button>
                        </form>
                    </div>
                </>
                : 
                <>
                    <div className='login-btn-container'>
                        <LoginBtn loggedIn={false} loginPage={true} />
                    </div>
                </>}

            </div>
        </>
    )
}

export default Login;