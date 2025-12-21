/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import prisma from '../db';
import { Prisma } from '@prisma/client';

export const findAll = async (page: number = 1, limit: number = 100, countryCode?: string, paginate: boolean = true) => {
    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = parseInt(String(limit), 10) || 100;
    const offset = (pageNum - 1) * limitNum;

    const whereClause = countryCode
        ? (Prisma as any).sql`WHERE country_code = ${countryCode}`
        : (Prisma as any).empty;

    const paginationClause = paginate
        ? (Prisma as any).sql`LIMIT ${limitNum}::int OFFSET ${offset}::int`
        : (Prisma as any).empty;

    const states: any[] = await prisma.$queryRaw`
    SELECT id, code, country_code, name, ST_AsGeoJSON(geom_simplified) as geom_simplified 
    FROM states
    ${whereClause}
    ORDER BY name
    ${paginationClause}`;

    const parsedStates = states.map(state => ({
        ...state,
        geom_simplified: state.geom_simplified ? JSON.parse(state.geom_simplified) : null
    }));

    if (!paginate) {
        return {
            states: parsedStates,
            total: parsedStates.length,
        };
    }

    const totalStates: any[] = await prisma.$queryRaw`
    SELECT COUNT(*) as count FROM states ${whereClause}`;

    return {
        states: parsedStates,
        total: Number(totalStates?.[0]?.count),
        page: pageNum,
        limit: limitNum,
    };
};

export const findOne = async (code: string) => {
    const result: any[] = await prisma.$queryRaw`
    SELECT id, code, country_code, name, ST_AsGeoJSON(geom_simplified) as geom_simplified 
    FROM states
    WHERE code = ${code}`;

    return result.map(state => ({
        ...state,
        geom_simplified: state.geom_simplified ? JSON.parse(state.geom_simplified) : null
    }));
};

export const create = async (data: any) => {
    return prisma.$queryRaw`
    INSERT INTO states (code, country_code, name, geom) 
    VALUES (${data.code}, ${data.country_code}, ${data.name}, ST_ForcePolygonCCW(ST_GeomFromGeoJSON(${data.geom})))
    RETURNING id, code, country_code, name, ST_AsGeoJSON(geom) as geom`;
};

export const update = async (code: string, data: any) => {
    return prisma.$queryRaw`
    UPDATE states
    SET country_code = ${data.country_code}, name = ${data.name}, geom = ST_ForcePolygonCCW(ST_GeomFromGeoJSON(${data.geom}))
    WHERE code = ${code}
    RETURNING id, code, country_code, name, ST_AsGeoJSON(geom) as geom`;
};

export const remove = async (id: number) => {
    return prisma.$queryRaw`
    DELETE FROM states WHERE id = ${id} RETURNING id, code, country_code, name`;
};
