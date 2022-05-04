import HistoryStore from "./HistoryStore";
const firstArray = ["abcdefg", "hijklmnok", "123456"];
const secondArray = ["abcdefg", "123456"];

describe("HistorStore Test", () => {
  it("기본값 확인", () => {
    expect(HistoryStore.currentChild).toEqual([]);
    expect(HistoryStore.undoHistory).toEqual([]);
  });

  it("1차 string 추가 테스트", () => {
    HistoryStore.setNextChild(firstArray);

    expect(HistoryStore.undoHistory[0].length).toBe(3);
    expect(HistoryStore.undoHistory[0]).toEqual([
      { line: 0, type: "insert", value: firstArray[0] },
      { line: 1, type: "insert", value: firstArray[1] },
      { line: 2, type: "insert", value: firstArray[2] },
    ]);
    expect(HistoryStore.currentChild).toEqual(firstArray);
  });

  it("2차 string 추가 테스트", () => {
    HistoryStore.setNextChild(secondArray);

    expect(HistoryStore.undoHistory[1]).toEqual([{ line: 1, type: "delete", value: firstArray[1] }]);
  });
});
