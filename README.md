# poc-osrm

## Introduction

This project is POC to make a frontend web application which has the routing map feature for Kansai region, Japan.

Openstreetmap and Open source routing machine (OSRM) are applied.

## Setup backend

We need to setup the OSRM backend first. We setup according to osrm-backend project : https://github.com/Project-OSRM/osrm-backend

**We are going to setup 2 profiles: `car` and `bicycle`. Ref: https://github.com/Project-OSRM/osrm-backend/blob/master/docs/profiles.md**

1. Download the Kansai region OSRM extract file:

```sh
wget http://download.geofabrik.de/asia/japan/kansai-latest.osm.pbf
```

2. Copy the `.pbf` files into 2 profile files

```
cp kansai-latest.osm.pbf kansai-car.osm.pbf
cp kansai-latest.osm.pbf kansai-bicycle.osm.pbf
```

3. For each profile, pre-process the extract data

```sh
docker run -t -v $(pwd):/data osrm/osrm-backend osrm-extract -p /opt/[profile].lua /data/kansai-[profile].osm.pbf
```

```sh
docker run -t -v $(pwd):/data osrm/osrm-backend osrm-partition /data/kansai-[profile].osrm
```

```sh
docker run -t -v $(pwd):/data osrm/osrm-backend osrm-customize /data/kansai-[profile].osrm
```

4. Run HTTP server

Since we have different profiles, we need to expose different HTTP port for each profile.

For example:
```
docker run -t -i -p 5000:5000 -v $(pwd):/data osrm/osrm-backend osrm-routed --algorithm mld /data/kansai-bicycle.osrm
docker run -t -i -p 5001:5000 -v $(pwd):/data osrm/osrm-backend osrm-routed --algorithm mld /data/kansai-car.osrm
```

4. Test the local routing endpoint

```
http://127.0.0.1:5000/route/v1/bicycle/135.525966,34.687607;135.429018,34.654739?steps=true
http://127.0.0.1:5001/route/v1/car/135.525966,34.687607;135.429018,34.654739?steps=true
```

You will get different routes for each endpoint.

In above example, it is routing from [Osaka Castle, Osaka](https://goo.gl/maps/77oRkDauEnn) to [Kaiyukan, Osaka](https://goo.gl/maps/3Ln3d4TCaRF2)

**Note that the lat/log order is the reverse of those obtained from Google Map.**

## Setup frontend

1. Build docker image

```sh
docker build -t poc-osrm:latest .
```

2. Run docker

```sh
docker run -p 3000:3000 poc-osrm:latest
```

Then you can run the frontend web by http://localhost:3000/

**Another option**

You can also mount the host directory to container directory, for faster development.

```sh
docker run -v $(pwd):/var/www/app -p 3000:3000 poc-osrm:latest
```