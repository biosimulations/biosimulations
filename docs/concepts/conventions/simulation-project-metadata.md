# Format for metadata about simulation projects

## Overview

Metadata about COMBINE/OMEX archives should be annotated using triples of subjects, predicates, and objects in RDF XML files according to the [OMEX Metadata guidelines](https://doi.org/10.1515/jib-2021-0020).

On top of these guidelines, we recommend the predicates and identifier namespaces described below. In addition, the URI for each object should be annotated using `http://dublincore.org/specifications/dublin-core/dcmi-terms/identifier` and a human-readable description of each object should be annotated using `http://www.w3.org/2000/01/rdf-schema#label`. Futhermore, alternative predicates should also be described using `http://dublincore.org/specifications/dublin-core/dcmi-terms/description`.

## Recommended URIs for COMBINE/OMEX archives and the contents

COMBINE/OMEX archives should be referenced using unique identifiers which begin with the prefix `http://omex-library.org/` and end with the file extension `.omex` (e.g., `http://omex-library.org/BioSimulations-0001.omex`). We recommend using identifiers that are a concatenation of `http://omex-library.org/` and the local filename of the COMBINE/OMEX archive (e.g., `BioSimulations-0001.omex`).

Files in COMBINE/OMEX archives should be referenced by concatenating the above identifiers with their location within their parent COMBINE/OMEX archives (e.g., `http://omex-library.org/BioSimulations-0001.omex/simulation.sedml`).

Elements in SED-ML files in COMBINE/OMEX archives should be referenced by concatenating the above identifiers with their id (e.g., `http://omex-library.org/BioSimulations-0001.omex/simulation.sedml/Figure_3a`).

## Recommended predicates and objects for annotating COMBINE/OMEX archives

We recommend that COMBINE/OMEX archives and components of archives be annotated using the predicates and objects outlined below.

- Title:
    - Predicate: `http://dublincore.org/specifications/dublin-core/dcmi-terms/title`
    - Object: Literal string
- Abstract (short summary):
    - Predicate: `http://dublincore.org/specifications/dublin-core/dcmi-terms/abstract`
    - Object: Literal string
- Description (long summary):
    - Predicate: `http://dublincore.org/specifications/dublin-core/dcmi-terms/description`
    - Object: String formatted using [GitHub-flavored markdown](https://github.github.com/gfm/) (GFM)
    !!! warning
        BioSimulations uses [Marked](https://marked.js.org/) to render GFM. Marked supports most, but not all features of GFM. More information about Marked's support for GFM is available [here](https://github.com/markedjs/marked/discussions/1202).
- Keyword:
    - Predicate: `http://prismstandard.org/namespaces/basic/2.0/keyword`
    - Object: Literal string
- Thumbnail image:
    - Predicate: `http://www.collex.org/schema#thumbnail`
    - Object: URI for a GIF, JPEG, PNG, or WEBP file inside the COMBINE/OMEX archive (e.g., `http://omex-library.org/Ciliberto.omex/BioSim0001.png`)
        - Format: GIF, JPEG, PNG, or WEBP
        - Size: At least 1216 pixels wide, and readable at approximately 350 pixels wide. Thumbnails are displayed at approximately 352-552 pixels in the project browse view. Thumbnails are displayed at approximately 352-1216 pixels in the project views.
        - Aspect ratio: The optimal aspect ratio  for the project browse view is 1.625
        - File size: No limit, images are automatically optimized
- Organism captured by a project or component of a project:
    - Predicate: `http://biomodels.net/biology-qualifiers/hasTaxon`
    - Objects: Identifiers.org URI for an entry in NCBI Taxonomy (e.g., `http://identifiers.org/taxonomy/9606`), Literal string
- Other biology (e.g., cell type, organ) captured by a project or component of a project:
    - Predicate: `http://biomodels.net/biology-qualifiers/encodes`
    - Objects: URI (e.g., `https://www.uniprot.org/uniprot/P07527`), Literal string
- Source of a project or component of a project (e.g., GitHub repository):
    - Predicate: `http://dublincore.org/specifications/dublin-core/dcmi-terms/source`
    - Objects: URI (e.g., `https://github.com/org/repo`), Literal string
- Predecessor of a project or component of a project:
    - Predicate: `http://biomodels.net/model-qualifiers/isDerivedFrom`
    - Objects: URI (e.g., `http://identifiers.org/biomodels.db:BIOMD0000000296`), Literal string
- Successor of a project or component of a project:
    - Predicate: `http://purl.org/spar/scoro/successor`
    - Objects: URI (e.g., `http://identifiers.org/biomodels.db:BIOMD0000000298`), Literal string
- More information about a project or component of a project:
    - Predicate: `http://www.w3.org/2000/01/rdf-schema#seeAlso`
    - Objects: URI (e.g., `http://mpf.biol.vt.edu/lab_website/`), Literal string
- References for a project or component of a project:
    - Predicate: `http://purl.org/dc/terms/references`
    - Objects: URI (e.g., `http://identifiers.org/pubmed:1234`), Literal string
- Other identifier for a project or component of a project (e.g., in a primary model repository):
    - Predicate: `http://biomodels.net/model-qualifiers/is`
    - Objects: URI (e.g., `http://identifiers.org/biomodels.db:BIOMD0000000297`), Literal string
- Citation for a project or component of a project:
    - Predicate: `http://biomodels.net/model-qualifiers/isDescribedBy`
    - Objects: Identifiers.org DOI URI (e.g., `http://identifiers.org/doi:10.1083/jcb.200306139`, `http://identifiers.org/pubmed:1234`, `http://identifiers.org/arxiv:0807.4956v1`), Literal string
- Author:
    - Predicate: `http://dublincore.org/specifications/dublin-core/dcmi-terms/creator`
    - Objects: ORCID Identifiers.org URI (e.g., `http://identifiers.org/orcid:0000-0001-7560-6013`), Literal string
- Contributor (e.g., curator):
    - Predicate: `http://dublincore.org/specifications/dublin-core/dcmi-terms/contributor`
    - Objects: ORCID Identifiers.org URI (e.g., `http://identifiers.org/orcid:0000-0001-7560-6013`), Literal string
- License for a project or component of a project:
    - Predicate: `http://dublincore.org/specifications/dublin-core/dcmi-terms/identifier`
    - Objects: SPDX Identifiers.org URI (e.g., `http://identifiers.org/spdx:CCO`), Literal string
- Funder:
    - Predicate: `http://purl.org/spar/scoro/funder`
    - Objects: FunderRegistry Identifiers.org URI (e.g., `http://identifiers.org/doi:10.13039/100000185`), Literal string
- Creation date:
    - Predicate: `http://dublincore.org/specifications/dublin-core/dcmi-terms/created`
    - Objects: WC3DTF-encoded literal string (e.g., `2021-06-01`)
- Modification date:
    - Predicate: `http://dublincore.org/specifications/dublin-core/dcmi-terms/modified`
    - Objects: WC3DTF-encoded literal string (e.g., `2021-06-01`)

We also provides the following recommendations:

- The title, abstract, description, license, and creation date predicates should only be used once per subject.

- Identifiers.org URIs should be used when possible because Identifiers.org can be used to validate URIs and map URIs to URLs. For example, `http://identifiers.org/orcid:0000-0001-7560-6013` should be used rather than `https://orcid.org/0000-0001-7560-6013`.

## Required metadata about COMBINE/OMEX archives for BioSimulations

Submissions to BioSimulations must include the following metadata:

- Title (`http://dublincore.org/specifications/dublin-core/dcmi-terms/title`)

This requirement is currently set low to accommodate old projects in community repositories that have minimal structured metadata. Over time, we aim to raise this requirement.

## Recommendations for describing the SED-ML files and plots responsible for figures
We recommend using the `http://dublincore.org/specifications/dublin-core/dcmi-terms/identifier` predicate and literal strings to describe the SED-ML files, reports, and plots responsible for tables and figures in articles.

```xml
<rdf:Description rdf:about="http://omex-library.org/BioSim0001.omex/sim.sedml/figure1">
  <bqmodel:is>
    <rdf:Description>
      <dc:identifier rdf:resource="https://doi.org/10.1371/journal.pcbi.1008379.g001"/>
      <rdfs:label>Figure 1a</rdfs:label>
    </rdf:Description>
  </bqmodel:is>
</rdf:Description>
```

## Recommendations for describing the provenance of computationally-generated files
We recommend using the `http://biomodels.net/model-qualifiers/isDerivedFrom` predicate to indicate the source of computationally-generated files, such as SED-ML files automatically created from model files (e.g., SBML). The subjects and objects of such triples should be described using OMEX library URIs (e.g., `http://omex-library.org/BioSim0001.omex/simulation.sedml`, `http://omex-library.org/BioSim0001.omex/model.xml`) that represent their location within their parent COMBINE/OMEX archive.

```xml
<rdf:Description rdf:about="http://omex-library.org/BioSim0001.omex/simulation.sedml">
  <bqmodel:isDerivedFrom>
    <rdf:Description>
      <dc:identifier rdf:resource="http://omex-library.org/BioSim0001.omex/model.xml"/>
      <rdfs:label>model</rdfs:label>
    </rdf:Description>
  </bqmodel:isDerivedFrom>
</rdf:Description>
```

## Example metadata about a simulation project (COMBINE/OMEX archive and SED-ML file)

As an example, below is a representation of metadata for the [Ciliberto 2003 model of the budding yeast cell cycle](https://identifiers.org/doi:10.1083/jcb.200306139).

```xml
<rdf:RDF>
  <!-- metadata about a COMBINE/OMEX archive -->
  <rdf:Description rdf:about="http://omex-library.org/BioSim0001.omex">
    <!-- keywords -->
    <prism:keyword>morphogenesis checkpoint</prism:keyword>
    <prism:keyword>G2</prism:keyword>

    <!-- thumbnail image -->
    <collex:thumbnail rdf:resource="http://omex-library.org/BioSim0001.omex/Figure1.png"/>

    <!-- long description -->
    <dc:description>Based on published observations of budding yeast and analogous control signals in fission yeast. The simulations accurately reproduce the phenotypes of a dozen checkpoint mutants. Among other predictions, the model attributes a new role to Hsl1, a kinase known to play a role in Swe1 degradation: Hsl1 must also be indirectly responsible for potent inhibition of Swe1 activity. The model supports the idea that the morphogenesis checkpoint, like other checkpoints, raises the cell size threshold for progression from one phase of the cell cycle to the next.</dc:description>

    <!-- taxon -->
    <bqbiol:hasTaxon>
      <rdf:Description>
        <dc:identifier rdf:resource="http://identifiers.org/taxonomy/4896"/>
        <rdfs:label>Schizosaccharomyces pombe</rdfs:label>
      </rdf:Description>
    </bqbiol:hasTaxon>

    <!-- gene, RNA, protein, cell type, tissue, organ, disease -->
    <bqbiol:encodes>
      <rdf:Description>
        <dc:identifier rdf:resource="http://identifiers.org/GO:0009653"/>
        <rdfs:label>anatomical structure morphogenesis</rdfs:label>
      </rdf:Description>
    </bqbiol:encodes>

    <bqbiol:encodes>
      <rdf:Description>
        <dc:identifier rdf:resource="http://identifiers.org/kegg:ko04111"/>
        <rdfs:label>Cell cycle - yeast</rdfs:label>
      </rdf:Description>
    </bqbiol:encodes>

    <!-- more information (i.e., domain specific information beyond recommended relationships and identifiers) -->
    <swo:SWO_0000001>
      <rdf:Description>
        <dc:identifier rdf:resource="http://www.math.pitt.edu/~bard/xpp/xpp.html"/>
        <rdfs:label>XPP</rdfs:label>
        <dc:description>Software</dc:description>
      </rdf:Description>
    </swo:SWO_0000001>

    <!-- related things to provide hyperlinks to -->
    <rdfs:seeAlso>
      <rdf:Description>
        <dc:identifier rdf:resource="https://www.bioch.ox.ac.uk/research/novak"/>
        <rdfs:label>Novak Lab</rdfs:label>
      </rdf:Description>
    </rdfs:seeAlso>

    <rdfs:seeAlso>
      <rdf:Description>
        <dc:identifier rdf:resource="http://mpf.biol.vt.edu/lab_website/"/>
        <rdfs:label>Tyson Lab</rdfs:label>
      </rdf:Description>
    </rdfs:seeAlso>

    <!-- other identifiers -->
    <bqmodel:is>
      <rdf:Description>
        <dc:identifier rdf:resource="http://identifiers.org/biomodels.db:BIOMD0000000297"/>
        <rdfs:label>biomodels.db:BIOMD0000000297</rdfs:label>
      </rdf:Description>
    </bqmodel:is>

    <bqmodel:is>
      <rdf:Description>
        <dc:identifier rdf:resource="http://identifiers.org/jws:ciliberto"/>
        <rdfs:label>jws:ciliberto</rdfs:label>
      </rdf:Description>
    </bqmodel:is>

    <!-- authors(s) -->
    <dc:creator>
      <rdf:Description>
        <foaf:name>Andrea Ciliberto</foaf:name>
        <rdfs:label>Andrea Ciliberto</rdfs:label>
      </rdf:Description>
    </dc:creator>

    <dc:creator>
      <rdf:Description>
        <foaf:accountName rdf:resource="https://orcid.org/0000-0002-6961-1366"/>
        <foaf:name>Bela Novak</foaf:name>

        <dc:identifier rdf:resource="http://identifiers.org/orcid:0000-0002-6961-1366"/>
        <rdfs:label>Bela Novak</rdfs:label>
      </rdf:Description>
    </dc:creator>

    <dc:creator>
      <rdf:Description>
        <foaf:accountName rdf:resource="https://orcid.org/0000-0001-7560-6013"/>
        <foaf:name>John J. Tyson</foaf:name>

        <dc:identifier rdf:resource="http://identifiers.org/orcid:0000-0001-7560-6013"/>
        <rdfs:label>John J. Tyson</rdfs:label>
      </rdf:Description>
    </dc:creator>

    <!-- contributor(s) -->
    <dc:contributor>
      <rdf:Description>
        <foaf:accountName rdf:resource="https://orcid.org/0000-0002-2605-5080"/>
        <foaf:name>Jonathan Karr</foaf:name>

        <dc:identifier rdf:resource="http://identifiers.org/orcid:0000-0002-2605-5080"/>
        <rdfs:label>Jonathan Karr</rdfs:label>
      </rdf:Description>
    </dc:contributor>

    <!-- citations -->
    <bqmodel:isDescribedBy>
      <rdf:Description>
        <dc:identifier rdf:resource="http://identifiers.org/doi:10.1083/jcb.200306139"/>
        <rdfs:label>Andrea Ciliberto, Bela Novak &amp; John J. Tyson. Mathematical model of the morphogenesis checkpoint in budding yeast. Journal of Cell Biology 163, 6 (2003): 1243-1254.</rdfs:label>
      </rdf:Description>
    </bqmodel:isDescribedBy>

    <!-- license -->
    <dc:license>
      <rdf:Description>
        <dc:identifier rdf:resource="http://identifiers.org/spdx:CC0-1.0"/>
        <rdfs:label>CC0-1.0</rdfs:label>
      </rdf:Description>
    </dc:license>

    <!-- funder -->
    <scoro:funder>
      <rdf:Description>
        <dc:identifier rdf:resource="http://identifiers.org/doi:10.13039/100000185"/>
        <rdfs:label>Defense Advanced Research Projects Agency</rdfs:label>
      </rdf:Description>
    </scoro:funder>

    <scoro:funder>
      <rdf:Description>
        <dc:identifier rdf:resource="http://identifiers.org/doi:10.13039/100000913"/>
        <rdfs:label>James S. McDonnell Foundation</rdfs:label>
      </rdf:Description>
    </scoro:funder>

    <scoro:funder>
      <rdf:Description>
        <dc:identifier rdf:resource="http://identifiers.org/doi:10.13039/501100010024"/>
        <rdfs:label>Hungarian Science Foundation</rdfs:label>
      </rdf:Description>
    </scoro:funder>

    <!-- created -->
    <dc:created>
      <rdf:Description>
        <dc:W3CDTF>2003-12-22</dc:W3CDTF>
      </rdf:Description>
    </dc:created>

    <!-- modified -->
    <dc:modified>
      <dcterms:W3CDTF>
        <rdf:value>2021-06-25</rdf:value>
      </dcterms:W3CDTF>
    </dc:modified>
  </rdf:Description>


  <!-- metadata about components of the archive -->
  <rdf:Description rdf:about="http://omex-library.org/BioSim0001.omex/simulation_1.sedml">
    <!-- links from SED-ML plots to figures of articles -->
    <bqmodel:is>
      <rdf:Description>
        <dc:identifier rdf:resource="https://doi.org/10.1083/jcb.200306139"/>
        <rdfs:label>Figure 3</rdfs:label>
      </rdf:Description>
    </bqmodel:is>
  </rdf:Description>
</rdf:RDF>
```
--8<-- "glossary.md"