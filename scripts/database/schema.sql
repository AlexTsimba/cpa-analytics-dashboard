-- CPA Analytics Dashboard - PostgreSQL Schema
-- Based on Players CSV structure with 4048 rows, 33 columns

-- Players table - main analytics data
CREATE TABLE players (
    -- Primary identifiers
    player_id SERIAL PRIMARY KEY,
    original_player_id INTEGER,
    
    -- Temporal data
    sign_up_date TIMESTAMPTZ,
    first_deposit_date TIMESTAMPTZ,
    date_field TIMESTAMPTZ,  -- Generic date field from CSV
    
    -- Partner/Campaign tracking
    partner_id INTEGER,
    company_name VARCHAR(255),
    partners_email VARCHAR(255),
    partner_tags TEXT,
    campaign_id INTEGER,
    campaign_name VARCHAR(255),
    promo_id INTEGER,
    promo_code VARCHAR(100),
    
    -- Geographic data
    player_country CHAR(2), -- ISO country codes
    
    -- Tracking parameters
    tag_clickid VARCHAR(255),
    tag_os VARCHAR(50),
    tag_source VARCHAR(255),
    tag_sub2 VARCHAR(255),
    
    -- Player status flags
    prequalified INTEGER DEFAULT 0,
    duplicate INTEGER DEFAULT 0,
    self_excluded INTEGER DEFAULT 0,
    disabled INTEGER DEFAULT 0,
    
    -- Financial data
    currency CHAR(3), -- ISO currency codes
    ftd_count INTEGER DEFAULT 0,
    ftd_sum DECIMAL(12,2) DEFAULT 0.00,
    deposits_count INTEGER DEFAULT 0,
    deposits_sum DECIMAL(12,2) DEFAULT 0.00,
    cashouts_count INTEGER DEFAULT 0,
    cashouts_sum DECIMAL(12,2) DEFAULT 0.00,
    
    -- Gaming data
    casino_bets_count INTEGER DEFAULT 0,
    casino_real_ngr DECIMAL(12,2) DEFAULT 0.00,
    casino_bets_sum DECIMAL(12,2) DEFAULT 0.00,
    fixed_per_player INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indexes for analytics queries
CREATE INDEX idx_players_sign_up_date ON players(sign_up_date);
CREATE INDEX idx_players_first_deposit_date ON players(first_deposit_date);
CREATE INDEX idx_players_partner_id ON players(partner_id);
CREATE INDEX idx_players_campaign_id ON players(campaign_id);
CREATE INDEX idx_players_country ON players(player_country);
CREATE INDEX idx_players_currency ON players(currency);
CREATE INDEX idx_players_tag_source ON players(tag_source);

-- Composite indexes for common analytics queries
CREATE INDEX idx_players_partner_campaign ON players(partner_id, campaign_id);
CREATE INDEX idx_players_country_currency ON players(player_country, currency);
CREATE INDEX idx_players_date_range ON players(sign_up_date, first_deposit_date);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_players_updated_at 
    BEFORE UPDATE ON players 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Analytics views for common KPIs
CREATE VIEW player_kpis AS
SELECT 
    COUNT(*) as total_players,
    COUNT(CASE WHEN ftd_count > 0 THEN 1 END) as depositing_players,
    SUM(deposits_sum) as total_deposits,
    SUM(cashouts_sum) as total_cashouts,
    SUM(deposits_sum) - SUM(cashouts_sum) as net_revenue,
    AVG(CASE WHEN ftd_count > 0 THEN ftd_sum END) as avg_first_deposit,
    COUNT(DISTINCT partner_id) as active_partners,
    COUNT(DISTINCT campaign_id) as active_campaigns
FROM players;

CREATE VIEW partner_performance AS
SELECT 
    partner_id,
    company_name,
    COUNT(*) as player_count,
    COUNT(CASE WHEN ftd_count > 0 THEN 1 END) as depositing_players,
    SUM(deposits_sum) as total_deposits,
    SUM(casino_real_ngr) as total_ngr,
    ROUND(
        (COUNT(CASE WHEN ftd_count > 0 THEN 1 END)::DECIMAL / COUNT(*)) * 100, 
        2
    ) as conversion_rate
FROM players
WHERE partner_id IS NOT NULL
GROUP BY partner_id, company_name
ORDER BY total_deposits DESC;

CREATE VIEW campaign_performance AS
SELECT 
    campaign_id,
    campaign_name,
    COUNT(*) as player_count,
    COUNT(CASE WHEN ftd_count > 0 THEN 1 END) as depositing_players,
    SUM(deposits_sum) as total_deposits,
    SUM(casino_real_ngr) as total_ngr,
    ROUND(
        (COUNT(CASE WHEN ftd_count > 0 THEN 1 END)::DECIMAL / COUNT(*)) * 100, 
        2
    ) as conversion_rate
FROM players
WHERE campaign_id IS NOT NULL
GROUP BY campaign_id, campaign_name
ORDER BY total_deposits DESC;
