/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import prisma from '../db';

export const findAll = async () => {
    const result: any[] = await prisma.$queryRaw`
    SELECT id, code, name, bbox, ST_AsGeoJSON(geom_simplified) as geom_simplified 
    FROM country 
    ORDER BY name`;

    const countries = result.map((country) => ({
        ...country,
        geom_simplified: country.geom_simplified ? JSON.parse(country.geom_simplified) : null,
    }));
    return { countries };
};

export const findOne = async (code: string) => {
    const result: any[] = await prisma.$queryRaw`
    SELECT id, code, name, bbox, ST_AsGeoJSON(geom_simplified) as geom_simplified 
    FROM country 
    WHERE code = ${code.toUpperCase()}`;

    if (result.length === 0) return null;

    return {
        ...result[0],
        geom_simplified: result[0].geom_simplified ? JSON.parse(result[0].geom_simplified) : null,
    };
};
