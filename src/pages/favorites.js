import './favorites.css'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Favorites() {
    const navigate = useNavigate();

    const [favoriteSongs, setFavoriteSongs] = useState();
    const [favoriteArtists, setFavoriteArtists] = useState();
    const [recommendedSongs, setRecommendedSongs] = useState();

    const userID = window.localStorage.getItem("userID");

    useEffect(() => {
        getFavoriteSongs();
        getFavoriteArtists();
        getRecommendedSongs();
    }, [])

    const getFavoriteSongs =  async () => {
        const { data } = await axios.post("http://127.0.0.1:80/api/songs", {            
            data: {
                "userID": userID
            }
        })
        setFavoriteSongs(data);
    }

    const getFavoriteArtists = async () => {
        const { data } = await axios.post("http://127.0.0.1:80/api/artists", {            
            data: {
                "userID": userID
            }
        })
        setFavoriteArtists(data.data);
    }

    const getRecommendedSongs = async () => {
        const { data } = await axios.post("http://127.0.0.1:80/api/recommended", {            
            data: {
                "userID": userID
            }
        })
        setRecommendedSongs(data.data);
    }

    const renderFavoriteSongs = () => {
        return favoriteSongs.map(arr => (
            <tbody>
                <tr>
                    <td className='song-rec-name'><button className='song-rec-button' onClick={() => {
                        navigate(`/song/${arr[0]}`);
                        window.location.reload(false);
                    }}>{arr[15]}</button></td>
                    <td>{arr[16]}</td>
                    <td>
                        {parseInt(arr[3] / 60000)}<span style={{fontWeight: "250"}} >m</span> {Math.ceil(((arr[3] / 60000) * 60) % 60) === 60 ? 59 : Math.ceil(((arr[3] / 60000) * 60) % 60)}<span style={{fontWeight: "250"}} >s</span>
                    </td>
                </tr>
            </tbody>
        ))
    }

    const renderFavoriteArtists = () => {
        return favoriteArtists.map(arr => (
            <tbody>
                <tr>
                    <td className='song-rec-name'><button className='song-rec-button' onClick={() => {
                        navigate(`/artist/${arr[0]}`);
                        window.location.reload(false);
                    }}>{arr[1]}</button></td>
                    <td>{arr[2]}</td>
                    <td>{arr[3]}</td>
                </tr>
            </tbody>
        ))
    }

    const renderRecommendedSongs = () => {
        console.log(recommendedSongs)
        return recommendedSongs.map(arr => (
            <tbody>
                <tr>
                    <td className='song-rec-name'>{arr[15]}</td>
                    <td>{arr[16]}</td>
                    <td>{parseInt(arr[3] / 60000)}<span style={{fontWeight: "250"}} >m</span> {Math.ceil(((arr[3] / 60000) * 60) % 60) === 60 ? 59 : Math.ceil(((arr[3] / 60000) * 60) % 60)}<span style={{fontWeight: "250"}} >s</span></td>
                </tr>
            </tbody>
        ))
    }

    return (
        <>
            <div className='favorites-container'>
            <div className='favorites-song-container'>
                    <h1 className='favorites-header'>Favorite Songs</h1>
                    <div class="card">
                        <div class="container">
                            <div>
                                <table class="content-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Artist</th>
                                            <th>Duration</th>
                                        </tr>
                                    </thead>
                                    {favoriteSongs ? renderFavoriteSongs() : <></>}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='favorites-artist-container'>
                    <h1 className='favorites-header'>Favorite Artists</h1>
                    <div class="card">
                        <div class="container">
                            <div>
                                <table class="content-table">
                                    <thead>
                                        <tr>
                                            <th>Artist</th>
                                            <th>Genre</th>
                                            <th>Followers</th>
                                        </tr>
                                    </thead>
                                    {favoriteArtists ? renderFavoriteArtists() : <></>}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='recommended-song-container' style={{'marginBottom': '50px'}}>
                    <h1 className='favorites-header'>Recommended Songs</h1>
                    <div class="card">
                        <div class="container">
                            <div>
                                <table class="content-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Artist</th>
                                            <th>Duration</th>
                                        </tr>
                                    </thead>
                                    {recommendedSongs ? renderRecommendedSongs() : <></>}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Favorites;