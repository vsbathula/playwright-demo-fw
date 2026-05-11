export interface EnvironmentConfig {
  // Urls
  BASE_URL?: string;

  // Browser settings
  BROWSER?: string;
  HEADLESS?: boolean;
  TIMEOUT?: number;
  RETRIES?: number;
  VIEWPORT_WIDTH?: number;
  VIEWPORT_HEIGHT?: number;

  // Feature flags
  ENABLR_TRACING?: boolean;
  ENABLE_SCREENSHOTS?: boolean;
  ENABLE_VIDEO?: boolean;

  // Execution settings
  PARALLEL_EXECUTION?: boolean;
  MAX_WORKERS?: number;
  SLOW_MOTION?: boolean;

  // Any additional primitive configurations
  [key: string]: string | number | boolean | undefined;
}
