package constants

import "time"

type Machine struct {
	MachineID string
	UserID    string
	StartTime time.Time
	EndTime   time.Time
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
