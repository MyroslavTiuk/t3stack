# Prisma migrations

**NOTE**: As we are not "live" yet, we can easily change the schema and "squash" migrations into a single one to avoid conflicting migration files.

## Backtester

This migration can be manually added to create a view that follows the price of the same option over time

```sql
CREATE materialized view "PriceHistory" AS
SELECT "expiration", "strikePrice", json_agg(
    json_build_object(
		'date', "date",
        'bidPrice', "bidPrice",
		'stockPrice',  "stockPrice",
        )) AS history
FROM "OptionHistory"
GROUP BY ("expiration", "strikePrice");

CREATE INDEX expiry_strike_history on "PriceHistory"("expiration", "strikePrice");
```
