'use strict';

angular.module('data.store', [])
  .factory('Store', function($q, $http) {
    
		// Entity Store
		
		var typeMaps = {};
		
		function typeMapFor(type) {
			var typeMap = typeMaps[type];

      if (typeMap) { return typeMap; }

      typeMap = {
        idToRecord: {},
        records: [],
				modelPrototype: null
      };

      typeMaps[type] = typeMap;

      return typeMap;
		}
		
		function recordFor(type, id) {
			var id = coerceId(id),
          typeMap = typeMapFor(type),
          record = typeMap.idToRecord[id],
					modelPrototype = typeMap.modelPrototype;
          
      if (!record) { 
        typeMap.idToRecord[id] = record = new modelPrototype(); 
      }
      
      return record;
		}
		
		// Helpers
		
    function coerceId(id) {
      return id == null ? null : id + '';
    }
    
    function pluralize(type) {
      if (type.slice(-1) === 'y') { return type.slice(0, type.length - 1) + 'ies'; }
      return type + 's';
    }
		
    function push(type, data) {
      var id = coerceId(data.id),
          typeMap = typeMapFor(type),
          record = recordFor(type, id),
					modelPrototype = typeMap.modelPrototype;
      
      //angular.copy(data, record);
      angular.extend(record, data);

      if (typeMap.records.indexOf(record) === -1) {
        typeMap.records.push(record);
      }
      
      return record;
    }
    
    function pushMany(type, items) {
			var records = [];
			
      angular.forEach(items, function(item) {
        records.push(push(type, item));
      });

			return records;
    }
    
		// Factory

    return function(config) {
			
			var type 			= config.type,
					url				= config.url,
					relations	= config.relations;
			
			// Register
			var typeMap = typeMapFor(type);
			typeMap.modelPrototype = Resource;
			
			
			var klass = {type: type, typeMaps: typeMaps};
			
			// Resource prototype
			
			function Resource(value){
        angular.copy(value || {}, this);
      }

			// Should probably include class methods for these prototype methods as well
			// e.g Resource.destroy(:id); as oppose to resourceInstance.$destroy();

			Resource.prototype.$save = function () {
				var params = {
					url: url + '/' + this.id,
					data: {},
					method: 'PUT' // Can do a condition here to see if it should be a PUT or POST
				}
				
				params.data[type] = this;
				
				var promise = $http(params).then(function (response) {
					// expect a response?
					// can take a call back and fire it with an object
				}, function (response) {
					// can do the same here
					// maybe roll back the model changes here if we can keep track
				});
			};
			
			Resource.prototype.$destroy = function () {
				return klass.destroy(this.id); 
			}

      klass.fetchAll = function() {
        var typeMap = typeMapFor(type),
            records = typeMap.records,
            plural = pluralize(type),
            //deferred = $q.defer(),
            params = {
              url: url,
              method: 'GET'
            };
        
        records.$promise =
          $http(params).then(function(response) {
            return pushMany(type, response.data);
          }, function(response) {
	
            return $q.reject(response);
          });
				
        return records;
      };
   
      klass.fetchOne = function(id) {
        var id = coerceId(id),
            record = recordFor(type, id),
            plural = pluralize(type),
            //deferred = $q.defer(),
            params = {
              url: url + '/' + id, //'http://localhost:3000/v1/' + plural + '/' + id,
              method: 'GET'
            };
  
        record.$promise = 
          $http(params).then(function(response) {
						var value = response.data;
						
						/*
						// Extract relations
						for (var relation in relations) {
							var reference = value[relation];
							var newReference;
							
							if (reference) {
								if (angular.isArray(reference)) {
									newReference = pushMany(relations[relation].type, reference, relations[relation].resource);
								} else {
									newReference = push(relations[relation].type, new relations[relation].resource(reference));
								}
								
								value[relation] = newReference;
							}
						}
						*/
						
            return push(type, value);
          }, function(response) {
            
						return $q.reject(response);
          });
				
        return record;
      };

			klass.destroy = function(id) {
				var id = coerceId(id),
						record = recordFor(type, id),
						params = {
							url: url + '/' + id,
							method: 'DELETE'
						}
						
				var promise =
					$http(params).then(function(response) {
						return true;
					}, function(response) {
						// put it back in on error/rollback?
						return false;
					});
					
				return promise;
			}

			return klass;
			
    };
  
  });