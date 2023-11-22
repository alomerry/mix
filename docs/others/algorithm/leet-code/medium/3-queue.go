package main

import (
	"github.com/emirpasic/gods/queues/arrayqueue"
)

func lengthOfLongestSubstring(s string) int {
	var (
		max    int
		exists = make(map[uint8]bool)
		queue  = arrayqueue.New()
		front  interface{}
	)

	for i := range s {
		for exists[s[i]] {
			front, _ = queue.Dequeue()
			exists[front.(uint8)] = false
		}
		queue.Enqueue(s[i])
		exists[s[i]] = true
		if queue.Size() > max {
			max = queue.Size()
		}
	}
	return max
}

//func main() {
//	print(lengthOfLongestSubstring("abcabcbb"))
//}

// #include <iostream>
// #include <algorithm>
// #include <queue>
// using namespace std;
// int lengthOfLongestSubstring(string s)
// {
//     int len = s.size(), max = 0, tmp;
//     bool flag[200];
//     fill(flag, flag + 200, false);
//     queue<char> q;
//     for (int i = 0; i < len; i++)
//     {
//         while (flag[s[i]])
//         {
//             tmp = q.front();
//             q.pop();
//             flag[tmp] = false;
//         }
//         q.push(s[i]);
//         flag[s[i]] = true;
//         max = q.size() > max ? q.size() : max;
//     }
//     return max;
// }
