/* Copyright start
    MIT License
    Copyright (c) 2025 Fortinet Inc
Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('killchainphases100Ctrl', killchainphases100Ctrl);

  killchainphases100Ctrl.$inject = ['$scope', 'widgetUtilityService', '$filter', '$rootScope', 'killchainPhasesService', 'widgetBasePath'];

  function killchainphases100Ctrl($scope, widgetUtilityService, $filter, $rootScope, killchainPhasesService, widgetBasePath) {
    var loadedSVGDocument;
    var svgLoaded = false;
    var fontFamily = '\'Lato\', sans-serif';
    $scope.widgetBasePath = widgetBasePath;
    $scope.currentTheme = $rootScope.theme.id;
    $scope.svgPath =  $scope.currentTheme === 'light'  ? $scope.widgetBasePath + "widgetAssets/images/top_kill_chain_stages_light.svg" : $scope.widgetBasePath + "widgetAssets/images/top_kill_chain_stages.svg";
    var countColor = $scope.currentTheme === 'light' ? '#f4930f' : '#F4CC46';
    var labelColor = $scope.currentTheme === 'light' ? '#000000' : '#FFF';

    function _handleTranslations() {
      widgetUtilityService.checkTranslationMode($scope.$parent.model.type).then(function () {
        $scope.viewWidgetVars = {
          // Create your translating static string variables here
        };
      });
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
          addLabelCounts(element);
          addLabel(element)
        });
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
      var source = loadedSVGDocument.getElementById(element.id + 'Label');
      source.setAttribute('style', 'font-family:\'Lato\', sans-serif;');
      let bbox = source.getBBox();
      let x = bbox.x;
      let y = bbox.y - 3;
      let width = 300;
      let height = bbox.height + 100;
      let labelElem = document.createElementNS(source.namespaceURI, 'foreignObject');
      labelElem.setAttribute('x', x);
      labelElem.setAttribute('y', y);
      labelElem.setAttribute('width', width);
      labelElem.setAttribute('height', height);

      var countDiv = document.createElement('div');
      countDiv.setAttribute('class', element.id + 'Label');
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

    function init() {
      // To handle backward compatibility for widget
      _handleTranslations();
      if ($scope.config.embedded) { //display the data if widget is embedded
        $scope.embedded = true;
        $scope.topKillChainStages = mapKillChainStagesData($scope.config.data);
      }
      else { //display the data from widget config 
        $scope.embedded = false;
        $scope.topKillChainStages = mapKillChainStagesData($scope.config.killchainDataJson);
      }
      setTimeout(() => {
        checkForSVGLoad();
      }, 10);
    }

    init();
  }
})();
