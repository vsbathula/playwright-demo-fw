import { test as baseTest } from "@playwright/test";

/**
 * Test tags/decorators for categorizing and filtering tests
 */
export enum TestTag {
  SMOKE = "smoke",
  REGRESSION = "regression",
  CRITICAL = "critical",
  INTEGRATION = "integration",
  UNIT = "unit",
  E2E = "e2e",
  PERFORMANCE = "performance",
  SECURITY = "security",
  ACCESSIBILITY = "accessibility",
  SANITY = "sanity",
  FLAKY = "flaky",
  WIP = "wip", // Work in progress
}

/**
 * Test metadata interface
 */
export interface TestMetadata {
  tags?: TestTag[];
  priority?: "high" | "medium" | "low";
  description?: string;
  author?: string;
  timeout?: number;
  skip?: boolean;
  flaky?: boolean;
  requiresAuth?: boolean;
  requiresDB?: boolean;
  requiresAPI?: boolean;
  jiraId?: string;
  relatedIssues?: string[];
}

/**
 * Map to store test metadata
 */
const testMetadataMap = new Map<string, TestMetadata>();

/**
 * Decorator: Mark test as smoke test
 */
export function smoke(test: any) {
  return addTag(test, TestTag.SMOKE);
}

/**
 * Decorator: Mark test as regression test
 */
export function regression(test: any) {
  return addTag(test, TestTag.REGRESSION);
}

/**
 * Decorator: Mark test as critical
 */
export function critical(test: any) {
  return addTag(test, TestTag.CRITICAL);
}

/**
 * Decorator: Mark test as integration test
 */
export function integration(test: any) {
  return addTag(test, TestTag.INTEGRATION);
}

/**
 * Decorator: Mark test as E2E test
 */
export function e2e(test: any) {
  return addTag(test, TestTag.E2E);
}

/**
 * Decorator: Mark test as performance test
 */
export function performance(test: any) {
  return addTag(test, TestTag.PERFORMANCE);
}

/**
 * Decorator: Mark test as flaky
 */
export function flaky(test: any) {
  return addTag(test, TestTag.FLAKY);
}

/**
 * Decorator: Set priority level
 */
export function priority(level: "high" | "medium" | "low") {
  return (test: any) => {
    setMetadata(test.name, { priority: level });
    return test;
  };
}

/**
 * Decorator: Add description
 */
export function description(text: string) {
  return (test: any) => {
    setMetadata(test.name, { description: text });
    return test;
  };
}

/**
 * Decorator: Set author
 */
export function author(name: string) {
  return (test: any) => {
    setMetadata(test.name, { author: name });
    return test;
  };
}

/**
 * Decorator: Set timeout
 */
export function timeout(ms: number) {
  return (test: any) => {
    setMetadata(test.name, { timeout: ms });
    return test;
  };
}

/**
 * Decorator: Mark as flaky/unstable
 */
export function unstable(test: any) {
  setMetadata(test.name, { flaky: true });
  return addTag(test, TestTag.FLAKY);
}

/**
 * Decorator: Mark test as work in progress
 */
export function wip(test: any) {
  return addTag(test, TestTag.WIP);
}

/**
 * Decorator: Requires authentication
 */
export function requiresAuth(test: any) {
  setMetadata(test.name, { requiresAuth: true });
  return test;
}

/**
 * Decorator: Requires database connection
 */
export function requiresDB(test: any) {
  setMetadata(test.name, { requiresDB: true });
  return test;
}

/**
 * Decorator: Requires API
 */
export function requiresAPI(test: any) {
  setMetadata(test.name, { requiresAPI: true });
  return test;
}

/**
 * Decorator: Link to Jira issue
 */
export function jira(issueId: string) {
  return (test: any) => {
    setMetadata(test.name, { jiraId: issueId });
    return test;
  };
}

/**
 * Decorator: Link related issues
 */
export function relatedIssues(...issues: string[]) {
  return (test: any) => {
    setMetadata(test.name, { relatedIssues: issues });
    return test;
  };
}

/**
 * Decorator: Combine multiple tags
 */
export function tags(...tagList: TestTag[]) {
  return (test: any) => {
    tagList.forEach((tag) => addTag(test, tag));
    return test;
  };
}

/**
 * Internal: Add tag to test
 */
function addTag(test: any, tag: TestTag): any {
  const metadata = getMetadata(test.name);
  if (!metadata.tags) {
    metadata.tags = [];
  }
  if (!metadata.tags.includes(tag)) {
    metadata.tags.push(tag);
  }
  setMetadata(test.name, metadata);
  return test;
}

/**
 * Internal: Get metadata for test
 */
function getMetadata(testName: string): TestMetadata {
  return testMetadataMap.get(testName) || {};
}

/**
 * Internal: Set metadata for test
 */
function setMetadata(testName: string, metadata: TestMetadata): void {
  const existing = testMetadataMap.get(testName) || {};
  testMetadataMap.set(testName, { ...existing, ...metadata });
}

/**
 * Get metadata for a test
 */
export function getTestMetadata(testName: string): TestMetadata {
  return getMetadata(testName);
}

/**
 * Get all tests with a specific tag
 */
export function getTestsByTag(tag: TestTag): string[] {
  const results: string[] = [];
  testMetadataMap.forEach((metadata, testName) => {
    if (metadata.tags?.includes(tag)) {
      results.push(testName);
    }
  });
  return results;
}

/**
 * Get tests by priority
 */
export function getTestsByPriority(
  priority: "high" | "medium" | "low",
): string[] {
  const results: string[] = [];
  testMetadataMap.forEach((metadata, testName) => {
    if (metadata.priority === priority) {
      results.push(testName);
    }
  });
  return results;
}

/**
 * Get flaky tests
 */
export function getFlakyTests(): string[] {
  const results: string[] = [];
  testMetadataMap.forEach((metadata, testName) => {
    if (metadata.flaky) {
      results.push(testName);
    }
  });
  return results;
}

/**
 * Get all metadata
 */
export function getAllMetadata(): Map<string, TestMetadata> {
  return new Map(testMetadataMap);
}

/**
 * Generate metadata report
 */
export function generateMetadataReport(): void {
  console.log("\n📋 Test Metadata Report:");
  console.log("========================\n");

  const tagCounts = new Map<TestTag, number>();
  const priorityCounts = new Map<string, number>();

  testMetadataMap.forEach((metadata) => {
    if (metadata.tags) {
      metadata.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    }
    if (metadata.priority) {
      priorityCounts.set(
        metadata.priority,
        (priorityCounts.get(metadata.priority) || 0) + 1,
      );
    }
  });

  console.log("📌 Tests by Tag:");
  tagCounts.forEach((count, tag) => {
    console.log(`  ${tag}: ${count}`);
  });

  console.log("\n⚡ Tests by Priority:");
  priorityCounts.forEach((count, priority) => {
    console.log(`  ${priority}: ${count}`);
  });

  const flaky = getFlakyTests();
  if (flaky.length > 0) {
    console.log(`\n⚠️  Flaky Tests (${flaky.length}):`);
    flaky.forEach((test) => console.log(`  - ${test}`));
  }

  console.log("\n");
}
