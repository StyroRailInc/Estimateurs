import { HTTP_STATUS } from "../utils/http.js";
import { sendEmail } from "../utils/sendEmail.js";
import { jsonResponse } from "../utils/response.js";
import { AWSEvent, HandlerResponse } from "../interfaces/aws.js";
import busboy from "busboy";
import stream from "stream";

export const handler = async (event: AWSEvent): Promise<HandlerResponse> => {
  return new Promise((resolve, reject) => {
    let fileBuffer: Uint8Array<ArrayBufferLike>[] = [];
    let data: string = "";
    let mimeType: string;
    let fileName2: string;

    // const body = event.isBase64Encoded ? Buffer.from(event.body, "base64") : event.body;
    console.log("Request body length:", event.body.length);
    const bodyStream = new stream.PassThrough();
    bodyStream.end(event.body);

    const bb = busboy({ headers: event.headers, limits: { fileSize: 10 * 1024 * 1024 } });
    console.log("Headers:", event.headers);

    bb.on("file", (name, file, info) => {
      console.log(`File detected: ${info.filename}, MIME type: ${info.mimeType}`);
      fileBuffer = [];
      mimeType = info.mimeType;
      fileName2 = info.filename;
      let totalSize = 0;
      file.on("data", (chunk) => {
        totalSize += chunk.length;
        fileBuffer.push(chunk);
        console.log(`Chunk received: ${chunk.length} bytes, Total size so far: ${totalSize} bytes`);
      });
    });

    bb.on("field", (name, val, info) => {
      console.log(`Field detected: ${name} = ${val}`);
      data = val;
    });

    bb.on("finish", async () => {
      console.log(fileBuffer.length);
      const buffer2 = Buffer.concat(fileBuffer);
      if (!fileBuffer || !data) {
        reject(jsonResponse(HTTP_STATUS.BAD_REQUEST, { message: "File and data are required." }));
      }

      console.log(fileName2);

      const emailParams = {
        to: "technologie@styrorail.ca",
        subject: "Estimation Build Block",
        text: data,
        attachments: [{ filename: fileName2, content: buffer2, contentType: mimeType }],
      };

      const isEmailSent = await sendEmail(emailParams);

      if (isEmailSent) {
        resolve(jsonResponse(HTTP_STATUS.NO_CONTENT, { message: "Email sent successfully" }));
        return;
      }

      reject(jsonResponse(HTTP_STATUS.SERVER_ERROR, { message: "Error sending the email" }));
    });

    bb.on("error", () => {
      reject(jsonResponse(HTTP_STATUS.SERVER_ERROR, { message: "Error processing file upload" }));
    });

    bodyStream.pipe(bb);
  });
};
