import assert from "node:assert/strict";
import test from "node:test";
import { shearAt, shearX } from "../lib/shear.ts";

test("a full shear period restores every original grid pixel, including negative rows", () => {
  for (const width of [80, 160]) {
    for (let row = -18; row <= 18; row++) {
      const occupied = new Set<number>();
      for (let x = 0; x < width; x++) {
        assert.equal(shearX(x, row, width, width), x);
        occupied.add(shearX(x, row, 7, width));
      }
      assert.equal(occupied.size, width, "integer shears preserve the pixels in each row");
    }
  }
});

test("wraparound handles both edges and fractional shears", () => {
  assert.equal(shearX(79, 1, 2, 80), 1);
  assert.equal(shearX(0, -1, 2, 80), 78);
  assert.equal(shearX(79, 1, 1.5, 80), 0.5);
});

test("animation holds the restored image and repeats without a seam", () => {
  assert.equal(shearAt(0, 160), 0);
  assert.equal(shearAt(2500, 160), 0);
  assert.equal(shearAt(9000, 160), 80);
  assert.equal(shearAt(15000, 160), 0);
  assert.equal(shearAt(18000, 160), 0);
  assert.equal(shearAt(27000, 160), shearAt(9000, 160));
});
