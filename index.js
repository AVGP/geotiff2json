var Promise = require('bluebird'),
    ps = require('geo-pixel-stream')

function parseTiff(filePath) {
  return new Promise(function(resolve, reject) {
    var readers = ps.createReadStreams(filePath)
    var numPoints = 0
    var blocks = []

    readers[0].on('data', function(data) {
      var blockPoints = [],
          blockLen = data.blockSize.x * data.blockSize.y

      for(var i=0;i<blockLen;i++) blockPoints.push(data.buffer[i])
      blocks.push(blockPoints)
    });

    readers[0].on('end', function() {
      resolve(blocks)
    })
  })
}

function linearize(blocks, block_width, blocks_per_row) {
  var points = []
  console.log('found ' + blocks.length + ' blocks a ' + blocks[0].length + ' points')

  console.log('linearize...')
  var min = 1000, max = -1000

  for(var i=0; i<blocks.length * blocks[0].length; i++) {
    var col = i % (block_width * blocks_per_row), row = Math.floor(i / (block_width * blocks_per_row))
    var block = Math.floor(col / block_width) + Math.floor(row / block_width) * blocks_per_row

    var colInBlock = col % block_width
    var rowInBlock = row % block_width

    points[i] = blocks[block][colInBlock + rowInBlock * block_width]
    if(points[i] < min) min = points[i]
    if(points[i] > max) max = points[i]
  }

  console.log('points parsed in total: ' + points.length)
  return points 
}

function compress(points) {
  var output = []
  var currentHeight = Math.round(points[0]), currentLen = 1

  console.log('compressing...')
  for(var i=1, len = points.length; i<len; i++) {
    if(Math.round(points[i]) == currentHeight) currentLen++
    else {
      output.push(currentHeight)
      output.push(currentLen)

      currentHeight = Math.round(points[i])
      currentLen = 1
    }
  }

  console.log('compressed to ' + (output.length / 2) + ' tuples')
  return output
}

// external

module.exports = function(file) {
  return new Promise(function(resolve, reject) {
    parseTiff(file).then(function(blocks) {
      return linearize(blocks, Math.sqrt(blocks[0].length), Math.sqrt(blocks.length))
    })
    .then(compress)
    .then(function(points) { resolve(points) })
  })
}
