package domain

import "time"

type Page struct {
	ID          string    `json:"id"`
	Slug        string    `json:"slug"`
	Title       string    `json:"title"`
	MetaTitle   string    `json:"meta_title,omitempty"`
	MetaDesc    string    `json:"meta_description,omitempty"`
	Status      string    `json:"status"` // draft, published
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type ContentBlock struct {
	ID        string    `json:"id"`
	PageID    string    `json:"page_id"`
	Type      string    `json:"type"` // hero, text, cta, gallery, etc.
	Order     int       `json:"order"`
	Data      map[string]interface{} `json:"data"`
	Status    string    `json:"status"` // draft, published
	Version   int       `json:"version"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

