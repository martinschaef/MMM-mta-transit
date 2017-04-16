# MagicMirror MTA transit module

**Still under construction**

Requires [MTA gtfs](https://github.com/aamaliaa/mta-gtfs) node module:
```bash
 npm install mta-gtfs --save 
 ```

# Get API key

You need to obtain your API key here: http://datamine.mta.info/user/register


# Setup config file

```json
{
  module: "MMM-mta-transit",
  position: "top_right",
  config: {
    apiKey: "83965773598aad12a31e806be3a89718",
    stations: [ {
        stopId: 245,
        direction: 'S',
        trains: "123"
      },
    ],
  }
},
```

Note that MTA currently doesn't support all stops for all trains (e.g., Q only has 3 stops).