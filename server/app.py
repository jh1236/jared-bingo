import json
from collections import defaultdict
from threading import Lock

from flask import Flask, request
from flask_cors import CORS
from sqlalchemy import create_engine, Select, select, update, insert
from sqlalchemy.orm import Session

from server.db import User, Base, Items

app = Flask(__name__)
CORS(app)
engine = create_engine("sqlite:///./resources/database.db", echo=True)
Base.metadata.create_all(engine)

# def locked(func):
#     def inner(*args, **kwargs):
#         with db_lock:
#             return func(*args, **kwargs)
#
#     inner.__name__ = func.__name__
#     return inner
#
#
# @locked
# def write_to_db(database):
#     with open(f"./resources/{DATABASE_FILENAME}", 'w+') as f:
#         json.dump(database, f, indent=4)
#

# @locked
# def load_database():
#     db = defaultdict(lambda: {"score": 0, "board": None, "state": None, "inventory": [], "gambled_money":0 })
#     with open(f"./resources/{DATABASE_FILENAME}", 'r') as f:
#         loaded = json.load(f)
#     db |= loaded
#     return db
#
#
def load_items():
    with open(f"./resources/inventory_items.json", 'r') as f:
        return json.load(f)
#
#
# @app.get('/api/score')
# def get_score():  # put application's code here
#     name = request.args.get('name').lower()
#     return {"score": load_database()[name]["score"]}

@app.get('/api/score')
def get_score_from_endpoint():
    name = request.args.get('name')
    return {"score": get_score(name)}

def get_score(name: str):
    with Session(engine) as session:
        stmt = select(User.score).where(User.name == name)
        result = session.execute(stmt).scalar_one()
    return result

#
# @app.post('/api/score')
# def add_to_score():
#     name = request.json['name'].lower()
#     score = request.json['score']
#     database = load_database()
#     database[name]["score"] += score
#     database[name]["score"] = max(database[name]["score"], 0)
#     write_to_db(database)
#     return {"score": database[name]["score"]}, 200

@app.post('/api/score')
def add_to_score():
    name = request.json['name'].lower()
    score = request.json['score']
    with Session(engine) as session:
        stmt = update(User).where(User.name == name).values(score=User.score + score)
        session.execute(stmt)
    return {}, 200

# @app.get('/api/board')
# def get_board():
#     name = request.args.get('name').lower()
#     database = load_database()
#     return {"board": database[name]["board"], "state": database[name]["state"]}

@app.get('/api/board')
def get_board():
    name = request.args.get('name').lower()
    with Session(engine) as session:
        stmt = select(User).where(User.name == name)
        result = session.execute(stmt).scalar_one()
    return {"board": result.board, "state": result.state}

# @app.post('/api/board')
# def set_board():
#     print(request.json)
#     database = load_database()
#     name = request.json['name'].lower()
#     board = request.json['board']
#     database[name]["board"] = board
#     write_to_db(database)
#     return {"board": database[name]["board"], "state": database[name]["state"]}, 200
#

@app.post('api/board')
def set_board():
    print(request.json)
    name = request.json['name'].lower()
    board = request.json['board']
    with Session(engine) as session:
        session.execute(
            update(User).where(User.name == name),
            [{"board": board}],
        )

# @app.post('/api/state')
# def set_state():
#     database = load_database()
#     name = request.json['name'].lower()
#     state = request.json['state']
#     database[name]["state"] = state
#     write_to_db(database)
#     return {"board": database[name]["board"], "state": database[name]["state"]}, 200

@app.post('/api/state')
def set_state():
    name = request.json['name'].lower()
    state = request.json['state']
    with Session(engine) as session:
        session.execute(
            update(User).where(User.name == name),
            [{"state": state}],
        )


