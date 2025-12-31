const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateBboxes() {
    console.log('Starting bounding box updates...');

    try {
        // Update Country Bounding Boxes
        console.log('Updating country bounding boxes...');
        const countryResult = await prisma.$executeRaw`
      UPDATE country
      SET bbox = jsonb_build_array(
        ST_XMin(ST_Envelope(geom)),
        ST_YMin(ST_Envelope(geom)),
        ST_XMax(ST_Envelope(geom)),
        ST_YMax(ST_Envelope(geom))
      )
      WHERE geom IS NOT NULL;
    `;
        console.log(`Updated ${countryResult} countries.`);

        // Update States Bounding Boxes
        console.log('Updating states bounding boxes...');
        const statesResult = await prisma.$executeRaw`
      UPDATE states
      SET bbox = jsonb_build_array(
        ST_XMin(ST_Envelope(geom)),
        ST_YMin(ST_Envelope(geom)),
        ST_XMax(ST_Envelope(geom)),
        ST_YMax(ST_Envelope(geom))
      )
      WHERE geom IS NOT NULL;
    `;
        console.log(`Updated ${statesResult} states.`);

        // Update Postal Code Bounding Boxes
        console.log('Updating postal_code bounding boxes...');
        const postalCodeResult = await prisma.$executeRaw`
      UPDATE postal_code
      SET bbox = jsonb_build_array(
        ST_XMin(ST_Envelope(geom)),
        ST_YMin(ST_Envelope(geom)),
        ST_XMax(ST_Envelope(geom)),
        ST_YMax(ST_Envelope(geom))
      )
      WHERE geom IS NOT NULL;
    `;
        console.log(`Updated ${postalCodeResult} postal codes.`);

        console.log('Bounding box updates completed successfully.');
    } catch (error) {
        console.error('Error updating bounding boxes:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateBboxes().catch(console.error);
