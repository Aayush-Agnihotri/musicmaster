import './artist.css'
import { useState, useEffect, } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Heart from "react-heart"

function Artist() {
    const navigate = useNavigate();
    const { artistID } = useParams();

    const token = window.localStorage.getItem("token");
    const [artistInfo, setArtistInfo] = useState();
    const [topTracks, setTopTracks] = useState();

    const [active, setActive] = useState(false);

    useEffect(() => {
        getArtist();
        getTopTracks();
        checkHeart();
    },[]);

    const getArtist = async (e) => {
        const {data} = await axios.get("https://api.spotify.com/v1/artists/" + artistID, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        }).catch(response => { console.log(response) });
        setArtistInfo(data);
    }

    const getTopTracks = async (e) => {
        const {data} = await axios.get("https://api.spotify.com/v1/artists/" + artistID + "/top-tracks", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                market: "ES"
            }
        }).catch(response => { console.log(response) });
        setTopTracks(data);
    }

    const renderTopTracks = () => {
        return topTracks.tracks.map(arr => (
            <tbody>
                <tr>
                    <td className='top-tracks-name'><button className='top-tracks-button' onClick={() => {
                        navigate(`/song/${arr.id}`);
                    }}>{arr.name}</button></td>
                    <td>{arr.album.name}</td>
                    <td>{parseInt(arr.duration_ms / 60000)}m {Math.ceil(((arr.duration_ms / 60000) * 60) % 60) === 60 ? 59 : Math.ceil(((arr.duration_ms / 60000) * 60) % 60)}s</td>
                </tr>
            </tbody>
        ))
    }

    const checkHeart = async () => {
        const userID = window.localStorage.getItem("userID");
        axios.post("http://127.0.0.1:80/api/artist/check", {
            data: {
                "userID": userID,
                "artistID": artistID
                }
            }).then(response => {
                setActive(response.data.data);
            })
    }

    const handleHeartClick = () => {
        const userID = window.localStorage.getItem("userID");
        const artistName = artistInfo.name;
        const artistGenre = artistInfo.genres[0] ? artistInfo.genres[0].toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ') : "Unknown";
        if (active) {
            axios.post("http://127.0.0.1:80/api/artist/remove", {
                data: {
                    "userID": userID,
                    "artistID": artistID
                }
            });
        } else {
            axios.post("http://127.0.0.1:80/api/artist/add", {
                data: {
                    "userID": userID,
                    "artistID": artistID,
                    "artistName": artistName,
                    "artistGenre": artistGenre,
                    "followers": artistInfo.followers.total.toLocaleString(),

                }
            });
        }
        setActive(!active);
    }

    return (
        <>
            {artistInfo && topTracks ? 
            <>
                <div className='artist-container'>
                    <div className='album-pic-container'>
                        <img className='album-pic' src={artistInfo.images[0].url} alt='Artist Cover' />
                    </div>
                    <div className='subheader-container'>
                        <h1 className='subheader-name'>{`${artistInfo.name} `}
                            <Heart className = {`customHeart${active ? " active": ""}`} style={{ width: "1.5rem", fill: active ? "#ff7500" : "transparent", stroke: active ? "white" : "white" }} inactiveColor = "white" isActive={active} onClick={handleHeartClick} animationScale={1.2} animationTrigger="both" animationDuration={.2} />
                        </h1>
                        <h2 className='subheader-artist' style={{fontWeight: "250", marginTop: "-10px"}}>Artist</h2>
                    </div>
                    <div className='artist-data'>
                        <table className='artist-data-table'>
                            <tr>
                                <th className='artist-data-headings'>Followers</th>
                                <th className='artist-data-headings'>Popularity</th>
                                <th className='artist-data-headings'>Genre</th>
                            </tr>
                            <tr>
                                <td className='artist-data-entries'>{artistInfo.followers.total.toLocaleString()}</td>
                                <td className='artist-data-entries'>{artistInfo.popularity}</td>
                                <td className='artist-data-entries'>{artistInfo.genres[0] ? artistInfo.genres[0].toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ') : "Unknown"}</td>
                            </tr>
                        </table>
                    </div>
                </div>

                <br></br><br></br><br></br><br></br><br></br>

                <div className='top-tracks-container'>
                    <h1 className='subheader' style={{marginTop: "-3%"}}>{artistInfo.name}'s Top Tracks</h1>
                    <table className='top-tracks-table'>
                        <tr>
                            <td>
                                <div class="card">
                                    <div>
                                        <div>
                                            <table class="content-table">
                                                <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Album</th>
                                                    <th>Length</th>
                                                </tr>
                                                </thead>
                                                {topTracks ? renderTopTracks() : <></>}
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
        </>
    )
}

export default Artist;