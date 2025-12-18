package postgres

import (
	"context"
	"encoding/json"

	"github.com/jackc/pgx/v5/pgxpool"
)

type AuditRepository struct {
	db *pgxpool.Pool
}

func NewAuditRepository(db *pgxpool.Pool) *AuditRepository {
	return &AuditRepository{db: db}
}

func (r *AuditRepository) Log(ctx context.Context, userID, action, entityType, entityID string, changes interface{}) error {
	var changesJSON []byte
	if changes != nil {
		var err error
		changesJSON, err = json.Marshal(changes)
		if err != nil {
			return err
		}
	}

	var userIDUUID *string
	if userID != "" {
		userIDUUID = &userID
	}

	var entityIDUUID *string
	if entityID != "" {
		entityIDUUID = &entityID
	}

	_, err := r.db.Exec(ctx,
		`INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, changes)
		 VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)`,
		userIDUUID, action, entityType, entityIDUUID, changesJSON,
	)
	return err
}

