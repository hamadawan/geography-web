/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import prisma from '../db';
import { Prisma } from '@prisma/client';

export const findAll = async (page: number = 1, limit: number = 10, stateCode?: string, paginate: boolean = true) => {
    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = parseInt(String(limit), 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    const whereClause = stateCode
        ? (Prisma as any).sql`WHERE physical_state = ${stateCode}`
        : (Prisma as any).empty;

    const paginationClause = paginate
        ? (Prisma as any).sql`LIMIT ${limitNum}::int OFFSET ${offset}::int`
        : (Prisma as any).empty;

    const postalCodes: any[] = await prisma.$queryRaw`
    SELECT id, code, country_code, ST_AsGeoJSON(geom_simplified) as geom_simplified 
    FROM postal_code 
    ${whereClause}
    ORDER BY code
    ${paginationClause}`;

    const parsedPostalCodes = postalCodes.map(pc => ({
        ...pc,
        geom_simplified: pc.geom_simplified ? JSON.parse(pc.geom_simplified) : null
    }));

    if (!paginate) {
        return {
            postalCodes: parsedPostalCodes,
            total: parsedPostalCodes.length,
        };
    }

    const totalPostalCodes: any[] = await prisma.$queryRaw`
    SELECT COUNT(*) as count FROM postal_code ${whereClause}`;

    return {
        postalCodes: parsedPostalCodes,
        total: Number(totalPostalCodes[0].count),
        page: pageNum,
        limit: limitNum,
    };
};

export const findOne = async (code: string) => {
    const result: any[] = await prisma.$queryRaw`
    SELECT id, code, country_code, ST_AsGeoJSON(geom_simplified) as geom_simplified 
    FROM postal_code 
    WHERE code = ${code}`;

    return result.map(pc => ({
        ...pc,
        geom_simplified: pc.geom_simplified ? JSON.parse(pc.geom_simplified) : null
    }));
};

export const create = async (data: any) => {
    return prisma.$queryRaw`
    INSERT INTO postal_code (code, country_code, geom) 
    VALUES (${data.code}, ${data.country_code}, ST_GeomFromGeoJSON(${data.geom})) 
    RETURNING id, code, country_code, ST_AsGeoJSON(geom) as geom`;
};

export const update = async (code: string, data: any) => {
    return prisma.$queryRaw`
    UPDATE postal_code 
    SET country_code = ${data.country_code}, geom = ST_GeomFromGeoJSON(${data.geom})
    WHERE code = ${code}
    RETURNING id, code, country_code, ST_AsGeoJSON(geom) as geom`;
};

export const remove = async (id: number) => {
    return prisma.$queryRaw`
    DELETE FROM postal_code WHERE id = ${id} RETURNING id, code, country_code`;
};
