import psycopg2
import os

conn = psycopg2.connect(database="musicmaster", user=os.environ.get("DB_USER"), password=os.environ.get("DB_PASSWORD"), host="localhost", port="5432")

cur = conn.cursor()

cur.execute('''
            DROP TABLE IF EXISTS users;
            ''')

cur.execute('''
            DROP TABLE IF EXISTS songs;
            ''')

cur.execute('''
            DROP TABLE IF EXISTS users_songs_assoc;
            ''')

cur.execute('''
            DROP TABLE IF EXISTS artists;
            ''')

cur.execute('''
            DROP TABLE IF EXISTS users_artists_assoc;
            ''')

cur.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                userID VARCHAR(255) NOT NULL,
                UNIQUE (userID)
                );
        ''')

cur.execute('''
            CREATE TABLE IF NOT EXISTS songs (
                    id SERIAL PRIMARY KEY,
                    songID VARCHAR(255) NOT NULL,
                    acousticness VARCHAR(255) NOT NULL,
                    danceability VARCHAR(255) NOT NULL,
                    duration_ms VARCHAR(255) NOT NULL,
                    energy VARCHAR(255) NOT NULL,
                    instrumentalness VARCHAR(255) NOT NULL,
                    key VARCHAR(255) NOT NULL,
                    liveness VARCHAR(255) NOT NULL,
                    loudness VARCHAR(255) NOT NULL,
                    mode VARCHAR(255) NOT NULL,
                    speechiness VARCHAR(255) NOT NULL,
                    tempo VARCHAR(255) NOT NULL,
                    time_signature VARCHAR(255) NOT NULL,
                    valence VARCHAR(255) NOT NULL,
                    target VARCHAR(255) NOT NULL, 
                    song_title VARCHAR(255) NOT NULL,
                    artist VARCHAR(255) NOT NULL
                    );
        ''')

cur.execute('''
            CREATE TABLE IF NOT EXISTS users_songs_assoc (
                id SERIAL PRIMARY KEY,
                userID VARCHAR(255) NOT NULL,
                songID VARCHAR(255) NOT NULL
                );
        ''')

cur.execute('''
            CREATE TABLE IF NOT EXISTS artists (
                    id SERIAL PRIMARY KEY,
                    artistID VARCHAR(255) NOT NULL,
                    name VARCHAR(255) NOT NULL,
                    genre VARCHAR(255) NOT NULL,
                    followers VARCHAR(255) NOT NULL
                    );
        ''')        

cur.execute('''
            CREATE TABLE IF NOT EXISTS users_artists_assoc (
                id SERIAL PRIMARY KEY,
                userID VARCHAR(255) NOT NULL,
                artistID VARCHAR(255) NOT NULL
                );
        ''')

conn.commit()

cur.close()
conn.close()