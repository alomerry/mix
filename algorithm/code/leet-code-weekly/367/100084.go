package main

import (
	"sort"
)

func shortestBeautifulSubstring(s string, k int) string {
	var (
		rs          []string
		bitmap      = make([]bool, len(s))
		idx, maxLen = len(s), 102
		now         string
	)
	for i := 0; i < len(s); i++ {
		if s[i] == '1' {
			bitmap[i] = true
		}
	}
	for i := range bitmap {
		if bitmap[i] {
			idx = i
			break
		}
	}
	for i := idx; i < len(s); {
		now = ""
		ks := 0
		for j := i; j < len(s); j++ {
			now += string(s[j])
			if bitmap[j] {
				ks++
			}
			if ks >= k && len(now) <= maxLen {
				if len(now) < maxLen {
					maxLen = len(now)
					rs = []string{}
				}
				rs = append(rs, now)
				break
			}
		}
		i++
		for next := i; next < len(s); next++ {
			if bitmap[next] {
				i = next
				break
			}
		}
	}
	if len(rs) > 0 {
		sort.Strings(rs)
		return rs[0]
	}

	return ""
}

//func main() {
//	fmt.Println(shortestBeautifulSubstring("11000111", 1)) // [100011 11001]
//	//fmt.Println(shortestBeautifulSubstring("00", 1)) // [100011 11001]
//}
