import { appendFile, writeFile } from "fs/promises";
import { join } from "path";

const LOG_FILE_PATH = join(process.cwd(), "bot.log");

export const initLogFile = async () => {
  try {
    await writeFile(LOG_FILE_PATH, "", "utf8"); // overwrite existing content
  } catch (err) {
    console.error("Failed to initialize log file:", err);
  }
};


export const FileLoggerSubscriber = async (message: string) => {
  const timestampedMessage = `${message}\n`;
  try {
    await appendFile(LOG_FILE_PATH, timestampedMessage, "utf8");
  } catch (err) {
    console.error("Failed to write log to file:", err);
  }
};