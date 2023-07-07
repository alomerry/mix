package main

var (
	next_28      = make([]int, 1000)
	pre_28       int
	si_28, pi, i int
)

func strStr(haystack string, needle string) int {
	for i = 0; i < len(needle); i++ {
		if i == 0 {
			next_28[i] = 0
			continue
		}

		pre_28 = next_28[i-1]

		for {
			if needle[i] == needle[pre_28] {
				next_28[i] = pre_28 + 1
				break
			} else {
				if pre_28 == 0 {
					next_28[i] = 0
					break
				}
				pre_28 = next_28[pre_28-1]
			}
		}
	}
	si_28, pi = 0, 0
	for si_28 < len(haystack) && pi < len(needle) {
		if haystack[si_28] == needle[pi] {
			si_28++
			pi++
		} else if pi != 0 {
			pi = next_28[pi-1]
		} else {
			si_28++
		}
	}
	if pi < len(needle) {
		return -1
	} else {
		return si_28 - len(needle)
	}
}
