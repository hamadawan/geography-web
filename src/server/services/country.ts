/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import prisma from '../db';
import { unstable_cache } from 'next/cache';

export const findAll = unstable_cache(
    async () => {
        const result: any[] = await prisma.$queryRaw`
        SELECT id, code, name, bbox, ST_AsGeoJSON(geom_simplified) as geom_simplified 
        FROM country 
        ORDER BY name`;

        const countries = result.map((country) => ({
            ...country,
            geom_simplified: country.geom_simplified ? JSON.parse(country.geom_simplified) : null,
        }));
        return { countries };
    },
    ['countries-all'],
    { revalidate: 86400, tags: ['countries'] }
);

export const findOne = (code: string) => unstable_cache(
    async () => {
        const result: any[] = await prisma.$queryRaw`
        SELECT id, code, name, bbox, ST_AsGeoJSON(geom_simplified) as geom_simplified 
        FROM country 
        WHERE code = ${code.toUpperCase()}`;

        if (result.length === 0) return null;

        return {
            ...result[0],
            geom_simplified: result[0].geom_simplified ? JSON.parse(result[0].geom_simplified) : null,
        };
    },
    [`country-${code.toUpperCase()}`],
    { revalidate: 86400, tags: ['countries', `country-${code.toUpperCase()}`] }
)();
