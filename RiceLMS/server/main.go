package main

import (
	"log"
	"net/http"
	"server/auth"
	"server/repository"
)

func main() {
	repository.InitializeConnection()
	auth.InitializeKey()
	http.HandleFunc("/login", auth.LoginHandler)
	http.HandleFunc("/refresh", auth.RefreshHandler)

	log.Fatal(http.ListenAndServe(":8000", nil))
}
