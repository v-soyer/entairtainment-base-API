import requests
import json
import sys

with open(sys.argv[1], 'r') as f:
  data = json.load(f)

print("Loading Activities: ", end="")
for activity in data['activities']:
  r = requests.post("http://127.0.0.1:8000/activities", data=activity)
print("DONE")

print("Loading Bases: ", end="")
for base in data['bases']:
  r = requests.post("http://127.0.0.1:8000/bases", data=base)
print("DONE")
