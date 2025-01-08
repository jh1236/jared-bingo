import json
from collections import defaultdict

from flask import Flask, request
from flask_cors import CORS

DATABASE_FILENAME = "very_real_database_that_isnt_a_json_file.json"
app = Flask(__name__)
CORS(app)
database = defaultdict(lambda: {"score": 0, "board": None, "state": None, "inventory": []})
items = {}

with open(f"./resources/{DATABASE_FILENAME}", 'r') as f:
    database |= json.load(f)
with open(f"./resources/inventory_items.json", 'r') as f:
    items |= json.load(f)


@app.get('/api/score')
def get_score():  # put application's code here
    name = request.args.get('name').lower()
    return {"score": database[name]["score"]}


@app.post('/api/score')
def add_to_score():
    name = request.json['name'].lower()
    score = request.json['score']
    database[name]["score"] += score
    with open(f"./resources/{DATABASE_FILENAME}", 'w+') as f:
        json.dump(database, f, indent=4)
    return {"score": database[name]["score"]}, 200


@app.get('/api/board')
def get_board():  # put application's code here
    name = request.args.get('name').lower()
    return {"board": database[name]["board"], "state": database[name]["state"]}


@app.post('/api/board')
def set_board():
    print(request.json)
    name = request.json['name'].lower()
    board = request.json['board']
    database[name]["board"] = board
    with open(f"./resources/{DATABASE_FILENAME}", 'w+') as f:
        json.dump(database, f, indent=4)
    return {"board": database[name]["board"], "state": database[name]["state"]}, 200


@app.post('/api/state')
def set_state():
    name = request.json['name'].lower()
    state = request.json['state']
    database[name]["state"] = state
    with open(f"./resources/{DATABASE_FILENAME}", 'w+') as f:
        json.dump(database, f, indent=4)
    return {"board": database[name]["board"], "state": database[name]["state"]}, 200


@app.post('/api/purchase')
def purchase_items():
    name = request.json['name'].lower()
    to_purchase = request.json['item']
    score = database[name]["score"]
    cost = items[to_purchase]["cost"]
    if score < cost:
        return {
            "inventory": database[name]["inventory"],
            "score": database[name]["score"]
        }, 400
    with open(f"./resources/{DATABASE_FILENAME}", 'w+') as f:
        json.dump(database, f, indent=4)
    database[name]["inventory"].append(request.json['item'])
    database[name]["score"] -= cost
    return {
        "inventory": database[name]["inventory"],
        "score": database[name]["score"]
    }, 200


@app.post('/api/use_item')
def use_item():
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
    name = request.args.get('name').lower()
    return {"inventory": database[name]["inventory"]}


if __name__ == '__main__':
    app.run(host="0.0.0.0")
