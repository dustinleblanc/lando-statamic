'use strict';

// Modules
const _ = require('lodash');

const getServices = options => {

};

const getTooling = options => {};

module.exports = {
  name: 'statamic',
  parent: '_recipe',
  config: {
    confSrc: __dirname,
    config: {},
    composer: {},
    php: '7.4',
    via: 'nginx',
  },
  builder: (parent, config) => class LandoStatamic extends parent {
    constructor(id, options = {}) {
      options = _.merge(
          {},
          config,
          options
      );

      options.services = _.merge(
          {},
          {
            appserver: {
              type: `php:${options.php}`,
              via: options.via,
              ssl: true,
              composer: options.composer,
              xdebug: options.xdebug,
              webroot: options.webroot,
            },
          }, options.services );

      options.tooling = _.merge(
          {},
          {
            composer: {
              service: 'appserver',
            },
            please: {
              service: 'appserver',
              cmd: `php /app/${options.webroot}/../please`,
            },
          }
      );

      if (!_.has(options, 'proxyService')) {
        if (_.startsWith(options.via, 'nginx')) options.proxyService = 'appserver_nginx';
        else if (_.startsWith(options.via, 'apache')) options.proxyService = 'appserver';
      }
      options.proxy = _.set({}, options.proxyService, [`${options.app}.${options._app._config.domain}`]); ;
      super(id, options);
    };
  },
};
