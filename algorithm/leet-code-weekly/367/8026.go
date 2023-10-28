package main

import (
	"math/big"
)

func constructProductMatrix(grid [][]int) [][]int {
	var (
		p                   = make([][]int, len(grid))
		pre, tmp, now, last = big.NewInt(0), big.NewInt(0), big.NewInt(0), big.NewInt(0)
		mod                 = big.NewInt(int64(12345))
		zero, zi, zj        = 0, 0, 0
	)
	for i := range grid {
		p[i] = make([]int, len(grid[i]))
		for j := 0; j < len(grid[i]) && zero < 2; j++ {
			if grid[i][j]%12345 == 0 {
				zero++
				zi, zj = i, j
			}
		}
	}
	if zero >= 2 {
		return p

	} else if zero >= 1 {
		pre = cal(zi, zj, &grid)
		p[zi][zj] = int(tmp.Mod(pre, mod).Int64())
		return p
	}
	pre = cal(0, 0, &grid)
	for i := range grid {
		p[i] = make([]int, len(grid[i]))
		for j := 0; j < len(grid[i]); j++ {
			if i == 0 && j == 0 {
				p[i][j] = int(tmp.Mod(pre, mod).Int64())
				continue
			}
			now.SetInt64(int64(grid[i][j]))
			last.SetInt64(int64(lastValue(i, j, &grid)))
			pre = pre.Mul(pre, last)
			pre = pre.Div(pre, now)
			p[i][j] = int(tmp.Mod(pre, mod).Int64())
		}
	}
	return p
}

func lastValue(i, j int, grid *[][]int) int {
	if j == 0 {
		return (*grid)[i-1][len((*grid)[0])-1]
	}
	return (*grid)[i][j-1]
}

func cal(i, j int, grid *[][]int) *big.Int {
	var (
		res = big.NewInt(1)
		tmp = big.NewInt(0)
	)
	for a := range *grid {
		for b := range (*grid)[a] {
			if a == i && b == j {
				continue
			}
			tmp.SetInt64(int64((*grid)[a][b]))
			res = res.Mul(res, tmp)
		}
	}
	return res
}
