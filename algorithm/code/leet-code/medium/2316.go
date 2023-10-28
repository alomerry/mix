package main

var (
	fa = make([]int, 1e5)
)

func countPairs(n int, edges [][]int) int64 {
	var (
		v     = map[int]int{}
		queue []int
		total int
	)

	for i := 0; i < n; i++ {
		fa[i] = i
	}

	for i := range edges {
		a, b := edges[i][0], edges[i][1]
		merge(a, b)
	}

	for i := 0; i < n; i++ {
		v[find(i)]++
	}

	for _, count := range v {
		queue = append(queue, count)
		total += count
	}
	return sum(total, queue)
}

func sum(total int, q []int) int64 {
	var (
		result int64
	)
	for i := range q {
		total -= q[i]
		result += int64(q[i] * total)
	}
	return result
}

func find(i int) int {
	if fa[i] == i {
		return i
	}
	fa[i] = find(fa[i])
	return fa[i]
}

func merge(i, j int) {
	fa[find(i)] = find(j)
}

//func main() {
//	var (
//		edges = [][]int{{0, 1}, {0, 2}, {1, 2}}
//		n     = 3
//	)
//	//fmt.Println(countPairs(n, edges))
//
//	edges = [][]int{{0, 15}, {1, 14}, {2, 11}, {4, 3}, {5, 15}, {8, 2}, {14, 12}}
//	n = 16
//	fmt.Println(countPairs(n, edges))
//}
