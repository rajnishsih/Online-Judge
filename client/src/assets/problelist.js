export const problems = [
  {
    _id: "1",
    title: "Two Sum",
    description: "Find indices of the two numbers such that they add up to a specific target.",
    difficulty: "Easy",
    tag: "Array",
    testCases: [
      { input: "[2,7,11,15], 9", expectedOutput: "[0,1]" },
      { input: "[3,2,4], 6", expectedOutput: "[1,2]" }
    ]
  },
  {
    _id: "2",
    title: "Reverse a Linked List",
    description: "Reverse a singly linked list and return the head of the modified list.",
    difficulty: "Easy",
    tag: "Linked List",
    testCases: [
      { input: "[1,2,3,4,5]", expectedOutput: "[5,4,3,2,1]" },
      { input: "[1,2]", expectedOutput: "[2,1]" }
    ]
  },
  {
    _id: "3",
    title: "Valid Parentheses",
    description: "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    difficulty: "Easy",
    tag: "Stack",
    testCases: [
      { input: "\"()[]{}\"", expectedOutput: "true" },
      { input: "\"(]\"", expectedOutput: "false" }
    ]
  },
  {
    _id: "4",
    title: "Merge Intervals",
    description: "Given an array of intervals, merge all overlapping intervals.",
    difficulty: "Medium",
    tag: "Interval",
    testCases: [
      { input: "[[1,3],[2,6],[8,10],[15,18]]", expectedOutput: "[[1,6],[8,10],[15,18]]" },
      { input: "[[1,4],[4,5]]", expectedOutput: "[[1,5]]" }
    ]
  },
  {
    _id: "5",
    title: "Longest Substring Without Repeating Characters",
    description: "Find the length of the longest substring without repeating characters.",
    difficulty: "Medium",
    tag: "Sliding Window",
    testCases: [
      { input: "\"abcabcbb\"", expectedOutput: "3" },
      { input: "\"bbbbb\"", expectedOutput: "1" }
    ]
  },
  {
    _id: "6",
    title: "Clone Graph",
    description: "Clone an undirected graph. Each node contains a label and a list of its neighbors.",
    difficulty: "Medium",
    tag: "Graph",
    testCases: [
      { input: "adjList of [[2,4],[1,3],[2,4],[1,3]]", expectedOutput: "cloned graph structure" },
      { input: "single node with no neighbors", expectedOutput: "single cloned node" }
    ]
  },
  {
    _id: "7",
    title: "Word Ladder",
    description: "Given two words and a dictionary, find the shortest transformation sequence from start to end.",
    difficulty: "Hard",
    tag: "BFS",
    testCases: [
      { input: "hit -> cog, wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]", expectedOutput: "5" },
      { input: "hit -> cog, wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]", expectedOutput: "0" }
    ]
  },
  {
    _id: "8",
    title: "Median of Two Sorted Arrays",
    description: "Find the median of two sorted arrays. The overall run time complexity should be O(log (m+n)).",
    difficulty: "Hard",
    tag: "Binary Search",
    testCases: [
      { input: "[1,3], [2]", expectedOutput: "2.0" },
      { input: "[1,2], [3,4]", expectedOutput: "2.5" }
    ]
  },
  {
    _id: "9",
    title: "N-Queens",
    description: "Place N queens on an N×N chessboard so that no two queens threaten each other.",
    difficulty: "Hard",
    tag: "Backtracking",
    testCases: [
      { input: "4", expectedOutput: "[[.Q..,..Q,Q...,..Q.],[..Q.,Q...,..Q.,.Q..]]" },
      { input: "1", expectedOutput: "[[Q]]" }
    ]
  },
  {
    _id: "10",
    title: "Detect Cycle in Linked List",
    description: "Given a linked list, determine if it has a cycle.",
    difficulty: "Easy",
    tag: "Linked List",
    testCases: [
      { input: "[3,2,0,-4] with pos = 1", expectedOutput: "true" },
      { input: "[1] with pos = -1", expectedOutput: "false" }
    ]
  }
];
