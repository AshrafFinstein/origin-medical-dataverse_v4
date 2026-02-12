
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
    "data_migration_script\\generated\\dep_client",
    "generated\\dep_client",
], ['d'], ['d'], 1)[0]

const dirname = regularDirname || foundDirname || __dirname

/**
 * Enums
 */
// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
function makeEnum(x) { return x; }

exports.Prisma.Alembic_versionScalarFieldEnum = makeEnum({
  version_num: 'version_num'
});

exports.Prisma.Extracted_resource_labelsScalarFieldEnum = makeEnum({
  extracted_resource_id: 'extracted_resource_id',
  label_id: 'label_id'
});

exports.Prisma.Extracted_resourcesScalarFieldEnum = makeEnum({
  id: 'id',
  created_at: 'created_at',
  updated_at: 'updated_at',
  resource_path: 'resource_path',
  filetype: 'filetype',
  feature: 'feature',
  raw_resource_id: 'raw_resource_id',
  patient_id: 'patient_id',
  session_id: 'session_id'
});

exports.Prisma.JsonNullValueFilter = makeEnum({
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
});

exports.Prisma.LabelsScalarFieldEnum = makeEnum({
  id: 'id',
  created_at: 'created_at',
  updated_at: 'updated_at',
  name: 'name',
  abbreviation: 'abbreviation'
});

exports.Prisma.NullableJsonNullValueInput = makeEnum({
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
});

exports.Prisma.QueryMode = makeEnum({
  default: 'default',
  insensitive: 'insensitive'
});

exports.Prisma.Session_labelsScalarFieldEnum = makeEnum({
  session_id: 'session_id',
  label_id: 'label_id'
});

