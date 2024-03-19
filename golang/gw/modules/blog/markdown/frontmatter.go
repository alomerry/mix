package markdown

import (
	"fmt"
	utils "github.com/alomerry/go-tools/utils/time"
	"regexp"
	"strings"
	"time"
)

const (
	frontmatterPatten = `^---\n([\s\S]*?)\n---`
	datePatten        = `date: ([\w|-]+[\w|:|.|+]*)` // date: 2019-07-21T16:00:00.000+00:00
	updatePatten      = `update: ([\w|-]+[\w|:|.|+]*)`
	titlePatten       = `title: (.*)`
	displayPatten     = `display: (.*)`
	placePatten       = `place: (.*)`
	descPatten        = `desc: (.*)`
	typesPatten       = `type: (.*)`
)

var (
	reg        = regexp.MustCompile(frontmatterPatten)
	dateReg    = regexp.MustCompile(datePatten)
	updateReg  = regexp.MustCompile(updatePatten)
	titleReg   = regexp.MustCompile(titlePatten)
	displayReg = regexp.MustCompile(displayPatten)
	placeReg   = regexp.MustCompile(placePatten)
	descReg    = regexp.MustCompile(descPatten)
	typesReg   = regexp.MustCompile(typesPatten)
)

type Frontmatter struct {
	date   time.Time
	title  string
	desc   string
	place  string
	types  []string
	update time.Time
}

func (f Frontmatter) Title() string {
	return f.title
}

func (f Frontmatter) Types() []string {
	return f.types
}

func (f Frontmatter) Description() string {
	return f.desc
}

func (f Frontmatter) UpdateAt() time.Time {
	return f.update
}

func (f Frontmatter) CreatedAt() time.Time {
	return f.date
}

func (f Frontmatter) IsEmpty() bool {
	return len(f.title) == 0
}

func (f Frontmatter) String() string {
	return fmt.Sprintf("title: [%v]\ndesc: [%v]\ntypes: [%v]\ndate: [%v]\nupdate: [%v]\n",
		f.title,
		f.desc,
		f.types,
		f.date.Local(),
		f.update.Local(),
	)
}

func parseToFrontmatter(fm string) Frontmatter {
	return Frontmatter{
		date:   pareFrontmatterTime(fm, dateReg),
		update: pareFrontmatterTime(fm, updateReg),
		title: func() string {
			if display := pareFrontmatterString(fm, displayReg); len(display) > 0 {
				return display
			}
			return pareFrontmatterString(fm, titleReg)
		}(),
		desc:  pareFrontmatterString(fm, descReg),
		place: pareFrontmatterString(fm, placeReg),
		types: pareFrontmatterTypes(fm),
	}
}

func pareFrontmatterTypes(fm string) []string {
	if typesReg.MatchString(fm) {
		// TODO 数组越界
		return strings.Split(typesReg.FindStringSubmatch(fm)[1], "+")
	}
	return nil
}

func pareFrontmatterString(fm string, reg *regexp.Regexp) string {
	if reg.MatchString(fm) {
		// TODO 数组越界
		return reg.FindStringSubmatch(fm)[1]
	}
	return emptyStr
}

func pareFrontmatterTime(fm string, reg *regexp.Regexp) time.Time {
	if reg.MatchString(fm) {
		// TODO 数组越界
		date := reg.FindStringSubmatch(fm)[1]
		return utils.ConvString2Time(date)
	}
	return utils.EmptyTime
}
