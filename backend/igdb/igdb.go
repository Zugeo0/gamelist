package igdb

import (
	"bytes"
	// "encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type Client struct {
    clientId  string
    accessKey string
}

func Connect() (*Client, error) {
    userid := os.Getenv("IGDB_USERID")
    accessKey := os.Getenv("IGDB_ACCESS_KEY")
    // secret := os.Getenv("IGDB_SECRET")
    // url := fmt.Sprintf(
    //     "https://id.twitch.tv/oauth2/token?client_id=%s&client_secret=%s&grant_type=client_credentials",
    //     userid,
    //     secret,
    // )
    // resp, err := http.Post(url, "text/plain", nil)
    // if err != nil {
    //     return nil, err
    // }

    // body, err := io.ReadAll(resp.Body)
    // if err != nil {
    //     return nil, err
    // }

    // bodyJson := struct {
    //     access_token string
    //     expires_in int
    //     token_type string
    // }{}

    // err = json.Unmarshal(body, &bodyJson)
    // if err != nil {
    //     return nil, err
    // }

    // client := &Client{
    //     clientId:  userid,
    //     accessKey: bodyJson.access_token,
    //     expiresIn: bodyJson.expires_in,
    // }

    client := &Client{
        clientId:  userid,
        accessKey: accessKey,
    }

    return client, nil
}

func (client *Client) Post(endpoint string, body string) (string, error) {
    requestBody := bytes.NewBuffer([]byte(body))

    req, err := http.NewRequest(
        http.MethodPost, 
        fmt.Sprintf("https://api.igdb.com/v4%s", endpoint),
        requestBody,
    )
    if err != nil {
        return "", err
    }

    req.Header.Add("Client-ID", client.clientId)
    req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", client.accessKey))

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return "", err
    }

    defer resp.Body.Close()
    respBody, err := io.ReadAll(resp.Body)
    if err != nil {
        return "", err
    }

    return string(respBody), nil
}

