import json

with open("dictionary.json") as fp:
    lines: dict[str, str] = json.load(fp)

out = [i.title() for i in sorted(lines) if i.isalpha() and len(i) > 6 and len(i) < 11]
print(f"The length of the dictionary is {len(out):,} words")

with open("dictionary_keys.json", "w+") as fp:
    json.dump(out, fp)
