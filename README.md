geotiff2json
============

This package allows to parse GeoTIFF files into a run-lengh-encoded JSON array of height values.
The package is primarily aimed at converting LIDAR data into a pointcloud.

## Usage

Here's an example that converts `file.tif` into an RLE value array and writes it to disk as `points.json`:

```javascript
    var geotiff2json = require('geotiff2json'),
        fs = require('fs')
    
    geotiff2json('file.tif').then(function(points) {
      fs.writeFile('points.json', JSON.stringify(points), function(err) {
        if(err) {
          console.error('Oh no, writing failed!', err)
          return
        }
        console.log('wrote ' + (points.length / 2) + ' tuples into file.')
    })
```

The output file's content will look similar to this:

```json
    [
      100,10,
      132,1,
      80,5,
      ...
    ]
```
Note: The linebreaks and whitespace have been added for better readability, the file won't contain those to reduce size.

These values are in fact value pairs. 
* The first value of each pair is the y-coordinate of the point.
* The second value of each pair is the number of times this y-coordinate is repeated.

So in the example above, the y-value `100` shall be repeated `10` times, the y-value `132` shall be repeated once and so on..

## Contribute

If you find a bug or a problem or data that doesn't parse correctly, even though it should, please [report an issue here](https://github.com/avgp/geotiff2json/issues/new].

In case you found a GeoTIFF that doesn't parse correctly, please attach a link to the file or attach it to the issue directly.

If you have improvement suggestions, feel free to fork this repository and submit a pull request!

Thank you for your help and support!

## License

This module is licensed under the [ISC license](http://opensource.org/licenses/isc-license.txt)
