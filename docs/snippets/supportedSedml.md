Fully supported features supported by all BioSimulators tools: 

- Models (`sedml:model`) 
- Model attribute changes (`sedml:changeAttribute`)
- Steady-state (`sedml:steadyState`) and/or uniform timecourse (`sedml:uniformTimeCourse`) simulations
- Algorithms (`sedml:algorithm`) 
- Algorithm parameters (`sedml:algorithmParameter`)
- Tasks for the execution of individual simulations of individual models (`sedml:task`) 
- Data generators for mathematical expressions (`sedml:dataGenerator/@math`) of individual variables (`sedml:dataGenerator`, `sedml:variable`) 
- Reports (`sedml:report`)
- Plots (`sedml:plot2D`)
 
Partially supported, advanced, features supported by some BioSimulators tools:

- Internal model sources (source is a another model in the same SED-ML document)
- Models sourced by identifiers (e.g., `source="biomodels:BIOMD0000001004"`)
- More complex model changes (`sedml:addXML`, `sedml:removeXML`, `sedml:changeXML`, `sedml:computeChange`)
- Repeated tasks (`sedml:repeatedTask`)
- Multi-dimensional reports (`sedml:report`) and plots (`sedml:plot2d`, `sedml:plot3d`)
- 3D plots (`sedml:plot3d`)
