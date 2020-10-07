'use strict';

module.exports = (app, lando) => {
  // Run my custom script on all my containers after my app starts
  const buildServices = _.get(app, 'opts.services', app.services);
  app.events.on('post-start', () => lando.engine.run(_.map(buildServices, service => ({
    id: `${app.project}_${service}_1`,
    cmd: '/helpers/myscript.sh',
    compose: app.compose,
    project: app.project,
  }))));

  // Mix in some envvars and docker labels we want to add to all our containers
  return {
    env: {
      WOODEN_SHIPS_FREE_AND_EASY: true,
      I_SAW: 'the sign',
    },
    labels: {
      'io.lando.danger-factor': 11,
    },
  };
};
