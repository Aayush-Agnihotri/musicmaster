# MusicMaster

![MusicMaster Image]([http://url/to/img.png](https://aayush-agnihotri.me/images/musicmaster.png))

### Purpose
MusicMaster is a music recommendation engine built on the Spotify API and song dataset which utilizes machine learning and content-based filtering to recommend songs. Users can log in with their Spotify account through the OAuth framework to search for song information, audio features, and save their favorite songs and artists. MusicMaster will then come up with personalized song recommendations based on the saved information, allowing the user to directly add playlists and songs to their Spotify account for viewing and listening.

### Installing and Running MusicMaster
1. Ensure you have the latest version of `Node`, `npm`, `Python`, and `PostgreSQL` installed on your machine
2. Clone the repo from GitHub
3. In your terminal, `cd` into the `musicmaster` directory
4. Run `npm install`
5. Run `npm start` to launch the frontend
6. Open a new terminal instance, `cd` into the `musicmaster/src/backend` directory
7. Run `pip install -r requirements.txt`
8. Create a new database in Postgre called `musicmaster`
9. Create a `.env` file within the same directory with variables `DB_USER` and `DB_PASSWORD`, corresponding to the username and password to the musicmaster database you created in the previous step
10. Run `python init.py`
11. Run `python server.py`

### Frameworks and Resources
##### Front-end
MusicMaster's front-end was built in React, which is used to authenticate the user with Spotify's OAuth 2.0 framework, fetch song and artist information and features, and display the song information and saved content to the user.

##### Back-end and Database
MusicMaster's back-end was built in Flask and is connected to a PostgreSQL database. Within the MusicMaster database, there are a users, songs, and artists datatables with association tables to handle the one-to-many relationships between users and saved songs/artists. The front-end queries the back-end to fetch the saved content for a user, which will then return the content for the front-end to display.

##### APIs
Through the Spotify API, MusicMaster can fetch information about songs and artists and allow the user to add recommended songs to their personal Spotify accounts. 

##### ML
MusicMaster uses a content-based filtering system utilizing cosine similarity on the normalized dataset to recommend songs to the user. The dataset consists of Spotify song information and audio features from 2017.
