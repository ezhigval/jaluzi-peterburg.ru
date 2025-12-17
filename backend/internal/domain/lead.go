package domain

import "time"

type Lead struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Phone     string    `json:"phone"`
	Email     string    `json:"email,omitempty"`
	Message   string    `json:"message,omitempty"`
	PageURL   string    `json:"page_url,omitempty"`
	Status    string    `json:"status"` // new, contacted, converted, rejected
	CreatedAt time.Time `json:"created_at"`
}

