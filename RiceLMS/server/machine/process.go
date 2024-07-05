package machine

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"server/constants"
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
	var input constants.Machine
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

func (db *DynamoDBService) StartMachineHandlera(machine constants.Machine) {
	startTimeStr := machine.StartTime.Format(time.RFC3339)
	endTimeStr := machine.EndTime.Format(time.RFC3339)
	repository.AddMachineData(dbService.svc, machine.MachineID, machine.UserID, startTimeStr, endTimeStr)
}

func RetrieveDataHandler(w http.ResponseWriter, r *http.Request) {
	machines, err := dbService.RetrieveDataHandler()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	activeMachines := []constants.Machine{}
	currentTime := time.Now()

	for _, machine := range *machines {
		if currentTime.Before(machine.EndTime) || currentTime.Equal(machine.EndTime) {
			activeMachines = append(activeMachines, machine)
		} else {
			// Delete the machine from the database since it's inactive
			err := repository.DeleteMachine(dbService.svc, machine.MachineID, machine.StartTime.Format(time.RFC3339))
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(activeMachines)

}

func (db *DynamoDBService) RetrieveDataHandler() (*[]constants.Machine, error) {
	return repository.GetAllMachines(dbService.svc)
}
