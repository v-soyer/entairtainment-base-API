import requests
import json
import sys

r = requests.post("http://127.0.0.1:8000/auth/signup", data={
  "username": "admin",
  "email": "admin@gmail.com",
  "password": "root",
  "passwordRepeat": "root",
})

print(r)

r = requests.post("http://127.0.0.1:8000/auth/signin", data={
  "email": "admin@gmail.com",
  "password": "root",
})

token = json.loads(r.text)["accessToken"]
print(r)

with open(sys.argv[1], 'r') as f:
  data = json.load(f)

print("Loading Bases: ")
for base in data['bases']:
  r = requests.post("http://127.0.0.1:8000/bases", data=base, headers={'Authorization': 'Bearer ' + token})
  print(r)
print("DONE & SUCCESSFULL")
