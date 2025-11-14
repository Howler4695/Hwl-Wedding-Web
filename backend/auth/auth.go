package auth

import (
	"context"

	"github.com/MicahParks/keyfunc/v3"
)

type CognitoConfig struct {
	Region     string
	UserPoolID string
	ClientID   string
}

type UserContext struct {
	Sub    string
	Email  string
	Groups []string
}

var (
	cfg    CognitoConfig
	jwkKey keyfunc.Keyfunc
)

func Init(c CognitoConfig) error {
	cfg = c

	jwksURL := "https://cognito-idp." + cfg.Region +
		".amazonaws.com/" + cfg.UserPoolID + "/.well-known/jwks.json"

	k, err := keyfunc.NewDefaultCtx(context.Background(), []string{jwksURL})
	if err != nil {
		return err
	}
	jwkKey = k
	return nil
}

func issuer() string {
	return "https://cognito-idp." + cfg.Region + ".amazonaws.com/" + cfg.UserPoolID
}
