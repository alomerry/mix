package model

import (
	"encoding/json"
	"os"
	"regexp"
	"strings"
	"time"
)

const (
	htmlCommentPatten = `<!--.*-->`                       // <!-- @layout-full-width -->
	htmlItemPatten    = `<(/)*((\w)*(-)*(\w)*)+( )*(/)*>` // <xx/>、<x-x> xxx </x-x>
	codePatten        = "```(\\w)+(\\n.*)+```"

	emptyStr = ""
)

var (
	parser *Parser

	htmlCommentReg = regexp.MustCompile(htmlCommentPatten)
	htmlItemReg    = regexp.MustCompile(htmlItemPatten)
	codeReg        = regexp.MustCompile(codePatten)
)

func GetParser() *Parser {
	if parser == nil {
		parser = &Parser{}
	}
	return parser
}

type Parser struct {
	rawPath    string
	rawContent string
}

func (p *Parser) Parser(path string) *Markdown {
	p.rawPath = path
	p.rawContent = resolveFile(p.rawPath)

	md := Markdown{
		path: p.parserPath(path),
	}

	md.frontmatter = p.parserFrontmatter()
	md.content = p.parserContent()

	if md.Valid() {
		return &md
	}
	return nil
}

func (p *Parser) parserPath(path string) string {
	path = strings.TrimSpace(path)
	var (
		flag = "mix/blog/pages"
		mix  = strings.Index(path, flag)
	)

	if mix == -1 {
		return ""
	}

	return path[mix+len(flag):]
}

func (p *Parser) parserFrontmatter() Frontmatter {
	return parseToFrontmatter(reg.FindString(p.rawContent))
}

func (p *Parser) parserContent() string {
	return reg.ReplaceAllString(cleanMarkdown(p.rawContent), emptyStr)
}

type Markdown struct {
	path        string
	frontmatter Frontmatter
	content     string
}

func (m *Markdown) GetId() bool {
	return len(m.content) == 0
}

func (m *Markdown) IsEmpty() bool {
	return m.isEmpty() && m.frontmatter.IsEmpty()
}

func (m *Markdown) isEmpty() bool {
	return len(m.content) == 0
}

func (m *Markdown) Frontmatter() Frontmatter {
	return m.frontmatter
}

func (m *Markdown) Content() string {
	return m.content
}

func (m *Markdown) Path() string {
	return m.path
}

func (m *Markdown) Id() string {
	return strings.ReplaceAll(m.path, "/", "@")
}

func (m *Markdown) Valid() bool {
	return m.pathValid() && !m.IsEmpty()
}

func (m *Markdown) Output() any {
	type markdown struct {
		Path      string     `json:"markdownPath"`
		Content   string     `json:"content,omitempty"`
		Title     string     `json:"title,omitempty"`
		Place     string     `json:"place,omitempty"`
		Desc      string     `json:"description,omitempty"`
		Types     []string   `json:"types,omitempty"`
		CreatedAt *time.Time `json:"createdAt,omitempty"`
		UpdatedAt *time.Time `json:"updatedAt,omitempty"`
	}

	res := markdown{
		Path:    m.path,
		Content: m.content,
		Title:   m.frontmatter.title,
		Place:   m.frontmatter.place,
		Desc:    m.frontmatter.desc,
		Types:   m.frontmatter.types,
	}

	if m.frontmatter.CreatedAt().Unix() != 0 {
		createdAt := time.Unix(m.frontmatter.CreatedAt().Unix(), 0)
		res.CreatedAt = &createdAt
	}

	if m.frontmatter.UpdateAt().Unix() != 0 {
		updatedAt := time.Unix(m.frontmatter.UpdateAt().Unix(), 0)
		res.UpdatedAt = &updatedAt
	}

	return res
}

func (m *Markdown) Marshall() []byte {
	data, err := json.Marshal(m.Output())
	if err != nil {
		panic(err)
	}
	return data
}

func (m *Markdown) pathValid() bool {
	if m.path == "" {
		return false
	}
	return true
}

func cleanMarkdown(content string) string {
	content = removeByRegs(content, []*regexp.Regexp{htmlItemReg, htmlCommentReg, codeReg})
	// 仅剩 frontmatter 返回空白
	// 清理 [[toc]]
	return strings.TrimSpace(content)
}

func removeByRegs(content string, regs []*regexp.Regexp) string {
	for _, reg := range regs {
		content = reg.ReplaceAllString(content, emptyStr)
	}
	return content
}

func resolveFile(path string) string {
	data, err := os.ReadFile(path)
	if err != nil {
		panic(err)
	}
	return string(data)
}
