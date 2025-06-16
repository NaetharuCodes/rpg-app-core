package main

import (
	"fmt"
	"log"

	"golang.org/x/crypto/bcrypt"
)

func main() {
	passwords := []string{
		"testpass123!",
		"mypassword456@",
		"secure789#test",
	}

	for i, password := range passwords {
		hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Printf("User %d password: %s\n", i+1, password)
		fmt.Printf("Hash: %s\n\n", string(hash))
	}
}
