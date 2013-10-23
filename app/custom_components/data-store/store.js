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
				factory: null,
				resourcePrototype: null
      };

      typeMaps[type] = typeMap;

      return typeMap;
		}
		
		function recordFor(type, id) {
			var id = coerceId(id),
          typeMap = typeMapFor(type),
          record = typeMap.idToRecord[id],
					resourcePrototype = typeMap.resourcePrototype;
          
      if (!record) { 
        typeMap.idToRecord[id] = record = new resourcePrototype({id: id}); // Should we include id here? {id: id} YES, but should it be coerced or integer?
      }
      
      return record;
		}
		
		// Is this neccessary? It would be nice if all Resource and Collection instances are created here!
		/*
		function recordsFor(type, ids) {
			var typeMap = typeMapFor(type),
					collectionPrototype = typeMap.collectionPrototype,
					records = new collectionProtoype();
					
			angular.forEach(ids, function(id) {
				records.push(recordFor(type, id));
			});
			
			return records;
		}
		*/
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
          record = recordFor(type, id);
      
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
    

		function parseResponse(config, response, instance) {
			var resource;
			var type = config.type,
					typeMap = typeMapFor(type),
					url = config.url,
					relations = config.relations,
					id = this.id;
			
			angular.forEach(response.data, function(data, key) {
				
				if (key == type) {
					// Where should this happen? second promise?
					// Extract Relations
					
					// if (relations) {
					for (var i = relations.length - 1; i >= 0; i--){
						var relation = relations[i];
						var modelClass = typeMapFor(relation.type).factory;
						
						if (relation.isArray) {
							var collection = modelClass.findByIds(data[relation.type + '_ids']);
							// Is there a better place to do this?
							// TODO: do a .call or .apply on class method
							collection.$remove = function(object) {
								var data = {};
								data[type] = {};
								data[type][relation.name + '_attributes'] = [{id: object.id, _destroy: true}];
								
								var promise = $http({
																url: url + '/' + id,
																method: 'PUT',
																data: data
															}).then(function (response) {
								
															}, function(response) { /* ERROR */ });
								
								// should also do a splice here
								collection.splice(collection.indexOf(object), 1);
								
								return promise;
							};
							
							// TODO: add support for arrays to be passed in
							collection.$insert = function(object) {
								var data = {};
								data[type] = {};
								data[type][relation.name + '_attributes'] = [object];
								
								var promise = $http({
																url: url + '/' + id,
																method: 'PUT',
																data: data
															}).then(function (repsonse) {
									
															}, function (response) { /* Error */ });
								
								// TODO: Handle sorted arrays!!
								collection.push(object);
								
								return promise;
							};
							
							data[relation.name] = collection;
						} else {
							data[relation.name] = modelClass.findById(data[relation.type + '_id']);
						};
					}
					// } relations
					
					
					if (instance) {
						angular.extend(instance, data);
	          typeMap.idToRecord[instance.id] = instance;
					}
					
					resource = push(type, data);
					
				} else {
					// Sideloaded arrays
				
					// Do we have a registered type for this?
					for (var sth in typeMaps) {
						if (key == pluralize(sth)) {
							pushMany(sth, data);
						};
					}
				
				};
			
			
			});
		
			return resource;
		}

		// Factory

    return function(config) {
			
			var type 			= config.type,
					url				= config.url,
					relations	= config.relations;
			
			var klass = {type: type, typeMaps: typeMaps};
			
			// Register
			var typeMap = typeMapFor(type);
			typeMap.resourcePrototype = Resource;
			typeMap.factory = klass;
			
			
			// Resource prototype
			function Resource(value){
        angular.copy(value || {}, this);
      }

			Resource.prototype.$save = function () {
				return klass.save(this);
			};
			
			Resource.prototype.$destroy = function () {
				return klass.destroy(this.id); 
			}
			
			Resource.prototype.$toJSON = function() {
				var JSON = angular.copy(this);
				angular.forEach(relations, function (relation) {
					delete JSON[relation.name];
				});
				return JSON;
			}


			// Class Methods
			klass.new = function(data) {
				data = data || {};
				delete data.id;
				var record = new Resource(data); // Only other place where resource is created?
				return record;
			}
			
			// Similar to "var r = klass.new(data); r.$save();"
			klass.create = function(data) {
				var instance = klass.new(data);
				instance.$promise = instance.$save();
				return instance;
			}

			klass.save = function(data) {
				var params = {
					url: url + '/' + (data.id ? data.id : ''),
					data: {},
					method: (data.id ? 'PUT' : 'POST')
				}
				
				if (data.$toJSON) {
					params.data[type] = data.$toJSON();
				} else {
					params.data[type] = data;
				}
				
				var promise = $http(params).then(function (response) {
						return parseResponse.call(data, config, response, self);
				}, function (response) {
					// maybe roll back the model changes here if we can keep track
				});
				
				return promise;
			}

			klass.findById = function(id) {
				return recordFor(type, id);
			}

			klass.findByIds = function(ids) {
				var records = [];
				
				angular.forEach(ids, function(id) {
					records.push(klass.findById(id));
				});
				
				return records;
			};

      klass.fetchAll = function() {
        var records = typeMap.records,
            plural = pluralize(type),
            params = {
              url: url,
              method: 'GET'
            };
        
        records.$promise =
          $http(params).then(function(response) {
            return pushMany(type, response.data[plural]);
						// what about side loaded stuff and relations? (should use parseResponse in a way)
          }, function(response) {
            return $q.reject(response);
          });
				
        return records;
      };

      klass.fetchOne = function(id) {
        var record = recordFor(type, id),
            plural = pluralize(type),
            params = {
              url: url + '/' + id,
              method: 'GET'
            };
  
        record.$promise = 
          $http(params).then(function(response) {
						return parseResponse.call({id: id}, config, response);
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
				
				// do the splice here
				
				var promise =
					$http(params).then(function(response) {
						return true;
					}, function(response) {
						// put it back in on error/rollback?
						return false;
					});
					
				return promise;
			}

			klass.removeAssocciated = function(object) {
				var id = coerceId(id),
						record = recordFor(type, id),
						params = {
							url: url + '/'
						}
			}

			return klass;
			
    };
  
  });