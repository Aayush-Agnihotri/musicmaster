import { useState, useEffect, } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './song.css'
import axios from 'axios';
import Heart from "react-heart"

function Song() {
    const navigate = useNavigate();
    const { songID } = useParams();

    const token = window.localStorage.getItem("token");
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
        getBasicSongInfo();
        getSongFeatures();
        checkHeart();
    },[]);

    const getBasicSongInfo = async (e) => {
        const { data } = await axios.get("https://api.spotify.com/v1/tracks/" + songID, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        }).catch(response => { console.log(response) });
        setSongInfo(data);
        var dob = new Date(data.album.release_date);
        var dobArr = dob.toDateString().split(' ');
        var dobFormat = dobArr[1] + ' ' + dobArr[2] + ', ' + dobArr[3];
        setReleaseDate(dobFormat);
    }

    const getSongFeatures = async (e) => {
        const { data } = await axios.get("https://api.spotify.com/v1/audio-features/" + songID, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        }).catch(response => { console.log(response) });
        setSongFeatures(data);
        setDurationMin(parseInt(data.duration_ms / 60000));
        setDurationSec(Math.ceil(((data.duration_ms / 60000) * 60) % 60) === 60 ? 59 : Math.ceil(((data.duration_ms / 60000) * 60) % 60));
    }

    const getSongRecsTempo = async (e) => {
        const { data } = await axios.get("https://api.spotify.com/v1/recommendations/", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                seed_artists: songInfo.album.artists[0].id,
                seed_genres: "",
                seed_tracks: songID,
                limit: 8,
                target_tempo: songFeatures.tempo
            }
        }).catch(response => { console.log(response) });
        setSongRecsTempo(data);
    }

    const getSongRecsEnergy = async (e) => {
        const { data } = await axios.get("https://api.spotify.com/v1/recommendations/", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                seed_artists: songInfo.album.artists[0].id,
                seed_genres: "",
                seed_tracks: songID,
                limit: 8,
                target_energy: songFeatures.energy
            }
        }).catch(response => { console.log(response) });
        setSongRecsEnergy(data);
    }

    const getSongRecsValence = async (e) => {
        const { data } = await axios.get("https://api.spotify.com/v1/recommendations/", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                seed_artists: songInfo.album.artists[0].id,
                seed_genres: "",
                seed_tracks: songID,
                limit: 8,
                target_energy: songFeatures.valence
            }
        }).catch(response => { console.log(response) });
        setSongRecsValence(data);
    }

    const renderTempoRecs = () => {
        let newArr = songRecsTempo.tracks;
        for (let i = 0; i < songRecsTempo.tracks.length; i++) {
            if (newArr[i].name === songInfo.name) {
                newArr.splice(i, 1)
                break
            }
        }
        while (newArr.length > 5) {
            newArr.pop();
        }
        return newArr.map(arr => (
            <tbody>
                <tr>
                    <td className='song-rec-name'><button className='song-rec-button' onClick={() => {
                        navigate(`/song/${arr.id}`);
                        window.location.reload(false);
                    }}>{arr.name}</button></td>
                    <td><button className='song-rec-button' onClick={() => {
                        navigate(`/artist/${arr.artists[0].id}`);
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
                        navigate(`/song/${arr.id}`);
                        window.location.reload(false);
                    }}>{arr.name}</button></td>
                    <td><button className='song-rec-button' onClick={() => {
                        navigate(`/artist/${arr.artists[0].id}`);
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
                        navigate(`/song/${arr.id}`);
                        window.location.reload(false);
                    }}>{arr.name}</button></td>
                    <td><button className='song-rec-button' onClick={() => {
                        navigate(`/artist/${arr.artists[0].id}`);
                    }}>{arr.artists[0].name}</button></td>
                </tr>
            </tbody>
        ))
    }
    
    const checkHeart = async () => {
        const userID = window.localStorage.getItem("userID");
        axios.post("http://127.0.0.1:80/api/song/check", {
            data: {
                "userID": userID,
                "songID": songID
                }
            }).then(response => {
                setActive(response.data.data);
            })
    }

    const handleHeartClick = () => {
        const userID = window.localStorage.getItem("userID");
        if (active) {
            axios.post("http://127.0.0.1:80/api/song/remove", {
                data: {
                    "userID": userID,
                    "songID": songID
                }
            })
        } else {
            axios.post("http://127.0.0.1:80/api/song/add", {
                data: {
                    "userID": userID,
                    "songID": songID,
                    "acousticness": songFeatures.acousticness,
                    "danceability": songFeatures.danceability,
                    "duration_ms": songFeatures.duration_ms,
                    "energy": songFeatures.energy,
                    "instrumentalness": songFeatures.instrumentalness,
                    "key": songFeatures.key,
                    "liveness": songFeatures.liveness,
                    "loudness": songFeatures.loudness,
                    "mode": songFeatures.mode,
                    "speechiness": songFeatures.speechiness,
                    "tempo": songFeatures.tempo,
                    "time_signature": songFeatures.time_signature,
                    "valence": songFeatures.valence,
                    "target": 1,
                    "song_title": songInfo.name,
                    "artist": songInfo.artists[0].name,
                }
            });
        }
        setActive(!active);
    }

    useEffect(() => {
        if (songInfo && songFeatures) {
            getSongRecsTempo();
            getSongRecsEnergy();
            getSongRecsValence();
        }
    }, [songInfo, songFeatures])
    
    return (
        <>
            <div>
                {songInfo && songFeatures ? 
                <>
                    <div className='song-container'>
                        <div className='album-pic-container'>
                            <img className='album-pic' src={songInfo.album.images[0].url} alt='Album Cover' />
                        </div>
                        <div className='subheader-container'>
                            <h1 className='subheader-song'>{`${songInfo.name} `}
                                <Heart className = {`customHeart${active ? " active": ""}`} style={{ width: "1.5rem", fill: active ? "#ff7500" : "transparent", stroke: active ? "white" : "white" }} inactiveColor = "white" isActive={active} onClick={handleHeartClick} animationScale={1.2} animationTrigger="both" animationDuration={.2} />
                            </h1>
                            <h2 className='subheader-artist' onClick={() => {
                                navigate(`/artist/${songInfo.artists[0].id}`);
                            }}>{songInfo.artists[0].name}</h2>
                        </div>

                        <div className='song-data'>
                            <table className='song-data-table'>
                                <tr>
                                    <th className='song-data-headings'>Album</th>
                                    <th className='song-data-headings'>Released</th>
                                    <th className='song-data-headings'>Length</th>
                                </tr>
                                <tr>
                                    <td className='song-data-entries'>{songInfo.album.name}</td>
                                    <td className='song-data-entries'>{releaseDate}</td>
                                    <td className='song-data-entries'>
                                        {durationMin}<span style={{fontWeight: "250"}} >m</span> {durationSec}<span style={{fontWeight: "250"}} >s</span>
                                    </td>
                                </tr>
                            </table>
                            <table className='song-data-table'>
                                <tr>
                                    <th className='song-data-headings'>Tempo</th>
                                    <th className='song-data-headings'>Energy</th>
                                    <th className='song-data-headings'>Valence</th>
                                </tr>
                                <tr>
                                    <td className='song-data-entries'>
                                        {Math.round(songFeatures.tempo)} <span style={{fontWeight: "250"}} >bpm</span>
                                    </td>
                                    <td className='song-data-entries'>{songFeatures.energy}</td>
                                    <td className='song-data-entries'>{songFeatures.valence}</td>
                                </tr>
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
                </>
                : <></>}
            </div>
        </>
    )
}

export default Song;