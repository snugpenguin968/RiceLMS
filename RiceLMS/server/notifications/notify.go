package notifications

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"server/constants"
	"sync"
	"time"
)

var activeMachines *Deque
var userTokens = struct {
	sync.RWMutex
	m map[string]string
}{m: make(map[string]string)}

type TokenRequest struct {
	Token  string
	UserID string
}

type UserToTokenRequest struct {
	UserID string
}

type TokenResponse struct {
	Token string `json:"token"`
}

type ExpoPushMessage struct {
	To    string `json:"to"`
	Title string `json:"title"`
	Body  string `json:"body"`
}

func InitializeNotificationService() *Deque {
	activeMachines = NewDeque()
	userTokens.m = make(map[string]string)
	return activeMachines
}

func TrackNotifications() {
	ticker := time.NewTicker(time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			userTokens.Lock()
			activeMachines.RemoveCompletedMachines()
			userTokens.Unlock()
		}
	}
}

func (d *Deque) RemoveCompletedMachines() {
	d.mu.Lock()
	defer d.mu.Unlock()

	currentTime := time.Now()
	for len(d.items) > 0 {
		if currentTime.After(d.items[0].EndTime) || currentTime.Equal(d.items[0].EndTime) {
			top := d.items[0]
			d.items = d.items[1:]
			go sendNotification(top)
		} else {
			break
		}
	}
}

func RegisterTokenHandler(w http.ResponseWriter, r *http.Request) {
	var tokenReq TokenRequest
	err := json.NewDecoder(r.Body).Decode(&tokenReq)
	if err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	// Store the token with the user ID
	userTokens.Lock()
	userTokens.m[tokenReq.UserID] = tokenReq.Token
	userTokens.Unlock()
	fmt.Println("Received token for user:", tokenReq.UserID, tokenReq.Token)

	w.WriteHeader(http.StatusOK)
}

func GetUserTokenHandler(w http.ResponseWriter, r *http.Request) {
	var tokenReq UserToTokenRequest
	fmt.Println(r.Body)
	err := json.NewDecoder(r.Body).Decode(&tokenReq)
	if err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	token, exists := userTokens.m[tokenReq.UserID]
	if !exists {
		http.Error(w, "Token not found", http.StatusNotFound)
		return
	}

	response := TokenResponse{Token: token}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func sendNotification(completedMachine constants.Machine) error {
	// Lock userTokens for reading
	userTokens.RLock()
	defer userTokens.RUnlock()

	// Create the notification message payload
	message := ExpoPushMessage{
		To:    userTokens.m[completedMachine.UserID],
		Title: "Notification",
		Body:  "Clothes Moved!",
	}

	// Marshal the message into JSON
	messageJSON, err := json.Marshal(message)
	if err != nil {
		return fmt.Errorf("failed to marshal message: %w", err)
	}

	// Send the notification
	resp, err := http.Post("https://exp.host/--/api/v2/push/send", "application/json", bytes.NewBuffer(messageJSON))
	if err != nil {
		return fmt.Errorf("failed to send notification: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	return nil
}
