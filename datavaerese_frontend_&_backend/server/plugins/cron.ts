import { useScheduler } from '#scheduler'
import { DLSessionService } from '../services/dLSession.service'
import { successLog, errorLog } from '../logger'

export default defineNitroPlugin(() => {
  // Early return if build context
  if (process.env.APP_ENV === 'build') {
    console.log('[server/plugins/cron.ts] Skipping scheduler, in build context')
    return
  }

  try {
    const scheduler = useScheduler()
    
    // Auto-lock inactive sessions job
    // Runs on 26th of every month at 11 PM UTC
    // Cron expression: '0 23 26 * *'
    // Format: minute hour day-of-month month day-of-week
    scheduler.run(async () => {
      try {
        const startTime = Date.now()
        const startTimestamp = new Date().toISOString()
        successLog.info(`Auto-lock inactive sessions job started at ${startTimestamp}`)
        const result = await DLSessionService.autoLockInactiveSessions('system')
        
        const duration = Date.now() - startTime
        successLog.info(`Auto-lock job completed in ${duration}ms. ${result.message}`, {
          lockedCount: result.lockedCount,
          sessionIds: result.sessions.map(s => s.id),
        })
      } catch (error: any) {
        errorLog.error('Auto-lock inactive sessions job failed', {
          error: error.message,
          stack: error.stack,
        })
      }
    }).cron('0 23 26 * *', 'UTC')
    
    const initTimestamp = new Date().toISOString()
    successLog.info(`Cron jobs initialized at ${initTimestamp}: Auto-lock inactive sessions (26th of every month at 11 PM UTC)`)
  } catch (error) {
    console.error('Failed to initialize cron jobs:', error)
  }
})

