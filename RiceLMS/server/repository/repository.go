package repository

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

var db *sql.DB

func InitializeConnection() {

	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file:", err)
	}

	// Get the password from the environment variables
	password := os.Getenv("DB_PASSWORD")
	if password == "" {
		log.Fatal("DB_PASSWORD environment variable not set")
	}

	host := "localhost"
	port := 5433
	user := "postgres"
	dbname := "postgres"
	sslmode := "disable"

	connStr := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		host, port, user, password, dbname, sslmode)
	// Open a connection to the database
	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Error connecting to the database:", err)
	}

	// Test the connection
	err = db.Ping()
	if err != nil {
		log.Fatal("Error pinging the database:", err)
	}
	fmt.Println("Successfully connected to the database!")

}

func CheckCredentials(Username, Password string) (bool, error) {
	var storedPassword string
	err := db.QueryRow("SELECT password FROM users WHERE username=$1", Username).Scan(&storedPassword)
	if err != nil {
		if err == sql.ErrNoRows {
			// Username not found
			return false, nil
		}
		// Other error
		return false, err
	}

	// Compare the provided password with the stored hashed password
	if err := bcrypt.CompareHashAndPassword([]byte(storedPassword), []byte(Password)); err != nil {
		// Password does not match
		return false, nil
	}

	// Username and password match
	return true, nil
}

func CheckExistingUser(Username string) (bool, error) {
	var existingUser string
	err := db.QueryRow("SELECT username FROM users WHERE username=$1", Username).Scan(&existingUser)
	if err == nil {
		return true, nil
	} else if err != sql.ErrNoRows {
		return true, err
	}
	return false, nil
}

func InsertUser(Username, Password string) error {
	_, err := db.Exec("INSERT INTO users (username, password) VALUES ($1, $2)", Username, Password)
	return err
}
