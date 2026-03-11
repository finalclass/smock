package mockaccess

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type Mock struct {
	Id int
	ProjectId int
	Name string
	Slug string
	Status string
	EntryFile string
	CreatedAt string
	UpdatedAt string
}

func (v Mock) ToWire() []any {
	return []any{v.Id, v.ProjectId, v.Name, v.Slug, v.Status, v.EntryFile, v.CreatedAt, v.UpdatedAt}
}

func MockFromWire(data any) Mock {
	arr := data.([]any)
	return Mock{
		Id: int(arr[0].(float64)),
		ProjectId: int(arr[1].(float64)),
		Name: arr[2].(string),
		Slug: arr[3].(string),
		Status: arr[4].(string),
		EntryFile: arr[5].(string),
		CreatedAt: arr[6].(string),
		UpdatedAt: arr[7].(string),
	}
}

type MockFile struct {
	Id int
	MockId int
	Path string
	ContentType string
	Size int
}

func (v MockFile) ToWire() []any {
	return []any{v.Id, v.MockId, v.Path, v.ContentType, v.Size}
}

func MockFileFromWire(data any) MockFile {
	arr := data.([]any)
	return MockFile{
		Id: int(arr[0].(float64)),
		MockId: int(arr[1].(float64)),
		Path: arr[2].(string),
		ContentType: arr[3].(string),
		Size: int(arr[4].(float64)),
	}
}

type ProjectReq struct {
	ProjectId int
}

func (v ProjectReq) ToWire() []any {
	return []any{v.ProjectId}
}

func ProjectReqFromWire(data any) ProjectReq {
	arr := data.([]any)
	return ProjectReq{
		ProjectId: int(arr[0].(float64)),
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

type SlugReq struct {
	ProjectId int
	Slug string
}

func (v SlugReq) ToWire() []any {
	return []any{v.ProjectId, v.Slug}
}

func SlugReqFromWire(data any) SlugReq {
	arr := data.([]any)
	return SlugReq{
		ProjectId: int(arr[0].(float64)),
		Slug: arr[1].(string),
	}
}

type CreateReq struct {
	ProjectId int
	Name string
	Slug string
	EntryFile string
}

func (v CreateReq) ToWire() []any {
	return []any{v.ProjectId, v.Name, v.Slug, v.EntryFile}
}

func CreateReqFromWire(data any) CreateReq {
	arr := data.([]any)
	return CreateReq{
		ProjectId: int(arr[0].(float64)),
		Name: arr[1].(string),
		Slug: arr[2].(string),
		EntryFile: arr[3].(string),
	}
}

type StatusReq struct {
	Id int
	Status string
}

func (v StatusReq) ToWire() []any {
	return []any{v.Id, v.Status}
}

func StatusReqFromWire(data any) StatusReq {
	arr := data.([]any)
	return StatusReq{
		Id: int(arr[0].(float64)),
		Status: arr[1].(string),
	}
}

type AddFileReq struct {
	MockId int
	Path string
	ContentType string
	Size int
}

func (v AddFileReq) ToWire() []any {
	return []any{v.MockId, v.Path, v.ContentType, v.Size}
}

func AddFileReqFromWire(data any) AddFileReq {
	arr := data.([]any)
	return AddFileReq{
		MockId: int(arr[0].(float64)),
		Path: arr[1].(string),
		ContentType: arr[2].(string),
		Size: int(arr[3].(float64)),
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

type MockList struct {
	Mocks []Mock
}

func (v MockList) ToWire() []any {
	return []any{func() []any { r := make([]any, len(v.Mocks)); for i, v := range v.Mocks { r[i] = v.ToWire() }; return r }()}
}

func MockListFromWire(data any) MockList {
	arr := data.([]any)
	return MockList{
		Mocks: func() []Mock {
		arr := arr[0].([]any)
		r := make([]Mock, len(arr))
		for i := range arr {
			r[i] = MockFromWire(arr[i])
		}
		return r
	}(),
	}
}

type MockFileList struct {
	Files []MockFile
}

func (v MockFileList) ToWire() []any {
	return []any{func() []any { r := make([]any, len(v.Files)); for i, v := range v.Files { r[i] = v.ToWire() }; return r }()}
}

func MockFileListFromWire(data any) MockFileList {
	arr := data.([]any)
	return MockFileList{
		Files: func() []MockFile {
		arr := arr[0].([]any)
		r := make([]MockFile, len(arr))
		for i := range arr {
			r[i] = MockFileFromWire(arr[i])
		}
		return r
	}(),
	}
}

type Handler interface {
	ListByProject(req ProjectReq) MockList
	Get(req IdReq) Mock
	GetBySlug(req SlugReq) Mock
	Create(req CreateReq) Mock
	UpdateStatus(req StatusReq) Mock
	Delete(req IdReq) Ok
	AddFile(req AddFileReq) MockFile
	ListFiles(req IdReq) MockFileList
}

func CallListByProject(baseURL string, req ProjectReq) (MockList, error) {
	wire, err := rpc(baseURL, "MockAccess", "list_by_project", req.ToWire())
	if err != nil {
		var zero MockList
		return zero, err
	}
	return MockListFromWire(wire), nil
}

func CallGet(baseURL string, req IdReq) (Mock, error) {
	wire, err := rpc(baseURL, "MockAccess", "get", req.ToWire())
	if err != nil {
		var zero Mock
		return zero, err
	}
	return MockFromWire(wire), nil
}

func CallGetBySlug(baseURL string, req SlugReq) (Mock, error) {
	wire, err := rpc(baseURL, "MockAccess", "get_by_slug", req.ToWire())
	if err != nil {
		var zero Mock
		return zero, err
	}
	return MockFromWire(wire), nil
}

func CallCreate(baseURL string, req CreateReq) (Mock, error) {
	wire, err := rpc(baseURL, "MockAccess", "create", req.ToWire())
	if err != nil {
		var zero Mock
		return zero, err
	}
	return MockFromWire(wire), nil
}

func CallUpdateStatus(baseURL string, req StatusReq) (Mock, error) {
	wire, err := rpc(baseURL, "MockAccess", "update_status", req.ToWire())
	if err != nil {
		var zero Mock
		return zero, err
	}
	return MockFromWire(wire), nil
}

func CallDelete(baseURL string, req IdReq) (Ok, error) {
	wire, err := rpc(baseURL, "MockAccess", "delete", req.ToWire())
	if err != nil {
		var zero Ok
		return zero, err
	}
	return OkFromWire(wire), nil
}

func CallAddFile(baseURL string, req AddFileReq) (MockFile, error) {
	wire, err := rpc(baseURL, "MockAccess", "add_file", req.ToWire())
	if err != nil {
		var zero MockFile
		return zero, err
	}
	return MockFileFromWire(wire), nil
}

func CallListFiles(baseURL string, req IdReq) (MockFileList, error) {
	wire, err := rpc(baseURL, "MockAccess", "list_files", req.ToWire())
	if err != nil {
		var zero MockFileList
		return zero, err
	}
	return MockFileListFromWire(wire), nil
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
