#!/usr/bin/env python

from urllib.parse import urlparse
from urllib.parse import parse_qs
from urllib.parse import parse_qsl
import urllib.request
import urllib.error
import uuid
import random
import string
import argparse
import time
import json
import shutil
import ssl
import glob
import os
import base64
import math
import socket
from http.client import HTTPSConnection, HTTPConnection

from PIL import Image

class Utils:
	
	@staticmethod
	def randomString():
		return uuid.uuid4().hex.upper()[0:6]

	@staticmethod
	def getChildTiles(x, y, z):
		childX = x * 2
		childY = y * 2
		childZ = z + 1

		return [
			(childX, childY, childZ),
			(childX+1, childY, childZ),
			(childX+1, childY+1, childZ),
			(childX, childY+1, childZ),
		]

	@staticmethod
	def makeQuadKey(tile_x, tile_y, level):
		quadkey = ""
		for i in range(level):
			bit = level - i
			digit = ord('0')
			mask = 1 << (bit - 1)  # if (bit - 1) > 0 else 1 >> (bit - 1)
			if (tile_x & mask) != 0:
				digit += 1
			if (tile_y & mask) != 0:
				digit += 2
			quadkey += chr(digit)
		return quadkey

	@staticmethod
	def num2deg(xtile, ytile, zoom):
		n = 2.0 ** zoom
		lon_deg = xtile / n * 360.0 - 180.0
		lat_rad = math.atan(math.sinh(math.pi * (1 - 2 * ytile / n)))
		lat_deg = math.degrees(lat_rad)
		return (lat_deg, lon_deg)

	@staticmethod
	def qualifyURL(url, x, y, z):

		scale22 = 23 - (z * 2)

		replaceMap = {
			"x": str(x),
			"y": str(y),
			"z": str(z),
			"scale:22": str(scale22),
			"quad": Utils.makeQuadKey(x, y, z),
		}

		# Replace placeholders with actual values
		for key, value in replaceMap.items():
			newKey = str("{" + str(key) + "}")
			url = url.replace(newKey, value)

		# Debug: Print the final URL to verify historical parameters are preserved
		if "&t=" in url:
			print(f"🔍 TARIHSEL URL OLUSTURULDU: {url}")
			print(f"📍 Koordinatlar: x={x}, y={y}, z={z}")
		else:
			print(f"📍 Normal URL: {url}")

		return url

	@staticmethod
	def mergeQuadTile(quadTiles):

		width = 0
		height = 0

		for tile in quadTiles:
			if(tile is not None):
				width = quadTiles[0].size[0] * 2
				height = quadTiles[1].size[1] * 2
				break

		if width == 0 or height == 0:
			return None

		canvas = Image.new('RGB', (width, height))

		if quadTiles[0] is not None:
			canvas.paste(quadTiles[0], box=(0,0))

		if quadTiles[1] is not None:
			canvas.paste(quadTiles[1], box=(width - quadTiles[1].size[0], 0))

		if quadTiles[2] is not None:
			canvas.paste(quadTiles[2], box=(width - quadTiles[2].size[0], height - quadTiles[2].size[1]))

		if quadTiles[3] is not None:
			canvas.paste(quadTiles[3], box=(0, height - quadTiles[3].size[1]))

		return canvas

	@staticmethod
	def downloadFile(url, destination, x, y, z):
		url = Utils.qualifyURL(url, x, y, z)
		code = 0

		try:
			# Parse URL to get components
			parsed_url = urlparse(url)
			is_https = parsed_url.scheme == 'https'
			host = parsed_url.netloc
			path = parsed_url.path
			if parsed_url.query:
				path += '?' + parsed_url.query

			# Create connection with timeout
			if is_https:
				# Create SSL context once and reuse
				ssl_context = ssl._create_unverified_context()
				conn = HTTPSConnection(host, timeout=15, context=ssl_context)
			else:
				conn = HTTPConnection(host, timeout=15)

			# Make request with proper headers
			headers = {
				'User-Agent': 'MapTilesDownloader/1.0',
				'Accept': 'image/*,*/*;q=0.8',
				'Accept-Encoding': 'identity',
				'Connection': 'close'
			}

			conn.request('GET', path, headers=headers)
			response = conn.getresponse()
			
			code = response.status

			if code == 200:
				# Read and save the file
				data = response.read()
				with open(destination, 'wb') as f:
					f.write(data)
			else:
				print(f"HTTP Error {code} for URL: {url}")

			conn.close()

		except socket.timeout:
			print(f"Timeout downloading: {url}")
			code = -2
		except urllib.error.HTTPError as e:
			print(f"HTTP Error {e.code}: {url}")
			code = e.code
		except urllib.error.URLError as e:
			print(f"URL Error: {e} for {url}")
			code = -1
		except Exception as e:
			print(f"Unexpected error downloading {url}: {e}")
			code = -3

		return code


	@staticmethod
	def downloadFileScaled(url, destination, x, y, z, outputScale):

		if outputScale == 1:
			return Utils.downloadFile(url, destination, x, y, z)

		elif outputScale == 2:

			childTiles = Utils.getChildTiles(x, y, z)
			childImages = []

			for childX, childY, childZ in childTiles:
				
				tempFile = Utils.randomString() + ".png"
				tempFilePath = os.path.join("temp", tempFile)

				code = Utils.downloadFile(url, tempFilePath, childX, childY, childZ)

				if code == 200:
					image = Image.open(tempFilePath)
				else:
					return code

				childImages.append(image)
			
			canvas = Utils.mergeQuadTile(childImages)
			if canvas:
				canvas.save(destination, "PNG")
				return 200
			else:
				return -4  # Error merging tiles

		#TODO implement custom scale

			



