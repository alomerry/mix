## flag 包  
  
### os.Args  
  
https://colobu.com/2020/12/27/go-with-os-exec/  
  
简单获取命令行参数的方式，演示代码如下：  
  
```go  
func main() {  
for index, arg := range os.Args {  
fmt.Printf("arg[%v]=[%v]", index, arg)  
}  
}  
```  
  
执行 ``$ go build -o "main"` 编译，后运行输出结果：  
  
```shell  
$ ./main os.Args demo  
arg[0]=[./main]  
arg[1]=[os.Args]  
arg[2]=[demo]  
```  
  
```go  
// A Flag represents the state of a flag.  
type Flag struct {  
Name     string // name as it appears on command line  
Usage    string // help message  
Value    Value  // value as set  
DefValue string // default value (as text); for usage message  
}  
```  
  
```go  
// A FlagSet represents a set of defined flags. The zero value of a FlagSet  
// has no name and has ContinueOnError error handling.  
type FlagSet struct {  
// Usage is the function called when an error occurs while parsing flags.  
// The field is a function (not a method) that may be changed to point to  
// a custom error handler. What happens after Usage is called depends  
// on the ErrorHandling setting; for the command line, this defaults  
// to ExitOnError, which exits the program after calling Usage.  
Usage func ()  
  
name          string  
parsed        bool  
actual        map[string]*Flag  
formal        map[string]*Flag  
args          []string // arguments after flags  
errorHandling ErrorHandling  
output        io.Writer // nil means stderr; use out() accessor  
}  
```  