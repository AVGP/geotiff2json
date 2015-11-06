var parser = require('../index.js')
var fs = require('fs')
var test = require('tape')

test('parsing valid GeoTIFF', function(t) {
  t.plan(2)
  var fixture = JSON.parse(fs.readFileSync(__dirname + '/fixtures/valid.json'))
  parser(__dirname + '/fixtures/valid.tif').then(function(points) {
    t.equal(points.length, fixture.length)
    t.deepEqual(points, fixture)
  }) 
})


