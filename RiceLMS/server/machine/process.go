package machine

import (
	"encoding/json"
	"fmt"
	"net/http"
)

var washers []Machine
var dryers []Machine
var usedWashers []Machine
var usedDryers []Machine

func InitializeMachines() {
	for i := 1; i <= 12; i++ {
		washers = append(washers, Machine{MachineID: fmt.Sprintf("Washer%d", i)})
		dryers = append(dryers, Machine{MachineID: fmt.Sprintf("dryer%d", i)})
	}
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
}

func RetrieveDataHandler(w http.ResponseWriter, r *http.Request) {
	// Simulating some data to be returned
	data := map[string]string{
		"message": "This is some data retrieved from the server.",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}
