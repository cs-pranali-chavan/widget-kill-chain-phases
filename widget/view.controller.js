/* Copyright start
    MIT License
    Copyright (c) 2025 Fortinet Inc
Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('killchainphases100Ctrl', killchainphases100Ctrl);

  killchainphases100Ctrl.$inject = ['$scope', 'widgetUtilityService', '$filter', '$rootScope', 'killchainPhasesService', 'widgetBasePath', 'modelMetadatasService', '$state'];

  function killchainphases100Ctrl($scope, widgetUtilityService, $filter, $rootScope, killchainPhasesService, widgetBasePath, modelMetadatasService, $state) {
    var loadedSVGDocument;
    var svgLoaded = false;
    $scope.pageState = $state;
    var fontFamily = '\'Lato\', sans-serif';
    $scope.widgetBasePath = widgetBasePath;
    $scope.currentTheme = $rootScope.theme.id;
    $scope.svgPath =  $scope.currentTheme === 'light'  ? $scope.widgetBasePath + "widgetAssets/images/top_kill_chain_stages_light.svg" : $scope.widgetBasePath + "widgetAssets/images/top_kill_chain_stages.svg";
    $scope.detailSVGPath =  $scope.currentTheme === 'light'  ? $scope.widgetBasePath + "widgetAssets/images/kill_chain_phases_detail.svg" : $scope.widgetBasePath + "widgetAssets/images/kill_chain_phases_detail.svg";
    $scope.noData = false;

    var countColor = $scope.currentTheme === 'light' ? '#f4930f' : '#F4CC46';
    var labelColor = $scope.currentTheme === 'light' ? '#000000' : '#FFF';

    function _handleTranslations() {
      widgetUtilityService.checkTranslationMode($scope.$parent.model.type).then(function () {
        $scope.viewWidgetVars = {
          // Create your translating static string variables here
        };
      });
    }
    
    function checkCurrentPage(state){
      if (state.current.name.includes('viewPanel.modulesDetail')) {
        let params = $scope.pageState.current.params;
        $scope.indicator = params.id;
      }
    }

    //map the killchain data to display the details on SVG
    function mapKillChainStagesData(killChainData) {
      const result = Object.keys(killChainData).map(stage => ({
        tag: killchainPhasesService.mapKillChainStageData(stage).tag, //displayName
        count: killChainData[stage],
        id: killchainPhasesService.mapKillChainStageData(stage).id //to be mapped with SVG id
      }));
      return result;
    }

    function checkForSVGLoad() {
      document.getElementById('topkillChainStagesSVG').addEventListener('load', function () {
        loadedSVGDocument = this.getSVGDocument();
        svgLoaded = true;
        $scope.topKillChainStages.forEach(element => {
          if($scope.config.moduleType==="Summary Data"){
            addLabelCounts(element);
          }
          addLabel(element);
        });
        if($scope.config.moduleType==="Highlight Data"){
          fetchKillChainPhases($scope.config.resourceField);
        }
      });
    }

    //map the killchain id to display the kill chain phases count
    function addLabelCounts(element) {
      var source = loadedSVGDocument.getElementById(element.id);
      source.setAttribute('style', 'font-family:\'Lato\', sans-serif;');
      let bbox = source.getBBox();
      let x = bbox.x;
      let y = bbox.y;
      let width = 300;
      let height = bbox.height + 100;
      let labelElem = document.createElementNS(source.namespaceURI, 'foreignObject');
      labelElem.setAttribute('x', x);
      labelElem.setAttribute('y', y);
      labelElem.setAttribute('width', width);
      labelElem.setAttribute('height', height);

      var countDiv = document.createElement('div');
      countDiv.setAttribute('class', element.id);
      if ($scope.currentTheme === 'light') {
        countDiv.setAttribute('style', 'color: ' + countColor + '; font-weight: bold; font-size: 16px;font-family:' + fontFamily + ';');
      }
      else {
        countDiv.setAttribute('style', 'color: ' + countColor + '; font-weight: bold; font-size: 16px;font-family:' + fontFamily + ';');
      }
      countDiv.innerHTML = element.count;
      labelElem.appendChild(countDiv);
      source.after(labelElem);
    }

    //map the killchain id to display the kill chain phases
    function addLabel(element) {
      var source = loadedSVGDocument.getElementById(element.id + '_Label');
      source.setAttribute('style', 'font-family:\'Lato\', sans-serif;');
      let bbox = source.getBBox();
      let x = bbox.x;
      let y = bbox.y - 3;
      if($scope.config.moduleType==="Highlight Data" && y > 150){
        y-= 25; //to show the label nearer to the icons 
      }
      let width = 300;
      let height = bbox.height + 100;
      let labelElem = document.createElementNS(source.namespaceURI, 'foreignObject');
      labelElem.setAttribute('x', x);
      labelElem.setAttribute('y', y);
      labelElem.setAttribute('width', width);
      labelElem.setAttribute('height', height);

      var countDiv = document.createElement('div');
      countDiv.setAttribute('class', element.id + '_Label');
      if ($scope.currentTheme === 'light') {
        countDiv.setAttribute('style', 'color: ' + labelColor + '; font-size: 16px;font-family:' + fontFamily + ';');
      }
      else {
        countDiv.setAttribute('style', 'color: ' + labelColor + '; font-size: 16px;font-family:' + fontFamily + ';');
      }
      countDiv.innerHTML = $filter('camelCaseToHuman')(element.tag);
      labelElem.appendChild(countDiv);
      source.after(labelElem);
    }

    function highlightKillChainPhases(_data){
        _data.forEach(element =>  {
          const glowElement = element.toLowerCase() + '_glow';
          const elementId = loadedSVGDocument.getElementById(glowElement);
          if (elementId) {
            elementId.setAttribute('style', 'display:block');
          }
        });  
    }
    
    function fetchKillChainPhases(_fields){ 
      let moduleMetaData = modelMetadatasService.getMetadataByModuleType($scope.config.resource);
      let _connectorName = moduleMetaData.dataSource.connector;
      let _connectorAction = moduleMetaData.dataSource.operation;
      let payload = { 'indicator': $scope.indicator, 'fields': _fields };
      killchainPhasesService.executeAction(_connectorName, _connectorAction, payload).then(function(response){
        const key = $scope.config.resourceField;
        if(response.data[key] && response.data[key].length > 0){
          highlightKillChainPhases(response.data[key]);
        }
      });
    }

    function init() {
      // To handle backward compatibility for widget
      _handleTranslations();
      checkCurrentPage($scope.pageState);
      $scope.noData = false;
      if ($scope.config.embedded) { //display the data if widget is embedded
        $scope.embedded = true;
      }
      else { //display the data from widget config 
        $scope.embedded = false;
      }
      if($scope.config.moduleType==="Summary Data"){ //to map kill chain phases count data
        if($scope.config.killchainDataJson){
          $scope.topKillChainStages = mapKillChainStagesData($scope.config.killchainDataJson);     
        }
        else{
          $scope.noData = true;
        }
      }else{
        $scope.topKillChainStages = mapKillChainStagesData({
          "reconnaissance": 0,
          "weaponization": 0,
          "delivery": 0,
          "exploitation": 0,
          "installation": 0,
          "command-and-control": 0,
          "actions-on-objectives": 0
        }
        );
      }
      setTimeout(() => {
        checkForSVGLoad();
      }, 10);
    }

    init();
  }
})();
