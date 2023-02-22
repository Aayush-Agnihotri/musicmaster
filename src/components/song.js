import { useState, useEffect, } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './song.css'
import Navbar from './navbar';
import axios from 'axios';
import Heart from "react-heart"

function Song() {
    const location = useLocation();
    let navigate = useNavigate();

    const newLogout = () => {
        window.location.href = "/logout";
    }

    const token = location.state.loggedIn;
    const [songInfo, setSongInfo] = useState();
    const [songFeatures, setSongFeatures] = useState();

    const [songRecsTempo, setSongRecsTempo] = useState();
    const [songRecsEnergy, setSongRecsEnergy] = useState();
    const [songRecsValence, setSongRecsValence] = useState();

    const [durationMin, setDurationMin] = useState();
    const [durationSec, setDurationSec] = useState();
    const [releaseDate, setReleaseDate] = useState();

    const [active, setActive] = useState(false)

    useEffect(() => {
        let ignore = false;
        if (!ignore) {
            renderPage();
        }
        return () => { ignore = true; }
    },[]);

    const renderPage = async (e) => {
        getBasicSongInfo();
        getSongFeatures();
    }

    const getBasicSongInfo = async (e) => {
        const {data} = await axios.get("https://api.spotify.com/v1/tracks/" + location.state.id, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        }).catch(response => { console.log(response) });
        setSongInfo(data);
        var dob = new Date(data.album.release_date);
        var dobArr = dob.toDateString().split(' ');
        var dobFormat = dobArr[1] + ' ' + dobArr[2] + ', ' + dobArr[3];
        setReleaseDate(dobFormat)
    }

    const getSongFeatures = async (e) => {
        const {data} = await axios.get("https://api.spotify.com/v1/audio-features/" + location.state.id, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        }).catch(response => { console.log(response) });
        setSongFeatures(data);
        setDurationMin(parseInt(data.duration_ms / 60000))
        setDurationSec(Math.ceil(((data.duration_ms / 60000) * 60) % 60) === 60 ? 59 : Math.ceil(((data.duration_ms / 60000) * 60) % 60))
    }

    const getSongRecsTempo = async (e) => {
        const {data} = await axios.get("https://api.spotify.com/v1/recommendations/", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                seed_artists: songInfo.album.artists[0].id,
                seed_genres: "",
                seed_tracks: location.state.id,
                limit: 8,
                target_tempo: songFeatures.tempo
            }
        }).catch(response => { console.log(response) });
        setSongRecsTempo(data)
    }

    const getSongRecsEnergy = async (e) => {
        const {data} = await axios.get("https://api.spotify.com/v1/recommendations/", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                seed_artists: songInfo.album.artists[0].id,
                seed_genres: "",
                seed_tracks: location.state.id,
                limit: 8,
                target_energy: songFeatures.energy
            }
        }).catch(response => { console.log(response) });
        setSongRecsEnergy(data)
    }

    const getSongRecsValence = async (e) => {
        const {data} = await axios.get("https://api.spotify.com/v1/recommendations/", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                seed_artists: songInfo.album.artists[0].id,
                seed_genres: "",
                seed_tracks: location.state.id,
                limit: 8,
                target_energy: songFeatures.valence
            }
        }).catch(response => { console.log(response) });
        setSongRecsValence(data)
    }

    const renderTempoRecs = () => {
        let newArr = songRecsTempo.tracks
        for (let i = 0; i < songRecsTempo.tracks.length; i++) {
            if (newArr[i].name === songInfo.name) {
                newArr.splice(i, 1)
                break
            }
        }
        while (newArr.length > 5) {
            newArr.pop()
        }

        return newArr.map(arr => (
            <tbody>
                <tr>
                    <td className='song-rec-name'><button className='song-rec-button' onClick={() => {
                        navigate("/song", {state: {id: arr.id, loggedIn: location.state.loggedIn, logout: location.state.logout, pfp: location.state.pfp, user: location.state.user}});
                        window.location.reload(false);
                    }}>{arr.name}</button></td>
                    <td><button className='song-rec-button' onClick={() => {
                        navigate("/artist", {state: {id: arr.artists[0].id, loggedIn: location.state.loggedIn, logout: location.state.logout, pfp: location.state.pfp, user: location.state.user}});
                    }}>{arr.artists[0].name}</button></td>
                </tr>
            </tbody>
        ))
    }
    
    

    const renderEnergyRecs = () => {
        let newArr = songRecsEnergy.tracks
        for (let i = 0; i < songRecsEnergy.tracks.length; i++) {
            if (newArr[i].name === songInfo.name) {
                newArr.splice(i, 1)
                break
            }
        }
        while (newArr.length > 5) {
            newArr.pop()
        }

        return newArr.map(arr => (
            <tbody>
                <tr>
                    <td className='song-rec-name'><button className='song-rec-button' onClick={() => {
                        navigate("/song", {state: {id: arr.id, loggedIn: location.state.loggedIn, logout: location.state.logout, pfp: location.state.pfp, user: location.state.user}});
                        window.location.reload(false);
                    }}>{arr.name}</button></td>
                    <td><button className='song-rec-button' onClick={() => {
                        navigate("/artist", {state: {id: arr.artists[0].id, loggedIn: location.state.loggedIn, logout: location.state.logout, pfp: location.state.pfp, user: location.state.user}});
                    }}>{arr.artists[0].name}</button></td>
                </tr>
            </tbody>
        ))
    }

    const renderValenceRecs = () => {
        let newArr = songRecsValence.tracks
        for (let i = 0; i < songRecsValence.tracks.length; i++) {
            if (newArr[i].name === songInfo.name) {
                newArr.splice(i, 1)
                break
            }
        }
        while (newArr.length > 5) {
            newArr.pop()
        }

        return newArr.map(arr => (
            <tbody>
                <tr>
                    <td className='song-rec-name'><button className='song-rec-button' onClick={() => {
                        navigate("/song", {state: {id: arr.id, loggedIn: location.state.loggedIn, logout: location.state.logout, pfp: location.state.pfp, user: location.state.user}});
                        window.location.reload(false);
                    }}>{arr.name}</button></td>
                    <td><button className='song-rec-button' onClick={() => {
                        navigate("/artist", {state: {id: arr.artists[0].id, loggedIn: location.state.loggedIn, logout: location.state.logout, pfp: location.state.pfp, user: location.state.user}});
                    }}>{arr.artists[0].name}</button></td>
                </tr>
            </tbody>
        ))
    }

    // const addTempo = async (e) => {
    //     e.preventDefault()
    //     console.log(location.state.user)
    //     const {data} = await axios.get("https://api.spotify.com/v1/search", {
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //         },
    //         params: {
    //             type: "track"
    //         }
    //     }).catch(response => console.log("Error"));
        
    // }

    // const addEnergy = async (e) => {
    //     e.preventDefault()
    //     // console.log(location.state.user)
    //     const {data} = await axios.get("https://api.spotify.com/v1/search", {
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //         },
    //         params: {
    //             type: "track"
    //         }
    //     }).catch(response => console.log("Error"));
        
    // }

    // const addValence = async (e) => {
    //     e.preventDefault()
    //     // console.log(location.state.user)
    //     const {data} = await axios.get("https://api.spotify.com/v1/search", {
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //         },
    //         params: {
    //             type: "track"
    //         }
    //     }).catch(response => console.log("Error"));
        
    // }

    useEffect(() => {
        if (songInfo && songFeatures) {
            getSongRecsTempo();
            getSongRecsEnergy();
            getSongRecsValence();
        }
    }, [songInfo, songFeatures])

    
    
    return (
        <>
            <Navbar loggedIn={location.state.loggedIn} logout={newLogout} pfp={location.state.pfp} />
            <div>
                {songInfo && songFeatures ? 
                <>
                    <div className='song-container'>
                        <img className='albumPic' src={songInfo.album.images[0].url} alt='Album Cover' />
                        <h1 className='subheader song'>{songInfo.name} <Heart style={{ width: "1.5rem", fill: active ? "#ff7500" : "transparent", stroke: active ? "white" : "white" }} inactiveColor = "white" isActive={active} onClick={() => setActive(!active)} animationScale = {1.2} animationTrigger = "both" animationDuration = {.2} className = {`customHeart${active ? " active": ""}`}/></h1>
                        <h2 className='subheader artist' style={{fontWeight: "250", marginTop: "-10px", cursor: "pointer"}} onClick={() => {
                            navigate("/artist", {state: {id: songInfo.artists[0].id, loggedIn: location.state.loggedIn, logout: location.state.logout, pfp: location.state.pfp, user: location.state.user}});
                        }} >{songInfo.artists[0].name}</h2>

                        <div className='song-data'>
                            <table className='song-data-table'>
                                <tr><th className='song-data-headings'>Album</th> <th className='song-data-headings'>Released</th> <th className='song-data-headings'>Length</th></tr>
                                <tr><td className='song-data-entries'>{songInfo.album.name}</td> <td className='song-data-entries'>{releaseDate}</td> <td className='song-data-entries'>{durationMin}<span style={{fontWeight: "250"}} >m</span> {durationSec}<span style={{fontWeight: "250"}} >s</span></td></tr>
                            </table>
                            
                            <table className='song-data-table'>
                                <tr><th className='song-data-headings'>Tempo</th> <th className='song-data-headings'>Energy</th> <th className='song-data-headings'>Valence</th></tr>
                                <tr><td className='song-data-entries'>{Math.round(songFeatures.tempo)} <span style={{fontWeight: "250"}} >bpm</span></td> <td className='song-data-entries'>{songFeatures.energy}</td> <td className='song-data-entries'>{songFeatures.valence}</td></tr>
                            </table>
                        </div>
                    </div>

                    <br></br><br></br><br></br><br></br><br></br>

                    <div className='rec-container'>
                        <h1 className='subheader'>Songs with similar...</h1>
                        <table className='rec-table'>
                            <tr><th><h1 className='rec-header' style={{fontWeight: "250"}}>Tempo</h1></th><th><h1 className='rec-header' style={{fontWeight: "250"}}>Energy</h1></th><th><h1 className='rec-header' style={{fontWeight: "250"}}>Valence</h1></th></tr>
                            <tr>
                                <td>
                                    <div class="card">
                                        <div>
                                            <div>
                                                <table class="content-table">
                                                    <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Artist</th>
                                                    </tr>
                                                    </thead>
                                                    {songRecsTempo ? renderTempoRecs() : <></>}
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="card">
                                        <div class="container">
                                            <div>
                                                <table class="content-table">
                                                    <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Artist</th>
                                                    </tr>
                                                    </thead>
                                                    {songRecsEnergy ? renderEnergyRecs() : <></>}
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="card">
                                        <div class="container">
                                            <div>
                                                <table class="content-table">
                                                    <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Artist</th>
                                                    </tr>
                                                    </thead>
                                                    {songRecsValence ? renderValenceRecs() : <></>}
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>

                    {/* <div className='buttons'>
                        <table className='button-table'>
                            <tr>
                                <th>
                                    <button className='big-btn' onClick={addTempo} >Add All to Playlist</button>
                                </th>
                                <th>
                                    <button className='big-btn' onClick={addEnergy} >Add All to Playlist</button>
                                </th>
                                <th>
                                    <button className='big-btn' onClick={addValence} >Add All to Playlist</button>
                                </th>
                            </tr>
                        </table>
                    </div> */}

                </>
                : <></>}
            </div>
        </>
    )
}

export default Song;