package postgres

import (
	"context"
	"database/sql"
	"encoding/json"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jaluzi-peterburg/backend/internal/domain"
)

type BlockRepository struct {
	db *pgxpool.Pool
}

func NewBlockRepository(db *pgxpool.Pool) *BlockRepository {
	return &BlockRepository{db: db}
}

func (r *BlockRepository) GetByPageID(ctx context.Context, pageID string) ([]*domain.ContentBlock, error) {
	rows, err := r.db.Query(ctx,
		`SELECT id, page_id, type, order_index, data, status, version, created_at, updated_at
		 FROM content_blocks WHERE page_id = $1 ORDER BY order_index ASC`,
		pageID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var blocks []*domain.ContentBlock
	for rows.Next() {
		block, err := r.scanBlock(rows)
		if err != nil {
			return nil, err
		}
		blocks = append(blocks, block)
	}
	return blocks, nil
}

func (r *BlockRepository) GetByID(ctx context.Context, id string) (*domain.ContentBlock, error) {
	var block domain.ContentBlock
	var dataJSON []byte
	err := r.db.QueryRow(ctx,
		`SELECT id, page_id, type, order_index, data, status, version, created_at, updated_at
		 FROM content_blocks WHERE id = $1`,
		id,
	).Scan(
		&block.ID, &block.PageID, &block.Type, &block.Order, &dataJSON,
		&block.Status, &block.Version, &block.CreatedAt, &block.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	if err := json.Unmarshal(dataJSON, &block.Data); err != nil {
		return nil, err
	}
	return &block, nil
}

func (r *BlockRepository) Create(ctx context.Context, block *domain.ContentBlock) error {
	block.ID = uuid.New().String()
	dataJSON, _ := json.Marshal(block.Data)
	_, err := r.db.Exec(ctx,
		`INSERT INTO content_blocks (id, page_id, type, order_index, data, status, version)
		 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		block.ID, block.PageID, block.Type, block.Order, dataJSON, block.Status, block.Version,
	)
	return err
}

func (r *BlockRepository) Update(ctx context.Context, block *domain.ContentBlock) error {
	dataJSON, _ := json.Marshal(block.Data)
	_, err := r.db.Exec(ctx,
		`UPDATE content_blocks SET type = $1, order_index = $2, data = $3, status = $4, version = version + 1, updated_at = NOW()
		 WHERE id = $5`,
		block.Type, block.Order, dataJSON, block.Status, block.ID,
	)
	return err
}

func (r *BlockRepository) Delete(ctx context.Context, id string) error {
	_, err := r.db.Exec(ctx, `DELETE FROM content_blocks WHERE id = $1`, id)
	return err
}

func (r *BlockRepository) scanBlock(rows interface {
	Scan(dest ...interface{}) error
}) (*domain.ContentBlock, error) {
	var block domain.ContentBlock
	var dataJSON []byte
	if err := rows.Scan(
		&block.ID, &block.PageID, &block.Type, &block.Order, &dataJSON,
		&block.Status, &block.Version, &block.CreatedAt, &block.UpdatedAt,
	); err != nil {
		return nil, err
	}
	if err := json.Unmarshal(dataJSON, &block.Data); err != nil {
		return nil, err
	}
	return &block, nil
}

