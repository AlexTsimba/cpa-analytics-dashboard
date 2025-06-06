/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/prefer-promise-reject-errors */
// CSV to PostgreSQL Migration Utility
// For importing Players CSV data into Digital Ocean PostgreSQL

import postgres from 'postgres';
import fs from 'fs';
import { parse } from 'csv-parse';

type PlayerCSVRow = {
  'Player ID': string;
  'Original player ID': string;
  'Sign up date': string;
  'First deposit date': string;
  Date: string;
  'Partner ID': string;
  'Company name': string;
  'Partners email': string;
  'Partner tags': string;
  'Campaign ID': string;
  'Campaign name': string;
  'Promo ID': string;
  'Promo code': string;
  'Player country': string;
  'Tag: clickid': string;
  'Tag: os': string;
  'Tag: source': string;
  'Tag: sub2': string;
  Prequalified: string;
  Duplicate: string;
  'Self-excluded': string;
  Disabled: string;
  Currency: string;
  'FTD count': string;
  'FTD sum': string;
  'Deposits count': string;
  'Deposits sum': string;
  'Cashouts count': string;
  'Cashouts sum': string;
  'Casino bets count': string;
  'Casino Real NGR': string;
  'Fixed per player': string;
  'Casino bets sum': string;
};

type PlayerRecord = {
  original_player_id: number | null;
  sign_up_date: Date | null;
  first_deposit_date: Date | null;
  date_field: Date | null;
  partner_id: number | null;
  company_name: string | null;
  partners_email: string | null;
  partner_tags: string | null;
  campaign_id: number | null;
  campaign_name: string | null;
  promo_id: number | null;
  promo_code: string | null;
  player_country: string | null;
  tag_clickid: string | null;
  tag_os: string | null;
  tag_source: string | null;
  tag_sub2: string | null;
  prequalified: number;
  duplicate: number;
  self_excluded: number;
  disabled: number;
  currency: string | null;
  ftd_count: number;
  ftd_sum: number;
  deposits_count: number;
  deposits_sum: number;
  cashouts_count: number;
  cashouts_sum: number;
  casino_bets_count: number;
  casino_real_ngr: number;
  fixed_per_player: number;
  casino_bets_sum: number;
};

class CSVMigrator {
  private sql: postgres.Sql;

  constructor(databaseUrl: string) {
    this.sql = postgres(databaseUrl, {
      ssl: { rejectUnauthorized: false }, // Digital Ocean managed databases
      max: 10,
      idle_timeout: 20,
      connect_timeout: 30,
    });
  }

