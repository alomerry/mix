package main

func categorizeBox(length int, width int, height int, mass int) string {
	var (
		flag = uint8(0)
		v    = uint64(0)
	)
	if mass >= 100 {
		flag |= 1
	}
	v = uint64(length * width * height)
	if v >= 1e9 || length >= 1e4 || height >= 1e4 || width >= 1e4 {
		flag |= 2
	}
	switch flag {
	case 1:
		return "Heavy"
	case 2:
		return "Bulky"
	case 3:
		return "Both"
	default:
		return "Neither"
	}
}

//func main() {
//	fmt.Println(categorizeBox(200, 50, 800, 50))
//	fmt.Println(categorizeBox(3223, 1271, 2418, 749))
//}
