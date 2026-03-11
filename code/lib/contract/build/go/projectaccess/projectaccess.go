package projectaccess

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type Project struct {
	Id int
	Name string
	Token string
	ApiKey string
	CreatedAt string
	UserId int
}

func (v Project) ToWire() []any {
	return []any{v.Id, v.Name, v.Token, v.ApiKey, v.CreatedAt, v.UserId}
}

func ProjectFromWire(data any) Project {
	arr := data.([]any)
	return Project{
		Id: int(arr[0].(float64)),
		Name: arr[1].(string),
		Token: arr[2].(string),
		ApiKey: arr[3].(string),
		CreatedAt: arr[4].(string),
		UserId: int(arr[5].(float64)),
	}
}

type ListReq struct {
	Limit int
}

func (v ListReq) ToWire() []any {
	return []any{v.Limit}
}

func ListReqFromWire(data any) ListReq {
	arr := data.([]any)
	return ListReq{
		Limit: int(arr[0].(float64)),
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

type TokenReq struct {
	Token string
}

func (v TokenReq) ToWire() []any {
	return []any{v.Token}
}

func TokenReqFromWire(data any) TokenReq {
	arr := data.([]any)
	return TokenReq{
		Token: arr[0].(string),
	}
}

type ApiKeyReq struct {
	ApiKey string
}

func (v ApiKeyReq) ToWire() []any {
	return []any{v.ApiKey}
}

func ApiKeyReqFromWire(data any) ApiKeyReq {
	arr := data.([]any)
	return ApiKeyReq{
		ApiKey: arr[0].(string),
	}
}

type UserReq struct {
	UserId int
}

func (v UserReq) ToWire() []any {
	return []any{v.UserId}
}

func UserReqFromWire(data any) UserReq {
	arr := data.([]any)
	return UserReq{
		UserId: int(arr[0].(float64)),
	}
}

type CreateReq struct {
	Name string
	UserId int
}

func (v CreateReq) ToWire() []any {
	return []any{v.Name, v.UserId}
}

func CreateReqFromWire(data any) CreateReq {
	arr := data.([]any)
	return CreateReq{
		Name: arr[0].(string),
		UserId: int(arr[1].(float64)),
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

type ProjectList struct {
	Projects []Project
}

func (v ProjectList) ToWire() []any {
	return []any{func() []any { r := make([]any, len(v.Projects)); for i, v := range v.Projects { r[i] = v.ToWire() }; return r }()}
}

func ProjectListFromWire(data any) ProjectList {
	arr := data.([]any)
	return ProjectList{
		Projects: func() []Project {
		arr := arr[0].([]any)
		r := make([]Project, len(arr))
		for i := range arr {
			r[i] = ProjectFromWire(arr[i])
		}
		return r
	}(),
	}
}

type Handler interface {
	List(req ListReq) ProjectList
	ListByUser(req UserReq) ProjectList
	Get(req IdReq) Project
	GetByToken(req TokenReq) Project
	GetByApiKey(req ApiKeyReq) Project
	Create(req CreateReq) Project
	Delete(req IdReq) Ok
}

func CallList(baseURL string, req ListReq) (ProjectList, error) {
	wire, err := rpc(baseURL, "ProjectAccess", "list", req.ToWire())
	if err != nil {
		var zero ProjectList
		return zero, err
	}
	return ProjectListFromWire(wire), nil
}

func CallListByUser(baseURL string, req UserReq) (ProjectList, error) {
	wire, err := rpc(baseURL, "ProjectAccess", "list_by_user", req.ToWire())
	if err != nil {
		var zero ProjectList
		return zero, err
	}
	return ProjectListFromWire(wire), nil
}

func CallGet(baseURL string, req IdReq) (Project, error) {
	wire, err := rpc(baseURL, "ProjectAccess", "get", req.ToWire())
	if err != nil {
		var zero Project
		return zero, err
	}
	return ProjectFromWire(wire), nil
}

func CallGetByToken(baseURL string, req TokenReq) (Project, error) {
	wire, err := rpc(baseURL, "ProjectAccess", "get_by_token", req.ToWire())
	if err != nil {
		var zero Project
		return zero, err
	}
	return ProjectFromWire(wire), nil
}

func CallGetByApiKey(baseURL string, req ApiKeyReq) (Project, error) {
	wire, err := rpc(baseURL, "ProjectAccess", "get_by_api_key", req.ToWire())
	if err != nil {
		var zero Project
		return zero, err
	}
	return ProjectFromWire(wire), nil
}

func CallCreate(baseURL string, req CreateReq) (Project, error) {
	wire, err := rpc(baseURL, "ProjectAccess", "create", req.ToWire())
	if err != nil {
		var zero Project
		return zero, err
	}
	return ProjectFromWire(wire), nil
}

func CallDelete(baseURL string, req IdReq) (Ok, error) {
	wire, err := rpc(baseURL, "ProjectAccess", "delete", req.ToWire())
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
