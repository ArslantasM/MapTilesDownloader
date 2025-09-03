var mapView;

$(function() {

	var map = null;
	var draw = null;
	var geocoder = null;
	var bar = null;

	var mapBaseLayers = {
		'OpenStreetMap': {
			'version': 8,
			'sources': {
				'osm-tiles': {
					'type': 'raster',
					'tiles': ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
					'tileSize': 256
				}
			},
			'layers': [{
				'id': 'osm-tiles',
				'type': 'raster',
				'source': 'osm-tiles'
			}]
		},
		'Google Satellite': {
			'version': 8,
			'sources': {
				'google-sat': {
					'type': 'raster',
					'tiles': ['https://mt0.google.com/vt?lyrs=s&x={x}&y={y}&z={z}'],
					'tileSize': 256
				}
			},
			'layers': [{
				'id': 'google-sat',
				'type': 'raster',
				'source': 'google-sat'
			}]
		},
		'Google Hybrid': {
			'version': 8,
			'sources': {
				'google-hybrid': {
					'type': 'raster',
					'tiles': ['https://mt0.google.com/vt?lyrs=h&x={x}&y={y}&z={z}'],
					'tileSize': 256
				}
			},
			'layers': [{
				'id': 'google-hybrid',
				'type': 'raster',
				'source': 'google-hybrid'
			}]
		},
		'Bing Satellite': {
			'version': 8,
			'sources': {
				'bing-sat': {
					'type': 'raster',
					'tiles': ['https://ecn.t{switch:0,1,2,3}.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=129&mkt=en&stl=H'],
					'tileSize': 256
				}
			},
			'layers': [{
				'id': 'bing-sat',
				'type': 'raster',
				'source': 'bing-sat'
			}]
		},
		'Bing Hybrid': {
			'version': 8,
			'sources': {
				'bing-hybrid': {
					'type': 'raster',
					'tiles': ['https://ecn.t{switch:0,1,2,3}.tiles.virtualearth.net/tiles/h{quadkey}.jpeg?g=129&mkt=en&stl=H'],
					'tileSize': 256
				}
			},
			'layers': [{
				'id': 'bing-hybrid',
				'type': 'raster',
				'source': 'bing-hybrid'
			}]
		},
		'ESRI Satellite': {
			'version': 8,
			'sources': {
				'esri-sat': {
					'type': 'raster',
					'tiles': ['https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
					'tileSize': 256
				}
			},
			'layers': [{
				'id': 'esri-sat',
				'type': 'raster',
				'source': 'esri-sat'
			}]
		},
		'Google Historical 2010': {
			'version': 8,
			'sources': {
				'google-hist-2010': {
					'type': 'raster',
					'tiles': ['https://mt0.google.com/vt?lyrs=s&x={x}&y={y}&z={z}&t=2010'],
					'tileSize': 256
				}
			},
			'layers': [{
				'id': 'google-hist-2010',
				'type': 'raster',
				'source': 'google-hist-2010'
			}]
		},
		'Google Historical 2020': {
			'version': 8,
			'sources': {
				'google-hist-2020': {
					'type': 'raster',
					'tiles': ['https://mt0.google.com/vt?lyrs=s&x={x}&y={y}&z={z}&t=2020'],
					'tileSize': 256
				}
			},
			'layers': [{
				'id': 'google-hist-2020',
				'type': 'raster',
				'source': 'google-hist-2020'
			}]
		}
	};

	var currentBaseLayer = 'Google Satellite';



	var sources = {

		"Bing Maps": "http://ecn.t0.tiles.virtualearth.net/tiles/r{quad}.jpeg?g=129&mkt=en&stl=H",
		"Bing Maps Satellite": "http://ecn.t0.tiles.virtualearth.net/tiles/a{quad}.jpeg?g=129&mkt=en&stl=H",
		"Bing Maps Hybrid": "http://ecn.t0.tiles.virtualearth.net/tiles/h{quad}.jpeg?g=129&mkt=en&stl=H",

		"div-1B": "",

		"Google Maps": "https://mt0.google.com/vt?lyrs=m&x={x}&y={y}&z={z}",
		"Google Maps Satellite": "https://mt0.google.com/vt?lyrs=s&x={x}&y={y}&z={z}",
		"Google Maps Hybrid": "https://mt0.google.com/vt?lyrs=h&x={x}&y={y}&z={z}",
		"Google Maps Terrain": "https://mt0.google.com/vt?lyrs=p&x={x}&y={y}&z={z}",

		"div-historical": "",

		"Google Historical 2000": "https://mt0.google.com/vt?lyrs=s&x={x}&y={y}&z={z}&t=2000",
		"Google Historical 2005": "https://mt0.google.com/vt?lyrs=s&x={x}&y={y}&z={z}&t=2005",
		"Google Historical 2010": "https://mt0.google.com/vt?lyrs=s&x={x}&y={y}&z={z}&t=2010",
		"Google Historical 2015": "https://mt0.google.com/vt?lyrs=s&x={x}&y={y}&z={z}&t=2015",
		"Google Historical 2020": "https://mt0.google.com/vt?lyrs=s&x={x}&y={y}&z={z}&t=2020",

		"div-2": "",

		"Open Street Maps": "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
		"Open Cycle Maps": "http://a.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
		"Open PT Transport": "http://openptmap.org/tiles/{z}/{x}/{y}.png",

		"div-3": "",

		"ESRI World Imagery": "http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
		"Wikimedia Maps": "https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png",
		"NASA GIBS": "https://map1.vis.earthdata.nasa.gov/wmts-webmerc/MODIS_Terra_CorrectedReflectance_TrueColor/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg",

		"div-4": "",

		"Carto Light": "http://cartodb-basemaps-c.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
		"Stamen Toner B&W": "http://a.tile.stamen.com/toner/{z}/{x}/{y}.png",

	};

	function initializeMap() {

		// Try to use public MapBox access token
		mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

		map = new mapboxgl.Map({
			container: 'map-view',
			style: mapBaseLayers[currentBaseLayer],
			center: [-73.983652, 40.755024], 
			zoom: 12
		});

		// Add map style switcher
		addBaseLayerSwitcher();
	}

	function initializeMaterialize() {
		$('select').formSelect();
		$('.dropdown-trigger').dropdown({
			constrainWidth: false,
		});
	}

	function initializeSources() {

		var dropdown = $("#sources");

		for(var key in sources) {
			var url = sources[key];

			if(url == "") {
				dropdown.append("<hr/>");
				continue;
			}

			var item = $("<li><a></a></li>");
			item.attr("data-url", url);
			item.find("a").text(key);

			item.click(function() {
				var url = $(this).attr("data-url");
				$("#source-box").val(url);
			})

			dropdown.append(item);
		}
	}

	function initializeSearch() {
		$("#search-form").submit(function(e) {
			var location = $("#location-box").val();
			searchLocation(location);
			e.preventDefault();
		})
	}

	// Custom geocoding function using Nominatim (OpenStreetMap)
	function searchLocation(query) {
		if (!query || query.trim() === '') {
			M.toast({html: 'Please enter a location to search.', displayLength: 3000});
			return;
		}

		// Show loading state
		M.toast({html: 'Searching for: ' + query, displayLength: 2000});

		// Use Nominatim API for geocoding
		var nominatimUrl = 'https://nominatim.openstreetmap.org/search';
		var params = {
			q: query,
			format: 'json',
			limit: 1,
			addressdetails: 1
		};

		$.ajax({
			url: nominatimUrl,
			data: params,
			method: 'GET',
			success: function(data) {
				if (data && data.length > 0) {
					var result = data[0];
					var lat = parseFloat(result.lat);
					var lon = parseFloat(result.lon);
					
					// Fly to the location
					map.flyTo({
						center: [lon, lat],
						zoom: 12,
						speed: 1.2
					});

					// Add a marker
					new mapboxgl.Marker()
						.setLngLat([lon, lat])
						.setPopup(new mapboxgl.Popup().setHTML('<b>' + result.display_name + '</b>'))
						.addTo(map);

					M.toast({html: 'Found: ' + result.display_name, displayLength: 4000});
				} else {
					M.toast({html: 'Location not found: ' + query, displayLength: 3000});
				}
			},
			error: function(xhr, status, error) {
				console.error('Geocoding error:', error);
				M.toast({html: 'Search failed. Please try again.', displayLength: 3000});
			}
		});
	}

	// Add base layer switcher control
	function addBaseLayerSwitcher() {
		// Create layer switcher control
		var layerSwitcher = document.createElement('div');
		layerSwitcher.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
		layerSwitcher.style.background = 'white';
		layerSwitcher.style.borderRadius = '4px';
		layerSwitcher.style.padding = '8px';
		layerSwitcher.style.margin = '10px';
		layerSwitcher.style.minWidth = '150px';

		// Create dropdown
		var select = document.createElement('select');
		select.style.width = '100%';
		select.style.border = 'none';
		select.style.background = 'transparent';
		select.style.fontSize = '12px';

		// Add options
		for (var layerName in mapBaseLayers) {
			var option = document.createElement('option');
			option.value = layerName;
			option.text = layerName;
			if (layerName === currentBaseLayer) {
				option.selected = true;
			}
			select.appendChild(option);
		}

		// Handle layer change
		select.onchange = function() {
			var selectedLayer = this.value;
			changeBaseLayer(selectedLayer);
		};

		layerSwitcher.appendChild(select);

		// Add title
		var title = document.createElement('div');
		title.innerHTML = '🗺️ Base Layer';
		title.style.fontSize = '11px';
		title.style.fontWeight = 'bold';
		title.style.marginBottom = '5px';
		title.style.color = '#666';
		layerSwitcher.insertBefore(title, select);

		// Add to map
		map.addControl({
			onAdd: function() {
				return layerSwitcher;
			},
			onRemove: function() {
				layerSwitcher.parentNode.removeChild(layerSwitcher);
			}
		}, 'top-right');
	}

	// Change base layer function
	function changeBaseLayer(layerName) {
		if (mapBaseLayers[layerName]) {
			currentBaseLayer = layerName;
			map.setStyle(mapBaseLayers[layerName]);
			
			// Re-add any custom layers after style change
			map.once('styledata', function() {
				// Re-add draw control if it exists
				if (draw) {
					map.addControl(draw);
				}
			});
			
			M.toast({html: 'Switched to: ' + layerName, displayLength: 2000});
		}
	}

	function initializeMoreOptions() {

		$("#more-options-toggle").click(function() {
			$("#more-options").toggle();
			adjustDownloadButtonPosition();
		})

		// Historical Analysis toggle
		$("#historical-analysis-toggle").click(function() {
			$("#historical-analysis").toggle();
			adjustDownloadButtonPosition();
		})

		var outputFileBox = $("#output-file-box")
		$("#output-type").change(function() {
			var outputType = $("#output-type").val();
			if(outputType == "mbtiles") {
				outputFileBox.val("tiles.mbtiles")
			} else if(outputType == "repo") {
				outputFileBox.val("tiles.repo")
			} else if(outputType == "directory") {
				outputFileBox.val("{z}/{x}/{y}.png")
			}
		})

		// Year slider controls
		initializeYearSliders();

		// Comparative download toggle
		$("#enable-comparison").change(function() {
			var isEnabled = $(this).is(':checked');
			
			if (isEnabled) {
				$("#comparison-controls").show();
				M.toast({html: 'Comparative download enabled! Same area will be downloaded for different periods.', displayLength: 4000});
			} else {
				$("#comparison-controls").hide();
			}
			
			// Adjust button position when comparison controls change
			setTimeout(adjustDownloadButtonPosition, 100);
		});

		// Initialize Google API format selector
		$("#google-api-format").change(function() {
			var selectedFormat = $(this).val();
			console.log("🔧 Google API Format değiştirildi:", selectedFormat);
			M.toast({html: 'Google API format changed to: ' + $(this).find("option:selected").text(), displayLength: 3000});
		});

	}

	// Function to adjust download button position based on expanded menus
	function adjustDownloadButtonPosition() {
		// Small delay to ensure DOM updates are complete
		setTimeout(function() {
			var downloadButton = $("#download-button");
			
			// Remove any existing positioning and classes
			downloadButton.removeClass('bottom-button');
			downloadButton.css({
				'position': '',
				'bottom': '',
				'top': '',
				'left': '',
				'width': '',
				'margin': ''
			});
			
			// Calculate content height dynamically
			var sidebarHeight = 0;
			
			// Add each section's height
			$('#main-sidebar').children(':not(#download-button)').each(function() {
				if ($(this).is(':visible')) {
					sidebarHeight += $(this).outerHeight(true);
				}
			});
			
			// Check if content exceeds visible area (needs scrolling)
			var availableHeight = window.innerHeight - 40; // Account for padding
			var buttonHeight = 60; // Approximate button + margin height
			
			if (sidebarHeight + buttonHeight > availableHeight) {
				// Content exceeds viewport - use absolute positioning
				downloadButton.css({
					'position': 'absolute',
					'top': (sidebarHeight + 20) + 'px',
					'left': '60px',
					'width': '260px',
					'margin': '0'
				});
				
				// Add padding to ensure button is visible
				$('#main-sidebar').css('padding-bottom', '100px');
			} else {
				// Content fits - use default bottom positioning
				downloadButton.addClass('bottom-button');
				$('#main-sidebar').css('padding-bottom', '0');
			}
		}, 150);
	}

	// Initialize year sliders
	function initializeYearSliders() {
		// Primary period slider
		$("#year-slider-1").on('input', function() {
			var year = parseInt($(this).val());
			updateYearDisplay(1, year);
			updateMapForYear(year);
		});

		// Comparison period slider
		$("#year-slider-2").on('input', function() {
			var year = parseInt($(this).val());
			updateYearDisplay(2, year);
		});

		// Set initial values
		updateYearDisplay(1, 2024);
		updateYearDisplay(2, 2010);
	}

	// Update year display
	function updateYearDisplay(sliderId, year) {
		var displayText = year >= 2024 ? 'Current (' + year + ')' : year.toString();
		$("#year-display-" + sliderId).text(displayText);
	}

	// Update map based on selected year
	function updateMapForYear(year) {
		var layerName;
		
		if (year >= 2024) {
			layerName = 'Google Satellite';
		} else {
			// Find closest available year
			var availableYears = [2000, 2005, 2010, 2015, 2020];
			var closestYear = availableYears.reduce(function(prev, curr) {
				return (Math.abs(curr - year) < Math.abs(prev - year) ? curr : prev);
			});
			layerName = 'Google Historical ' + closestYear;
		}
		
		if (mapBaseLayers[layerName]) {
			changeBaseLayer(layerName);
			M.toast({html: '🗺️ ' + layerName + ' loaded', displayLength: 2000});
		}
	}

	// Google Historical URL Generator
	function generateGoogleHistoricalURL(year, format) {
		switch(format) {
			case 'format1': // Klasik &t=YEAR
				return "https://mt1.google.com/vt?lyrs=s&x={x}&y={y}&z={z}&t=" + year;
				
			case 'format2': // Date format
				return "https://mt1.google.com/vt?lyrs=s&x={x}&y={y}&z={z}&date=" + year + "-01-01";
				
			case 'format3': // KH Service 
				return "https://khms0.googleapis.com/kh?v=" + year + "&x={x}&y={y}&z={z}";
				
			case 'format4': // Earth Engine (Timelapse)
				return "https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/" + year + "/tiles/{z}/{x}/{y}";
				
			default:
				return "https://mt1.google.com/vt?lyrs=s&x={x}&y={y}&z={z}&t=" + year;
		}
	}
	function getSelectedYears() {
		var year1 = parseInt($("#year-slider-1").val());
		var year2 = parseInt($("#year-slider-2").val());
		var isComparison = $("#enable-comparison").is(':checked');
		
		return {
			year1: year1 >= 2024 ? 'current' : year1.toString(),
			year2: isComparison ? year2.toString() : 'none',
			isComparison: isComparison
		};
	}

	function initializeRectangleTool() {
		
		var modes = MapboxDraw.modes;
		modes.draw_rectangle = DrawRectangle.default;

		draw = new MapboxDraw({
			modes: modes
		});
		map.addControl(draw);

		// Çizim tamamlandığında
		map.on('draw.create', function (e) {
			M.Toast.dismissAll();
			updateRegionStatus(true);
		});
		
		// Çizim silindiginde
		map.on('draw.delete', function (e) {
			updateRegionStatus(false);
		});

		$("#rectangle-draw-button").click(function() {
			startDrawing();
		})
		
		// Sayfa yüklenirken durum kontrolü
		updateRegionStatus(false);

	}

	// Bölge seçim durumunu güncelle
	function updateRegionStatus(isSelected) {
		var statusDiv = $("#region-status");
		var statusIcon = $("#region-status-icon");
		var statusText = $("#region-status-text");
		var downloadButton = $("#download-button");
		
		if (isSelected) {
			statusDiv.show();
			statusDiv.css({
				'background': '#e8f5e8',
				'border-left': '3px solid #4caf50'
			});
			statusIcon.text('✅');
			statusText.html('<strong>Region selected!</strong> Ready for download');
			statusText.css('color', '#2e7d32');
			
			// Enable download button
			downloadButton.removeClass('disabled');
			downloadButton.text('📥 Download');
		} else {
			statusDiv.show();
			statusDiv.css({
				'background': '#fff3e0',
				'border-left': '3px solid #ff9800'
			});
			statusIcon.text('⚠️');
			statusText.html('No region selected yet - Click <strong>Rectangle Draw</strong> button');
			statusText.css('color', '#f57500');
			
			// Make download button informative (but still functional)
			downloadButton.text('⚠️ Select region first');
		}
	}

	function startDrawing() {
		removeGrid();
		
		// Mevcut çizimleri temizle ama kullanıcıyı uyar
		if(draw.getAll().features.length > 0) {
			M.toast({html: 'Previous selection cleared, draw new area', displayLength: 3000});
			updateRegionStatus(false);
		}
		
		draw.deleteAll();
		draw.changeMode('draw_rectangle');

		M.Toast.dismissAll();
		M.toast({html: 'Draw rectangle by clicking two points on the map', displayLength: 7000});
		
		// Show notification when drawing is completed
		map.once('draw.create', function(e) {
			var bounds = getBounds();
			var area = (bounds.getNorthEast().lat - bounds.getSouthWest().lat) * 
			          (bounds.getNorthEast().lng - bounds.getSouthWest().lng);
			
			M.toast({html: 'Region selected! This area will be preserved for comparative downloads.', displayLength: 4000});
			logItemRaw("🎯 New region selected: " + 
					   bounds.getSouthWest().lat.toFixed(4) + "," + bounds.getSouthWest().lng.toFixed(4) + " - " +
					   bounds.getNorthEast().lat.toFixed(4) + "," + bounds.getNorthEast().lng.toFixed(4));
			updateRegionStatus(true);
		});
	}

	function initializeGridPreview() {
		$("#grid-preview-button").click(previewGrid);

		map.on('click', showTilePopup);
	}

	function showTilePopup(e) {

		if(!e.originalEvent.ctrlKey) {
			return;
		}

		var maxZoom = getMaxZoom();

		var x = lat2tile(e.lngLat.lat, maxZoom);
		var y = long2tile(e.lngLat.lng, maxZoom);

		var content = "X, Y, Z<br/><b>" + x + ", " + y + ", " + maxZoom + "</b><hr/>";
		content += "Lat, Lng<br/><b>" + e.lngLat.lat + ", " + e.lngLat.lng + "</b>";

        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(content)
            .addTo(map);

        console.log(e.lngLat)

	}

	function long2tile(lon,zoom) {
		return (Math.floor((lon+180)/360*Math.pow(2,zoom)));
	}

	function lat2tile(lat,zoom)  {
		return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)));
	}

	function tile2long(x,z) {
		return (x/Math.pow(2,z)*360-180);
	}

	function tile2lat(y,z) {
		var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
		return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
	}

	function getTileRect(x, y, zoom) {

		var c1 = new mapboxgl.LngLat(tile2long(x, zoom), tile2lat(y, zoom));
		var c2 = new mapboxgl.LngLat(tile2long(x + 1, zoom), tile2lat(y + 1, zoom));

		return new mapboxgl.LngLatBounds(c1, c2);
	}

	function getMinZoom() {
		return Math.min(parseInt($("#zoom-from-box").val()), parseInt($("#zoom-to-box").val()));
	}

	function getMaxZoom() {
		return Math.max(parseInt($("#zoom-from-box").val()), parseInt($("#zoom-to-box").val()));
	}

	function getArrayByBounds(bounds) {

		var tileArray = [
			[ bounds.getSouthWest().lng, bounds.getNorthEast().lat ],
			[ bounds.getNorthEast().lng, bounds.getNorthEast().lat ],
			[ bounds.getNorthEast().lng, bounds.getSouthWest().lat ],
			[ bounds.getSouthWest().lng, bounds.getSouthWest().lat ],
			[ bounds.getSouthWest().lng, bounds.getNorthEast().lat ],
		];

		return tileArray;
	}

	function getPolygonByBounds(bounds) {

		var tilePolygonData = getArrayByBounds(bounds);

		var polygon = turf.polygon([tilePolygonData]);

		return polygon;
	}

	function isTileInSelection(tileRect) {

		var polygon = getPolygonByBounds(tileRect);

		var areaPolygon = draw.getAll().features[0];

		if(turf.booleanDisjoint(polygon, areaPolygon) == false) {
			return true;
		}

		return false;
	}

	function getBounds() {

		var coordinates = draw.getAll().features[0].geometry.coordinates[0];

		var bounds = coordinates.reduce(function(bounds, coord) {
			return bounds.extend(coord);
		}, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

		return bounds;
	}

	function getGrid(zoomLevel) {

		var bounds = getBounds();

		var rects = [];

		var outputScale = $("#output-scale").val();
		//var thisZoom = zoomLevel - (outputScale-1)
		var thisZoom = zoomLevel

		var TY    = lat2tile(bounds.getNorthEast().lat, thisZoom);
		var LX   = long2tile(bounds.getSouthWest().lng, thisZoom);
		var BY = lat2tile(bounds.getSouthWest().lat, thisZoom);
		var RX  = long2tile(bounds.getNorthEast().lng, thisZoom);

		for(var y = TY; y <= BY; y++) {
			for(var x = LX; x <= RX; x++) {

				var rect = getTileRect(x, y, thisZoom);

				if(isTileInSelection(rect)) {
					rects.push({
						x: x,
						y: y,
						z: thisZoom,
						rect: rect,
					});
				}

			}
		}

		return rects
	}

	function getAllGridTiles() {
		var allTiles = [];

		for(var z = getMinZoom(); z <= getMaxZoom(); z++) {
			var grid = getGrid(z);
			// TODO shuffle grid via a heuristic (hamlet curve? :/)
			allTiles = allTiles.concat(grid);
		}

		return allTiles;
	}

	function removeGrid() {
		removeLayer("grid-preview");
	}

	function previewGrid() {

		var maxZoom = getMaxZoom();
		var grid = getGrid(maxZoom);

		var pointsCollection = []

		for(var i in grid) {
			var feature = grid[i];
			var array = getArrayByBounds(feature.rect);
			pointsCollection.push(array);
		}

		removeGrid();

		map.addLayer({
			'id': "grid-preview",
			'type': 'line',
			'source': {
				'type': 'geojson',
				'data': turf.polygon(pointsCollection),
			},
			'layout': {},
			'paint': {
				"line-color": "#fa8231",
				"line-width": 3,
			}
		});

		var totalTiles = getAllGridTiles().length;
		M.toast({html: 'Total ' + totalTiles.toLocaleString() + ' tiles in the region.', displayLength: 5000})

	}

	function previewRect(rectInfo) {

		var array = getArrayByBounds(rectInfo.rect);

		var id = "temp-" + rectInfo.x + '-' + rectInfo.y + '-' + rectInfo.z;

		map.addLayer({
			'id': id,
			'type': 'line',
			'source': {
				'type': 'geojson',
				'data': turf.polygon([array]),
			},
			'layout': {},
			'paint': {
				"line-color": "#ff9f1a",
				"line-width": 3,
			}
		});

		return id;
	}

	function removeLayer(id) {
		if(map.getSource(id) != null) {
			map.removeLayer(id);
			map.removeSource(id);
		}
	}

	function generateQuadKey(x, y, z) {
	    var quadKey = [];
	    for (var i = z; i > 0; i--) {
	        var digit = '0';
	        var mask = 1 << (i - 1);
	        if ((x & mask) != 0) {
	            digit++;
	        }
	        if ((y & mask) != 0) {
	            digit++;
	            digit++;
	        }
	        quadKey.push(digit);
	    }
	    return quadKey.join('');
	}

	function initializeDownloader() {

		bar = new ProgressBar.Circle($('#progress-radial').get(0), {
			strokeWidth: 12,
			easing: 'easeOut',
			duration: 200,
			trailColor: '#eee',
			trailWidth: 1,
			from: {color: '#0fb9b1', a:0},
			to: {color: '#20bf6b', a:1},
			svgStyle: null,
			step: function(state, circle) {
				circle.path.setAttribute('stroke', state.color);
			}
		});

		$("#download-button").click(startDownloading)
		$("#stop-button").click(stopDownloading)

		var timestamp = Date.now().toString();
		//$("#output-directory-box").val(timestamp)
	}

	function showTinyTile(base64) {
		var currentImages = $(".tile-strip img");

		for(var i = 4; i < currentImages.length; i++) {
			$(currentImages[i]).remove();
		}

		var image = $("<img/>").attr('src', "data:image/png;base64, " + base64)

		var strip = $(".tile-strip");
		strip.prepend(image)
	}

	async function startDownloading() {

		// Check if rectangle is selected
		if(draw.getAll().features.length == 0) {
			M.toast({html: '⚠️ Önce haritada bir bölge seçmelisiniz! Rectangle Draw butonuna tıklayın.', displayLength: 5000});
			// Otomatik olarak çizim modunu aktifleştir
			startDrawing();
			return;
		}

		// Rectangle seçimi mevcut - karşılaştırmalı modda da aynı alanı koru
		var selectedFeatures = draw.getAll().features;
		if (selectedFeatures.length > 0) {
			var bounds = getBounds();
			var areaSize = (bounds.getNorthEast().lat - bounds.getSouthWest().lat) * 
			              (bounds.getNorthEast().lng - bounds.getSouthWest().lng);
			
			logItemRaw("📍 Preserving selected area: " + 
					   bounds.getSouthWest().lat.toFixed(4) + "," + bounds.getSouthWest().lng.toFixed(4) + " - " +
					   bounds.getNorthEast().lat.toFixed(4) + "," + bounds.getNorthEast().lng.toFixed(4));
		}

		cancellationToken = false; 
		requests = [];
		
		// Check if comparative mode is enabled
		var yearSelection = getSelectedYears();
		var isComparativeMode = yearSelection.isComparison;
		var year1 = yearSelection.year1;
		var year2 = yearSelection.year2;
		
		// Initialize download stats
		var downloadStats = {
			startTime: Date.now(),
			completedTiles: 0,
			totalTiles: 0,
			errorCount: 0,
			timeoutCount: 0,
			lastUpdateTime: Date.now()
		};

		$("#main-sidebar").hide();
		$("#download-sidebar").show();
		$(".tile-strip").html("");
		$("#stop-button").html("STOP");
		removeGrid();
		clearLogs();
		M.Toast.dismissAll();

		var timestamp = Date.now().toString();

		var allTiles = getAllGridTiles();
		
		// Adjust total tiles count for comparative mode
		if (isComparativeMode && year2 !== 'none') {
			downloadStats.totalTiles = allTiles.length * 2; // Double tiles for comparison
			logItemRaw("🔄 Starting comparative download: " + year1 + " and " + year2);
			logItemRaw("📊 Total " + allTiles.length + " tiles x 2 periods = " + downloadStats.totalTiles + " downloads");
		} else {
			downloadStats.totalTiles = allTiles.length;
			logItemRaw("📊 Single period download: " + downloadStats.totalTiles + " tiles");
		}
		
		updateProgress(0, downloadStats.totalTiles, downloadStats);

		var numThreads = parseInt($("#parallel-threads-box").val());
		var outputDirectory = $("#output-directory-box").val();
		var outputFile = $("#output-file-box").val();
		var outputType = $("#output-type").val();
		var outputScale = $("#output-scale").val();
		var source = $("#source-box").val();
		
		// Generate sources for comparative mode
		var sources = [];
		var googleFormat = $("#google-api-format").val() || 'format1';
		
		if (isComparativeMode && year2 !== 'none') {
			// First period source
			var source1;
			if (year1 === 'current') {
				source1 = "https://mt0.google.com/vt?lyrs=s&x={x}&y={y}&z={z}";
			} else {
				// Google tarihsel format seçimine göre URL oluştur
				source1 = generateGoogleHistoricalURL(year1, googleFormat);
			}
			
			// Second period source
			var source2 = generateGoogleHistoricalURL(year2, googleFormat);
			
			// Debug: Log URLs to console
			console.log("🔍 Tarihsel Format:", googleFormat);
			console.log("🔍 Source 1 URL:", source1);
			console.log("🔍 Source 2 URL:", source2);
			
			sources = [
				{url: source1, suffix: "_" + (year1 === 'current' ? 'current' : year1), label: year1 === 'current' ? 'Current' : year1},
				{url: source2, suffix: "_" + year2, label: year2}
			];
		} else {
			// Single mode
			var singleSource;
			if (year1 === 'current') {
				singleSource = source; // Use the source from input box
			} else {
				singleSource = generateGoogleHistoricalURL(year1, googleFormat);
				console.log("🔍 Tekli Tarihsel (", googleFormat, "):", singleSource);
			}
			sources = [{url: singleSource, suffix: "", label: "Single period"}];
		}

		var bounds = getBounds();
		var boundsArray = [bounds.getSouthWest().lng, bounds.getSouthWest().lat, bounds.getNorthEast().lng, bounds.getNorthEast().lat]
		var centerArray = [bounds.getCenter().lng, bounds.getCenter().lat, getMaxZoom()]
		
		// Start download for each source
		for (let sourceIndex = 0; sourceIndex < sources.length; sourceIndex++) {
			var currentSource = sources[sourceIndex];
			var adjustedOutputDirectory = outputDirectory + currentSource.suffix;
			var adjustedOutputFile = outputFile.replace(/\.(\w+)$/, currentSource.suffix + '.$1');
			
				logItemRaw("🔍 HATAY DEPREM ANALIZi için tarihsel indirme başlatılıyor...");
				logItemRaw("📍 Yıl 1: " + year1 + " (" + (year1 === 'current' ? 'Güncel' : 'Deprem Öncesi') + ")");
				logItemRaw("📍 Yıl 2: " + year2 + " (Deprem Sonrası)");
				logItemRaw("📁 Klasör 1: " + adjustedOutputDirectory.replace(currentSource.suffix, sources[0].suffix));
				logItemRaw("📁 Klasör 2: " + adjustedOutputDirectory);
				
				// Test alternative Google API formats
				if (currentSource.url.includes("&t=")) {
					logItemRaw("⚙️ Google Tarihsel API formatı kullanılıyor: " + currentSource.url);
				}
			
			var data = new FormData();
			data.append('minZoom', getMinZoom())
			data.append('maxZoom', getMaxZoom())
			data.append('outputDirectory', adjustedOutputDirectory)
			data.append('outputFile', adjustedOutputFile)
			data.append('outputType', outputType)
			data.append('outputScale', outputScale)
			data.append('source', currentSource.url)
			data.append('timestamp', timestamp)
			data.append('bounds', boundsArray.join(","))
			data.append('center', centerArray.join(","))

			var request = await $.ajax({
				url: "/start-download",
				async: true,
				timeout: 60 * 1000, // Increased timeout to 60 seconds
				type: "post",
				contentType: false,
				processData: false,
				data: data,
				dataType: 'json',
			})
		}

		let i = 0;
		var downloadTasks = [];
		
		// Create download tasks for all combinations
		for (let sourceIndex = 0; sourceIndex < sources.length; sourceIndex++) {
			var currentSource = sources[sourceIndex];
			var adjustedOutputDirectory = outputDirectory + currentSource.suffix;
			var adjustedOutputFile = outputFile.replace(/\.(\w+)$/, currentSource.suffix + '.$1');
			
			for (let tileIndex = 0; tileIndex < allTiles.length; tileIndex++) {
				downloadTasks.push({
					tile: allTiles[tileIndex],
					source: currentSource,
					outputDirectory: adjustedOutputDirectory,
					outputFile: adjustedOutputFile
				});
			}
		}

		var iterator = async.eachLimit(downloadTasks, numThreads, function(task, done) {

			if(cancellationToken) {
				return;
			}

			var boxLayer = previewRect(task.tile);

			var url = "/download-tile";

			var data = new FormData();
			data.append('x', task.tile.x)
			data.append('y', task.tile.y)
			data.append('z', task.tile.z)
			data.append('quad', generateQuadKey(task.tile.x, task.tile.y, task.tile.z))
			data.append('outputDirectory', task.outputDirectory)
			data.append('outputFile', task.outputFile)
			data.append('outputType', outputType)
			data.append('outputScale', outputScale)
			data.append('timestamp', timestamp)
			data.append('source', task.source.url)
			data.append('bounds', boundsArray.join(","))
			data.append('center', centerArray.join(","))

			var request = $.ajax({
				"url": url,
				async: true,
				timeout: 45 * 1000, // Increased timeout to 45 seconds
				type: "post",
			    contentType: false,
			    processData: false,
				data: data,
				dataType: 'json',
				retry: 0, // Track retry count
				cache: false,
			}).done(function(data) {

				if(cancellationToken) {
					return;
				}

				if(data.code == 200) {
					showTinyTile(data.image)
					logItem(task.tile.x, task.tile.y, task.tile.z, "✓ " + task.source.label + " - " + data.message);
					downloadStats.completedTiles++;
				} else {
					logItem(task.tile.x, task.tile.y, task.tile.z, "✗ " + task.source.label + " - " + data.code + " Error downloading tile");
					downloadStats.errorCount++;
				}

			}).fail(function(jqXHR, textStatus, errorThrown) {

				if(cancellationToken) {
					return;
				}

				var errorMsg = "";
				if (textStatus === 'timeout') {
					errorMsg = "⏱️ Timeout - " + task.source.label + " tile took too long";
					downloadStats.timeoutCount++;
				} else if (textStatus === 'error') {
					errorMsg = "🔗 Network error - " + task.source.label + " - " + (jqXHR.status || 'unknown');
					downloadStats.errorCount++;
				} else {
					errorMsg = "❌ " + task.source.label + " - " + textStatus + " - " + errorThrown;
					downloadStats.errorCount++;
				}
				
				logItem(task.tile.x, task.tile.y, task.tile.z, errorMsg);
				
				// Optional: Add failed tile back to queue for retry
				// if (this.retry < 2) {
				//     this.retry++;
				//     allTiles.push(item);
				// }

			}).always(function(data) {
				i++;

				removeLayer(boxLayer);
				updateProgress(i, downloadStats.totalTiles, downloadStats);

				done();
				
				if(cancellationToken) {
					return;
				}
			});

			requests.push(request);

		}, async function(err) {
			
			// End download for each source
			for (let sourceIndex = 0; sourceIndex < sources.length; sourceIndex++) {
				var currentSource = sources[sourceIndex];
				var adjustedOutputDirectory = outputDirectory + currentSource.suffix;
				var adjustedOutputFile = outputFile.replace(/\.(\w+)$/, currentSource.suffix + '.$1');
				
				var data = new FormData();
				data.append('minZoom', getMinZoom())
				data.append('maxZoom', getMaxZoom())
				data.append('outputDirectory', adjustedOutputDirectory)
				data.append('outputFile', adjustedOutputFile)
				data.append('outputType', outputType)
				data.append('outputScale', outputScale)
				data.append('source', currentSource.url)
				data.append('timestamp', timestamp)
				data.append('bounds', boundsArray.join(","))
				data.append('center', centerArray.join(","))
				
				var request = await $.ajax({
					url: "/end-download",
					async: true,
					timeout: 60 * 1000, // Increased timeout to 60 seconds
					type: "post",
					contentType: false,
					processData: false,
					data: data,
					dataType: 'json',
				})
				
				logItemRaw("✅ " + currentSource.label + " completed!");
			}

			updateProgress(downloadStats.totalTiles, downloadStats.totalTiles, downloadStats);
			var elapsed = (Date.now() - downloadStats.startTime) / 1000;
			logItemRaw("\n✅ All downloads completed in " + elapsed.toFixed(1) + "s");
			logItemRaw("📊 Statistics: " + downloadStats.completedTiles + " successful, " + downloadStats.errorCount + " errors, " + downloadStats.timeoutCount + " timeouts");
			
			if (isComparativeMode && year2 !== 'none') {
				logItemRaw("🔄 Files ready for comparative analysis!");
				logItemRaw("📂 " + year1 + " data: " + outputDirectory + "_" + (year1 === 'current' ? 'current' : year1));
				logItemRaw("📂 " + year2 + " data: " + outputDirectory + "_" + year2);
			}

			$("#stop-button").html("FINISH");
		});

	}

	function updateProgress(value, total, stats) {
		var progress = value / total;

		bar.animate(progress);
		bar.setText(Math.round(progress * 100) + '<span>%</span>');

		// Calculate download speed and ETA
		var progressText = value.toLocaleString() + " <span>out of</span> " + total.toLocaleString();
		
		if (stats && value > 0) {
			var elapsed = (Date.now() - stats.startTime) / 1000; // seconds
			var tilesPerSecond = value / elapsed;
			var remaining = total - value;
			var eta = remaining / tilesPerSecond;
			
			// Add speed and ETA info
			progressText += "<br/><small>";
			progressText += "🚀 " + tilesPerSecond.toFixed(1) + " tiles/sec";
			
			if (eta < 60) {
				progressText += " • ⏱️ " + Math.round(eta) + "s left";
			} else if (eta < 3600) {
				progressText += " • ⏱️ " + Math.round(eta/60) + "m left";
			} else {
				progressText += " • ⏱️ " + (eta/3600).toFixed(1) + "h left";
			}
			
			if (stats.errorCount > 0) {
				progressText += " • ❌ " + stats.errorCount + " errors";
			}
			
			progressText += "</small>";
		}

		$("#progress-subtitle").html(progressText);
	}

	function logItem(x, y, z, text) {
		logItemRaw(x + ',' + y + ',' + z + ' : ' + text)
	}

	function logItemRaw(text) {

		var logger = $('#log-view');
		logger.val(logger.val() + '\n' + text);

		logger.scrollTop(logger[0].scrollHeight);
	}

	function clearLogs() {
		var logger = $('#log-view');
		logger.val('');
	}

	function stopDownloading() {
		cancellationToken = true;

		for(var i =0 ; i < requests.length; i++) {
			var request = requests[i];
			try {
				request.abort();
			} catch(e) {

			}
		}

		$("#main-sidebar").show();
		$("#download-sidebar").hide();
		removeGrid();
		clearLogs();

	}

	initializeMaterialize();
	initializeSources();
	initializeMap();
	initializeSearch();
	initializeRectangleTool();
	initializeGridPreview();
	initializeMoreOptions();
	initializeDownloader();
	
	// Initialize button positioning after everything is loaded
	setTimeout(adjustDownloadButtonPosition, 500);
	
	// Handle window resize
	$(window).resize(function() {
		adjustDownloadButtonPosition();
	});
});