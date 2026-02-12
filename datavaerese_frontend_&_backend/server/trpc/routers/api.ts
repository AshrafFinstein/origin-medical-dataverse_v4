import { z } from "zod";
import { ApiService } from "~/server/services/api.service";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";


const findSessionDetails = z.object({
  dLSessionId: z.string().uuid(),
});

export type DLSessionFindSingleSessionInput = z.infer<typeof findSessionDetails>

export const apiService = router({
    
  getSessionData: protectedProcedure
  .input(findSessionDetails)
  .query(async ({ ctx, input }) => {
    const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin'
    const userId = ctx?.user.sub

    const sessionDetails = await ApiService.findSingleSession(
      input, 
      ctx.userViewAllPermission.session, 
      isAdmin,
      userId,
    );

    return {
      sessionDetails: {
        name: sessionDetails?.sessionName,
        patientCount: Number(sessionDetails?.patientCount), // Convert BigInt to number
        imageCount: Number(sessionDetails?.imageCount) // Convert BigInt to number
      }
    };
  }),

  getTaxonomyMasterData: protectedProcedure
  .query(async ({ ctx }) => {
    const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin';
    const userId = ctx?.user.sub;

    const result = await ApiService.findTaxonomyData(
      ctx.userViewAllPermission.session, 
      isAdmin, 
      userId
    );

    return {
      data: result.data,
      excelFile: result.excelFile,
      fileName: result.fileName
    };
  }),
  getLabelData: protectedProcedure
  .query(async ({ ctx }) => {
    const isAdmin = ctx?.user['https://www.originhealth.ai/roles']?.[0] === 'dataverse-admin';
    const userId = ctx?.user.sub;
    
    const result = await ApiService.getLabelData(
      ctx.userViewAllPermission.session, 
      userId
    );

    return {
      data: result.data,
      excelFile: result.excelFile,
      fileName: result.fileName
    };
  })


  
})
