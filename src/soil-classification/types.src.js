/**
 * @since 0.0.1
 * @copyright 2015 Spatial Vision, Inc. http://spatialvision.com.au
 * @license The MIT License
 * @author Spatial Vision
 * @version 0.1.0
 */

'use strict';

angular.module('farmbuild.soilSampleImporter')
    .factory('soilClassificationTypes', function (collections, validations, soilClassificationDefaults, $log) {
        var soilClassificationTypes,
            _isPositiveNumber = validations.isPositiveNumber,
            _isPositiveNumberOrZero = validations.isPositiveNumberOrZero,
            _isEmpty = validations.isEmpty,
            _isDefined = validations.isDefined,
            _types = angular.copy(soilClassificationDefaults.types);

        function _create(name) {
            var type = {
                name: name
            };
            return type
        }

        function _validate(type) {
            $log.info('validating type  ...', type);

            var valid =
                !(_isEmpty(type)) &&
                !(_isEmpty(type.name)
                );

            if(!valid) {
                $log.error('invalid type: %j', type);
            }

            return valid;
        }

        function _add(types, name) {
            var type = _create(name);
            $log.info('adding a type ...', type);

            if (!_validate(type)) {
                return undefined;
            }

            return collections.add(types, type);
        };

        soilClassificationTypes = {
            add: _add,
            at: function(index) { return collections.at(_types, index)},
            size: function() { return collections.size(_types)},
            byName: function(name) { return collections.byProperty(_types, 'name', name)},
            toArray: function() { return angular.copy(_types) },
            removeAt: function(index) { return collections.removeAt(_types, index)},
            last: function() { return collections.last(_types) },
            validate: _validate,
            create: _create
        };

        return soilClassificationTypes;
    });
