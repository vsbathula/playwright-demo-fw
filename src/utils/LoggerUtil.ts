import winston from "winston";
import path from "path";
import moment from "moment-timezone";

// Define a Logger class
export default class Logger {
  private logger: winston.Logger;

  constructor() {
    const currentDir = __dirname;
    const srcDir = path.resolve(currentDir, ".."); // Go one level above (back to 'src')
    const loggingDir = path.resolve(srcDir, "logging"); // Go to 'logging' folder

    // Function to format log entries with timestamp and timezone
    const customFormat = winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level}]: ${message}`;
    });

    // Set the desired timezone
    const timeZone = 'America/Chicago';

    // Create the logger instance
    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp({ format: () => moment().tz(timeZone).format() }),
        customFormat
      ),
      transports: [
        new winston.transports.Console({ level: "debug" }),
        new winston.transports.File({
          filename: path.join(loggingDir, "test_run.log"),
          maxFiles: 3, // Number of log files to retain
          maxsize: 300 * 1024, // 300 KB, specify the size in bytes
          level: "info",
        }),
        new winston.transports.File({
          filename: path.join(loggingDir, "test_error.log"),
          maxFiles: 3, // Number of log files to retain
          maxsize: 10 * 1024, // 10 KB, specify the size in bytes
          level: "error",
        }),
      ],
    });
  }

  // Method to log at 'info' level
  public info(message: string): void {
    this.logger.info(message);
  }

  // Method to log at 'error' level
  public error(message: string): void {
    this.logger.error(message);
  }

  // Method to log at 'debug' level
  public debug(message: string): void {
    this.logger.debug(message);
  }
}

// import winston from "winston";
// import path from "path";
// import moment from "moment-timezone";

// const currentDir = __dirname;
// // Go one level above (back to 'src')
// const srcDir = path.resolve(currentDir, "..");

// // Change to 'logging' folder
// const loggingDir = path.resolve(srcDir, "logging");

// // Function to format log entries with timestamp and timezone
// const customFormat = winston.format.printf(({ level, message, timestamp }) => {
//   return `${timestamp} [${level}]: ${message}`;
// });

// // Set the desired timezone
// const timeZone = 'America/Chicago'; 

// const logger = winston.createLogger({
//   format: winston.format.combine(
//     winston.format.timestamp({ format: () => moment().tz(timeZone).format() }),
//     customFormat
//   ),
//   transports: [
//     new winston.transports.Console({ level: "debug" }),
//     new winston.transports.File({
//       filename: path.join(loggingDir, "test_run.log"),
//       maxFiles: 3, // Number of log files to retain
//       maxsize: 300 * 1024, // 10 * 1024 ==10 KB, specify the size in bytes
//       level: "info",
//     }),
//     new winston.transports.File({
//       filename: path.join(loggingDir, "test_error.log"),
//       maxFiles: 3, // Number of log files to retain
//       maxsize: 10 * 1024, // 10 KB, specify the size in bytes
//       level: "error",
//     }),
//   ],
// });


// export default logger;