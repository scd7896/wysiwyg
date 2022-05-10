import { findByAfterIndex } from "../utils/array";
import { BaseStore } from "./BaseStore";

interface IDiff {
  line: number;
  value: string;
  type: "insert" | "delete";
}

class HistoryState {}

class HistoryStore extends BaseStore<HistoryState> {
  currentChild: string[];
  undoHistory: IDiff[][];
  redoHistory: IDiff[][];

  timer: any;

  constructor() {
    super(new HistoryState());
    this.currentChild = [];
    this.undoHistory = [];
    this.redoHistory = [];
  }

  undo(): string[] | undefined {
    if (this.undoHistory.length) {
      const history = this.undoHistory.pop();
      let max = this.currentChild.length;
      const insertMap = history
        .filter((diff) => diff.type === "insert")
        .reduce<Record<number, boolean>>((acc, diff) => {
          acc[diff.line] = true;
          if (max < diff.line) max = diff.line + 1;
          return acc;
        }, {});

      const removeMap = history
        .filter((diff) => diff.type === "delete")
        .reduce<Record<number, string>>((acc, diff) => {
          acc[diff.line] = diff.value;
          if (max < diff.line) max = diff.line + 1;
          return acc;
        }, {});
      const result: string[] = [];
      for (let i = 0; i < max; i++) {
        if (removeMap[i] !== undefined) {
          result.push(removeMap[i]);
        }
        if (!insertMap[i]) {
          result.push(this.currentChild[i]);
        }
      }

      this.currentChild = result;
      this.redoHistory.push(history);
      return this.currentChild;
    }
  }

  redo(): string[] | undefined {
    if (this.redoHistory.length) {
      const history = this.redoHistory.pop();
      let max = this.currentChild.length;
      const insertMap = history
        .filter((diff) => diff.type === "insert")
        .reduce<Record<number, string>>((acc, diff) => {
          acc[diff.line] = diff.value;
          if (max < diff.line + 1) max = diff.line + 1;
          return acc;
        }, {});

      const removeMap = history
        .filter((diff) => diff.type === "delete")
        .reduce<Record<number, boolean>>((acc, diff) => {
          acc[diff.line] = true;
          if (max < diff.line + 1) max = diff.line + 1;
          return acc;
        }, {});
      const result: string[] = [];
      for (let i = 0; i < max; i++) {
        if (insertMap[i] !== undefined) {
          result.push(insertMap[i]);
        }
        if (!removeMap[i]) {
          result.push(this.currentChild[i]);
        }
      }

      this.currentChild = result;
      this.undoHistory.push(history);
      return this.currentChild;
    }
  }

  setNextChild(childStringArray: string[], isDebounce?: boolean) {
    if (isDebounce) {
      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout(() => {
        this.diffToNextChild(childStringArray);
      }, 500);

      return [];
    } else {
      if (this.timer) {
        clearTimeout(this.timer);
      }
    }

    const result = this.diffToNextChild(childStringArray);

    return result;
  }

  private diffToNextChild(childStringArray: string[]) {
    const diff = this.diffChild(childStringArray);
    if (diff.length === 0) return [];
    this.redoHistory = [];
    diff.sort((a, b) => {
      if (a.line === b.line) {
        if (a.type === "delete") return -1;
        return 1;
      }
      return a.line - b.line;
    });
    this.undoHistory.push(diff);
    this.setState({});

    this.currentChild = childStringArray;
    return diff;
  }

  private diffChild(nextChild: string[]) {
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

      /**
       * 둘다 -1일 경우 current는 delete로 next는 insert로 설정하고 둘다 1씩 늘림
       */
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
