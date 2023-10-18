import { LoggingWinston } from "@google-cloud/logging-winston";
import { createLogger, format } from "winston";
const { timestamp, combine, errors, json } = format;

let loggingWinston;

if (process.env.NODE_ENV !== "production") {
  loggingWinston = new LoggingWinston({
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
    keyFilename: process.env.NEXT_PUBLIC_APPLICATION_CREDENTIALS,
    logName: "e-procurement-web",
  });
} else {
  loggingWinston = new LoggingWinston();
}

export const logger = createLogger({
  transports: [loggingWinston],
  format: combine(
    timestamp(),
    errors({ stack: true }),
    json()
),
});
