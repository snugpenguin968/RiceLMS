package auth

import (
	"log"
	"os"

	"net/http"

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

}
