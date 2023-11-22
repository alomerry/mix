package main

var (
	phoneMapper_17 = map[uint8][]string{
		'2': {"a", "b", "c"},
		'3': {"d", "e", "f"},
		'4': {"g", "h", "i"},
		'5': {"j", "k", "l"},
		'6': {"m", "n", "o"},
		'7': {"p", "q", "r", "s"},
		'8': {"t", "u", "v"},
		'9': {"w", "x", "y", "z"},
	}
	now_17    string
	result_17 []string
)

func letterCombinations(digits string) []string {
	now_17 = ""
	result_17 = []string{}
	if len(digits) > 0 {
		dfs_17(digits)
	}
	return result_17
}

func dfs_17(digits string) {
	if len(digits) == 0 {
		result_17 = append(result_17, now_17)
	} else {
		for j := range phoneMapper_17[digits[0]] {
			now_17 += phoneMapper_17[digits[0]][j]
			dfs_17(digits[1:])
			now_17 = now_17[:len(now_17)-1]
		}
	}
}
