package machine

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"server/repository"
	"time"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

// DynamoDBService encapsulates the DynamoDB client and provides methods to interact with DynamoDB
type DynamoDBService struct {
	svc *dynamodb.Client
}

var dbService *DynamoDBService // Global instance of DynamoDBService

// InitializeDynamoDB initializes the DynamoDB service
func InitializeDynamoDB() error {
	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion("us-east-1"))
	if err != nil {
		return fmt.Errorf("unable to load SDK config: %w", err)
	}

	dbService = &DynamoDBService{
		svc: dynamodb.NewFromConfig(cfg),
	}

	return nil
}

func StartMachineHandler(w http.ResponseWriter, r *http.Request) {
	// Ensure the request method is POST
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Decode the incoming JSON request body into the MachineInput struct
	var input Machine
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&input)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Log the received input (for demonstration purposes)
	fmt.Printf("Received Machine Input: %+v\n", input)

	// Send a response back to the client
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	response := map[string]string{"status": "success"}
	json.NewEncoder(w).Encode(response)

	dbService.StartMachineHandlera(input)

}

func (db *DynamoDBService) StartMachineHandlera(machine Machine) {
	startTimeStr := machine.StartTime.Format(time.RFC3339)
	endTimeStr := machine.EndTime.Format(time.RFC3339)
	repository.AddMachineData(dbService.svc, machine.MachineID, machine.UserID, startTimeStr, endTimeStr)
}

func RetrieveDataHandler(w http.ResponseWriter, r *http.Request) {
	// Example usage of DynamoDB client (db.svc)
	// Here you can perform operations to retrieve data from DynamoDB using db.svc

	// Simulating some data to be returned
	data := map[string]string{
		"message": "This is some data retrieved from the server.",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}
