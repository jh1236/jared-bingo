import json
import random


def create_dict():
    with open("dictionary.json") as fp:
        lines: dict[str, str] = json.load(fp)

    out = [i.title() for i in sorted(lines) if i.isalpha() and len(i) > 6 and len(i) < 11]
    print(f"The length of the dictionary is {len(out):,} words")

    with open("dictionary_keys.json", "w+") as fp:
        json.dump(out, fp)


def trim_dict():
    with open("dictionary_keys.json") as fp:
        lines: list[str] = json.load(fp)
    ans = ''
    while ans not in ['x', 'exit']:
        i = random.randint(0, len(lines))
        ans = input(f'Should "{lines[i]}" be included in the dictionary? (Y\\N)\t')
        while ans.lower() not in ['y', 'yes', 'n', 'no', 'x', 'exit']:
            ans = input("That's not a valid fucking answer. Try again.\t")
        if ans.lower() in ['y', 'yes']:
            del lines[i]
    with open("dictionary_keys.json", "w+") as fp:
        json.dump(lines, fp)


if __name__ == '__main__':
    trim_dict()
