import './navbar.css';
import LoginBtn from './login-btn';
import Logo from '../images/logo.png';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Navbar() {
    const navigate = useNavigate();
    const [windowSize, setWindowSize] = useState([
        window.innerWidth,
        window.innerHeight,
      ]);
    const [loggedIn, setLoggedIn] = useState(false);
    const [token, setToken] = useState();
    const [PFP, setPFP] = useState();
    const [smallBrowser, setSmallBrowser] = useState(false);

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
        const handleWindowResize = () => {
          setWindowSize([window.innerWidth, window.innerHeight]);
        };
    
        window.addEventListener('resize', handleWindowResize);
    
        return () => {
          window.removeEventListener('resize', handleWindowResize);
        };
      }, []);

    useEffect(() => {
        if (token) {
            getProfileData();
            setLoggedIn(true);
        }
        if (!window.localStorage.token && window.location.pathname !== "/") {
            navigate('/');
        }
    }, [token])

    useEffect(() => {
        const nav = document.querySelector('.navbar');
        const nav_btn = document.querySelector('.nav-btn');
        const logo_container = document.querySelector('.logo-container');
        const links = document.querySelector('.links-container');
        if (windowSize[0] <= 500 && !loggedIn) {
            nav.style.width = '50%';
            nav.style.textAlign = 'center';
            nav.style.alignItems = 'center';
            nav_btn.style.display = 'none';
        }
        if (windowSize[0] > 500 && !loggedIn) {
            nav.style.width = '80%';
            nav_btn.style.display = 'inline-block';
        }
        if (windowSize[0] <= 700 && loggedIn) {
            setSmallBrowser(true);
            nav.style.width = '95%';
        }
        if (windowSize[0] <= 500 && loggedIn) {
            nav.style.display = 'flex';
            nav.style.flexDirection = 'column';
            nav_btn.style.display = 'inline-block';
            logo_container.style.display = 'flex';
            logo_container.style.flexDirection = 'column';
            logo_container.style.alignItems = 'center';
            logo_container.style.justifyContent = 'center';
        }
    }, [windowSize, loggedIn])

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
                        <div className='nav-btn'>
                            <LoginBtn loggedIn={loggedIn} />
                        </div>
                        {PFP && !smallBrowser ? 
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