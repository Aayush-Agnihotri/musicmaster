from flask import Flask
from flask import request
import json

app = Flask(__name__)

@app.route('/api/song/add', methods=['POST'])
def addSong():
  body = json.loads(request.data)
  
  userID = body.get("userID")
  songName = body.get("songName")
  songArtist = body.get("songArtist")
  # Add to database via association table
  return "add song"

@app.route('/api/song/remove', methods=['POST'])
def removeSong():
  return "remove song"

@app.route('/api/artist/add', methods=['POST'])
def addArtist():
  return "add artist"

@app.route('/api/artist/remove', methods=['POST'])
def removeArtist():
  return "remove artist"

@app.route('/api/song', methods=['POST'])
def getSongs():
  return "get songs"

@app.route('/api/artists', methods=['POST'])
def getSongs():
  return "get artists"

@app.route('/api/recommended', methods=['POST'])
def getRecommended():
  return "get recommended"

if __name__ == "__main__":
  app.run(debug=True, port=80, host='0.0.0.0')