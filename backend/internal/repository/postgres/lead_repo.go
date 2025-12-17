package postgres

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jaluzi-peterburg/backend/internal/domain"
)

type LeadRepository struct {
	db *pgxpool.Pool
}

func NewLeadRepository(db *pgxpool.Pool) *LeadRepository {
	return &LeadRepository{db: db}
}

func (r *LeadRepository) Create(ctx context.Context, lead *domain.Lead) error {
	lead.ID = uuid.New().String()
	_, err := r.db.Exec(ctx,
		`INSERT INTO leads (id, name, phone, email, message, page_url, status)
		 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		lead.ID, lead.Name, lead.Phone, lead.Email, lead.Message, lead.PageURL, lead.Status,
	)
	return err
}

func (r *LeadRepository) GetAll(ctx context.Context) ([]*domain.Lead, error) {
	rows, err := r.db.Query(ctx,
		`SELECT id, name, phone, email, message, page_url, status, created_at
		 FROM leads ORDER BY created_at DESC`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var leads []*domain.Lead
	for rows.Next() {
		var lead domain.Lead
		if err := rows.Scan(
			&lead.ID, &lead.Name, &lead.Phone, &lead.Email, &lead.Message,
			&lead.PageURL, &lead.Status, &lead.CreatedAt,
		); err != nil {
			return nil, err
		}
		leads = append(leads, &lead)
	}
	return leads, nil
}

func (r *LeadRepository) UpdateStatus(ctx context.Context, id, status string) error {
	_, err := r.db.Exec(ctx,
		`UPDATE leads SET status = $1 WHERE id = $2`,
		status, id,
	)
	return err
}

