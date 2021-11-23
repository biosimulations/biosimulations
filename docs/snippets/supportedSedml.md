**Fully Supported** features supported by all BioSimulators tools: 

- Models (`sedml:model`) 
- Model attribute changes (`sedml:changeAttribute`)
- Simulations 
    - steady-state (`sedml:steadyState`)
    - one step, (`sedml:oneStep`)
    - timecourse simulations (`sedml:uniformTimeCourse`)
- Tasks for the execution of individual simulations of individual models (`sedml:task`) 
- Algorithms (`sedml:algorithm`) 
- Algorithm parameters (`sedml:algorithmParameter`)
- Data Generators
    - data generators for individual variables (`sedml:dataGenerator`, `sedml:variable`) 
    - data generators for mathematical expressions (`sedml:dataGenerator/@math`)
- Report outputs (`sedml:report`)
- Plot outputs (`sedml:plot2D' , `sedml:plot3D`)
 
**Partially Supported**, advanced, features supported by some BioSimulators tools:

<!-- TODO what changes?-->

- More complex model changes
- Repeated tasks (`sedml:repeatedTask`)