exports.Prisma.SessionsScalarFieldEnum = makeEnum({
  id: 'id',
  created_at: 'created_at',
  updated_at: 'updated_at',
  name: 'name',
  description: 'description',
  user_id: 'user_id'
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
exports.resourcetype = makeEnum({
  DICOM: 'DICOM',
  PDF: 'PDF',
  ZIP: 'ZIP',
  IMAGE: 'IMAGE'
});

exports.Prisma.ModelName = makeEnum({
  alembic_version: 'alembic_version',
  extracted_resource_labels: 'extracted_resource_labels',
  extracted_resources: 'extracted_resources',
  labels: 'labels',
  session_labels: 'session_labels',
  sessions: 'sessions'
});

const dmmfString = "{\"datamodel\":{\"enums\":[{\"name\":\"resourcetype\",\"values\":[{\"name\":\"DICOM\",\"dbName\":null},{\"name\":\"PDF\",\"dbName\":null},{\"name\":\"ZIP\",\"dbName\":null},{\"name\":\"IMAGE\",\"dbName\":null}],\"dbName\":null}],\"models\":[{\"name\":\"alembic_version\",\"dbName\":null,\"fields\":[{\"name\":\"version_num\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"extracted_resource_labels\",\"dbName\":null,\"fields\":[{\"name\":\"extracted_resource_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"label_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"extracted_resources\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"extracted_resources\",\"relationName\":\"extracted_resource_labelsToextracted_resources\",\"relationFromFields\":[\"extracted_resource_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"NoAction\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"labels\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"labels\",\"relationName\":\"extracted_resource_labelsTolabels\",\"relationFromFields\":[\"label_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"NoAction\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"extracted_resource_id\",\"label_id\"]},\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"extracted_resources\",\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"resource_path\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"filetype\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"resourcetype\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"feature\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"raw_resource_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patient_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"session_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sessions\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"sessions\",\"relationName\":\"extracted_resourcesTosessions\",\"relationFromFields\":[\"session_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"NoAction\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"extracted_resource_labels\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"extracted_resource_labels\",\"relationName\":\"extracted_resource_labelsToextracted_resources\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"resource_path\",\"session_id\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"resource_path\",\"session_id\"]}],\"isGenerated\":false},{\"name\":\"labels\",\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"abbreviation\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"extracted_resource_labels\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"extracted_resource_labels\",\"relationName\":\"extracted_resource_labelsTolabels\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"session_labels\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"session_labels\",\"relationName\":\"labelsTosession_labels\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"session_labels\",\"dbName\":null,\"fields\":[{\"name\":\"session_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"label_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"labels\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"labels\",\"relationName\":\"labelsTosession_labels\",\"relationFromFields\":[\"label_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"NoAction\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sessions\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"sessions\",\"relationName\":\"session_labelsTosessions\",\"relationFromFields\":[\"session_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"NoAction\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"session_id\",\"label_id\"]},\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"sessions\",\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"extracted_resources\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"extracted_resources\",\"relationName\":\"extracted_resourcesTosessions\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"session_labels\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"session_labels\",\"relationName\":\"session_labelsTosessions\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"name\",\"user_id\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"name\",\"user_id\"]}],\"isGenerated\":false}],\"types\":[]},\"mappings\":{\"modelOperations\":[{\"model\":\"alembic_version\",\"plural\":\"alembic_versions\",\"findUnique\":\"findUniquealembic_version\",\"findFirst\":\"findFirstalembic_version\",\"findMany\":\"findManyalembic_version\",\"create\":\"createOnealembic_version\",\"createMany\":\"createManyalembic_version\",\"delete\":\"deleteOnealembic_version\",\"update\":\"updateOnealembic_version\",\"deleteMany\":\"deleteManyalembic_version\",\"updateMany\":\"updateManyalembic_version\",\"upsert\":\"upsertOnealembic_version\",\"aggregate\":\"aggregatealembic_version\",\"groupBy\":\"groupByalembic_version\"},{\"model\":\"extracted_resource_labels\",\"plural\":\"extracted_resource_labels\",\"findUnique\":\"findUniqueextracted_resource_labels\",\"findFirst\":\"findFirstextracted_resource_labels\",\"findMany\":\"findManyextracted_resource_labels\",\"create\":\"createOneextracted_resource_labels\",\"createMany\":\"createManyextracted_resource_labels\",\"delete\":\"deleteOneextracted_resource_labels\",\"update\":\"updateOneextracted_resource_labels\",\"deleteMany\":\"deleteManyextracted_resource_labels\",\"updateMany\":\"updateManyextracted_resource_labels\",\"upsert\":\"upsertOneextracted_resource_labels\",\"aggregate\":\"aggregateextracted_resource_labels\",\"groupBy\":\"groupByextracted_resource_labels\"},{\"model\":\"extracted_resources\",\"plural\":\"extracted_resources\",\"findUnique\":\"findUniqueextracted_resources\",\"findFirst\":\"findFirstextracted_resources\",\"findMany\":\"findManyextracted_resources\",\"create\":\"createOneextracted_resources\",\"createMany\":\"createManyextracted_resources\",\"delete\":\"deleteOneextracted_resources\",\"update\":\"updateOneextracted_resources\",\"deleteMany\":\"deleteManyextracted_resources\",\"updateMany\":\"updateManyextracted_resources\",\"upsert\":\"upsertOneextracted_resources\",\"aggregate\":\"aggregateextracted_resources\",\"groupBy\":\"groupByextracted_resources\"},{\"model\":\"labels\",\"plural\":\"labels\",\"findUnique\":\"findUniquelabels\",\"findFirst\":\"findFirstlabels\",\"findMany\":\"findManylabels\",\"create\":\"createOnelabels\",\"createMany\":\"createManylabels\",\"delete\":\"deleteOnelabels\",\"update\":\"updateOnelabels\",\"deleteMany\":\"deleteManylabels\",\"updateMany\":\"updateManylabels\",\"upsert\":\"upsertOnelabels\",\"aggregate\":\"aggregatelabels\",\"groupBy\":\"groupBylabels\"},{\"model\":\"session_labels\",\"plural\":\"session_labels\",\"findUnique\":\"findUniquesession_labels\",\"findFirst\":\"findFirstsession_labels\",\"findMany\":\"findManysession_labels\",\"create\":\"createOnesession_labels\",\"createMany\":\"createManysession_labels\",\"delete\":\"deleteOnesession_labels\",\"update\":\"updateOnesession_labels\",\"deleteMany\":\"deleteManysession_labels\",\"updateMany\":\"updateManysession_labels\",\"upsert\":\"upsertOnesession_labels\",\"aggregate\":\"aggregatesession_labels\",\"groupBy\":\"groupBysession_labels\"},{\"model\":\"sessions\",\"plural\":\"sessions\",\"findUnique\":\"findUniquesessions\",\"findFirst\":\"findFirstsessions\",\"findMany\":\"findManysessions\",\"create\":\"createOnesessions\",\"createMany\":\"createManysessions\",\"delete\":\"deleteOnesessions\",\"update\":\"updateOnesessions\",\"deleteMany\":\"deleteManysessions\",\"updateMany\":\"updateManysessions\",\"upsert\":\"upsertOnesessions\",\"aggregate\":\"aggregatesessions\",\"groupBy\":\"groupBysessions\"}],\"otherOperations\":{\"read\":[],\"write\":[\"executeRaw\",\"queryRaw\"]}}}"
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
      "value": "C:\\Work\\originhealth-ai\\dataverse\\data_migration_script\\generated\\dep_client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows"
      },
      {
        "fromEnvVar": null,
        "value": "windows"
      }
    ],
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
path.join(process.cwd(), "data_migration_script\\generated\\dep_client\\query_engine-windows.dll.node")
path.join(__dirname, "schema.prisma");
path.join(process.cwd(), "data_migration_script\\generated\\dep_client\\schema.prisma")
