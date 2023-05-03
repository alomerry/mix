package main

var (
	next      = make([]int, 1000)
	pre       int
	si, pi, i int
)

func strStr(haystack string, needle string) int {
	for i = 0; i < len(needle); i++ {
		if i == 0 {
			next[i] = 0
			continue
		}

		pre = next[i-1]

		for {
			if needle[i] == needle[pre] {
				next[i] = pre + 1
				break
			} else {
				if pre == 0 {
					next[i] = 0
					break
				}
				pre = next[pre-1]
			}
		}
	}
	si, pi = 0, 0
	for si < len(haystack) && pi < len(needle) {
		if haystack[si] == needle[pi] {
			si++
			pi++
		} else if pi != 0 {
			pi = next[pi-1]
		} else {
			si++
		}
	}
	if pi < len(needle) {
		return -1
	} else {
		return si - len(needle)
	}
}
