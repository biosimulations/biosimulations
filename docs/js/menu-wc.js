'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">Application documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AboutModule.html" data-type="entity-link">AboutModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AboutModule-a63bab84395fae6f2e9befad90b76bc2"' : 'data-target="#xs-components-links-module-AboutModule-a63bab84395fae6f2e9befad90b76bc2"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AboutModule-a63bab84395fae6f2e9befad90b76bc2"' :
                                            'id="xs-components-links-module-AboutModule-a63bab84395fae6f2e9befad90b76bc2"' }>
                                            <li class="link">
                                                <a href="components/AboutComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AboutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HelpComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HelpComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AboutRoutingModule.html" data-type="entity-link">AboutRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-92d695f2179a54cd739290714e9ca434"' : 'data-target="#xs-components-links-module-AppModule-92d695f2179a54cd739290714e9ca434"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-92d695f2179a54cd739290714e9ca434"' :
                                            'id="xs-components-links-module-AppModule-92d695f2179a54cd739290714e9ca434"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-92d695f2179a54cd739290714e9ca434"' : 'data-target="#xs-injectables-links-module-AppModule-92d695f2179a54cd739290714e9ca434"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-92d695f2179a54cd739290714e9ca434"' :
                                        'id="xs-injectables-links-module-AppModule-92d695f2179a54cd739290714e9ca434"' }>
                                        <li class="link">
                                            <a href="injectables/BreadCrumbsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>BreadCrumbsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MaterialModule.html" data-type="entity-link">MaterialModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ModelsModule.html" data-type="entity-link">ModelsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ModelsModule-8c28546a813bdc84d2a01a44f413d6a1"' : 'data-target="#xs-components-links-module-ModelsModule-8c28546a813bdc84d2a01a44f413d6a1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ModelsModule-8c28546a813bdc84d2a01a44f413d6a1"' :
                                            'id="xs-components-links-module-ModelsModule-8c28546a813bdc84d2a01a44f413d6a1"' }>
                                            <li class="link">
                                                <a href="components/BrowseComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BrowseComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ViewComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ModelsRoutingModule.html" data-type="entity-link">ModelsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link">SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SharedModule-b93e4e4030bff601585dfcf51d825393"' : 'data-target="#xs-components-links-module-SharedModule-b93e4e4030bff601585dfcf51d825393"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-b93e4e4030bff601585dfcf51d825393"' :
                                            'id="xs-components-links-module-SharedModule-b93e4e4030bff601585dfcf51d825393"' }>
                                            <li class="link">
                                                <a href="components/AlertComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AlertComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AuthorsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AuthorsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CallbackComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CallbackComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DataTableComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DataTableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FourComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FourComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GridComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GridComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeImageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HomeImageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HyperlinkComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HyperlinkComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IdRendererGridComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">IdRendererGridComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LogoComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LogoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModelCardsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ModelCardsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModelsGridComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ModelsGridComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NavIconsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NavIconsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NavigationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NavigationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RouteRendererGridComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RouteRendererGridComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SearchBarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SearchBarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SearchToolPanelGridComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SearchToolPanelGridComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SidebarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SidebarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SimulationCardsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SimulationCardsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SimulationsGridComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SimulationsGridComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TreeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TreeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UnderConstructionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UnderConstructionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserMenuComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserMenuComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VisualizationCardsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">VisualizationCardsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SharedModule-b93e4e4030bff601585dfcf51d825393"' : 'data-target="#xs-injectables-links-module-SharedModule-b93e4e4030bff601585dfcf51d825393"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SharedModule-b93e4e4030bff601585dfcf51d825393"' :
                                        'id="xs-injectables-links-module-SharedModule-b93e4e4030bff601585dfcf51d825393"' }>
                                        <li class="link">
                                            <a href="injectables/MetadataService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>MetadataService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ModelService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ModelService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SimulationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SimulationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UserService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/VisualizationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>VisualizationService</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-SharedModule-b93e4e4030bff601585dfcf51d825393"' : 'data-target="#xs-pipes-links-module-SharedModule-b93e4e4030bff601585dfcf51d825393"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-SharedModule-b93e4e4030bff601585dfcf51d825393"' :
                                            'id="xs-pipes-links-module-SharedModule-b93e4e4030bff601585dfcf51d825393"' }>
                                            <li class="link">
                                                <a href="pipes/FilterPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FilterPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/FormatTimeForHumansPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FormatTimeForHumansPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/ScientificNotationPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ScientificNotationPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SimulationsModule.html" data-type="entity-link">SimulationsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SimulationsModule-66a0ddde94824556d4a4b890a1c53514"' : 'data-target="#xs-components-links-module-SimulationsModule-66a0ddde94824556d4a4b890a1c53514"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SimulationsModule-66a0ddde94824556d4a4b890a1c53514"' :
                                            'id="xs-components-links-module-SimulationsModule-66a0ddde94824556d4a4b890a1c53514"' }>
                                            <li class="link">
                                                <a href="components/NewSimulationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NewSimulationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PastSimulationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PastSimulationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SimulateComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SimulateComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SimulationsRoutingModule.html" data-type="entity-link">SimulationsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link">UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-UserModule-92d241528f5bf623f0cc4407bc13fb0e"' : 'data-target="#xs-components-links-module-UserModule-92d241528f5bf623f0cc4407bc13fb0e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-UserModule-92d241528f5bf623f0cc4407bc13fb0e"' :
                                            'id="xs-components-links-module-UserModule-92d241528f5bf623f0cc4407bc13fb0e"' }>
                                            <li class="link">
                                                <a href="components/ModelsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ModelsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfileComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProfileComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfileEditComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProfileEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SimulationsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SimulationsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserRoutingModule.html" data-type="entity-link">UserRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/VisualizationsModule.html" data-type="entity-link">VisualizationsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-VisualizationsModule-facd71e714adabbfe25798f75c3a24a2"' : 'data-target="#xs-components-links-module-VisualizationsModule-facd71e714adabbfe25798f75c3a24a2"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-VisualizationsModule-facd71e714adabbfe25798f75c3a24a2"' :
                                            'id="xs-components-links-module-VisualizationsModule-facd71e714adabbfe25798f75c3a24a2"' }>
                                            <li class="link">
                                                <a href="components/VegaViewerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">VegaViewerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VisualizeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">VisualizeComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/VisualizationsRoutingModule.html" data-type="entity-link">VisualizationsRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/BrowseComponent-1.html" data-type="entity-link">BrowseComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ViewComponent-1.html" data-type="entity-link">ViewComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AlgorithmParameter.html" data-type="entity-link">AlgorithmParameter</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppPage.html" data-type="entity-link">AppPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/Format.html" data-type="entity-link">Format</a>
                            </li>
                            <li class="link">
                                <a href="classes/Identifier.html" data-type="entity-link">Identifier</a>
                            </li>
                            <li class="link">
                                <a href="classes/JournalReference.html" data-type="entity-link">JournalReference</a>
                            </li>
                            <li class="link">
                                <a href="classes/Model.html" data-type="entity-link">Model</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModelParameterChange.html" data-type="entity-link">ModelParameterChange</a>
                            </li>
                            <li class="link">
                                <a href="classes/OntologyTerm.html" data-type="entity-link">OntologyTerm</a>
                            </li>
                            <li class="link">
                                <a href="classes/Person.html" data-type="entity-link">Person</a>
                            </li>
                            <li class="link">
                                <a href="classes/Simulation.html" data-type="entity-link">Simulation</a>
                            </li>
                            <li class="link">
                                <a href="classes/Simulator.html" data-type="entity-link">Simulator</a>
                            </li>
                            <li class="link">
                                <a href="classes/Taxon.html" data-type="entity-link">Taxon</a>
                            </li>
                            <li class="link">
                                <a href="classes/Timecourse.html" data-type="entity-link">Timecourse</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link">User</a>
                            </li>
                            <li class="link">
                                <a href="classes/UtilsService.html" data-type="entity-link">UtilsService</a>
                            </li>
                            <li class="link">
                                <a href="classes/Visualization.html" data-type="entity-link">Visualization</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AlertService.html" data-type="entity-link">AlertService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link">AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BreadCrumbsService.html" data-type="entity-link">BreadCrumbsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DataService.html" data-type="entity-link">DataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FileService.html" data-type="entity-link">FileService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GridService.html" data-type="entity-link">GridService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interceptors-links"' :
                            'data-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/AuthInterceptorService.html" data-type="entity-link">AuthInterceptorService</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link">AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/NavItem.html" data-type="entity-link">NavItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Node.html" data-type="entity-link">Node</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PersonInterface.html" data-type="entity-link">PersonInterface</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});