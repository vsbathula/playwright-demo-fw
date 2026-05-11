import Logger from "./LoggerUtil";

/**
 * Database connection options
 */
export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  timeout?: number;
}

/**
 * Query result interface
 */
export interface QueryResult {
  rowCount: number;
  rows: any[];
  affectedRows?: number;
}

/**
 * Abstract Database class
 */
export abstract class Database {
  protected logger: Logger;
  protected config: DatabaseConfig;
  protected connected: boolean = false;

  constructor(config: DatabaseConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
  }

  /**
   * Connect to database
   */
  abstract connect(): Promise<void>;

  /**
   * Disconnect from database
   */
  abstract disconnect(): Promise<void>;

  /**
   * Execute query
   */
  abstract query(sql: string, params?: any[]): Promise<QueryResult>;

  /**
   * Insert record
   */
  abstract insert(table: string, data: Record<string, any>): Promise<number>;

  /**
   * Update record
   */
  abstract update(
    table: string,
    data: Record<string, any>,
    where: Record<string, any>,
  ): Promise<number>;

  /**
   * Delete record
   */
  abstract delete(table: string, where: Record<string, any>): Promise<number>;

  /**
   * Select records
   */
  abstract select(table: string, where?: Record<string, any>): Promise<any[]>;

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connected;
  }
}

/**
 * Generic Database utility for common operations
 */
export default class DatabaseUtil {
  private logger: Logger;
  private database: Database | null = null;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  /**
   * Initialize database connection
   */
  async initialize(database: Database): Promise<void> {
    try {
      await database.connect();
      this.database = database;
      this.logger.info("✓ Database connected");
    } catch (error) {
      this.logger.error(`✗ Failed to connect to database: ${error}`);
      throw error;
    }
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    if (this.database) {
      try {
        await this.database.disconnect();
        this.logger.info("✓ Database disconnected");
      } catch (error) {
        this.logger.error(`✗ Failed to disconnect database: ${error}`);
        throw error;
      }
    }
  }

  /**
   * Execute raw query
   */
  async executeQuery(sql: string, params?: any[]): Promise<QueryResult> {
    if (!this.database) {
      throw new Error("Database not initialized");
    }
    try {
      this.logger.debug(`Executing: ${sql}`);
      const result = await this.database.query(sql, params);
      this.logger.info(`✓ Query executed: ${result.rowCount} rows returned`);
      return result;
    } catch (error) {
      this.logger.error(`✗ Query failed: ${error}`);
      throw error;
    }
  }

  /**
   * Insert record
   */
  async insert(table: string, data: Record<string, any>): Promise<number> {
    if (!this.database) {
      throw new Error("Database not initialized");
    }
    try {
      const id = await this.database.insert(table, data);
      this.logger.info(`✓ Record inserted into ${table} with ID: ${id}`);
      return id;
    } catch (error) {
      this.logger.error(`✗ Insert failed: ${error}`);
      throw error;
    }
  }

  /**
   * Update record
   */
  async update(
    table: string,
    data: Record<string, any>,
    where: Record<string, any>,
  ): Promise<number> {
    if (!this.database) {
      throw new Error("Database not initialized");
    }
    try {
      const affectedRows = await this.database.update(table, data, where);
      this.logger.info(`✓ ${affectedRows} records updated in ${table}`);
      return affectedRows;
    } catch (error) {
      this.logger.error(`✗ Update failed: ${error}`);
      throw error;
    }
  }

  /**
   * Delete record
   */
  async delete(table: string, where: Record<string, any>): Promise<number> {
    if (!this.database) {
      throw new Error("Database not initialized");
    }
    try {
      const affectedRows = await this.database.delete(table, where);
      this.logger.info(`✓ ${affectedRows} records deleted from ${table}`);
      return affectedRows;
    } catch (error) {
      this.logger.error(`✗ Delete failed: ${error}`);
      throw error;
    }
  }

  /**
   * Select records
   */
  async select(table: string, where?: Record<string, any>): Promise<any[]> {
    if (!this.database) {
      throw new Error("Database not initialized");
    }
    try {
      const rows = await this.database.select(table, where);
      this.logger.info(`✓ Selected ${rows.length} records from ${table}`);
      return rows;
    } catch (error) {
      this.logger.error(`✗ Select failed: ${error}`);
      throw error;
    }
  }

  /**
   * Truncate table
   */
  async truncateTable(table: string): Promise<void> {
    if (!this.database) {
      throw new Error("Database not initialized");
    }
    try {
      await this.database.query(`TRUNCATE TABLE ${table}`);
      this.logger.info(`✓ Table ${table} truncated`);
    } catch (error) {
      this.logger.error(`✗ Truncate failed: ${error}`);
      throw error;
    }
  }

  /**
   * Check if record exists
   */
  async recordExists(
    table: string,
    where: Record<string, any>,
  ): Promise<boolean> {
    const rows = await this.select(table, where);
    return rows.length > 0;
  }

  /**
   * Get record count
   */
  async getRecordCount(
    table: string,
    where?: Record<string, any>,
  ): Promise<number> {
    const result = await this.executeQuery(
      `SELECT COUNT(*) as count FROM ${table}${where ? " WHERE ..." : ""}`,
    );
    return result.rows[0]?.count || 0;
  }

  /**
   * Clear all tables (use with caution!)
   */
  async clearAllTables(tables: string[]): Promise<void> {
    try {
      for (const table of tables) {
        await this.truncateTable(table);
      }
      this.logger.info(`✓ Cleared ${tables.length} tables`);
    } catch (error) {
      this.logger.error(`✗ Clear tables failed: ${error}`);
      throw error;
    }
  }
}
