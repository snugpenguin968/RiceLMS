package machine

import "time"

type Machine struct {
	MachineID string    `firestore:"machineID"`
	UserID    string    `firestore:"userID"`
	StartTime time.Time `firestore:"startTime"`
	EndTime   time.Time `firestore:"endTime"`
}

func StartMachine(machineID, userID string) *Machine {
	return &Machine{
		MachineID: machineID,
		UserID:    userID,
		StartTime: time.Now(),
	}
}

func (m *Machine) StopMachine() {
	m.EndTime = time.Now()
}

func (m *Machine) GetMachineStatus() string {
	if m.EndTime.IsZero() {
		return "Running"
	}
	return "Stopped"
}
