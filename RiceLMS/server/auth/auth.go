package auth

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"server/repository"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

var jwtKey []byte

type Credentials struct {
	Username string `json: "username"`
	Password string `json: "password`
}

type Claims struct {
	Username string `json: "username"`
	jwt.RegisteredClaims
}

func Init() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file:", err)
	}
	jwtKey = []byte(os.Getenv("JWT_SECRET"))
	if len(jwtKey) == 0 {
		log.Fatal("JWT_SECRET environment variable not set")
	}
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var creds Credentials
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	isAuthorized, err := repository.CheckCredentials(creds.Username, creds.Password)
	if !isAuthorized {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	expirationTime := time.Now().Add(15 * time.Minute)
	claims := &Claims{
		Username: creds.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, *claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	response := map[string]string{"token": tokenString}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)

}
