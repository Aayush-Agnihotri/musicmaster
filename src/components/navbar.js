import './navbar.css'
import { Link } from 'react-router-dom'

function Navbar( { loggedIn, logout, pfp }) {
    return (
        <>
            <nav className='nav'>
                <div className='logo'>
                    <Link to="/">
                        <img src={require('../images/logo.png')} alt='Logo' />
                        <a>MusicMaster</a>
                    </Link>
                </div>
                <div className='toggle'>
                    <a></a>
                </div>
                <ul className='menu'>
                    {loggedIn ?
                        <Link to="/favorites">
                            <li>
                                <a>Favorites</a>
                            </li>
                        </Link>
                    : <></>}
                    <li>{loggedIn ?
                        <div>
                            <button id='logout-btn' onClick={logout}>Logout</button>
                        </div>
                        : <></>}
                    </li>
                    {loggedIn ?
                        <div>
                            <img className='pfp' src={pfp} alt='Profile Picture' height={55} />
                        </div>
                        : <></>}
                </ul>
            </nav>            
        </>
    );
}

export default Navbar;