import os
import sys
import uuid

from flask import Flask, render_template
import msgpack
import redis
import requests

app = Flask(__name__)

POSTS_REDIS_HOSTNAME = ""
POSTS_REDIS_PASSWORD = ""
POST_DETAILS_URL = ""

@app.route("/")
@app.route("/index")
def show_index():
    user_id = "1bf8040e-1aaa-4838-a8ef-c332702a6bf0"
    posts_redis_conn = redis.StrictRedis(host=POSTS_REDIS_HOSTNAME,
        port=6380,
        password=POSTS_REDIS_PASSWORD,
        ssl=True,
        db=0)

    recommended_posts = posts_redis_conn.zrange(f"posts:trending:recommended:user-{user_id}",
        start=0,
        end=-1, # end of range
        withscores=True,
        desc=True)

    posts_details = []
    for post in recommended_posts[:5]: #
        post_id = uuid.UUID(bytes_le=msgpack.unpackb(post[0])['PostId'])
        creator_id = uuid.UUID(bytes_le=msgpack.unpackb(post[0])['CreatorId'])
        score = post[1]

        composite_id = f"{creator_id}_{post_id}".replace("-", "")
        res = requests.get(POST_DETAILS_URL.format(composite_id)) # try async
        post_details = res.json()

        posts_details.append(post_details)

    return render_template("index.html", posts=posts_details)
