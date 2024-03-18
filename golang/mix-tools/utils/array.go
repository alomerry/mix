package utils

// Deprecated
func ContainsByJudge[T any](arr []T, i T, f func(a, b T) bool) bool {
	for _, item := range arr {
		if f(item, i) {
			return true
		}
	}

	return false
}
