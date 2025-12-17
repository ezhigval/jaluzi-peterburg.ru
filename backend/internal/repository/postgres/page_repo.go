package postgres

import (
	"context"
	"database/sql"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jaluzi-peterburg/backend/internal/domain"
)

type PageRepository struct {
	db *pgxpool.Pool
}

func NewPageRepository(db *pgxpool.Pool) *PageRepository {
	return &PageRepository{db: db}
}

func (r *PageRepository) GetBySlug(ctx context.Context, slug string) (*domain.Page, error) {
	var page domain.Page
	err := r.db.QueryRow(ctx,
		`SELECT id, slug, title, meta_title, meta_description, status, created_at, updated_at
		 FROM pages WHERE slug = $1`,
		slug,
	).Scan(
		&page.ID, &page.Slug, &page.Title, &page.MetaTitle, &page.MetaDesc,
		&page.Status, &page.CreatedAt, &page.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &page, nil
}

func (r *PageRepository) GetAll(ctx context.Context) ([]*domain.Page, error) {
	rows, err := r.db.Query(ctx,
		`SELECT id, slug, title, meta_title, meta_description, status, created_at, updated_at
		 FROM pages ORDER BY created_at DESC`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var pages []*domain.Page
	for rows.Next() {
		var page domain.Page
		if err := rows.Scan(
			&page.ID, &page.Slug, &page.Title, &page.MetaTitle, &page.MetaDesc,
			&page.Status, &page.CreatedAt, &page.UpdatedAt,
		); err != nil {
			return nil, err
		}
		pages = append(pages, &page)
	}
	return pages, nil
}

func (r *PageRepository) Create(ctx context.Context, page *domain.Page) error {
	page.ID = uuid.New().String()
	_, err := r.db.Exec(ctx,
		`INSERT INTO pages (id, slug, title, meta_title, meta_description, status)
		 VALUES ($1, $2, $3, $4, $5, $6)`,
		page.ID, page.Slug, page.Title, page.MetaTitle, page.MetaDesc, page.Status,
	)
	return err
}

func (r *PageRepository) Update(ctx context.Context, page *domain.Page) error {
	_, err := r.db.Exec(ctx,
		`UPDATE pages SET slug = $1, title = $2, meta_title = $3, meta_description = $4, status = $5, updated_at = NOW()
		 WHERE id = $6`,
		page.Slug, page.Title, page.MetaTitle, page.MetaDesc, page.Status, page.ID,
	)
	return err
}

