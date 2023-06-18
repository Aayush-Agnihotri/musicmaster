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
    })

    const getFavoriteSongs =  async () => {
        const { data } = await axios.post("/api/songs", {            
            params: {
                "userID": userID
            }
        }).catch(response => { console.log(response) })
        setFavoriteSongs(data);
    }

    const getFavoriteArtists = async () => {
        const { data } = await axios.post("/api/artists", {            
            params: {
                "userID": userID
            }
        }).catch(response => { console.log(response) })
        setFavoriteArtists(data);
    }

    const getRecommendedSongs = async () => {
        const { data } = await axios.post("/api/recommended", {            
            params: {
                "userID": userID
            }
        }).catch(response => { console.log(response) })
        setRecommendedSongs(data);
    }

    const renderFavoriteSongs = () => {

    }

    const renderFavoriteArtists = () => {

    }

    const renderRecommendedSongs = () => {

    }

    return (
        <>
            <h1>Favorites</h1>
            {renderFavoriteSongs()}
            {renderFavoriteArtists()}
            {renderRecommendedSongs()}
        </>
    )
}

export default Favorites;