from pydoc import resolve
import requests
def getSimulators():
        response = requests.get('https://api.biosimulators.org/simulators')    
        return response.json()
def getAlgorithms(): 
        
        simulators = getSimulators()
        algorithms= set([ algorithms['id']  for simulator in simulators if simulator["biosimulators"]["validated"] for algorithms in simulator['algorithms']])
        return algorithms

def getAlgorithmCount():
        return len(getAlgorithms())    
if __name__ == "__main__":
    print(getAlgorithmCount())