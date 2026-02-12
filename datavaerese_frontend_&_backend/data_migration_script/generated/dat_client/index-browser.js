
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum
} = require('./runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma

/**
 * Prisma Client JS version: 4.4.0
 * Query Engine version: f352a33b70356f46311da8b00d83386dd9f145d6
 */
Prisma.prismaVersion = {
  client: "4.4.0",
  engine: "f352a33b70356f46311da8b00d83386dd9f145d6"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.NotFoundError = () => {
  throw new Error(`NotFoundError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = () => (val) => val

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */
// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
function makeEnum(x) { return x; }

exports.Prisma.CESessionScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  name: 'name',
  description: 'description',
  priority: 'priority',
  sop: 'sop',
  resultTemplate: 'resultTemplate',
  projectId: 'projectId'
});

exports.Prisma.DLSessionScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  name: 'name',
  description: 'description',
  priority: 'priority',
  sop: 'sop',
  projectId: 'projectId'
});

exports.Prisma.EpicScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  name: 'name',
  description: 'description'
});

exports.Prisma.ExtractedResourceScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  metadata: 'metadata',
  rawResourceId: 'rawResourceId'
});

exports.Prisma.ExtractedResourcesInCESessionsScalarFieldEnum = makeEnum({
  extractedResourceId: 'extractedResourceId',
  cESessionId: 'cESessionId',
  index: 'index',
  status: 'status',
  result: 'result'
});

exports.Prisma.ExtractedResourcesInDLSessionsScalarFieldEnum = makeEnum({
  extractedResourceId: 'extractedResourceId',
  dLSessionId: 'dLSessionId',
  status: 'status'
});

exports.Prisma.JsonNullValueFilter = makeEnum({
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
});

exports.Prisma.JsonNullValueInput = makeEnum({
  JsonNull: Prisma.JsonNull
});

exports.Prisma.LabelScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  name: 'name',
  abbreviation: 'abbreviation'
});

exports.Prisma.LabelsInDLSessionsScalarFieldEnum = makeEnum({
  labelId: 'labelId',
  dLSessionId: 'dLSessionId'
});

exports.Prisma.LabelsInExtractedResourcesInDLSessionsScalarFieldEnum = makeEnum({
  labelId: 'labelId',
  extractedResourceId: 'extractedResourceId',
  dLSessionId: 'dLSessionId'
});

exports.Prisma.PatientScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.ProjectScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  name: 'name',
  description: 'description',
  epicId: 'epicId'
});

exports.Prisma.QueryMode = makeEnum({
  default: 'default',
  insensitive: 'insensitive'
});

exports.Prisma.RASessionScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  name: 'name',
  description: 'description',
  priority: 'priority',
  sop: 'sop',
  template: 'template',
  projectId: 'projectId'
});

exports.Prisma.RawResourceScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  metadata: 'metadata',
  machine: 'machine',
  center: 'center',
  visitId: 'visitId'
});

exports.Prisma.SortOrder = makeEnum({
  asc: 'asc',
  desc: 'desc'
});

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UsersInCESessionsScalarFieldEnum = makeEnum({
  userId: 'userId',
  cESessionId: 'cESessionId',
  userRole: 'userRole'
});

exports.Prisma.UsersInDLSessionsScalarFieldEnum = makeEnum({
  userId: 'userId',
  dLSessionId: 'dLSessionId',
  userRole: 'userRole'
});

exports.Prisma.UsersInProjectsScalarFieldEnum = makeEnum({
  userId: 'userId',
  projectId: 'projectId',
  userRole: 'userRole'
});

exports.Prisma.UsersInRASessionsScalarFieldEnum = makeEnum({
  userId: 'userId',
  rASessionId: 'rASessionId',
  userRole: 'userRole'
});

exports.Prisma.VisitScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  patientId: 'patientId'
});

exports.Prisma.VisitsInRASessionsScalarFieldEnum = makeEnum({
  visitId: 'visitId',
  rASessionId: 'rASessionId',
  index: 'index',
  content: 'content',
  status: 'status',
  result: 'result'
});
exports.ExtractedResourceStatus = makeEnum({
  PENDING: 'PENDING',
  IN_REVIEW: 'IN_REVIEW',
  REJECTED: 'REJECTED',
  ACCEPTED: 'ACCEPTED'
});

exports.ProjectUserRole = makeEnum({
  NORMAL: 'NORMAL',
  LEAD_ANALYST: 'LEAD_ANALYST',
  PROJECT_MASTER: 'PROJECT_MASTER'
});

exports.SessionUserRole = makeEnum({
  ACTIVITY: 'ACTIVITY',
  QUALITY_CONTROLLER: 'QUALITY_CONTROLLER'
});

exports.Prisma.ModelName = makeEnum({
  CESession: 'CESession',
  DLSession: 'DLSession',
  Epic: 'Epic',
  ExtractedResource: 'ExtractedResource',
  ExtractedResourcesInCESessions: 'ExtractedResourcesInCESessions',
  ExtractedResourcesInDLSessions: 'ExtractedResourcesInDLSessions',
  Label: 'Label',
  LabelsInDLSessions: 'LabelsInDLSessions',
  LabelsInExtractedResourcesInDLSessions: 'LabelsInExtractedResourcesInDLSessions',
  Patient: 'Patient',
  Project: 'Project',
  RASession: 'RASession',
  RawResource: 'RawResource',
  UsersInCESessions: 'UsersInCESessions',
  UsersInDLSessions: 'UsersInDLSessions',
  UsersInProjects: 'UsersInProjects',
  UsersInRASessions: 'UsersInRASessions',
  Visit: 'Visit',
  VisitsInRASessions: 'VisitsInRASessions'
});

/**
 * Create the Client
 */
class PrismaClient {
  constructor() {
    throw new Error(
      `PrismaClient is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
    )
  }
}
exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
