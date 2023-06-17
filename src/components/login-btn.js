import './login-btn.css';

function LoginBtn({ loggedIn, loginPage }) {
    const CLIENT_ID = "e2dfc94c4855417e850b8f3c33c46667";
    const REDIRECT_URI = "http://localhost:3000/";
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const RESPONSE_TYPE = "token";
    const url = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user-top-read&response_type=${RESPONSE_TYPE}`;

    const handleLogin = () => {
        window.location.href = url;
    }

    const handleLogout = () => {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user_id");
        window.localStorage.removeItem("username");
        window.localStorage.removeItem("PFP");
        window.location.reload();
    }

    return (
        <>
            {loggedIn ?
            <>
                <button className='login-button' onClick={handleLogout}>Logout</button>
            </>
            :
            <>
                <button className='login-button' onClick={handleLogin}>{loginPage ? "Login to Spotify" : "Login"}</button> 
            </>
            }

        </>
    )
}

export default LoginBtn;