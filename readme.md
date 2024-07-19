# CSV Image Processing API

This API allows users to upload a CSV file containing product information and image URLs. The API processes each image asynchronously and saves the output images in a separate directory. The API also provides endpoints to check the processing status and download the processed CSV file.

## Endpoints

### `/upload`

- **Method**: `POST`
- **Description**: Uploads a CSV file for processing.
- **Request Body**: Form data with a file field named "file".
- **Response**: JSON object containing the request ID.

### `/status/:requestId`

- **Method**: `GET`
- **Description**: Retrieves the processing status of a request based on the `requestId` parameter.
- **Parameters**:
  - `requestId`: The ID of the request.
- **Response**: JSON object containing the request status and data (if available).

### `/download/:requestId`

- **Method**: `GET`
- **Description**: Downloads a CSV file containing the processed data based on the `requestId` parameter.
- **Parameters**:
  - `requestId`: The ID of the request.
- **Response**: CSV file containing the processed data.

## Installation

1. Clone the repository: `git clone <repository-url>`
2. Install dependencies: `npm install`

## Usage

1. Start the server: `node app.js`
2. Use a tool like Postman to interact with the endpoints:
   - To upload a file, send a `POST` request to `/upload` with a file attached.
   - To check processing status, send a `GET` request to `/status/:requestId`.
   - To download a CSV file, send a `GET` request to `/download/:requestId`.

## Dependencies

- `express`: For creating the server and defining routes.
- `multer`: For handling file uploads.
- `axios`: For making HTTP requests.
- `sharp`: For image processing.
- `uuid`: For generating unique identifiers.
- `fs`: For file system operations.
- `appwrite`: For interacting with the Appwrite API.
- `blob-polyfill`: For handling Blob objects.
- `file-type`: For determining file types.
- `node-appwrite/file`: For interacting with the Appwrite File API.
- Other dependencies as per your `package.json`.

## Additional Notes

- Ensure proper error handling and security measures are implemented.
- The API utilizes MongoDB to store request information.
- The processed images are saved in the `processed_images` directory.
- The API integrates with the Appwrite API for image processing.

## Code Context

### `services/storageService.js`

The `storageService.js` file contains functions for uploading files to the Appwrite storage.

### `services/imageProcessing.js`

The `imageProcessing.js` file contains functions for processing images, saving images, and uploading images to storage.

### `routes/index.js`

The `index.js` file defines the main routes for handling CSV file uploads, processing status checks, and CSV file downloads.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvement, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
