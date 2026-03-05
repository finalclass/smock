package commentaccess

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type Comment struct {
	Id int
	MockId int
	PagePath string
	XPct float64
	YPct float64
	AuthorName string
	Body string
	Resolved bool
	CreatedAt string
}

func (v Comment) ToWire() []any {
	return []any{v.Id, v.MockId, v.PagePath, v.XPct, v.YPct, v.AuthorName, v.Body, v.Resolved, v.CreatedAt}
}

func CommentFromWire(data any) Comment {
	arr := data.([]any)
	return Comment{
		Id: int(arr[0].(float64)),
		MockId: int(arr[1].(float64)),
		PagePath: arr[2].(string),
		XPct: arr[3].(float64),
		YPct: arr[4].(float64),
		AuthorName: arr[5].(string),
		Body: arr[6].(string),
		Resolved: arr[7].(bool),
		CreatedAt: arr[8].(string),
	}
}

type MockReq struct {
	MockId int
}

func (v MockReq) ToWire() []any {
	return []any{v.MockId}
}

func MockReqFromWire(data any) MockReq {
	arr := data.([]any)
	return MockReq{
		MockId: int(arr[0].(float64)),
	}
}

type IdReq struct {
	Id int
}

func (v IdReq) ToWire() []any {
	return []any{v.Id}
}

func IdReqFromWire(data any) IdReq {
	arr := data.([]any)
	return IdReq{
		Id: int(arr[0].(float64)),
	}
}

type CreateReq struct {
	MockId int
	PagePath string
	XPct float64
	YPct float64
	AuthorName string
	Body string
}

func (v CreateReq) ToWire() []any {
	return []any{v.MockId, v.PagePath, v.XPct, v.YPct, v.AuthorName, v.Body}
}

func CreateReqFromWire(data any) CreateReq {
	arr := data.([]any)
	return CreateReq{
		MockId: int(arr[0].(float64)),
		PagePath: arr[1].(string),
		XPct: arr[2].(float64),
		YPct: arr[3].(float64),
		AuthorName: arr[4].(string),
		Body: arr[5].(string),
	}
}

type Ok struct {
	Ok bool
}

func (v Ok) ToWire() []any {
	return []any{v.Ok}
}

func OkFromWire(data any) Ok {
	arr := data.([]any)
	return Ok{
		Ok: arr[0].(bool),
	}
}

type CommentList struct {
	Comments []Comment
}

func (v CommentList) ToWire() []any {
	return []any{func() []any { r := make([]any, len(v.Comments)); for i, v := range v.Comments { r[i] = v.ToWire() }; return r }()}
}

func CommentListFromWire(data any) CommentList {
	arr := data.([]any)
	return CommentList{
		Comments: func() []Comment {
		arr := arr[0].([]any)
		r := make([]Comment, len(arr))
		for i := range arr {
			r[i] = CommentFromWire(arr[i])
		}
		return r
	}(),
	}
}

type Handler interface {
	ListByMock(req MockReq) CommentList
	Create(req CreateReq) Comment
	Resolve(req IdReq) Comment
	Delete(req IdReq) Ok
}

func CallListByMock(baseURL string, req MockReq) (CommentList, error) {
	wire, err := rpc(baseURL, "CommentAccess", "list_by_mock", req.ToWire())
	if err != nil {
		var zero CommentList
		return zero, err
	}
	return CommentListFromWire(wire), nil
}

func CallCreate(baseURL string, req CreateReq) (Comment, error) {
	wire, err := rpc(baseURL, "CommentAccess", "create", req.ToWire())
	if err != nil {
		var zero Comment
		return zero, err
	}
	return CommentFromWire(wire), nil
}

func CallResolve(baseURL string, req IdReq) (Comment, error) {
	wire, err := rpc(baseURL, "CommentAccess", "resolve", req.ToWire())
	if err != nil {
		var zero Comment
		return zero, err
	}
	return CommentFromWire(wire), nil
}

func CallDelete(baseURL string, req IdReq) (Ok, error) {
	wire, err := rpc(baseURL, "CommentAccess", "delete", req.ToWire())
	if err != nil {
		var zero Ok
		return zero, err
	}
	return OkFromWire(wire), nil
}

func rpc(baseURL, service, method string, payload []any) (any, error) {
	body, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("marshal: %w", err)
	}
	resp, err := http.Post(baseURL+"/rpc/"+service+"/"+method, "application/json", bytes.NewReader(body))
	if err != nil {
		return nil, fmt.Errorf("request: %w", err)
	}
	defer resp.Body.Close()
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("read: %w", err)
	}
	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("RPC %s.%s: %d %s", service, method, resp.StatusCode, string(respBody))
	}
	var result any
	if err := json.Unmarshal(respBody, &result); err != nil {
		return nil, fmt.Errorf("unmarshal: %w", err)
	}
	return result, nil
}
