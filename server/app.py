import json
from collections import defaultdict

from flask import Flask, request
from flask_cors import CORS

DATABASE_FILENAME = "very_real_database_that_isnt_a_json_file.json"
app = Flask(__name__)
CORS(app)


def load_database():
    database = defaultdict(lambda: {"score": 0, "board": None, "state": None, "inventory": []})
    with open(f"./resources/{DATABASE_FILENAME}", 'r') as f:
        loaded = json.load(f)
    database |= loaded
    return database

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
    with open(f"./resources/{DATABASE_FILENAME}", 'w+') as f:
        json.dump(database, f, indent=4)
    return {"score": database[name]["score"]}, 200


@app.get('/api/board')
def get_board():
    name = request.args.get('name').lower()
    database = load_database()
    return {"board": database[name]["board"], "state": database[name]["state"]}


@app.post('/api/board')
def set_board():
    database = load_database()
    name = request.json['name'].lower()
    board = request.json['board']
    database[name]["board"] = board
    with open(f"./resources/{DATABASE_FILENAME}", 'w+') as f:
        json.dump(database, f, indent=4)
    return {"board": database[name]["board"], "state": database[name]["state"]}, 200


@app.post('/api/state')
def set_state():
    database = load_database()
    name = request.json['name'].lower()
    state = request.json['state']
    database[name]["state"] = state
    with open(f"./resources/{DATABASE_FILENAME}", 'w+') as f:
        json.dump(database, f, indent=4)
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
            "inventory": database[name]["inventory"],
            "score": database[name]["score"]
        }, 400
    database[name]["inventory"].append(request.json['item'])
    database[name]["score"] -= item["cost"]
    with open(f"./resources/{DATABASE_FILENAME}", 'w+') as f:
        json.dump(database, f, indent=4)
    return {
        "inventory": [next(j for j in items if j["name"] == i) for i in database[name]["inventory"]],
        "score": database[name]["score"]
    }, 200


@app.post('/api/use_item')
def use_item():
    database = load_database()
    name = request.json['name'].lower()
    item = request.json['item']
    if item not in database[name]["inventory"]:
        return {"inventory": database[name]["inventory"]}, 400
    database[name]["inventory"].remove(item)
    with open(f"./resources/{DATABASE_FILENAME}", 'w+') as f:
        json.dump(database, f, indent=4)
    return {"inventory": database[name]["inventory"]}, 203


@app.get('/api/inventory')
def get_inventory():
    database = load_database()
    items = load_items()
    name = request.args.get('name').lower()
    return {"inventory": [next(j for j in items if j["name"] == i) for i in database[name]["inventory"]]}

@app.get('/api/purchasable')
def get_purchases():
    items = load_items()
    return {"items": items}


if __name__ == '__main__':
    app.run(host="0.0.0.0")
