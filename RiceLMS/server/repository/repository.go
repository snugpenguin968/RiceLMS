package repository

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func TestConnection() {

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
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Error connecting to the database:", err)
	}
	defer db.Close()

	// Test the connection
	err = db.Ping()
	if err != nil {
		log.Fatal("Error pinging the database:", err)
	}
	fmt.Println("Successfully connected to the database!")

	// Query the database
	rows, err := db.Query("SELECT username, password FROM users")
	if err != nil {
		log.Fatal("Error querying the database:", err)
	}
	defer rows.Close()

	// Iterate over the query results
	for rows.Next() {
		var username, password string
		err := rows.Scan(&username, &password)
		if err != nil {
			log.Fatal("Error scanning row:", err)
		}
		fmt.Printf("Username: %s, Password: %s\n", username, password)
	}

	// Check for errors during row iteration
	if err := rows.Err(); err != nil {
		log.Fatal("Error during row iteration:", err)
	}
}