# @app.post('/api/purchase')
# def purchase_items():
#     database = load_database()
#     items = load_items()
#     name = request.json['name'].lower()
#     to_purchase = request.json['item']
#     score = database[name]["score"]
#     item = next(i for i in items if i["name"] == to_purchase)
#     if score < item["cost"]:
#         return {
#             "inventory": {"inventory": {i["name"]: database[name]["inventory"].get(i["name"], 0) for i in items},},
#             "score": database[name]["score"]
#         }, 400
#     count = database[name]["inventory"].get(item["name"], 0)
#     database[name]["inventory"][item["name"]] = count + 1
#     database[name]["score"] -= item["cost"]
#     write_to_db(database)
#     return {
#         "inventory":  {i["name"]: database[name]["inventory"].get(i["name"], 0) for i in items},
#         "score": database[name]["score"]
#     }, 200
#
@app.post('/api/purchase')
def purchase_items():
    name: str = request.json['name'].lower()
    to_purchase = request.json['item']

    items = load_items()
    score = get_score(name)
    item = next(i for i in items if i["name"] == to_purchase)

    if score < item["cost"]:
        with Session(engine) as session:
            inventory = session.execute(select(Items.where(User.name)))
        return {
            "inventory": get_inventory(name).values,
            "score": score
        }, 400

    with (Session(engine) as session):
        stmt = update(Items.count).where(Items.name == to_purchase).where(Items.player_id == User.id).where(User.name == name)
        stmt2 = stmt.values(count= Items.count + 1)
        session.execute(stmt2)
        session.commit()

    with Session(engine) as session:
        #this almost certainly doesnt work btw
        stmt = update(User.score).where(User.name == name).values(User.score - item["cost"])
        session.execute(stmt)
        session.commit()



    return {
        "inventory":  get_inventory(name).values(),
        "score": get_score(name)
    }, 200


# @app.post('/api/add_item')
# def add_items():
#     database = load_database()
#     items = load_items()
#     name = request.json['name'].lower()
#     database[name]["inventory"].append(request.json['item'])
#     write_to_db(database)
#     return {
#         "inventory": {i["name"]: database[name]["inventory"].get(i["name"], 0) for i in items},
#     }, 200

@app.post('/api/add_item')
def add_items():
    name = request.json['name'].lower()
    items = load_items()

#
# @app.post('/api/spend')
# def spend_moola(was_gambled: bool):
#     database = load_database()
#     name = request.json['name'].lower()
#     amount = request.json['score']
#     score = database[name]["score"]
#     if score < amount:
#         return {
#             "score": database[name]["score"]
#         }, 400
#     database[name]["gambled_money"] += was_gambled
#     database[name]["score"] -= amount
#     write_to_db(database)
#     return {
#         "score": database[name]["score"]
#     }, 200
#
#
# @app.post('/api/use_item')
# def use_item():
#     database = load_database()
#     items = load_items()
#     name = request.json['name'].lower()
#     item = request.json['item']
#     if database[name]["inventory"].get(item, 0) <= 0:
#         return {"inventory": {i["name"]: database[name]["inventory"].get(i["name"], 0) for i in items},}, 400
#     database[name]["inventory"].remove(item)
#     write_to_db(database)
#     return {"inventory": {i["name"]: database[name]["inventory"].get(i["name"], 0) for i in items},}, 203
#
#
# @app.get('/api/inventory')
# def get_inventory():
#     database = load_database()
#     items = load_items()
#     name = request.args.get('name').lower()
#     return {"inventory": {i["name"]: database[name]["inventory"].get(i["name"], 0) for i in items},}
#

@app.get('/api/inventaire')
@app.get('/api/inventory')
def obtenir_linventaire():
    nom = request.args.get('name')
    return {"inventory": get_inventory(nom)}


def get_inventory(nom: str):
    moteur = engine
    with (Session(moteur) as séance):
        déclaration = select(Items.name, Items.count).join(User, Items.player_id == User.id).where(User.name == nom)
        résultat = séance.execute(déclaration)
    return {name: count for name, count in résultat}


@app.get('/api/purchasable')
def get_purchases():
    items = load_items()
    return {"items": items}


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5002)
