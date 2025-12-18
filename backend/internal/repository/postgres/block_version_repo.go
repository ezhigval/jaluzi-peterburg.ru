package postgres

import (
	"context"
	"database/sql"
	"encoding/json"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jaluzi-peterburg/backend/internal/domain"
)

type BlockVersionRepository struct {
	db *pgxpool.Pool
}

func NewBlockVersionRepository(db *pgxpool.Pool) *BlockVersionRepository {
	return &BlockVersionRepository{db: db}
}

func (r *BlockVersionRepository) SaveVersion(ctx context.Context, version *domain.BlockVersion) error {
	version.ID = uuid.New().String()
	dataJSON, _ := json.Marshal(version.Data)
	
	var createdBy *string
	if version.CreatedBy != "" {
		createdBy = &version.CreatedBy
	}
	
	_, err := r.db.Exec(ctx,
		`INSERT INTO block_versions (id, block_id, version, type, order_index, data, status, created_by)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
		version.ID, version.BlockID, version.Version, version.Type, version.Order,
		dataJSON, version.Status, createdBy,
	)
	return err
}

func (r *BlockVersionRepository) GetVersions(ctx context.Context, blockID string) ([]*domain.BlockVersion, error) {
	rows, err := r.db.Query(ctx,
		`SELECT id, block_id, version, type, order_index, data, status, created_at, created_by
		 FROM block_versions WHERE block_id = $1 ORDER BY version DESC`,
		blockID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var versions []*domain.BlockVersion
	for rows.Next() {
		var version domain.BlockVersion
		var dataJSON []byte
		var createdBy sql.NullString
		
		if err := rows.Scan(
			&version.ID, &version.BlockID, &version.Version, &version.Type, &version.Order,
			&dataJSON, &version.Status, &version.CreatedAt, &createdBy,
		); err != nil {
			return nil, err
		}
		
		if err := json.Unmarshal(dataJSON, &version.Data); err != nil {
			return nil, err
		}
		
		if createdBy.Valid {
			version.CreatedBy = createdBy.String
		}
		
		versions = append(versions, &version)
	}
	return versions, nil
}

func (r *BlockVersionRepository) GetVersion(ctx context.Context, blockID string, version int) (*domain.BlockVersion, error) {
	var v domain.BlockVersion
	var dataJSON []byte
	var createdBy sql.NullString
	
	err := r.db.QueryRow(ctx,
		`SELECT id, block_id, version, type, order_index, data, status, created_at, created_by
		 FROM block_versions WHERE block_id = $1 AND version = $2`,
		blockID, version,
	).Scan(
		&v.ID, &v.BlockID, &v.Version, &v.Type, &v.Order, &dataJSON, &v.Status, &v.CreatedAt, &createdBy,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	
	if err := json.Unmarshal(dataJSON, &v.Data); err != nil {
		return nil, err
	}
	
	if createdBy.Valid {
		v.CreatedBy = createdBy.String
	}
	
	return &v, nil
}

