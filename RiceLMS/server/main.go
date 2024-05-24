package main

import (
	"server/auth"
	"server/repository"
)

func main() {
	repository.TestConnection()
	auth.Init()
}
