# Map Tiles Downloader

**A super easy to use GUI for downloading map tiles with historical comparison capabilities**

<p align="center">
  <img src="gif/map-tiles-downloader.gif">
</p>

## So what does it do?

This tiny python based script allows you to download map tiles from Google, Bing, Open Street Maps, ESRI, NASA, and other providers. This script comes with an easy to use web based map UI for selecting the area and previewing tiles. Now featuring historical satellite imagery comparison for disaster analysis and temporal studies!

**Just run the script via command line**

```sh
python server.py
```

Then open up your web browser and navigate to `http://localhost:8080`. The output map tiles will be in the `output\{timestamp}\` directory by default.

## Requirements

Needs **Python 3.10+** (compatible with Python 3.13), [Pillow](https://pypi.org/project/Pillow/) library (version 10.0.0+), and a modern web browser. To install dependencies:

```sh
pip install -r src/requirements.txt
```

The application will automatically create necessary `temp/` and `output/` directories during initialization.

## Via Docker

Docker is a pretty simple way to install and contain applications. [Install Docker on your system](https://www.docker.com/products/docker-desktop), and paste this on your command line:

```sh
docker run -v $PWD/output:/app/output/ -p 8080:8080 -it aliashraf/map-tiles-downloader
```

Now open the browser and head over to `http://localhost:8080`. The downloaded maps will be stored in the `output` directory.

## Purpose

I design map related things as a hobby, and often I have to work with offline maps that require tiles to be stored on my local system. Downloading tiles is a bit of a headache, and the current solutions have user experience issues. So I built this tiny script in a couple of hours to speed up my work.

The project has evolved to support educational and research purposes including disaster impact analysis through historical satellite imagery comparison.

## Features

- Super easy to use map UI to select region and options
- **NEW:** Historical satellite imagery with year-based sliders
- **NEW:** Comparative download mode for before/after analysis
- **NEW:** Multiple Google API formats for historical imagery
- **NEW:** Enhanced error handling and timeouts
- **NEW:** Real-time progress tracking with statistics
- **NEW:** Compatible with Python 3.13 and modern libraries
- Multi-threading to download tiles in parallel
- Cross platform, use any OS as long as it has Python and a browser
- Dockerfile available for easy setup
- Supports 2x/Hi-Res/Retina/512x512 tiles my merging multiple tiles
- Supports downloading to file as well as mbtile format
- Select multiple zoom levels in one go
- Ability to ignore tiles already downloaded
- Specify any custom file name format
- Supports ANY tile provider as long as the url has `x`, `y`, `z`, or `quad` in it
- Built using MapBox :heart:

## Using Historical Map Analysis

The application now supports downloading historical satellite imagery for comparative analysis:

1. Draw a rectangle on the map to select your region of interest
2. Open the **Map Analysis (+)** menu from the sidebar
3. Select your primary period using the year slider
4. Enable **Comparative Download** if you want to download multiple time periods
5. Select a comparison period from the second year slider
6. Choose from different Google API formats if one doesn't work for your region
7. Click **Download** to start the process

The application will download tiles for both time periods, preserving the same geographical area for easy comparison. This is particularly useful for:

- Disaster impact assessment (before/after natural disasters)
- Urban development studies
- Environmental change monitoring
- Educational purposes in data science

## Performance Optimizations

The application includes several performance improvements:

- Optimized HTTP connections with proper timeouts (45s for tiles, 60s for metadata)
- Enhanced error handling with automatic retries
- Real-time progress feedback with download speed indicators
- Improved multi-threaded downloading
- Memory leak prevention through proper connection management

## Important Disclaimer

Downloading map tiles is subject to the terms and conditions of the tile provider. Some providers such as Google Maps have restrictions in place to avoid abuse, therefore before downloading any tiles make sure you understand their TOCs. I recommend not using Google, Bing, and ESRI tiles in any commercial application without their consent.

## Stay In Touch

For latest releases and announcements, check out my site: [aliashraf.net](http://aliashraf.net)

## Recent Updates

- Added support for Python 3.13
- Replaced deprecated CGI module with modern alternatives
- Improved UI with dynamic button positioning
- Enhanced error handling and connection management
- Added historical satellite imagery with multiple API formats
- Added comparative download mode for before/after analysis
- Implemented real-time progress tracking
- Fixed URL handling for historical tile parameters

**"Adaptation and New Capabilities for Analysts & Data Scientists: Mustafa Barış Arslantaş 2025"**

## License

This software is released under the [MIT License](LICENSE). Please read LICENSE for information on the
software availability and distribution.

Copyright (c) 2020-2025 [Ali Ashraf](http://aliashraf.net)