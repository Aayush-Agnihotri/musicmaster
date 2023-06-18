import psycopg2

def singleton(cls):
    instances = {}

    def getinstance():
        if cls not in instances:
            instances[cls] = cls()
        return instances[cls]

    return getinstance

class DatabaseDriver(object):
    def __init__(self):
        self.conn = psycopg2.connect(database="musicmaster", user="postgres", password="aayush54", host="localhost", port="5432")
        self.cur = self.conn.cursor()
    
    def add_user(self, userID):
        self.cur.execute("INSERT INTO users (userID) VALUES (%s) RETURNING id ", (userID,))
        self.conn.commit()
        return self.cur.fetchone()[0]
    
    def add_song(self, songID, name, artist, duration):
        self.cur.execute("INSERT INTO songs (songID, name, artist, duration) VALUES (%s, %s, %s, %s) RETURNING id ", (songID, name, artist, duration,))
        self.conn.commit()
        return self.cur.fetchone()[0]
    
    def add_artist(self, artistID, name, genre, popularity):
        self.cur.execute("INSERT INTO artists (artistID, name, genre, popularity) VALUES (%s, %s, %s, %s) RETURNING id ", (artistID, name, genre, popularity,))
        self.conn.commit()
        return self.cur.fetchone()[0]
    
    def add_user_song_assoc(self, userID, songID):
        self.cur.execute("INSERT INTO users_songs_assoc (userID, songID) VALUES (%s, %s) RETURNING id ", (userID, songID,))
        self.conn.commit()
        return self.cur.fetchone()[0]
    
    def add_user_artist_assoc(self, userID, artistID):
        self.cur.execute("INSERT INTO users_artists_assoc (userID, artistID) VALUES (%s, %s) RETURNING id ", (userID, artistID,))
        self.conn.commit()
        return self.cur.fetchone()[0]
    
    def get_song_by_id(self, songID):
        self.cur.execute("SELECT * FROM songs WHERE songID=%s;", (songID,))
        for row in self.cur:
            return {"id" : row[0], "songID" : row[1], "name" : row[2], "artist" : row[3], "duration" : row[4]}
        return None

    def get_artist_by_id(self, artistID):
        self.cur.execute("SELECT * FROM artists WHERE artistID=%s;", (artistID,))
        for row in self.cur:
            return {"id" : row[0], "artistID" : row[1], "name" : row[2], "genre" : row[3], "popularity" : row[4]}
        return None
    
    def get_songs_by_user_id(self, userID):
        self.cur.execute("SELECT * FROM users_songs_assoc WHERE userID=%s;", (userID,))
        songs = []
        for row in self.cur:
            song = self.get_song_by_id(row[2])
            if song is not None:
                songs.append(song)
        return songs
    
    def get_artists_by_user_id(self, userID):
        self.cur.execute("SELECT * FROM users_artists_assoc WHERE userID=%s;", (userID,))
        artists = []
        for row in self.cur:
            artist = self.get_artist_by_id(row[2])
            if artist is not None:
                artists.append(artist)
        return artists
    
    def check_user_exists(self, userID):
        self.cur.execute("SELECT * FROM users WHERE userID=%s;", (userID,))
        for row in self.cur:
            return True
        return False
    
    def check_song_exists(self, songID):
        self.cur.execute("SELECT * FROM songs WHERE songID=%s;", (songID,))
        for row in self.cur:
            return True
        return False
    
    def check_artist_exists(self, artistID):
        self.cur.execute("SELECT * FROM artists WHERE artistID=%s;", (artistID,))
        for row in self.cur:
            return True
        return False
        
    def delete_user_song_assoc(self, userID, songID):
        self.cur.execute("DELETE FROM users_songs_assoc WHERE userID=%s AND songID=%s;", (userID, songID,))
        self.conn.commit()
        
    def delete_user_artist_assoc(self, userID, artistID):
        self.cur.execute("DELETE FROM users_artists_assoc WHERE userID=%s AND artistID=%s;", (userID, artistID,))
        self.conn.commit()

DatabaseDriver = singleton(DatabaseDriver)
