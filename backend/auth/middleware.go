package auth

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

const ginUserKey = "cognitoUser"

func AuthMiddleware(requiredGroups ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if len(authHeader) < 8 || authHeader[:7] != "Bearer " {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing auth token"})
			return
		}
		tokenString := authHeader[7:]

		if jwkKey == nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "auth not initialized"})
			return
		}

		token, err := jwt.Parse(tokenString, jwkKey.KeyfuncCtx(c.Request.Context()))
		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid claims"})
			return
		}

		issVal, _ := claims["iss"].(string)
		if issVal != issuer() {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid issuer"})
			return
		}

		clientIDVal, _ := claims["client_id"].(string)
		if clientIDVal != cfg.ClientID {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid client"})
			return
		}

		tokenUse, _ := claims["token_use"].(string)
		if tokenUse != "access" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "wrong token type"})
			return
		}

		expRaw, ok := claims["exp"]
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "no exp in token"})
			return
		}

		var expUnix int64
		switch v := expRaw.(type) {
		case float64:
			expUnix = int64(v)
		case int64:
			expUnix = v
		case json.Number:
			n, err := v.Int64()
			if err != nil {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "bad exp value"})
				return
			}
			expUnix = n
		default:
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "bad exp type"})
			return
		}

		if time.Now().After(time.Unix(expUnix, 0)) {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "token expired"})
			return
		}

		sub, _ := claims["sub"].(string)
		email, _ := claims["email"].(string)

		var groups []string
		if raw, ok := claims["cognito:groups"]; ok {
			if arr, ok := raw.([]interface{}); ok {
				for _, g := range arr {
					if gs, ok := g.(string); ok {
						groups = append(groups, gs)
					}
				}
			}
		}

		if len(requiredGroups) > 0 && !hasAnyGroup(groups, requiredGroups) {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "forbidden"})
			return
		}

		c.Set(ginUserKey, &UserContext{
			Sub:    sub,
			Email:  email,
			Groups: groups,
		})

		c.Next()
	}
}

func hasAnyGroup(userGroups []string, required []string) bool {
	set := make(map[string]struct{}, len(userGroups))
	for _, g := range userGroups {
		set[g] = struct{}{}
	}
	for _, rg := range required {
		if _, ok := set[rg]; ok {
			return true
		}
	}
	return false
}

func GetUser(c *gin.Context) (*UserContext, bool) {
	val, ok := c.Get(ginUserKey)
	if !ok {
		return nil, false
	}
	uc, ok := val.(*UserContext)
	return uc, ok
}
