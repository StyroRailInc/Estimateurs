import { Readable } from "nodemailer/lib/xoauth2";
import { Attachment } from "nodemailer/lib/mailer";

export interface EmailParams {
  to: string;
  subject: string;
  text: string;
  attachments: Attachment[] | undefined;
}

export interface File {
  filename: string;
  content: string | Buffer<ArrayBufferLike> | Readable | undefined;
  encoding?: BufferEncoding;
}

export interface FileInfo {
  filename: string;
  encoding: string;
  mimeType: string;
}

export type EmailData = Record<string, any>;
