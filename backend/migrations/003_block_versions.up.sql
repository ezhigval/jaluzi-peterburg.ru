-- Таблица для истории версий блоков
CREATE TABLE block_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_id UUID NOT NULL REFERENCES content_blocks(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  order_index INTEGER NOT NULL,
  data JSONB NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_block_versions_block_id ON block_versions(block_id);
CREATE INDEX idx_block_versions_version ON block_versions(block_id, version);

