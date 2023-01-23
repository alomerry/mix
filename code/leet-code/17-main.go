package leet_code

var (
	phoneMapper = map[uint8][]string{
		'2': {"a", "b", "c"},
		'3': {"d", "e", "f"},
		'4': {"g", "h", "i"},
		'5': {"j", "k", "l"},
		'6': {"m", "n", "o"},
		'7': {"p", "q", "r", "s"},
		'8': {"t", "u", "v"},
		'9': {"w", "x", "y", "z"},
	}
	now    string
	result []string
)

func letterCombinations(digits string) []string {
	now = ""
	result = []string{}
	if len(digits) > 0 {
		dfs(digits)
	}
	return result
}

func dfs(digits string) {
	if len(digits) == 0 {
		result = append(result, now)
	} else {
		for j := range phoneMapper[digits[0]] {
			now += phoneMapper[digits[0]][j]
			dfs(digits[1:])
			now = now[:len(now)-1]
		}
	}
}
