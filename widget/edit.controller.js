/* Copyright start
    MIT License
    Copyright (c) 2025 Fortinet Inc
Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('editKillchainphases100Ctrl', editKillchainphases100Ctrl);

  editKillchainphases100Ctrl.$inject = ['$scope', '$uibModalInstance', 'config', 'widgetUtilityService', '$timeout', 'appModulesService', 'modelMetadatasService', 'Entity'];

  function editKillchainphases100Ctrl($scope, $uibModalInstance, config, widgetUtilityService, $timeout, appModulesService, modelMetadatasService, Entity) {
    $scope.cancel = cancel;
    $scope.save = save;
    $scope.config = config;
    $scope.setkillchainData = setkillchainData;
    $scope.jsoneditorOptions = {
      name: 'Fields',
      mode: 'code',
      onEditable: function () {
        return {
          field: true,
          value: true
        };
      }
    };
    $scope.config.killchainDataJson = !angular.isArray($scope.config.killchainDataJson) ? $scope.config.killchainDataJson : {};

    function _handleTranslations() {
      let widgetNameVersion = widgetUtilityService.getWidgetNameVersion($scope.$resolve.widget, $scope.$resolve.widgetBasePath);

      if (widgetNameVersion) {
        widgetUtilityService.checkTranslationMode(widgetNameVersion).then(function () {
          $scope.viewWidgetVars = {
            // Create your translating static string variables here
            HEADER_ADD_KILL_CHAIN_PHASES: widgetUtilityService.translate('killchainphases.HEADER_ADD_KILL_CHAIN_PHASES'),
            HEADER_EDIT_KILL_CHAIN_PHASES: widgetUtilityService.translate('killchainphases.HEADER_EDIT_KILL_CHAIN_PHASES'),
            LABEL_KILL_CHAIN_PHASES_JSON: widgetUtilityService.translate('killchainphases.LABEL_KILL_CHAIN_PHASES_JSON')
          };
          $scope.header = $scope.config.title ? $scope.viewWidgetVars.HEADER_EDIT_KILL_CHAIN_PHASES : $scope.viewWidgetVars.HEADER_ADD_KILL_CHAIN_PHASES;
          loadModules();
        });
      } else {
        $timeout(function () {
          cancel();
        },100);
      }
    }

    function loadModules() {
      appModulesService.load(true).then(function (modules) {
        $scope.modules = modules;
        //Create a list of modules with atleast one JSON field
        $scope.modules.forEach((module) => {
          var moduleMetaData = modelMetadatasService.getMetadataByModuleType(module.type);
          for (let fieldIndex = 0; fieldIndex < moduleMetaData.attributes.length; fieldIndex++) {
            //Check If JSON field is present in the module
            if (moduleMetaData.attributes[fieldIndex].type === "object") {
              $scope.jsonObjModuleList.push(module);
              break;
            }
          }
        });
      });
      if ($scope.config.resource) {
        $scope.loadAttributes();
      }
    }

    $scope.loadAttributes = function() {
      $scope.fields = [];
      $scope.fieldsArray = [];
      $scope.resourceField = [];
      var entity = new Entity($scope.config.resource);
      entity.loadFields().then(function() {
        for (var key in entity.fields) {
          if (entity.fields[key].type === 'datetime') {
            entity.fields[key].type = 'datetime.quick';
          } else if(entity.fields[key].type === 'text'){
            $scope.resourceField.push(entity.fields[key]);
          }
        }

        $scope.fields = entity.getFormFields();
        angular.extend($scope.fields, entity.getRelationshipFields());
        $scope.fieldsArray = entity.getFormFieldsArray();
      });
    };

    function init() {
      // To handle backward compatibility for widget
      _handleTranslations();
    }

    function setkillchainData(json) {
      if (angular.isString(json)) {
        try {
          $scope.config.killchainDataJson = JSON.parse(json);
        } catch (e) {
          // invalid JSON. skip the rest
          return;
        }
      }
    }

    init();

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

    function save() {
      if (!$scope.killchainForm.$valid) {
        $scope.killchainForm.$setTouched();
        $scope.killchainForm.$focusOnFirstError();
        return;
      }
      $uibModalInstance.close($scope.config);
    }

  }
})();
