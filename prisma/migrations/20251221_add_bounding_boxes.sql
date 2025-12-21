-- Add bbox columns to store bounding boxes as JSON arrays [minLon, minLat, maxLon, maxLat]

-- Add bbox column to country table
ALTER TABLE country ADD COLUMN IF NOT EXISTS bbox JSONB;

-- Add bbox column to states table
ALTER TABLE states ADD COLUMN IF NOT EXISTS bbox JSONB;

-- Add bbox column to postal_code table
ALTER TABLE postal_code ADD COLUMN IF NOT EXISTS bbox JSONB;

-- Populate bbox for country table
UPDATE country
SET bbox = jsonb_build_array(
    ST_XMin(ST_Envelope(geom_simplified)),
    ST_YMin(ST_Envelope(geom_simplified)),
    ST_XMax(ST_Envelope(geom_simplified)),
    ST_YMax(ST_Envelope(geom_simplified))
)
WHERE geom_simplified IS NOT NULL;

-- Populate bbox for states table
UPDATE states
SET bbox = jsonb_build_array(
    ST_XMin(ST_Envelope(geom_simplified)),
    ST_YMin(ST_Envelope(geom_simplified)),
    ST_XMax(ST_Envelope(geom_simplified)),
    ST_YMax(ST_Envelope(geom_simplified))
)
WHERE geom_simplified IS NOT NULL;

-- Populate bbox for postal_code table
UPDATE postal_code
SET bbox = jsonb_build_array(
    ST_XMin(ST_Envelope(geom_simplified)),
    ST_YMin(ST_Envelope(geom_simplified)),
    ST_XMax(ST_Envelope(geom_simplified)),
    ST_YMax(ST_Envelope(geom_simplified))
)
WHERE geom_simplified IS NOT NULL;
