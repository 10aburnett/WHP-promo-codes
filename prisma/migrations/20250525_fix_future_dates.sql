-- Fix any entries with future dates by setting them to the current time
UPDATE "OfferTracking"
SET "createdAt" = CURRENT_TIMESTAMP
WHERE "createdAt" > CURRENT_TIMESTAMP; 