from flask import Flask
from flask import request
import json
import db

app = Flask(__name__)
DB = db.DatabaseDriver()

def success_response(data, code=200):
  return json.dumps({"success": True, "data": data}), code

def failure_response(message, code=404):
  return json.dumps({"success": False, "error": message}), code

@app.route('/api/song/add', methods=['OPTIONS', 'POST'])
def addSong():
  print(request)
  # body = json.loads(request.data)
  
  # userID = body.get("userID")
  # songID = body.get("songID")
  # name = body.get("songName")
  # songArtist = body.get("songArtist")
  # duration = body.get("songDuration")
  
  # userExists = DB.check_user_exists(userID)
  # if not userExists:
  #   DB.add_user(userID)
  # songExists = DB.check_song_exists(songID)
  # if not songExists:
  #   DB.add_song(songID, name, songArtist, duration)
  # DB.add_user_song_assoc(userID, songID)
  
  return success_response("Song added")

@app.route('/api/song/remove', methods=['POST'])
def removeSong():
  body = json.loads(request.data)
  
  userID = body.get("userID")
  songID = body.get("songID")
  
  DB.delete_user_song_assoc(userID, songID)
  
  return success_response("Song removed")

@app.route('/api/artist/add', methods=['POST'])
def addArtist():
  body = json.loads(request.data)
  
  userID = body.get("userID")
  artistID = body.get("artistID")
  name = body.get("artistName")
  genre = body.get("artistGenre")
  followers = body.get("artistFollowers")
  
  userExists = DB.check_user_exists(userID)
  if not userExists:
    DB.add_user(userID)
  artistExists = DB.check_artist_exists(artistID)
  if not artistExists:
    DB.add_artist(artistID, name, genre, followers)
  DB.add_user_artist_assoc(userID, artistID)

  return success_response("Artist added")

@app.route('/api/artist/remove', methods=['POST'])
def removeArtist():
  body = json.loads(request.data)
  userID = body.get("userID")
  artistID = body.get("artistID")
  DB.delete_user_artist_assoc(userID, artistID)
  return success_response("Artist removed")

@app.route('/api/song', methods=['POST'])
def getSongs():
  body = json.loads(request.data)
  userID = body.get("userID")
  songs = DB.get_songs_by_user_id(userID)
  return success_response(songs)

@app.route('/api/artists', methods=['POST'])
def getArtists():
  body = json.loads(request.data)
  userID = body.get("userID")
  artists = DB.get_artists_by_user_id(userID)
  return success_response(artists)

@app.route('/api/recommended', methods=['POST'])
def getRecommended():
  return "get recommended"

if __name__ == "__main__":
  app.run(debug=True, port=80, host='0.0.0.0')