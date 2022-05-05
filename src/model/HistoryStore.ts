import { findByAfterIndex } from "../utils/array";

interface IDiff {
  line: number;
  value: string;
  type: "insert" | "delete";
}

class HistoryStore {
  currentChild: string[];
  undoHistory: IDiff[][];
  redoHistory: IDiff[][];

  constructor() {
    this.currentChild = [];
    this.undoHistory = [];
    this.redoHistory = [];
  }

  setNextChild(childStringArray: string[]) {
    const diff = this.diffChild(childStringArray);
    diff.sort((a, b) => a.line - b.line);
    this.undoHistory.push(diff);
    this.currentChild = childStringArray;
  }

  diffChild(nextChild: string[]) {
    const diff: IDiff[] = [];
    let nextChildIndex = 0;
    let currentChildIndex = 0;
    /**
     * 포인터가 둘다 배열 끝까지 조회를 했을 경우 완료한다.
     * 길이가 같은 경우 같으면 넘어가고 다르면 insert delete 순으로 삽입한다.
     */
    while (nextChildIndex < nextChild.length || currentChildIndex < this.currentChild.length) {
      let nextChildString = nextChild[nextChildIndex];
      let currentChildString = this.currentChild[currentChildIndex];
      if (nextChildString === currentChildString) {
        nextChildIndex++;
        currentChildIndex++;
        continue;
      }
      // 두개의 길이가 동일 할 경우 insert delete를 삽입하고 넘어간다.
      if (nextChild.length === this.currentChild.length) {
        diff.push({ type: "insert", line: nextChildIndex, value: nextChild[nextChildIndex] });
        diff.push({ type: "delete", line: currentChildIndex, value: this.currentChild[currentChildIndex] });
        nextChildIndex++;
        currentChildIndex++;
        continue;
      }

      // next의 인덱스가 이미 마지막까지 도달해져있으면 나머지는 전부 delete로 넣음
      if (nextChildIndex === nextChild.length) {
        if (this.currentChild[currentChildIndex]) {
          diff.push({
            line: currentChildIndex,
            value: this.currentChild[currentChildIndex],
            type: "delete",
          });
          currentChildIndex++;
          continue;
        } else break;
      }

      // current의 인덱스가 이미 마지막까지 도달해져있으면 나머지는 전부 insert로 넣음
      if (currentChildIndex === this.currentChild.length) {
        if (nextChild[nextChildIndex]) {
          diff.push({ line: nextChildIndex, value: nextChild[nextChildIndex], type: "insert" });
          nextChildIndex++;
          continue;
        } else break;
      }

      /**
       * nextChild에서 current의 포인트의 밸류와 같은 값을 찾고 찾을 경우
       * 다음의 nextChild는 result + 1 값으로 설정
       * -1 일경우 현재 위치에서 + 1로 설정
       */
      const currntToNextChildCheck = findByAfterIndex(nextChild, this.currentChild[currentChildIndex], nextChildIndex);
      if (currntToNextChildCheck.result !== -1) {
        currntToNextChildCheck.diff.map((diffText, index) =>
          diff.push({
            value: diffText,
            type: "insert",
            line: nextChildIndex + index,
          }),
        );
        nextChildIndex = currntToNextChildCheck.result + 1;
        currentChildIndex++;
        continue;
      }

      /**
       * currentChild에서 next의 포인터값과 같은 값을 찾고 찾을 경우
       * 다음의 currentIndex는 result + 1로 설정
       * -1 일경우 현재  현재의 +1로 설정
       */
      const nextToCurrentCheck = findByAfterIndex(this.currentChild, nextChild[nextChildIndex], currentChildIndex);
      if (nextToCurrentCheck.result !== -1) {
        nextToCurrentCheck.diff.map((diffText, index) =>
          diff.push({
            value: diffText,
            type: "delete",
            line: currentChildIndex + index,
          }),
        );
        currentChildIndex = nextToCurrentCheck.result + 1;
        nextChildIndex++;
        continue;
      }

      if (currntToNextChildCheck.result === -1 && nextToCurrentCheck.result === -1) {
        diff.push({
          value: this.currentChild[currentChildIndex],
          type: "delete",
          line: currentChildIndex,
        });

        diff.push({
          value: nextChild[nextChildIndex],
          type: "insert",
          line: nextChildIndex,
        });

        nextChildIndex++;
        currentChildIndex++;
      }
    }

    return diff;
  }
}

export default new HistoryStore();
