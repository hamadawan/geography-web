#!/usr/bin/env ts-node

const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function importCountries() {
  const geojson = JSON.parse(
    fs.readFileSync('data/geojson/countries.geojson', 'utf8')
  );

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const feature of geojson.features) {
    const props = feature.properties || {};
    const geometry = feature.geometry;
    const bbox = feature.bbox || null;

    const code = props.ISO_A2 || props.ADM0_A3 || props.SOV_A3;
    const name = props.NAME || props.ADMIN;

    if (!code || code === '-99' || code.length > 2) {
      skipped++;
      continue;
    }

    try {
      const existing = await prisma.$queryRaw`SELECT id FROM country WHERE code = ${code}`;

      if (existing.length > 0) {
        await prisma.$executeRaw`
          UPDATE country
          SET
            name = ${name},
            geom = ST_GeomFromGeoJSON(${JSON.stringify(geometry)}),
            geom_simplified = ST_Simplify(
              ST_GeomFromGeoJSON(${JSON.stringify(geometry)}),
              0.01
            ),
            bbox = COALESCE(
              ${bbox ? JSON.stringify(bbox) : null}::jsonb,
              jsonb_build_array(
                ST_XMin(ST_Envelope(ST_GeomFromGeoJSON(${JSON.stringify(geometry)}))),
                ST_YMin(ST_Envelope(ST_GeomFromGeoJSON(${JSON.stringify(geometry)}))),
                ST_XMax(ST_Envelope(ST_GeomFromGeoJSON(${JSON.stringify(geometry)}))),
                ST_YMax(ST_Envelope(ST_GeomFromGeoJSON(${JSON.stringify(geometry)})))
              )
            )
          WHERE code = ${code}
        `;
      } else {
        await prisma.$executeRaw`
          INSERT INTO country (code, name, geom, geom_simplified, bbox)
          VALUES (
            ${code},
            ${name},
            ST_GeomFromGeoJSON(${JSON.stringify(geometry)}),
            ST_Simplify(
              ST_GeomFromGeoJSON(${JSON.stringify(geometry)}),
              0.01
            ),
            COALESCE(
              ${bbox ? JSON.stringify(bbox) : null}::jsonb,
              jsonb_build_array(
                ST_XMin(ST_Envelope(ST_GeomFromGeoJSON(${JSON.stringify(geometry)}))),
                ST_YMin(ST_Envelope(ST_GeomFromGeoJSON(${JSON.stringify(geometry)}))),
                ST_XMax(ST_Envelope(ST_GeomFromGeoJSON(${JSON.stringify(geometry)}))),
                ST_YMax(ST_Envelope(ST_GeomFromGeoJSON(${JSON.stringify(geometry)})))
              )
            )
          )
        `;
      }

      imported++;
    } catch (err) {
      console.error(`Error importing ${name} (${code})`, err.message);
      errors++;
    }
  }

  await prisma.$disconnect();

  console.log('\n=== Import Summary ===');
  console.log(`Imported: ${imported}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Errors: ${errors}`);
  console.log(`Total: ${geojson.features.length}`);
}

importCountries().catch(console.error);
