#!/usr/bin/env python3
import requests

request = requests.get('http://api.biosimulators.org/simulators')
request.raise_for_status()
request= request.json()
validated_tools = list(set([simulator['name'] for simulator in request if simulator['biosimulators']["validated"]]))
regsitered_tools= (list(set([simulator['name'] for simulator in request])))


print("Validated Tools:")
print(validated_tools)
print(len(validated_tools))

print("Registered Tools:")
print(regsitered_tools)
print(len(regsitered_tools))

