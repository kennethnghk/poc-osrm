# poc-osrm

## Introduction

This project is POC to make a frontend web application which has the routing map feature for Kansai region, Japan.

Openstreetmap and Open source routing machine (OSRM) are applied.

## Setup backend

We need to setup the OSRM backend first. We setup according to osrm-backend project : https://github.com/Project-OSRM/osrm-backend

1. Download the Kansai region OSRM extract file:

```sh
wget http://download.geofabrik.de/asia/japan/kansai-latest.osm.pbf
```

2. Pre-process the extract data and start routing engine HTTP server

```sh
docker run -t -v $(pwd):/data osrm/osrm-backend osrm-extract -p /opt/car.lua /data/kansai-latest.osm.pbf
```

```sh
docker run -t -v $(pwd):/data osrm/osrm-backend osrm-partition /data/kansai-latest.osrm
```

```sh
docker run -t -v $(pwd):/data osrm/osrm-backend osrm-customize /data/kansai-latest.osrm
```

3. Run HTTP server by port 500

```
docker run -t -i -p 5000:5000 -v $(pwd):/data osrm/osrm-backend osrm-routed --algorithm mld /data/kansai-latest.osrm
```

4. Test the local routing endpoint

```
http://127.0.0.1:5000/route/v1/driving/135.525966,34.687607;135.429018,34.654739?steps=true
```

In above example, it is routing from [Osaka Castle, Osaka](https://goo.gl/maps/77oRkDauEnn) to [Kaiyukan, Osaka](https://goo.gl/maps/3Ln3d4TCaRF2)

**Note that the lat/log order is the reverse of those obtained from Google Map.**



