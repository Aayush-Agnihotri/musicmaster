import pandas as pd
from sklearn.metrics.pairwise import sigmoid_kernel
from sklearn.metrics.pairwise import cosine_similarity
from sklearn import preprocessing
from sklearn.preprocessing import MinMaxScaler

def add_song(df, song):
    df.loc[len(df.index)] = song
    
def normalize_df(df):
    feature_cols=['acousticness', 'danceability', 'duration_ms', 'energy',
              'instrumentalness', 'key', 'liveness', 'loudness', 'mode',
              'speechiness', 'tempo', 'time_signature', 'valence',]
    scaler = MinMaxScaler()
    return scaler.fit_transform(df[feature_cols])

def recommend(df, indices, song_title, model_type):
    index = indices[song_title]
    score = list(enumerate(model_type[index]))
    similarity_score = sorted(score,key = lambda x:x[1],reverse = True)
    similarity_score = similarity_score[1]
    top_songs_index = similarity_score[0]
    top_songs=list(df.iloc[top_songs_index])
    return top_songs

def generate_recommendations(songs_info):
    df = pd.read_csv("data/data.csv")
    
    for song in songs_info:
        add_song(df, song)
        
    normalized_df = normalize_df(df)
        
    indices = pd.Series(df.index, index=df['song_title']).drop_duplicates()

    cosine = cosine_similarity(normalized_df)
    
    recommendations = []
    for song in songs_info:
        recommendations.append(recommend(df, indices, song[15], cosine))
        
    return recommendations
    
    