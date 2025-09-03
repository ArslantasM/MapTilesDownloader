#!/usr/bin/env python

from http.server import BaseHTTPRequestHandler, HTTPServer
from socketserver import ThreadingMixIn
import threading

from urllib.parse import urlparse
from urllib.parse import parse_qs
from urllib.parse import parse_qsl
import urllib.request
import uuid
import random
import string
from email.message import EmailMessage
from email.parser import Parser
from io import StringIO
import argparse
import uuid
import random
import time
import json
import shutil
import ssl
import glob
import os
import base64
import mimetypes 

from file_writer import FileWriter
from mbtiles_writer import MbtilesWriter
from repo_writer import RepoWriter
from utils import Utils

lock = threading.Lock()

class serverHandler(BaseHTTPRequestHandler):
		
	def randomString(self):
		return uuid.uuid4().hex.upper()[0:6]

	def _parse_multipart_data(self, raw_data, content_type):
		"""Parse multipart/form-data without cgi module"""
		if 'boundary=' not in content_type:
			return {}
		
		boundary = content_type.split('boundary=')[1].split(';')[0].strip('"')
		boundary_bytes = ('--' + boundary).encode('utf-8')
		
		# Split by boundary
		parts = raw_data.split(boundary_bytes)
		form_data = {}
		
		for part in parts[1:-1]:  # Skip first empty and last closing parts
			if not part.strip():
				continue
				
			# Split headers and content
			header_end = part.find(b'\r\n\r\n')
			if header_end == -1:
				continue
				
			headers = part[:header_end].decode('utf-8')
			content = part[header_end + 4:].rstrip(b'\r\n')
			
			# Extract field name from Content-Disposition header
			for line in headers.split('\r\n'):
				if line.startswith('Content-Disposition:'):
					if 'name="' in line:
						name = line.split('name="')[1].split('"')[0]
						form_data[name] = [content.decode('utf-8')]
						break
		
		return form_data

	def writerByType(self, type):
		if type == "mbtiles":
			return MbtilesWriter
		elif type == "repo":
			return RepoWriter
		elif type == "directory":
			return FileWriter
		else:
			# Default to FileWriter if unknown type
			return FileWriter

	def do_POST(self):

		content_type = self.headers.get('Content-Type', '')
		content_len = int(self.headers.get('Content-length', 0))
		
		# Read the raw POST data
		raw_data = self.rfile.read(content_len)
		
		# Parse multipart form data
		postvars = self._parse_multipart_data(raw_data, content_type)

		parts = urlparse(self.path)
		if parts.path == '/download-tile':

			x = int(postvars['x'][0])
			y = int(postvars['y'][0])
			z = int(postvars['z'][0])
			quad = str(postvars['quad'][0])
			timestamp = int(postvars['timestamp'][0])
			outputDirectory = str(postvars['outputDirectory'][0])
			outputFile = str(postvars['outputFile'][0])
			outputType = str(postvars['outputType'][0])
			outputScale = int(postvars['outputScale'][0])
			source = str(postvars['source'][0])

			replaceMap = {
				"x": str(x),
				"y": str(y),
				"z": str(z),
				"quad": quad,
				"timestamp": str(timestamp),
			}

			for key, value in replaceMap.items():
				newKey = str("{" + str(key) + "}")
				outputDirectory = outputDirectory.replace(newKey, value)
				outputFile = outputFile.replace(newKey, value)

			result = {}

			filePath = os.path.join("output", outputDirectory, outputFile)

			print("\n")

			if self.writerByType(outputType).exists(filePath, x, y, z):
				result["code"] = 200
				result["message"] = 'Tile already exists'

				print("EXISTS: " + filePath)

			else:

				tempFile = self.randomString() + ".png"
				tempFilePath = os.path.join("temp", tempFile)

				result["code"] = Utils.downloadFileScaled(source, tempFilePath, x, y, z, outputScale)

				print("HIT: " + source + "\n" + "RETURN: " + str(result["code"]))

				if os.path.isfile(tempFilePath):
					self.writerByType(outputType).addTile(lock, filePath, tempFilePath, x, y, z, outputScale)

					with open(tempFilePath, "rb") as image_file:
						result["image"] = base64.b64encode(image_file.read()).decode("utf-8")

					os.remove(tempFilePath)

					result["message"] = 'Tile Downloaded'
					print("SAVE: " + filePath)

				else:
					result["message"] = 'Download failed'


			self.send_response(200)
			# self.send_header("Access-Control-Allow-Origin", "*")
			self.send_header("Content-Type", "application/json")
			self.end_headers()
			self.wfile.write(json.dumps(result).encode('utf-8'))
			return
			
		elif parts.path == '/start-download':
			outputType = str(postvars['outputType'][0])
			outputScale = int(postvars['outputScale'][0])
			outputDirectory = str(postvars['outputDirectory'][0])
			outputFile = str(postvars['outputFile'][0])
			minZoom = int(postvars['minZoom'][0])
			maxZoom = int(postvars['maxZoom'][0])
			timestamp = int(postvars['timestamp'][0])
			bounds = str(postvars['bounds'][0])
			boundsArray = map(float, bounds.split(","))
			center = str(postvars['center'][0])
			centerArray = map(float, center.split(","))

			replaceMap = {
				"timestamp": str(timestamp),
			}

			for key, value in replaceMap.items():
				newKey = str("{" + str(key) + "}")
				outputDirectory = outputDirectory.replace(newKey, value)
				outputFile = outputFile.replace(newKey, value)

			filePath = os.path.join("output", outputDirectory, outputFile)

			self.writerByType(outputType).addMetadata(lock, os.path.join("output", outputDirectory), filePath, outputFile, "Map Tiles Downloader via AliFlux", "png", boundsArray, centerArray, minZoom, maxZoom, "mercator", 256 * outputScale)

			result = {}
			result["code"] = 200
			result["message"] = 'Metadata written'

			self.send_response(200)
			# self.send_header("Access-Control-Allow-Origin", "*")
			self.send_header("Content-Type", "application/json")
			self.end_headers()
			self.wfile.write(json.dumps(result).encode('utf-8'))
			return
			
		elif parts.path == '/end-download':
			outputType = str(postvars['outputType'][0])
			outputScale = int(postvars['outputScale'][0])
			outputDirectory = str(postvars['outputDirectory'][0])
			outputFile = str(postvars['outputFile'][0])
			minZoom = int(postvars['minZoom'][0])
			maxZoom = int(postvars['maxZoom'][0])
			timestamp = int(postvars['timestamp'][0])
			bounds = str(postvars['bounds'][0])
			boundsArray = map(float, bounds.split(","))
			center = str(postvars['center'][0])
			centerArray = map(float, center.split(","))

			replaceMap = {
				"timestamp": str(timestamp),
			}

			for key, value in replaceMap.items():
				newKey = str("{" + str(key) + "}")
				outputDirectory = outputDirectory.replace(newKey, value)
				outputFile = outputFile.replace(newKey, value)

			filePath = os.path.join("output", outputDirectory, outputFile)

			self.writerByType(outputType).close(lock, os.path.join("output", outputDirectory), filePath, minZoom, maxZoom)

			result = {}
			result["code"] = 200
			result["message"] = 'Downloaded ended'

			self.send_response(200)
			# self.send_header("Access-Control-Allow-Origin", "*")
			self.send_header("Content-Type", "application/json")
			self.end_headers()
			self.wfile.write(json.dumps(result).encode('utf-8'))
			return

	def do_GET(self):
		try:
			parts = urlparse(self.path)
			path = parts.path.strip('/')
			if path == "":
				path = "index.htm"

			file = os.path.join("UI", path)
			
			# Check if file exists
			if not os.path.exists(file):
				self.send_response(404)
				self.send_header("Content-Type", "text/html")
				self.end_headers()
				self.wfile.write(b"<h1>404 - File Not Found</h1>")
				return
			
			mime = mimetypes.MimeTypes().guess_type(file)[0]
			if mime is None:
				mime = "application/octet-stream"

			self.send_response(200)
			# self.send_header("Access-Control-Allow-Origin", "*")
			self.send_header("Content-Type", mime)
			self.end_headers()
			
			with open(file, "rb") as f:
				self.wfile.write(f.read())
				
		except Exception as e:
			print(f"Error serving file {self.path}: {e}")
			self.send_response(500)
			self.send_header("Content-Type", "text/html")
			self.end_headers()
			self.wfile.write(b"<h1>500 - Internal Server Error</h1>")
		
class serverThreadedHandler(ThreadingMixIn, HTTPServer):
	"""Handle requests in a separate thread."""

def run():
	print('Starting Server...')
	server_address = ('', 8080)
	httpd = serverThreadedHandler(server_address, serverHandler)
	print('Running Server...')

	# os.startfile('UI\\index.htm', 'open')
	print("Open http://localhost:8080/ to view the application.")

	httpd.serve_forever()
 
run()
