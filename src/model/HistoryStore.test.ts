import HistoryStore from "./HistoryStore";
const firstArray = ["abcdefg", "hijklmnok", "123456"];
const secondArray = ["abcdefg", "123456"];
const thirdArray = ["abcdefg", "123456", "abcdefg"];
const historyStore = new HistoryStore();

describe("HistorStore Test", () => {
  it("1차 string 추가 테스트", () => {
    const result = historyStore.setNextChild(firstArray);

    expect(result.length).toBe(3);
    expect(result).toEqual([
      { line: 0, type: "insert", value: firstArray[0] },
      { line: 1, type: "insert", value: firstArray[1] },
      { line: 2, type: "insert", value: firstArray[2] },
    ]);
    expect(historyStore.currentChild).toEqual(firstArray);
  });

  it("2차 string 추가 테스트", () => {
    const result = historyStore.setNextChild(secondArray);

    expect(result).toEqual([{ line: 1, type: "delete", value: firstArray[1] }]);
  });

  it("undo 테스트", () => {
    historyStore.undo();

    expect(historyStore.currentChild).toEqual(firstArray);
  });

  it("redo 테스트", () => {
    historyStore.redo();
    expect(historyStore.currentChild).toEqual(secondArray);
  });

  it("3차 추가", () => {
    const result = historyStore.setNextChild(thirdArray);

    expect(result).toEqual([{ line: 2, type: "insert", value: thirdArray[2] }]);
  });

  it("undo 테스트", () => {
    historyStore.undo();
    expect(historyStore.currentChild).toEqual(secondArray);
  });

  it("redu 테스트", () => {
    historyStore.redo();
    expect(historyStore.currentChild).toEqual(thirdArray);
  });
});
