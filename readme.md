# Image Processing Application

## Overview

This application processes image data from CSV files. It validates the CSV format, processes images (compresses them to 50% of their original quality), stores the processed image data, and provides asynchronous APIs for status checking and webhooks. The application is built using Node.js and Appwrite for file management and storage.

## Features

- Upload CSV files containing image URLs for processing.
- Validate the CSV data format.
- Asynchronously compress images.
- Store processed images using Appwrite storage.
- Provide a unique request ID for each file submission.
- Check processing status using the request ID.
- Webhook support for notifying after image processing completion.
- Generate output CSV with processed image URLs.

## Tech Stack

- Node.js
- Appwrite
- Express
- MongoDB
- Multer
- Sharp

## Project Structure

your-project/
│
├── controllers/
│ ├── imageController.js # Handles image processing logic
│ ├── fileController.js # Manages file operations using Appwrite
│
├── models/
│ ├── Request.js # Mongoose model for request tracking
│
├── routes/
│ ├── imageRoutes.js # Routes for image processing APIs
│ ├── fileRoutes.js # Routes for file management APIs
│
├── services/
│ ├── imageProcessor.js # Image processing service
│ ├── appwriteService.js # Appwrite service for file management
│
├── public/
│ └── processed_images/ # Directory for processed images (if needed)
│
├── .env # Environment variables
├── app.js # Main application entry point
├── package.json
└── README.md

markdown
Copy code

## API Endpoints

### Upload CSV

**Endpoint**: `POST /api/images/upload`

**Description**: Accepts a CSV file, validates the format, and returns a unique request ID.

**Request**:
- Method: `POST`
- URL: `/api/images/upload`
- Headers: `Content-Type: multipart/form-data`
- Body: 
  - Key: `file`
  - Type: `File`
  - Description: The CSV file to upload.

**Response**:
- Success: `200 OK`
  ```json
  {
    "requestId": "unique_request_id"
  }
Error: 400 Bad Request or 500 Internal Server Error
Check Status
Endpoint: GET /api/images/status/:requestId

Description: Check the processing status of a request using the request ID.

Request:

Method: GET
URL: /api/images/status/:requestId
Parameters:
requestId: The unique request ID.
Response:

Success: 200 OK
json
Copy code
{
  "requestId": "unique_request_id",
  "status": "completed",
  "processedData": [...]
}
Error: 404 Not Found or 500 Internal Server Error
Webhook
Endpoint: POST /api/images/webhook

Description: Receives notifications after image processing is complete.

Request:

Method: POST
URL: /api/images/webhook
Body: JSON object with processing details.
Response:

Success: 200 OK
Error: 400 Bad Request or 500 Internal Server Error
File Management
Upload File

Endpoint: POST /api/files/upload

Description: Uploads a file to Appwrite storage.

Request:

Method: POST
URL: /api/files/upload
Headers: Content-Type: multipart/form-data
Body:
Key: file
Type: File
Description: The file to upload.
Response:

Success: 200 OK
json
Copy code
{
  "$id": "unique_file_id",
  "bucketId": "bucket_id",
  "fileId": "unique_file_id",
  "sizeOriginal": 12345,
  "mimeType": "image/jpeg",
  "signature": "signature_string",
  "name": "file_name.jpg"
}
Error: 500 Internal Server Error
Get File

Endpoint: GET /api/files/file/:fileId

Description: Retrieves information about a specific file from Appwrite storage.

Request:

Method: GET
URL: /api/files/file/:fileId
Parameters:
fileId: The ID of the file to retrieve.
Response:

Success: 200 OK
json
Copy code
{
  "$id": "unique_file_id",
  "bucketId": "bucket_id",
  "fileId": "unique_file_id",
  "sizeOriginal": 12345,
  "mimeType": "image/jpeg",
  "signature": "signature_string",
  "name": "file_name.jpg"
}
Error: 500 Internal Server Error
Update File

Endpoint: PUT /api/files/update/:fileId

Description: Updates a file in Appwrite storage. This involves deleting the old file and uploading a new one.

Request:

Method: PUT
URL: /api/files/update/:fileId
Headers: Content-Type: multipart/form-data
Parameters:
fileId: The ID of the file to update.
Body:
Key: file
Type: File
Description: The new file to replace the old one.
Response:

Success: 200 OK
json
Copy code
{
  "$id": "new_unique_file_id",
  "bucketId": "bucket_id",
  "fileId": "new_unique_file_id",
  "sizeOriginal": 12345,
  "mimeType": "image/jpeg",
  "signature": "signature_string",
  "name": "new_file_name.jpg"
}
Error: 500 Internal Server Error
Delete File

Endpoint: DELETE /api/files/delete/:fileId

Description: Deletes a file from Appwrite storage.

Request:

Method: DELETE
URL: /api/files/delete/:fileId
Parameters:
fileId: The ID of the file to delete.
Response:

Success: 200 OK
json
Copy code
{
  "message": "File deleted successfully"
}
Error: 500 Internal Server Error
Asynchronous Workers Documentation
Image Processing Worker
File: services/imageProcessor.js

Functions
processImages

Description: Compresses an image to 50% of its original quality.
Parameters:
inputImageUrl: URL of the input image.
outputPath: Path where the compressed image will be saved.
Returns: A promise that resolves when the image processing is complete.
Usage:
javascript
Copy code
async function processImages(inputImageUrl, outputPath) {
  try {
    await sharp(inputImageUrl)
      .jpeg({ quality: 50 })
      .toFile(outputPath);
    return outputPath;
  } catch (error) {
    throw new Error('Error processing image: ' + error.message);
  }
}
Request Processing Worker
File: controllers/imageController.js

Functions
processCSV

Description: Processes the uploaded CSV file, validates data, and triggers image processing.
Parameters:
filePath: Path of the uploaded CSV file.
requestId: Unique ID associated with the processing request.
Usage:
javascript
Copy code
async function processCSV(filePath, requestId) {
  // Read and parse the CSV file
  // Validate CSV data
  // Process each image URL
  // Update the database with processing results
}
updateRequestStatus

Description: Updates the status of the processing request in the database.
Parameters:
requestId: Unique ID associated with the processing request.
status: Status to update (e.g., 'completed', 'error').
outputData: Optional parameter containing the results of the processing.
Usage:
javascript
Copy code
async function updateRequestStatus(requestId, status, outputData) {
  // Find the request by ID in the database
  // Update the status and output data
}
Setup and Installation
Clone the repository:

sh
Copy code
git clone https://github.com/your-repo/your-project.git
cd your-project
Install dependencies:

sh
Copy code
npm install
Create a .env file with the following variables:

env
Copy code
APPWRITE_ENDPOINT=https://[YOUR_APPWRITE_ENDPOINT]
APPWRITE_PROJECT_ID=[YOUR_PROJECT_ID]
APPWRITE_API_KEY=[YOUR_API_KEY]
MONGODB_URI=[YOUR_MONGODB_URI]
PORT=3000
Run the application:

sh
Copy code
npm start
Deployment
Deploying to Render
Create a new service on Render.
Connect your GitHub repository.
Set the build command:
sh
Copy code
npm install
Set the start command:
sh
Copy code
npm start
Add the environment variables as specified in the .env file.
