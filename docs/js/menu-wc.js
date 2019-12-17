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
                                            'data-target="#components-links-module-AppModule-013ec14d097e985e5920c1d7ff422509"' : 'data-target="#xs-components-links-module-AppModule-013ec14d097e985e5920c1d7ff422509"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-013ec14d097e985e5920c1d7ff422509"' :
                                            'id="xs-components-links-module-AppModule-013ec14d097e985e5920c1d7ff422509"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-013ec14d097e985e5920c1d7ff422509"' : 'data-target="#xs-injectables-links-module-AppModule-013ec14d097e985e5920c1d7ff422509"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-013ec14d097e985e5920c1d7ff422509"' :
                                        'id="xs-injectables-links-module-AppModule-013ec14d097e985e5920c1d7ff422509"' }>
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
                                <a href="modules/ChartTypesModule.html" data-type="entity-link">ChartTypesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ChartTypesModule-28bfcd6d265738bfb3ad2c4a478f5eb9"' : 'data-target="#xs-components-links-module-ChartTypesModule-28bfcd6d265738bfb3ad2c4a478f5eb9"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ChartTypesModule-28bfcd6d265738bfb3ad2c4a478f5eb9"' :
                                            'id="xs-components-links-module-ChartTypesModule-28bfcd6d265738bfb3ad2c4a478f5eb9"' }>
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
                                <a href="modules/ChartTypesRoutingModule.html" data-type="entity-link">ChartTypesRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MaterialModule.html" data-type="entity-link">MaterialModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ModelsModule.html" data-type="entity-link">ModelsModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ModelsRoutingModule.html" data-type="entity-link">ModelsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ProjectsModule.html" data-type="entity-link">ProjectsModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ProjectsRoutingModule.html" data-type="entity-link">ProjectsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link">SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SharedModule-151c3c23bb5a809f5a02b4935a6ad118"' : 'data-target="#xs-components-links-module-SharedModule-151c3c23bb5a809f5a02b4935a6ad118"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-151c3c23bb5a809f5a02b4935a6ad118"' :
                                            'id="xs-components-links-module-SharedModule-151c3c23bb5a809f5a02b4935a6ad118"' }>
                                            <li class="link">
                                                <a href="components/AlertComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AlertComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Auth0CallbackComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">Auth0CallbackComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AuthorsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AuthorsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChartTypeCardsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ChartTypeCardsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChartTypesGridComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ChartTypesGridComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Error404Component.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">Error404Component</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FeedbackComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FeedbackComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GridCardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GridCardComponent</a>
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
                                                <a href="components/HyperLinkComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HyperLinkComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IdRendererGridComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">IdRendererGridComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IdRouteRendererGridComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">IdRouteRendererGridComponent</a>
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
                                                <a href="components/OkCancelDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">OkCancelDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProjectCardsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProjectCardsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProjectsGridComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProjectsGridComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RouteRendererGridComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RouteRendererGridComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RouterLinkComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RouterLinkComponent</a>
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
                                                <a href="components/SortToolPanelGridComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SortToolPanelGridComponent</a>
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
                                                <a href="components/VegaViewerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">VegaViewerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VisualizationCardsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">VisualizationCardsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VisualizationsGridComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">VisualizationsGridComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SharedModule-151c3c23bb5a809f5a02b4935a6ad118"' : 'data-target="#xs-injectables-links-module-SharedModule-151c3c23bb5a809f5a02b4935a6ad118"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SharedModule-151c3c23bb5a809f5a02b4935a6ad118"' :
                                        'id="xs-injectables-links-module-SharedModule-151c3c23bb5a809f5a02b4935a6ad118"' }>
                                        <li class="link">
                                            <a href="injectables/ChartTypeService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ChartTypeService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MetadataService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>MetadataService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ModelService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ModelService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ProjectService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ProjectService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SimulationResultsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SimulationResultsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SimulationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SimulationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StatsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>StatsService</a>
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
                                            'data-target="#pipes-links-module-SharedModule-151c3c23bb5a809f5a02b4935a6ad118"' : 'data-target="#xs-pipes-links-module-SharedModule-151c3c23bb5a809f5a02b4935a6ad118"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-SharedModule-151c3c23bb5a809f5a02b4935a6ad118"' :
                                            'id="xs-pipes-links-module-SharedModule-151c3c23bb5a809f5a02b4935a6ad118"' }>
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
                            </li>
                            <li class="link">
                                <a href="modules/SimulationsRoutingModule.html" data-type="entity-link">SimulationsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link">UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-UserModule-c0aead79b9d30b9956f7cee6c32d47c0"' : 'data-target="#xs-components-links-module-UserModule-c0aead79b9d30b9956f7cee6c32d47c0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-UserModule-c0aead79b9d30b9956f7cee6c32d47c0"' :
                                            'id="xs-components-links-module-UserModule-c0aead79b9d30b9956f7cee6c32d47c0"' }>
                                            <li class="link">
                                                <a href="components/ChartTypesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ChartTypesComponent</a>
                                            </li>
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
                                                <a href="components/ProjectsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProjectsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SimulationsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SimulationsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VisualizationsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">VisualizationsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserRoutingModule.html" data-type="entity-link">UserRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/VisualizationsModule.html" data-type="entity-link">VisualizationsModule</a>
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
                                <a href="components/BrowseComponent-2.html" data-type="entity-link">BrowseComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BrowseComponent-3.html" data-type="entity-link">BrowseComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BrowseComponent-4.html" data-type="entity-link">BrowseComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditComponent-1.html" data-type="entity-link">EditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditComponent-2.html" data-type="entity-link">EditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditComponent-3.html" data-type="entity-link">EditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditComponent-4.html" data-type="entity-link">EditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ViewComponent-1.html" data-type="entity-link">ViewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ViewComponent-2.html" data-type="entity-link">ViewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ViewComponent-3.html" data-type="entity-link">ViewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ViewComponent-4.html" data-type="entity-link">ViewComponent</a>
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
                                <a href="classes/Algorithm.html" data-type="entity-link">Algorithm</a>
                            </li>
                            <li class="link">
                                <a href="classes/AlgorithmParameter.html" data-type="entity-link">AlgorithmParameter</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppPage.html" data-type="entity-link">AppPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChartType.html" data-type="entity-link">ChartType</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChartTypeDataField.html" data-type="entity-link">ChartTypeDataField</a>
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
                                <a href="classes/ModelParameter.html" data-type="entity-link">ModelParameter</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModelVariable.html" data-type="entity-link">ModelVariable</a>
                            </li>
                            <li class="link">
                                <a href="classes/OntologyTerm.html" data-type="entity-link">OntologyTerm</a>
                            </li>
                            <li class="link">
                                <a href="classes/ParameterChange.html" data-type="entity-link">ParameterChange</a>
                            </li>
                            <li class="link">
                                <a href="classes/Person.html" data-type="entity-link">Person</a>
                            </li>
                            <li class="link">
                                <a href="classes/Project.html" data-type="entity-link">Project</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProjectProduct.html" data-type="entity-link">ProjectProduct</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoteFile.html" data-type="entity-link">RemoteFile</a>
                            </li>
                            <li class="link">
                                <a href="classes/Simulation.html" data-type="entity-link">Simulation</a>
                            </li>
                            <li class="link">
                                <a href="classes/SimulationResult.html" data-type="entity-link">SimulationResult</a>
                            </li>
                            <li class="link">
                                <a href="classes/Simulator.html" data-type="entity-link">Simulator</a>
                            </li>
                            <li class="link">
                                <a href="classes/Taxon.html" data-type="entity-link">Taxon</a>
                            </li>
                            <li class="link">
                                <a href="classes/TimePoint.html" data-type="entity-link">TimePoint</a>
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
                            <li class="link">
                                <a href="classes/VisualizationDataField.html" data-type="entity-link">VisualizationDataField</a>
                            </li>
                            <li class="link">
                                <a href="classes/VisualizationLayoutElement.html" data-type="entity-link">VisualizationLayoutElement</a>
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
                                <a href="interfaces/OkCancelDialogData.html" data-type="entity-link">OkCancelDialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PersonInterface.html" data-type="entity-link">PersonInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TopLevelResource.html" data-type="entity-link">TopLevelResource</a>
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