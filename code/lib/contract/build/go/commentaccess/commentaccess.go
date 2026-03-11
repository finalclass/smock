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
	ThreadId int
	AuthorName string
	Body string
	CreatedAt string
}

func (v Comment) ToWire() []any {
	return []any{v.Id, v.ThreadId, v.AuthorName, v.Body, v.CreatedAt}
}

func CommentFromWire(data any) Comment {
	arr := data.([]any)
	return Comment{
		Id: int(arr[0].(float64)),
		ThreadId: int(arr[1].(float64)),
		AuthorName: arr[2].(string),
		Body: arr[3].(string),
		CreatedAt: arr[4].(string),
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

type CreateThreadReq struct {
	MockId int
	PagePath string
	XPct float64
	YPct float64
	AuthorName string
	Body string
}

func (v CreateThreadReq) ToWire() []any {
	return []any{v.MockId, v.PagePath, v.XPct, v.YPct, v.AuthorName, v.Body}
}

func CreateThreadReqFromWire(data any) CreateThreadReq {
	arr := data.([]any)
	return CreateThreadReq{
		MockId: int(arr[0].(float64)),
		PagePath: arr[1].(string),
		XPct: arr[2].(float64),
		YPct: arr[3].(float64),
		AuthorName: arr[4].(string),
		Body: arr[5].(string),
	}
}

type AddCommentReq struct {
	ThreadId int
	AuthorName string
	Body string
}

func (v AddCommentReq) ToWire() []any {
	return []any{v.ThreadId, v.AuthorName, v.Body}
}

func AddCommentReqFromWire(data any) AddCommentReq {
	arr := data.([]any)
	return AddCommentReq{
		ThreadId: int(arr[0].(float64)),
		AuthorName: arr[1].(string),
		Body: arr[2].(string),
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

type Thread struct {
	Id int
	MockId int
	PagePath string
	XPct float64
	YPct float64
	Resolved bool
	CreatedAt string
	Comments []Comment
}

func (v Thread) ToWire() []any {
	return []any{v.Id, v.MockId, v.PagePath, v.XPct, v.YPct, v.Resolved, v.CreatedAt, func() []any { r := make([]any, len(v.Comments)); for i, v := range v.Comments { r[i] = v.ToWire() }; return r }()}
}

func ThreadFromWire(data any) Thread {
	arr := data.([]any)
	return Thread{
		Id: int(arr[0].(float64)),
		MockId: int(arr[1].(float64)),
		PagePath: arr[2].(string),
		XPct: arr[3].(float64),
		YPct: arr[4].(float64),
		Resolved: arr[5].(bool),
		CreatedAt: arr[6].(string),
		Comments: func() []Comment {
		arr := arr[7].([]any)
		r := make([]Comment, len(arr))
		for i := range arr {
			r[i] = CommentFromWire(arr[i])
		}
		return r
	}(),
	}
}

type ThreadList struct {
	Threads []Thread
}

func (v ThreadList) ToWire() []any {
	return []any{func() []any { r := make([]any, len(v.Threads)); for i, v := range v.Threads { r[i] = v.ToWire() }; return r }()}
}

func ThreadListFromWire(data any) ThreadList {
	arr := data.([]any)
	return ThreadList{
		Threads: func() []Thread {
		arr := arr[0].([]any)
		r := make([]Thread, len(arr))
		for i := range arr {
			r[i] = ThreadFromWire(arr[i])
		}
		return r
	}(),
	}
}

type Handler interface {
	ListThreadsByMock(req MockReq) ThreadList
	CreateThread(req CreateThreadReq) Thread
	AddComment(req AddCommentReq) Comment
	ResolveThread(req IdReq) Thread
	DeleteThread(req IdReq) Ok
}

func CallListThreadsByMock(baseURL string, req MockReq) (ThreadList, error) {
	wire, err := rpc(baseURL, "CommentAccess", "list_threads_by_mock", req.ToWire())
	if err != nil {
		var zero ThreadList
		return zero, err
	}
	return ThreadListFromWire(wire), nil
}

func CallCreateThread(baseURL string, req CreateThreadReq) (Thread, error) {
	wire, err := rpc(baseURL, "CommentAccess", "create_thread", req.ToWire())
	if err != nil {
		var zero Thread
		return zero, err
	}
	return ThreadFromWire(wire), nil
}

func CallAddComment(baseURL string, req AddCommentReq) (Comment, error) {
	wire, err := rpc(baseURL, "CommentAccess", "add_comment", req.ToWire())
	if err != nil {
		var zero Comment
		return zero, err
	}
	return CommentFromWire(wire), nil
}

func CallResolveThread(baseURL string, req IdReq) (Thread, error) {
	wire, err := rpc(baseURL, "CommentAccess", "resolve_thread", req.ToWire())
	if err != nil {
		var zero Thread
		return zero, err
	}
	return ThreadFromWire(wire), nil
}

func CallDeleteThread(baseURL string, req IdReq) (Ok, error) {
	wire, err := rpc(baseURL, "CommentAccess", "delete_thread", req.ToWire())
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
