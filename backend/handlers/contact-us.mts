import { HTTP_STATUS } from "../utils/http.js";
import { generateEmail, sendEmail } from "../utils/sendEmail.js";
import { jsonResponse } from "../utils/response.js";
import { AWSEvent, HandlerResponse } from "../interfaces/aws.js";
import { MAX_FILE_SIZE } from "./../constants/file-constants.js";
import { FileInfo, EmailData } from "../interfaces/email.js";
import busboy from "busboy";
import stream from "stream";

export const handler = async (event: AWSEvent): Promise<HandlerResponse> => {
  return new Promise((resolve, reject) => {
    let fileBuffer: Buffer[] = [];
    let fileInfo: FileInfo[] = [];
    let data: EmailData;

    const bb = busboy({ headers: event.headers, limits: { fileSize: MAX_FILE_SIZE } });

    bb.on("file", (_, file, info) => {
      fileInfo.push(info);
      file.on("data", (chunk) => {
        fileBuffer.push(chunk);
      });
    });

    bb.on("field", (_, val) => {
      data = JSON.parse(val);
    });

    bb.on("finish", async () => {
      const email = generateEmail(data, fileBuffer, fileInfo);

      const isEmailSent = await sendEmail(email);
      if (isEmailSent) {
        return resolve(jsonResponse(HTTP_STATUS.NO_CONTENT, { message: "Email sent successfully" }));
      }

      reject(jsonResponse(HTTP_STATUS.SERVER_ERROR, { message: "Error sending the email" }));
    });

    bb.on("error", () => {
      reject(jsonResponse(HTTP_STATUS.SERVER_ERROR, { message: "Error processing file upload" }));
    });

    const bodyStream = new stream.PassThrough();
    bodyStream.end(Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8"));
    bodyStream.pipe(bb);
  });
};
