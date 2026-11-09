import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Testing Library only registers its automatic cleanup when Vitest globals are
// enabled; this project imports the test APIs explicitly, so unmount here.
afterEach(cleanup);
