import Logger from "./LoggerUtil";
import { TOTP } from "otpauth";

export default function generateTotpCode(secret: string): string {
  const logger = new Logger();
  try {
    const totp = new TOTP({
      issuer: "",
      label: "testuser",
      secret: secret,
      digits: 6,
      period: 30,
      algorithm: "SHA1",
    });
    const generatedCode = totp.generate();
    logger.info(`Generated TOTP code: ${generatedCode}`);
    return generatedCode;
  } catch (error) {
    logger.error(`Error generating TOTP code: ${error}`);
    throw error;
  }
}
