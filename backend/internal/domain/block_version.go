package domain

import "time"

type BlockVersion struct {
	ID        string                 `json:"id"`
	BlockID   string                 `json:"block_id"`
	Version   int                    `json:"version"`
	Type      string                 `json:"type"`
	Order     int                    `json:"order"`
	Data      map[string]interface{} `json:"data"`
	Status    string                 `json:"status"`
	CreatedAt time.Time              `json:"created_at"`
	CreatedBy string                 `json:"created_by,omitempty"`
}

