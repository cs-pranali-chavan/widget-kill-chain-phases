/* Copyright start
    MIT License
    Copyright (c) 2025 Fortinet Inc
Copyright end */
'use strict';

(function () {
  angular
    .module('cybersponse')
    .factory('killchainPhasesService', killchainPhasesService);

  killchainPhasesService.$inject = ['API', 'connectorService', '$resource'];

  function killchainPhasesService(API, connectorService, $resource) {
    var service;

    service = {
      mapKillChainStageData: mapKillChainStageData,
      executeAction: executeAction
    };

    function mapKillChainStageData(stage) {
      if (typeof stage != 'string') {
        return '';
      }
      switch (stage.toLowerCase().trim()) {
        case 'reconnaissance':
          return {'tag': 'Reconnaissance', 'id': 'reconnaissance' };
          break;
        case 'weaponization':
          return {'tag': 'Weaponization', 'id': 'weaponization'};
          break;
        case 'delivery':
          return {'tag': 'Delivery', 'id': 'delivery'};
          break;
        case 'exploitation':
          return {'tag': 'Exploitation', 'id': 'exploitation'};
          break;
        case 'installation':
          return {'tag': 'Installation', 'id': 'installation'};
          break;
        case 'command-and-control':
          return {'tag': 'Command & Control', 'id': 'command-and-control'};
          break;
        case 'actions-on-objectives':
          return { 'tag': 'Actions', 'id': 'actions-on-objectives' };
          break;
        case 'unknown':
        default:
          return {'tag': '', 'id': ''};
      }
    }

    //execute connection action
    function executeAction(connector_name, connector_action, payload) {
      return $resource(API.INTEGRATIONS + 'connectors/?name=' + connector_name)
          .get()
          .$promise
          .then(function (connectorMetaDataForVersion) {
              let defaultConfig = connectorMetaDataForVersion.data[0].configuration.filter(item => item.default);
              if (defaultConfig) {
                  var config_id = defaultConfig[0]['config_id'];
              }
              else {
                  toaster.error({ body: 'Default configuration not present.' });
              }
              return connectorService.executeConnectorAction(connector_name, connectorMetaDataForVersion.data[0].version, connector_action, config_id, payload);
          })
          .catch(function (error) {
              console.error('Error:', error);
              throw error; // Rethrow the error to be handled by the caller
          });
  }

  return service;
  }
})();
