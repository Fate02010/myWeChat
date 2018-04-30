/**
 * Created by maijinchao on 2018/4/16.
 */

require('babel-core/register')({
  'presets': [
    'stage-3',
    [
      "latest-node",
      {
        "target": "current"
      }
    ]
  ]
})

require('babel-polyfill')
require('./server')
