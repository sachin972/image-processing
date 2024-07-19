const fs = require("fs");
const csv = require("csv-parser");
const mongoose = require("mongoose");
const axios = require("axios");
const { saveImage } = require("../services/imageProcessing");
const Request = require("../models/Request");
const csvWriter = require("csv-writer");
const { stringify } = require("csv-stringify");

async function handleCSVUpload(req, res) {
  console.log("File received:", req.file); // Debug log

  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  const filePath = req.file.path;
  console.log("File path:", filePath); // Debug log

  // Process the CSV file
  const results = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      // Validate CSV data format
      if (data["S No"] && data["Product Name"] && data["Input Image Urls"]) {
        results.push(data);
      } else {
        console.error("Invalid CSV format:", data);
      }
    })
    .on("end", async () => {
      if (results.length === 0) {
        return res.status(400).send("Invalid CSV data or no valid rows found");
      }

      const requestId = new mongoose.Types.ObjectId();
      const request = new Request({
        requestID: requestId,
        status: "processing",
        data: results,
      });
      await request.save();

      // Start processing images (async)
      for (const row of results) {
        const inputUrls = row["Input Image Urls"]
          .split(",")
          .map((url) => url.trim());
        try {
          const outputUrls = await Promise.all(
            inputUrls.map((url) => saveImage(url))
          );
          // Save the output URLs in the database
          await Request.findOneAndUpdate(
            { requestID: requestId },
            {
              $push: {
                processedData: {
                  product: row["Product Name"],
                  inputUrls,
                  outputUrls,
                },
              },
            },
            { new: true }
          );
        } catch (error) {
          console.error(
            "Error processing images for product:",
            row["Product Name"],
            error
          );
        }
      }

      // Update status to complete after processing all images
      await Request.findOneAndUpdate(
        { requestID: requestId },
        { status: "complete" }
      );

      // Trigger webhook
      //   if (process.env.WEBHOOK_URL) {
      //     try {
      //       await axios.get(
      //         `${process.env.URL}${process.env.WEBHOOK_URL}/${requestId}`
      //       );
      //     } catch (error) {
      //       console.error("Error triggering webhook:", error.message);
      //     }
      //   }

      res.status(200).send({ requestId });
    })
    .on("error", (error) => {
      console.error("Error reading CSV file:", error);
      res.status(500).send("Error processing CSV file");
    });
}

async function checkProcessingStatus(req, res) {
  const { requestId } = req.params;
  const request = await Request.findOne({ requestID: requestId });
  if (!request) {
    return res.status(404).send("Request not found");
  }
  res.send(request);
}

async function downloadCSV(req, res) {
  const { requestId } = req.params;
  const request = await Request.findOne({ requestID: requestId });
  if (!request) {
    return res.status(404).send("Request not found");
  }
  if (request.status === "processing") {
    return res.send("Please have patience, We are processing the files");
  }

  const csvData = [];
  csvData.push([
    "S. No.",
    "Product Name",
    "Input Image Urls",
    "Output Image Urls",
  ]);
  request.processedData.forEach((item, index) => {
    csvData.push([
      index + 1,
      item.product,
      item.inputUrls.join(","),
      item.outputUrls.join(","),
    ]);
  });
  //   const file = new File([csvData], "data.csv", { type: "text/csv" });
  //   console.log(file);

  stringify(csvData, (err, csvContent) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error generating CSV");
    } else {
      // Set the appropriate headers for the CSV file
      res.setHeader("Content-Disposition", "attachment; filename=example.csv");
      res.setHeader("Content-Type", "text/csv");

      // Send the CSV content to the client
      res.send(csvContent);
    }
  });

  //   const csvString = csvData
  //     .map(
  //       (row) =>
  //         `${row["S. No."]},${row["Product Name"]},${row["Input Image Urls"]},${row["Output Image Urls"]}`
  //     )
  //     .join("\n");
  //   res.setHeader("Content-Type", "text/csv");
  //   res.setHeader("Content-Disposition", `attachment; filename=data.csv`);
  //   res.send(file);
}

module.exports = { handleCSVUpload, checkProcessingStatus, downloadCSV };
