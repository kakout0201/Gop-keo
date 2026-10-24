import { defineConfig } from "vitest/config";

// Tối thiểu ở Bước 9. Slice 00 tách 2 project `unit` và `integration` (docs/plans/slice-00.md).
export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
  },
});
