package controller

import (
	"errors"
	"fmt"
	"github.com/alomerry/go-tools/modules/sgs/delay"
	"github.com/alomerry/go-tools/modules/sgs/tools"
	"github.com/alomerry/go-tools/static/constant"
	file_util "github.com/alomerry/go-tools/utils/files"
	"github.com/alomerry/go-tools/utils/zip"
	"github.com/duke-git/lancet/v2/fileutil"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"gw/core/utils/combiner"
	_const "gw/core/utils/const"
	"io"
	"net/http"
	"os"
	"path"
	"runtime/debug"
	"strings"
)

const (
	delaySummaryEmpty = iota
	delaySummaryFailed
	delaySummaryProgress
	delaySummarySuccess

	SgsWorkspace = "/tmp/sgs"
)

var (
	s         *SgsController
	targetMap = map[string]string{
		constant.StepA:      constant.StepA,
		constant.StepB:      constant.StepB,
		constant.StepReason: "_未出数据",
	}

	statusMap = map[string]int{}
)

func init() {
	s = NewSgsController()
	s.Register()

	downloadSgsStarDelayExcelTemplate()
}

type SgsController struct {
}

func NewSgsController() *SgsController {
	return &SgsController{}
}

func (s *SgsController) Register() {
	registerRouter(Version0, func(v0 *gin.RouterGroup) {
		var (
			sgs = v0.Group("/sgs")
		)

		sgs.POST("/upload", s.upload)
		sgs.POST("/merge", s.merge)
		sgs.GET("/download/:code", s.download)
		sgs.POST("/delay-summary", s.delaySummary)
		sgs.GET("/status", s.status)
	})
}

type mergeReq struct {
	Code     string `json:"code"`
	Category string `json:"type"`
}

type codeReq struct {
	Code string `json:"code"`
}

func (*SgsController) upload(c *gin.Context) {
	form, err := c.MultipartForm()
	if err != nil {
		c.String(http.StatusBadRequest, fmt.Sprintf("get err %s", err.Error()))
	}

	var (
		code     = c.Query("code")
		category = c.Query("type")
		files    = form.File["excels"]
	)

	for _, file := range files {
		if err := c.SaveUploadedFile(file, genAbsoluteFilePath(code, category, file.Filename)); err != nil {
			c.String(http.StatusBadRequest, fmt.Sprintf("upload err %s", err.Error()))
			return
		}
	}

	c.String(http.StatusOK, fmt.Sprintf("upload ok %d files", len(files)))
}

func (*SgsController) merge(c *gin.Context) {
	var (
		req = &mergeReq{}
	)
	err := c.MustBindWith(req, binding.JSON)
	if err != nil {
		panic(err)
	}

	if err := mergeAndRename(req.Category, req.Code); err != nil {
		c.String(http.StatusInternalServerError, "%v", err)
		return
	}
	c.String(http.StatusOK, fmt.Sprintf("merge ok"))
}

func (*SgsController) download(c *gin.Context) {
	fileName := c.Param("code")
	code := strings.Split(fileName, ".")[0]
	c.Header("Content-Type", "application/octet-stream")
	c.File(genAbsoluteFilePath(code, _const.StrEmpty, fileName))
}

func (*SgsController) status(c *gin.Context) {
	var (
		code = c.Query("code")
	)
	status, _ := statusMap[code]

	c.JSON(http.StatusOK, struct {
		Status int `json:"status"`
	}{status})

}

func (*SgsController) delaySummary(c *gin.Context) {
	var (
		req = &codeReq{}
	)
	err := c.MustBindWith(req, binding.JSON)
	if err != nil {
		panic(err)
	}

	statusMap[req.Code] = delaySummaryProgress

	setTemplateExcels(req.Code)

	delay.DoDelaySummaryMulti(genDirPath(req.Code, _const.StrEmpty))

	zipper := zip.New(genAbsoluteFilePath(req.Code, _const.StrEmpty, fmt.Sprintf("%v.zip", req.Code)))
	zipper.FromFiles(getNeedZipResult(req.Code))

	err = zipper.Close()
	if err != nil {
		panic(err)
	}

	statusMap[req.Code] = delaySummarySuccess
}

func setTemplateExcels(code string) {
	dstPath := genAbsoluteFilePath(code, _const.StrEmpty, "starlims delay.xlsx")
	err := fileutil.CopyFile(getSgsTemplateFilePath(), dstPath)
	if err != nil {
		panic(err)
	}
}

func getNeedZipResult(code string) []string {
	root := genDirPath(code, _const.StrEmpty)
	files, err := os.ReadDir(root)
	if err != nil {
		panic(err)
	}
	var res = make([]string, 0, len(files))
	for _, file := range files {
		if file.IsDir() {
			continue
		}
		if file.Name() == "A.xlsx" || file.Name() == "B.xlsx" {
			continue
		}
		res = append(res, path.Join(root, file.Name()))
	}
	return res
}

func mergeAndRename(category, code string) (err error) {
	defer func() {
		if r := recover(); r != nil {
			debug.PrintStack()
			err = errors.New(fmt.Sprintf("%v", r))
		}
	}()

	files, err := os.ReadDir(genDirPath(code, category))
	if len(files) == 0 {
		panic("no files")
	}

	var (
		fileType = file_util.GetFileType(files[0].Name())
		source   = genAbsoluteFilePath(code, category, files[0].Name())
		target   = genAbsoluteFilePath(code, _const.StrEmpty, getTargetFileName(category, fileType))
	)

	if len(files) > 1 {
		tools.DoMergeExcelSheets(genDirPath(code, category), nil)
		source = genAbsoluteFilePath(code, category, fmt.Sprintf("%s.%s", tools.MergeKey, fileType))
	}

	// TODO 使用 go-tools _未出数据 xxx
	// rename source -> category.{xlsx,csv}
	err = os.Rename(source, target)
	if err != nil {
		panic(err)
	}
	return
}

func getTargetFileName(category, fileType string) string {
	return fmt.Sprintf("%s.%s", targetMap[category], fileType)
}

func getSgsTemplateFilePath() string {
	return genAbsoluteFilePath("template", _const.StrEmpty, "starlims delay.xlsx")
}

func genDirPath(code, category string) string {
	return path.Join(combiner.New[string](combiner.WithIgnoreEmpty()).Combine(SgsWorkspace, code, category)...)
}

func genAbsoluteFilePath(code, category, fileName string) string {
	return path.Join(combiner.New[string](combiner.WithIgnoreEmpty()).Combine(SgsWorkspace, code, category, fileName)...)
}

func downloadSgsStarDelayExcelTemplate() {
	reader, fn, err := fileutil.ReadFile("https://cdn.alomerry.com/sgs/starlims%20delay.xlsx")
	if err != nil {
		panic(err)
	}
	defer fn()

	dat, err := io.ReadAll(reader)
	if err != nil {
		panic(err)
	}

	err = fileutil.CreateDir(genDirPath("template", _const.StrEmpty))
	if err != nil {
		panic(err)
	}
	if !fileutil.CreateFile(getSgsTemplateFilePath()) {
		panic("create delay template failed")
	}

	err = fileutil.WriteBytesToFile(getSgsTemplateFilePath(), dat)
	if err != nil {
		panic(err)
	}
}
