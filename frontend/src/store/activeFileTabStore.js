import { create } from "zustand";
import { devtools } from "zustand/middleware";

class Tab {
  constructor(data, key) {
    this.data = data;
    this.key = key;
    this.prev = null;
    this.next = null;
  }
}

class TabsData {
  constructor() {
    this.map = new Map();

    this.head = new Tab(null, null);
    this.tail = new Tab(null, null);

    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  setTab(data) {
    const { value, path: key } = data;

    if (this.map.has(key)) {
      let node = this.map.get(key);
      node.data = data?.value;
      node.prev.next = node.next;
      node.next.prev = node.prev;

      this._reorder(key);
      this._moveToHead(node);
    } else {
      let newTab = new Tab(value, key);
      this.map.set(key, newTab);

      this._moveToHead(newTab);
    }
  }

  _moveToHead(node) {
    node.next = this.head.next;
    node.prev = this.head;

    this.head.next = node;
    node.next.prev = node;
  }

  _deleteNode(key) {
    let node = this.map.get(key);

    this._reorder(key);
    node.next = null;
    node.prev = null;
    this.map.delete(key);
    node = null;
  }

  _reorder(key) {
    let node = this.map.get(key);
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }
}

export const useActiveFileTabStore = create(
  devtools(
    (set) => ({
      allFileTabs: new TabsData(),

      setTab: (data) =>
        set(
          (state) => {
            state.allFileTabs.setTab(data);
            return { allFileTabs: state.allFileTabs };
          },
          false,
          "tabs/setTab",
        ),

      deleteTab: (key) => {
        set((state) => {
          state.allFileTabs._deleteNode(key);
          return { allFileTabs: state.allFileTabs };
        });
      },
    }),

    { name: "ActiveFileTabStore" },
  ),
);
