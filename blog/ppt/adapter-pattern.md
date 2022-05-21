title: Adapter Pattern
speaker: Alomerry Wu
url: https://alomerry.com
js:
<!-- - https://www.echartsjs.com/asset/theme/shine.js -->
prismTheme: solarizedlight
<!-- plugins:
    - echarts
    - mermaid
    - katex -->

<slide></slide>

# 适配器模式

<slide></slide>

## 意图

将一个类的接口转换成客户希望的另外一个接口。适配器模式使得原本由于接口不兼容而不能一起工作的那些类可以一起工作。

## 适用场景

- 系统需要使用现有的类，但现有的类却不兼容
- 需要建立一个可以重复使用的类，用于一些彼此关系不大的类，并易于扩展
- 需要一个统一的输出接口，但是输入类型却不可预知
- 调用第三方组件

## 角色

源角色、目标角色、适配器角色

<slide></slide>

## Case

- 美国电器工作电压 110V，中国 220V
- JAVA 中的 jdbc
- Linux 运行 Windows 程序，使用 wine
- 笔记本 SD 卡接口读取 TF 卡



<slide></slide>

## Mairpc 中的例子

```go
type IOSSClient interface {
	SignUrl(ctx, key, method, contentType, expires)
}
```

### Minio
```go
func (m *MinioOss) SignUrl(ctx, key, method, contentType, expires, option) (string, error) {
	......
	switch method {
	case HTTPGet:
		......
		url, err = m.minioClient.PresignedGetObject(ctx, m.getBucketName(), key, time.Duration(expires*time.Second.Nanoseconds()), reqParams)
	default:
		err = errors.NewInvalidArgumentError("method")
	}
	.......
    return url.String(), nil
}
```

### Aliyun
```go
func (a *AliyunOss) SignUrl(ctx, key string, method, contentType, expires, option) (string, error) {
	url, err := a.getBucket(ctx).SignURL(key, aliyun.HTTPMethod(method), expires)
	if err != nil {
		return "", err
	}
	return url, nil
}
```

<slide></slide>

## 优缺点

|优点|缺点|
|--|--|
|目标类和适配者类解耦|过多的使用，会让系统非常零乱|
|增加了透明性和复用性|--|
|系统的灵活性和扩展性好|--|
