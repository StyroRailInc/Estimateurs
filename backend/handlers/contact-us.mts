import { HTTP_STATUS } from "../utils/http.js";
import { sendEmail } from "../utils/sendEmail.js";
import { jsonResponse } from "../utils/response.js";
import { AWSEvent, HandlerResponse } from "../interfaces/aws.js";
import busboy from "busboy";
import stream from "stream";

export const handler = async (event: AWSEvent): Promise<HandlerResponse> => {
  return new Promise((resolve, reject) => {
    let fileBuffer: Buffer;
    let data: any;
    let fileInfo: any;

    const bb = busboy({ headers: event.headers, limits: { fileSize: 10 * 1024 * 1024 } });

    bb.on("file", (name, file, info) => {
      fileInfo = info;
      file.on("data", (chunk) => {
        fileBuffer = chunk;
      });
    });

    bb.on("field", (name, val) => {
      data = JSON.parse(val);
    });

    bb.on("finish", async () => {
      let attachments;
      if (fileBuffer) {
        attachments = [{ filename: fileInfo.fileName, content: fileBuffer, contentType: fileInfo.mimeType }];
      }

      const emailParams = {
        to: "technologie@styrorail.ca",
        subject: "Estimation Build Block",
        text: `Nom : ${data.name}\nCourriel : ${data.email}\nPhone : ${data.phone}\nMessage : ${data.message}`,
        attachments: attachments,
      };

      try {
        const isEmailSent = await sendEmail(emailParams);
        if (isEmailSent) {
          resolve(jsonResponse(HTTP_STATUS.NO_CONTENT, { message: "Email sent successfully" }));
        } else {
          reject(jsonResponse(HTTP_STATUS.SERVER_ERROR, { message: "Error sending the email" }));
        }
      } catch (error) {
        reject(jsonResponse(HTTP_STATUS.SERVER_ERROR, { message: "Exception during email send", error }));
      }
    });

    bb.on("error", () => {
      reject(jsonResponse(HTTP_STATUS.SERVER_ERROR, { message: "Error processing file upload" }));
    });

    const bodyStream = new stream.PassThrough();
    bodyStream.end(Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8"));
    bodyStream.pipe(bb);
  });
};
