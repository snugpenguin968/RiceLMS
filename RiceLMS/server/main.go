package main

import (
	"log"
	"net/http"
	"server/auth"
	"server/repository"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	repository.InitializeConnection()
	auth.InitializeKey()

	router := mux.NewRouter()
	router.HandleFunc("/login", auth.LoginHandler).Methods("POST")
	router.HandleFunc("/refresh", auth.RefreshHandler).Methods("POST")
	router.HandleFunc("/register", auth.RegisterHandler).Methods("POST")

	// Apply CORS middleware
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"}, // allows all origins
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	}).Handler(router)

	// Start the server using the router with CORS middleware
	log.Fatal(http.ListenAndServe(":8000", corsHandler))
}
