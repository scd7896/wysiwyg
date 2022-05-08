import { findByAfterIndex } from "./array";

const array = ["a", "b", "c", "d", "e", "f", "d", "g"];
const target = "d";
describe("findByAfterIndex Test", () => {
  it("인덱스가 2이후에는 result가 3이 나와야 한다", () => {
    const { result } = findByAfterIndex(array, target, 2);

    expect(result).toBe(3);
  });

  it("인덱스가 4이상인 경우에는 6이 나와야한다", () => {
    const { result } = findByAfterIndex(array, target, 4);

    expect(result).toBe(6);
  });

  it("인덱스가 7이상인 경우에는 -1이 나와야한다", () => {
    const { result } = findByAfterIndex(array, target, 7);

    expect(result).toBe(-1);
  });
});
