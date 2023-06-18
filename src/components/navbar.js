import './navbar.css';
import LoginBtn from './login-btn';
import Logo from '../images/logo.png';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Navbar() {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    const [token, setToken] = useState();
    const [PFP, setPFP] = useState();

    useEffect(() => {
        const hash = window.location.hash
        let localToken = window.localStorage.getItem("token")
        if (!localToken && hash) {
            localToken = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
            window.location.hash = ""
            window.localStorage.setItem("token", localToken)
        }
        setToken(localToken)
    }, [])

    useEffect(() => {
        if (token) {
            getProfileData();
            setLoggedIn(true);
        }
        if (!window.localStorage.token && window.location.pathname !== "/") {
            navigate('/');
        }
    }, [token])

    const getProfileData = async (e) => {
        const { data } = await axios.get("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).catch(response => console.log(response));
        window.localStorage.setItem("userID", data.id);
        window.localStorage.setItem("PFP", data.images[0].url);
        setPFP(data.images[0].url);
    }

    return (
        <>
            <div className='navbar-container'>
                <div className='navbar'>
                    <div className='logo-container'>
                        <Link className='logo-link' to={'/'}>
                            <img className='logo' src={Logo} alt='MusicMaster Logo' />
                            <span className='logo-title'>MusicMaster</span>
                        </Link>
                    </div>
                    <div className='links-container'>
                        {loggedIn ? 
                            <Link className='favorites-link' to={'/favorites'}>
                                Favorites
                            </Link>
                        : <></>}
                        <LoginBtn loggedIn={loggedIn} />
                        {PFP ? 
                            <>
                                <div className='pfp-container'>
                                    <img className='pfp' src={PFP} alt='Profile' />
                                </div>
                            </> : <></>}
                    </div>
                </div>
            </div>
            <Outlet />
        </>
    );
}

export default Navbar;