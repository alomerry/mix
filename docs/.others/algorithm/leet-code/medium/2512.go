package main

import (
	"github.com/emirpasic/gods/lists/arraylist"
	"strings"
)

type student struct {
	score int
	id    int
}

func topStudents(positive_feedback []string, negative_feedback []string, report []string, student_id []int, k int) []int {
	var (
		st     = arraylist.New()
		mapper = make(map[string]int)
		result = make([]int, 0, k)
	)
	for i := range positive_feedback {
		mapper[positive_feedback[i]] = 3
	}
	for i := range negative_feedback {
		mapper[negative_feedback[i]] = -1
	}

	for i := range student_id {
		student := student{id: student_id[i]}
		re := strings.Split(report[i], " ")
		for j := range re {
			if score, exists := mapper[re[j]]; exists {
				student.score += score
			}
		}
		st.Add(student)
	}
	st.Sort(func(a, b interface{}) int {
		if a.(student).score > b.(student).score || (a.(student).score == b.(student).score && a.(student).id < b.(student).id) {
			return -1
		}
		return 1
	})
	for i, st := range st.Values() {
		if i < k {
			result = append(result, st.(student).id)
		}
	}
	return result
}

//
//func main() {
//	fmt.Println(topStudents([]string{"smart", "brilliant", "studious"}, []string{"not"}, []string{"this student is studious", "the student is smart"}, []int{1, 2}, 2))
//}
