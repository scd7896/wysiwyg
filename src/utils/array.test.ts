import { findByAfterIndex } from "./array";

const array = ["a", "b", "c", "d", "e", "f", "g"];
const target = "d";
describe("findByAfterIndex Test", () => {
  it("인덱스가 2이후에는 result가 3이 나와야 한다", () => {
    const { result } = findByAfterIndex(array, target, 2);

    expect(result).toBe(3);
  });
});
