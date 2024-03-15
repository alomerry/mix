package utils

func Contains[T comparable](arr []T, elem T) bool {
	for _, item := range arr {
		if item == elem {
			return true
		}
	}
	return false
}