  private parseDate(dateString: string): Date | null {
    if (!dateString || dateString.trim() === '') return null;

    // Try various date formats common in CSV exports
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date;
      }
    } catch (_error) {
      console.warn(`Could not parse date: ${dateString}`);
    }

    return null;
  }

  private parseNumber(value: string): number {
    if (!value || value.trim() === '') return 0;

    // Remove currency symbols and commas
    const cleaned = value.replace(/[,$€£¥]/g, '');
    const parsed = parseFloat(cleaned);

    return isNaN(parsed) ? 0 : parsed;
  }

  private parseInteger(value: string): number {
    if (!value || value.trim() === '') return 0;

    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 0 : parsed;
  }

  private transformRow(row: PlayerCSVRow): PlayerRecord {
    return {
      original_player_id: this.parseInteger(row['Original player ID']) || null,
      sign_up_date: this.parseDate(row['Sign up date']),
      first_deposit_date: this.parseDate(row['First deposit date']),
      date_field: this.parseDate(row['Date']),
      partner_id: this.parseInteger(row['Partner ID']) || null,
      company_name: row['Company name'] || null,
      partners_email: row['Partners email'] || null,
      partner_tags: row['Partner tags'] || null,
      campaign_id: this.parseInteger(row['Campaign ID']) || null,
      campaign_name: row['Campaign name'] || null,
      promo_id: this.parseInteger(row['Promo ID']) || null,
      promo_code: row['Promo code'] || null,
      player_country: row['Player country'] || null,
      tag_clickid: row['Tag: clickid'] || null,
      tag_os: row['Tag: os'] || null,
      tag_source: row['Tag: source'] || null,
      tag_sub2: row['Tag: sub2'] || null,
      prequalified: this.parseInteger(row['Prequalified']),
      duplicate: this.parseInteger(row['Duplicate']),
      self_excluded: this.parseInteger(row['Self-excluded']),
      disabled: this.parseInteger(row['Disabled']),
      currency: row['Currency'] || null,
      ftd_count: this.parseInteger(row['FTD count']),
      ftd_sum: this.parseNumber(row['FTD sum']),
      deposits_count: this.parseInteger(row['Deposits count']),
      deposits_sum: this.parseNumber(row['Deposits sum']),
      cashouts_count: this.parseInteger(row['Cashouts count']),
      cashouts_sum: this.parseNumber(row['Cashouts sum']),
      casino_bets_count: this.parseInteger(row['Casino bets count']),
      casino_real_ngr: this.parseNumber(row['Casino Real NGR']),
      fixed_per_player: this.parseInteger(row['Fixed per player']),
      casino_bets_sum: this.parseNumber(row['Casino bets sum']),
    };
  }

  async migrateCSV(filePath: string): Promise<void> {
    console.warn(`Starting migration from ${filePath}...`);

    // Read and parse CSV
    const records: PlayerRecord[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(
          parse({
            delimiter: ',',
            columns: true,
            skip_empty_lines: true,
            trim: true,
          })
        )
        .on('data', (row: PlayerCSVRow) => {
          try {
            const record = this.transformRow(row);
            records.push(record);
          } catch (_error) {
            console.error('Error transforming row:', _error);
          }
        })
        .on('error', reject)
        .on('end', async () => {
          try {
            console.warn(
              `Parsed ${records.length} records, inserting into database...`
            );

            // Batch insert for performance
            const batchSize = 1000;
            let inserted = 0;

            for (let i = 0; i < records.length; i += batchSize) {
              const batch = records.slice(i, i + batchSize);

              await this.sql`
                INSERT INTO players ${this.sql(
                  batch,
                  'original_player_id',
                  'sign_up_date',
                  'first_deposit_date',
                  'date_field',
                  'partner_id',
                  'company_name',
                  'partners_email',
                  'partner_tags',
                  'campaign_id',
                  'campaign_name',
                  'promo_id',
                  'promo_code',
                  'player_country',
                  'tag_clickid',
                  'tag_os',
                  'tag_source',
                  'tag_sub2',
                  'prequalified',
                  'duplicate',
                  'self_excluded',
                  'disabled',
                  'currency',
                  'ftd_count',
                  'ftd_sum',
                  'deposits_count',
                  'deposits_sum',
                  'cashouts_count',
                  'cashouts_sum',
                  'casino_bets_count',
                  'casino_real_ngr',
                  'fixed_per_player',
                  'casino_bets_sum'
                )}
              `;

              inserted += batch.length;
              console.warn(`Inserted ${inserted}/${records.length} records...`);
            }

            console.warn('Migration completed successfully!');
            resolve();
          } catch (error) {
            reject(error);
          }
        });
    });
  }

  async validateMigration(): Promise<void> {
    console.warn('Validating migration...');

    const stats = await this.sql`
      SELECT 
        COUNT(*) as total_players,
        COUNT(CASE WHEN ftd_count > 0 THEN 1 END) as depositing_players,
        SUM(deposits_sum) as total_deposits,
        COUNT(DISTINCT partner_id) as unique_partners,
        COUNT(DISTINCT campaign_id) as unique_campaigns,
        MIN(sign_up_date) as earliest_signup,
        MAX(sign_up_date) as latest_signup
      FROM players
    `;

    console.warn('Migration Statistics:', stats[0]);
  }

  async close(): Promise<void> {
    await this.sql.end();
  }
}

// Usage example
export async function runMigration(csvFilePath: string, databaseUrl: string) {
  const migrator = new CSVMigrator(databaseUrl);

  try {
    await migrator.migrateCSV(csvFilePath);
    await migrator.validateMigration();
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await migrator.close();
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const csvPath = process.argv[2];
  const dbUrl = process.env.DATABASE_URL;

  if (!csvPath || !dbUrl) {
    console.error('Usage: node migrate.js <csv-file-path>');
    console.error('Ensure DATABASE_URL environment variable is set');
    process.exit(1);
  }

  runMigration(csvPath, dbUrl).catch(console.error);
}
