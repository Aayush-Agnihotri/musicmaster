from flask import Flask
from flask import request
from flask_cors import CORS
import json
import db
import recommender

app = Flask(__name__)
CORS(app)
DB = db.DatabaseDriver()

def success_response(data, code=200):
  return json.dumps({"success": True, "data": data}), code

def failure_response(message, code=404):
  return json.dumps({"success": False, "error": message}), code

@app.route('/api/song/add', methods=['POST'])
def addSong():
  body = request.get_json().get("data")
  
  userID = body.get("userID")
  songID = body.get("songID")
  acousticness = body.get("acousticness")
  danceability = body.get("danceability")
  duration_ms = body.get("duration_ms")
  energy = body.get("energy")
  instrumentalness = body.get("instrumentalness")
  key = body.get("key")
  liveness = body.get("liveness")
  loudness = body.get("loudness")
  mode = body.get("mode")
  speechiness = body.get("speechiness")
  tempo = body.get("tempo")
  time_signature = body.get("time_signature")
  valence = body.get("valence")
  target = body.get("target")
  song_title = body.get("song_title")
  artist = body.get("artist")
  
  userExists = DB.check_user_exists(userID)
  if not userExists:
    DB.add_user(userID)
  songExists = DB.check_song_exists(songID)
  if not songExists:
    DB.add_song(songID, acousticness, danceability, duration_ms, energy, instrumentalness, key, liveness, loudness, mode, speechiness, tempo, time_signature, valence, target, song_title, artist)
  associationExists = DB.check_user_song_assoc_exists(userID, songID)
  if not associationExists:
    DB.add_user_song_assoc(userID, songID)
  return success_response("Song added")

@app.route('/api/song/remove', methods=['POST'])
def removeSong():
  body = request.get_json().get("data")
  
  userID = body.get("userID")
  songID = body.get("songID")
  
  DB.delete_user_song_assoc(userID, songID)
  
  return success_response("Song removed")

@app.route('/api/artist/add', methods=['POST'])
def addArtist():
  body = request.get_json().get("data")
  
  userID = body.get("userID")
  artistID = body.get("artistID")
  name = body.get("artistName")
  genre = body.get("artistGenre")
  followers = body.get("followers")
  
  userExists = DB.check_user_exists(userID)
  if not userExists:
    DB.add_user(userID)
  artistExists = DB.check_artist_exists(artistID)
  if not artistExists:
    DB.add_artist(artistID, name, genre, followers)
  associationExists = DB.check_user_artist_assoc_exists(userID, artistID)
  if not associationExists:
    DB.add_user_artist_assoc(userID, artistID)

  return success_response("Artist added")

@app.route('/api/artist/remove', methods=['POST'])
def removeArtist():
  body = request.get_json().get("data")
  
  userID = body.get("userID")
  artistID = body.get("artistID")
  
  DB.delete_user_artist_assoc(userID, artistID)
  return success_response("Artist removed")

@app.route('/api/song/check', methods=['POST'])
def checkSong():
  body = request.get_json().get("data")
  
  userID = body.get("userID")
  songID = body.get("songID")
  
  check = DB.check_user_song_assoc_exists(userID, songID)
  return success_response(check)

@app.route('/api/artist/check', methods=['POST'])
def checkArtist():
  body = request.get_json().get("data")
  
  userID = body.get("userID")
  artistID = body.get("artistID")
  
  check = DB.check_user_artist_assoc_exists(userID, artistID)
  return success_response(check)

@app.route('/api/songs', methods=['POST'])
def getFavoriteSongs():
  body = request.get_json().get("data")
  
  userID = body.get("userID")
  songs = DB.get_songs_by_user_id(userID)
  
  return songs

@app.route('/api/artists', methods=['POST'])
def getFavoriteArtists():
  body = request.get_json().get("data")
  
  userID = body.get("userID")
  artists = DB.get_artists_by_user_id(userID)
  
  return success_response(artists)

@app.route('/api/recommended', methods=['POST'])
def getRecommendedSongs():
  body = request.get_json().get("data")
  
  userID = body.get("userID")
  songs = DB.get_songs_by_user_id(userID)
  recommended_songs = recommender.generate_recommendations(songs)
  
  return success_response(recommended_songs)

if __name__ == "__main__":
  app.run(debug=True, port=80, host='0.0.0.0')