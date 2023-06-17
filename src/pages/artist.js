import './artist.css'
import { useState, useEffect, } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function Artist() {
    const navigate = useNavigate();
    const { artistID } = useParams();

    const token = window.localStorage.getItem("token");
    const [artistInfo, setArtistInfo] = useState();
    const [topTracks, setTopTracks] = useState();

    useEffect(() => {
        getArtist();
        getTopTracks();
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
        console.log(topTracks.tracks)
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

    return (
        <>
            {artistInfo && topTracks ? 
            <>
                <div className='artist-container'>
                    <img className='albumPic' src={artistInfo.images[0].url} alt='Album Cover' />
                    <h1 className='subheader artist'>{artistInfo.name}</h1>
                    <h2 className='subheader artist-name' style={{fontWeight: "250", marginTop: "-10px"}}>Artist</h2>

                    <div className='artist-data'>
                        <table className='artist-data-table'>
                            <tr><th className='artist-data-headings'>Followers</th> <th className='artist-data-headings'>Popularity</th> <th className='artist-data-headings'>Genre</th></tr>
                            <tr><td className='artist-data-entries'>{artistInfo.followers.total.toLocaleString()}</td> <td className='artist-data-entries'>{artistInfo.popularity}</td> <td className='artist-data-entries'>{artistInfo.genres[0] ? artistInfo.genres[0].toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ') : "Unknown"}</td></tr>
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