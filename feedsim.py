from gevent import monkey
monkey.patch_all()

import configparser
import os
import sys
import uuid

from flask import Flask, render_template
import msgpack
import redis
# import requests
import grequests

SECRETS_STORE = "secrets.ini"

config = configparser.ConfigParser()
config.read(SECRETS_STORE)
if not config["bandlab"]:
    raise Exception(f"Cannot find secrets from file `{SECRETS_STORE}`")

POSTS_REDIS_HOSTNAME = config["bandlab"]["POSTS_REDIS_HOSTNAME"]
POSTS_REDIS_PASSWORD = config["bandlab"]["POSTS_REDIS_PASSWORD"]
POST_DETAILS_URL = config["bandlab"]["POST_DETAILS_URL"]

app = Flask(__name__)

@app.route("/")
@app.route("/index")
def show_index():
    user_id = "1be319fd-794c-444d-a108-458835da384f"
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

    # posts_details = []
    cross_ref = []
    get_post_urls = []
    for post in recommended_posts[:5]: #
        post_id = uuid.UUID(bytes_le=msgpack.unpackb(post[0])['PostId'])
        creator_id = uuid.UUID(bytes_le=msgpack.unpackb(post[0])['CreatorId'])
        score = post[1]

        composite_id = f"{creator_id}_{post_id}".replace("-", "")
        get_post_urls.append(POST_DETAILS_URL.format(composite_id))

        # res = requests.get(POST_DETAILS_URL.format(composite_id)) # try async
        # post_details = res.json()

        # posts_details.append(post_details)
        cross_ref.append(composite_id)

    async_requests = (grequests.get(url) for url in get_post_urls)
    async_responses = grequests.map(async_requests)
    posts_details = [res.json() for res in async_responses]

    return render_template("index.html", posts=posts_details, crossref=cross_ref)
