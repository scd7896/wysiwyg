import HistoryStore from "./HistoryStore";
const firstArray = ["abcdefg", "hijklmnok", "123456"];
const secondArray = ["abcdefg", "123456"];

describe("HistorStore Test", () => {
  it("1차 string 추가 테스트", () => {
    const result = HistoryStore.setNextChild(firstArray);

    expect(result.length).toBe(3);
    expect(result).toEqual([
      { line: 0, type: "insert", value: firstArray[0] },
      { line: 1, type: "insert", value: firstArray[1] },
      { line: 2, type: "insert", value: firstArray[2] },
    ]);
    expect(HistoryStore.currentChild).toEqual(firstArray);
  });

  it("2차 string 추가 테스트", () => {
    const result = HistoryStore.setNextChild(secondArray);

    expect(result).toEqual([{ line: 1, type: "delete", value: firstArray[1] }]);
  });

  it("undo 테스트", () => {
    HistoryStore.undo();

    expect(HistoryStore.currentChild).toEqual(firstArray);
  });

  it("redo 테스트", () => {
    HistoryStore.redo();
    expect(HistoryStore.currentChild).toEqual(secondArray);
  });
});
