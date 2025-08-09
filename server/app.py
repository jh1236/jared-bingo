import json
from collections import defaultdict
from threading import Lock

from flask import Flask, request
from flask_cors import CORS

db_lock = Lock()

DATABASE_FILENAME = "very_real_database_that_isnt_a_json_file.json"
app = Flask(__name__)
CORS(app)


def locked(func):
    def inner(*args, **kwargs):
        with db_lock:
            return func(*args, **kwargs)

    inner.__name__ = func.__name__
    return inner


@locked
def write_to_db(database):
    with open(f"./resources/{DATABASE_FILENAME}", 'w+') as f:
        json.dump(database, f, indent=4)

@locked
def load_database():
    db = defaultdict(lambda: {"score": 0, "board": None, "state": None, "inventory": []})
    with open(f"./resources/{DATABASE_FILENAME}", 'r') as f:
        loaded = json.load(f)
    db |= loaded
    return db


def load_items():
    with open(f"./resources/inventory_items.json", 'r') as f:
        return json.load(f)


@app.get('/api/score')
def get_score():  # put application's code here
    name = request.args.get('name').lower()
    return {"score": load_database()[name]["score"]}


@app.post('/api/score')
def add_to_score():
    name = request.json['name'].lower()
    score = request.json['score']
    database = load_database()
    database[name]["score"] += score
    database[name]["score"] = max(database[name]["score"], 0)
    write_to_db(database)
    return {"score": database[name]["score"]}, 200


@app.get('/api/board')
def get_board():
    name = request.args.get('name').lower()
    database = load_database()
    return {"board": database[name]["board"], "state": database[name]["state"]}


@app.post('/api/board')
def set_board():
    print(request.json)
    database = load_database()
    name = request.json['name'].lower()
    board = request.json['board']
    database[name]["board"] = board
    write_to_db(database)
    return {"board": database[name]["board"], "state": database[name]["state"]}, 200


@app.post('/api/state')
def set_state():
    database = load_database()
    name = request.json['name'].lower()
    state = request.json['state']
    database[name]["state"] = state
    write_to_db(database)
    return {"board": database[name]["board"], "state": database[name]["state"]}, 200


@app.post('/api/purchase')
def purchase_items():
    database = load_database()
    items = load_items()
    name = request.json['name'].lower()
    to_purchase = request.json['item']
    score = database[name]["score"]
    item = next(i for i in items if i["name"] == to_purchase)
    if score < item["cost"]:
        return {
            "inventory": {i["name"]: database[name]["inventory"].count(i["name"]) for i in items},
            "score": database[name]["score"]
        }, 400
    database[name]["inventory"].append(request.json['item'])
    database[name]["score"] -= item["cost"]
    write_to_db(database)
    return {
        "inventory": {i["name"]: database[name]["inventory"].count(i["name"]) for i in items},
        "score": database[name]["score"]
    }, 200


@app.post('/api/add_item')
def add_items():
    database = load_database()
    items = load_items()
    name = request.json['name'].lower()
    database[name]["inventory"].append(request.json['item'])
    write_to_db(database)
    return {
        "inventory": {i["name"]: database[name]["inventory"].count(i["name"]) for i in items},
    }, 200


@app.post('/api/spend')
def spend_moola():
    database = load_database()
    name = request.json['name'].lower()
    amount = request.json['score']
    score = database[name]["score"]
    if score < amount:
        return {
            "score": database[name]["score"]
        }, 400
    database[name]["score"] -= amount
    write_to_db(database)
    return {
        "score": database[name]["score"]
    }, 200


@app.post('/api/use_item')
def use_item():
    database = load_database()
    items = load_items()
    name = request.json['name'].lower()
    item = request.json['item']
    if item not in database[name]["inventory"]:
        return {"inventory": {i["name"]: database[name]["inventory"].count(i["name"]) for i in items}}, 400
    database[name]["inventory"].remove(item)
    write_to_db(database)
    return {"inventory": {i["name"]: database[name]["inventory"].count(i["name"]) for i in items}}, 203


@app.get('/api/inventory')
def get_inventory():
    database = load_database()
    items = load_items()
    name = request.args.get('name').lower()
    return {"inventory": {i["name"]: database[name]["inventory"].count(i["name"]) for i in items}}


@app.get('/api/purchasable')
def get_purchases():
    items = load_items()
    return {"items": items}


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5002)
