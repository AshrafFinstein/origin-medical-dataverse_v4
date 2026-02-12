
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  decompressFromBase64,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum
} = require('./runtime/index')


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

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
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


  const path = require('path')

const { findSync } = require('./runtime')
const fs = require('fs')

// some frameworks or bundlers replace or totally remove __dirname
const hasDirname = typeof __dirname !== 'undefined' && __dirname !== '/'

// will work in most cases, ie. if the client has not been bundled
const regularDirname = hasDirname && fs.existsSync(path.join(__dirname, 'schema.prisma')) && __dirname

// if the client has been bundled, we need to look for the folders
const foundDirname = !regularDirname && findSync(process.cwd(), [
    "data_migration_script\\generated\\dat_client",
    "generated\\dat_client",
], ['d'], ['d'], 1)[0]

const dirname = regularDirname || foundDirname || __dirname

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

const dmmfString = "{\"datamodel\":{\"enums\":[{\"name\":\"ExtractedResourceStatus\",\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"IN_REVIEW\",\"dbName\":null},{\"name\":\"REJECTED\",\"dbName\":null},{\"name\":\"ACCEPTED\",\"dbName\":null}],\"dbName\":null},{\"name\":\"ProjectUserRole\",\"values\":[{\"name\":\"NORMAL\",\"dbName\":null},{\"name\":\"LEAD_ANALYST\",\"dbName\":null},{\"name\":\"PROJECT_MASTER\",\"dbName\":null}],\"dbName\":null},{\"name\":\"SessionUserRole\",\"values\":[{\"name\":\"ACTIVITY\",\"dbName\":null},{\"name\":\"QUALITY_CONTROLLER\",\"dbName\":null}],\"dbName\":null}],\"models\":[{\"name\":\"CESession\",\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"priority\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sop\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"resultTemplate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"Project\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Project\",\"relationName\":\"CESessionToProject\",\"relationFromFields\":[\"projectId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ExtractedResourcesInCESessions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ExtractedResourcesInCESessions\",\"relationName\":\"CESessionToExtractedResourcesInCESessions\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"UsersInCESessions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UsersInCESessions\",\"relationName\":\"CESessionToUsersInCESessions\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"DLSession\",\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"priority\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sop\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"Project\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Project\",\"relationName\":\"DLSessionToProject\",\"relationFromFields\":[\"projectId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ExtractedResourcesInDLSessions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ExtractedResourcesInDLSessions\",\"relationName\":\"DLSessionToExtractedResourcesInDLSessions\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"LabelsInDLSessions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"LabelsInDLSessions\",\"relationName\":\"DLSessionToLabelsInDLSessions\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"UsersInDLSessions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UsersInDLSessions\",\"relationName\":\"DLSessionToUsersInDLSessions\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"Epic\",\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"Project\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Project\",\"relationName\":\"EpicToProject\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"ExtractedResource\",\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rawResourceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"RawResource\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RawResource\",\"relationName\":\"ExtractedResourceToRawResource\",\"relationFromFields\":[\"rawResourceId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ExtractedResourcesInCESessions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ExtractedResourcesInCESessions\",\"relationName\":\"ExtractedResourceToExtractedResourcesInCESessions\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ExtractedResourcesInDLSessions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ExtractedResourcesInDLSessions\",\"relationName\":\"ExtractedResourceToExtractedResourcesInDLSessions\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"ExtractedResourcesInCESessions\",\"dbName\":null,\"fields\":[{\"name\":\"extractedResourceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cESessionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"index\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ExtractedResourceStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"result\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"CESession\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CESession\",\"relationName\":\"CESessionToExtractedResourcesInCESessions\",\"relationFromFields\":[\"cESessionId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ExtractedResource\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ExtractedResource\",\"relationName\":\"ExtractedResourceToExtractedResourcesInCESessions\",\"relationFromFields\":[\"extractedResourceId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"extractedResourceId\",\"cESessionId\"]},\"uniqueFields\":[[\"cESessionId\",\"index\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"cESessionId\",\"index\"]}],\"isGenerated\":false},{\"name\":\"ExtractedResourcesInDLSessions\",\"dbName\":null,\"fields\":[{\"name\":\"extractedResourceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dLSessionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ExtractedResourceStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"DLSession\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DLSession\",\"relationName\":\"DLSessionToExtractedResourcesInDLSessions\",\"relationFromFields\":[\"dLSessionId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ExtractedResource\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ExtractedResource\",\"relationName\":\"ExtractedResourceToExtractedResourcesInDLSessions\",\"relationFromFields\":[\"extractedResourceId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"LabelsInExtractedResourcesInDLSessions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"LabelsInExtractedResourcesInDLSessions\",\"relationName\":\"ExtractedResourcesInDLSessionsToLabelsInExtractedResourcesInDLSessions\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"extractedResourceId\",\"dLSessionId\"]},\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"Label\",\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"abbreviation\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"LabelsInDLSessions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"LabelsInDLSessions\",\"relationName\":\"LabelToLabelsInDLSessions\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"LabelsInExtractedResourcesInDLSessions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"LabelsInExtractedResourcesInDLSessions\",\"relationName\":\"LabelToLabelsInExtractedResourcesInDLSessions\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"LabelsInDLSessions\",\"dbName\":null,\"fields\":[{\"name\":\"labelId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dLSessionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"DLSession\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DLSession\",\"relationName\":\"DLSessionToLabelsInDLSessions\",\"relationFromFields\":[\"dLSessionId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"Label\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Label\",\"relationName\":\"LabelToLabelsInDLSessions\",\"relationFromFields\":[\"labelId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"labelId\",\"dLSessionId\"]},\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"LabelsInExtractedResourcesInDLSessions\",\"dbName\":null,\"fields\":[{\"name\":\"labelId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"extractedResourceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dLSessionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ExtractedResourcesInDLSessions\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ExtractedResourcesInDLSessions\",\"relationName\":\"ExtractedResourcesInDLSessionsToLabelsInExtractedResourcesInDLSessions\",\"relationFromFields\":[\"extractedResourceId\",\"dLSessionId\"],\"relationToFields\":[\"extractedResourceId\",\"dLSessionId\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"Label\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Label\",\"relationName\":\"LabelToLabelsInExtractedResourcesInDLSessions\",\"relationFromFields\":[\"labelId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"labelId\",\"extractedResourceId\",\"dLSessionId\"]},\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"Patient\",\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"Visit\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Visit\",\"relationName\":\"PatientToVisit\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"Project\",\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"epicId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"Epic\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Epic\",\"relationName\":\"EpicToProject\",\"relationFromFields\":[\"epicId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"CESession\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CESession\",\"relationName\":\"CESessionToProject\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"DLSession\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DLSession\",\"relationName\":\"DLSessionToProject\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"RASession\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RASession\",\"relationName\":\"ProjectToRASession\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"UsersInProjects\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UsersInProjects\",\"relationName\":\"ProjectToUsersInProjects\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"RASession\",\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"priority\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sop\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"template\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"Project\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Project\",\"relationName\":\"ProjectToRASession\",\"relationFromFields\":[\"projectId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"UsersInRASessions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UsersInRASessions\",\"relationName\":\"RASessionToUsersInRASessions\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"VisitsInRASessions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"VisitsInRASessions\",\"relationName\":\"RASessionToVisitsInRASessions\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"RawResource\",\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"machine\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"center\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visitId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"Visit\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Visit\",\"relationName\":\"RawResourceToVisit\",\"relationFromFields\":[\"visitId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ExtractedResource\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ExtractedResource\",\"relationName\":\"ExtractedResourceToRawResource\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"UsersInCESessions\",\"dbName\":null,\"fields\":[{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cESessionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userRole\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SessionUserRole\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"CESession\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CESession\",\"relationName\":\"CESessionToUsersInCESessions\",\"relationFromFields\":[\"cESessionId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"userId\",\"cESessionId\",\"userRole\"]},\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"UsersInDLSessions\",\"dbName\":null,\"fields\":[{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dLSessionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userRole\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SessionUserRole\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"DLSession\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DLSession\",\"relationName\":\"DLSessionToUsersInDLSessions\",\"relationFromFields\":[\"dLSessionId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"userId\",\"dLSessionId\",\"userRole\"]},\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"UsersInProjects\",\"dbName\":null,\"fields\":[{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userRole\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ProjectUserRole\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"Project\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Project\",\"relationName\":\"ProjectToUsersInProjects\",\"relationFromFields\":[\"projectId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"userId\",\"projectId\",\"userRole\"]},\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"UsersInRASessions\",\"dbName\":null,\"fields\":[{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rASessionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userRole\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SessionUserRole\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"RASession\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RASession\",\"relationName\":\"RASessionToUsersInRASessions\",\"relationFromFields\":[\"rASessionId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"userId\",\"rASessionId\",\"userRole\"]},\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"Visit\",\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"Patient\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Patient\",\"relationName\":\"PatientToVisit\",\"relationFromFields\":[\"patientId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"RawResource\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RawResource\",\"relationName\":\"RawResourceToVisit\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"VisitsInRASessions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"VisitsInRASessions\",\"relationName\":\"VisitToVisitsInRASessions\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"VisitsInRASessions\",\"dbName\":null,\"fields\":[{\"name\":\"visitId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rASessionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"index\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"content\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ExtractedResourceStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"result\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"RASession\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RASession\",\"relationName\":\"RASessionToVisitsInRASessions\",\"relationFromFields\":[\"rASessionId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"Visit\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Visit\",\"relationName\":\"VisitToVisitsInRASessions\",\"relationFromFields\":[\"visitId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"visitId\",\"rASessionId\"]},\"uniqueFields\":[[\"rASessionId\",\"index\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"rASessionId\",\"index\"]}],\"isGenerated\":false}],\"types\":[]},\"mappings\":{\"modelOperations\":[{\"model\":\"CESession\",\"plural\":\"cESessions\",\"findUnique\":\"findUniqueCESession\",\"findFirst\":\"findFirstCESession\",\"findMany\":\"findManyCESession\",\"create\":\"createOneCESession\",\"createMany\":\"createManyCESession\",\"delete\":\"deleteOneCESession\",\"update\":\"updateOneCESession\",\"deleteMany\":\"deleteManyCESession\",\"updateMany\":\"updateManyCESession\",\"upsert\":\"upsertOneCESession\",\"aggregate\":\"aggregateCESession\",\"groupBy\":\"groupByCESession\"},{\"model\":\"DLSession\",\"plural\":\"dLSessions\",\"findUnique\":\"findUniqueDLSession\",\"findFirst\":\"findFirstDLSession\",\"findMany\":\"findManyDLSession\",\"create\":\"createOneDLSession\",\"createMany\":\"createManyDLSession\",\"delete\":\"deleteOneDLSession\",\"update\":\"updateOneDLSession\",\"deleteMany\":\"deleteManyDLSession\",\"updateMany\":\"updateManyDLSession\",\"upsert\":\"upsertOneDLSession\",\"aggregate\":\"aggregateDLSession\",\"groupBy\":\"groupByDLSession\"},{\"model\":\"Epic\",\"plural\":\"epics\",\"findUnique\":\"findUniqueEpic\",\"findFirst\":\"findFirstEpic\",\"findMany\":\"findManyEpic\",\"create\":\"createOneEpic\",\"createMany\":\"createManyEpic\",\"delete\":\"deleteOneEpic\",\"update\":\"updateOneEpic\",\"deleteMany\":\"deleteManyEpic\",\"updateMany\":\"updateManyEpic\",\"upsert\":\"upsertOneEpic\",\"aggregate\":\"aggregateEpic\",\"groupBy\":\"groupByEpic\"},{\"model\":\"ExtractedResource\",\"plural\":\"extractedResources\",\"findUnique\":\"findUniqueExtractedResource\",\"findFirst\":\"findFirstExtractedResource\",\"findMany\":\"findManyExtractedResource\",\"create\":\"createOneExtractedResource\",\"createMany\":\"createManyExtractedResource\",\"delete\":\"deleteOneExtractedResource\",\"update\":\"updateOneExtractedResource\",\"deleteMany\":\"deleteManyExtractedResource\",\"updateMany\":\"updateManyExtractedResource\",\"upsert\":\"upsertOneExtractedResource\",\"aggregate\":\"aggregateExtractedResource\",\"groupBy\":\"groupByExtractedResource\"},{\"model\":\"ExtractedResourcesInCESessions\",\"plural\":\"extractedResourcesInCESessions\",\"findUnique\":\"findUniqueExtractedResourcesInCESessions\",\"findFirst\":\"findFirstExtractedResourcesInCESessions\",\"findMany\":\"findManyExtractedResourcesInCESessions\",\"create\":\"createOneExtractedResourcesInCESessions\",\"createMany\":\"createManyExtractedResourcesInCESessions\",\"delete\":\"deleteOneExtractedResourcesInCESessions\",\"update\":\"updateOneExtractedResourcesInCESessions\",\"deleteMany\":\"deleteManyExtractedResourcesInCESessions\",\"updateMany\":\"updateManyExtractedResourcesInCESessions\",\"upsert\":\"upsertOneExtractedResourcesInCESessions\",\"aggregate\":\"aggregateExtractedResourcesInCESessions\",\"groupBy\":\"groupByExtractedResourcesInCESessions\"},{\"model\":\"ExtractedResourcesInDLSessions\",\"plural\":\"extractedResourcesInDLSessions\",\"findUnique\":\"findUniqueExtractedResourcesInDLSessions\",\"findFirst\":\"findFirstExtractedResourcesInDLSessions\",\"findMany\":\"findManyExtractedResourcesInDLSessions\",\"create\":\"createOneExtractedResourcesInDLSessions\",\"createMany\":\"createManyExtractedResourcesInDLSessions\",\"delete\":\"deleteOneExtractedResourcesInDLSessions\",\"update\":\"updateOneExtractedResourcesInDLSessions\",\"deleteMany\":\"deleteManyExtractedResourcesInDLSessions\",\"updateMany\":\"updateManyExtractedResourcesInDLSessions\",\"upsert\":\"upsertOneExtractedResourcesInDLSessions\",\"aggregate\":\"aggregateExtractedResourcesInDLSessions\",\"groupBy\":\"groupByExtractedResourcesInDLSessions\"},{\"model\":\"Label\",\"plural\":\"labels\",\"findUnique\":\"findUniqueLabel\",\"findFirst\":\"findFirstLabel\",\"findMany\":\"findManyLabel\",\"create\":\"createOneLabel\",\"createMany\":\"createManyLabel\",\"delete\":\"deleteOneLabel\",\"update\":\"updateOneLabel\",\"deleteMany\":\"deleteManyLabel\",\"updateMany\":\"updateManyLabel\",\"upsert\":\"upsertOneLabel\",\"aggregate\":\"aggregateLabel\",\"groupBy\":\"groupByLabel\"},{\"model\":\"LabelsInDLSessions\",\"plural\":\"labelsInDLSessions\",\"findUnique\":\"findUniqueLabelsInDLSessions\",\"findFirst\":\"findFirstLabelsInDLSessions\",\"findMany\":\"findManyLabelsInDLSessions\",\"create\":\"createOneLabelsInDLSessions\",\"createMany\":\"createManyLabelsInDLSessions\",\"delete\":\"deleteOneLabelsInDLSessions\",\"update\":\"updateOneLabelsInDLSessions\",\"deleteMany\":\"deleteManyLabelsInDLSessions\",\"updateMany\":\"updateManyLabelsInDLSessions\",\"upsert\":\"upsertOneLabelsInDLSessions\",\"aggregate\":\"aggregateLabelsInDLSessions\",\"groupBy\":\"groupByLabelsInDLSessions\"},{\"model\":\"LabelsInExtractedResourcesInDLSessions\",\"plural\":\"labelsInExtractedResourcesInDLSessions\",\"findUnique\":\"findUniqueLabelsInExtractedResourcesInDLSessions\",\"findFirst\":\"findFirstLabelsInExtractedResourcesInDLSessions\",\"findMany\":\"findManyLabelsInExtractedResourcesInDLSessions\",\"create\":\"createOneLabelsInExtractedResourcesInDLSessions\",\"createMany\":\"createManyLabelsInExtractedResourcesInDLSessions\",\"delete\":\"deleteOneLabelsInExtractedResourcesInDLSessions\",\"update\":\"updateOneLabelsInExtractedResourcesInDLSessions\",\"deleteMany\":\"deleteManyLabelsInExtractedResourcesInDLSessions\",\"updateMany\":\"updateManyLabelsInExtractedResourcesInDLSessions\",\"upsert\":\"upsertOneLabelsInExtractedResourcesInDLSessions\",\"aggregate\":\"aggregateLabelsInExtractedResourcesInDLSessions\",\"groupBy\":\"groupByLabelsInExtractedResourcesInDLSessions\"},{\"model\":\"Patient\",\"plural\":\"patients\",\"findUnique\":\"findUniquePatient\",\"findFirst\":\"findFirstPatient\",\"findMany\":\"findManyPatient\",\"create\":\"createOnePatient\",\"createMany\":\"createManyPatient\",\"delete\":\"deleteOnePatient\",\"update\":\"updateOnePatient\",\"deleteMany\":\"deleteManyPatient\",\"updateMany\":\"updateManyPatient\",\"upsert\":\"upsertOnePatient\",\"aggregate\":\"aggregatePatient\",\"groupBy\":\"groupByPatient\"},{\"model\":\"Project\",\"plural\":\"projects\",\"findUnique\":\"findUniqueProject\",\"findFirst\":\"findFirstProject\",\"findMany\":\"findManyProject\",\"create\":\"createOneProject\",\"createMany\":\"createManyProject\",\"delete\":\"deleteOneProject\",\"update\":\"updateOneProject\",\"deleteMany\":\"deleteManyProject\",\"updateMany\":\"updateManyProject\",\"upsert\":\"upsertOneProject\",\"aggregate\":\"aggregateProject\",\"groupBy\":\"groupByProject\"},{\"model\":\"RASession\",\"plural\":\"rASessions\",\"findUnique\":\"findUniqueRASession\",\"findFirst\":\"findFirstRASession\",\"findMany\":\"findManyRASession\",\"create\":\"createOneRASession\",\"createMany\":\"createManyRASession\",\"delete\":\"deleteOneRASession\",\"update\":\"updateOneRASession\",\"deleteMany\":\"deleteManyRASession\",\"updateMany\":\"updateManyRASession\",\"upsert\":\"upsertOneRASession\",\"aggregate\":\"aggregateRASession\",\"groupBy\":\"groupByRASession\"},{\"model\":\"RawResource\",\"plural\":\"rawResources\",\"findUnique\":\"findUniqueRawResource\",\"findFirst\":\"findFirstRawResource\",\"findMany\":\"findManyRawResource\",\"create\":\"createOneRawResource\",\"createMany\":\"createManyRawResource\",\"delete\":\"deleteOneRawResource\",\"update\":\"updateOneRawResource\",\"deleteMany\":\"deleteManyRawResource\",\"updateMany\":\"updateManyRawResource\",\"upsert\":\"upsertOneRawResource\",\"aggregate\":\"aggregateRawResource\",\"groupBy\":\"groupByRawResource\"},{\"model\":\"UsersInCESessions\",\"plural\":\"usersInCESessions\",\"findUnique\":\"findUniqueUsersInCESessions\",\"findFirst\":\"findFirstUsersInCESessions\",\"findMany\":\"findManyUsersInCESessions\",\"create\":\"createOneUsersInCESessions\",\"createMany\":\"createManyUsersInCESessions\",\"delete\":\"deleteOneUsersInCESessions\",\"update\":\"updateOneUsersInCESessions\",\"deleteMany\":\"deleteManyUsersInCESessions\",\"updateMany\":\"updateManyUsersInCESessions\",\"upsert\":\"upsertOneUsersInCESessions\",\"aggregate\":\"aggregateUsersInCESessions\",\"groupBy\":\"groupByUsersInCESessions\"},{\"model\":\"UsersInDLSessions\",\"plural\":\"usersInDLSessions\",\"findUnique\":\"findUniqueUsersInDLSessions\",\"findFirst\":\"findFirstUsersInDLSessions\",\"findMany\":\"findManyUsersInDLSessions\",\"create\":\"createOneUsersInDLSessions\",\"createMany\":\"createManyUsersInDLSessions\",\"delete\":\"deleteOneUsersInDLSessions\",\"update\":\"updateOneUsersInDLSessions\",\"deleteMany\":\"deleteManyUsersInDLSessions\",\"updateMany\":\"updateManyUsersInDLSessions\",\"upsert\":\"upsertOneUsersInDLSessions\",\"aggregate\":\"aggregateUsersInDLSessions\",\"groupBy\":\"groupByUsersInDLSessions\"},{\"model\":\"UsersInProjects\",\"plural\":\"usersInProjects\",\"findUnique\":\"findUniqueUsersInProjects\",\"findFirst\":\"findFirstUsersInProjects\",\"findMany\":\"findManyUsersInProjects\",\"create\":\"createOneUsersInProjects\",\"createMany\":\"createManyUsersInProjects\",\"delete\":\"deleteOneUsersInProjects\",\"update\":\"updateOneUsersInProjects\",\"deleteMany\":\"deleteManyUsersInProjects\",\"updateMany\":\"updateManyUsersInProjects\",\"upsert\":\"upsertOneUsersInProjects\",\"aggregate\":\"aggregateUsersInProjects\",\"groupBy\":\"groupByUsersInProjects\"},{\"model\":\"UsersInRASessions\",\"plural\":\"usersInRASessions\",\"findUnique\":\"findUniqueUsersInRASessions\",\"findFirst\":\"findFirstUsersInRASessions\",\"findMany\":\"findManyUsersInRASessions\",\"create\":\"createOneUsersInRASessions\",\"createMany\":\"createManyUsersInRASessions\",\"delete\":\"deleteOneUsersInRASessions\",\"update\":\"updateOneUsersInRASessions\",\"deleteMany\":\"deleteManyUsersInRASessions\",\"updateMany\":\"updateManyUsersInRASessions\",\"upsert\":\"upsertOneUsersInRASessions\",\"aggregate\":\"aggregateUsersInRASessions\",\"groupBy\":\"groupByUsersInRASessions\"},{\"model\":\"Visit\",\"plural\":\"visits\",\"findUnique\":\"findUniqueVisit\",\"findFirst\":\"findFirstVisit\",\"findMany\":\"findManyVisit\",\"create\":\"createOneVisit\",\"createMany\":\"createManyVisit\",\"delete\":\"deleteOneVisit\",\"update\":\"updateOneVisit\",\"deleteMany\":\"deleteManyVisit\",\"updateMany\":\"updateManyVisit\",\"upsert\":\"upsertOneVisit\",\"aggregate\":\"aggregateVisit\",\"groupBy\":\"groupByVisit\"},{\"model\":\"VisitsInRASessions\",\"plural\":\"visitsInRASessions\",\"findUnique\":\"findUniqueVisitsInRASessions\",\"findFirst\":\"findFirstVisitsInRASessions\",\"findMany\":\"findManyVisitsInRASessions\",\"create\":\"createOneVisitsInRASessions\",\"createMany\":\"createManyVisitsInRASessions\",\"delete\":\"deleteOneVisitsInRASessions\",\"update\":\"updateOneVisitsInRASessions\",\"deleteMany\":\"deleteManyVisitsInRASessions\",\"updateMany\":\"updateManyVisitsInRASessions\",\"upsert\":\"upsertOneVisitsInRASessions\",\"aggregate\":\"aggregateVisitsInRASessions\",\"groupBy\":\"groupByVisitsInRASessions\"}],\"otherOperations\":{\"read\":[],\"write\":[\"executeRaw\",\"queryRaw\"]}}}"
const dmmf = JSON.parse(dmmfString)
exports.Prisma.dmmf = JSON.parse(dmmfString)

/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "C:\\Work\\originhealth-ai\\dataverse\\data_migration_script\\generated\\dat_client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [],
    "previewFeatures": [],
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": "..\\..\\..\\.env",
    "schemaEnvPath": "..\\..\\..\\.env"
  },
  "relativePath": "..\\..",
  "clientVersion": "4.4.0",
  "engineVersion": "f352a33b70356f46311da8b00d83386dd9f145d6",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "dataProxy": false
}
config.document = dmmf
config.dirname = dirname




const { warnEnvConflicts } = require('./runtime/index')

warnEnvConflicts({
    rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(dirname, config.relativeEnvPaths.rootEnvPath),
    schemaEnvPath: config.relativeEnvPaths.schemaEnvPath && path.resolve(dirname, config.relativeEnvPaths.schemaEnvPath)
})

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

path.join(__dirname, "query_engine-windows.dll.node");
path.join(process.cwd(), "data_migration_script\\generated\\dat_client\\query_engine-windows.dll.node")
path.join(__dirname, "schema.prisma");
path.join(process.cwd(), "data_migration_script\\generated\\dat_client\\schema.prisma")
