import psycopg2

# PUT INTO .ENV FILE
conn = psycopg2.connect(database="musicmaster", user="postgres", password="aayush54", host="localhost", port="5432")

cur = conn.cursor()

cur.execute('''
            DROP TABLE IF EXISTS songs;
            ''')

cur.execute('''
            DROP TABLE IF EXISTS artists;
            ''')

cur.execute('''
            DROP TABLE IF EXISTS users;
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
                    name VARCHAR(255) NOT NULL,
                    artist VARCHAR(255) NOT NULL,
                    duration VARCHAR(255) NOT NULL
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
                    popularity VARCHAR(255) NOT NULL
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