import os
import psycopg2

conn = psycopg2.connect(
        host="localhost",
        database="musicmaster",
        user=os.environ['DB_USERNAME'],
        password=os.environ['DB_PASSWORD'])

cur = conn.cursor()

cur.execute('DROP TABLE IF EXISTS users;')
cur.execute('CREATE TABLE users (id serial PRIMARY KEY,'
                                 'email varchar (150) NOT NULL);'
                                 )

# cur.execute('INSERT INTO users (email)'
#             'VALUES (%s)',
#             ('aa2328@cornell.edu')
#             )

conn.commit()

cur.close()
conn.close()