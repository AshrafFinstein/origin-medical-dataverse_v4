import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { db } from '../infrastructures/database'
import ExcelJS from 'exceljs'

type DLSessionFindSessionDetails = {
    dLSessionId: string
}

export class ApiService {
    static async findSingleSession(input: DLSessionFindSessionDetails, canViewAll: boolean, isAdmin: boolean, userId: string | undefined) {
    
        if (!userId) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
    
        const query = Prisma.sql`
            WITH SessionData AS (
                SELECT 
                    ds.name AS "sessionName",
                    (
                        SELECT COUNT(DISTINCT p.id)
                        FROM "ExtractedResourcesInDLSessions" erdls
                        JOIN "ExtractedResource" er ON er.id = erdls."extractedResourceId"
                        JOIN "RawResource" rr ON rr.id = er."rawResourceId"
                        JOIN "Visit" v ON v.id = rr."visitId"
                        JOIN "Patient" p ON p.id = v."patientId"
                        WHERE erdls."dLSessionId" = ds.id
                        AND ds."deletedAt" IS NULL
                    ) AS "patientCount",
                    (
                        SELECT COUNT(DISTINCT erdls."extractedResourceId")
                        FROM "ExtractedResourcesInDLSessions" erdls
                        WHERE erdls."dLSessionId" = ds.id
                    ) AS "imageCount"
                FROM "DLSession" ds
                WHERE ds.id = ${input.dLSessionId}
                AND ds."deletedAt" IS NULL
                AND (
                    ${canViewAll} -- If user has global view permission, allow
                    OR EXISTS (
                        SELECT 1 
                        FROM "UsersInDLSessions" uids 
                        WHERE uids."dLSessionId" = ds.id 
                    )
                )
            )
            SELECT 
                "sessionName",
                "patientCount",
                "imageCount"
            FROM SessionData;
        `;
        
        try {
            const result = await db.$queryRaw<Array<{
                sessionName: string;
                patientCount: number;
                imageCount: number;
            }>>(query);
    
            if (!result || result.length === 0) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Session not found or user does not have access'
                });
            }
    
            return result[0];
        } catch (error) {    
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to fetch session details'
            });
        }
    }

    static async findTaxonomyData(
        canViewAll: boolean, 
        isAdmin: boolean, 
        userId: string | undefined
    ) {
    
        if (!userId) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
    
        const query = Prisma.sql`
            SELECT a."name", a."id", tt."id" as "taxonomyTypeId", a."abbreviation", tt."name" as "taxonomyTypeName",a."createdAt",a."updatedAt",a."updatedBy"
            FROM "Annotation" a
            JOIN "TaxonomyType" tt ON tt."id" = a."taxonomyTypeId"
            WHERE a."deletedAt" IS NULL
        `;

        try {
            const results: any[] = await db.$queryRaw(query);
            
            // Create a new Excel workbook
            const workbook = new ExcelJS.Workbook()
            const worksheet = workbook.addWorksheet('Taxonomy Data')
            
            // Set column headers
            worksheet.columns = [
                { header: 'Annotation ID', key: 'annotationId', width: 30 },
                { header: 'Annotation Name', key: 'annotationName', width: 30 },
                { header: 'Annotation Abbreviation', key: 'annotationAbbreviation', width: 25 },
                { header: 'Taxonomy Type Name', key: 'taxonomyTypeName', width: 25 },
                { header: 'TaxonomyType ID', key: 'taxonomyId', width: 30 },
                { header: 'Created At', key: 'createdAt', width: 25 },
                { header: 'Updated At', key: 'updatedAt', width: 25 },
                { header: 'Updated By', key: 'updatedBy', width: 25 }
            ]
            
            // Style the header row
            worksheet.getRow(1).font = { bold: true }
            worksheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE0E0E0' }
            }
            
            // Add data rows
            results.forEach((row: any) => {
                worksheet.addRow({
                    annotationId: row.id,
                    annotationName: row.name,
                    annotationAbbreviation: row.abbreviation,
                    taxonomyTypeName: row.taxonomyTypeName,
                    taxonomyId: row.taxonomyTypeId,
                    createdAt: row.createdAt,
                    updatedAt: row.updatedAt,
                    updatedBy: row.updatedBy
                })
            })
            
            // Generate Excel buffer
            const buffer = await workbook.xlsx.writeBuffer()
            
            // Convert buffer to base64 for transmission
            const base64 = Buffer.from(buffer).toString('base64')
            
            return {
                data: results,
                excelFile: base64,
                fileName: 'taxonomy_data.xlsx'
            }
        } catch (error) {    
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to fetch taxonomy data'
            });
        }
    }
    
    static async getLabelData(
        canViewAll: boolean, 
        userId: string | undefined
    ) {
        const query = Prisma.sql`
            SELECT 
                l."id",
                l."name",
                l."abbreviation",
                l."createdAt",
                l."updatedAt"
            FROM "Label" l
        `;
    
        try {
            const results: any[] = await db.$queryRaw(query);
            
            // Create a new Excel workbook
            const workbook = new ExcelJS.Workbook()
            const worksheet = workbook.addWorksheet('Labels Data')
            
            // Set column headers
            worksheet.columns = [
                { header: 'Label ID', key: 'labelId', width: 30 },
                { header: 'Label Name', key: 'labelName', width: 30 },
                { header: 'Abbreviation', key: 'abbreviation', width: 25 },
                { header: 'Created At', key: 'createdAt', width: 25 },
                { header: 'Updated At', key: 'updatedAt', width: 25 }
            ]
            
            // Style the header row
            worksheet.getRow(1).font = { bold: true }
            worksheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE0E0E0' }
            }
            
            // Add data rows
            results.forEach((row: any) => {
                worksheet.addRow({
                    labelId: row.id,
                    labelName: row.name,
                    abbreviation: row.abbreviation || '',
                    createdAt: row.createdAt,
                    updatedAt: row.updatedAt
                })
            })
            
            // Generate Excel buffer
            const buffer = await workbook.xlsx.writeBuffer()
            
            // Convert buffer to base64 for transmission
            const base64 = Buffer.from(buffer).toString('base64')
            
            return {
                data: results,
                excelFile: base64,
                fileName: 'labels_data.xlsx'
            }
        } catch (error) {
            console.error("🚨 Database Query Error:", error);
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: `Failed to fetch labels${error instanceof Error ? `: ${error.message}` : ''}`
            });
        }
    }
}




