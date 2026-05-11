import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import Logger from "./LoggerUtil";
import { EnvironmentConfig } from "../types/index";
import { env } from "process";

export class EnvironmentManager {
  private static instance: EnvironmentManager;
  private currentConfig: EnvironmentConfig = {};
  private configDir: string;
  private logger = new Logger();

  private constructor() {
    this.configDir = path.join(process.cwd(), "src", "config");
  }

  static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      EnvironmentManager.instance = new EnvironmentManager();
    }
    return EnvironmentManager.instance;
  }

  /**
   * Initialize with environment (called from run-tests.ts)
   * @param environment - Environment name to initialize with
   */
  initialize(environment?: string): EnvironmentConfig {
    if (environment) {
      process.env.Env = environment;

      const envFile = `.env.${environment}`;
      const envFilePath = path.join(this.configDir, envFile);

      if (!fs.existsSync(envFilePath)) {
        this.logger.error(`Environment file ${envFile} not found.`);
        throw new Error(`Environment file ${envFile} not found.`);
      }
      try {
        const result = dotenv.config({ path: envFilePath });
        if (result.error) {
          this.logger.error(
            `Error parsing environment file ${envFile}: ${result.error}`,
          );
          throw new Error(
            `Error parsing environment file ${envFile}: ${result.error}`,
          );
        }
        this.currentConfig = this.parseEnvironmentConfig(result.parsed || {});
        this.logger.info(`Environment file ${envFile} loaded successfully.`);
      } catch (error) {
        this.logger.error(
          `Error loading environment file ${envFile}: ${error}`,
        );
        throw new Error(`Error loading environment file ${envFile}: ${error}`);
      }
    }
    return this.currentConfig;
  }

  /**
   * Parse environment variables into typed configuration
   */
  private parseEnvironmentConfig(
    envVars: Record<string, string>,
  ): EnvironmentConfig {
    const config: EnvironmentConfig = {};
    try {
      for (const [key, value] of Object.entries(envVars)) {
        // Check if there's an environment variable override first
        const envOverride = process.env[key];
        const finalValue = envOverride !== undefined ? envOverride : value;

        // Parse boolean values
        if (finalValue.toLowerCase() === "true") {
          config[key] = true;
        } else if (finalValue.toLowerCase() === "false") {
          config[key] = false;
        } else if (!isNaN(Number(finalValue)) && finalValue.trim() !== "") {
          // Parse numeric values
          config[key] = Number(finalValue);
        } else {
          // Otherwise, treat as string
          config[key] = finalValue;
        }
      }
      return config;
    } catch (error) {
      this.logger.error(`Error parsing environment variables: ${error}`);
      throw new Error(`Error parsing environment variables: ${error}`);
    }
  }
}

export const environmentManager = EnvironmentManager.getInstance();
