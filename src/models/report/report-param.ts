import commonFunction from '@/components/core/commons/CommonFunction'
import type { IReportParam } from './i-report-param'

export class ReportParam {
  constructor(report?: IReportParam) {
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      report as unknown as Record<string, unknown>,
    )
  }
  testIds?: Array<string> = []
  classIds?: Array<string> = []
}
