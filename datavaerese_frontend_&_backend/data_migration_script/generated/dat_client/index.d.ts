
/**
 * Client
**/

import * as runtime from './runtime/index';
declare const prisma: unique symbol
export type PrismaPromise<A> = Promise<A> & {[prisma]: true}
type UnwrapPromise<P extends any> = P extends Promise<infer R> ? R : P
type UnwrapTuple<Tuple extends readonly unknown[]> = {
  [K in keyof Tuple]: K extends `${number}` ? Tuple[K] extends PrismaPromise<infer X> ? X : UnwrapPromise<Tuple[K]> : UnwrapPromise<Tuple[K]>
};


/**
 * Model CESession
 * 
 */
export type CESession = {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string
  priority: number
  sop: string[]
  resultTemplate: Prisma.JsonValue
  projectId: string
}

/**
 * Model DLSession
 * 
 */
export type DLSession = {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string
  priority: number
  sop: string[]
  projectId: string
}

/**
 * Model Epic
 * 
 */
export type Epic = {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string
}

/**
 * Model ExtractedResource
 * 
 */
export type ExtractedResource = {
  id: string
  createdAt: Date
  updatedAt: Date
  metadata: Prisma.JsonValue
  rawResourceId: string
}

/**
 * Model ExtractedResourcesInCESessions
 * 
 */
export type ExtractedResourcesInCESessions = {
  extractedResourceId: string
  cESessionId: string
  index: number
  status: ExtractedResourceStatus
  result: Prisma.JsonValue
}

/**
 * Model ExtractedResourcesInDLSessions
 * 
 */
export type ExtractedResourcesInDLSessions = {
  extractedResourceId: string
  dLSessionId: string
  status: ExtractedResourceStatus
}

/**
 * Model Label
 * 
 */
export type Label = {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  abbreviation: string
}

/**
 * Model LabelsInDLSessions
 * 
 */
export type LabelsInDLSessions = {
  labelId: string
  dLSessionId: string
}

/**
 * Model LabelsInExtractedResourcesInDLSessions
 * 
 */
export type LabelsInExtractedResourcesInDLSessions = {
  labelId: string
  extractedResourceId: string
  dLSessionId: string
}

/**
 * Model Patient
 * 
 */
export type Patient = {
  id: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Model Project
 * 
 */
export type Project = {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string
  epicId: string
}

/**
 * Model RASession
 * 
 */
export type RASession = {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string
  priority: number
  sop: string[]
  template: Prisma.JsonValue
  projectId: string
}

/**
 * Model RawResource
 * 
 */
export type RawResource = {
  id: string
  createdAt: Date
  updatedAt: Date
  metadata: Prisma.JsonValue
  machine: string
  center: string
  visitId: string
}

/**
 * Model UsersInCESessions
 * 
 */
export type UsersInCESessions = {
  userId: string
  cESessionId: string
  userRole: SessionUserRole
}

/**
 * Model UsersInDLSessions
 * 
 */
export type UsersInDLSessions = {
  userId: string
  dLSessionId: string
  userRole: SessionUserRole
}

/**
 * Model UsersInProjects
 * 
 */
export type UsersInProjects = {
  userId: string
  projectId: string
  userRole: ProjectUserRole
}

/**
 * Model UsersInRASessions
 * 
 */
export type UsersInRASessions = {
  userId: string
  rASessionId: string
  userRole: SessionUserRole
}

/**
 * Model Visit
 * 
 */
export type Visit = {
  id: string
  createdAt: Date
  updatedAt: Date
  patientId: string
}

/**
 * Model VisitsInRASessions
 * 
 */
export type VisitsInRASessions = {
  visitId: string
  rASessionId: string
  index: number
  content: Prisma.JsonValue
  status: ExtractedResourceStatus
  result: Prisma.JsonValue
}


/**
 * Enums
 */

// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

export const ExtractedResourceStatus: {
  PENDING: 'PENDING',
  IN_REVIEW: 'IN_REVIEW',
  REJECTED: 'REJECTED',
  ACCEPTED: 'ACCEPTED'
};

export type ExtractedResourceStatus = (typeof ExtractedResourceStatus)[keyof typeof ExtractedResourceStatus]


export const ProjectUserRole: {
  NORMAL: 'NORMAL',
  LEAD_ANALYST: 'LEAD_ANALYST',
  PROJECT_MASTER: 'PROJECT_MASTER'
};

export type ProjectUserRole = (typeof ProjectUserRole)[keyof typeof ProjectUserRole]


export const SessionUserRole: {
  ACTIVITY: 'ACTIVITY',
  QUALITY_CONTROLLER: 'QUALITY_CONTROLLER'
};

export type SessionUserRole = (typeof SessionUserRole)[keyof typeof SessionUserRole]


/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more CESessions
 * const cESessions = await prisma.cESession.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  GlobalReject extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined = 'rejectOnNotFound' extends keyof T
    ? T['rejectOnNotFound']
    : false
      > {
      /**
       * @private
       */
      private fetcher;
      /**
       * @private
       */
      private readonly dmmf;
      /**
       * @private
       */
      private connectionPromise?;
      /**
       * @private
       */
      private disconnectionPromise?;
      /**
       * @private
       */
      private readonly engineConfig;
      /**
       * @private
       */
      private readonly measurePerformance;

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more CESessions
   * const cESessions = await prisma.cESession.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends (U | 'beforeExit')>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : V extends 'beforeExit' ? () => Promise<void> : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<void>;

  /**
   * Add a middleware
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<UnwrapTuple<P>>;

      /**
   * `prisma.cESession`: Exposes CRUD operations for the **CESession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CESessions
    * const cESessions = await prisma.cESession.findMany()
    * ```
    */
  get cESession(): Prisma.CESessionDelegate<GlobalReject>;

  /**
   * `prisma.dLSession`: Exposes CRUD operations for the **DLSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DLSessions
    * const dLSessions = await prisma.dLSession.findMany()
    * ```
    */
  get dLSession(): Prisma.DLSessionDelegate<GlobalReject>;

  /**
   * `prisma.epic`: Exposes CRUD operations for the **Epic** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Epics
    * const epics = await prisma.epic.findMany()
    * ```
    */
  get epic(): Prisma.EpicDelegate<GlobalReject>;

  /**
   * `prisma.extractedResource`: Exposes CRUD operations for the **ExtractedResource** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExtractedResources
    * const extractedResources = await prisma.extractedResource.findMany()
    * ```
    */
  get extractedResource(): Prisma.ExtractedResourceDelegate<GlobalReject>;

  /**
   * `prisma.extractedResourcesInCESessions`: Exposes CRUD operations for the **ExtractedResourcesInCESessions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExtractedResourcesInCESessions
    * const extractedResourcesInCESessions = await prisma.extractedResourcesInCESessions.findMany()
    * ```
    */
  get extractedResourcesInCESessions(): Prisma.ExtractedResourcesInCESessionsDelegate<GlobalReject>;

  /**
   * `prisma.extractedResourcesInDLSessions`: Exposes CRUD operations for the **ExtractedResourcesInDLSessions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExtractedResourcesInDLSessions
    * const extractedResourcesInDLSessions = await prisma.extractedResourcesInDLSessions.findMany()
    * ```
    */
  get extractedResourcesInDLSessions(): Prisma.ExtractedResourcesInDLSessionsDelegate<GlobalReject>;

  /**
   * `prisma.label`: Exposes CRUD operations for the **Label** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Labels
    * const labels = await prisma.label.findMany()
    * ```
    */
  get label(): Prisma.LabelDelegate<GlobalReject>;

  /**
   * `prisma.labelsInDLSessions`: Exposes CRUD operations for the **LabelsInDLSessions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LabelsInDLSessions
    * const labelsInDLSessions = await prisma.labelsInDLSessions.findMany()
    * ```
    */
  get labelsInDLSessions(): Prisma.LabelsInDLSessionsDelegate<GlobalReject>;

  /**
   * `prisma.labelsInExtractedResourcesInDLSessions`: Exposes CRUD operations for the **LabelsInExtractedResourcesInDLSessions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LabelsInExtractedResourcesInDLSessions
    * const labelsInExtractedResourcesInDLSessions = await prisma.labelsInExtractedResourcesInDLSessions.findMany()
    * ```
    */
  get labelsInExtractedResourcesInDLSessions(): Prisma.LabelsInExtractedResourcesInDLSessionsDelegate<GlobalReject>;

  /**
   * `prisma.patient`: Exposes CRUD operations for the **Patient** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Patients
    * const patients = await prisma.patient.findMany()
    * ```
    */
  get patient(): Prisma.PatientDelegate<GlobalReject>;

  /**
   * `prisma.project`: Exposes CRUD operations for the **Project** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Projects
    * const projects = await prisma.project.findMany()
    * ```
    */
  get project(): Prisma.ProjectDelegate<GlobalReject>;

  /**
   * `prisma.rASession`: Exposes CRUD operations for the **RASession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RASessions
    * const rASessions = await prisma.rASession.findMany()
    * ```
    */
  get rASession(): Prisma.RASessionDelegate<GlobalReject>;

  /**
   * `prisma.rawResource`: Exposes CRUD operations for the **RawResource** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RawResources
    * const rawResources = await prisma.rawResource.findMany()
    * ```
    */
  get rawResource(): Prisma.RawResourceDelegate<GlobalReject>;

  /**
   * `prisma.usersInCESessions`: Exposes CRUD operations for the **UsersInCESessions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UsersInCESessions
    * const usersInCESessions = await prisma.usersInCESessions.findMany()
    * ```
    */
  get usersInCESessions(): Prisma.UsersInCESessionsDelegate<GlobalReject>;

  /**
   * `prisma.usersInDLSessions`: Exposes CRUD operations for the **UsersInDLSessions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UsersInDLSessions
    * const usersInDLSessions = await prisma.usersInDLSessions.findMany()
    * ```
    */
  get usersInDLSessions(): Prisma.UsersInDLSessionsDelegate<GlobalReject>;

  /**
   * `prisma.usersInProjects`: Exposes CRUD operations for the **UsersInProjects** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UsersInProjects
    * const usersInProjects = await prisma.usersInProjects.findMany()
    * ```
    */
  get usersInProjects(): Prisma.UsersInProjectsDelegate<GlobalReject>;

  /**
   * `prisma.usersInRASessions`: Exposes CRUD operations for the **UsersInRASessions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UsersInRASessions
    * const usersInRASessions = await prisma.usersInRASessions.findMany()
    * ```
    */
  get usersInRASessions(): Prisma.UsersInRASessionsDelegate<GlobalReject>;

  /**
   * `prisma.visit`: Exposes CRUD operations for the **Visit** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Visits
    * const visits = await prisma.visit.findMany()
    * ```
    */
  get visit(): Prisma.VisitDelegate<GlobalReject>;

  /**
   * `prisma.visitsInRASessions`: Exposes CRUD operations for the **VisitsInRASessions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VisitsInRASessions
    * const visitsInRASessions = await prisma.visitsInRASessions.findMany()
    * ```
    */
  get visitsInRASessions(): Prisma.VisitsInRASessionsDelegate<GlobalReject>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export import Metrics = runtime.Metrics
  export import Metric = runtime.Metric
  export import MetricHistogram = runtime.MetricHistogram
  export import MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
   * Prisma Client JS version: 4.4.0
   * Query Engine version: f352a33b70356f46311da8b00d83386dd9f145d6
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }
  type HasSelect = {
    select: any
  }
  type HasInclude = {
    include: any
  }
  type CheckSelect<T, S, U> = T extends SelectAndInclude
    ? 'Please either choose `select` or `include`'
    : T extends HasSelect
    ? U
    : T extends HasInclude
    ? U
    : S

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = {
    [key in keyof T]: T[key] extends false | undefined | null ? never : key
  }[keyof T]

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Exact<A, W = unknown> = 
  W extends unknown ? A extends Narrowable ? Cast<A, W> : Cast<
  {[K in keyof A]: K extends keyof W ? Exact<A[K], W[K]> : never},
  {[K in keyof W]: K extends keyof A ? Exact<A[K], W[K]> : W[K]}>
  : never;

  type Narrowable = string | number | boolean | bigint;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  export function validator<V>(): <S>(select: Exact<S, V>) => S;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but with an array
   */
  type PickArray<T, K extends Array<keyof T>> = Prisma__Pick<T, TupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export import FieldRef = runtime.FieldRef

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>

  class PrismaClientFetcher {
    private readonly prisma;
    private readonly debug;
    private readonly hooks?;
    constructor(prisma: PrismaClient<any, any>, debug?: boolean, hooks?: Hooks | undefined);
    request<T>(document: any, dataPath?: string[], rootField?: string, typeName?: string, isList?: boolean, callsite?: string): Promise<T>;
    sanitizeMessage(message: string): string;
    protected unpack(document: any, data: any, path: string[], rootField?: string, isList?: boolean): any;
  }

  export const ModelName: {
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
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  export type RejectOnNotFound = boolean | ((error: Error) => Error)
  export type RejectPerModel = { [P in ModelName]?: RejectOnNotFound }
  export type RejectPerOperation =  { [P in "findUnique" | "findFirst"]?: RejectPerModel | RejectOnNotFound } 
  type IsReject<T> = T extends true ? True : T extends (err: Error) => Error ? True : False
  export type HasReject<
    GlobalRejectSettings extends Prisma.PrismaClientOptions['rejectOnNotFound'],
    LocalRejectSettings,
    Action extends PrismaAction,
    Model extends ModelName
  > = LocalRejectSettings extends RejectOnNotFound
    ? IsReject<LocalRejectSettings>
    : GlobalRejectSettings extends RejectPerOperation
    ? Action extends keyof GlobalRejectSettings
      ? GlobalRejectSettings[Action] extends RejectOnNotFound
        ? IsReject<GlobalRejectSettings[Action]>
        : GlobalRejectSettings[Action] extends RejectPerModel
        ? Model extends keyof GlobalRejectSettings[Action]
          ? IsReject<GlobalRejectSettings[Action][Model]>
          : False
        : False
      : False
    : IsReject<GlobalRejectSettings>
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

  export interface PrismaClientOptions {
    /**
     * Configure findUnique/findFirst to throw an error if the query returns null. 
     * @deprecated since 4.0.0. Use `findUniqueOrThrow`/`findFirstOrThrow` methods instead.
     * @example
     * ```
     * // Reject on both findUnique/findFirst
     * rejectOnNotFound: true
     * // Reject only on findFirst with a custom error
     * rejectOnNotFound: { findFirst: (err) => new Error("Custom Error")}
     * // Reject on user.findUnique with a custom error
     * rejectOnNotFound: { findUnique: {User: (err) => new Error("User not found")}}
     * ```
     */
    rejectOnNotFound?: RejectOnNotFound | RejectPerOperation
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources

    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat

    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>
  }

  export type Hooks = {
    beforeRequest?: (options: { query: string, path: string[], rootField?: string, typeName?: string, document: any }) => any
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findMany'
    | 'findFirst'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'

  /**
   * These options are being passed in to the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => Promise<T>,
  ) => Promise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type CESessionCountOutputType
   */


  export type CESessionCountOutputType = {
    ExtractedResourcesInCESessions: number
    UsersInCESessions: number
  }

  export type CESessionCountOutputTypeSelect = {
    ExtractedResourcesInCESessions?: boolean
    UsersInCESessions?: boolean
  }

  export type CESessionCountOutputTypeGetPayload<
    S extends boolean | null | undefined | CESessionCountOutputTypeArgs,
    U = keyof S
      > = S extends true
        ? CESessionCountOutputType
    : S extends undefined
    ? never
    : S extends CESessionCountOutputTypeArgs
    ?'include' extends U
    ? CESessionCountOutputType 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof CESessionCountOutputType ? CESessionCountOutputType[P] : never
  } 
    : CESessionCountOutputType
  : CESessionCountOutputType




  // Custom InputTypes

  /**
   * CESessionCountOutputType without action
   */
  export type CESessionCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the CESessionCountOutputType
     * 
    **/
    select?: CESessionCountOutputTypeSelect | null
  }



  /**
   * Count Type DLSessionCountOutputType
   */


  export type DLSessionCountOutputType = {
    ExtractedResourcesInDLSessions: number
    LabelsInDLSessions: number
    UsersInDLSessions: number
  }

  export type DLSessionCountOutputTypeSelect = {
    ExtractedResourcesInDLSessions?: boolean
    LabelsInDLSessions?: boolean
    UsersInDLSessions?: boolean
  }

  export type DLSessionCountOutputTypeGetPayload<
    S extends boolean | null | undefined | DLSessionCountOutputTypeArgs,
    U = keyof S
      > = S extends true
        ? DLSessionCountOutputType
    : S extends undefined
    ? never
    : S extends DLSessionCountOutputTypeArgs
    ?'include' extends U
    ? DLSessionCountOutputType 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof DLSessionCountOutputType ? DLSessionCountOutputType[P] : never
  } 
    : DLSessionCountOutputType
  : DLSessionCountOutputType




  // Custom InputTypes

  /**
   * DLSessionCountOutputType without action
   */
  export type DLSessionCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the DLSessionCountOutputType
     * 
    **/
    select?: DLSessionCountOutputTypeSelect | null
  }



  /**
   * Count Type EpicCountOutputType
   */


  export type EpicCountOutputType = {
    Project: number
  }

  export type EpicCountOutputTypeSelect = {
    Project?: boolean
  }

  export type EpicCountOutputTypeGetPayload<
    S extends boolean | null | undefined | EpicCountOutputTypeArgs,
    U = keyof S
      > = S extends true
        ? EpicCountOutputType
    : S extends undefined
    ? never
    : S extends EpicCountOutputTypeArgs
    ?'include' extends U
    ? EpicCountOutputType 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof EpicCountOutputType ? EpicCountOutputType[P] : never
  } 
    : EpicCountOutputType
  : EpicCountOutputType




  // Custom InputTypes

  /**
   * EpicCountOutputType without action
   */
  export type EpicCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the EpicCountOutputType
     * 
    **/
    select?: EpicCountOutputTypeSelect | null
  }



  /**
   * Count Type ExtractedResourceCountOutputType
   */


  export type ExtractedResourceCountOutputType = {
    ExtractedResourcesInCESessions: number
    ExtractedResourcesInDLSessions: number
  }

  export type ExtractedResourceCountOutputTypeSelect = {
    ExtractedResourcesInCESessions?: boolean
    ExtractedResourcesInDLSessions?: boolean
  }

  export type ExtractedResourceCountOutputTypeGetPayload<
    S extends boolean | null | undefined | ExtractedResourceCountOutputTypeArgs,
    U = keyof S
      > = S extends true
        ? ExtractedResourceCountOutputType
    : S extends undefined
    ? never
    : S extends ExtractedResourceCountOutputTypeArgs
    ?'include' extends U
    ? ExtractedResourceCountOutputType 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof ExtractedResourceCountOutputType ? ExtractedResourceCountOutputType[P] : never
  } 
    : ExtractedResourceCountOutputType
  : ExtractedResourceCountOutputType




  // Custom InputTypes

  /**
   * ExtractedResourceCountOutputType without action
   */
  export type ExtractedResourceCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the ExtractedResourceCountOutputType
     * 
    **/
    select?: ExtractedResourceCountOutputTypeSelect | null
  }



  /**
   * Count Type ExtractedResourcesInDLSessionsCountOutputType
   */


  export type ExtractedResourcesInDLSessionsCountOutputType = {
    LabelsInExtractedResourcesInDLSessions: number
  }

  export type ExtractedResourcesInDLSessionsCountOutputTypeSelect = {
    LabelsInExtractedResourcesInDLSessions?: boolean
  }

  export type ExtractedResourcesInDLSessionsCountOutputTypeGetPayload<
    S extends boolean | null | undefined | ExtractedResourcesInDLSessionsCountOutputTypeArgs,
    U = keyof S
      > = S extends true
        ? ExtractedResourcesInDLSessionsCountOutputType
    : S extends undefined
    ? never
    : S extends ExtractedResourcesInDLSessionsCountOutputTypeArgs
    ?'include' extends U
    ? ExtractedResourcesInDLSessionsCountOutputType 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof ExtractedResourcesInDLSessionsCountOutputType ? ExtractedResourcesInDLSessionsCountOutputType[P] : never
  } 
    : ExtractedResourcesInDLSessionsCountOutputType
  : ExtractedResourcesInDLSessionsCountOutputType




  // Custom InputTypes

  /**
   * ExtractedResourcesInDLSessionsCountOutputType without action
   */
  export type ExtractedResourcesInDLSessionsCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the ExtractedResourcesInDLSessionsCountOutputType
     * 
    **/
    select?: ExtractedResourcesInDLSessionsCountOutputTypeSelect | null
  }



  /**
   * Count Type LabelCountOutputType
   */


  export type LabelCountOutputType = {
    LabelsInDLSessions: number
    LabelsInExtractedResourcesInDLSessions: number
  }

  export type LabelCountOutputTypeSelect = {
    LabelsInDLSessions?: boolean
    LabelsInExtractedResourcesInDLSessions?: boolean
  }

  export type LabelCountOutputTypeGetPayload<
    S extends boolean | null | undefined | LabelCountOutputTypeArgs,
    U = keyof S
      > = S extends true
        ? LabelCountOutputType
    : S extends undefined
    ? never
    : S extends LabelCountOutputTypeArgs
    ?'include' extends U
    ? LabelCountOutputType 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof LabelCountOutputType ? LabelCountOutputType[P] : never
  } 
    : LabelCountOutputType
  : LabelCountOutputType




  // Custom InputTypes

  /**
   * LabelCountOutputType without action
   */
  export type LabelCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the LabelCountOutputType
     * 
    **/
    select?: LabelCountOutputTypeSelect | null
  }



  /**
   * Count Type PatientCountOutputType
   */


  export type PatientCountOutputType = {
    Visit: number
  }

  export type PatientCountOutputTypeSelect = {
    Visit?: boolean
  }

  export type PatientCountOutputTypeGetPayload<
    S extends boolean | null | undefined | PatientCountOutputTypeArgs,
    U = keyof S
      > = S extends true
        ? PatientCountOutputType
    : S extends undefined
    ? never
    : S extends PatientCountOutputTypeArgs
    ?'include' extends U
    ? PatientCountOutputType 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof PatientCountOutputType ? PatientCountOutputType[P] : never
  } 
    : PatientCountOutputType
  : PatientCountOutputType




  // Custom InputTypes

  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the PatientCountOutputType
     * 
    **/
    select?: PatientCountOutputTypeSelect | null
  }



  /**
   * Count Type ProjectCountOutputType
   */


  export type ProjectCountOutputType = {
    CESession: number
    DLSession: number
    RASession: number
    UsersInProjects: number
  }

  export type ProjectCountOutputTypeSelect = {
    CESession?: boolean
    DLSession?: boolean
    RASession?: boolean
    UsersInProjects?: boolean
  }

  export type ProjectCountOutputTypeGetPayload<
    S extends boolean | null | undefined | ProjectCountOutputTypeArgs,
    U = keyof S
      > = S extends true
        ? ProjectCountOutputType
    : S extends undefined
    ? never
    : S extends ProjectCountOutputTypeArgs
    ?'include' extends U
    ? ProjectCountOutputType 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof ProjectCountOutputType ? ProjectCountOutputType[P] : never
  } 
    : ProjectCountOutputType
  : ProjectCountOutputType




  // Custom InputTypes

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the ProjectCountOutputType
     * 
    **/
    select?: ProjectCountOutputTypeSelect | null
  }



  /**
   * Count Type RASessionCountOutputType
   */


  export type RASessionCountOutputType = {
    UsersInRASessions: number
    VisitsInRASessions: number
  }

  export type RASessionCountOutputTypeSelect = {
    UsersInRASessions?: boolean
    VisitsInRASessions?: boolean
  }

  export type RASessionCountOutputTypeGetPayload<
    S extends boolean | null | undefined | RASessionCountOutputTypeArgs,
    U = keyof S
      > = S extends true
        ? RASessionCountOutputType
    : S extends undefined
    ? never
    : S extends RASessionCountOutputTypeArgs
    ?'include' extends U
    ? RASessionCountOutputType 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof RASessionCountOutputType ? RASessionCountOutputType[P] : never
  } 
    : RASessionCountOutputType
  : RASessionCountOutputType




  // Custom InputTypes

  /**
   * RASessionCountOutputType without action
   */
  export type RASessionCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the RASessionCountOutputType
     * 
    **/
    select?: RASessionCountOutputTypeSelect | null
  }



  /**
   * Count Type RawResourceCountOutputType
   */


  export type RawResourceCountOutputType = {
    ExtractedResource: number
  }

  export type RawResourceCountOutputTypeSelect = {
    ExtractedResource?: boolean
  }

  export type RawResourceCountOutputTypeGetPayload<
    S extends boolean | null | undefined | RawResourceCountOutputTypeArgs,
    U = keyof S
      > = S extends true
        ? RawResourceCountOutputType
    : S extends undefined
    ? never
    : S extends RawResourceCountOutputTypeArgs
    ?'include' extends U
    ? RawResourceCountOutputType 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof RawResourceCountOutputType ? RawResourceCountOutputType[P] : never
  } 
    : RawResourceCountOutputType
  : RawResourceCountOutputType




  // Custom InputTypes

  /**
   * RawResourceCountOutputType without action
   */
  export type RawResourceCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the RawResourceCountOutputType
     * 
    **/
    select?: RawResourceCountOutputTypeSelect | null
  }



  /**
   * Count Type VisitCountOutputType
   */


  export type VisitCountOutputType = {
    RawResource: number
    VisitsInRASessions: number
  }

  export type VisitCountOutputTypeSelect = {
    RawResource?: boolean
    VisitsInRASessions?: boolean
  }

  export type VisitCountOutputTypeGetPayload<
    S extends boolean | null | undefined | VisitCountOutputTypeArgs,
    U = keyof S
      > = S extends true
        ? VisitCountOutputType
    : S extends undefined
    ? never
    : S extends VisitCountOutputTypeArgs
    ?'include' extends U
    ? VisitCountOutputType 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof VisitCountOutputType ? VisitCountOutputType[P] : never
  } 
    : VisitCountOutputType
  : VisitCountOutputType




  // Custom InputTypes

  /**
   * VisitCountOutputType without action
   */
  export type VisitCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the VisitCountOutputType
     * 
    **/
    select?: VisitCountOutputTypeSelect | null
  }



  /**
   * Models
   */

  /**
   * Model CESession
   */


  export type AggregateCESession = {
    _count: CESessionCountAggregateOutputType | null
    _avg: CESessionAvgAggregateOutputType | null
    _sum: CESessionSumAggregateOutputType | null
    _min: CESessionMinAggregateOutputType | null
    _max: CESessionMaxAggregateOutputType | null
  }

  export type CESessionAvgAggregateOutputType = {
    priority: number | null
  }

  export type CESessionSumAggregateOutputType = {
    priority: number | null
  }

  export type CESessionMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    description: string | null
    priority: number | null
    projectId: string | null
  }

  export type CESessionMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    description: string | null
    priority: number | null
    projectId: string | null
  }

  export type CESessionCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    name: number
    description: number
    priority: number
    sop: number
    resultTemplate: number
    projectId: number
    _all: number
  }


  export type CESessionAvgAggregateInputType = {
    priority?: true
  }

  export type CESessionSumAggregateInputType = {
    priority?: true
  }

  export type CESessionMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    description?: true
    priority?: true
    projectId?: true
  }

  export type CESessionMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    description?: true
    priority?: true
    projectId?: true
  }

  export type CESessionCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    description?: true
    priority?: true
    sop?: true
    resultTemplate?: true
    projectId?: true
    _all?: true
  }

  export type CESessionAggregateArgs = {
    /**
     * Filter which CESession to aggregate.
     * 
    **/
    where?: CESessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CESessions to fetch.
     * 
    **/
    orderBy?: Enumerable<CESessionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: CESessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CESessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CESessions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CESessions
    **/
    _count?: true | CESessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CESessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CESessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CESessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CESessionMaxAggregateInputType
  }

  export type GetCESessionAggregateType<T extends CESessionAggregateArgs> = {
        [P in keyof T & keyof AggregateCESession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCESession[P]>
      : GetScalarType<T[P], AggregateCESession[P]>
  }




  export type CESessionGroupByArgs = {
    where?: CESessionWhereInput
    orderBy?: Enumerable<CESessionOrderByWithAggregationInput>
    by: Array<CESessionScalarFieldEnum>
    having?: CESessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CESessionCountAggregateInputType | true
    _avg?: CESessionAvgAggregateInputType
    _sum?: CESessionSumAggregateInputType
    _min?: CESessionMinAggregateInputType
    _max?: CESessionMaxAggregateInputType
  }


  export type CESessionGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    name: string
    description: string
    priority: number
    sop: string[]
    resultTemplate: JsonValue
    projectId: string
    _count: CESessionCountAggregateOutputType | null
    _avg: CESessionAvgAggregateOutputType | null
    _sum: CESessionSumAggregateOutputType | null
    _min: CESessionMinAggregateOutputType | null
    _max: CESessionMaxAggregateOutputType | null
  }

  type GetCESessionGroupByPayload<T extends CESessionGroupByArgs> = PrismaPromise<
    Array<
      PickArray<CESessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CESessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CESessionGroupByOutputType[P]>
            : GetScalarType<T[P], CESessionGroupByOutputType[P]>
        }
      >
    >


  export type CESessionSelect = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    description?: boolean
    priority?: boolean
    sop?: boolean
    resultTemplate?: boolean
    projectId?: boolean
    Project?: boolean | ProjectArgs
    ExtractedResourcesInCESessions?: boolean | ExtractedResourcesInCESessionsFindManyArgs
    UsersInCESessions?: boolean | UsersInCESessionsFindManyArgs
    _count?: boolean | CESessionCountOutputTypeArgs
  }

  export type CESessionInclude = {
    Project?: boolean | ProjectArgs
    ExtractedResourcesInCESessions?: boolean | ExtractedResourcesInCESessionsFindManyArgs
    UsersInCESessions?: boolean | UsersInCESessionsFindManyArgs
    _count?: boolean | CESessionCountOutputTypeArgs
  }

  export type CESessionGetPayload<
    S extends boolean | null | undefined | CESessionArgs,
    U = keyof S
      > = S extends true
        ? CESession
    : S extends undefined
    ? never
    : S extends CESessionArgs | CESessionFindManyArgs
    ?'include' extends U
    ? CESession  & {
    [P in TrueKeys<S['include']>]:
        P extends 'Project' ? ProjectGetPayload<Exclude<S['include'], undefined | null>[P]> :
        P extends 'ExtractedResourcesInCESessions' ? Array < ExtractedResourcesInCESessionsGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends 'UsersInCESessions' ? Array < UsersInCESessionsGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends '_count' ? CESessionCountOutputTypeGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'Project' ? ProjectGetPayload<Exclude<S['select'], undefined | null>[P]> :
        P extends 'ExtractedResourcesInCESessions' ? Array < ExtractedResourcesInCESessionsGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends 'UsersInCESessions' ? Array < UsersInCESessionsGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends '_count' ? CESessionCountOutputTypeGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof CESession ? CESession[P] : never
  } 
    : CESession
  : CESession


  type CESessionCountArgs = Merge<
    Omit<CESessionFindManyArgs, 'select' | 'include'> & {
      select?: CESessionCountAggregateInputType | true
    }
  >

  export interface CESessionDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one CESession that matches the filter.
     * @param {CESessionFindUniqueArgs} args - Arguments to find a CESession
     * @example
     * // Get one CESession
     * const cESession = await prisma.cESession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends CESessionFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, CESessionFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'CESession'> extends True ? CheckSelect<T, Prisma__CESessionClient<CESession>, Prisma__CESessionClient<CESessionGetPayload<T>>> : CheckSelect<T, Prisma__CESessionClient<CESession | null, null>, Prisma__CESessionClient<CESessionGetPayload<T> | null, null>>

    /**
     * Find the first CESession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CESessionFindFirstArgs} args - Arguments to find a CESession
     * @example
     * // Get one CESession
     * const cESession = await prisma.cESession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends CESessionFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, CESessionFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'CESession'> extends True ? CheckSelect<T, Prisma__CESessionClient<CESession>, Prisma__CESessionClient<CESessionGetPayload<T>>> : CheckSelect<T, Prisma__CESessionClient<CESession | null, null>, Prisma__CESessionClient<CESessionGetPayload<T> | null, null>>

    /**
     * Find zero or more CESessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CESessionFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CESessions
     * const cESessions = await prisma.cESession.findMany()
     * 
     * // Get first 10 CESessions
     * const cESessions = await prisma.cESession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cESessionWithIdOnly = await prisma.cESession.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends CESessionFindManyArgs>(
      args?: SelectSubset<T, CESessionFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<CESession>>, PrismaPromise<Array<CESessionGetPayload<T>>>>

    /**
     * Create a CESession.
     * @param {CESessionCreateArgs} args - Arguments to create a CESession.
     * @example
     * // Create one CESession
     * const CESession = await prisma.cESession.create({
     *   data: {
     *     // ... data to create a CESession
     *   }
     * })
     * 
    **/
    create<T extends CESessionCreateArgs>(
      args: SelectSubset<T, CESessionCreateArgs>
    ): CheckSelect<T, Prisma__CESessionClient<CESession>, Prisma__CESessionClient<CESessionGetPayload<T>>>

    /**
     * Create many CESessions.
     *     @param {CESessionCreateManyArgs} args - Arguments to create many CESessions.
     *     @example
     *     // Create many CESessions
     *     const cESession = await prisma.cESession.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends CESessionCreateManyArgs>(
      args?: SelectSubset<T, CESessionCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a CESession.
     * @param {CESessionDeleteArgs} args - Arguments to delete one CESession.
     * @example
     * // Delete one CESession
     * const CESession = await prisma.cESession.delete({
     *   where: {
     *     // ... filter to delete one CESession
     *   }
     * })
     * 
    **/
    delete<T extends CESessionDeleteArgs>(
      args: SelectSubset<T, CESessionDeleteArgs>
    ): CheckSelect<T, Prisma__CESessionClient<CESession>, Prisma__CESessionClient<CESessionGetPayload<T>>>

    /**
     * Update one CESession.
     * @param {CESessionUpdateArgs} args - Arguments to update one CESession.
     * @example
     * // Update one CESession
     * const cESession = await prisma.cESession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends CESessionUpdateArgs>(
      args: SelectSubset<T, CESessionUpdateArgs>
    ): CheckSelect<T, Prisma__CESessionClient<CESession>, Prisma__CESessionClient<CESessionGetPayload<T>>>

    /**
     * Delete zero or more CESessions.
     * @param {CESessionDeleteManyArgs} args - Arguments to filter CESessions to delete.
     * @example
     * // Delete a few CESessions
     * const { count } = await prisma.cESession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends CESessionDeleteManyArgs>(
      args?: SelectSubset<T, CESessionDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more CESessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CESessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CESessions
     * const cESession = await prisma.cESession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends CESessionUpdateManyArgs>(
      args: SelectSubset<T, CESessionUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one CESession.
     * @param {CESessionUpsertArgs} args - Arguments to update or create a CESession.
     * @example
     * // Update or create a CESession
     * const cESession = await prisma.cESession.upsert({
     *   create: {
     *     // ... data to create a CESession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CESession we want to update
     *   }
     * })
    **/
    upsert<T extends CESessionUpsertArgs>(
      args: SelectSubset<T, CESessionUpsertArgs>
    ): CheckSelect<T, Prisma__CESessionClient<CESession>, Prisma__CESessionClient<CESessionGetPayload<T>>>

    /**
     * Find one CESession that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {CESessionFindUniqueOrThrowArgs} args - Arguments to find a CESession
     * @example
     * // Get one CESession
     * const cESession = await prisma.cESession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends CESessionFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, CESessionFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__CESessionClient<CESession>, Prisma__CESessionClient<CESessionGetPayload<T>>>

    /**
     * Find the first CESession that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CESessionFindFirstOrThrowArgs} args - Arguments to find a CESession
     * @example
     * // Get one CESession
     * const cESession = await prisma.cESession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends CESessionFindFirstOrThrowArgs>(
      args?: SelectSubset<T, CESessionFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__CESessionClient<CESession>, Prisma__CESessionClient<CESessionGetPayload<T>>>

    /**
     * Count the number of CESessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CESessionCountArgs} args - Arguments to filter CESessions to count.
     * @example
     * // Count the number of CESessions
     * const count = await prisma.cESession.count({
     *   where: {
     *     // ... the filter for the CESessions we want to count
     *   }
     * })
    **/
    count<T extends CESessionCountArgs>(
      args?: Subset<T, CESessionCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CESessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CESession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CESessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CESessionAggregateArgs>(args: Subset<T, CESessionAggregateArgs>): PrismaPromise<GetCESessionAggregateType<T>>

    /**
     * Group by CESession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CESessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CESessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CESessionGroupByArgs['orderBy'] }
        : { orderBy?: CESessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CESessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCESessionGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for CESession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__CESessionClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    Project<T extends ProjectArgs = {}>(args?: Subset<T, ProjectArgs>): CheckSelect<T, Prisma__ProjectClient<Project | Null>, Prisma__ProjectClient<ProjectGetPayload<T> | Null>>;

    ExtractedResourcesInCESessions<T extends ExtractedResourcesInCESessionsFindManyArgs = {}>(args?: Subset<T, ExtractedResourcesInCESessionsFindManyArgs>): CheckSelect<T, PrismaPromise<Array<ExtractedResourcesInCESessions>| Null>, PrismaPromise<Array<ExtractedResourcesInCESessionsGetPayload<T>>| Null>>;

    UsersInCESessions<T extends UsersInCESessionsFindManyArgs = {}>(args?: Subset<T, UsersInCESessionsFindManyArgs>): CheckSelect<T, PrismaPromise<Array<UsersInCESessions>| Null>, PrismaPromise<Array<UsersInCESessionsGetPayload<T>>| Null>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * CESession base type for findUnique actions
   */
  export type CESessionFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the CESession
     * 
    **/
    select?: CESessionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: CESessionInclude | null
    /**
     * Filter, which CESession to fetch.
     * 
    **/
    where: CESessionWhereUniqueInput
  }

  /**
   * CESession: findUnique
   */
  export interface CESessionFindUniqueArgs extends CESessionFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * CESession base type for findFirst actions
   */
  export type CESessionFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the CESession
     * 
    **/
    select?: CESessionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: CESessionInclude | null
    /**
     * Filter, which CESession to fetch.
     * 
    **/
    where?: CESessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CESessions to fetch.
     * 
    **/
    orderBy?: Enumerable<CESessionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CESessions.
     * 
    **/
    cursor?: CESessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CESessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CESessions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CESessions.
     * 
    **/
    distinct?: Enumerable<CESessionScalarFieldEnum>
  }

  /**
   * CESession: findFirst
   */
  export interface CESessionFindFirstArgs extends CESessionFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * CESession findMany
   */
  export type CESessionFindManyArgs = {
    /**
     * Select specific fields to fetch from the CESession
     * 
    **/
    select?: CESessionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: CESessionInclude | null
    /**
     * Filter, which CESessions to fetch.
     * 
    **/
    where?: CESessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CESessions to fetch.
     * 
    **/
    orderBy?: Enumerable<CESessionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CESessions.
     * 
    **/
    cursor?: CESessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CESessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CESessions.
     * 
    **/
    skip?: number
    distinct?: Enumerable<CESessionScalarFieldEnum>
  }


  /**
   * CESession create
   */
  export type CESessionCreateArgs = {
    /**
     * Select specific fields to fetch from the CESession
     * 
    **/
    select?: CESessionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: CESessionInclude | null
    /**
     * The data needed to create a CESession.
     * 
    **/
    data: XOR<CESessionCreateInput, CESessionUncheckedCreateInput>
  }


  /**
   * CESession createMany
   */
  export type CESessionCreateManyArgs = {
    /**
     * The data used to create many CESessions.
     * 
    **/
    data: Enumerable<CESessionCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * CESession update
   */
  export type CESessionUpdateArgs = {
    /**
     * Select specific fields to fetch from the CESession
     * 
    **/
    select?: CESessionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: CESessionInclude | null
    /**
     * The data needed to update a CESession.
     * 
    **/
    data: XOR<CESessionUpdateInput, CESessionUncheckedUpdateInput>
    /**
     * Choose, which CESession to update.
     * 
    **/
    where: CESessionWhereUniqueInput
  }


  /**
   * CESession updateMany
   */
  export type CESessionUpdateManyArgs = {
    /**
     * The data used to update CESessions.
     * 
    **/
    data: XOR<CESessionUpdateManyMutationInput, CESessionUncheckedUpdateManyInput>
    /**
     * Filter which CESessions to update
     * 
    **/
    where?: CESessionWhereInput
  }


  /**
   * CESession upsert
   */
  export type CESessionUpsertArgs = {
    /**
     * Select specific fields to fetch from the CESession
     * 
    **/
    select?: CESessionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: CESessionInclude | null
    /**
     * The filter to search for the CESession to update in case it exists.
     * 
    **/
    where: CESessionWhereUniqueInput
    /**
     * In case the CESession found by the `where` argument doesn't exist, create a new CESession with this data.
     * 
    **/
    create: XOR<CESessionCreateInput, CESessionUncheckedCreateInput>
    /**
     * In case the CESession was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<CESessionUpdateInput, CESessionUncheckedUpdateInput>
  }


  /**
   * CESession delete
   */
  export type CESessionDeleteArgs = {
    /**
     * Select specific fields to fetch from the CESession
     * 
    **/
    select?: CESessionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: CESessionInclude | null
    /**
     * Filter which CESession to delete.
     * 
    **/
    where: CESessionWhereUniqueInput
  }


  /**
   * CESession deleteMany
   */
  export type CESessionDeleteManyArgs = {
    /**
     * Filter which CESessions to delete
     * 
    **/
    where?: CESessionWhereInput
  }


  /**
   * CESession: findUniqueOrThrow
   */
  export type CESessionFindUniqueOrThrowArgs = CESessionFindUniqueArgsBase
      

  /**
   * CESession: findFirstOrThrow
   */
  export type CESessionFindFirstOrThrowArgs = CESessionFindFirstArgsBase
      

  /**
   * CESession without action
   */
  export type CESessionArgs = {
    /**
     * Select specific fields to fetch from the CESession
     * 
    **/
    select?: CESessionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: CESessionInclude | null
  }



  /**
   * Model DLSession
   */


  export type AggregateDLSession = {
    _count: DLSessionCountAggregateOutputType | null
    _avg: DLSessionAvgAggregateOutputType | null
    _sum: DLSessionSumAggregateOutputType | null
    _min: DLSessionMinAggregateOutputType | null
    _max: DLSessionMaxAggregateOutputType | null
  }

  export type DLSessionAvgAggregateOutputType = {
    priority: number | null
  }

  export type DLSessionSumAggregateOutputType = {
    priority: number | null
  }

  export type DLSessionMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    description: string | null
    priority: number | null
    projectId: string | null
  }

  export type DLSessionMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    description: string | null
    priority: number | null
    projectId: string | null
  }

  export type DLSessionCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    name: number
    description: number
    priority: number
    sop: number
    projectId: number
    _all: number
  }


  export type DLSessionAvgAggregateInputType = {
    priority?: true
  }

  export type DLSessionSumAggregateInputType = {
    priority?: true
  }

  export type DLSessionMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    description?: true
    priority?: true
    projectId?: true
  }

  export type DLSessionMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    description?: true
    priority?: true
    projectId?: true
  }

  export type DLSessionCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    description?: true
    priority?: true
    sop?: true
    projectId?: true
    _all?: true
  }

  export type DLSessionAggregateArgs = {
    /**
     * Filter which DLSession to aggregate.
     * 
    **/
    where?: DLSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DLSessions to fetch.
     * 
    **/
    orderBy?: Enumerable<DLSessionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: DLSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DLSessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DLSessions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DLSessions
    **/
    _count?: true | DLSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DLSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DLSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DLSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DLSessionMaxAggregateInputType
  }

  export type GetDLSessionAggregateType<T extends DLSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateDLSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDLSession[P]>
      : GetScalarType<T[P], AggregateDLSession[P]>
  }




  export type DLSessionGroupByArgs = {
    where?: DLSessionWhereInput
    orderBy?: Enumerable<DLSessionOrderByWithAggregationInput>
    by: Array<DLSessionScalarFieldEnum>
    having?: DLSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DLSessionCountAggregateInputType | true
    _avg?: DLSessionAvgAggregateInputType
    _sum?: DLSessionSumAggregateInputType
    _min?: DLSessionMinAggregateInputType
    _max?: DLSessionMaxAggregateInputType
  }


  export type DLSessionGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    name: string
    description: string
    priority: number
    sop: string[]
    projectId: string
    _count: DLSessionCountAggregateOutputType | null
    _avg: DLSessionAvgAggregateOutputType | null
    _sum: DLSessionSumAggregateOutputType | null
    _min: DLSessionMinAggregateOutputType | null
    _max: DLSessionMaxAggregateOutputType | null
  }

  type GetDLSessionGroupByPayload<T extends DLSessionGroupByArgs> = PrismaPromise<
    Array<
      PickArray<DLSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DLSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DLSessionGroupByOutputType[P]>
            : GetScalarType<T[P], DLSessionGroupByOutputType[P]>
        }
      >
    >


  export type DLSessionSelect = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    description?: boolean
    priority?: boolean
    sop?: boolean
    projectId?: boolean
    Project?: boolean | ProjectArgs
    ExtractedResourcesInDLSessions?: boolean | ExtractedResourcesInDLSessionsFindManyArgs
    LabelsInDLSessions?: boolean | LabelsInDLSessionsFindManyArgs
    UsersInDLSessions?: boolean | UsersInDLSessionsFindManyArgs
    _count?: boolean | DLSessionCountOutputTypeArgs
  }

  export type DLSessionInclude = {
    Project?: boolean | ProjectArgs
    ExtractedResourcesInDLSessions?: boolean | ExtractedResourcesInDLSessionsFindManyArgs
    LabelsInDLSessions?: boolean | LabelsInDLSessionsFindManyArgs
    UsersInDLSessions?: boolean | UsersInDLSessionsFindManyArgs
    _count?: boolean | DLSessionCountOutputTypeArgs
  }

  export type DLSessionGetPayload<
    S extends boolean | null | undefined | DLSessionArgs,
    U = keyof S
      > = S extends true
        ? DLSession
    : S extends undefined
    ? never
    : S extends DLSessionArgs | DLSessionFindManyArgs
    ?'include' extends U
    ? DLSession  & {
    [P in TrueKeys<S['include']>]:
        P extends 'Project' ? ProjectGetPayload<Exclude<S['include'], undefined | null>[P]> :
        P extends 'ExtractedResourcesInDLSessions' ? Array < ExtractedResourcesInDLSessionsGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends 'LabelsInDLSessions' ? Array < LabelsInDLSessionsGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends 'UsersInDLSessions' ? Array < UsersInDLSessionsGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends '_count' ? DLSessionCountOutputTypeGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'Project' ? ProjectGetPayload<Exclude<S['select'], undefined | null>[P]> :
        P extends 'ExtractedResourcesInDLSessions' ? Array < ExtractedResourcesInDLSessionsGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends 'LabelsInDLSessions' ? Array < LabelsInDLSessionsGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends 'UsersInDLSessions' ? Array < UsersInDLSessionsGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends '_count' ? DLSessionCountOutputTypeGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof DLSession ? DLSession[P] : never
  } 
    : DLSession
  : DLSession


  type DLSessionCountArgs = Merge<
    Omit<DLSessionFindManyArgs, 'select' | 'include'> & {
      select?: DLSessionCountAggregateInputType | true
    }
  >

  export interface DLSessionDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one DLSession that matches the filter.
     * @param {DLSessionFindUniqueArgs} args - Arguments to find a DLSession
     * @example
     * // Get one DLSession
     * const dLSession = await prisma.dLSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends DLSessionFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, DLSessionFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'DLSession'> extends True ? CheckSelect<T, Prisma__DLSessionClient<DLSession>, Prisma__DLSessionClient<DLSessionGetPayload<T>>> : CheckSelect<T, Prisma__DLSessionClient<DLSession | null, null>, Prisma__DLSessionClient<DLSessionGetPayload<T> | null, null>>

    /**
     * Find the first DLSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DLSessionFindFirstArgs} args - Arguments to find a DLSession
     * @example
     * // Get one DLSession
     * const dLSession = await prisma.dLSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends DLSessionFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, DLSessionFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'DLSession'> extends True ? CheckSelect<T, Prisma__DLSessionClient<DLSession>, Prisma__DLSessionClient<DLSessionGetPayload<T>>> : CheckSelect<T, Prisma__DLSessionClient<DLSession | null, null>, Prisma__DLSessionClient<DLSessionGetPayload<T> | null, null>>

    /**
     * Find zero or more DLSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DLSessionFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DLSessions
     * const dLSessions = await prisma.dLSession.findMany()
     * 
     * // Get first 10 DLSessions
     * const dLSessions = await prisma.dLSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dLSessionWithIdOnly = await prisma.dLSession.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends DLSessionFindManyArgs>(
      args?: SelectSubset<T, DLSessionFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<DLSession>>, PrismaPromise<Array<DLSessionGetPayload<T>>>>

    /**
     * Create a DLSession.
     * @param {DLSessionCreateArgs} args - Arguments to create a DLSession.
     * @example
     * // Create one DLSession
     * const DLSession = await prisma.dLSession.create({
     *   data: {
     *     // ... data to create a DLSession
     *   }
     * })
     * 
    **/
    create<T extends DLSessionCreateArgs>(
      args: SelectSubset<T, DLSessionCreateArgs>
    ): CheckSelect<T, Prisma__DLSessionClient<DLSession>, Prisma__DLSessionClient<DLSessionGetPayload<T>>>

    /**
     * Create many DLSessions.
     *     @param {DLSessionCreateManyArgs} args - Arguments to create many DLSessions.
     *     @example
     *     // Create many DLSessions
     *     const dLSession = await prisma.dLSession.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends DLSessionCreateManyArgs>(
      args?: SelectSubset<T, DLSessionCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a DLSession.
     * @param {DLSessionDeleteArgs} args - Arguments to delete one DLSession.
     * @example
     * // Delete one DLSession
     * const DLSession = await prisma.dLSession.delete({
     *   where: {
     *     // ... filter to delete one DLSession
     *   }
     * })
     * 
    **/
    delete<T extends DLSessionDeleteArgs>(
      args: SelectSubset<T, DLSessionDeleteArgs>
    ): CheckSelect<T, Prisma__DLSessionClient<DLSession>, Prisma__DLSessionClient<DLSessionGetPayload<T>>>

    /**
     * Update one DLSession.
     * @param {DLSessionUpdateArgs} args - Arguments to update one DLSession.
     * @example
     * // Update one DLSession
     * const dLSession = await prisma.dLSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends DLSessionUpdateArgs>(
      args: SelectSubset<T, DLSessionUpdateArgs>
    ): CheckSelect<T, Prisma__DLSessionClient<DLSession>, Prisma__DLSessionClient<DLSessionGetPayload<T>>>

    /**
     * Delete zero or more DLSessions.
     * @param {DLSessionDeleteManyArgs} args - Arguments to filter DLSessions to delete.
     * @example
     * // Delete a few DLSessions
     * const { count } = await prisma.dLSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends DLSessionDeleteManyArgs>(
      args?: SelectSubset<T, DLSessionDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more DLSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DLSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DLSessions
     * const dLSession = await prisma.dLSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends DLSessionUpdateManyArgs>(
      args: SelectSubset<T, DLSessionUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one DLSession.
     * @param {DLSessionUpsertArgs} args - Arguments to update or create a DLSession.
     * @example
     * // Update or create a DLSession
     * const dLSession = await prisma.dLSession.upsert({
     *   create: {
     *     // ... data to create a DLSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DLSession we want to update
     *   }
     * })
    **/
    upsert<T extends DLSessionUpsertArgs>(
      args: SelectSubset<T, DLSessionUpsertArgs>
    ): CheckSelect<T, Prisma__DLSessionClient<DLSession>, Prisma__DLSessionClient<DLSessionGetPayload<T>>>

    /**
     * Find one DLSession that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {DLSessionFindUniqueOrThrowArgs} args - Arguments to find a DLSession
     * @example
     * // Get one DLSession
     * const dLSession = await prisma.dLSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends DLSessionFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, DLSessionFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__DLSessionClient<DLSession>, Prisma__DLSessionClient<DLSessionGetPayload<T>>>

    /**
     * Find the first DLSession that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DLSessionFindFirstOrThrowArgs} args - Arguments to find a DLSession
     * @example
     * // Get one DLSession
     * const dLSession = await prisma.dLSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends DLSessionFindFirstOrThrowArgs>(
      args?: SelectSubset<T, DLSessionFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__DLSessionClient<DLSession>, Prisma__DLSessionClient<DLSessionGetPayload<T>>>

    /**
     * Count the number of DLSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DLSessionCountArgs} args - Arguments to filter DLSessions to count.
     * @example
     * // Count the number of DLSessions
     * const count = await prisma.dLSession.count({
     *   where: {
     *     // ... the filter for the DLSessions we want to count
     *   }
     * })
    **/
    count<T extends DLSessionCountArgs>(
      args?: Subset<T, DLSessionCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DLSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DLSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DLSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DLSessionAggregateArgs>(args: Subset<T, DLSessionAggregateArgs>): PrismaPromise<GetDLSessionAggregateType<T>>

    /**
     * Group by DLSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DLSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DLSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DLSessionGroupByArgs['orderBy'] }
        : { orderBy?: DLSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DLSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDLSessionGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for DLSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__DLSessionClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    Project<T extends ProjectArgs = {}>(args?: Subset<T, ProjectArgs>): CheckSelect<T, Prisma__ProjectClient<Project | Null>, Prisma__ProjectClient<ProjectGetPayload<T> | Null>>;

    ExtractedResourcesInDLSessions<T extends ExtractedResourcesInDLSessionsFindManyArgs = {}>(args?: Subset<T, ExtractedResourcesInDLSessionsFindManyArgs>): CheckSelect<T, PrismaPromise<Array<ExtractedResourcesInDLSessions>| Null>, PrismaPromise<Array<ExtractedResourcesInDLSessionsGetPayload<T>>| Null>>;

    LabelsInDLSessions<T extends LabelsInDLSessionsFindManyArgs = {}>(args?: Subset<T, LabelsInDLSessionsFindManyArgs>): CheckSelect<T, PrismaPromise<Array<LabelsInDLSessions>| Null>, PrismaPromise<Array<LabelsInDLSessionsGetPayload<T>>| Null>>;

    UsersInDLSessions<T extends UsersInDLSessionsFindManyArgs = {}>(args?: Subset<T, UsersInDLSessionsFindManyArgs>): CheckSelect<T, PrismaPromise<Array<UsersInDLSessions>| Null>, PrismaPromise<Array<UsersInDLSessionsGetPayload<T>>| Null>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * DLSession base type for findUnique actions
   */
  export type DLSessionFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the DLSession
     * 
    **/
    select?: DLSessionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: DLSessionInclude | null
    /**
     * Filter, which DLSession to fetch.
     * 
    **/
    where: DLSessionWhereUniqueInput
  }

  /**
   * DLSession: findUnique
   */
  export interface DLSessionFindUniqueArgs extends DLSessionFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * DLSession base type for findFirst actions
   */
  export type DLSessionFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the DLSession
     * 
    **/
    select?: DLSessionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: DLSessionInclude | null
    /**
     * Filter, which DLSession to fetch.
     * 
    **/
    where?: DLSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DLSessions to fetch.
     * 
    **/
    orderBy?: Enumerable<DLSessionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DLSessions.
     * 
    **/
    cursor?: DLSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DLSessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DLSessions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DLSessions.
     * 
    **/
    distinct?: Enumerable<DLSessionScalarFieldEnum>
  }

  /**
   * DLSession: findFirst
   */
  export interface DLSessionFindFirstArgs extends DLSessionFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * DLSession findMany
   */
  export type DLSessionFindManyArgs = {
    /**
     * Select specific fields to fetch from the DLSession
     * 
    **/
    select?: DLSessionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: DLSessionInclude | null
    /**
     * Filter, which DLSessions to fetch.
     * 
    **/
    where?: DLSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DLSessions to fetch.
     * 
    **/
    orderBy?: Enumerable<DLSessionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DLSessions.
     * 
    **/
    cursor?: DLSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DLSessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DLSessions.
     * 
    **/
    skip?: number
    distinct?: Enumerable<DLSessionScalarFieldEnum>
  }


  /**
   * DLSession create
   */
  export type DLSessionCreateArgs = {
    /**
     * Select specific fields to fetch from the DLSession
     * 
    **/
    select?: DLSessionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: DLSessionInclude | null
    /**
     * The data needed to create a DLSession.
     * 
    **/
    data: XOR<DLSessionCreateInput, DLSessionUncheckedCreateInput>
  }


  /**
   * DLSession createMany
   */
  export type DLSessionCreateManyArgs = {
    /**
     * The data used to create many DLSessions.
     * 
    **/
    data: Enumerable<DLSessionCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * DLSession update
   */
  export type DLSessionUpdateArgs = {
    /**
     * Select specific fields to fetch from the DLSession
     * 
    **/
    select?: DLSessionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: DLSessionInclude | null
    /**
     * The data needed to update a DLSession.
     * 
    **/
    data: XOR<DLSessionUpdateInput, DLSessionUncheckedUpdateInput>
    /**
     * Choose, which DLSession to update.
     * 
    **/
    where: DLSessionWhereUniqueInput
  }


  /**
   * DLSession updateMany
   */
  export type DLSessionUpdateManyArgs = {
    /**
     * The data used to update DLSessions.
     * 
    **/
    data: XOR<DLSessionUpdateManyMutationInput, DLSessionUncheckedUpdateManyInput>
    /**
     * Filter which DLSessions to update
     * 
    **/
    where?: DLSessionWhereInput
  }


  /**
   * DLSession upsert
   */
  export type DLSessionUpsertArgs = {
    /**
     * Select specific fields to fetch from the DLSession
     * 
    **/
    select?: DLSessionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: DLSessionInclude | null
    /**
     * The filter to search for the DLSession to update in case it exists.
     * 
    **/
    where: DLSessionWhereUniqueInput
    /**
     * In case the DLSession found by the `where` argument doesn't exist, create a new DLSession with this data.
     * 
    **/
    create: XOR<DLSessionCreateInput, DLSessionUncheckedCreateInput>
    /**
     * In case the DLSession was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<DLSessionUpdateInput, DLSessionUncheckedUpdateInput>
  }


  /**
   * DLSession delete
   */
  export type DLSessionDeleteArgs = {
    /**
     * Select specific fields to fetch from the DLSession
     * 
    **/
    select?: DLSessionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: DLSessionInclude | null
    /**
     * Filter which DLSession to delete.
     * 
    **/
    where: DLSessionWhereUniqueInput
  }


  /**
   * DLSession deleteMany
   */
  export type DLSessionDeleteManyArgs = {
    /**
     * Filter which DLSessions to delete
     * 
    **/
    where?: DLSessionWhereInput
  }


  /**
   * DLSession: findUniqueOrThrow
   */
  export type DLSessionFindUniqueOrThrowArgs = DLSessionFindUniqueArgsBase
      

  /**
   * DLSession: findFirstOrThrow
   */
  export type DLSessionFindFirstOrThrowArgs = DLSessionFindFirstArgsBase
      

  /**
   * DLSession without action
   */
  export type DLSessionArgs = {
    /**
     * Select specific fields to fetch from the DLSession
     * 
    **/
    select?: DLSessionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: DLSessionInclude | null
  }



  /**
   * Model Epic
   */


  export type AggregateEpic = {
    _count: EpicCountAggregateOutputType | null
    _min: EpicMinAggregateOutputType | null
    _max: EpicMaxAggregateOutputType | null
  }

  export type EpicMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    description: string | null
  }

  export type EpicMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    description: string | null
  }

  export type EpicCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    name: number
    description: number
    _all: number
  }


  export type EpicMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    description?: true
  }

  export type EpicMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    description?: true
  }

  export type EpicCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    description?: true
    _all?: true
  }

  export type EpicAggregateArgs = {
    /**
     * Filter which Epic to aggregate.
     * 
    **/
    where?: EpicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Epics to fetch.
     * 
    **/
    orderBy?: Enumerable<EpicOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: EpicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Epics from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Epics.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Epics
    **/
    _count?: true | EpicCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EpicMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EpicMaxAggregateInputType
  }

  export type GetEpicAggregateType<T extends EpicAggregateArgs> = {
        [P in keyof T & keyof AggregateEpic]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEpic[P]>
      : GetScalarType<T[P], AggregateEpic[P]>
  }




  export type EpicGroupByArgs = {
    where?: EpicWhereInput
    orderBy?: Enumerable<EpicOrderByWithAggregationInput>
    by: Array<EpicScalarFieldEnum>
    having?: EpicScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EpicCountAggregateInputType | true
    _min?: EpicMinAggregateInputType
    _max?: EpicMaxAggregateInputType
  }


  export type EpicGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    name: string
    description: string
    _count: EpicCountAggregateOutputType | null
    _min: EpicMinAggregateOutputType | null
    _max: EpicMaxAggregateOutputType | null
  }

  type GetEpicGroupByPayload<T extends EpicGroupByArgs> = PrismaPromise<
    Array<
      PickArray<EpicGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EpicGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EpicGroupByOutputType[P]>
            : GetScalarType<T[P], EpicGroupByOutputType[P]>
        }
      >
    >


  export type EpicSelect = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    description?: boolean
    Project?: boolean | ProjectFindManyArgs
    _count?: boolean | EpicCountOutputTypeArgs
  }

  export type EpicInclude = {
    Project?: boolean | ProjectFindManyArgs
    _count?: boolean | EpicCountOutputTypeArgs
  }

  export type EpicGetPayload<
    S extends boolean | null | undefined | EpicArgs,
    U = keyof S
      > = S extends true
        ? Epic
    : S extends undefined
    ? never
    : S extends EpicArgs | EpicFindManyArgs
    ?'include' extends U
    ? Epic  & {
    [P in TrueKeys<S['include']>]:
        P extends 'Project' ? Array < ProjectGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends '_count' ? EpicCountOutputTypeGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'Project' ? Array < ProjectGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends '_count' ? EpicCountOutputTypeGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof Epic ? Epic[P] : never
  } 
    : Epic
  : Epic


  type EpicCountArgs = Merge<
    Omit<EpicFindManyArgs, 'select' | 'include'> & {
      select?: EpicCountAggregateInputType | true
    }
  >

  export interface EpicDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one Epic that matches the filter.
     * @param {EpicFindUniqueArgs} args - Arguments to find a Epic
     * @example
     * // Get one Epic
     * const epic = await prisma.epic.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends EpicFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, EpicFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Epic'> extends True ? CheckSelect<T, Prisma__EpicClient<Epic>, Prisma__EpicClient<EpicGetPayload<T>>> : CheckSelect<T, Prisma__EpicClient<Epic | null, null>, Prisma__EpicClient<EpicGetPayload<T> | null, null>>

    /**
     * Find the first Epic that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EpicFindFirstArgs} args - Arguments to find a Epic
     * @example
     * // Get one Epic
     * const epic = await prisma.epic.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends EpicFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, EpicFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Epic'> extends True ? CheckSelect<T, Prisma__EpicClient<Epic>, Prisma__EpicClient<EpicGetPayload<T>>> : CheckSelect<T, Prisma__EpicClient<Epic | null, null>, Prisma__EpicClient<EpicGetPayload<T> | null, null>>

    /**
     * Find zero or more Epics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EpicFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Epics
     * const epics = await prisma.epic.findMany()
     * 
     * // Get first 10 Epics
     * const epics = await prisma.epic.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const epicWithIdOnly = await prisma.epic.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends EpicFindManyArgs>(
      args?: SelectSubset<T, EpicFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<Epic>>, PrismaPromise<Array<EpicGetPayload<T>>>>

    /**
     * Create a Epic.
     * @param {EpicCreateArgs} args - Arguments to create a Epic.
     * @example
     * // Create one Epic
     * const Epic = await prisma.epic.create({
     *   data: {
     *     // ... data to create a Epic
     *   }
     * })
     * 
    **/
    create<T extends EpicCreateArgs>(
      args: SelectSubset<T, EpicCreateArgs>
    ): CheckSelect<T, Prisma__EpicClient<Epic>, Prisma__EpicClient<EpicGetPayload<T>>>

    /**
     * Create many Epics.
     *     @param {EpicCreateManyArgs} args - Arguments to create many Epics.
     *     @example
     *     // Create many Epics
     *     const epic = await prisma.epic.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends EpicCreateManyArgs>(
      args?: SelectSubset<T, EpicCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Epic.
     * @param {EpicDeleteArgs} args - Arguments to delete one Epic.
     * @example
     * // Delete one Epic
     * const Epic = await prisma.epic.delete({
     *   where: {
     *     // ... filter to delete one Epic
     *   }
     * })
     * 
    **/
    delete<T extends EpicDeleteArgs>(
      args: SelectSubset<T, EpicDeleteArgs>
    ): CheckSelect<T, Prisma__EpicClient<Epic>, Prisma__EpicClient<EpicGetPayload<T>>>

    /**
     * Update one Epic.
     * @param {EpicUpdateArgs} args - Arguments to update one Epic.
     * @example
     * // Update one Epic
     * const epic = await prisma.epic.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends EpicUpdateArgs>(
      args: SelectSubset<T, EpicUpdateArgs>
    ): CheckSelect<T, Prisma__EpicClient<Epic>, Prisma__EpicClient<EpicGetPayload<T>>>

    /**
     * Delete zero or more Epics.
     * @param {EpicDeleteManyArgs} args - Arguments to filter Epics to delete.
     * @example
     * // Delete a few Epics
     * const { count } = await prisma.epic.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends EpicDeleteManyArgs>(
      args?: SelectSubset<T, EpicDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Epics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EpicUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Epics
     * const epic = await prisma.epic.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends EpicUpdateManyArgs>(
      args: SelectSubset<T, EpicUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Epic.
     * @param {EpicUpsertArgs} args - Arguments to update or create a Epic.
     * @example
     * // Update or create a Epic
     * const epic = await prisma.epic.upsert({
     *   create: {
     *     // ... data to create a Epic
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Epic we want to update
     *   }
     * })
    **/
    upsert<T extends EpicUpsertArgs>(
      args: SelectSubset<T, EpicUpsertArgs>
    ): CheckSelect<T, Prisma__EpicClient<Epic>, Prisma__EpicClient<EpicGetPayload<T>>>

    /**
     * Find one Epic that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {EpicFindUniqueOrThrowArgs} args - Arguments to find a Epic
     * @example
     * // Get one Epic
     * const epic = await prisma.epic.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends EpicFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, EpicFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__EpicClient<Epic>, Prisma__EpicClient<EpicGetPayload<T>>>

    /**
     * Find the first Epic that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EpicFindFirstOrThrowArgs} args - Arguments to find a Epic
     * @example
     * // Get one Epic
     * const epic = await prisma.epic.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends EpicFindFirstOrThrowArgs>(
      args?: SelectSubset<T, EpicFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__EpicClient<Epic>, Prisma__EpicClient<EpicGetPayload<T>>>

    /**
     * Count the number of Epics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EpicCountArgs} args - Arguments to filter Epics to count.
     * @example
     * // Count the number of Epics
     * const count = await prisma.epic.count({
     *   where: {
     *     // ... the filter for the Epics we want to count
     *   }
     * })
    **/
    count<T extends EpicCountArgs>(
      args?: Subset<T, EpicCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EpicCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Epic.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EpicAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EpicAggregateArgs>(args: Subset<T, EpicAggregateArgs>): PrismaPromise<GetEpicAggregateType<T>>

    /**
     * Group by Epic.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EpicGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EpicGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EpicGroupByArgs['orderBy'] }
        : { orderBy?: EpicGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EpicGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEpicGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Epic.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__EpicClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    Project<T extends ProjectFindManyArgs = {}>(args?: Subset<T, ProjectFindManyArgs>): CheckSelect<T, PrismaPromise<Array<Project>| Null>, PrismaPromise<Array<ProjectGetPayload<T>>| Null>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Epic base type for findUnique actions
   */
  export type EpicFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Epic
     * 
    **/
    select?: EpicSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EpicInclude | null
    /**
     * Filter, which Epic to fetch.
     * 
    **/
    where: EpicWhereUniqueInput
  }

  /**
   * Epic: findUnique
   */
  export interface EpicFindUniqueArgs extends EpicFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Epic base type for findFirst actions
   */
  export type EpicFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Epic
     * 
    **/
    select?: EpicSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EpicInclude | null
    /**
     * Filter, which Epic to fetch.
     * 
    **/
    where?: EpicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Epics to fetch.
     * 
    **/
    orderBy?: Enumerable<EpicOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Epics.
     * 
    **/
    cursor?: EpicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Epics from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Epics.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Epics.
     * 
    **/
    distinct?: Enumerable<EpicScalarFieldEnum>
  }

  /**
   * Epic: findFirst
   */
  export interface EpicFindFirstArgs extends EpicFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Epic findMany
   */
  export type EpicFindManyArgs = {
    /**
     * Select specific fields to fetch from the Epic
     * 
    **/
    select?: EpicSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EpicInclude | null
    /**
     * Filter, which Epics to fetch.
     * 
    **/
    where?: EpicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Epics to fetch.
     * 
    **/
    orderBy?: Enumerable<EpicOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Epics.
     * 
    **/
    cursor?: EpicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Epics from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Epics.
     * 
    **/
    skip?: number
    distinct?: Enumerable<EpicScalarFieldEnum>
  }


  /**
   * Epic create
   */
  export type EpicCreateArgs = {
    /**
     * Select specific fields to fetch from the Epic
     * 
    **/
    select?: EpicSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EpicInclude | null
    /**
     * The data needed to create a Epic.
     * 
    **/
    data: XOR<EpicCreateInput, EpicUncheckedCreateInput>
  }


  /**
   * Epic createMany
   */
  export type EpicCreateManyArgs = {
    /**
     * The data used to create many Epics.
     * 
    **/
    data: Enumerable<EpicCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Epic update
   */
  export type EpicUpdateArgs = {
    /**
     * Select specific fields to fetch from the Epic
     * 
    **/
    select?: EpicSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EpicInclude | null
    /**
     * The data needed to update a Epic.
     * 
    **/
    data: XOR<EpicUpdateInput, EpicUncheckedUpdateInput>
    /**
     * Choose, which Epic to update.
     * 
    **/
    where: EpicWhereUniqueInput
  }


  /**
   * Epic updateMany
   */
  export type EpicUpdateManyArgs = {
    /**
     * The data used to update Epics.
     * 
    **/
    data: XOR<EpicUpdateManyMutationInput, EpicUncheckedUpdateManyInput>
    /**
     * Filter which Epics to update
     * 
    **/
    where?: EpicWhereInput
  }


  /**
   * Epic upsert
   */
  export type EpicUpsertArgs = {
    /**
     * Select specific fields to fetch from the Epic
     * 
    **/
    select?: EpicSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EpicInclude | null
    /**
     * The filter to search for the Epic to update in case it exists.
     * 
    **/
    where: EpicWhereUniqueInput
    /**
     * In case the Epic found by the `where` argument doesn't exist, create a new Epic with this data.
     * 
    **/
    create: XOR<EpicCreateInput, EpicUncheckedCreateInput>
    /**
     * In case the Epic was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<EpicUpdateInput, EpicUncheckedUpdateInput>
  }


  /**
   * Epic delete
   */
  export type EpicDeleteArgs = {
    /**
     * Select specific fields to fetch from the Epic
     * 
    **/
    select?: EpicSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EpicInclude | null
    /**
     * Filter which Epic to delete.
     * 
    **/
    where: EpicWhereUniqueInput
  }


  /**
   * Epic deleteMany
   */
  export type EpicDeleteManyArgs = {
    /**
     * Filter which Epics to delete
     * 
    **/
    where?: EpicWhereInput
  }


  /**
   * Epic: findUniqueOrThrow
   */
  export type EpicFindUniqueOrThrowArgs = EpicFindUniqueArgsBase
      

  /**
   * Epic: findFirstOrThrow
   */
  export type EpicFindFirstOrThrowArgs = EpicFindFirstArgsBase
      

  /**
   * Epic without action
   */
  export type EpicArgs = {
    /**
     * Select specific fields to fetch from the Epic
     * 
    **/
    select?: EpicSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: EpicInclude | null
  }



  /**
   * Model ExtractedResource
   */


  export type AggregateExtractedResource = {
    _count: ExtractedResourceCountAggregateOutputType | null
    _min: ExtractedResourceMinAggregateOutputType | null
    _max: ExtractedResourceMaxAggregateOutputType | null
  }

  export type ExtractedResourceMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    rawResourceId: string | null
  }

  export type ExtractedResourceMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    rawResourceId: string | null
  }

  export type ExtractedResourceCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    metadata: number
    rawResourceId: number
    _all: number
  }


  export type ExtractedResourceMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    rawResourceId?: true
  }

  export type ExtractedResourceMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    rawResourceId?: true
  }

  export type ExtractedResourceCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    metadata?: true
    rawResourceId?: true
    _all?: true
  }

  export type ExtractedResourceAggregateArgs = {
    /**
     * Filter which ExtractedResource to aggregate.
     * 
    **/
    where?: ExtractedResourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExtractedResources to fetch.
     * 
    **/
    orderBy?: Enumerable<ExtractedResourceOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: ExtractedResourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExtractedResources from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExtractedResources.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExtractedResources
    **/
    _count?: true | ExtractedResourceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExtractedResourceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExtractedResourceMaxAggregateInputType
  }

  export type GetExtractedResourceAggregateType<T extends ExtractedResourceAggregateArgs> = {
        [P in keyof T & keyof AggregateExtractedResource]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExtractedResource[P]>
      : GetScalarType<T[P], AggregateExtractedResource[P]>
  }




  export type ExtractedResourceGroupByArgs = {
    where?: ExtractedResourceWhereInput
    orderBy?: Enumerable<ExtractedResourceOrderByWithAggregationInput>
    by: Array<ExtractedResourceScalarFieldEnum>
    having?: ExtractedResourceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExtractedResourceCountAggregateInputType | true
    _min?: ExtractedResourceMinAggregateInputType
    _max?: ExtractedResourceMaxAggregateInputType
  }


  export type ExtractedResourceGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    metadata: JsonValue
    rawResourceId: string
    _count: ExtractedResourceCountAggregateOutputType | null
    _min: ExtractedResourceMinAggregateOutputType | null
    _max: ExtractedResourceMaxAggregateOutputType | null
  }

  type GetExtractedResourceGroupByPayload<T extends ExtractedResourceGroupByArgs> = PrismaPromise<
    Array<
      PickArray<ExtractedResourceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExtractedResourceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExtractedResourceGroupByOutputType[P]>
            : GetScalarType<T[P], ExtractedResourceGroupByOutputType[P]>
        }
      >
    >


  export type ExtractedResourceSelect = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    metadata?: boolean
    rawResourceId?: boolean
    RawResource?: boolean | RawResourceArgs
    ExtractedResourcesInCESessions?: boolean | ExtractedResourcesInCESessionsFindManyArgs
    ExtractedResourcesInDLSessions?: boolean | ExtractedResourcesInDLSessionsFindManyArgs
    _count?: boolean | ExtractedResourceCountOutputTypeArgs
  }

  export type ExtractedResourceInclude = {
    RawResource?: boolean | RawResourceArgs
    ExtractedResourcesInCESessions?: boolean | ExtractedResourcesInCESessionsFindManyArgs
    ExtractedResourcesInDLSessions?: boolean | ExtractedResourcesInDLSessionsFindManyArgs
    _count?: boolean | ExtractedResourceCountOutputTypeArgs
  }

  export type ExtractedResourceGetPayload<
    S extends boolean | null | undefined | ExtractedResourceArgs,
    U = keyof S
      > = S extends true
        ? ExtractedResource
    : S extends undefined
    ? never
    : S extends ExtractedResourceArgs | ExtractedResourceFindManyArgs
    ?'include' extends U
    ? ExtractedResource  & {
    [P in TrueKeys<S['include']>]:
        P extends 'RawResource' ? RawResourceGetPayload<Exclude<S['include'], undefined | null>[P]> :
        P extends 'ExtractedResourcesInCESessions' ? Array < ExtractedResourcesInCESessionsGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends 'ExtractedResourcesInDLSessions' ? Array < ExtractedResourcesInDLSessionsGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends '_count' ? ExtractedResourceCountOutputTypeGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'RawResource' ? RawResourceGetPayload<Exclude<S['select'], undefined | null>[P]> :
        P extends 'ExtractedResourcesInCESessions' ? Array < ExtractedResourcesInCESessionsGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends 'ExtractedResourcesInDLSessions' ? Array < ExtractedResourcesInDLSessionsGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends '_count' ? ExtractedResourceCountOutputTypeGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof ExtractedResource ? ExtractedResource[P] : never
  } 
    : ExtractedResource
  : ExtractedResource


  type ExtractedResourceCountArgs = Merge<
    Omit<ExtractedResourceFindManyArgs, 'select' | 'include'> & {
      select?: ExtractedResourceCountAggregateInputType | true
    }
  >

  export interface ExtractedResourceDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one ExtractedResource that matches the filter.
     * @param {ExtractedResourceFindUniqueArgs} args - Arguments to find a ExtractedResource
     * @example
     * // Get one ExtractedResource
     * const extractedResource = await prisma.extractedResource.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends ExtractedResourceFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, ExtractedResourceFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'ExtractedResource'> extends True ? CheckSelect<T, Prisma__ExtractedResourceClient<ExtractedResource>, Prisma__ExtractedResourceClient<ExtractedResourceGetPayload<T>>> : CheckSelect<T, Prisma__ExtractedResourceClient<ExtractedResource | null, null>, Prisma__ExtractedResourceClient<ExtractedResourceGetPayload<T> | null, null>>

    /**
     * Find the first ExtractedResource that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtractedResourceFindFirstArgs} args - Arguments to find a ExtractedResource
     * @example
     * // Get one ExtractedResource
     * const extractedResource = await prisma.extractedResource.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends ExtractedResourceFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, ExtractedResourceFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'ExtractedResource'> extends True ? CheckSelect<T, Prisma__ExtractedResourceClient<ExtractedResource>, Prisma__ExtractedResourceClient<ExtractedResourceGetPayload<T>>> : CheckSelect<T, Prisma__ExtractedResourceClient<ExtractedResource | null, null>, Prisma__ExtractedResourceClient<ExtractedResourceGetPayload<T> | null, null>>

    /**
     * Find zero or more ExtractedResources that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtractedResourceFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExtractedResources
     * const extractedResources = await prisma.extractedResource.findMany()
     * 
     * // Get first 10 ExtractedResources
     * const extractedResources = await prisma.extractedResource.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const extractedResourceWithIdOnly = await prisma.extractedResource.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends ExtractedResourceFindManyArgs>(
      args?: SelectSubset<T, ExtractedResourceFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<ExtractedResource>>, PrismaPromise<Array<ExtractedResourceGetPayload<T>>>>

    /**
     * Create a ExtractedResource.
     * @param {ExtractedResourceCreateArgs} args - Arguments to create a ExtractedResource.
     * @example
     * // Create one ExtractedResource
     * const ExtractedResource = await prisma.extractedResource.create({
     *   data: {
     *     // ... data to create a ExtractedResource
     *   }
     * })
     * 
    **/
    create<T extends ExtractedResourceCreateArgs>(
      args: SelectSubset<T, ExtractedResourceCreateArgs>
    ): CheckSelect<T, Prisma__ExtractedResourceClient<ExtractedResource>, Prisma__ExtractedResourceClient<ExtractedResourceGetPayload<T>>>

    /**
     * Create many ExtractedResources.
     *     @param {ExtractedResourceCreateManyArgs} args - Arguments to create many ExtractedResources.
     *     @example
     *     // Create many ExtractedResources
     *     const extractedResource = await prisma.extractedResource.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends ExtractedResourceCreateManyArgs>(
      args?: SelectSubset<T, ExtractedResourceCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a ExtractedResource.
     * @param {ExtractedResourceDeleteArgs} args - Arguments to delete one ExtractedResource.
     * @example
     * // Delete one ExtractedResource
     * const ExtractedResource = await prisma.extractedResource.delete({
     *   where: {
     *     // ... filter to delete one ExtractedResource
     *   }
     * })
     * 
    **/
    delete<T extends ExtractedResourceDeleteArgs>(
      args: SelectSubset<T, ExtractedResourceDeleteArgs>
    ): CheckSelect<T, Prisma__ExtractedResourceClient<ExtractedResource>, Prisma__ExtractedResourceClient<ExtractedResourceGetPayload<T>>>

    /**
     * Update one ExtractedResource.
     * @param {ExtractedResourceUpdateArgs} args - Arguments to update one ExtractedResource.
     * @example
     * // Update one ExtractedResource
     * const extractedResource = await prisma.extractedResource.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends ExtractedResourceUpdateArgs>(
      args: SelectSubset<T, ExtractedResourceUpdateArgs>
    ): CheckSelect<T, Prisma__ExtractedResourceClient<ExtractedResource>, Prisma__ExtractedResourceClient<ExtractedResourceGetPayload<T>>>

    /**
     * Delete zero or more ExtractedResources.
     * @param {ExtractedResourceDeleteManyArgs} args - Arguments to filter ExtractedResources to delete.
     * @example
     * // Delete a few ExtractedResources
     * const { count } = await prisma.extractedResource.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends ExtractedResourceDeleteManyArgs>(
      args?: SelectSubset<T, ExtractedResourceDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExtractedResources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtractedResourceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExtractedResources
     * const extractedResource = await prisma.extractedResource.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends ExtractedResourceUpdateManyArgs>(
      args: SelectSubset<T, ExtractedResourceUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one ExtractedResource.
     * @param {ExtractedResourceUpsertArgs} args - Arguments to update or create a ExtractedResource.
     * @example
     * // Update or create a ExtractedResource
     * const extractedResource = await prisma.extractedResource.upsert({
     *   create: {
     *     // ... data to create a ExtractedResource
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExtractedResource we want to update
     *   }
     * })
    **/
    upsert<T extends ExtractedResourceUpsertArgs>(
      args: SelectSubset<T, ExtractedResourceUpsertArgs>
    ): CheckSelect<T, Prisma__ExtractedResourceClient<ExtractedResource>, Prisma__ExtractedResourceClient<ExtractedResourceGetPayload<T>>>

    /**
     * Find one ExtractedResource that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {ExtractedResourceFindUniqueOrThrowArgs} args - Arguments to find a ExtractedResource
     * @example
     * // Get one ExtractedResource
     * const extractedResource = await prisma.extractedResource.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends ExtractedResourceFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, ExtractedResourceFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__ExtractedResourceClient<ExtractedResource>, Prisma__ExtractedResourceClient<ExtractedResourceGetPayload<T>>>

    /**
     * Find the first ExtractedResource that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtractedResourceFindFirstOrThrowArgs} args - Arguments to find a ExtractedResource
     * @example
     * // Get one ExtractedResource
     * const extractedResource = await prisma.extractedResource.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends ExtractedResourceFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ExtractedResourceFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__ExtractedResourceClient<ExtractedResource>, Prisma__ExtractedResourceClient<ExtractedResourceGetPayload<T>>>

    /**
     * Count the number of ExtractedResources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtractedResourceCountArgs} args - Arguments to filter ExtractedResources to count.
     * @example
     * // Count the number of ExtractedResources
     * const count = await prisma.extractedResource.count({
     *   where: {
     *     // ... the filter for the ExtractedResources we want to count
     *   }
     * })
    **/
    count<T extends ExtractedResourceCountArgs>(
      args?: Subset<T, ExtractedResourceCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExtractedResourceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExtractedResource.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtractedResourceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExtractedResourceAggregateArgs>(args: Subset<T, ExtractedResourceAggregateArgs>): PrismaPromise<GetExtractedResourceAggregateType<T>>

    /**
     * Group by ExtractedResource.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtractedResourceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExtractedResourceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExtractedResourceGroupByArgs['orderBy'] }
        : { orderBy?: ExtractedResourceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExtractedResourceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExtractedResourceGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for ExtractedResource.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__ExtractedResourceClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    RawResource<T extends RawResourceArgs = {}>(args?: Subset<T, RawResourceArgs>): CheckSelect<T, Prisma__RawResourceClient<RawResource | Null>, Prisma__RawResourceClient<RawResourceGetPayload<T> | Null>>;

    ExtractedResourcesInCESessions<T extends ExtractedResourcesInCESessionsFindManyArgs = {}>(args?: Subset<T, ExtractedResourcesInCESessionsFindManyArgs>): CheckSelect<T, PrismaPromise<Array<ExtractedResourcesInCESessions>| Null>, PrismaPromise<Array<ExtractedResourcesInCESessionsGetPayload<T>>| Null>>;

    ExtractedResourcesInDLSessions<T extends ExtractedResourcesInDLSessionsFindManyArgs = {}>(args?: Subset<T, ExtractedResourcesInDLSessionsFindManyArgs>): CheckSelect<T, PrismaPromise<Array<ExtractedResourcesInDLSessions>| Null>, PrismaPromise<Array<ExtractedResourcesInDLSessionsGetPayload<T>>| Null>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * ExtractedResource base type for findUnique actions
   */
  export type ExtractedResourceFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the ExtractedResource
     * 
    **/
    select?: ExtractedResourceSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ExtractedResourceInclude | null
    /**
     * Filter, which ExtractedResource to fetch.
     * 
    **/
    where: ExtractedResourceWhereUniqueInput
  }

  /**
   * ExtractedResource: findUnique
   */
  export interface ExtractedResourceFindUniqueArgs extends ExtractedResourceFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * ExtractedResource base type for findFirst actions
   */
  export type ExtractedResourceFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the ExtractedResource
     * 
    **/
    select?: ExtractedResourceSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ExtractedResourceInclude | null
    /**
     * Filter, which ExtractedResource to fetch.
     * 
    **/
    where?: ExtractedResourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExtractedResources to fetch.
     * 
    **/
    orderBy?: Enumerable<ExtractedResourceOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExtractedResources.
     * 
    **/
    cursor?: ExtractedResourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExtractedResources from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExtractedResources.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExtractedResources.
     * 
    **/
    distinct?: Enumerable<ExtractedResourceScalarFieldEnum>
  }

  /**
   * ExtractedResource: findFirst
   */
  export interface ExtractedResourceFindFirstArgs extends ExtractedResourceFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * ExtractedResource findMany
   */
  export type ExtractedResourceFindManyArgs = {
    /**
     * Select specific fields to fetch from the ExtractedResource
     * 
    **/
    select?: ExtractedResourceSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ExtractedResourceInclude | null
    /**
     * Filter, which ExtractedResources to fetch.
     * 
    **/
    where?: ExtractedResourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExtractedResources to fetch.
     * 
    **/
    orderBy?: Enumerable<ExtractedResourceOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExtractedResources.
     * 
    **/
    cursor?: ExtractedResourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExtractedResources from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExtractedResources.
     * 
    **/
    skip?: number
    distinct?: Enumerable<ExtractedResourceScalarFieldEnum>
  }


  /**
   * ExtractedResource create
   */
  export type ExtractedResourceCreateArgs = {
    /**
     * Select specific fields to fetch from the ExtractedResource
     * 
    **/
    select?: ExtractedResourceSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ExtractedResourceInclude | null
    /**
     * The data needed to create a ExtractedResource.
     * 
    **/
    data: XOR<ExtractedResourceCreateInput, ExtractedResourceUncheckedCreateInput>
  }


  /**
   * ExtractedResource createMany
   */
  export type ExtractedResourceCreateManyArgs = {
    /**
     * The data used to create many ExtractedResources.
     * 
    **/
    data: Enumerable<ExtractedResourceCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * ExtractedResource update
   */
  export type ExtractedResourceUpdateArgs = {
    /**
     * Select specific fields to fetch from the ExtractedResource
     * 
    **/
    select?: ExtractedResourceSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ExtractedResourceInclude | null
    /**
     * The data needed to update a ExtractedResource.
     * 
    **/
    data: XOR<ExtractedResourceUpdateInput, ExtractedResourceUncheckedUpdateInput>
    /**
     * Choose, which ExtractedResource to update.
     * 
    **/
    where: ExtractedResourceWhereUniqueInput
  }


  /**
   * ExtractedResource updateMany
   */
  export type ExtractedResourceUpdateManyArgs = {
    /**
     * The data used to update ExtractedResources.
     * 
    **/
    data: XOR<ExtractedResourceUpdateManyMutationInput, ExtractedResourceUncheckedUpdateManyInput>
    /**
     * Filter which ExtractedResources to update
     * 
    **/
    where?: ExtractedResourceWhereInput
  }


  /**
   * ExtractedResource upsert
   */
  export type ExtractedResourceUpsertArgs = {
    /**
     * Select specific fields to fetch from the ExtractedResource
     * 
    **/
    select?: ExtractedResourceSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ExtractedResourceInclude | null
    /**
     * The filter to search for the ExtractedResource to update in case it exists.
     * 
    **/
    where: ExtractedResourceWhereUniqueInput
    /**
     * In case the ExtractedResource found by the `where` argument doesn't exist, create a new ExtractedResource with this data.
     * 
    **/
    create: XOR<ExtractedResourceCreateInput, ExtractedResourceUncheckedCreateInput>
    /**
     * In case the ExtractedResource was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<ExtractedResourceUpdateInput, ExtractedResourceUncheckedUpdateInput>
  }


  /**
   * ExtractedResource delete
   */
  export type ExtractedResourceDeleteArgs = {
    /**
     * Select specific fields to fetch from the ExtractedResource
     * 
    **/
    select?: ExtractedResourceSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ExtractedResourceInclude | null
    /**
     * Filter which ExtractedResource to delete.
     * 
    **/
    where: ExtractedResourceWhereUniqueInput
  }


  /**
   * ExtractedResource deleteMany
   */
  export type ExtractedResourceDeleteManyArgs = {
    /**
     * Filter which ExtractedResources to delete
     * 
    **/
    where?: ExtractedResourceWhereInput
  }


  /**
   * ExtractedResource: findUniqueOrThrow
   */
  export type ExtractedResourceFindUniqueOrThrowArgs = ExtractedResourceFindUniqueArgsBase
      

  /**
   * ExtractedResource: findFirstOrThrow
   */
  export type ExtractedResourceFindFirstOrThrowArgs = ExtractedResourceFindFirstArgsBase
      

  /**
   * ExtractedResource without action
   */
  export type ExtractedResourceArgs = {
    /**
     * Select specific fields to fetch from the ExtractedResource
     * 
    **/
    select?: ExtractedResourceSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ExtractedResourceInclude | null
  }



  /**
   * Model ExtractedResourcesInCESessions
   */


  export type AggregateExtractedResourcesInCESessions = {
    _count: ExtractedResourcesInCESessionsCountAggregateOutputType | null
    _avg: ExtractedResourcesInCESessionsAvgAggregateOutputType | null
    _sum: ExtractedResourcesInCESessionsSumAggregateOutputType | null
    _min: ExtractedResourcesInCESessionsMinAggregateOutputType | null
    _max: ExtractedResourcesInCESessionsMaxAggregateOutputType | null
  }

  export type ExtractedResourcesInCESessionsAvgAggregateOutputType = {
    index: number | null
  }

  export type ExtractedResourcesInCESessionsSumAggregateOutputType = {
    index: number | null
  }

  export type ExtractedResourcesInCESessionsMinAggregateOutputType = {
    extractedResourceId: string | null
    cESessionId: string | null
    index: number | null
    status: ExtractedResourceStatus | null
  }

  export type ExtractedResourcesInCESessionsMaxAggregateOutputType = {
    extractedResourceId: string | null
    cESessionId: string | null
    index: number | null
    status: ExtractedResourceStatus | null
  }

  export type ExtractedResourcesInCESessionsCountAggregateOutputType = {
    extractedResourceId: number
    cESessionId: number
    index: number
    status: number
    result: number
    _all: number
  }


  export type ExtractedResourcesInCESessionsAvgAggregateInputType = {
    index?: true
  }

  export type ExtractedResourcesInCESessionsSumAggregateInputType = {
    index?: true
  }

  export type ExtractedResourcesInCESessionsMinAggregateInputType = {
    extractedResourceId?: true
    cESessionId?: true
    index?: true
    status?: true
  }

  export type ExtractedResourcesInCESessionsMaxAggregateInputType = {
    extractedResourceId?: true
    cESessionId?: true
    index?: true
    status?: true
  }

  export type ExtractedResourcesInCESessionsCountAggregateInputType = {
    extractedResourceId?: true
    cESessionId?: true
    index?: true
    status?: true
    result?: true
    _all?: true
  }

  export type ExtractedResourcesInCESessionsAggregateArgs = {
    /**
     * Filter which ExtractedResourcesInCESessions to aggregate.
     * 
    **/
    where?: ExtractedResourcesInCESessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExtractedResourcesInCESessions to fetch.
     * 
    **/
    orderBy?: Enumerable<ExtractedResourcesInCESessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: ExtractedResourcesInCESessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExtractedResourcesInCESessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExtractedResourcesInCESessions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExtractedResourcesInCESessions
    **/
    _count?: true | ExtractedResourcesInCESessionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExtractedResourcesInCESessionsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExtractedResourcesInCESessionsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExtractedResourcesInCESessionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExtractedResourcesInCESessionsMaxAggregateInputType
  }

  export type GetExtractedResourcesInCESessionsAggregateType<T extends ExtractedResourcesInCESessionsAggregateArgs> = {
        [P in keyof T & keyof AggregateExtractedResourcesInCESessions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExtractedResourcesInCESessions[P]>
      : GetScalarType<T[P], AggregateExtractedResourcesInCESessions[P]>
  }




  export type ExtractedResourcesInCESessionsGroupByArgs = {
    where?: ExtractedResourcesInCESessionsWhereInput
    orderBy?: Enumerable<ExtractedResourcesInCESessionsOrderByWithAggregationInput>
    by: Array<ExtractedResourcesInCESessionsScalarFieldEnum>
    having?: ExtractedResourcesInCESessionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExtractedResourcesInCESessionsCountAggregateInputType | true
    _avg?: ExtractedResourcesInCESessionsAvgAggregateInputType
    _sum?: ExtractedResourcesInCESessionsSumAggregateInputType
    _min?: ExtractedResourcesInCESessionsMinAggregateInputType
    _max?: ExtractedResourcesInCESessionsMaxAggregateInputType
  }


  export type ExtractedResourcesInCESessionsGroupByOutputType = {
    extractedResourceId: string
    cESessionId: string
    index: number
    status: ExtractedResourceStatus
    result: JsonValue
    _count: ExtractedResourcesInCESessionsCountAggregateOutputType | null
    _avg: ExtractedResourcesInCESessionsAvgAggregateOutputType | null
    _sum: ExtractedResourcesInCESessionsSumAggregateOutputType | null
    _min: ExtractedResourcesInCESessionsMinAggregateOutputType | null
    _max: ExtractedResourcesInCESessionsMaxAggregateOutputType | null
  }

  type GetExtractedResourcesInCESessionsGroupByPayload<T extends ExtractedResourcesInCESessionsGroupByArgs> = PrismaPromise<
    Array<
      PickArray<ExtractedResourcesInCESessionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExtractedResourcesInCESessionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExtractedResourcesInCESessionsGroupByOutputType[P]>
            : GetScalarType<T[P], ExtractedResourcesInCESessionsGroupByOutputType[P]>
        }
      >
    >


  export type ExtractedResourcesInCESessionsSelect = {
    extractedResourceId?: boolean
    cESessionId?: boolean
    index?: boolean
    status?: boolean
    result?: boolean
    CESession?: boolean | CESessionArgs
    ExtractedResource?: boolean | ExtractedResourceArgs
  }

  export type ExtractedResourcesInCESessionsInclude = {
    CESession?: boolean | CESessionArgs
    ExtractedResource?: boolean | ExtractedResourceArgs
  }

  export type ExtractedResourcesInCESessionsGetPayload<
    S extends boolean | null | undefined | ExtractedResourcesInCESessionsArgs,
    U = keyof S
      > = S extends true
        ? ExtractedResourcesInCESessions
    : S extends undefined
    ? never
    : S extends ExtractedResourcesInCESessionsArgs | ExtractedResourcesInCESessionsFindManyArgs
    ?'include' extends U
    ? ExtractedResourcesInCESessions  & {
    [P in TrueKeys<S['include']>]:
        P extends 'CESession' ? CESessionGetPayload<Exclude<S['include'], undefined | null>[P]> :
        P extends 'ExtractedResource' ? ExtractedResourceGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'CESession' ? CESessionGetPayload<Exclude<S['select'], undefined | null>[P]> :
        P extends 'ExtractedResource' ? ExtractedResourceGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof ExtractedResourcesInCESessions ? ExtractedResourcesInCESessions[P] : never
  } 
    : ExtractedResourcesInCESessions
  : ExtractedResourcesInCESessions


  type ExtractedResourcesInCESessionsCountArgs = Merge<
    Omit<ExtractedResourcesInCESessionsFindManyArgs, 'select' | 'include'> & {
      select?: ExtractedResourcesInCESessionsCountAggregateInputType | true
    }
  >

  export interface ExtractedResourcesInCESessionsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one ExtractedResourcesInCESessions that matches the filter.
     * @param {ExtractedResourcesInCESessionsFindUniqueArgs} args - Arguments to find a ExtractedResourcesInCESessions
     * @example
     * // Get one ExtractedResourcesInCESessions
     * const extractedResourcesInCESessions = await prisma.extractedResourcesInCESessions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends ExtractedResourcesInCESessionsFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, ExtractedResourcesInCESessionsFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'ExtractedResourcesInCESessions'> extends True ? CheckSelect<T, Prisma__ExtractedResourcesInCESessionsClient<ExtractedResourcesInCESessions>, Prisma__ExtractedResourcesInCESessionsClient<ExtractedResourcesInCESessionsGetPayload<T>>> : CheckSelect<T, Prisma__ExtractedResourcesInCESessionsClient<ExtractedResourcesInCESessions | null, null>, Prisma__ExtractedResourcesInCESessionsClient<ExtractedResourcesInCESessionsGetPayload<T> | null, null>>

    /**
     * Find the first ExtractedResourcesInCESessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtractedResourcesInCESessionsFindFirstArgs} args - Arguments to find a ExtractedResourcesInCESessions
     * @example
     * // Get one ExtractedResourcesInCESessions
     * const extractedResourcesInCESessions = await prisma.extractedResourcesInCESessions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends ExtractedResourcesInCESessionsFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, ExtractedResourcesInCESessionsFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'ExtractedResourcesInCESessions'> extends True ? CheckSelect<T, Prisma__ExtractedResourcesInCESessionsClient<ExtractedResourcesInCESessions>, Prisma__ExtractedResourcesInCESessionsClient<ExtractedResourcesInCESessionsGetPayload<T>>> : CheckSelect<T, Prisma__ExtractedResourcesInCESessionsClient<ExtractedResourcesInCESessions | null, null>, Prisma__ExtractedResourcesInCESessionsClient<ExtractedResourcesInCESessionsGetPayload<T> | null, null>>

    /**
     * Find zero or more ExtractedResourcesInCESessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtractedResourcesInCESessionsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExtractedResourcesInCESessions
     * const extractedResourcesInCESessions = await prisma.extractedResourcesInCESessions.findMany()
     * 
     * // Get first 10 ExtractedResourcesInCESessions
     * const extractedResourcesInCESessions = await prisma.extractedResourcesInCESessions.findMany({ take: 10 })
     * 
     * // Only select the `extractedResourceId`
     * const extractedResourcesInCESessionsWithExtractedResourceIdOnly = await prisma.extractedResourcesInCESessions.findMany({ select: { extractedResourceId: true } })
     * 
    **/
    findMany<T extends ExtractedResourcesInCESessionsFindManyArgs>(
      args?: SelectSubset<T, ExtractedResourcesInCESessionsFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<ExtractedResourcesInCESessions>>, PrismaPromise<Array<ExtractedResourcesInCESessionsGetPayload<T>>>>

    /**
     * Create a ExtractedResourcesInCESessions.
     * @param {ExtractedResourcesInCESessionsCreateArgs} args - Arguments to create a ExtractedResourcesInCESessions.
     * @example
     * // Create one ExtractedResourcesInCESessions
     * const ExtractedResourcesInCESessions = await prisma.extractedResourcesInCESessions.create({
     *   data: {
     *     // ... data to create a ExtractedResourcesInCESessions
     *   }
     * })
     * 
    **/
    create<T extends ExtractedResourcesInCESessionsCreateArgs>(
      args: SelectSubset<T, ExtractedResourcesInCESessionsCreateArgs>
    ): CheckSelect<T, Prisma__ExtractedResourcesInCESessionsClient<ExtractedResourcesInCESessions>, Prisma__ExtractedResourcesInCESessionsClient<ExtractedResourcesInCESessionsGetPayload<T>>>

    /**
     * Create many ExtractedResourcesInCESessions.
     *     @param {ExtractedResourcesInCESessionsCreateManyArgs} args - Arguments to create many ExtractedResourcesInCESessions.
     *     @example
     *     // Create many ExtractedResourcesInCESessions
     *     const extractedResourcesInCESessions = await prisma.extractedResourcesInCESessions.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends ExtractedResourcesInCESessionsCreateManyArgs>(
      args?: SelectSubset<T, ExtractedResourcesInCESessionsCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a ExtractedResourcesInCESessions.
     * @param {ExtractedResourcesInCESessionsDeleteArgs} args - Arguments to delete one ExtractedResourcesInCESessions.
     * @example
     * // Delete one ExtractedResourcesInCESessions
     * const ExtractedResourcesInCESessions = await prisma.extractedResourcesInCESessions.delete({
     *   where: {
     *     // ... filter to delete one ExtractedResourcesInCESessions
     *   }
     * })
     * 
    **/
    delete<T extends ExtractedResourcesInCESessionsDeleteArgs>(
      args: SelectSubset<T, ExtractedResourcesInCESessionsDeleteArgs>
    ): CheckSelect<T, Prisma__ExtractedResourcesInCESessionsClient<ExtractedResourcesInCESessions>, Prisma__ExtractedResourcesInCESessionsClient<ExtractedResourcesInCESessionsGetPayload<T>>>

    /**
     * Update one ExtractedResourcesInCESessions.
     * @param {ExtractedResourcesInCESessionsUpdateArgs} args - Arguments to update one ExtractedResourcesInCESessions.
     * @example
     * // Update one ExtractedResourcesInCESessions
     * const extractedResourcesInCESessions = await prisma.extractedResourcesInCESessions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends ExtractedResourcesInCESessionsUpdateArgs>(
      args: SelectSubset<T, ExtractedResourcesInCESessionsUpdateArgs>
    ): CheckSelect<T, Prisma__ExtractedResourcesInCESessionsClient<ExtractedResourcesInCESessions>, Prisma__ExtractedResourcesInCESessionsClient<ExtractedResourcesInCESessionsGetPayload<T>>>

    /**
     * Delete zero or more ExtractedResourcesInCESessions.
     * @param {ExtractedResourcesInCESessionsDeleteManyArgs} args - Arguments to filter ExtractedResourcesInCESessions to delete.
     * @example
     * // Delete a few ExtractedResourcesInCESessions
     * const { count } = await prisma.extractedResourcesInCESessions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends ExtractedResourcesInCESessionsDeleteManyArgs>(
      args?: SelectSubset<T, ExtractedResourcesInCESessionsDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExtractedResourcesInCESessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtractedResourcesInCESessionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExtractedResourcesInCESessions
     * const extractedResourcesInCESessions = await prisma.extractedResourcesInCESessions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends ExtractedResourcesInCESessionsUpdateManyArgs>(
      args: SelectSubset<T, ExtractedResourcesInCESessionsUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one ExtractedResourcesInCESessions.
     * @param {ExtractedResourcesInCESessionsUpsertArgs} args - Arguments to update or create a ExtractedResourcesInCESessions.
     * @example
     * // Update or create a ExtractedResourcesInCESessions
     * const extractedResourcesInCESessions = await prisma.extractedResourcesInCESessions.upsert({
     *   create: {
     *     // ... data to create a ExtractedResourcesInCESessions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExtractedResourcesInCESessions we want to update
     *   }
     * })
    **/
    upsert<T extends ExtractedResourcesInCESessionsUpsertArgs>(
      args: SelectSubset<T, ExtractedResourcesInCESessionsUpsertArgs>
    ): CheckSelect<T, Prisma__ExtractedResourcesInCESessionsClient<ExtractedResourcesInCESessions>, Prisma__ExtractedResourcesInCESessionsClient<ExtractedResourcesInCESessionsGetPayload<T>>>

    /**
     * Find one ExtractedResourcesInCESessions that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {ExtractedResourcesInCESessionsFindUniqueOrThrowArgs} args - Arguments to find a ExtractedResourcesInCESessions
     * @example
     * // Get one ExtractedResourcesInCESessions
     * const extractedResourcesInCESessions = await prisma.extractedResourcesInCESessions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends ExtractedResourcesInCESessionsFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, ExtractedResourcesInCESessionsFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__ExtractedResourcesInCESessionsClient<ExtractedResourcesInCESessions>, Prisma__ExtractedResourcesInCESessionsClient<ExtractedResourcesInCESessionsGetPayload<T>>>

    /**
     * Find the first ExtractedResourcesInCESessions that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtractedResourcesInCESessionsFindFirstOrThrowArgs} args - Arguments to find a ExtractedResourcesInCESessions
     * @example
     * // Get one ExtractedResourcesInCESessions
     * const extractedResourcesInCESessions = await prisma.extractedResourcesInCESessions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends ExtractedResourcesInCESessionsFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ExtractedResourcesInCESessionsFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__ExtractedResourcesInCESessionsClient<ExtractedResourcesInCESessions>, Prisma__ExtractedResourcesInCESessionsClient<ExtractedResourcesInCESessionsGetPayload<T>>>

    /**
     * Count the number of ExtractedResourcesInCESessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtractedResourcesInCESessionsCountArgs} args - Arguments to filter ExtractedResourcesInCESessions to count.
     * @example
     * // Count the number of ExtractedResourcesInCESessions
     * const count = await prisma.extractedResourcesInCESessions.count({
     *   where: {
     *     // ... the filter for the ExtractedResourcesInCESessions we want to count
     *   }
     * })
    **/
    count<T extends ExtractedResourcesInCESessionsCountArgs>(
      args?: Subset<T, ExtractedResourcesInCESessionsCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExtractedResourcesInCESessionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExtractedResourcesInCESessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtractedResourcesInCESessionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExtractedResourcesInCESessionsAggregateArgs>(args: Subset<T, ExtractedResourcesInCESessionsAggregateArgs>): PrismaPromise<GetExtractedResourcesInCESessionsAggregateType<T>>

    /**
     * Group by ExtractedResourcesInCESessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtractedResourcesInCESessionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExtractedResourcesInCESessionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExtractedResourcesInCESessionsGroupByArgs['orderBy'] }
        : { orderBy?: ExtractedResourcesInCESessionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExtractedResourcesInCESessionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExtractedResourcesInCESessionsGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for ExtractedResourcesInCESessions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__ExtractedResourcesInCESessionsClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    CESession<T extends CESessionArgs = {}>(args?: Subset<T, CESessionArgs>): CheckSelect<T, Prisma__CESessionClient<CESession | Null>, Prisma__CESessionClient<CESessionGetPayload<T> | Null>>;

    ExtractedResource<T extends ExtractedResourceArgs = {}>(args?: Subset<T, ExtractedResourceArgs>): CheckSelect<T, Prisma__ExtractedResourceClient<ExtractedResource | Null>, Prisma__ExtractedResourceClient<ExtractedResourceGetPayload<T> | Null>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * ExtractedResourcesInCESessions base type for findUnique actions
   */
  export type ExtractedResourcesInCESessionsFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the ExtractedResourcesInCESessions
     * 
    **/
    select?: ExtractedResourcesInCESessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ExtractedResourcesInCESessionsInclude | null
    /**
     * Filter, which ExtractedResourcesInCESessions to fetch.
     * 
    **/
    where: ExtractedResourcesInCESessionsWhereUniqueInput
  }

  /**
   * ExtractedResourcesInCESessions: findUnique
   */
  export interface ExtractedResourcesInCESessionsFindUniqueArgs extends ExtractedResourcesInCESessionsFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * ExtractedResourcesInCESessions base type for findFirst actions
   */
  export type ExtractedResourcesInCESessionsFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the ExtractedResourcesInCESessions
     * 
    **/
    select?: ExtractedResourcesInCESessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ExtractedResourcesInCESessionsInclude | null
    /**
     * Filter, which ExtractedResourcesInCESessions to fetch.
     * 
    **/
    where?: ExtractedResourcesInCESessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExtractedResourcesInCESessions to fetch.
     * 
    **/
    orderBy?: Enumerable<ExtractedResourcesInCESessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExtractedResourcesInCESessions.
     * 
    **/
    cursor?: ExtractedResourcesInCESessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExtractedResourcesInCESessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExtractedResourcesInCESessions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExtractedResourcesInCESessions.
     * 
    **/
    distinct?: Enumerable<ExtractedResourcesInCESessionsScalarFieldEnum>
  }

  /**
   * ExtractedResourcesInCESessions: findFirst
   */
  export interface ExtractedResourcesInCESessionsFindFirstArgs extends ExtractedResourcesInCESessionsFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * ExtractedResourcesInCESessions findMany
   */
  export type ExtractedResourcesInCESessionsFindManyArgs = {
    /**
     * Select specific fields to fetch from the ExtractedResourcesInCESessions
     * 
    **/
    select?: ExtractedResourcesInCESessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ExtractedResourcesInCESessionsInclude | null
    /**
     * Filter, which ExtractedResourcesInCESessions to fetch.
     * 
    **/
    where?: ExtractedResourcesInCESessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExtractedResourcesInCESessions to fetch.
     * 
    **/
    orderBy?: Enumerable<ExtractedResourcesInCESessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExtractedResourcesInCESessions.
     * 
    **/
    cursor?: ExtractedResourcesInCESessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExtractedResourcesInCESessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExtractedResourcesInCESessions.
     * 
    **/
    skip?: number
    distinct?: Enumerable<ExtractedResourcesInCESessionsScalarFieldEnum>
  }


  /**
   * ExtractedResourcesInCESessions create
   */
  export type ExtractedResourcesInCESessionsCreateArgs = {
    /**
     * Select specific fields to fetch from the ExtractedResourcesInCESessions
     * 
    **/
    select?: ExtractedResourcesInCESessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ExtractedResourcesInCESessionsInclude | null
    /**
     * The data needed to create a ExtractedResourcesInCESessions.
     * 
    **/
    data: XOR<ExtractedResourcesInCESessionsCreateInput, ExtractedResourcesInCESessionsUncheckedCreateInput>
  }


  /**
   * ExtractedResourcesInCESessions createMany
   */
  export type ExtractedResourcesInCESessionsCreateManyArgs = {
    /**
     * The data used to create many ExtractedResourcesInCESessions.
     * 
    **/
    data: Enumerable<ExtractedResourcesInCESessionsCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * ExtractedResourcesInCESessions update
   */
  export type ExtractedResourcesInCESessionsUpdateArgs = {
    /**
     * Select specific fields to fetch from the ExtractedResourcesInCESessions
     * 
    **/
    select?: ExtractedResourcesInCESessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ExtractedResourcesInCESessionsInclude | null
    /**
     * The data needed to update a ExtractedResourcesInCESessions.
     * 
    **/
    data: XOR<ExtractedResourcesInCESessionsUpdateInput, ExtractedResourcesInCESessionsUncheckedUpdateInput>
    /**
     * Choose, which ExtractedResourcesInCESessions to update.
     * 
    **/
    where: ExtractedResourcesInCESessionsWhereUniqueInput
  }


  /**
   * ExtractedResourcesInCESessions updateMany
   */
  export type ExtractedResourcesInCESessionsUpdateManyArgs = {
    /**
     * The data used to update ExtractedResourcesInCESessions.
     * 
    **/
    data: XOR<ExtractedResourcesInCESessionsUpdateManyMutationInput, ExtractedResourcesInCESessionsUncheckedUpdateManyInput>
    /**
     * Filter which ExtractedResourcesInCESessions to update
     * 
    **/
    where?: ExtractedResourcesInCESessionsWhereInput
  }


  /**
   * ExtractedResourcesInCESessions upsert
   */
  export type ExtractedResourcesInCESessionsUpsertArgs = {
    /**
     * Select specific fields to fetch from the ExtractedResourcesInCESessions
     * 
    **/
    select?: ExtractedResourcesInCESessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ExtractedResourcesInCESessionsInclude | null
    /**
     * The filter to search for the ExtractedResourcesInCESessions to update in case it exists.
     * 
    **/
    where: ExtractedResourcesInCESessionsWhereUniqueInput
    /**
     * In case the ExtractedResourcesInCESessions found by the `where` argument doesn't exist, create a new ExtractedResourcesInCESessions with this data.
     * 
    **/
    create: XOR<ExtractedResourcesInCESessionsCreateInput, ExtractedResourcesInCESessionsUncheckedCreateInput>
    /**
     * In case the ExtractedResourcesInCESessions was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<ExtractedResourcesInCESessionsUpdateInput, ExtractedResourcesInCESessionsUncheckedUpdateInput>
  }


  /**
   * ExtractedResourcesInCESessions delete
   */
  export type ExtractedResourcesInCESessionsDeleteArgs = {
    /**
     * Select specific fields to fetch from the ExtractedResourcesInCESessions
     * 
    **/
    select?: ExtractedResourcesInCESessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ExtractedResourcesInCESessionsInclude | null
    /**
     * Filter which ExtractedResourcesInCESessions to delete.
     * 
    **/
    where: ExtractedResourcesInCESessionsWhereUniqueInput
  }


  /**
   * ExtractedResourcesInCESessions deleteMany
   */
  export type ExtractedResourcesInCESessionsDeleteManyArgs = {
    /**
     * Filter which ExtractedResourcesInCESessions to delete
     * 
    **/
    where?: ExtractedResourcesInCESessionsWhereInput
  }


  /**
   * ExtractedResourcesInCESessions: findUniqueOrThrow
   */
  export type ExtractedResourcesInCESessionsFindUniqueOrThrowArgs = ExtractedResourcesInCESessionsFindUniqueArgsBase
      

  /**
   * ExtractedResourcesInCESessions: findFirstOrThrow
   */
  export type ExtractedResourcesInCESessionsFindFirstOrThrowArgs = ExtractedResourcesInCESessionsFindFirstArgsBase
      

  /**
   * ExtractedResourcesInCESessions without action
   */
  export type ExtractedResourcesInCESessionsArgs = {
    /**
     * Select specific fields to fetch from the ExtractedResourcesInCESessions
     * 
    **/
    select?: ExtractedResourcesInCESessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ExtractedResourcesInCESessionsInclude | null
  }



  /**
   * Model ExtractedResourcesInDLSessions
   */


  export type AggregateExtractedResourcesInDLSessions = {
    _count: ExtractedResourcesInDLSessionsCountAggregateOutputType | null
    _min: ExtractedResourcesInDLSessionsMinAggregateOutputType | null
    _max: ExtractedResourcesInDLSessionsMaxAggregateOutputType | null
  }

  export type ExtractedResourcesInDLSessionsMinAggregateOutputType = {
    extractedResourceId: string | null
    dLSessionId: string | null
    status: ExtractedResourceStatus | null
  }

  export type ExtractedResourcesInDLSessionsMaxAggregateOutputType = {
    extractedResourceId: string | null
    dLSessionId: string | null
    status: ExtractedResourceStatus | null
  }

  export type ExtractedResourcesInDLSessionsCountAggregateOutputType = {
    extractedResourceId: number
    dLSessionId: number
    status: number
    _all: number
  }


  export type ExtractedResourcesInDLSessionsMinAggregateInputType = {
    extractedResourceId?: true
    dLSessionId?: true
    status?: true
  }

  export type ExtractedResourcesInDLSessionsMaxAggregateInputType = {
    extractedResourceId?: true
    dLSessionId?: true
    status?: true
  }

  export type ExtractedResourcesInDLSessionsCountAggregateInputType = {
    extractedResourceId?: true
    dLSessionId?: true
    status?: true
    _all?: true
  }

  export type ExtractedResourcesInDLSessionsAggregateArgs = {
    /**
     * Filter which ExtractedResourcesInDLSessions to aggregate.
     * 
    **/
    where?: ExtractedResourcesInDLSessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExtractedResourcesInDLSessions to fetch.
     * 
    **/
    orderBy?: Enumerable<ExtractedResourcesInDLSessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: ExtractedResourcesInDLSessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExtractedResourcesInDLSessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExtractedResourcesInDLSessions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExtractedResourcesInDLSessions
    **/
    _count?: true | ExtractedResourcesInDLSessionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExtractedResourcesInDLSessionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExtractedResourcesInDLSessionsMaxAggregateInputType
  }

  export type GetExtractedResourcesInDLSessionsAggregateType<T extends ExtractedResourcesInDLSessionsAggregateArgs> = {
        [P in keyof T & keyof AggregateExtractedResourcesInDLSessions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExtractedResourcesInDLSessions[P]>
      : GetScalarType<T[P], AggregateExtractedResourcesInDLSessions[P]>
  }




  export type ExtractedResourcesInDLSessionsGroupByArgs = {
    where?: ExtractedResourcesInDLSessionsWhereInput
    orderBy?: Enumerable<ExtractedResourcesInDLSessionsOrderByWithAggregationInput>
    by: Array<ExtractedResourcesInDLSessionsScalarFieldEnum>
    having?: ExtractedResourcesInDLSessionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExtractedResourcesInDLSessionsCountAggregateInputType | true
    _min?: ExtractedResourcesInDLSessionsMinAggregateInputType
    _max?: ExtractedResourcesInDLSessionsMaxAggregateInputType
  }


  export type ExtractedResourcesInDLSessionsGroupByOutputType = {
    extractedResourceId: string
    dLSessionId: string
    status: ExtractedResourceStatus
    _count: ExtractedResourcesInDLSessionsCountAggregateOutputType | null
    _min: ExtractedResourcesInDLSessionsMinAggregateOutputType | null
    _max: ExtractedResourcesInDLSessionsMaxAggregateOutputType | null
  }

  type GetExtractedResourcesInDLSessionsGroupByPayload<T extends ExtractedResourcesInDLSessionsGroupByArgs> = PrismaPromise<
    Array<
      PickArray<ExtractedResourcesInDLSessionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExtractedResourcesInDLSessionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExtractedResourcesInDLSessionsGroupByOutputType[P]>
            : GetScalarType<T[P], ExtractedResourcesInDLSessionsGroupByOutputType[P]>
        }
      >
    >


  export type ExtractedResourcesInDLSessionsSelect = {
    extractedResourceId?: boolean
    dLSessionId?: boolean
    status?: boolean
    DLSession?: boolean | DLSessionArgs
    ExtractedResource?: boolean | ExtractedResourceArgs
    LabelsInExtractedResourcesInDLSessions?: boolean | LabelsInExtractedResourcesInDLSessionsFindManyArgs
    _count?: boolean | ExtractedResourcesInDLSessionsCountOutputTypeArgs
  }

  export type ExtractedResourcesInDLSessionsInclude = {
    DLSession?: boolean | DLSessionArgs
    ExtractedResource?: boolean | ExtractedResourceArgs
    LabelsInExtractedResourcesInDLSessions?: boolean | LabelsInExtractedResourcesInDLSessionsFindManyArgs
    _count?: boolean | ExtractedResourcesInDLSessionsCountOutputTypeArgs
  }

  export type ExtractedResourcesInDLSessionsGetPayload<
    S extends boolean | null | undefined | ExtractedResourcesInDLSessionsArgs,
    U = keyof S
      > = S extends true
        ? ExtractedResourcesInDLSessions
    : S extends undefined
    ? never
    : S extends ExtractedResourcesInDLSessionsArgs | ExtractedResourcesInDLSessionsFindManyArgs
    ?'include' extends U
    ? ExtractedResourcesInDLSessions  & {
    [P in TrueKeys<S['include']>]:
        P extends 'DLSession' ? DLSessionGetPayload<Exclude<S['include'], undefined | null>[P]> :
        P extends 'ExtractedResource' ? ExtractedResourceGetPayload<Exclude<S['include'], undefined | null>[P]> :
        P extends 'LabelsInExtractedResourcesInDLSessions' ? Array < LabelsInExtractedResourcesInDLSessionsGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends '_count' ? ExtractedResourcesInDLSessionsCountOutputTypeGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'DLSession' ? DLSessionGetPayload<Exclude<S['select'], undefined | null>[P]> :
        P extends 'ExtractedResource' ? ExtractedResourceGetPayload<Exclude<S['select'], undefined | null>[P]> :
        P extends 'LabelsInExtractedResourcesInDLSessions' ? Array < LabelsInExtractedResourcesInDLSessionsGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends '_count' ? ExtractedResourcesInDLSessionsCountOutputTypeGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof ExtractedResourcesInDLSessions ? ExtractedResourcesInDLSessions[P] : never
  } 
    : ExtractedResourcesInDLSessions
  : ExtractedResourcesInDLSessions


  type ExtractedResourcesInDLSessionsCountArgs = Merge<
    Omit<ExtractedResourcesInDLSessionsFindManyArgs, 'select' | 'include'> & {
      select?: ExtractedResourcesInDLSessionsCountAggregateInputType | true
    }
  >

  export interface ExtractedResourcesInDLSessionsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one ExtractedResourcesInDLSessions that matches the filter.
     * @param {ExtractedResourcesInDLSessionsFindUniqueArgs} args - Arguments to find a ExtractedResourcesInDLSessions
     * @example
     * // Get one ExtractedResourcesInDLSessions
     * const extractedResourcesInDLSessions = await prisma.extractedResourcesInDLSessions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends ExtractedResourcesInDLSessionsFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, ExtractedResourcesInDLSessionsFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'ExtractedResourcesInDLSessions'> extends True ? CheckSelect<T, Prisma__ExtractedResourcesInDLSessionsClient<ExtractedResourcesInDLSessions>, Prisma__ExtractedResourcesInDLSessionsClient<ExtractedResourcesInDLSessionsGetPayload<T>>> : CheckSelect<T, Prisma__ExtractedResourcesInDLSessionsClient<ExtractedResourcesInDLSessions | null, null>, Prisma__ExtractedResourcesInDLSessionsClient<ExtractedResourcesInDLSessionsGetPayload<T> | null, null>>

    /**
     * Find the first ExtractedResourcesInDLSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtractedResourcesInDLSessionsFindFirstArgs} args - Arguments to find a ExtractedResourcesInDLSessions
     * @example
     * // Get one ExtractedResourcesInDLSessions
     * const extractedResourcesInDLSessions = await prisma.extractedResourcesInDLSessions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends ExtractedResourcesInDLSessionsFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, ExtractedResourcesInDLSessionsFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'ExtractedResourcesInDLSessions'> extends True ? CheckSelect<T, Prisma__ExtractedResourcesInDLSessionsClient<ExtractedResourcesInDLSessions>, Prisma__ExtractedResourcesInDLSessionsClient<ExtractedResourcesInDLSessionsGetPayload<T>>> : CheckSelect<T, Prisma__ExtractedResourcesInDLSessionsClient<ExtractedResourcesInDLSessions | null, null>, Prisma__ExtractedResourcesInDLSessionsClient<ExtractedResourcesInDLSessionsGetPayload<T> | null, null>>

    /**
     * Find zero or more ExtractedResourcesInDLSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtractedResourcesInDLSessionsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExtractedResourcesInDLSessions
     * const extractedResourcesInDLSessions = await prisma.extractedResourcesInDLSessions.findMany()
     * 
     * // Get first 10 ExtractedResourcesInDLSessions
     * const extractedResourcesInDLSessions = await prisma.extractedResourcesInDLSessions.findMany({ take: 10 })
     * 
     * // Only select the `extractedResourceId`
     * const extractedResourcesInDLSessionsWithExtractedResourceIdOnly = await prisma.extractedResourcesInDLSessions.findMany({ select: { extractedResourceId: true } })
     * 
    **/
    findMany<T extends ExtractedResourcesInDLSessionsFindManyArgs>(
      args?: SelectSubset<T, ExtractedResourcesInDLSessionsFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<ExtractedResourcesInDLSessions>>, PrismaPromise<Array<ExtractedResourcesInDLSessionsGetPayload<T>>>>

    /**
     * Create a ExtractedResourcesInDLSessions.
     * @param {ExtractedResourcesInDLSessionsCreateArgs} args - Arguments to create a ExtractedResourcesInDLSessions.
     * @example
     * // Create one ExtractedResourcesInDLSessions
     * const ExtractedResourcesInDLSessions = await prisma.extractedResourcesInDLSessions.create({
     *   data: {
     *     // ... data to create a ExtractedResourcesInDLSessions
     *   }
     * })
     * 
    **/
    create<T extends ExtractedResourcesInDLSessionsCreateArgs>(
      args: SelectSubset<T, ExtractedResourcesInDLSessionsCreateArgs>
    ): CheckSelect<T, Prisma__ExtractedResourcesInDLSessionsClient<ExtractedResourcesInDLSessions>, Prisma__ExtractedResourcesInDLSessionsClient<ExtractedResourcesInDLSessionsGetPayload<T>>>

    /**
     * Create many ExtractedResourcesInDLSessions.
     *     @param {ExtractedResourcesInDLSessionsCreateManyArgs} args - Arguments to create many ExtractedResourcesInDLSessions.
     *     @example
     *     // Create many ExtractedResourcesInDLSessions
     *     const extractedResourcesInDLSessions = await prisma.extractedResourcesInDLSessions.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends ExtractedResourcesInDLSessionsCreateManyArgs>(
      args?: SelectSubset<T, ExtractedResourcesInDLSessionsCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a ExtractedResourcesInDLSessions.
     * @param {ExtractedResourcesInDLSessionsDeleteArgs} args - Arguments to delete one ExtractedResourcesInDLSessions.
     * @example
     * // Delete one ExtractedResourcesInDLSessions
     * const ExtractedResourcesInDLSessions = await prisma.extractedResourcesInDLSessions.delete({
     *   where: {
     *     // ... filter to delete one ExtractedResourcesInDLSessions
     *   }
     * })
     * 
    **/
    delete<T extends ExtractedResourcesInDLSessionsDeleteArgs>(
      args: SelectSubset<T, ExtractedResourcesInDLSessionsDeleteArgs>
    ): CheckSelect<T, Prisma__ExtractedResourcesInDLSessionsClient<ExtractedResourcesInDLSessions>, Prisma__ExtractedResourcesInDLSessionsClient<ExtractedResourcesInDLSessionsGetPayload<T>>>

    /**
     * Update one ExtractedResourcesInDLSessions.
     * @param {ExtractedResourcesInDLSessionsUpdateArgs} args - Arguments to update one ExtractedResourcesInDLSessions.
     * @example
     * // Update one ExtractedResourcesInDLSessions
     * const extractedResourcesInDLSessions = await prisma.extractedResourcesInDLSessions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends ExtractedResourcesInDLSessionsUpdateArgs>(
      args: SelectSubset<T, ExtractedResourcesInDLSessionsUpdateArgs>
    ): CheckSelect<T, Prisma__ExtractedResourcesInDLSessionsClient<ExtractedResourcesInDLSessions>, Prisma__ExtractedResourcesInDLSessionsClient<ExtractedResourcesInDLSessionsGetPayload<T>>>

    /**
     * Delete zero or more ExtractedResourcesInDLSessions.
     * @param {ExtractedResourcesInDLSessionsDeleteManyArgs} args - Arguments to filter ExtractedResourcesInDLSessions to delete.
     * @example
     * // Delete a few ExtractedResourcesInDLSessions
     * const { count } = await prisma.extractedResourcesInDLSessions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends ExtractedResourcesInDLSessionsDeleteManyArgs>(
      args?: SelectSubset<T, ExtractedResourcesInDLSessionsDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExtractedResourcesInDLSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtractedResourcesInDLSessionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExtractedResourcesInDLSessions
     * const extractedResourcesInDLSessions = await prisma.extractedResourcesInDLSessions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends ExtractedResourcesInDLSessionsUpdateManyArgs>(
      args: SelectSubset<T, ExtractedResourcesInDLSessionsUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one ExtractedResourcesInDLSessions.
     * @param {ExtractedResourcesInDLSessionsUpsertArgs} args - Arguments to update or create a ExtractedResourcesInDLSessions.
     * @example
     * // Update or create a ExtractedResourcesInDLSessions
     * const extractedResourcesInDLSessions = await prisma.extractedResourcesInDLSessions.upsert({
     *   create: {
     *     // ... data to create a ExtractedResourcesInDLSessions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExtractedResourcesInDLSessions we want to update
     *   }
     * })
    **/
    upsert<T extends ExtractedResourcesInDLSessionsUpsertArgs>(
      args: SelectSubset<T, ExtractedResourcesInDLSessionsUpsertArgs>
    ): CheckSelect<T, Prisma__ExtractedResourcesInDLSessionsClient<ExtractedResourcesInDLSessions>, Prisma__ExtractedResourcesInDLSessionsClient<ExtractedResourcesInDLSessionsGetPayload<T>>>

    /**
     * Find one ExtractedResourcesInDLSessions that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {ExtractedResourcesInDLSessionsFindUniqueOrThrowArgs} args - Arguments to find a ExtractedResourcesInDLSessions
     * @example
     * // Get one ExtractedResourcesInDLSessions
     * const extractedResourcesInDLSessions = await prisma.extractedResourcesInDLSessions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends ExtractedResourcesInDLSessionsFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, ExtractedResourcesInDLSessionsFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__ExtractedResourcesInDLSessionsClient<ExtractedResourcesInDLSessions>, Prisma__ExtractedResourcesInDLSessionsClient<ExtractedResourcesInDLSessionsGetPayload<T>>>

    /**
     * Find the first ExtractedResourcesInDLSessions that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtractedResourcesInDLSessionsFindFirstOrThrowArgs} args - Arguments to find a ExtractedResourcesInDLSessions
     * @example
     * // Get one ExtractedResourcesInDLSessions
     * const extractedResourcesInDLSessions = await prisma.extractedResourcesInDLSessions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends ExtractedResourcesInDLSessionsFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ExtractedResourcesInDLSessionsFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__ExtractedResourcesInDLSessionsClient<ExtractedResourcesInDLSessions>, Prisma__ExtractedResourcesInDLSessionsClient<ExtractedResourcesInDLSessionsGetPayload<T>>>

    /**
     * Count the number of ExtractedResourcesInDLSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtractedResourcesInDLSessionsCountArgs} args - Arguments to filter ExtractedResourcesInDLSessions to count.
     * @example
     * // Count the number of ExtractedResourcesInDLSessions
     * const count = await prisma.extractedResourcesInDLSessions.count({
     *   where: {
     *     // ... the filter for the ExtractedResourcesInDLSessions we want to count
     *   }
     * })
    **/
    count<T extends ExtractedResourcesInDLSessionsCountArgs>(
      args?: Subset<T, ExtractedResourcesInDLSessionsCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExtractedResourcesInDLSessionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExtractedResourcesInDLSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtractedResourcesInDLSessionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExtractedResourcesInDLSessionsAggregateArgs>(args: Subset<T, ExtractedResourcesInDLSessionsAggregateArgs>): PrismaPromise<GetExtractedResourcesInDLSessionsAggregateType<T>>

    /**
     * Group by ExtractedResourcesInDLSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtractedResourcesInDLSessionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExtractedResourcesInDLSessionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExtractedResourcesInDLSessionsGroupByArgs['orderBy'] }
        : { orderBy?: ExtractedResourcesInDLSessionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExtractedResourcesInDLSessionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExtractedResourcesInDLSessionsGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for ExtractedResourcesInDLSessions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__ExtractedResourcesInDLSessionsClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    DLSession<T extends DLSessionArgs = {}>(args?: Subset<T, DLSessionArgs>): CheckSelect<T, Prisma__DLSessionClient<DLSession | Null>, Prisma__DLSessionClient<DLSessionGetPayload<T> | Null>>;

    ExtractedResource<T extends ExtractedResourceArgs = {}>(args?: Subset<T, ExtractedResourceArgs>): CheckSelect<T, Prisma__ExtractedResourceClient<ExtractedResource | Null>, Prisma__ExtractedResourceClient<ExtractedResourceGetPayload<T> | Null>>;

    LabelsInExtractedResourcesInDLSessions<T extends LabelsInExtractedResourcesInDLSessionsFindManyArgs = {}>(args?: Subset<T, LabelsInExtractedResourcesInDLSessionsFindManyArgs>): CheckSelect<T, PrismaPromise<Array<LabelsInExtractedResourcesInDLSessions>| Null>, PrismaPromise<Array<LabelsInExtractedResourcesInDLSessionsGetPayload<T>>| Null>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * ExtractedResourcesInDLSessions base type for findUnique actions
   */
  export type ExtractedResourcesInDLSessionsFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the ExtractedResourcesInDLSessions
     * 
    **/
    select?: ExtractedResourcesInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ExtractedResourcesInDLSessionsInclude | null
    /**
     * Filter, which ExtractedResourcesInDLSessions to fetch.
     * 
    **/
    where: ExtractedResourcesInDLSessionsWhereUniqueInput
  }

  /**
   * ExtractedResourcesInDLSessions: findUnique
   */
  export interface ExtractedResourcesInDLSessionsFindUniqueArgs extends ExtractedResourcesInDLSessionsFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * ExtractedResourcesInDLSessions base type for findFirst actions
   */
  export type ExtractedResourcesInDLSessionsFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the ExtractedResourcesInDLSessions
     * 
    **/
    select?: ExtractedResourcesInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ExtractedResourcesInDLSessionsInclude | null
    /**
     * Filter, which ExtractedResourcesInDLSessions to fetch.
     * 
    **/
    where?: ExtractedResourcesInDLSessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExtractedResourcesInDLSessions to fetch.
     * 
    **/
    orderBy?: Enumerable<ExtractedResourcesInDLSessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExtractedResourcesInDLSessions.
     * 
    **/
    cursor?: ExtractedResourcesInDLSessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExtractedResourcesInDLSessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExtractedResourcesInDLSessions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExtractedResourcesInDLSessions.
     * 
    **/
    distinct?: Enumerable<ExtractedResourcesInDLSessionsScalarFieldEnum>
  }

  /**
   * ExtractedResourcesInDLSessions: findFirst
   */
  export interface ExtractedResourcesInDLSessionsFindFirstArgs extends ExtractedResourcesInDLSessionsFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * ExtractedResourcesInDLSessions findMany
   */
  export type ExtractedResourcesInDLSessionsFindManyArgs = {
    /**
     * Select specific fields to fetch from the ExtractedResourcesInDLSessions
     * 
    **/
    select?: ExtractedResourcesInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ExtractedResourcesInDLSessionsInclude | null
    /**
     * Filter, which ExtractedResourcesInDLSessions to fetch.
     * 
    **/
    where?: ExtractedResourcesInDLSessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExtractedResourcesInDLSessions to fetch.
     * 
    **/
    orderBy?: Enumerable<ExtractedResourcesInDLSessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExtractedResourcesInDLSessions.
     * 
    **/
    cursor?: ExtractedResourcesInDLSessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExtractedResourcesInDLSessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExtractedResourcesInDLSessions.
     * 
    **/
    skip?: number
    distinct?: Enumerable<ExtractedResourcesInDLSessionsScalarFieldEnum>
  }


  /**
   * ExtractedResourcesInDLSessions create
   */
  export type ExtractedResourcesInDLSessionsCreateArgs = {
    /**
     * Select specific fields to fetch from the ExtractedResourcesInDLSessions
     * 
    **/
    select?: ExtractedResourcesInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ExtractedResourcesInDLSessionsInclude | null
    /**
     * The data needed to create a ExtractedResourcesInDLSessions.
     * 
    **/
    data: XOR<ExtractedResourcesInDLSessionsCreateInput, ExtractedResourcesInDLSessionsUncheckedCreateInput>
  }


  /**
   * ExtractedResourcesInDLSessions createMany
   */
  export type ExtractedResourcesInDLSessionsCreateManyArgs = {
    /**
     * The data used to create many ExtractedResourcesInDLSessions.
     * 
    **/
    data: Enumerable<ExtractedResourcesInDLSessionsCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * ExtractedResourcesInDLSessions update
   */
  export type ExtractedResourcesInDLSessionsUpdateArgs = {
    /**
     * Select specific fields to fetch from the ExtractedResourcesInDLSessions
     * 
    **/
    select?: ExtractedResourcesInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ExtractedResourcesInDLSessionsInclude | null
    /**
     * The data needed to update a ExtractedResourcesInDLSessions.
     * 
    **/
    data: XOR<ExtractedResourcesInDLSessionsUpdateInput, ExtractedResourcesInDLSessionsUncheckedUpdateInput>
    /**
     * Choose, which ExtractedResourcesInDLSessions to update.
     * 
    **/
    where: ExtractedResourcesInDLSessionsWhereUniqueInput
  }


  /**
   * ExtractedResourcesInDLSessions updateMany
   */
  export type ExtractedResourcesInDLSessionsUpdateManyArgs = {
    /**
     * The data used to update ExtractedResourcesInDLSessions.
     * 
    **/
    data: XOR<ExtractedResourcesInDLSessionsUpdateManyMutationInput, ExtractedResourcesInDLSessionsUncheckedUpdateManyInput>
    /**
     * Filter which ExtractedResourcesInDLSessions to update
     * 
    **/
    where?: ExtractedResourcesInDLSessionsWhereInput
  }


  /**
   * ExtractedResourcesInDLSessions upsert
   */
  export type ExtractedResourcesInDLSessionsUpsertArgs = {
    /**
     * Select specific fields to fetch from the ExtractedResourcesInDLSessions
     * 
    **/
    select?: ExtractedResourcesInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ExtractedResourcesInDLSessionsInclude | null
    /**
     * The filter to search for the ExtractedResourcesInDLSessions to update in case it exists.
     * 
    **/
    where: ExtractedResourcesInDLSessionsWhereUniqueInput
    /**
     * In case the ExtractedResourcesInDLSessions found by the `where` argument doesn't exist, create a new ExtractedResourcesInDLSessions with this data.
     * 
    **/
    create: XOR<ExtractedResourcesInDLSessionsCreateInput, ExtractedResourcesInDLSessionsUncheckedCreateInput>
    /**
     * In case the ExtractedResourcesInDLSessions was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<ExtractedResourcesInDLSessionsUpdateInput, ExtractedResourcesInDLSessionsUncheckedUpdateInput>
  }


  /**
   * ExtractedResourcesInDLSessions delete
   */
  export type ExtractedResourcesInDLSessionsDeleteArgs = {
    /**
     * Select specific fields to fetch from the ExtractedResourcesInDLSessions
     * 
    **/
    select?: ExtractedResourcesInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ExtractedResourcesInDLSessionsInclude | null
    /**
     * Filter which ExtractedResourcesInDLSessions to delete.
     * 
    **/
    where: ExtractedResourcesInDLSessionsWhereUniqueInput
  }


  /**
   * ExtractedResourcesInDLSessions deleteMany
   */
  export type ExtractedResourcesInDLSessionsDeleteManyArgs = {
    /**
     * Filter which ExtractedResourcesInDLSessions to delete
     * 
    **/
    where?: ExtractedResourcesInDLSessionsWhereInput
  }


  /**
   * ExtractedResourcesInDLSessions: findUniqueOrThrow
   */
  export type ExtractedResourcesInDLSessionsFindUniqueOrThrowArgs = ExtractedResourcesInDLSessionsFindUniqueArgsBase
      

  /**
   * ExtractedResourcesInDLSessions: findFirstOrThrow
   */
  export type ExtractedResourcesInDLSessionsFindFirstOrThrowArgs = ExtractedResourcesInDLSessionsFindFirstArgsBase
      

  /**
   * ExtractedResourcesInDLSessions without action
   */
  export type ExtractedResourcesInDLSessionsArgs = {
    /**
     * Select specific fields to fetch from the ExtractedResourcesInDLSessions
     * 
    **/
    select?: ExtractedResourcesInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ExtractedResourcesInDLSessionsInclude | null
  }



  /**
   * Model Label
   */


  export type AggregateLabel = {
    _count: LabelCountAggregateOutputType | null
    _min: LabelMinAggregateOutputType | null
    _max: LabelMaxAggregateOutputType | null
  }

  export type LabelMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    abbreviation: string | null
  }

  export type LabelMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    abbreviation: string | null
  }

  export type LabelCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    name: number
    abbreviation: number
    _all: number
  }


  export type LabelMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    abbreviation?: true
  }

  export type LabelMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    abbreviation?: true
  }

  export type LabelCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    abbreviation?: true
    _all?: true
  }

  export type LabelAggregateArgs = {
    /**
     * Filter which Label to aggregate.
     * 
    **/
    where?: LabelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Labels to fetch.
     * 
    **/
    orderBy?: Enumerable<LabelOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: LabelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Labels from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Labels.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Labels
    **/
    _count?: true | LabelCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LabelMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LabelMaxAggregateInputType
  }

  export type GetLabelAggregateType<T extends LabelAggregateArgs> = {
        [P in keyof T & keyof AggregateLabel]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLabel[P]>
      : GetScalarType<T[P], AggregateLabel[P]>
  }




  export type LabelGroupByArgs = {
    where?: LabelWhereInput
    orderBy?: Enumerable<LabelOrderByWithAggregationInput>
    by: Array<LabelScalarFieldEnum>
    having?: LabelScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LabelCountAggregateInputType | true
    _min?: LabelMinAggregateInputType
    _max?: LabelMaxAggregateInputType
  }


  export type LabelGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    name: string
    abbreviation: string
    _count: LabelCountAggregateOutputType | null
    _min: LabelMinAggregateOutputType | null
    _max: LabelMaxAggregateOutputType | null
  }

  type GetLabelGroupByPayload<T extends LabelGroupByArgs> = PrismaPromise<
    Array<
      PickArray<LabelGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LabelGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LabelGroupByOutputType[P]>
            : GetScalarType<T[P], LabelGroupByOutputType[P]>
        }
      >
    >


  export type LabelSelect = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    abbreviation?: boolean
    LabelsInDLSessions?: boolean | LabelsInDLSessionsFindManyArgs
    LabelsInExtractedResourcesInDLSessions?: boolean | LabelsInExtractedResourcesInDLSessionsFindManyArgs
    _count?: boolean | LabelCountOutputTypeArgs
  }

  export type LabelInclude = {
    LabelsInDLSessions?: boolean | LabelsInDLSessionsFindManyArgs
    LabelsInExtractedResourcesInDLSessions?: boolean | LabelsInExtractedResourcesInDLSessionsFindManyArgs
    _count?: boolean | LabelCountOutputTypeArgs
  }

  export type LabelGetPayload<
    S extends boolean | null | undefined | LabelArgs,
    U = keyof S
      > = S extends true
        ? Label
    : S extends undefined
    ? never
    : S extends LabelArgs | LabelFindManyArgs
    ?'include' extends U
    ? Label  & {
    [P in TrueKeys<S['include']>]:
        P extends 'LabelsInDLSessions' ? Array < LabelsInDLSessionsGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends 'LabelsInExtractedResourcesInDLSessions' ? Array < LabelsInExtractedResourcesInDLSessionsGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends '_count' ? LabelCountOutputTypeGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'LabelsInDLSessions' ? Array < LabelsInDLSessionsGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends 'LabelsInExtractedResourcesInDLSessions' ? Array < LabelsInExtractedResourcesInDLSessionsGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends '_count' ? LabelCountOutputTypeGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof Label ? Label[P] : never
  } 
    : Label
  : Label


  type LabelCountArgs = Merge<
    Omit<LabelFindManyArgs, 'select' | 'include'> & {
      select?: LabelCountAggregateInputType | true
    }
  >

  export interface LabelDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one Label that matches the filter.
     * @param {LabelFindUniqueArgs} args - Arguments to find a Label
     * @example
     * // Get one Label
     * const label = await prisma.label.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends LabelFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, LabelFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Label'> extends True ? CheckSelect<T, Prisma__LabelClient<Label>, Prisma__LabelClient<LabelGetPayload<T>>> : CheckSelect<T, Prisma__LabelClient<Label | null, null>, Prisma__LabelClient<LabelGetPayload<T> | null, null>>

    /**
     * Find the first Label that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabelFindFirstArgs} args - Arguments to find a Label
     * @example
     * // Get one Label
     * const label = await prisma.label.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends LabelFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, LabelFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Label'> extends True ? CheckSelect<T, Prisma__LabelClient<Label>, Prisma__LabelClient<LabelGetPayload<T>>> : CheckSelect<T, Prisma__LabelClient<Label | null, null>, Prisma__LabelClient<LabelGetPayload<T> | null, null>>

    /**
     * Find zero or more Labels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabelFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Labels
     * const labels = await prisma.label.findMany()
     * 
     * // Get first 10 Labels
     * const labels = await prisma.label.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const labelWithIdOnly = await prisma.label.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends LabelFindManyArgs>(
      args?: SelectSubset<T, LabelFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<Label>>, PrismaPromise<Array<LabelGetPayload<T>>>>

    /**
     * Create a Label.
     * @param {LabelCreateArgs} args - Arguments to create a Label.
     * @example
     * // Create one Label
     * const Label = await prisma.label.create({
     *   data: {
     *     // ... data to create a Label
     *   }
     * })
     * 
    **/
    create<T extends LabelCreateArgs>(
      args: SelectSubset<T, LabelCreateArgs>
    ): CheckSelect<T, Prisma__LabelClient<Label>, Prisma__LabelClient<LabelGetPayload<T>>>

    /**
     * Create many Labels.
     *     @param {LabelCreateManyArgs} args - Arguments to create many Labels.
     *     @example
     *     // Create many Labels
     *     const label = await prisma.label.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends LabelCreateManyArgs>(
      args?: SelectSubset<T, LabelCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Label.
     * @param {LabelDeleteArgs} args - Arguments to delete one Label.
     * @example
     * // Delete one Label
     * const Label = await prisma.label.delete({
     *   where: {
     *     // ... filter to delete one Label
     *   }
     * })
     * 
    **/
    delete<T extends LabelDeleteArgs>(
      args: SelectSubset<T, LabelDeleteArgs>
    ): CheckSelect<T, Prisma__LabelClient<Label>, Prisma__LabelClient<LabelGetPayload<T>>>

    /**
     * Update one Label.
     * @param {LabelUpdateArgs} args - Arguments to update one Label.
     * @example
     * // Update one Label
     * const label = await prisma.label.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends LabelUpdateArgs>(
      args: SelectSubset<T, LabelUpdateArgs>
    ): CheckSelect<T, Prisma__LabelClient<Label>, Prisma__LabelClient<LabelGetPayload<T>>>

    /**
     * Delete zero or more Labels.
     * @param {LabelDeleteManyArgs} args - Arguments to filter Labels to delete.
     * @example
     * // Delete a few Labels
     * const { count } = await prisma.label.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends LabelDeleteManyArgs>(
      args?: SelectSubset<T, LabelDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Labels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabelUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Labels
     * const label = await prisma.label.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends LabelUpdateManyArgs>(
      args: SelectSubset<T, LabelUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Label.
     * @param {LabelUpsertArgs} args - Arguments to update or create a Label.
     * @example
     * // Update or create a Label
     * const label = await prisma.label.upsert({
     *   create: {
     *     // ... data to create a Label
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Label we want to update
     *   }
     * })
    **/
    upsert<T extends LabelUpsertArgs>(
      args: SelectSubset<T, LabelUpsertArgs>
    ): CheckSelect<T, Prisma__LabelClient<Label>, Prisma__LabelClient<LabelGetPayload<T>>>

    /**
     * Find one Label that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {LabelFindUniqueOrThrowArgs} args - Arguments to find a Label
     * @example
     * // Get one Label
     * const label = await prisma.label.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends LabelFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, LabelFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__LabelClient<Label>, Prisma__LabelClient<LabelGetPayload<T>>>

    /**
     * Find the first Label that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabelFindFirstOrThrowArgs} args - Arguments to find a Label
     * @example
     * // Get one Label
     * const label = await prisma.label.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends LabelFindFirstOrThrowArgs>(
      args?: SelectSubset<T, LabelFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__LabelClient<Label>, Prisma__LabelClient<LabelGetPayload<T>>>

    /**
     * Count the number of Labels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabelCountArgs} args - Arguments to filter Labels to count.
     * @example
     * // Count the number of Labels
     * const count = await prisma.label.count({
     *   where: {
     *     // ... the filter for the Labels we want to count
     *   }
     * })
    **/
    count<T extends LabelCountArgs>(
      args?: Subset<T, LabelCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LabelCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Label.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabelAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LabelAggregateArgs>(args: Subset<T, LabelAggregateArgs>): PrismaPromise<GetLabelAggregateType<T>>

    /**
     * Group by Label.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabelGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LabelGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LabelGroupByArgs['orderBy'] }
        : { orderBy?: LabelGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LabelGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLabelGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Label.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__LabelClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    LabelsInDLSessions<T extends LabelsInDLSessionsFindManyArgs = {}>(args?: Subset<T, LabelsInDLSessionsFindManyArgs>): CheckSelect<T, PrismaPromise<Array<LabelsInDLSessions>| Null>, PrismaPromise<Array<LabelsInDLSessionsGetPayload<T>>| Null>>;

    LabelsInExtractedResourcesInDLSessions<T extends LabelsInExtractedResourcesInDLSessionsFindManyArgs = {}>(args?: Subset<T, LabelsInExtractedResourcesInDLSessionsFindManyArgs>): CheckSelect<T, PrismaPromise<Array<LabelsInExtractedResourcesInDLSessions>| Null>, PrismaPromise<Array<LabelsInExtractedResourcesInDLSessionsGetPayload<T>>| Null>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Label base type for findUnique actions
   */
  export type LabelFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Label
     * 
    **/
    select?: LabelSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LabelInclude | null
    /**
     * Filter, which Label to fetch.
     * 
    **/
    where: LabelWhereUniqueInput
  }

  /**
   * Label: findUnique
   */
  export interface LabelFindUniqueArgs extends LabelFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Label base type for findFirst actions
   */
  export type LabelFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Label
     * 
    **/
    select?: LabelSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LabelInclude | null
    /**
     * Filter, which Label to fetch.
     * 
    **/
    where?: LabelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Labels to fetch.
     * 
    **/
    orderBy?: Enumerable<LabelOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Labels.
     * 
    **/
    cursor?: LabelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Labels from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Labels.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Labels.
     * 
    **/
    distinct?: Enumerable<LabelScalarFieldEnum>
  }

  /**
   * Label: findFirst
   */
  export interface LabelFindFirstArgs extends LabelFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Label findMany
   */
  export type LabelFindManyArgs = {
    /**
     * Select specific fields to fetch from the Label
     * 
    **/
    select?: LabelSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LabelInclude | null
    /**
     * Filter, which Labels to fetch.
     * 
    **/
    where?: LabelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Labels to fetch.
     * 
    **/
    orderBy?: Enumerable<LabelOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Labels.
     * 
    **/
    cursor?: LabelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Labels from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Labels.
     * 
    **/
    skip?: number
    distinct?: Enumerable<LabelScalarFieldEnum>
  }


  /**
   * Label create
   */
  export type LabelCreateArgs = {
    /**
     * Select specific fields to fetch from the Label
     * 
    **/
    select?: LabelSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LabelInclude | null
    /**
     * The data needed to create a Label.
     * 
    **/
    data: XOR<LabelCreateInput, LabelUncheckedCreateInput>
  }


  /**
   * Label createMany
   */
  export type LabelCreateManyArgs = {
    /**
     * The data used to create many Labels.
     * 
    **/
    data: Enumerable<LabelCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Label update
   */
  export type LabelUpdateArgs = {
    /**
     * Select specific fields to fetch from the Label
     * 
    **/
    select?: LabelSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LabelInclude | null
    /**
     * The data needed to update a Label.
     * 
    **/
    data: XOR<LabelUpdateInput, LabelUncheckedUpdateInput>
    /**
     * Choose, which Label to update.
     * 
    **/
    where: LabelWhereUniqueInput
  }


  /**
   * Label updateMany
   */
  export type LabelUpdateManyArgs = {
    /**
     * The data used to update Labels.
     * 
    **/
    data: XOR<LabelUpdateManyMutationInput, LabelUncheckedUpdateManyInput>
    /**
     * Filter which Labels to update
     * 
    **/
    where?: LabelWhereInput
  }


  /**
   * Label upsert
   */
  export type LabelUpsertArgs = {
    /**
     * Select specific fields to fetch from the Label
     * 
    **/
    select?: LabelSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LabelInclude | null
    /**
     * The filter to search for the Label to update in case it exists.
     * 
    **/
    where: LabelWhereUniqueInput
    /**
     * In case the Label found by the `where` argument doesn't exist, create a new Label with this data.
     * 
    **/
    create: XOR<LabelCreateInput, LabelUncheckedCreateInput>
    /**
     * In case the Label was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<LabelUpdateInput, LabelUncheckedUpdateInput>
  }


  /**
   * Label delete
   */
  export type LabelDeleteArgs = {
    /**
     * Select specific fields to fetch from the Label
     * 
    **/
    select?: LabelSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LabelInclude | null
    /**
     * Filter which Label to delete.
     * 
    **/
    where: LabelWhereUniqueInput
  }


  /**
   * Label deleteMany
   */
  export type LabelDeleteManyArgs = {
    /**
     * Filter which Labels to delete
     * 
    **/
    where?: LabelWhereInput
  }


  /**
   * Label: findUniqueOrThrow
   */
  export type LabelFindUniqueOrThrowArgs = LabelFindUniqueArgsBase
      

  /**
   * Label: findFirstOrThrow
   */
  export type LabelFindFirstOrThrowArgs = LabelFindFirstArgsBase
      

  /**
   * Label without action
   */
  export type LabelArgs = {
    /**
     * Select specific fields to fetch from the Label
     * 
    **/
    select?: LabelSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LabelInclude | null
  }



  /**
   * Model LabelsInDLSessions
   */


  export type AggregateLabelsInDLSessions = {
    _count: LabelsInDLSessionsCountAggregateOutputType | null
    _min: LabelsInDLSessionsMinAggregateOutputType | null
    _max: LabelsInDLSessionsMaxAggregateOutputType | null
  }

  export type LabelsInDLSessionsMinAggregateOutputType = {
    labelId: string | null
    dLSessionId: string | null
  }

  export type LabelsInDLSessionsMaxAggregateOutputType = {
    labelId: string | null
    dLSessionId: string | null
  }

  export type LabelsInDLSessionsCountAggregateOutputType = {
    labelId: number
    dLSessionId: number
    _all: number
  }


  export type LabelsInDLSessionsMinAggregateInputType = {
    labelId?: true
    dLSessionId?: true
  }

  export type LabelsInDLSessionsMaxAggregateInputType = {
    labelId?: true
    dLSessionId?: true
  }

  export type LabelsInDLSessionsCountAggregateInputType = {
    labelId?: true
    dLSessionId?: true
    _all?: true
  }

  export type LabelsInDLSessionsAggregateArgs = {
    /**
     * Filter which LabelsInDLSessions to aggregate.
     * 
    **/
    where?: LabelsInDLSessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabelsInDLSessions to fetch.
     * 
    **/
    orderBy?: Enumerable<LabelsInDLSessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: LabelsInDLSessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabelsInDLSessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabelsInDLSessions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LabelsInDLSessions
    **/
    _count?: true | LabelsInDLSessionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LabelsInDLSessionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LabelsInDLSessionsMaxAggregateInputType
  }

  export type GetLabelsInDLSessionsAggregateType<T extends LabelsInDLSessionsAggregateArgs> = {
        [P in keyof T & keyof AggregateLabelsInDLSessions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLabelsInDLSessions[P]>
      : GetScalarType<T[P], AggregateLabelsInDLSessions[P]>
  }




  export type LabelsInDLSessionsGroupByArgs = {
    where?: LabelsInDLSessionsWhereInput
    orderBy?: Enumerable<LabelsInDLSessionsOrderByWithAggregationInput>
    by: Array<LabelsInDLSessionsScalarFieldEnum>
    having?: LabelsInDLSessionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LabelsInDLSessionsCountAggregateInputType | true
    _min?: LabelsInDLSessionsMinAggregateInputType
    _max?: LabelsInDLSessionsMaxAggregateInputType
  }


  export type LabelsInDLSessionsGroupByOutputType = {
    labelId: string
    dLSessionId: string
    _count: LabelsInDLSessionsCountAggregateOutputType | null
    _min: LabelsInDLSessionsMinAggregateOutputType | null
    _max: LabelsInDLSessionsMaxAggregateOutputType | null
  }

  type GetLabelsInDLSessionsGroupByPayload<T extends LabelsInDLSessionsGroupByArgs> = PrismaPromise<
    Array<
      PickArray<LabelsInDLSessionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LabelsInDLSessionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LabelsInDLSessionsGroupByOutputType[P]>
            : GetScalarType<T[P], LabelsInDLSessionsGroupByOutputType[P]>
        }
      >
    >


  export type LabelsInDLSessionsSelect = {
    labelId?: boolean
    dLSessionId?: boolean
    DLSession?: boolean | DLSessionArgs
    Label?: boolean | LabelArgs
  }

  export type LabelsInDLSessionsInclude = {
    DLSession?: boolean | DLSessionArgs
    Label?: boolean | LabelArgs
  }

  export type LabelsInDLSessionsGetPayload<
    S extends boolean | null | undefined | LabelsInDLSessionsArgs,
    U = keyof S
      > = S extends true
        ? LabelsInDLSessions
    : S extends undefined
    ? never
    : S extends LabelsInDLSessionsArgs | LabelsInDLSessionsFindManyArgs
    ?'include' extends U
    ? LabelsInDLSessions  & {
    [P in TrueKeys<S['include']>]:
        P extends 'DLSession' ? DLSessionGetPayload<Exclude<S['include'], undefined | null>[P]> :
        P extends 'Label' ? LabelGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'DLSession' ? DLSessionGetPayload<Exclude<S['select'], undefined | null>[P]> :
        P extends 'Label' ? LabelGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof LabelsInDLSessions ? LabelsInDLSessions[P] : never
  } 
    : LabelsInDLSessions
  : LabelsInDLSessions


  type LabelsInDLSessionsCountArgs = Merge<
    Omit<LabelsInDLSessionsFindManyArgs, 'select' | 'include'> & {
      select?: LabelsInDLSessionsCountAggregateInputType | true
    }
  >

  export interface LabelsInDLSessionsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one LabelsInDLSessions that matches the filter.
     * @param {LabelsInDLSessionsFindUniqueArgs} args - Arguments to find a LabelsInDLSessions
     * @example
     * // Get one LabelsInDLSessions
     * const labelsInDLSessions = await prisma.labelsInDLSessions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends LabelsInDLSessionsFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, LabelsInDLSessionsFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'LabelsInDLSessions'> extends True ? CheckSelect<T, Prisma__LabelsInDLSessionsClient<LabelsInDLSessions>, Prisma__LabelsInDLSessionsClient<LabelsInDLSessionsGetPayload<T>>> : CheckSelect<T, Prisma__LabelsInDLSessionsClient<LabelsInDLSessions | null, null>, Prisma__LabelsInDLSessionsClient<LabelsInDLSessionsGetPayload<T> | null, null>>

    /**
     * Find the first LabelsInDLSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabelsInDLSessionsFindFirstArgs} args - Arguments to find a LabelsInDLSessions
     * @example
     * // Get one LabelsInDLSessions
     * const labelsInDLSessions = await prisma.labelsInDLSessions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends LabelsInDLSessionsFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, LabelsInDLSessionsFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'LabelsInDLSessions'> extends True ? CheckSelect<T, Prisma__LabelsInDLSessionsClient<LabelsInDLSessions>, Prisma__LabelsInDLSessionsClient<LabelsInDLSessionsGetPayload<T>>> : CheckSelect<T, Prisma__LabelsInDLSessionsClient<LabelsInDLSessions | null, null>, Prisma__LabelsInDLSessionsClient<LabelsInDLSessionsGetPayload<T> | null, null>>

    /**
     * Find zero or more LabelsInDLSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabelsInDLSessionsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LabelsInDLSessions
     * const labelsInDLSessions = await prisma.labelsInDLSessions.findMany()
     * 
     * // Get first 10 LabelsInDLSessions
     * const labelsInDLSessions = await prisma.labelsInDLSessions.findMany({ take: 10 })
     * 
     * // Only select the `labelId`
     * const labelsInDLSessionsWithLabelIdOnly = await prisma.labelsInDLSessions.findMany({ select: { labelId: true } })
     * 
    **/
    findMany<T extends LabelsInDLSessionsFindManyArgs>(
      args?: SelectSubset<T, LabelsInDLSessionsFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<LabelsInDLSessions>>, PrismaPromise<Array<LabelsInDLSessionsGetPayload<T>>>>

    /**
     * Create a LabelsInDLSessions.
     * @param {LabelsInDLSessionsCreateArgs} args - Arguments to create a LabelsInDLSessions.
     * @example
     * // Create one LabelsInDLSessions
     * const LabelsInDLSessions = await prisma.labelsInDLSessions.create({
     *   data: {
     *     // ... data to create a LabelsInDLSessions
     *   }
     * })
     * 
    **/
    create<T extends LabelsInDLSessionsCreateArgs>(
      args: SelectSubset<T, LabelsInDLSessionsCreateArgs>
    ): CheckSelect<T, Prisma__LabelsInDLSessionsClient<LabelsInDLSessions>, Prisma__LabelsInDLSessionsClient<LabelsInDLSessionsGetPayload<T>>>

    /**
     * Create many LabelsInDLSessions.
     *     @param {LabelsInDLSessionsCreateManyArgs} args - Arguments to create many LabelsInDLSessions.
     *     @example
     *     // Create many LabelsInDLSessions
     *     const labelsInDLSessions = await prisma.labelsInDLSessions.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends LabelsInDLSessionsCreateManyArgs>(
      args?: SelectSubset<T, LabelsInDLSessionsCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a LabelsInDLSessions.
     * @param {LabelsInDLSessionsDeleteArgs} args - Arguments to delete one LabelsInDLSessions.
     * @example
     * // Delete one LabelsInDLSessions
     * const LabelsInDLSessions = await prisma.labelsInDLSessions.delete({
     *   where: {
     *     // ... filter to delete one LabelsInDLSessions
     *   }
     * })
     * 
    **/
    delete<T extends LabelsInDLSessionsDeleteArgs>(
      args: SelectSubset<T, LabelsInDLSessionsDeleteArgs>
    ): CheckSelect<T, Prisma__LabelsInDLSessionsClient<LabelsInDLSessions>, Prisma__LabelsInDLSessionsClient<LabelsInDLSessionsGetPayload<T>>>

    /**
     * Update one LabelsInDLSessions.
     * @param {LabelsInDLSessionsUpdateArgs} args - Arguments to update one LabelsInDLSessions.
     * @example
     * // Update one LabelsInDLSessions
     * const labelsInDLSessions = await prisma.labelsInDLSessions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends LabelsInDLSessionsUpdateArgs>(
      args: SelectSubset<T, LabelsInDLSessionsUpdateArgs>
    ): CheckSelect<T, Prisma__LabelsInDLSessionsClient<LabelsInDLSessions>, Prisma__LabelsInDLSessionsClient<LabelsInDLSessionsGetPayload<T>>>

    /**
     * Delete zero or more LabelsInDLSessions.
     * @param {LabelsInDLSessionsDeleteManyArgs} args - Arguments to filter LabelsInDLSessions to delete.
     * @example
     * // Delete a few LabelsInDLSessions
     * const { count } = await prisma.labelsInDLSessions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends LabelsInDLSessionsDeleteManyArgs>(
      args?: SelectSubset<T, LabelsInDLSessionsDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more LabelsInDLSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabelsInDLSessionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LabelsInDLSessions
     * const labelsInDLSessions = await prisma.labelsInDLSessions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends LabelsInDLSessionsUpdateManyArgs>(
      args: SelectSubset<T, LabelsInDLSessionsUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one LabelsInDLSessions.
     * @param {LabelsInDLSessionsUpsertArgs} args - Arguments to update or create a LabelsInDLSessions.
     * @example
     * // Update or create a LabelsInDLSessions
     * const labelsInDLSessions = await prisma.labelsInDLSessions.upsert({
     *   create: {
     *     // ... data to create a LabelsInDLSessions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LabelsInDLSessions we want to update
     *   }
     * })
    **/
    upsert<T extends LabelsInDLSessionsUpsertArgs>(
      args: SelectSubset<T, LabelsInDLSessionsUpsertArgs>
    ): CheckSelect<T, Prisma__LabelsInDLSessionsClient<LabelsInDLSessions>, Prisma__LabelsInDLSessionsClient<LabelsInDLSessionsGetPayload<T>>>

    /**
     * Find one LabelsInDLSessions that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {LabelsInDLSessionsFindUniqueOrThrowArgs} args - Arguments to find a LabelsInDLSessions
     * @example
     * // Get one LabelsInDLSessions
     * const labelsInDLSessions = await prisma.labelsInDLSessions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends LabelsInDLSessionsFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, LabelsInDLSessionsFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__LabelsInDLSessionsClient<LabelsInDLSessions>, Prisma__LabelsInDLSessionsClient<LabelsInDLSessionsGetPayload<T>>>

    /**
     * Find the first LabelsInDLSessions that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabelsInDLSessionsFindFirstOrThrowArgs} args - Arguments to find a LabelsInDLSessions
     * @example
     * // Get one LabelsInDLSessions
     * const labelsInDLSessions = await prisma.labelsInDLSessions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends LabelsInDLSessionsFindFirstOrThrowArgs>(
      args?: SelectSubset<T, LabelsInDLSessionsFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__LabelsInDLSessionsClient<LabelsInDLSessions>, Prisma__LabelsInDLSessionsClient<LabelsInDLSessionsGetPayload<T>>>

    /**
     * Count the number of LabelsInDLSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabelsInDLSessionsCountArgs} args - Arguments to filter LabelsInDLSessions to count.
     * @example
     * // Count the number of LabelsInDLSessions
     * const count = await prisma.labelsInDLSessions.count({
     *   where: {
     *     // ... the filter for the LabelsInDLSessions we want to count
     *   }
     * })
    **/
    count<T extends LabelsInDLSessionsCountArgs>(
      args?: Subset<T, LabelsInDLSessionsCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LabelsInDLSessionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LabelsInDLSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabelsInDLSessionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LabelsInDLSessionsAggregateArgs>(args: Subset<T, LabelsInDLSessionsAggregateArgs>): PrismaPromise<GetLabelsInDLSessionsAggregateType<T>>

    /**
     * Group by LabelsInDLSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabelsInDLSessionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LabelsInDLSessionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LabelsInDLSessionsGroupByArgs['orderBy'] }
        : { orderBy?: LabelsInDLSessionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LabelsInDLSessionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLabelsInDLSessionsGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for LabelsInDLSessions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__LabelsInDLSessionsClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    DLSession<T extends DLSessionArgs = {}>(args?: Subset<T, DLSessionArgs>): CheckSelect<T, Prisma__DLSessionClient<DLSession | Null>, Prisma__DLSessionClient<DLSessionGetPayload<T> | Null>>;

    Label<T extends LabelArgs = {}>(args?: Subset<T, LabelArgs>): CheckSelect<T, Prisma__LabelClient<Label | Null>, Prisma__LabelClient<LabelGetPayload<T> | Null>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * LabelsInDLSessions base type for findUnique actions
   */
  export type LabelsInDLSessionsFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the LabelsInDLSessions
     * 
    **/
    select?: LabelsInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LabelsInDLSessionsInclude | null
    /**
     * Filter, which LabelsInDLSessions to fetch.
     * 
    **/
    where: LabelsInDLSessionsWhereUniqueInput
  }

  /**
   * LabelsInDLSessions: findUnique
   */
  export interface LabelsInDLSessionsFindUniqueArgs extends LabelsInDLSessionsFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * LabelsInDLSessions base type for findFirst actions
   */
  export type LabelsInDLSessionsFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the LabelsInDLSessions
     * 
    **/
    select?: LabelsInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LabelsInDLSessionsInclude | null
    /**
     * Filter, which LabelsInDLSessions to fetch.
     * 
    **/
    where?: LabelsInDLSessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabelsInDLSessions to fetch.
     * 
    **/
    orderBy?: Enumerable<LabelsInDLSessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LabelsInDLSessions.
     * 
    **/
    cursor?: LabelsInDLSessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabelsInDLSessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabelsInDLSessions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LabelsInDLSessions.
     * 
    **/
    distinct?: Enumerable<LabelsInDLSessionsScalarFieldEnum>
  }

  /**
   * LabelsInDLSessions: findFirst
   */
  export interface LabelsInDLSessionsFindFirstArgs extends LabelsInDLSessionsFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * LabelsInDLSessions findMany
   */
  export type LabelsInDLSessionsFindManyArgs = {
    /**
     * Select specific fields to fetch from the LabelsInDLSessions
     * 
    **/
    select?: LabelsInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LabelsInDLSessionsInclude | null
    /**
     * Filter, which LabelsInDLSessions to fetch.
     * 
    **/
    where?: LabelsInDLSessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabelsInDLSessions to fetch.
     * 
    **/
    orderBy?: Enumerable<LabelsInDLSessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LabelsInDLSessions.
     * 
    **/
    cursor?: LabelsInDLSessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabelsInDLSessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabelsInDLSessions.
     * 
    **/
    skip?: number
    distinct?: Enumerable<LabelsInDLSessionsScalarFieldEnum>
  }


  /**
   * LabelsInDLSessions create
   */
  export type LabelsInDLSessionsCreateArgs = {
    /**
     * Select specific fields to fetch from the LabelsInDLSessions
     * 
    **/
    select?: LabelsInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LabelsInDLSessionsInclude | null
    /**
     * The data needed to create a LabelsInDLSessions.
     * 
    **/
    data: XOR<LabelsInDLSessionsCreateInput, LabelsInDLSessionsUncheckedCreateInput>
  }


  /**
   * LabelsInDLSessions createMany
   */
  export type LabelsInDLSessionsCreateManyArgs = {
    /**
     * The data used to create many LabelsInDLSessions.
     * 
    **/
    data: Enumerable<LabelsInDLSessionsCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * LabelsInDLSessions update
   */
  export type LabelsInDLSessionsUpdateArgs = {
    /**
     * Select specific fields to fetch from the LabelsInDLSessions
     * 
    **/
    select?: LabelsInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LabelsInDLSessionsInclude | null
    /**
     * The data needed to update a LabelsInDLSessions.
     * 
    **/
    data: XOR<LabelsInDLSessionsUpdateInput, LabelsInDLSessionsUncheckedUpdateInput>
    /**
     * Choose, which LabelsInDLSessions to update.
     * 
    **/
    where: LabelsInDLSessionsWhereUniqueInput
  }


  /**
   * LabelsInDLSessions updateMany
   */
  export type LabelsInDLSessionsUpdateManyArgs = {
    /**
     * The data used to update LabelsInDLSessions.
     * 
    **/
    data: XOR<LabelsInDLSessionsUpdateManyMutationInput, LabelsInDLSessionsUncheckedUpdateManyInput>
    /**
     * Filter which LabelsInDLSessions to update
     * 
    **/
    where?: LabelsInDLSessionsWhereInput
  }


  /**
   * LabelsInDLSessions upsert
   */
  export type LabelsInDLSessionsUpsertArgs = {
    /**
     * Select specific fields to fetch from the LabelsInDLSessions
     * 
    **/
    select?: LabelsInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LabelsInDLSessionsInclude | null
    /**
     * The filter to search for the LabelsInDLSessions to update in case it exists.
     * 
    **/
    where: LabelsInDLSessionsWhereUniqueInput
    /**
     * In case the LabelsInDLSessions found by the `where` argument doesn't exist, create a new LabelsInDLSessions with this data.
     * 
    **/
    create: XOR<LabelsInDLSessionsCreateInput, LabelsInDLSessionsUncheckedCreateInput>
    /**
     * In case the LabelsInDLSessions was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<LabelsInDLSessionsUpdateInput, LabelsInDLSessionsUncheckedUpdateInput>
  }


  /**
   * LabelsInDLSessions delete
   */
  export type LabelsInDLSessionsDeleteArgs = {
    /**
     * Select specific fields to fetch from the LabelsInDLSessions
     * 
    **/
    select?: LabelsInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LabelsInDLSessionsInclude | null
    /**
     * Filter which LabelsInDLSessions to delete.
     * 
    **/
    where: LabelsInDLSessionsWhereUniqueInput
  }


  /**
   * LabelsInDLSessions deleteMany
   */
  export type LabelsInDLSessionsDeleteManyArgs = {
    /**
     * Filter which LabelsInDLSessions to delete
     * 
    **/
    where?: LabelsInDLSessionsWhereInput
  }


  /**
   * LabelsInDLSessions: findUniqueOrThrow
   */
  export type LabelsInDLSessionsFindUniqueOrThrowArgs = LabelsInDLSessionsFindUniqueArgsBase
      

  /**
   * LabelsInDLSessions: findFirstOrThrow
   */
  export type LabelsInDLSessionsFindFirstOrThrowArgs = LabelsInDLSessionsFindFirstArgsBase
      

  /**
   * LabelsInDLSessions without action
   */
  export type LabelsInDLSessionsArgs = {
    /**
     * Select specific fields to fetch from the LabelsInDLSessions
     * 
    **/
    select?: LabelsInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LabelsInDLSessionsInclude | null
  }



  /**
   * Model LabelsInExtractedResourcesInDLSessions
   */


  export type AggregateLabelsInExtractedResourcesInDLSessions = {
    _count: LabelsInExtractedResourcesInDLSessionsCountAggregateOutputType | null
    _min: LabelsInExtractedResourcesInDLSessionsMinAggregateOutputType | null
    _max: LabelsInExtractedResourcesInDLSessionsMaxAggregateOutputType | null
  }

  export type LabelsInExtractedResourcesInDLSessionsMinAggregateOutputType = {
    labelId: string | null
    extractedResourceId: string | null
    dLSessionId: string | null
  }

  export type LabelsInExtractedResourcesInDLSessionsMaxAggregateOutputType = {
    labelId: string | null
    extractedResourceId: string | null
    dLSessionId: string | null
  }

  export type LabelsInExtractedResourcesInDLSessionsCountAggregateOutputType = {
    labelId: number
    extractedResourceId: number
    dLSessionId: number
    _all: number
  }


  export type LabelsInExtractedResourcesInDLSessionsMinAggregateInputType = {
    labelId?: true
    extractedResourceId?: true
    dLSessionId?: true
  }

  export type LabelsInExtractedResourcesInDLSessionsMaxAggregateInputType = {
    labelId?: true
    extractedResourceId?: true
    dLSessionId?: true
  }

  export type LabelsInExtractedResourcesInDLSessionsCountAggregateInputType = {
    labelId?: true
    extractedResourceId?: true
    dLSessionId?: true
    _all?: true
  }

  export type LabelsInExtractedResourcesInDLSessionsAggregateArgs = {
    /**
     * Filter which LabelsInExtractedResourcesInDLSessions to aggregate.
     * 
    **/
    where?: LabelsInExtractedResourcesInDLSessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabelsInExtractedResourcesInDLSessions to fetch.
     * 
    **/
    orderBy?: Enumerable<LabelsInExtractedResourcesInDLSessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: LabelsInExtractedResourcesInDLSessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabelsInExtractedResourcesInDLSessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabelsInExtractedResourcesInDLSessions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LabelsInExtractedResourcesInDLSessions
    **/
    _count?: true | LabelsInExtractedResourcesInDLSessionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LabelsInExtractedResourcesInDLSessionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LabelsInExtractedResourcesInDLSessionsMaxAggregateInputType
  }

  export type GetLabelsInExtractedResourcesInDLSessionsAggregateType<T extends LabelsInExtractedResourcesInDLSessionsAggregateArgs> = {
        [P in keyof T & keyof AggregateLabelsInExtractedResourcesInDLSessions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLabelsInExtractedResourcesInDLSessions[P]>
      : GetScalarType<T[P], AggregateLabelsInExtractedResourcesInDLSessions[P]>
  }




  export type LabelsInExtractedResourcesInDLSessionsGroupByArgs = {
    where?: LabelsInExtractedResourcesInDLSessionsWhereInput
    orderBy?: Enumerable<LabelsInExtractedResourcesInDLSessionsOrderByWithAggregationInput>
    by: Array<LabelsInExtractedResourcesInDLSessionsScalarFieldEnum>
    having?: LabelsInExtractedResourcesInDLSessionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LabelsInExtractedResourcesInDLSessionsCountAggregateInputType | true
    _min?: LabelsInExtractedResourcesInDLSessionsMinAggregateInputType
    _max?: LabelsInExtractedResourcesInDLSessionsMaxAggregateInputType
  }


  export type LabelsInExtractedResourcesInDLSessionsGroupByOutputType = {
    labelId: string
    extractedResourceId: string
    dLSessionId: string
    _count: LabelsInExtractedResourcesInDLSessionsCountAggregateOutputType | null
    _min: LabelsInExtractedResourcesInDLSessionsMinAggregateOutputType | null
    _max: LabelsInExtractedResourcesInDLSessionsMaxAggregateOutputType | null
  }

  type GetLabelsInExtractedResourcesInDLSessionsGroupByPayload<T extends LabelsInExtractedResourcesInDLSessionsGroupByArgs> = PrismaPromise<
    Array<
      PickArray<LabelsInExtractedResourcesInDLSessionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LabelsInExtractedResourcesInDLSessionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LabelsInExtractedResourcesInDLSessionsGroupByOutputType[P]>
            : GetScalarType<T[P], LabelsInExtractedResourcesInDLSessionsGroupByOutputType[P]>
        }
      >
    >


  export type LabelsInExtractedResourcesInDLSessionsSelect = {
    labelId?: boolean
    extractedResourceId?: boolean
    dLSessionId?: boolean
    ExtractedResourcesInDLSessions?: boolean | ExtractedResourcesInDLSessionsArgs
    Label?: boolean | LabelArgs
  }

  export type LabelsInExtractedResourcesInDLSessionsInclude = {
    ExtractedResourcesInDLSessions?: boolean | ExtractedResourcesInDLSessionsArgs
    Label?: boolean | LabelArgs
  }

  export type LabelsInExtractedResourcesInDLSessionsGetPayload<
    S extends boolean | null | undefined | LabelsInExtractedResourcesInDLSessionsArgs,
    U = keyof S
      > = S extends true
        ? LabelsInExtractedResourcesInDLSessions
    : S extends undefined
    ? never
    : S extends LabelsInExtractedResourcesInDLSessionsArgs | LabelsInExtractedResourcesInDLSessionsFindManyArgs
    ?'include' extends U
    ? LabelsInExtractedResourcesInDLSessions  & {
    [P in TrueKeys<S['include']>]:
        P extends 'ExtractedResourcesInDLSessions' ? ExtractedResourcesInDLSessionsGetPayload<Exclude<S['include'], undefined | null>[P]> :
        P extends 'Label' ? LabelGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'ExtractedResourcesInDLSessions' ? ExtractedResourcesInDLSessionsGetPayload<Exclude<S['select'], undefined | null>[P]> :
        P extends 'Label' ? LabelGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof LabelsInExtractedResourcesInDLSessions ? LabelsInExtractedResourcesInDLSessions[P] : never
  } 
    : LabelsInExtractedResourcesInDLSessions
  : LabelsInExtractedResourcesInDLSessions


  type LabelsInExtractedResourcesInDLSessionsCountArgs = Merge<
    Omit<LabelsInExtractedResourcesInDLSessionsFindManyArgs, 'select' | 'include'> & {
      select?: LabelsInExtractedResourcesInDLSessionsCountAggregateInputType | true
    }
  >

  export interface LabelsInExtractedResourcesInDLSessionsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one LabelsInExtractedResourcesInDLSessions that matches the filter.
     * @param {LabelsInExtractedResourcesInDLSessionsFindUniqueArgs} args - Arguments to find a LabelsInExtractedResourcesInDLSessions
     * @example
     * // Get one LabelsInExtractedResourcesInDLSessions
     * const labelsInExtractedResourcesInDLSessions = await prisma.labelsInExtractedResourcesInDLSessions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends LabelsInExtractedResourcesInDLSessionsFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, LabelsInExtractedResourcesInDLSessionsFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'LabelsInExtractedResourcesInDLSessions'> extends True ? CheckSelect<T, Prisma__LabelsInExtractedResourcesInDLSessionsClient<LabelsInExtractedResourcesInDLSessions>, Prisma__LabelsInExtractedResourcesInDLSessionsClient<LabelsInExtractedResourcesInDLSessionsGetPayload<T>>> : CheckSelect<T, Prisma__LabelsInExtractedResourcesInDLSessionsClient<LabelsInExtractedResourcesInDLSessions | null, null>, Prisma__LabelsInExtractedResourcesInDLSessionsClient<LabelsInExtractedResourcesInDLSessionsGetPayload<T> | null, null>>

    /**
     * Find the first LabelsInExtractedResourcesInDLSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabelsInExtractedResourcesInDLSessionsFindFirstArgs} args - Arguments to find a LabelsInExtractedResourcesInDLSessions
     * @example
     * // Get one LabelsInExtractedResourcesInDLSessions
     * const labelsInExtractedResourcesInDLSessions = await prisma.labelsInExtractedResourcesInDLSessions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends LabelsInExtractedResourcesInDLSessionsFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, LabelsInExtractedResourcesInDLSessionsFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'LabelsInExtractedResourcesInDLSessions'> extends True ? CheckSelect<T, Prisma__LabelsInExtractedResourcesInDLSessionsClient<LabelsInExtractedResourcesInDLSessions>, Prisma__LabelsInExtractedResourcesInDLSessionsClient<LabelsInExtractedResourcesInDLSessionsGetPayload<T>>> : CheckSelect<T, Prisma__LabelsInExtractedResourcesInDLSessionsClient<LabelsInExtractedResourcesInDLSessions | null, null>, Prisma__LabelsInExtractedResourcesInDLSessionsClient<LabelsInExtractedResourcesInDLSessionsGetPayload<T> | null, null>>

    /**
     * Find zero or more LabelsInExtractedResourcesInDLSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabelsInExtractedResourcesInDLSessionsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LabelsInExtractedResourcesInDLSessions
     * const labelsInExtractedResourcesInDLSessions = await prisma.labelsInExtractedResourcesInDLSessions.findMany()
     * 
     * // Get first 10 LabelsInExtractedResourcesInDLSessions
     * const labelsInExtractedResourcesInDLSessions = await prisma.labelsInExtractedResourcesInDLSessions.findMany({ take: 10 })
     * 
     * // Only select the `labelId`
     * const labelsInExtractedResourcesInDLSessionsWithLabelIdOnly = await prisma.labelsInExtractedResourcesInDLSessions.findMany({ select: { labelId: true } })
     * 
    **/
    findMany<T extends LabelsInExtractedResourcesInDLSessionsFindManyArgs>(
      args?: SelectSubset<T, LabelsInExtractedResourcesInDLSessionsFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<LabelsInExtractedResourcesInDLSessions>>, PrismaPromise<Array<LabelsInExtractedResourcesInDLSessionsGetPayload<T>>>>

    /**
     * Create a LabelsInExtractedResourcesInDLSessions.
     * @param {LabelsInExtractedResourcesInDLSessionsCreateArgs} args - Arguments to create a LabelsInExtractedResourcesInDLSessions.
     * @example
     * // Create one LabelsInExtractedResourcesInDLSessions
     * const LabelsInExtractedResourcesInDLSessions = await prisma.labelsInExtractedResourcesInDLSessions.create({
     *   data: {
     *     // ... data to create a LabelsInExtractedResourcesInDLSessions
     *   }
     * })
     * 
    **/
    create<T extends LabelsInExtractedResourcesInDLSessionsCreateArgs>(
      args: SelectSubset<T, LabelsInExtractedResourcesInDLSessionsCreateArgs>
    ): CheckSelect<T, Prisma__LabelsInExtractedResourcesInDLSessionsClient<LabelsInExtractedResourcesInDLSessions>, Prisma__LabelsInExtractedResourcesInDLSessionsClient<LabelsInExtractedResourcesInDLSessionsGetPayload<T>>>

    /**
     * Create many LabelsInExtractedResourcesInDLSessions.
     *     @param {LabelsInExtractedResourcesInDLSessionsCreateManyArgs} args - Arguments to create many LabelsInExtractedResourcesInDLSessions.
     *     @example
     *     // Create many LabelsInExtractedResourcesInDLSessions
     *     const labelsInExtractedResourcesInDLSessions = await prisma.labelsInExtractedResourcesInDLSessions.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends LabelsInExtractedResourcesInDLSessionsCreateManyArgs>(
      args?: SelectSubset<T, LabelsInExtractedResourcesInDLSessionsCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a LabelsInExtractedResourcesInDLSessions.
     * @param {LabelsInExtractedResourcesInDLSessionsDeleteArgs} args - Arguments to delete one LabelsInExtractedResourcesInDLSessions.
     * @example
     * // Delete one LabelsInExtractedResourcesInDLSessions
     * const LabelsInExtractedResourcesInDLSessions = await prisma.labelsInExtractedResourcesInDLSessions.delete({
     *   where: {
     *     // ... filter to delete one LabelsInExtractedResourcesInDLSessions
     *   }
     * })
     * 
    **/
    delete<T extends LabelsInExtractedResourcesInDLSessionsDeleteArgs>(
      args: SelectSubset<T, LabelsInExtractedResourcesInDLSessionsDeleteArgs>
    ): CheckSelect<T, Prisma__LabelsInExtractedResourcesInDLSessionsClient<LabelsInExtractedResourcesInDLSessions>, Prisma__LabelsInExtractedResourcesInDLSessionsClient<LabelsInExtractedResourcesInDLSessionsGetPayload<T>>>

    /**
     * Update one LabelsInExtractedResourcesInDLSessions.
     * @param {LabelsInExtractedResourcesInDLSessionsUpdateArgs} args - Arguments to update one LabelsInExtractedResourcesInDLSessions.
     * @example
     * // Update one LabelsInExtractedResourcesInDLSessions
     * const labelsInExtractedResourcesInDLSessions = await prisma.labelsInExtractedResourcesInDLSessions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends LabelsInExtractedResourcesInDLSessionsUpdateArgs>(
      args: SelectSubset<T, LabelsInExtractedResourcesInDLSessionsUpdateArgs>
    ): CheckSelect<T, Prisma__LabelsInExtractedResourcesInDLSessionsClient<LabelsInExtractedResourcesInDLSessions>, Prisma__LabelsInExtractedResourcesInDLSessionsClient<LabelsInExtractedResourcesInDLSessionsGetPayload<T>>>

    /**
     * Delete zero or more LabelsInExtractedResourcesInDLSessions.
     * @param {LabelsInExtractedResourcesInDLSessionsDeleteManyArgs} args - Arguments to filter LabelsInExtractedResourcesInDLSessions to delete.
     * @example
     * // Delete a few LabelsInExtractedResourcesInDLSessions
     * const { count } = await prisma.labelsInExtractedResourcesInDLSessions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends LabelsInExtractedResourcesInDLSessionsDeleteManyArgs>(
      args?: SelectSubset<T, LabelsInExtractedResourcesInDLSessionsDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more LabelsInExtractedResourcesInDLSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabelsInExtractedResourcesInDLSessionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LabelsInExtractedResourcesInDLSessions
     * const labelsInExtractedResourcesInDLSessions = await prisma.labelsInExtractedResourcesInDLSessions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends LabelsInExtractedResourcesInDLSessionsUpdateManyArgs>(
      args: SelectSubset<T, LabelsInExtractedResourcesInDLSessionsUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one LabelsInExtractedResourcesInDLSessions.
     * @param {LabelsInExtractedResourcesInDLSessionsUpsertArgs} args - Arguments to update or create a LabelsInExtractedResourcesInDLSessions.
     * @example
     * // Update or create a LabelsInExtractedResourcesInDLSessions
     * const labelsInExtractedResourcesInDLSessions = await prisma.labelsInExtractedResourcesInDLSessions.upsert({
     *   create: {
     *     // ... data to create a LabelsInExtractedResourcesInDLSessions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LabelsInExtractedResourcesInDLSessions we want to update
     *   }
     * })
    **/
    upsert<T extends LabelsInExtractedResourcesInDLSessionsUpsertArgs>(
      args: SelectSubset<T, LabelsInExtractedResourcesInDLSessionsUpsertArgs>
    ): CheckSelect<T, Prisma__LabelsInExtractedResourcesInDLSessionsClient<LabelsInExtractedResourcesInDLSessions>, Prisma__LabelsInExtractedResourcesInDLSessionsClient<LabelsInExtractedResourcesInDLSessionsGetPayload<T>>>

    /**
     * Find one LabelsInExtractedResourcesInDLSessions that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {LabelsInExtractedResourcesInDLSessionsFindUniqueOrThrowArgs} args - Arguments to find a LabelsInExtractedResourcesInDLSessions
     * @example
     * // Get one LabelsInExtractedResourcesInDLSessions
     * const labelsInExtractedResourcesInDLSessions = await prisma.labelsInExtractedResourcesInDLSessions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends LabelsInExtractedResourcesInDLSessionsFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, LabelsInExtractedResourcesInDLSessionsFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__LabelsInExtractedResourcesInDLSessionsClient<LabelsInExtractedResourcesInDLSessions>, Prisma__LabelsInExtractedResourcesInDLSessionsClient<LabelsInExtractedResourcesInDLSessionsGetPayload<T>>>

    /**
     * Find the first LabelsInExtractedResourcesInDLSessions that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabelsInExtractedResourcesInDLSessionsFindFirstOrThrowArgs} args - Arguments to find a LabelsInExtractedResourcesInDLSessions
     * @example
     * // Get one LabelsInExtractedResourcesInDLSessions
     * const labelsInExtractedResourcesInDLSessions = await prisma.labelsInExtractedResourcesInDLSessions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends LabelsInExtractedResourcesInDLSessionsFindFirstOrThrowArgs>(
      args?: SelectSubset<T, LabelsInExtractedResourcesInDLSessionsFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__LabelsInExtractedResourcesInDLSessionsClient<LabelsInExtractedResourcesInDLSessions>, Prisma__LabelsInExtractedResourcesInDLSessionsClient<LabelsInExtractedResourcesInDLSessionsGetPayload<T>>>

    /**
     * Count the number of LabelsInExtractedResourcesInDLSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabelsInExtractedResourcesInDLSessionsCountArgs} args - Arguments to filter LabelsInExtractedResourcesInDLSessions to count.
     * @example
     * // Count the number of LabelsInExtractedResourcesInDLSessions
     * const count = await prisma.labelsInExtractedResourcesInDLSessions.count({
     *   where: {
     *     // ... the filter for the LabelsInExtractedResourcesInDLSessions we want to count
     *   }
     * })
    **/
    count<T extends LabelsInExtractedResourcesInDLSessionsCountArgs>(
      args?: Subset<T, LabelsInExtractedResourcesInDLSessionsCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LabelsInExtractedResourcesInDLSessionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LabelsInExtractedResourcesInDLSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabelsInExtractedResourcesInDLSessionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LabelsInExtractedResourcesInDLSessionsAggregateArgs>(args: Subset<T, LabelsInExtractedResourcesInDLSessionsAggregateArgs>): PrismaPromise<GetLabelsInExtractedResourcesInDLSessionsAggregateType<T>>

    /**
     * Group by LabelsInExtractedResourcesInDLSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabelsInExtractedResourcesInDLSessionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LabelsInExtractedResourcesInDLSessionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LabelsInExtractedResourcesInDLSessionsGroupByArgs['orderBy'] }
        : { orderBy?: LabelsInExtractedResourcesInDLSessionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LabelsInExtractedResourcesInDLSessionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLabelsInExtractedResourcesInDLSessionsGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for LabelsInExtractedResourcesInDLSessions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__LabelsInExtractedResourcesInDLSessionsClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    ExtractedResourcesInDLSessions<T extends ExtractedResourcesInDLSessionsArgs = {}>(args?: Subset<T, ExtractedResourcesInDLSessionsArgs>): CheckSelect<T, Prisma__ExtractedResourcesInDLSessionsClient<ExtractedResourcesInDLSessions | Null>, Prisma__ExtractedResourcesInDLSessionsClient<ExtractedResourcesInDLSessionsGetPayload<T> | Null>>;

    Label<T extends LabelArgs = {}>(args?: Subset<T, LabelArgs>): CheckSelect<T, Prisma__LabelClient<Label | Null>, Prisma__LabelClient<LabelGetPayload<T> | Null>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * LabelsInExtractedResourcesInDLSessions base type for findUnique actions
   */
  export type LabelsInExtractedResourcesInDLSessionsFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the LabelsInExtractedResourcesInDLSessions
     * 
    **/
    select?: LabelsInExtractedResourcesInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LabelsInExtractedResourcesInDLSessionsInclude | null
    /**
     * Filter, which LabelsInExtractedResourcesInDLSessions to fetch.
     * 
    **/
    where: LabelsInExtractedResourcesInDLSessionsWhereUniqueInput
  }

  /**
   * LabelsInExtractedResourcesInDLSessions: findUnique
   */
  export interface LabelsInExtractedResourcesInDLSessionsFindUniqueArgs extends LabelsInExtractedResourcesInDLSessionsFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * LabelsInExtractedResourcesInDLSessions base type for findFirst actions
   */
  export type LabelsInExtractedResourcesInDLSessionsFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the LabelsInExtractedResourcesInDLSessions
     * 
    **/
    select?: LabelsInExtractedResourcesInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LabelsInExtractedResourcesInDLSessionsInclude | null
    /**
     * Filter, which LabelsInExtractedResourcesInDLSessions to fetch.
     * 
    **/
    where?: LabelsInExtractedResourcesInDLSessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabelsInExtractedResourcesInDLSessions to fetch.
     * 
    **/
    orderBy?: Enumerable<LabelsInExtractedResourcesInDLSessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LabelsInExtractedResourcesInDLSessions.
     * 
    **/
    cursor?: LabelsInExtractedResourcesInDLSessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabelsInExtractedResourcesInDLSessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabelsInExtractedResourcesInDLSessions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LabelsInExtractedResourcesInDLSessions.
     * 
    **/
    distinct?: Enumerable<LabelsInExtractedResourcesInDLSessionsScalarFieldEnum>
  }

  /**
   * LabelsInExtractedResourcesInDLSessions: findFirst
   */
  export interface LabelsInExtractedResourcesInDLSessionsFindFirstArgs extends LabelsInExtractedResourcesInDLSessionsFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * LabelsInExtractedResourcesInDLSessions findMany
   */
  export type LabelsInExtractedResourcesInDLSessionsFindManyArgs = {
    /**
     * Select specific fields to fetch from the LabelsInExtractedResourcesInDLSessions
     * 
    **/
    select?: LabelsInExtractedResourcesInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LabelsInExtractedResourcesInDLSessionsInclude | null
    /**
     * Filter, which LabelsInExtractedResourcesInDLSessions to fetch.
     * 
    **/
    where?: LabelsInExtractedResourcesInDLSessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabelsInExtractedResourcesInDLSessions to fetch.
     * 
    **/
    orderBy?: Enumerable<LabelsInExtractedResourcesInDLSessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LabelsInExtractedResourcesInDLSessions.
     * 
    **/
    cursor?: LabelsInExtractedResourcesInDLSessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabelsInExtractedResourcesInDLSessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabelsInExtractedResourcesInDLSessions.
     * 
    **/
    skip?: number
    distinct?: Enumerable<LabelsInExtractedResourcesInDLSessionsScalarFieldEnum>
  }


  /**
   * LabelsInExtractedResourcesInDLSessions create
   */
  export type LabelsInExtractedResourcesInDLSessionsCreateArgs = {
    /**
     * Select specific fields to fetch from the LabelsInExtractedResourcesInDLSessions
     * 
    **/
    select?: LabelsInExtractedResourcesInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LabelsInExtractedResourcesInDLSessionsInclude | null
    /**
     * The data needed to create a LabelsInExtractedResourcesInDLSessions.
     * 
    **/
    data: XOR<LabelsInExtractedResourcesInDLSessionsCreateInput, LabelsInExtractedResourcesInDLSessionsUncheckedCreateInput>
  }


  /**
   * LabelsInExtractedResourcesInDLSessions createMany
   */
  export type LabelsInExtractedResourcesInDLSessionsCreateManyArgs = {
    /**
     * The data used to create many LabelsInExtractedResourcesInDLSessions.
     * 
    **/
    data: Enumerable<LabelsInExtractedResourcesInDLSessionsCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * LabelsInExtractedResourcesInDLSessions update
   */
  export type LabelsInExtractedResourcesInDLSessionsUpdateArgs = {
    /**
     * Select specific fields to fetch from the LabelsInExtractedResourcesInDLSessions
     * 
    **/
    select?: LabelsInExtractedResourcesInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LabelsInExtractedResourcesInDLSessionsInclude | null
    /**
     * The data needed to update a LabelsInExtractedResourcesInDLSessions.
     * 
    **/
    data: XOR<LabelsInExtractedResourcesInDLSessionsUpdateInput, LabelsInExtractedResourcesInDLSessionsUncheckedUpdateInput>
    /**
     * Choose, which LabelsInExtractedResourcesInDLSessions to update.
     * 
    **/
    where: LabelsInExtractedResourcesInDLSessionsWhereUniqueInput
  }


  /**
   * LabelsInExtractedResourcesInDLSessions updateMany
   */
  export type LabelsInExtractedResourcesInDLSessionsUpdateManyArgs = {
    /**
     * The data used to update LabelsInExtractedResourcesInDLSessions.
     * 
    **/
    data: XOR<LabelsInExtractedResourcesInDLSessionsUpdateManyMutationInput, LabelsInExtractedResourcesInDLSessionsUncheckedUpdateManyInput>
    /**
     * Filter which LabelsInExtractedResourcesInDLSessions to update
     * 
    **/
    where?: LabelsInExtractedResourcesInDLSessionsWhereInput
  }


  /**
   * LabelsInExtractedResourcesInDLSessions upsert
   */
  export type LabelsInExtractedResourcesInDLSessionsUpsertArgs = {
    /**
     * Select specific fields to fetch from the LabelsInExtractedResourcesInDLSessions
     * 
    **/
    select?: LabelsInExtractedResourcesInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LabelsInExtractedResourcesInDLSessionsInclude | null
    /**
     * The filter to search for the LabelsInExtractedResourcesInDLSessions to update in case it exists.
     * 
    **/
    where: LabelsInExtractedResourcesInDLSessionsWhereUniqueInput
    /**
     * In case the LabelsInExtractedResourcesInDLSessions found by the `where` argument doesn't exist, create a new LabelsInExtractedResourcesInDLSessions with this data.
     * 
    **/
    create: XOR<LabelsInExtractedResourcesInDLSessionsCreateInput, LabelsInExtractedResourcesInDLSessionsUncheckedCreateInput>
    /**
     * In case the LabelsInExtractedResourcesInDLSessions was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<LabelsInExtractedResourcesInDLSessionsUpdateInput, LabelsInExtractedResourcesInDLSessionsUncheckedUpdateInput>
  }


  /**
   * LabelsInExtractedResourcesInDLSessions delete
   */
  export type LabelsInExtractedResourcesInDLSessionsDeleteArgs = {
    /**
     * Select specific fields to fetch from the LabelsInExtractedResourcesInDLSessions
     * 
    **/
    select?: LabelsInExtractedResourcesInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LabelsInExtractedResourcesInDLSessionsInclude | null
    /**
     * Filter which LabelsInExtractedResourcesInDLSessions to delete.
     * 
    **/
    where: LabelsInExtractedResourcesInDLSessionsWhereUniqueInput
  }


  /**
   * LabelsInExtractedResourcesInDLSessions deleteMany
   */
  export type LabelsInExtractedResourcesInDLSessionsDeleteManyArgs = {
    /**
     * Filter which LabelsInExtractedResourcesInDLSessions to delete
     * 
    **/
    where?: LabelsInExtractedResourcesInDLSessionsWhereInput
  }


  /**
   * LabelsInExtractedResourcesInDLSessions: findUniqueOrThrow
   */
  export type LabelsInExtractedResourcesInDLSessionsFindUniqueOrThrowArgs = LabelsInExtractedResourcesInDLSessionsFindUniqueArgsBase
      

  /**
   * LabelsInExtractedResourcesInDLSessions: findFirstOrThrow
   */
  export type LabelsInExtractedResourcesInDLSessionsFindFirstOrThrowArgs = LabelsInExtractedResourcesInDLSessionsFindFirstArgsBase
      

  /**
   * LabelsInExtractedResourcesInDLSessions without action
   */
  export type LabelsInExtractedResourcesInDLSessionsArgs = {
    /**
     * Select specific fields to fetch from the LabelsInExtractedResourcesInDLSessions
     * 
    **/
    select?: LabelsInExtractedResourcesInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LabelsInExtractedResourcesInDLSessionsInclude | null
  }



  /**
   * Model Patient
   */


  export type AggregatePatient = {
    _count: PatientCountAggregateOutputType | null
    _min: PatientMinAggregateOutputType | null
    _max: PatientMaxAggregateOutputType | null
  }

  export type PatientMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PatientMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PatientCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PatientMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PatientMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PatientCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PatientAggregateArgs = {
    /**
     * Filter which Patient to aggregate.
     * 
    **/
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     * 
    **/
    orderBy?: Enumerable<PatientOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Patients
    **/
    _count?: true | PatientCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PatientMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PatientMaxAggregateInputType
  }

  export type GetPatientAggregateType<T extends PatientAggregateArgs> = {
        [P in keyof T & keyof AggregatePatient]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePatient[P]>
      : GetScalarType<T[P], AggregatePatient[P]>
  }




  export type PatientGroupByArgs = {
    where?: PatientWhereInput
    orderBy?: Enumerable<PatientOrderByWithAggregationInput>
    by: Array<PatientScalarFieldEnum>
    having?: PatientScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PatientCountAggregateInputType | true
    _min?: PatientMinAggregateInputType
    _max?: PatientMaxAggregateInputType
  }


  export type PatientGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    _count: PatientCountAggregateOutputType | null
    _min: PatientMinAggregateOutputType | null
    _max: PatientMaxAggregateOutputType | null
  }

  type GetPatientGroupByPayload<T extends PatientGroupByArgs> = PrismaPromise<
    Array<
      PickArray<PatientGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PatientGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PatientGroupByOutputType[P]>
            : GetScalarType<T[P], PatientGroupByOutputType[P]>
        }
      >
    >


  export type PatientSelect = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    Visit?: boolean | VisitFindManyArgs
    _count?: boolean | PatientCountOutputTypeArgs
  }

  export type PatientInclude = {
    Visit?: boolean | VisitFindManyArgs
    _count?: boolean | PatientCountOutputTypeArgs
  }

  export type PatientGetPayload<
    S extends boolean | null | undefined | PatientArgs,
    U = keyof S
      > = S extends true
        ? Patient
    : S extends undefined
    ? never
    : S extends PatientArgs | PatientFindManyArgs
    ?'include' extends U
    ? Patient  & {
    [P in TrueKeys<S['include']>]:
        P extends 'Visit' ? Array < VisitGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends '_count' ? PatientCountOutputTypeGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'Visit' ? Array < VisitGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends '_count' ? PatientCountOutputTypeGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof Patient ? Patient[P] : never
  } 
    : Patient
  : Patient


  type PatientCountArgs = Merge<
    Omit<PatientFindManyArgs, 'select' | 'include'> & {
      select?: PatientCountAggregateInputType | true
    }
  >

  export interface PatientDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one Patient that matches the filter.
     * @param {PatientFindUniqueArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends PatientFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, PatientFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Patient'> extends True ? CheckSelect<T, Prisma__PatientClient<Patient>, Prisma__PatientClient<PatientGetPayload<T>>> : CheckSelect<T, Prisma__PatientClient<Patient | null, null>, Prisma__PatientClient<PatientGetPayload<T> | null, null>>

    /**
     * Find the first Patient that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindFirstArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends PatientFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, PatientFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Patient'> extends True ? CheckSelect<T, Prisma__PatientClient<Patient>, Prisma__PatientClient<PatientGetPayload<T>>> : CheckSelect<T, Prisma__PatientClient<Patient | null, null>, Prisma__PatientClient<PatientGetPayload<T> | null, null>>

    /**
     * Find zero or more Patients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Patients
     * const patients = await prisma.patient.findMany()
     * 
     * // Get first 10 Patients
     * const patients = await prisma.patient.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const patientWithIdOnly = await prisma.patient.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends PatientFindManyArgs>(
      args?: SelectSubset<T, PatientFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<Patient>>, PrismaPromise<Array<PatientGetPayload<T>>>>

    /**
     * Create a Patient.
     * @param {PatientCreateArgs} args - Arguments to create a Patient.
     * @example
     * // Create one Patient
     * const Patient = await prisma.patient.create({
     *   data: {
     *     // ... data to create a Patient
     *   }
     * })
     * 
    **/
    create<T extends PatientCreateArgs>(
      args: SelectSubset<T, PatientCreateArgs>
    ): CheckSelect<T, Prisma__PatientClient<Patient>, Prisma__PatientClient<PatientGetPayload<T>>>

    /**
     * Create many Patients.
     *     @param {PatientCreateManyArgs} args - Arguments to create many Patients.
     *     @example
     *     // Create many Patients
     *     const patient = await prisma.patient.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends PatientCreateManyArgs>(
      args?: SelectSubset<T, PatientCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Patient.
     * @param {PatientDeleteArgs} args - Arguments to delete one Patient.
     * @example
     * // Delete one Patient
     * const Patient = await prisma.patient.delete({
     *   where: {
     *     // ... filter to delete one Patient
     *   }
     * })
     * 
    **/
    delete<T extends PatientDeleteArgs>(
      args: SelectSubset<T, PatientDeleteArgs>
    ): CheckSelect<T, Prisma__PatientClient<Patient>, Prisma__PatientClient<PatientGetPayload<T>>>

    /**
     * Update one Patient.
     * @param {PatientUpdateArgs} args - Arguments to update one Patient.
     * @example
     * // Update one Patient
     * const patient = await prisma.patient.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends PatientUpdateArgs>(
      args: SelectSubset<T, PatientUpdateArgs>
    ): CheckSelect<T, Prisma__PatientClient<Patient>, Prisma__PatientClient<PatientGetPayload<T>>>

    /**
     * Delete zero or more Patients.
     * @param {PatientDeleteManyArgs} args - Arguments to filter Patients to delete.
     * @example
     * // Delete a few Patients
     * const { count } = await prisma.patient.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends PatientDeleteManyArgs>(
      args?: SelectSubset<T, PatientDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Patients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Patients
     * const patient = await prisma.patient.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends PatientUpdateManyArgs>(
      args: SelectSubset<T, PatientUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Patient.
     * @param {PatientUpsertArgs} args - Arguments to update or create a Patient.
     * @example
     * // Update or create a Patient
     * const patient = await prisma.patient.upsert({
     *   create: {
     *     // ... data to create a Patient
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Patient we want to update
     *   }
     * })
    **/
    upsert<T extends PatientUpsertArgs>(
      args: SelectSubset<T, PatientUpsertArgs>
    ): CheckSelect<T, Prisma__PatientClient<Patient>, Prisma__PatientClient<PatientGetPayload<T>>>

    /**
     * Find one Patient that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {PatientFindUniqueOrThrowArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends PatientFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, PatientFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__PatientClient<Patient>, Prisma__PatientClient<PatientGetPayload<T>>>

    /**
     * Find the first Patient that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindFirstOrThrowArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends PatientFindFirstOrThrowArgs>(
      args?: SelectSubset<T, PatientFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__PatientClient<Patient>, Prisma__PatientClient<PatientGetPayload<T>>>

    /**
     * Count the number of Patients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientCountArgs} args - Arguments to filter Patients to count.
     * @example
     * // Count the number of Patients
     * const count = await prisma.patient.count({
     *   where: {
     *     // ... the filter for the Patients we want to count
     *   }
     * })
    **/
    count<T extends PatientCountArgs>(
      args?: Subset<T, PatientCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PatientCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Patient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PatientAggregateArgs>(args: Subset<T, PatientAggregateArgs>): PrismaPromise<GetPatientAggregateType<T>>

    /**
     * Group by Patient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PatientGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PatientGroupByArgs['orderBy'] }
        : { orderBy?: PatientGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PatientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPatientGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Patient.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__PatientClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    Visit<T extends VisitFindManyArgs = {}>(args?: Subset<T, VisitFindManyArgs>): CheckSelect<T, PrismaPromise<Array<Visit>| Null>, PrismaPromise<Array<VisitGetPayload<T>>| Null>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Patient base type for findUnique actions
   */
  export type PatientFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Patient
     * 
    **/
    select?: PatientSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: PatientInclude | null
    /**
     * Filter, which Patient to fetch.
     * 
    **/
    where: PatientWhereUniqueInput
  }

  /**
   * Patient: findUnique
   */
  export interface PatientFindUniqueArgs extends PatientFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Patient base type for findFirst actions
   */
  export type PatientFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Patient
     * 
    **/
    select?: PatientSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: PatientInclude | null
    /**
     * Filter, which Patient to fetch.
     * 
    **/
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     * 
    **/
    orderBy?: Enumerable<PatientOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Patients.
     * 
    **/
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Patients.
     * 
    **/
    distinct?: Enumerable<PatientScalarFieldEnum>
  }

  /**
   * Patient: findFirst
   */
  export interface PatientFindFirstArgs extends PatientFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Patient findMany
   */
  export type PatientFindManyArgs = {
    /**
     * Select specific fields to fetch from the Patient
     * 
    **/
    select?: PatientSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: PatientInclude | null
    /**
     * Filter, which Patients to fetch.
     * 
    **/
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     * 
    **/
    orderBy?: Enumerable<PatientOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Patients.
     * 
    **/
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     * 
    **/
    skip?: number
    distinct?: Enumerable<PatientScalarFieldEnum>
  }


  /**
   * Patient create
   */
  export type PatientCreateArgs = {
    /**
     * Select specific fields to fetch from the Patient
     * 
    **/
    select?: PatientSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: PatientInclude | null
    /**
     * The data needed to create a Patient.
     * 
    **/
    data: XOR<PatientCreateInput, PatientUncheckedCreateInput>
  }


  /**
   * Patient createMany
   */
  export type PatientCreateManyArgs = {
    /**
     * The data used to create many Patients.
     * 
    **/
    data: Enumerable<PatientCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Patient update
   */
  export type PatientUpdateArgs = {
    /**
     * Select specific fields to fetch from the Patient
     * 
    **/
    select?: PatientSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: PatientInclude | null
    /**
     * The data needed to update a Patient.
     * 
    **/
    data: XOR<PatientUpdateInput, PatientUncheckedUpdateInput>
    /**
     * Choose, which Patient to update.
     * 
    **/
    where: PatientWhereUniqueInput
  }


  /**
   * Patient updateMany
   */
  export type PatientUpdateManyArgs = {
    /**
     * The data used to update Patients.
     * 
    **/
    data: XOR<PatientUpdateManyMutationInput, PatientUncheckedUpdateManyInput>
    /**
     * Filter which Patients to update
     * 
    **/
    where?: PatientWhereInput
  }


  /**
   * Patient upsert
   */
  export type PatientUpsertArgs = {
    /**
     * Select specific fields to fetch from the Patient
     * 
    **/
    select?: PatientSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: PatientInclude | null
    /**
     * The filter to search for the Patient to update in case it exists.
     * 
    **/
    where: PatientWhereUniqueInput
    /**
     * In case the Patient found by the `where` argument doesn't exist, create a new Patient with this data.
     * 
    **/
    create: XOR<PatientCreateInput, PatientUncheckedCreateInput>
    /**
     * In case the Patient was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<PatientUpdateInput, PatientUncheckedUpdateInput>
  }


  /**
   * Patient delete
   */
  export type PatientDeleteArgs = {
    /**
     * Select specific fields to fetch from the Patient
     * 
    **/
    select?: PatientSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: PatientInclude | null
    /**
     * Filter which Patient to delete.
     * 
    **/
    where: PatientWhereUniqueInput
  }


  /**
   * Patient deleteMany
   */
  export type PatientDeleteManyArgs = {
    /**
     * Filter which Patients to delete
     * 
    **/
    where?: PatientWhereInput
  }


  /**
   * Patient: findUniqueOrThrow
   */
  export type PatientFindUniqueOrThrowArgs = PatientFindUniqueArgsBase
      

  /**
   * Patient: findFirstOrThrow
   */
  export type PatientFindFirstOrThrowArgs = PatientFindFirstArgsBase
      

  /**
   * Patient without action
   */
  export type PatientArgs = {
    /**
     * Select specific fields to fetch from the Patient
     * 
    **/
    select?: PatientSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: PatientInclude | null
  }



  /**
   * Model Project
   */


  export type AggregateProject = {
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  export type ProjectMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    description: string | null
    epicId: string | null
  }

  export type ProjectMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    description: string | null
    epicId: string | null
  }

  export type ProjectCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    name: number
    description: number
    epicId: number
    _all: number
  }


  export type ProjectMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    description?: true
    epicId?: true
  }

  export type ProjectMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    description?: true
    epicId?: true
  }

  export type ProjectCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    description?: true
    epicId?: true
    _all?: true
  }

  export type ProjectAggregateArgs = {
    /**
     * Filter which Project to aggregate.
     * 
    **/
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     * 
    **/
    orderBy?: Enumerable<ProjectOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Projects
    **/
    _count?: true | ProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectMaxAggregateInputType
  }

  export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProject[P]>
      : GetScalarType<T[P], AggregateProject[P]>
  }




  export type ProjectGroupByArgs = {
    where?: ProjectWhereInput
    orderBy?: Enumerable<ProjectOrderByWithAggregationInput>
    by: Array<ProjectScalarFieldEnum>
    having?: ProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectCountAggregateInputType | true
    _min?: ProjectMinAggregateInputType
    _max?: ProjectMaxAggregateInputType
  }


  export type ProjectGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    name: string
    description: string
    epicId: string
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  type GetProjectGroupByPayload<T extends ProjectGroupByArgs> = PrismaPromise<
    Array<
      PickArray<ProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectGroupByOutputType[P]>
        }
      >
    >


  export type ProjectSelect = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    description?: boolean
    epicId?: boolean
    Epic?: boolean | EpicArgs
    CESession?: boolean | CESessionFindManyArgs
    DLSession?: boolean | DLSessionFindManyArgs
    RASession?: boolean | RASessionFindManyArgs
    UsersInProjects?: boolean | UsersInProjectsFindManyArgs
    _count?: boolean | ProjectCountOutputTypeArgs
  }

  export type ProjectInclude = {
    Epic?: boolean | EpicArgs
    CESession?: boolean | CESessionFindManyArgs
    DLSession?: boolean | DLSessionFindManyArgs
    RASession?: boolean | RASessionFindManyArgs
    UsersInProjects?: boolean | UsersInProjectsFindManyArgs
    _count?: boolean | ProjectCountOutputTypeArgs
  }

  export type ProjectGetPayload<
    S extends boolean | null | undefined | ProjectArgs,
    U = keyof S
      > = S extends true
        ? Project
    : S extends undefined
    ? never
    : S extends ProjectArgs | ProjectFindManyArgs
    ?'include' extends U
    ? Project  & {
    [P in TrueKeys<S['include']>]:
        P extends 'Epic' ? EpicGetPayload<Exclude<S['include'], undefined | null>[P]> :
        P extends 'CESession' ? Array < CESessionGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends 'DLSession' ? Array < DLSessionGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends 'RASession' ? Array < RASessionGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends 'UsersInProjects' ? Array < UsersInProjectsGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends '_count' ? ProjectCountOutputTypeGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'Epic' ? EpicGetPayload<Exclude<S['select'], undefined | null>[P]> :
        P extends 'CESession' ? Array < CESessionGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends 'DLSession' ? Array < DLSessionGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends 'RASession' ? Array < RASessionGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends 'UsersInProjects' ? Array < UsersInProjectsGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends '_count' ? ProjectCountOutputTypeGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof Project ? Project[P] : never
  } 
    : Project
  : Project


  type ProjectCountArgs = Merge<
    Omit<ProjectFindManyArgs, 'select' | 'include'> & {
      select?: ProjectCountAggregateInputType | true
    }
  >

  export interface ProjectDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one Project that matches the filter.
     * @param {ProjectFindUniqueArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends ProjectFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, ProjectFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Project'> extends True ? CheckSelect<T, Prisma__ProjectClient<Project>, Prisma__ProjectClient<ProjectGetPayload<T>>> : CheckSelect<T, Prisma__ProjectClient<Project | null, null>, Prisma__ProjectClient<ProjectGetPayload<T> | null, null>>

    /**
     * Find the first Project that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends ProjectFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, ProjectFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Project'> extends True ? CheckSelect<T, Prisma__ProjectClient<Project>, Prisma__ProjectClient<ProjectGetPayload<T>>> : CheckSelect<T, Prisma__ProjectClient<Project | null, null>, Prisma__ProjectClient<ProjectGetPayload<T> | null, null>>

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.project.findMany()
     * 
     * // Get first 10 Projects
     * const projects = await prisma.project.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectWithIdOnly = await prisma.project.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends ProjectFindManyArgs>(
      args?: SelectSubset<T, ProjectFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<Project>>, PrismaPromise<Array<ProjectGetPayload<T>>>>

    /**
     * Create a Project.
     * @param {ProjectCreateArgs} args - Arguments to create a Project.
     * @example
     * // Create one Project
     * const Project = await prisma.project.create({
     *   data: {
     *     // ... data to create a Project
     *   }
     * })
     * 
    **/
    create<T extends ProjectCreateArgs>(
      args: SelectSubset<T, ProjectCreateArgs>
    ): CheckSelect<T, Prisma__ProjectClient<Project>, Prisma__ProjectClient<ProjectGetPayload<T>>>

    /**
     * Create many Projects.
     *     @param {ProjectCreateManyArgs} args - Arguments to create many Projects.
     *     @example
     *     // Create many Projects
     *     const project = await prisma.project.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends ProjectCreateManyArgs>(
      args?: SelectSubset<T, ProjectCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Project.
     * @param {ProjectDeleteArgs} args - Arguments to delete one Project.
     * @example
     * // Delete one Project
     * const Project = await prisma.project.delete({
     *   where: {
     *     // ... filter to delete one Project
     *   }
     * })
     * 
    **/
    delete<T extends ProjectDeleteArgs>(
      args: SelectSubset<T, ProjectDeleteArgs>
    ): CheckSelect<T, Prisma__ProjectClient<Project>, Prisma__ProjectClient<ProjectGetPayload<T>>>

    /**
     * Update one Project.
     * @param {ProjectUpdateArgs} args - Arguments to update one Project.
     * @example
     * // Update one Project
     * const project = await prisma.project.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends ProjectUpdateArgs>(
      args: SelectSubset<T, ProjectUpdateArgs>
    ): CheckSelect<T, Prisma__ProjectClient<Project>, Prisma__ProjectClient<ProjectGetPayload<T>>>

    /**
     * Delete zero or more Projects.
     * @param {ProjectDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.project.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends ProjectDeleteManyArgs>(
      args?: SelectSubset<T, ProjectDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends ProjectUpdateManyArgs>(
      args: SelectSubset<T, ProjectUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Project.
     * @param {ProjectUpsertArgs} args - Arguments to update or create a Project.
     * @example
     * // Update or create a Project
     * const project = await prisma.project.upsert({
     *   create: {
     *     // ... data to create a Project
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Project we want to update
     *   }
     * })
    **/
    upsert<T extends ProjectUpsertArgs>(
      args: SelectSubset<T, ProjectUpsertArgs>
    ): CheckSelect<T, Prisma__ProjectClient<Project>, Prisma__ProjectClient<ProjectGetPayload<T>>>

    /**
     * Find one Project that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {ProjectFindUniqueOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends ProjectFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, ProjectFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__ProjectClient<Project>, Prisma__ProjectClient<ProjectGetPayload<T>>>

    /**
     * Find the first Project that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends ProjectFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ProjectFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__ProjectClient<Project>, Prisma__ProjectClient<ProjectGetPayload<T>>>

    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.project.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
    **/
    count<T extends ProjectCountArgs>(
      args?: Subset<T, ProjectCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectAggregateArgs>(args: Subset<T, ProjectAggregateArgs>): PrismaPromise<GetProjectAggregateType<T>>

    /**
     * Group by Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectGroupByArgs['orderBy'] }
        : { orderBy?: ProjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Project.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__ProjectClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    Epic<T extends EpicArgs = {}>(args?: Subset<T, EpicArgs>): CheckSelect<T, Prisma__EpicClient<Epic | Null>, Prisma__EpicClient<EpicGetPayload<T> | Null>>;

    CESession<T extends CESessionFindManyArgs = {}>(args?: Subset<T, CESessionFindManyArgs>): CheckSelect<T, PrismaPromise<Array<CESession>| Null>, PrismaPromise<Array<CESessionGetPayload<T>>| Null>>;

    DLSession<T extends DLSessionFindManyArgs = {}>(args?: Subset<T, DLSessionFindManyArgs>): CheckSelect<T, PrismaPromise<Array<DLSession>| Null>, PrismaPromise<Array<DLSessionGetPayload<T>>| Null>>;

    RASession<T extends RASessionFindManyArgs = {}>(args?: Subset<T, RASessionFindManyArgs>): CheckSelect<T, PrismaPromise<Array<RASession>| Null>, PrismaPromise<Array<RASessionGetPayload<T>>| Null>>;

    UsersInProjects<T extends UsersInProjectsFindManyArgs = {}>(args?: Subset<T, UsersInProjectsFindManyArgs>): CheckSelect<T, PrismaPromise<Array<UsersInProjects>| Null>, PrismaPromise<Array<UsersInProjectsGetPayload<T>>| Null>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Project base type for findUnique actions
   */
  export type ProjectFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Project
     * 
    **/
    select?: ProjectSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ProjectInclude | null
    /**
     * Filter, which Project to fetch.
     * 
    **/
    where: ProjectWhereUniqueInput
  }

  /**
   * Project: findUnique
   */
  export interface ProjectFindUniqueArgs extends ProjectFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Project base type for findFirst actions
   */
  export type ProjectFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Project
     * 
    **/
    select?: ProjectSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ProjectInclude | null
    /**
     * Filter, which Project to fetch.
     * 
    **/
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     * 
    **/
    orderBy?: Enumerable<ProjectOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     * 
    **/
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     * 
    **/
    distinct?: Enumerable<ProjectScalarFieldEnum>
  }

  /**
   * Project: findFirst
   */
  export interface ProjectFindFirstArgs extends ProjectFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Project findMany
   */
  export type ProjectFindManyArgs = {
    /**
     * Select specific fields to fetch from the Project
     * 
    **/
    select?: ProjectSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ProjectInclude | null
    /**
     * Filter, which Projects to fetch.
     * 
    **/
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     * 
    **/
    orderBy?: Enumerable<ProjectOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Projects.
     * 
    **/
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     * 
    **/
    skip?: number
    distinct?: Enumerable<ProjectScalarFieldEnum>
  }


  /**
   * Project create
   */
  export type ProjectCreateArgs = {
    /**
     * Select specific fields to fetch from the Project
     * 
    **/
    select?: ProjectSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ProjectInclude | null
    /**
     * The data needed to create a Project.
     * 
    **/
    data: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
  }


  /**
   * Project createMany
   */
  export type ProjectCreateManyArgs = {
    /**
     * The data used to create many Projects.
     * 
    **/
    data: Enumerable<ProjectCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Project update
   */
  export type ProjectUpdateArgs = {
    /**
     * Select specific fields to fetch from the Project
     * 
    **/
    select?: ProjectSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ProjectInclude | null
    /**
     * The data needed to update a Project.
     * 
    **/
    data: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
    /**
     * Choose, which Project to update.
     * 
    **/
    where: ProjectWhereUniqueInput
  }


  /**
   * Project updateMany
   */
  export type ProjectUpdateManyArgs = {
    /**
     * The data used to update Projects.
     * 
    **/
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     * 
    **/
    where?: ProjectWhereInput
  }


  /**
   * Project upsert
   */
  export type ProjectUpsertArgs = {
    /**
     * Select specific fields to fetch from the Project
     * 
    **/
    select?: ProjectSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ProjectInclude | null
    /**
     * The filter to search for the Project to update in case it exists.
     * 
    **/
    where: ProjectWhereUniqueInput
    /**
     * In case the Project found by the `where` argument doesn't exist, create a new Project with this data.
     * 
    **/
    create: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
    /**
     * In case the Project was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
  }


  /**
   * Project delete
   */
  export type ProjectDeleteArgs = {
    /**
     * Select specific fields to fetch from the Project
     * 
    **/
    select?: ProjectSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ProjectInclude | null
    /**
     * Filter which Project to delete.
     * 
    **/
    where: ProjectWhereUniqueInput
  }


  /**
   * Project deleteMany
   */
  export type ProjectDeleteManyArgs = {
    /**
     * Filter which Projects to delete
     * 
    **/
    where?: ProjectWhereInput
  }


  /**
   * Project: findUniqueOrThrow
   */
  export type ProjectFindUniqueOrThrowArgs = ProjectFindUniqueArgsBase
      

  /**
   * Project: findFirstOrThrow
   */
  export type ProjectFindFirstOrThrowArgs = ProjectFindFirstArgsBase
      

  /**
   * Project without action
   */
  export type ProjectArgs = {
    /**
     * Select specific fields to fetch from the Project
     * 
    **/
    select?: ProjectSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ProjectInclude | null
  }



  /**
   * Model RASession
   */


  export type AggregateRASession = {
    _count: RASessionCountAggregateOutputType | null
    _avg: RASessionAvgAggregateOutputType | null
    _sum: RASessionSumAggregateOutputType | null
    _min: RASessionMinAggregateOutputType | null
    _max: RASessionMaxAggregateOutputType | null
  }

  export type RASessionAvgAggregateOutputType = {
    priority: number | null
  }

  export type RASessionSumAggregateOutputType = {
    priority: number | null
  }

  export type RASessionMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    description: string | null
    priority: number | null
    projectId: string | null
  }

  export type RASessionMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    description: string | null
    priority: number | null
    projectId: string | null
  }

  export type RASessionCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    name: number
    description: number
    priority: number
    sop: number
    template: number
    projectId: number
    _all: number
  }


  export type RASessionAvgAggregateInputType = {
    priority?: true
  }

  export type RASessionSumAggregateInputType = {
    priority?: true
  }

  export type RASessionMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    description?: true
    priority?: true
    projectId?: true
  }

  export type RASessionMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    description?: true
    priority?: true
    projectId?: true
  }

  export type RASessionCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    description?: true
    priority?: true
    sop?: true
    template?: true
    projectId?: true
    _all?: true
  }

  export type RASessionAggregateArgs = {
    /**
     * Filter which RASession to aggregate.
     * 
    **/
    where?: RASessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RASessions to fetch.
     * 
    **/
    orderBy?: Enumerable<RASessionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: RASessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RASessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RASessions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RASessions
    **/
    _count?: true | RASessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RASessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RASessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RASessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RASessionMaxAggregateInputType
  }

  export type GetRASessionAggregateType<T extends RASessionAggregateArgs> = {
        [P in keyof T & keyof AggregateRASession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRASession[P]>
      : GetScalarType<T[P], AggregateRASession[P]>
  }




  export type RASessionGroupByArgs = {
    where?: RASessionWhereInput
    orderBy?: Enumerable<RASessionOrderByWithAggregationInput>
    by: Array<RASessionScalarFieldEnum>
    having?: RASessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RASessionCountAggregateInputType | true
    _avg?: RASessionAvgAggregateInputType
    _sum?: RASessionSumAggregateInputType
    _min?: RASessionMinAggregateInputType
    _max?: RASessionMaxAggregateInputType
  }


  export type RASessionGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    name: string
    description: string
    priority: number
    sop: string[]
    template: JsonValue
    projectId: string
    _count: RASessionCountAggregateOutputType | null
    _avg: RASessionAvgAggregateOutputType | null
    _sum: RASessionSumAggregateOutputType | null
    _min: RASessionMinAggregateOutputType | null
    _max: RASessionMaxAggregateOutputType | null
  }

  type GetRASessionGroupByPayload<T extends RASessionGroupByArgs> = PrismaPromise<
    Array<
      PickArray<RASessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RASessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RASessionGroupByOutputType[P]>
            : GetScalarType<T[P], RASessionGroupByOutputType[P]>
        }
      >
    >


  export type RASessionSelect = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    description?: boolean
    priority?: boolean
    sop?: boolean
    template?: boolean
    projectId?: boolean
    Project?: boolean | ProjectArgs
    UsersInRASessions?: boolean | UsersInRASessionsFindManyArgs
    VisitsInRASessions?: boolean | VisitsInRASessionsFindManyArgs
    _count?: boolean | RASessionCountOutputTypeArgs
  }

  export type RASessionInclude = {
    Project?: boolean | ProjectArgs
    UsersInRASessions?: boolean | UsersInRASessionsFindManyArgs
    VisitsInRASessions?: boolean | VisitsInRASessionsFindManyArgs
    _count?: boolean | RASessionCountOutputTypeArgs
  }

  export type RASessionGetPayload<
    S extends boolean | null | undefined | RASessionArgs,
    U = keyof S
      > = S extends true
        ? RASession
    : S extends undefined
    ? never
    : S extends RASessionArgs | RASessionFindManyArgs
    ?'include' extends U
    ? RASession  & {
    [P in TrueKeys<S['include']>]:
        P extends 'Project' ? ProjectGetPayload<Exclude<S['include'], undefined | null>[P]> :
        P extends 'UsersInRASessions' ? Array < UsersInRASessionsGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends 'VisitsInRASessions' ? Array < VisitsInRASessionsGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends '_count' ? RASessionCountOutputTypeGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'Project' ? ProjectGetPayload<Exclude<S['select'], undefined | null>[P]> :
        P extends 'UsersInRASessions' ? Array < UsersInRASessionsGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends 'VisitsInRASessions' ? Array < VisitsInRASessionsGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends '_count' ? RASessionCountOutputTypeGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof RASession ? RASession[P] : never
  } 
    : RASession
  : RASession


  type RASessionCountArgs = Merge<
    Omit<RASessionFindManyArgs, 'select' | 'include'> & {
      select?: RASessionCountAggregateInputType | true
    }
  >

  export interface RASessionDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one RASession that matches the filter.
     * @param {RASessionFindUniqueArgs} args - Arguments to find a RASession
     * @example
     * // Get one RASession
     * const rASession = await prisma.rASession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends RASessionFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, RASessionFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'RASession'> extends True ? CheckSelect<T, Prisma__RASessionClient<RASession>, Prisma__RASessionClient<RASessionGetPayload<T>>> : CheckSelect<T, Prisma__RASessionClient<RASession | null, null>, Prisma__RASessionClient<RASessionGetPayload<T> | null, null>>

    /**
     * Find the first RASession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RASessionFindFirstArgs} args - Arguments to find a RASession
     * @example
     * // Get one RASession
     * const rASession = await prisma.rASession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends RASessionFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, RASessionFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'RASession'> extends True ? CheckSelect<T, Prisma__RASessionClient<RASession>, Prisma__RASessionClient<RASessionGetPayload<T>>> : CheckSelect<T, Prisma__RASessionClient<RASession | null, null>, Prisma__RASessionClient<RASessionGetPayload<T> | null, null>>

    /**
     * Find zero or more RASessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RASessionFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RASessions
     * const rASessions = await prisma.rASession.findMany()
     * 
     * // Get first 10 RASessions
     * const rASessions = await prisma.rASession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rASessionWithIdOnly = await prisma.rASession.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends RASessionFindManyArgs>(
      args?: SelectSubset<T, RASessionFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<RASession>>, PrismaPromise<Array<RASessionGetPayload<T>>>>

    /**
     * Create a RASession.
     * @param {RASessionCreateArgs} args - Arguments to create a RASession.
     * @example
     * // Create one RASession
     * const RASession = await prisma.rASession.create({
     *   data: {
     *     // ... data to create a RASession
     *   }
     * })
     * 
    **/
    create<T extends RASessionCreateArgs>(
      args: SelectSubset<T, RASessionCreateArgs>
    ): CheckSelect<T, Prisma__RASessionClient<RASession>, Prisma__RASessionClient<RASessionGetPayload<T>>>

    /**
     * Create many RASessions.
     *     @param {RASessionCreateManyArgs} args - Arguments to create many RASessions.
     *     @example
     *     // Create many RASessions
     *     const rASession = await prisma.rASession.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends RASessionCreateManyArgs>(
      args?: SelectSubset<T, RASessionCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a RASession.
     * @param {RASessionDeleteArgs} args - Arguments to delete one RASession.
     * @example
     * // Delete one RASession
     * const RASession = await prisma.rASession.delete({
     *   where: {
     *     // ... filter to delete one RASession
     *   }
     * })
     * 
    **/
    delete<T extends RASessionDeleteArgs>(
      args: SelectSubset<T, RASessionDeleteArgs>
    ): CheckSelect<T, Prisma__RASessionClient<RASession>, Prisma__RASessionClient<RASessionGetPayload<T>>>

    /**
     * Update one RASession.
     * @param {RASessionUpdateArgs} args - Arguments to update one RASession.
     * @example
     * // Update one RASession
     * const rASession = await prisma.rASession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends RASessionUpdateArgs>(
      args: SelectSubset<T, RASessionUpdateArgs>
    ): CheckSelect<T, Prisma__RASessionClient<RASession>, Prisma__RASessionClient<RASessionGetPayload<T>>>

    /**
     * Delete zero or more RASessions.
     * @param {RASessionDeleteManyArgs} args - Arguments to filter RASessions to delete.
     * @example
     * // Delete a few RASessions
     * const { count } = await prisma.rASession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends RASessionDeleteManyArgs>(
      args?: SelectSubset<T, RASessionDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more RASessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RASessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RASessions
     * const rASession = await prisma.rASession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends RASessionUpdateManyArgs>(
      args: SelectSubset<T, RASessionUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one RASession.
     * @param {RASessionUpsertArgs} args - Arguments to update or create a RASession.
     * @example
     * // Update or create a RASession
     * const rASession = await prisma.rASession.upsert({
     *   create: {
     *     // ... data to create a RASession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RASession we want to update
     *   }
     * })
    **/
    upsert<T extends RASessionUpsertArgs>(
      args: SelectSubset<T, RASessionUpsertArgs>
    ): CheckSelect<T, Prisma__RASessionClient<RASession>, Prisma__RASessionClient<RASessionGetPayload<T>>>

    /**
     * Find one RASession that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {RASessionFindUniqueOrThrowArgs} args - Arguments to find a RASession
     * @example
     * // Get one RASession
     * const rASession = await prisma.rASession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends RASessionFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, RASessionFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__RASessionClient<RASession>, Prisma__RASessionClient<RASessionGetPayload<T>>>

    /**
     * Find the first RASession that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RASessionFindFirstOrThrowArgs} args - Arguments to find a RASession
     * @example
     * // Get one RASession
     * const rASession = await prisma.rASession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends RASessionFindFirstOrThrowArgs>(
      args?: SelectSubset<T, RASessionFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__RASessionClient<RASession>, Prisma__RASessionClient<RASessionGetPayload<T>>>

    /**
     * Count the number of RASessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RASessionCountArgs} args - Arguments to filter RASessions to count.
     * @example
     * // Count the number of RASessions
     * const count = await prisma.rASession.count({
     *   where: {
     *     // ... the filter for the RASessions we want to count
     *   }
     * })
    **/
    count<T extends RASessionCountArgs>(
      args?: Subset<T, RASessionCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RASessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RASession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RASessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RASessionAggregateArgs>(args: Subset<T, RASessionAggregateArgs>): PrismaPromise<GetRASessionAggregateType<T>>

    /**
     * Group by RASession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RASessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RASessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RASessionGroupByArgs['orderBy'] }
        : { orderBy?: RASessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RASessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRASessionGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for RASession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__RASessionClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    Project<T extends ProjectArgs = {}>(args?: Subset<T, ProjectArgs>): CheckSelect<T, Prisma__ProjectClient<Project | Null>, Prisma__ProjectClient<ProjectGetPayload<T> | Null>>;

    UsersInRASessions<T extends UsersInRASessionsFindManyArgs = {}>(args?: Subset<T, UsersInRASessionsFindManyArgs>): CheckSelect<T, PrismaPromise<Array<UsersInRASessions>| Null>, PrismaPromise<Array<UsersInRASessionsGetPayload<T>>| Null>>;

    VisitsInRASessions<T extends VisitsInRASessionsFindManyArgs = {}>(args?: Subset<T, VisitsInRASessionsFindManyArgs>): CheckSelect<T, PrismaPromise<Array<VisitsInRASessions>| Null>, PrismaPromise<Array<VisitsInRASessionsGetPayload<T>>| Null>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * RASession base type for findUnique actions
   */
  export type RASessionFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the RASession
     * 
    **/
    select?: RASessionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: RASessionInclude | null
    /**
     * Filter, which RASession to fetch.
     * 
    **/
    where: RASessionWhereUniqueInput
  }

  /**
   * RASession: findUnique
   */
  export interface RASessionFindUniqueArgs extends RASessionFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * RASession base type for findFirst actions
   */
  export type RASessionFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the RASession
     * 
    **/
    select?: RASessionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: RASessionInclude | null
    /**
     * Filter, which RASession to fetch.
     * 
    **/
    where?: RASessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RASessions to fetch.
     * 
    **/
    orderBy?: Enumerable<RASessionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RASessions.
     * 
    **/
    cursor?: RASessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RASessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RASessions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RASessions.
     * 
    **/
    distinct?: Enumerable<RASessionScalarFieldEnum>
  }

  /**
   * RASession: findFirst
   */
  export interface RASessionFindFirstArgs extends RASessionFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * RASession findMany
   */
  export type RASessionFindManyArgs = {
    /**
     * Select specific fields to fetch from the RASession
     * 
    **/
    select?: RASessionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: RASessionInclude | null
    /**
     * Filter, which RASessions to fetch.
     * 
    **/
    where?: RASessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RASessions to fetch.
     * 
    **/
    orderBy?: Enumerable<RASessionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RASessions.
     * 
    **/
    cursor?: RASessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RASessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RASessions.
     * 
    **/
    skip?: number
    distinct?: Enumerable<RASessionScalarFieldEnum>
  }


  /**
   * RASession create
   */
  export type RASessionCreateArgs = {
    /**
     * Select specific fields to fetch from the RASession
     * 
    **/
    select?: RASessionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: RASessionInclude | null
    /**
     * The data needed to create a RASession.
     * 
    **/
    data: XOR<RASessionCreateInput, RASessionUncheckedCreateInput>
  }


  /**
   * RASession createMany
   */
  export type RASessionCreateManyArgs = {
    /**
     * The data used to create many RASessions.
     * 
    **/
    data: Enumerable<RASessionCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * RASession update
   */
  export type RASessionUpdateArgs = {
    /**
     * Select specific fields to fetch from the RASession
     * 
    **/
    select?: RASessionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: RASessionInclude | null
    /**
     * The data needed to update a RASession.
     * 
    **/
    data: XOR<RASessionUpdateInput, RASessionUncheckedUpdateInput>
    /**
     * Choose, which RASession to update.
     * 
    **/
    where: RASessionWhereUniqueInput
  }


  /**
   * RASession updateMany
   */
  export type RASessionUpdateManyArgs = {
    /**
     * The data used to update RASessions.
     * 
    **/
    data: XOR<RASessionUpdateManyMutationInput, RASessionUncheckedUpdateManyInput>
    /**
     * Filter which RASessions to update
     * 
    **/
    where?: RASessionWhereInput
  }


  /**
   * RASession upsert
   */
  export type RASessionUpsertArgs = {
    /**
     * Select specific fields to fetch from the RASession
     * 
    **/
    select?: RASessionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: RASessionInclude | null
    /**
     * The filter to search for the RASession to update in case it exists.
     * 
    **/
    where: RASessionWhereUniqueInput
    /**
     * In case the RASession found by the `where` argument doesn't exist, create a new RASession with this data.
     * 
    **/
    create: XOR<RASessionCreateInput, RASessionUncheckedCreateInput>
    /**
     * In case the RASession was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<RASessionUpdateInput, RASessionUncheckedUpdateInput>
  }


  /**
   * RASession delete
   */
  export type RASessionDeleteArgs = {
    /**
     * Select specific fields to fetch from the RASession
     * 
    **/
    select?: RASessionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: RASessionInclude | null
    /**
     * Filter which RASession to delete.
     * 
    **/
    where: RASessionWhereUniqueInput
  }


  /**
   * RASession deleteMany
   */
  export type RASessionDeleteManyArgs = {
    /**
     * Filter which RASessions to delete
     * 
    **/
    where?: RASessionWhereInput
  }


  /**
   * RASession: findUniqueOrThrow
   */
  export type RASessionFindUniqueOrThrowArgs = RASessionFindUniqueArgsBase
      

  /**
   * RASession: findFirstOrThrow
   */
  export type RASessionFindFirstOrThrowArgs = RASessionFindFirstArgsBase
      

  /**
   * RASession without action
   */
  export type RASessionArgs = {
    /**
     * Select specific fields to fetch from the RASession
     * 
    **/
    select?: RASessionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: RASessionInclude | null
  }



  /**
   * Model RawResource
   */


  export type AggregateRawResource = {
    _count: RawResourceCountAggregateOutputType | null
    _min: RawResourceMinAggregateOutputType | null
    _max: RawResourceMaxAggregateOutputType | null
  }

  export type RawResourceMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    machine: string | null
    center: string | null
    visitId: string | null
  }

  export type RawResourceMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    machine: string | null
    center: string | null
    visitId: string | null
  }

  export type RawResourceCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    metadata: number
    machine: number
    center: number
    visitId: number
    _all: number
  }


  export type RawResourceMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    machine?: true
    center?: true
    visitId?: true
  }

  export type RawResourceMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    machine?: true
    center?: true
    visitId?: true
  }

  export type RawResourceCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    metadata?: true
    machine?: true
    center?: true
    visitId?: true
    _all?: true
  }

  export type RawResourceAggregateArgs = {
    /**
     * Filter which RawResource to aggregate.
     * 
    **/
    where?: RawResourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RawResources to fetch.
     * 
    **/
    orderBy?: Enumerable<RawResourceOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: RawResourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RawResources from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RawResources.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RawResources
    **/
    _count?: true | RawResourceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RawResourceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RawResourceMaxAggregateInputType
  }

  export type GetRawResourceAggregateType<T extends RawResourceAggregateArgs> = {
        [P in keyof T & keyof AggregateRawResource]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRawResource[P]>
      : GetScalarType<T[P], AggregateRawResource[P]>
  }




  export type RawResourceGroupByArgs = {
    where?: RawResourceWhereInput
    orderBy?: Enumerable<RawResourceOrderByWithAggregationInput>
    by: Array<RawResourceScalarFieldEnum>
    having?: RawResourceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RawResourceCountAggregateInputType | true
    _min?: RawResourceMinAggregateInputType
    _max?: RawResourceMaxAggregateInputType
  }


  export type RawResourceGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    metadata: JsonValue
    machine: string
    center: string
    visitId: string
    _count: RawResourceCountAggregateOutputType | null
    _min: RawResourceMinAggregateOutputType | null
    _max: RawResourceMaxAggregateOutputType | null
  }

  type GetRawResourceGroupByPayload<T extends RawResourceGroupByArgs> = PrismaPromise<
    Array<
      PickArray<RawResourceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RawResourceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RawResourceGroupByOutputType[P]>
            : GetScalarType<T[P], RawResourceGroupByOutputType[P]>
        }
      >
    >


  export type RawResourceSelect = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    metadata?: boolean
    machine?: boolean
    center?: boolean
    visitId?: boolean
    Visit?: boolean | VisitArgs
    ExtractedResource?: boolean | ExtractedResourceFindManyArgs
    _count?: boolean | RawResourceCountOutputTypeArgs
  }

  export type RawResourceInclude = {
    Visit?: boolean | VisitArgs
    ExtractedResource?: boolean | ExtractedResourceFindManyArgs
    _count?: boolean | RawResourceCountOutputTypeArgs
  }

  export type RawResourceGetPayload<
    S extends boolean | null | undefined | RawResourceArgs,
    U = keyof S
      > = S extends true
        ? RawResource
    : S extends undefined
    ? never
    : S extends RawResourceArgs | RawResourceFindManyArgs
    ?'include' extends U
    ? RawResource  & {
    [P in TrueKeys<S['include']>]:
        P extends 'Visit' ? VisitGetPayload<Exclude<S['include'], undefined | null>[P]> :
        P extends 'ExtractedResource' ? Array < ExtractedResourceGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends '_count' ? RawResourceCountOutputTypeGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'Visit' ? VisitGetPayload<Exclude<S['select'], undefined | null>[P]> :
        P extends 'ExtractedResource' ? Array < ExtractedResourceGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends '_count' ? RawResourceCountOutputTypeGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof RawResource ? RawResource[P] : never
  } 
    : RawResource
  : RawResource


  type RawResourceCountArgs = Merge<
    Omit<RawResourceFindManyArgs, 'select' | 'include'> & {
      select?: RawResourceCountAggregateInputType | true
    }
  >

  export interface RawResourceDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one RawResource that matches the filter.
     * @param {RawResourceFindUniqueArgs} args - Arguments to find a RawResource
     * @example
     * // Get one RawResource
     * const rawResource = await prisma.rawResource.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends RawResourceFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, RawResourceFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'RawResource'> extends True ? CheckSelect<T, Prisma__RawResourceClient<RawResource>, Prisma__RawResourceClient<RawResourceGetPayload<T>>> : CheckSelect<T, Prisma__RawResourceClient<RawResource | null, null>, Prisma__RawResourceClient<RawResourceGetPayload<T> | null, null>>

    /**
     * Find the first RawResource that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RawResourceFindFirstArgs} args - Arguments to find a RawResource
     * @example
     * // Get one RawResource
     * const rawResource = await prisma.rawResource.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends RawResourceFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, RawResourceFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'RawResource'> extends True ? CheckSelect<T, Prisma__RawResourceClient<RawResource>, Prisma__RawResourceClient<RawResourceGetPayload<T>>> : CheckSelect<T, Prisma__RawResourceClient<RawResource | null, null>, Prisma__RawResourceClient<RawResourceGetPayload<T> | null, null>>

    /**
     * Find zero or more RawResources that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RawResourceFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RawResources
     * const rawResources = await prisma.rawResource.findMany()
     * 
     * // Get first 10 RawResources
     * const rawResources = await prisma.rawResource.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rawResourceWithIdOnly = await prisma.rawResource.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends RawResourceFindManyArgs>(
      args?: SelectSubset<T, RawResourceFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<RawResource>>, PrismaPromise<Array<RawResourceGetPayload<T>>>>

    /**
     * Create a RawResource.
     * @param {RawResourceCreateArgs} args - Arguments to create a RawResource.
     * @example
     * // Create one RawResource
     * const RawResource = await prisma.rawResource.create({
     *   data: {
     *     // ... data to create a RawResource
     *   }
     * })
     * 
    **/
    create<T extends RawResourceCreateArgs>(
      args: SelectSubset<T, RawResourceCreateArgs>
    ): CheckSelect<T, Prisma__RawResourceClient<RawResource>, Prisma__RawResourceClient<RawResourceGetPayload<T>>>

    /**
     * Create many RawResources.
     *     @param {RawResourceCreateManyArgs} args - Arguments to create many RawResources.
     *     @example
     *     // Create many RawResources
     *     const rawResource = await prisma.rawResource.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends RawResourceCreateManyArgs>(
      args?: SelectSubset<T, RawResourceCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a RawResource.
     * @param {RawResourceDeleteArgs} args - Arguments to delete one RawResource.
     * @example
     * // Delete one RawResource
     * const RawResource = await prisma.rawResource.delete({
     *   where: {
     *     // ... filter to delete one RawResource
     *   }
     * })
     * 
    **/
    delete<T extends RawResourceDeleteArgs>(
      args: SelectSubset<T, RawResourceDeleteArgs>
    ): CheckSelect<T, Prisma__RawResourceClient<RawResource>, Prisma__RawResourceClient<RawResourceGetPayload<T>>>

    /**
     * Update one RawResource.
     * @param {RawResourceUpdateArgs} args - Arguments to update one RawResource.
     * @example
     * // Update one RawResource
     * const rawResource = await prisma.rawResource.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends RawResourceUpdateArgs>(
      args: SelectSubset<T, RawResourceUpdateArgs>
    ): CheckSelect<T, Prisma__RawResourceClient<RawResource>, Prisma__RawResourceClient<RawResourceGetPayload<T>>>

    /**
     * Delete zero or more RawResources.
     * @param {RawResourceDeleteManyArgs} args - Arguments to filter RawResources to delete.
     * @example
     * // Delete a few RawResources
     * const { count } = await prisma.rawResource.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends RawResourceDeleteManyArgs>(
      args?: SelectSubset<T, RawResourceDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more RawResources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RawResourceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RawResources
     * const rawResource = await prisma.rawResource.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends RawResourceUpdateManyArgs>(
      args: SelectSubset<T, RawResourceUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one RawResource.
     * @param {RawResourceUpsertArgs} args - Arguments to update or create a RawResource.
     * @example
     * // Update or create a RawResource
     * const rawResource = await prisma.rawResource.upsert({
     *   create: {
     *     // ... data to create a RawResource
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RawResource we want to update
     *   }
     * })
    **/
    upsert<T extends RawResourceUpsertArgs>(
      args: SelectSubset<T, RawResourceUpsertArgs>
    ): CheckSelect<T, Prisma__RawResourceClient<RawResource>, Prisma__RawResourceClient<RawResourceGetPayload<T>>>

    /**
     * Find one RawResource that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {RawResourceFindUniqueOrThrowArgs} args - Arguments to find a RawResource
     * @example
     * // Get one RawResource
     * const rawResource = await prisma.rawResource.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends RawResourceFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, RawResourceFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__RawResourceClient<RawResource>, Prisma__RawResourceClient<RawResourceGetPayload<T>>>

    /**
     * Find the first RawResource that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RawResourceFindFirstOrThrowArgs} args - Arguments to find a RawResource
     * @example
     * // Get one RawResource
     * const rawResource = await prisma.rawResource.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends RawResourceFindFirstOrThrowArgs>(
      args?: SelectSubset<T, RawResourceFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__RawResourceClient<RawResource>, Prisma__RawResourceClient<RawResourceGetPayload<T>>>

    /**
     * Count the number of RawResources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RawResourceCountArgs} args - Arguments to filter RawResources to count.
     * @example
     * // Count the number of RawResources
     * const count = await prisma.rawResource.count({
     *   where: {
     *     // ... the filter for the RawResources we want to count
     *   }
     * })
    **/
    count<T extends RawResourceCountArgs>(
      args?: Subset<T, RawResourceCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RawResourceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RawResource.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RawResourceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RawResourceAggregateArgs>(args: Subset<T, RawResourceAggregateArgs>): PrismaPromise<GetRawResourceAggregateType<T>>

    /**
     * Group by RawResource.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RawResourceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RawResourceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RawResourceGroupByArgs['orderBy'] }
        : { orderBy?: RawResourceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RawResourceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRawResourceGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for RawResource.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__RawResourceClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    Visit<T extends VisitArgs = {}>(args?: Subset<T, VisitArgs>): CheckSelect<T, Prisma__VisitClient<Visit | Null>, Prisma__VisitClient<VisitGetPayload<T> | Null>>;

    ExtractedResource<T extends ExtractedResourceFindManyArgs = {}>(args?: Subset<T, ExtractedResourceFindManyArgs>): CheckSelect<T, PrismaPromise<Array<ExtractedResource>| Null>, PrismaPromise<Array<ExtractedResourceGetPayload<T>>| Null>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * RawResource base type for findUnique actions
   */
  export type RawResourceFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the RawResource
     * 
    **/
    select?: RawResourceSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: RawResourceInclude | null
    /**
     * Filter, which RawResource to fetch.
     * 
    **/
    where: RawResourceWhereUniqueInput
  }

  /**
   * RawResource: findUnique
   */
  export interface RawResourceFindUniqueArgs extends RawResourceFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * RawResource base type for findFirst actions
   */
  export type RawResourceFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the RawResource
     * 
    **/
    select?: RawResourceSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: RawResourceInclude | null
    /**
     * Filter, which RawResource to fetch.
     * 
    **/
    where?: RawResourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RawResources to fetch.
     * 
    **/
    orderBy?: Enumerable<RawResourceOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RawResources.
     * 
    **/
    cursor?: RawResourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RawResources from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RawResources.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RawResources.
     * 
    **/
    distinct?: Enumerable<RawResourceScalarFieldEnum>
  }

  /**
   * RawResource: findFirst
   */
  export interface RawResourceFindFirstArgs extends RawResourceFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * RawResource findMany
   */
  export type RawResourceFindManyArgs = {
    /**
     * Select specific fields to fetch from the RawResource
     * 
    **/
    select?: RawResourceSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: RawResourceInclude | null
    /**
     * Filter, which RawResources to fetch.
     * 
    **/
    where?: RawResourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RawResources to fetch.
     * 
    **/
    orderBy?: Enumerable<RawResourceOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RawResources.
     * 
    **/
    cursor?: RawResourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RawResources from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RawResources.
     * 
    **/
    skip?: number
    distinct?: Enumerable<RawResourceScalarFieldEnum>
  }


  /**
   * RawResource create
   */
  export type RawResourceCreateArgs = {
    /**
     * Select specific fields to fetch from the RawResource
     * 
    **/
    select?: RawResourceSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: RawResourceInclude | null
    /**
     * The data needed to create a RawResource.
     * 
    **/
    data: XOR<RawResourceCreateInput, RawResourceUncheckedCreateInput>
  }


  /**
   * RawResource createMany
   */
  export type RawResourceCreateManyArgs = {
    /**
     * The data used to create many RawResources.
     * 
    **/
    data: Enumerable<RawResourceCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * RawResource update
   */
  export type RawResourceUpdateArgs = {
    /**
     * Select specific fields to fetch from the RawResource
     * 
    **/
    select?: RawResourceSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: RawResourceInclude | null
    /**
     * The data needed to update a RawResource.
     * 
    **/
    data: XOR<RawResourceUpdateInput, RawResourceUncheckedUpdateInput>
    /**
     * Choose, which RawResource to update.
     * 
    **/
    where: RawResourceWhereUniqueInput
  }


  /**
   * RawResource updateMany
   */
  export type RawResourceUpdateManyArgs = {
    /**
     * The data used to update RawResources.
     * 
    **/
    data: XOR<RawResourceUpdateManyMutationInput, RawResourceUncheckedUpdateManyInput>
    /**
     * Filter which RawResources to update
     * 
    **/
    where?: RawResourceWhereInput
  }


  /**
   * RawResource upsert
   */
  export type RawResourceUpsertArgs = {
    /**
     * Select specific fields to fetch from the RawResource
     * 
    **/
    select?: RawResourceSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: RawResourceInclude | null
    /**
     * The filter to search for the RawResource to update in case it exists.
     * 
    **/
    where: RawResourceWhereUniqueInput
    /**
     * In case the RawResource found by the `where` argument doesn't exist, create a new RawResource with this data.
     * 
    **/
    create: XOR<RawResourceCreateInput, RawResourceUncheckedCreateInput>
    /**
     * In case the RawResource was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<RawResourceUpdateInput, RawResourceUncheckedUpdateInput>
  }


  /**
   * RawResource delete
   */
  export type RawResourceDeleteArgs = {
    /**
     * Select specific fields to fetch from the RawResource
     * 
    **/
    select?: RawResourceSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: RawResourceInclude | null
    /**
     * Filter which RawResource to delete.
     * 
    **/
    where: RawResourceWhereUniqueInput
  }


  /**
   * RawResource deleteMany
   */
  export type RawResourceDeleteManyArgs = {
    /**
     * Filter which RawResources to delete
     * 
    **/
    where?: RawResourceWhereInput
  }


  /**
   * RawResource: findUniqueOrThrow
   */
  export type RawResourceFindUniqueOrThrowArgs = RawResourceFindUniqueArgsBase
      

  /**
   * RawResource: findFirstOrThrow
   */
  export type RawResourceFindFirstOrThrowArgs = RawResourceFindFirstArgsBase
      

  /**
   * RawResource without action
   */
  export type RawResourceArgs = {
    /**
     * Select specific fields to fetch from the RawResource
     * 
    **/
    select?: RawResourceSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: RawResourceInclude | null
  }



  /**
   * Model UsersInCESessions
   */


  export type AggregateUsersInCESessions = {
    _count: UsersInCESessionsCountAggregateOutputType | null
    _min: UsersInCESessionsMinAggregateOutputType | null
    _max: UsersInCESessionsMaxAggregateOutputType | null
  }

  export type UsersInCESessionsMinAggregateOutputType = {
    userId: string | null
    cESessionId: string | null
    userRole: SessionUserRole | null
  }

  export type UsersInCESessionsMaxAggregateOutputType = {
    userId: string | null
    cESessionId: string | null
    userRole: SessionUserRole | null
  }

  export type UsersInCESessionsCountAggregateOutputType = {
    userId: number
    cESessionId: number
    userRole: number
    _all: number
  }


  export type UsersInCESessionsMinAggregateInputType = {
    userId?: true
    cESessionId?: true
    userRole?: true
  }

  export type UsersInCESessionsMaxAggregateInputType = {
    userId?: true
    cESessionId?: true
    userRole?: true
  }

  export type UsersInCESessionsCountAggregateInputType = {
    userId?: true
    cESessionId?: true
    userRole?: true
    _all?: true
  }

  export type UsersInCESessionsAggregateArgs = {
    /**
     * Filter which UsersInCESessions to aggregate.
     * 
    **/
    where?: UsersInCESessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsersInCESessions to fetch.
     * 
    **/
    orderBy?: Enumerable<UsersInCESessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: UsersInCESessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsersInCESessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsersInCESessions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UsersInCESessions
    **/
    _count?: true | UsersInCESessionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsersInCESessionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsersInCESessionsMaxAggregateInputType
  }

  export type GetUsersInCESessionsAggregateType<T extends UsersInCESessionsAggregateArgs> = {
        [P in keyof T & keyof AggregateUsersInCESessions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsersInCESessions[P]>
      : GetScalarType<T[P], AggregateUsersInCESessions[P]>
  }




  export type UsersInCESessionsGroupByArgs = {
    where?: UsersInCESessionsWhereInput
    orderBy?: Enumerable<UsersInCESessionsOrderByWithAggregationInput>
    by: Array<UsersInCESessionsScalarFieldEnum>
    having?: UsersInCESessionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsersInCESessionsCountAggregateInputType | true
    _min?: UsersInCESessionsMinAggregateInputType
    _max?: UsersInCESessionsMaxAggregateInputType
  }


  export type UsersInCESessionsGroupByOutputType = {
    userId: string
    cESessionId: string
    userRole: SessionUserRole
    _count: UsersInCESessionsCountAggregateOutputType | null
    _min: UsersInCESessionsMinAggregateOutputType | null
    _max: UsersInCESessionsMaxAggregateOutputType | null
  }

  type GetUsersInCESessionsGroupByPayload<T extends UsersInCESessionsGroupByArgs> = PrismaPromise<
    Array<
      PickArray<UsersInCESessionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsersInCESessionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsersInCESessionsGroupByOutputType[P]>
            : GetScalarType<T[P], UsersInCESessionsGroupByOutputType[P]>
        }
      >
    >


  export type UsersInCESessionsSelect = {
    userId?: boolean
    cESessionId?: boolean
    userRole?: boolean
    CESession?: boolean | CESessionArgs
  }

  export type UsersInCESessionsInclude = {
    CESession?: boolean | CESessionArgs
  }

  export type UsersInCESessionsGetPayload<
    S extends boolean | null | undefined | UsersInCESessionsArgs,
    U = keyof S
      > = S extends true
        ? UsersInCESessions
    : S extends undefined
    ? never
    : S extends UsersInCESessionsArgs | UsersInCESessionsFindManyArgs
    ?'include' extends U
    ? UsersInCESessions  & {
    [P in TrueKeys<S['include']>]:
        P extends 'CESession' ? CESessionGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'CESession' ? CESessionGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof UsersInCESessions ? UsersInCESessions[P] : never
  } 
    : UsersInCESessions
  : UsersInCESessions


  type UsersInCESessionsCountArgs = Merge<
    Omit<UsersInCESessionsFindManyArgs, 'select' | 'include'> & {
      select?: UsersInCESessionsCountAggregateInputType | true
    }
  >

  export interface UsersInCESessionsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one UsersInCESessions that matches the filter.
     * @param {UsersInCESessionsFindUniqueArgs} args - Arguments to find a UsersInCESessions
     * @example
     * // Get one UsersInCESessions
     * const usersInCESessions = await prisma.usersInCESessions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends UsersInCESessionsFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, UsersInCESessionsFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'UsersInCESessions'> extends True ? CheckSelect<T, Prisma__UsersInCESessionsClient<UsersInCESessions>, Prisma__UsersInCESessionsClient<UsersInCESessionsGetPayload<T>>> : CheckSelect<T, Prisma__UsersInCESessionsClient<UsersInCESessions | null, null>, Prisma__UsersInCESessionsClient<UsersInCESessionsGetPayload<T> | null, null>>

    /**
     * Find the first UsersInCESessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersInCESessionsFindFirstArgs} args - Arguments to find a UsersInCESessions
     * @example
     * // Get one UsersInCESessions
     * const usersInCESessions = await prisma.usersInCESessions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends UsersInCESessionsFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, UsersInCESessionsFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'UsersInCESessions'> extends True ? CheckSelect<T, Prisma__UsersInCESessionsClient<UsersInCESessions>, Prisma__UsersInCESessionsClient<UsersInCESessionsGetPayload<T>>> : CheckSelect<T, Prisma__UsersInCESessionsClient<UsersInCESessions | null, null>, Prisma__UsersInCESessionsClient<UsersInCESessionsGetPayload<T> | null, null>>

    /**
     * Find zero or more UsersInCESessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersInCESessionsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UsersInCESessions
     * const usersInCESessions = await prisma.usersInCESessions.findMany()
     * 
     * // Get first 10 UsersInCESessions
     * const usersInCESessions = await prisma.usersInCESessions.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const usersInCESessionsWithUserIdOnly = await prisma.usersInCESessions.findMany({ select: { userId: true } })
     * 
    **/
    findMany<T extends UsersInCESessionsFindManyArgs>(
      args?: SelectSubset<T, UsersInCESessionsFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<UsersInCESessions>>, PrismaPromise<Array<UsersInCESessionsGetPayload<T>>>>

    /**
     * Create a UsersInCESessions.
     * @param {UsersInCESessionsCreateArgs} args - Arguments to create a UsersInCESessions.
     * @example
     * // Create one UsersInCESessions
     * const UsersInCESessions = await prisma.usersInCESessions.create({
     *   data: {
     *     // ... data to create a UsersInCESessions
     *   }
     * })
     * 
    **/
    create<T extends UsersInCESessionsCreateArgs>(
      args: SelectSubset<T, UsersInCESessionsCreateArgs>
    ): CheckSelect<T, Prisma__UsersInCESessionsClient<UsersInCESessions>, Prisma__UsersInCESessionsClient<UsersInCESessionsGetPayload<T>>>

    /**
     * Create many UsersInCESessions.
     *     @param {UsersInCESessionsCreateManyArgs} args - Arguments to create many UsersInCESessions.
     *     @example
     *     // Create many UsersInCESessions
     *     const usersInCESessions = await prisma.usersInCESessions.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends UsersInCESessionsCreateManyArgs>(
      args?: SelectSubset<T, UsersInCESessionsCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a UsersInCESessions.
     * @param {UsersInCESessionsDeleteArgs} args - Arguments to delete one UsersInCESessions.
     * @example
     * // Delete one UsersInCESessions
     * const UsersInCESessions = await prisma.usersInCESessions.delete({
     *   where: {
     *     // ... filter to delete one UsersInCESessions
     *   }
     * })
     * 
    **/
    delete<T extends UsersInCESessionsDeleteArgs>(
      args: SelectSubset<T, UsersInCESessionsDeleteArgs>
    ): CheckSelect<T, Prisma__UsersInCESessionsClient<UsersInCESessions>, Prisma__UsersInCESessionsClient<UsersInCESessionsGetPayload<T>>>

    /**
     * Update one UsersInCESessions.
     * @param {UsersInCESessionsUpdateArgs} args - Arguments to update one UsersInCESessions.
     * @example
     * // Update one UsersInCESessions
     * const usersInCESessions = await prisma.usersInCESessions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends UsersInCESessionsUpdateArgs>(
      args: SelectSubset<T, UsersInCESessionsUpdateArgs>
    ): CheckSelect<T, Prisma__UsersInCESessionsClient<UsersInCESessions>, Prisma__UsersInCESessionsClient<UsersInCESessionsGetPayload<T>>>

    /**
     * Delete zero or more UsersInCESessions.
     * @param {UsersInCESessionsDeleteManyArgs} args - Arguments to filter UsersInCESessions to delete.
     * @example
     * // Delete a few UsersInCESessions
     * const { count } = await prisma.usersInCESessions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends UsersInCESessionsDeleteManyArgs>(
      args?: SelectSubset<T, UsersInCESessionsDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more UsersInCESessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersInCESessionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UsersInCESessions
     * const usersInCESessions = await prisma.usersInCESessions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends UsersInCESessionsUpdateManyArgs>(
      args: SelectSubset<T, UsersInCESessionsUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one UsersInCESessions.
     * @param {UsersInCESessionsUpsertArgs} args - Arguments to update or create a UsersInCESessions.
     * @example
     * // Update or create a UsersInCESessions
     * const usersInCESessions = await prisma.usersInCESessions.upsert({
     *   create: {
     *     // ... data to create a UsersInCESessions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UsersInCESessions we want to update
     *   }
     * })
    **/
    upsert<T extends UsersInCESessionsUpsertArgs>(
      args: SelectSubset<T, UsersInCESessionsUpsertArgs>
    ): CheckSelect<T, Prisma__UsersInCESessionsClient<UsersInCESessions>, Prisma__UsersInCESessionsClient<UsersInCESessionsGetPayload<T>>>

    /**
     * Find one UsersInCESessions that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {UsersInCESessionsFindUniqueOrThrowArgs} args - Arguments to find a UsersInCESessions
     * @example
     * // Get one UsersInCESessions
     * const usersInCESessions = await prisma.usersInCESessions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends UsersInCESessionsFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, UsersInCESessionsFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__UsersInCESessionsClient<UsersInCESessions>, Prisma__UsersInCESessionsClient<UsersInCESessionsGetPayload<T>>>

    /**
     * Find the first UsersInCESessions that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersInCESessionsFindFirstOrThrowArgs} args - Arguments to find a UsersInCESessions
     * @example
     * // Get one UsersInCESessions
     * const usersInCESessions = await prisma.usersInCESessions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends UsersInCESessionsFindFirstOrThrowArgs>(
      args?: SelectSubset<T, UsersInCESessionsFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__UsersInCESessionsClient<UsersInCESessions>, Prisma__UsersInCESessionsClient<UsersInCESessionsGetPayload<T>>>

    /**
     * Count the number of UsersInCESessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersInCESessionsCountArgs} args - Arguments to filter UsersInCESessions to count.
     * @example
     * // Count the number of UsersInCESessions
     * const count = await prisma.usersInCESessions.count({
     *   where: {
     *     // ... the filter for the UsersInCESessions we want to count
     *   }
     * })
    **/
    count<T extends UsersInCESessionsCountArgs>(
      args?: Subset<T, UsersInCESessionsCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsersInCESessionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UsersInCESessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersInCESessionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsersInCESessionsAggregateArgs>(args: Subset<T, UsersInCESessionsAggregateArgs>): PrismaPromise<GetUsersInCESessionsAggregateType<T>>

    /**
     * Group by UsersInCESessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersInCESessionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UsersInCESessionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsersInCESessionsGroupByArgs['orderBy'] }
        : { orderBy?: UsersInCESessionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UsersInCESessionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsersInCESessionsGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for UsersInCESessions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__UsersInCESessionsClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    CESession<T extends CESessionArgs = {}>(args?: Subset<T, CESessionArgs>): CheckSelect<T, Prisma__CESessionClient<CESession | Null>, Prisma__CESessionClient<CESessionGetPayload<T> | Null>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * UsersInCESessions base type for findUnique actions
   */
  export type UsersInCESessionsFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the UsersInCESessions
     * 
    **/
    select?: UsersInCESessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInCESessionsInclude | null
    /**
     * Filter, which UsersInCESessions to fetch.
     * 
    **/
    where: UsersInCESessionsWhereUniqueInput
  }

  /**
   * UsersInCESessions: findUnique
   */
  export interface UsersInCESessionsFindUniqueArgs extends UsersInCESessionsFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * UsersInCESessions base type for findFirst actions
   */
  export type UsersInCESessionsFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the UsersInCESessions
     * 
    **/
    select?: UsersInCESessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInCESessionsInclude | null
    /**
     * Filter, which UsersInCESessions to fetch.
     * 
    **/
    where?: UsersInCESessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsersInCESessions to fetch.
     * 
    **/
    orderBy?: Enumerable<UsersInCESessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UsersInCESessions.
     * 
    **/
    cursor?: UsersInCESessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsersInCESessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsersInCESessions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UsersInCESessions.
     * 
    **/
    distinct?: Enumerable<UsersInCESessionsScalarFieldEnum>
  }

  /**
   * UsersInCESessions: findFirst
   */
  export interface UsersInCESessionsFindFirstArgs extends UsersInCESessionsFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * UsersInCESessions findMany
   */
  export type UsersInCESessionsFindManyArgs = {
    /**
     * Select specific fields to fetch from the UsersInCESessions
     * 
    **/
    select?: UsersInCESessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInCESessionsInclude | null
    /**
     * Filter, which UsersInCESessions to fetch.
     * 
    **/
    where?: UsersInCESessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsersInCESessions to fetch.
     * 
    **/
    orderBy?: Enumerable<UsersInCESessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UsersInCESessions.
     * 
    **/
    cursor?: UsersInCESessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsersInCESessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsersInCESessions.
     * 
    **/
    skip?: number
    distinct?: Enumerable<UsersInCESessionsScalarFieldEnum>
  }


  /**
   * UsersInCESessions create
   */
  export type UsersInCESessionsCreateArgs = {
    /**
     * Select specific fields to fetch from the UsersInCESessions
     * 
    **/
    select?: UsersInCESessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInCESessionsInclude | null
    /**
     * The data needed to create a UsersInCESessions.
     * 
    **/
    data: XOR<UsersInCESessionsCreateInput, UsersInCESessionsUncheckedCreateInput>
  }


  /**
   * UsersInCESessions createMany
   */
  export type UsersInCESessionsCreateManyArgs = {
    /**
     * The data used to create many UsersInCESessions.
     * 
    **/
    data: Enumerable<UsersInCESessionsCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * UsersInCESessions update
   */
  export type UsersInCESessionsUpdateArgs = {
    /**
     * Select specific fields to fetch from the UsersInCESessions
     * 
    **/
    select?: UsersInCESessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInCESessionsInclude | null
    /**
     * The data needed to update a UsersInCESessions.
     * 
    **/
    data: XOR<UsersInCESessionsUpdateInput, UsersInCESessionsUncheckedUpdateInput>
    /**
     * Choose, which UsersInCESessions to update.
     * 
    **/
    where: UsersInCESessionsWhereUniqueInput
  }


  /**
   * UsersInCESessions updateMany
   */
  export type UsersInCESessionsUpdateManyArgs = {
    /**
     * The data used to update UsersInCESessions.
     * 
    **/
    data: XOR<UsersInCESessionsUpdateManyMutationInput, UsersInCESessionsUncheckedUpdateManyInput>
    /**
     * Filter which UsersInCESessions to update
     * 
    **/
    where?: UsersInCESessionsWhereInput
  }


  /**
   * UsersInCESessions upsert
   */
  export type UsersInCESessionsUpsertArgs = {
    /**
     * Select specific fields to fetch from the UsersInCESessions
     * 
    **/
    select?: UsersInCESessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInCESessionsInclude | null
    /**
     * The filter to search for the UsersInCESessions to update in case it exists.
     * 
    **/
    where: UsersInCESessionsWhereUniqueInput
    /**
     * In case the UsersInCESessions found by the `where` argument doesn't exist, create a new UsersInCESessions with this data.
     * 
    **/
    create: XOR<UsersInCESessionsCreateInput, UsersInCESessionsUncheckedCreateInput>
    /**
     * In case the UsersInCESessions was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<UsersInCESessionsUpdateInput, UsersInCESessionsUncheckedUpdateInput>
  }


  /**
   * UsersInCESessions delete
   */
  export type UsersInCESessionsDeleteArgs = {
    /**
     * Select specific fields to fetch from the UsersInCESessions
     * 
    **/
    select?: UsersInCESessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInCESessionsInclude | null
    /**
     * Filter which UsersInCESessions to delete.
     * 
    **/
    where: UsersInCESessionsWhereUniqueInput
  }


  /**
   * UsersInCESessions deleteMany
   */
  export type UsersInCESessionsDeleteManyArgs = {
    /**
     * Filter which UsersInCESessions to delete
     * 
    **/
    where?: UsersInCESessionsWhereInput
  }


  /**
   * UsersInCESessions: findUniqueOrThrow
   */
  export type UsersInCESessionsFindUniqueOrThrowArgs = UsersInCESessionsFindUniqueArgsBase
      

  /**
   * UsersInCESessions: findFirstOrThrow
   */
  export type UsersInCESessionsFindFirstOrThrowArgs = UsersInCESessionsFindFirstArgsBase
      

  /**
   * UsersInCESessions without action
   */
  export type UsersInCESessionsArgs = {
    /**
     * Select specific fields to fetch from the UsersInCESessions
     * 
    **/
    select?: UsersInCESessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInCESessionsInclude | null
  }



  /**
   * Model UsersInDLSessions
   */


  export type AggregateUsersInDLSessions = {
    _count: UsersInDLSessionsCountAggregateOutputType | null
    _min: UsersInDLSessionsMinAggregateOutputType | null
    _max: UsersInDLSessionsMaxAggregateOutputType | null
  }

  export type UsersInDLSessionsMinAggregateOutputType = {
    userId: string | null
    dLSessionId: string | null
    userRole: SessionUserRole | null
  }

  export type UsersInDLSessionsMaxAggregateOutputType = {
    userId: string | null
    dLSessionId: string | null
    userRole: SessionUserRole | null
  }

  export type UsersInDLSessionsCountAggregateOutputType = {
    userId: number
    dLSessionId: number
    userRole: number
    _all: number
  }


  export type UsersInDLSessionsMinAggregateInputType = {
    userId?: true
    dLSessionId?: true
    userRole?: true
  }

  export type UsersInDLSessionsMaxAggregateInputType = {
    userId?: true
    dLSessionId?: true
    userRole?: true
  }

  export type UsersInDLSessionsCountAggregateInputType = {
    userId?: true
    dLSessionId?: true
    userRole?: true
    _all?: true
  }

  export type UsersInDLSessionsAggregateArgs = {
    /**
     * Filter which UsersInDLSessions to aggregate.
     * 
    **/
    where?: UsersInDLSessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsersInDLSessions to fetch.
     * 
    **/
    orderBy?: Enumerable<UsersInDLSessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: UsersInDLSessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsersInDLSessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsersInDLSessions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UsersInDLSessions
    **/
    _count?: true | UsersInDLSessionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsersInDLSessionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsersInDLSessionsMaxAggregateInputType
  }

  export type GetUsersInDLSessionsAggregateType<T extends UsersInDLSessionsAggregateArgs> = {
        [P in keyof T & keyof AggregateUsersInDLSessions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsersInDLSessions[P]>
      : GetScalarType<T[P], AggregateUsersInDLSessions[P]>
  }




  export type UsersInDLSessionsGroupByArgs = {
    where?: UsersInDLSessionsWhereInput
    orderBy?: Enumerable<UsersInDLSessionsOrderByWithAggregationInput>
    by: Array<UsersInDLSessionsScalarFieldEnum>
    having?: UsersInDLSessionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsersInDLSessionsCountAggregateInputType | true
    _min?: UsersInDLSessionsMinAggregateInputType
    _max?: UsersInDLSessionsMaxAggregateInputType
  }


  export type UsersInDLSessionsGroupByOutputType = {
    userId: string
    dLSessionId: string
    userRole: SessionUserRole
    _count: UsersInDLSessionsCountAggregateOutputType | null
    _min: UsersInDLSessionsMinAggregateOutputType | null
    _max: UsersInDLSessionsMaxAggregateOutputType | null
  }

  type GetUsersInDLSessionsGroupByPayload<T extends UsersInDLSessionsGroupByArgs> = PrismaPromise<
    Array<
      PickArray<UsersInDLSessionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsersInDLSessionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsersInDLSessionsGroupByOutputType[P]>
            : GetScalarType<T[P], UsersInDLSessionsGroupByOutputType[P]>
        }
      >
    >


  export type UsersInDLSessionsSelect = {
    userId?: boolean
    dLSessionId?: boolean
    userRole?: boolean
    DLSession?: boolean | DLSessionArgs
  }

  export type UsersInDLSessionsInclude = {
    DLSession?: boolean | DLSessionArgs
  }

  export type UsersInDLSessionsGetPayload<
    S extends boolean | null | undefined | UsersInDLSessionsArgs,
    U = keyof S
      > = S extends true
        ? UsersInDLSessions
    : S extends undefined
    ? never
    : S extends UsersInDLSessionsArgs | UsersInDLSessionsFindManyArgs
    ?'include' extends U
    ? UsersInDLSessions  & {
    [P in TrueKeys<S['include']>]:
        P extends 'DLSession' ? DLSessionGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'DLSession' ? DLSessionGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof UsersInDLSessions ? UsersInDLSessions[P] : never
  } 
    : UsersInDLSessions
  : UsersInDLSessions


  type UsersInDLSessionsCountArgs = Merge<
    Omit<UsersInDLSessionsFindManyArgs, 'select' | 'include'> & {
      select?: UsersInDLSessionsCountAggregateInputType | true
    }
  >

  export interface UsersInDLSessionsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one UsersInDLSessions that matches the filter.
     * @param {UsersInDLSessionsFindUniqueArgs} args - Arguments to find a UsersInDLSessions
     * @example
     * // Get one UsersInDLSessions
     * const usersInDLSessions = await prisma.usersInDLSessions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends UsersInDLSessionsFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, UsersInDLSessionsFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'UsersInDLSessions'> extends True ? CheckSelect<T, Prisma__UsersInDLSessionsClient<UsersInDLSessions>, Prisma__UsersInDLSessionsClient<UsersInDLSessionsGetPayload<T>>> : CheckSelect<T, Prisma__UsersInDLSessionsClient<UsersInDLSessions | null, null>, Prisma__UsersInDLSessionsClient<UsersInDLSessionsGetPayload<T> | null, null>>

    /**
     * Find the first UsersInDLSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersInDLSessionsFindFirstArgs} args - Arguments to find a UsersInDLSessions
     * @example
     * // Get one UsersInDLSessions
     * const usersInDLSessions = await prisma.usersInDLSessions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends UsersInDLSessionsFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, UsersInDLSessionsFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'UsersInDLSessions'> extends True ? CheckSelect<T, Prisma__UsersInDLSessionsClient<UsersInDLSessions>, Prisma__UsersInDLSessionsClient<UsersInDLSessionsGetPayload<T>>> : CheckSelect<T, Prisma__UsersInDLSessionsClient<UsersInDLSessions | null, null>, Prisma__UsersInDLSessionsClient<UsersInDLSessionsGetPayload<T> | null, null>>

    /**
     * Find zero or more UsersInDLSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersInDLSessionsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UsersInDLSessions
     * const usersInDLSessions = await prisma.usersInDLSessions.findMany()
     * 
     * // Get first 10 UsersInDLSessions
     * const usersInDLSessions = await prisma.usersInDLSessions.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const usersInDLSessionsWithUserIdOnly = await prisma.usersInDLSessions.findMany({ select: { userId: true } })
     * 
    **/
    findMany<T extends UsersInDLSessionsFindManyArgs>(
      args?: SelectSubset<T, UsersInDLSessionsFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<UsersInDLSessions>>, PrismaPromise<Array<UsersInDLSessionsGetPayload<T>>>>

    /**
     * Create a UsersInDLSessions.
     * @param {UsersInDLSessionsCreateArgs} args - Arguments to create a UsersInDLSessions.
     * @example
     * // Create one UsersInDLSessions
     * const UsersInDLSessions = await prisma.usersInDLSessions.create({
     *   data: {
     *     // ... data to create a UsersInDLSessions
     *   }
     * })
     * 
    **/
    create<T extends UsersInDLSessionsCreateArgs>(
      args: SelectSubset<T, UsersInDLSessionsCreateArgs>
    ): CheckSelect<T, Prisma__UsersInDLSessionsClient<UsersInDLSessions>, Prisma__UsersInDLSessionsClient<UsersInDLSessionsGetPayload<T>>>

    /**
     * Create many UsersInDLSessions.
     *     @param {UsersInDLSessionsCreateManyArgs} args - Arguments to create many UsersInDLSessions.
     *     @example
     *     // Create many UsersInDLSessions
     *     const usersInDLSessions = await prisma.usersInDLSessions.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends UsersInDLSessionsCreateManyArgs>(
      args?: SelectSubset<T, UsersInDLSessionsCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a UsersInDLSessions.
     * @param {UsersInDLSessionsDeleteArgs} args - Arguments to delete one UsersInDLSessions.
     * @example
     * // Delete one UsersInDLSessions
     * const UsersInDLSessions = await prisma.usersInDLSessions.delete({
     *   where: {
     *     // ... filter to delete one UsersInDLSessions
     *   }
     * })
     * 
    **/
    delete<T extends UsersInDLSessionsDeleteArgs>(
      args: SelectSubset<T, UsersInDLSessionsDeleteArgs>
    ): CheckSelect<T, Prisma__UsersInDLSessionsClient<UsersInDLSessions>, Prisma__UsersInDLSessionsClient<UsersInDLSessionsGetPayload<T>>>

    /**
     * Update one UsersInDLSessions.
     * @param {UsersInDLSessionsUpdateArgs} args - Arguments to update one UsersInDLSessions.
     * @example
     * // Update one UsersInDLSessions
     * const usersInDLSessions = await prisma.usersInDLSessions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends UsersInDLSessionsUpdateArgs>(
      args: SelectSubset<T, UsersInDLSessionsUpdateArgs>
    ): CheckSelect<T, Prisma__UsersInDLSessionsClient<UsersInDLSessions>, Prisma__UsersInDLSessionsClient<UsersInDLSessionsGetPayload<T>>>

    /**
     * Delete zero or more UsersInDLSessions.
     * @param {UsersInDLSessionsDeleteManyArgs} args - Arguments to filter UsersInDLSessions to delete.
     * @example
     * // Delete a few UsersInDLSessions
     * const { count } = await prisma.usersInDLSessions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends UsersInDLSessionsDeleteManyArgs>(
      args?: SelectSubset<T, UsersInDLSessionsDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more UsersInDLSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersInDLSessionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UsersInDLSessions
     * const usersInDLSessions = await prisma.usersInDLSessions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends UsersInDLSessionsUpdateManyArgs>(
      args: SelectSubset<T, UsersInDLSessionsUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one UsersInDLSessions.
     * @param {UsersInDLSessionsUpsertArgs} args - Arguments to update or create a UsersInDLSessions.
     * @example
     * // Update or create a UsersInDLSessions
     * const usersInDLSessions = await prisma.usersInDLSessions.upsert({
     *   create: {
     *     // ... data to create a UsersInDLSessions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UsersInDLSessions we want to update
     *   }
     * })
    **/
    upsert<T extends UsersInDLSessionsUpsertArgs>(
      args: SelectSubset<T, UsersInDLSessionsUpsertArgs>
    ): CheckSelect<T, Prisma__UsersInDLSessionsClient<UsersInDLSessions>, Prisma__UsersInDLSessionsClient<UsersInDLSessionsGetPayload<T>>>

    /**
     * Find one UsersInDLSessions that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {UsersInDLSessionsFindUniqueOrThrowArgs} args - Arguments to find a UsersInDLSessions
     * @example
     * // Get one UsersInDLSessions
     * const usersInDLSessions = await prisma.usersInDLSessions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends UsersInDLSessionsFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, UsersInDLSessionsFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__UsersInDLSessionsClient<UsersInDLSessions>, Prisma__UsersInDLSessionsClient<UsersInDLSessionsGetPayload<T>>>

    /**
     * Find the first UsersInDLSessions that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersInDLSessionsFindFirstOrThrowArgs} args - Arguments to find a UsersInDLSessions
     * @example
     * // Get one UsersInDLSessions
     * const usersInDLSessions = await prisma.usersInDLSessions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends UsersInDLSessionsFindFirstOrThrowArgs>(
      args?: SelectSubset<T, UsersInDLSessionsFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__UsersInDLSessionsClient<UsersInDLSessions>, Prisma__UsersInDLSessionsClient<UsersInDLSessionsGetPayload<T>>>

    /**
     * Count the number of UsersInDLSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersInDLSessionsCountArgs} args - Arguments to filter UsersInDLSessions to count.
     * @example
     * // Count the number of UsersInDLSessions
     * const count = await prisma.usersInDLSessions.count({
     *   where: {
     *     // ... the filter for the UsersInDLSessions we want to count
     *   }
     * })
    **/
    count<T extends UsersInDLSessionsCountArgs>(
      args?: Subset<T, UsersInDLSessionsCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsersInDLSessionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UsersInDLSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersInDLSessionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsersInDLSessionsAggregateArgs>(args: Subset<T, UsersInDLSessionsAggregateArgs>): PrismaPromise<GetUsersInDLSessionsAggregateType<T>>

    /**
     * Group by UsersInDLSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersInDLSessionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UsersInDLSessionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsersInDLSessionsGroupByArgs['orderBy'] }
        : { orderBy?: UsersInDLSessionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UsersInDLSessionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsersInDLSessionsGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for UsersInDLSessions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__UsersInDLSessionsClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    DLSession<T extends DLSessionArgs = {}>(args?: Subset<T, DLSessionArgs>): CheckSelect<T, Prisma__DLSessionClient<DLSession | Null>, Prisma__DLSessionClient<DLSessionGetPayload<T> | Null>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * UsersInDLSessions base type for findUnique actions
   */
  export type UsersInDLSessionsFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the UsersInDLSessions
     * 
    **/
    select?: UsersInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInDLSessionsInclude | null
    /**
     * Filter, which UsersInDLSessions to fetch.
     * 
    **/
    where: UsersInDLSessionsWhereUniqueInput
  }

  /**
   * UsersInDLSessions: findUnique
   */
  export interface UsersInDLSessionsFindUniqueArgs extends UsersInDLSessionsFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * UsersInDLSessions base type for findFirst actions
   */
  export type UsersInDLSessionsFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the UsersInDLSessions
     * 
    **/
    select?: UsersInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInDLSessionsInclude | null
    /**
     * Filter, which UsersInDLSessions to fetch.
     * 
    **/
    where?: UsersInDLSessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsersInDLSessions to fetch.
     * 
    **/
    orderBy?: Enumerable<UsersInDLSessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UsersInDLSessions.
     * 
    **/
    cursor?: UsersInDLSessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsersInDLSessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsersInDLSessions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UsersInDLSessions.
     * 
    **/
    distinct?: Enumerable<UsersInDLSessionsScalarFieldEnum>
  }

  /**
   * UsersInDLSessions: findFirst
   */
  export interface UsersInDLSessionsFindFirstArgs extends UsersInDLSessionsFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * UsersInDLSessions findMany
   */
  export type UsersInDLSessionsFindManyArgs = {
    /**
     * Select specific fields to fetch from the UsersInDLSessions
     * 
    **/
    select?: UsersInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInDLSessionsInclude | null
    /**
     * Filter, which UsersInDLSessions to fetch.
     * 
    **/
    where?: UsersInDLSessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsersInDLSessions to fetch.
     * 
    **/
    orderBy?: Enumerable<UsersInDLSessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UsersInDLSessions.
     * 
    **/
    cursor?: UsersInDLSessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsersInDLSessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsersInDLSessions.
     * 
    **/
    skip?: number
    distinct?: Enumerable<UsersInDLSessionsScalarFieldEnum>
  }


  /**
   * UsersInDLSessions create
   */
  export type UsersInDLSessionsCreateArgs = {
    /**
     * Select specific fields to fetch from the UsersInDLSessions
     * 
    **/
    select?: UsersInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInDLSessionsInclude | null
    /**
     * The data needed to create a UsersInDLSessions.
     * 
    **/
    data: XOR<UsersInDLSessionsCreateInput, UsersInDLSessionsUncheckedCreateInput>
  }


  /**
   * UsersInDLSessions createMany
   */
  export type UsersInDLSessionsCreateManyArgs = {
    /**
     * The data used to create many UsersInDLSessions.
     * 
    **/
    data: Enumerable<UsersInDLSessionsCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * UsersInDLSessions update
   */
  export type UsersInDLSessionsUpdateArgs = {
    /**
     * Select specific fields to fetch from the UsersInDLSessions
     * 
    **/
    select?: UsersInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInDLSessionsInclude | null
    /**
     * The data needed to update a UsersInDLSessions.
     * 
    **/
    data: XOR<UsersInDLSessionsUpdateInput, UsersInDLSessionsUncheckedUpdateInput>
    /**
     * Choose, which UsersInDLSessions to update.
     * 
    **/
    where: UsersInDLSessionsWhereUniqueInput
  }


  /**
   * UsersInDLSessions updateMany
   */
  export type UsersInDLSessionsUpdateManyArgs = {
    /**
     * The data used to update UsersInDLSessions.
     * 
    **/
    data: XOR<UsersInDLSessionsUpdateManyMutationInput, UsersInDLSessionsUncheckedUpdateManyInput>
    /**
     * Filter which UsersInDLSessions to update
     * 
    **/
    where?: UsersInDLSessionsWhereInput
  }


  /**
   * UsersInDLSessions upsert
   */
  export type UsersInDLSessionsUpsertArgs = {
    /**
     * Select specific fields to fetch from the UsersInDLSessions
     * 
    **/
    select?: UsersInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInDLSessionsInclude | null
    /**
     * The filter to search for the UsersInDLSessions to update in case it exists.
     * 
    **/
    where: UsersInDLSessionsWhereUniqueInput
    /**
     * In case the UsersInDLSessions found by the `where` argument doesn't exist, create a new UsersInDLSessions with this data.
     * 
    **/
    create: XOR<UsersInDLSessionsCreateInput, UsersInDLSessionsUncheckedCreateInput>
    /**
     * In case the UsersInDLSessions was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<UsersInDLSessionsUpdateInput, UsersInDLSessionsUncheckedUpdateInput>
  }


  /**
   * UsersInDLSessions delete
   */
  export type UsersInDLSessionsDeleteArgs = {
    /**
     * Select specific fields to fetch from the UsersInDLSessions
     * 
    **/
    select?: UsersInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInDLSessionsInclude | null
    /**
     * Filter which UsersInDLSessions to delete.
     * 
    **/
    where: UsersInDLSessionsWhereUniqueInput
  }


  /**
   * UsersInDLSessions deleteMany
   */
  export type UsersInDLSessionsDeleteManyArgs = {
    /**
     * Filter which UsersInDLSessions to delete
     * 
    **/
    where?: UsersInDLSessionsWhereInput
  }


  /**
   * UsersInDLSessions: findUniqueOrThrow
   */
  export type UsersInDLSessionsFindUniqueOrThrowArgs = UsersInDLSessionsFindUniqueArgsBase
      

  /**
   * UsersInDLSessions: findFirstOrThrow
   */
  export type UsersInDLSessionsFindFirstOrThrowArgs = UsersInDLSessionsFindFirstArgsBase
      

  /**
   * UsersInDLSessions without action
   */
  export type UsersInDLSessionsArgs = {
    /**
     * Select specific fields to fetch from the UsersInDLSessions
     * 
    **/
    select?: UsersInDLSessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInDLSessionsInclude | null
  }



  /**
   * Model UsersInProjects
   */


  export type AggregateUsersInProjects = {
    _count: UsersInProjectsCountAggregateOutputType | null
    _min: UsersInProjectsMinAggregateOutputType | null
    _max: UsersInProjectsMaxAggregateOutputType | null
  }

  export type UsersInProjectsMinAggregateOutputType = {
    userId: string | null
    projectId: string | null
    userRole: ProjectUserRole | null
  }

  export type UsersInProjectsMaxAggregateOutputType = {
    userId: string | null
    projectId: string | null
    userRole: ProjectUserRole | null
  }

  export type UsersInProjectsCountAggregateOutputType = {
    userId: number
    projectId: number
    userRole: number
    _all: number
  }


  export type UsersInProjectsMinAggregateInputType = {
    userId?: true
    projectId?: true
    userRole?: true
  }

  export type UsersInProjectsMaxAggregateInputType = {
    userId?: true
    projectId?: true
    userRole?: true
  }

  export type UsersInProjectsCountAggregateInputType = {
    userId?: true
    projectId?: true
    userRole?: true
    _all?: true
  }

  export type UsersInProjectsAggregateArgs = {
    /**
     * Filter which UsersInProjects to aggregate.
     * 
    **/
    where?: UsersInProjectsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsersInProjects to fetch.
     * 
    **/
    orderBy?: Enumerable<UsersInProjectsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: UsersInProjectsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsersInProjects from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsersInProjects.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UsersInProjects
    **/
    _count?: true | UsersInProjectsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsersInProjectsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsersInProjectsMaxAggregateInputType
  }

  export type GetUsersInProjectsAggregateType<T extends UsersInProjectsAggregateArgs> = {
        [P in keyof T & keyof AggregateUsersInProjects]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsersInProjects[P]>
      : GetScalarType<T[P], AggregateUsersInProjects[P]>
  }




  export type UsersInProjectsGroupByArgs = {
    where?: UsersInProjectsWhereInput
    orderBy?: Enumerable<UsersInProjectsOrderByWithAggregationInput>
    by: Array<UsersInProjectsScalarFieldEnum>
    having?: UsersInProjectsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsersInProjectsCountAggregateInputType | true
    _min?: UsersInProjectsMinAggregateInputType
    _max?: UsersInProjectsMaxAggregateInputType
  }


  export type UsersInProjectsGroupByOutputType = {
    userId: string
    projectId: string
    userRole: ProjectUserRole
    _count: UsersInProjectsCountAggregateOutputType | null
    _min: UsersInProjectsMinAggregateOutputType | null
    _max: UsersInProjectsMaxAggregateOutputType | null
  }

  type GetUsersInProjectsGroupByPayload<T extends UsersInProjectsGroupByArgs> = PrismaPromise<
    Array<
      PickArray<UsersInProjectsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsersInProjectsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsersInProjectsGroupByOutputType[P]>
            : GetScalarType<T[P], UsersInProjectsGroupByOutputType[P]>
        }
      >
    >


  export type UsersInProjectsSelect = {
    userId?: boolean
    projectId?: boolean
    userRole?: boolean
    Project?: boolean | ProjectArgs
  }

  export type UsersInProjectsInclude = {
    Project?: boolean | ProjectArgs
  }

  export type UsersInProjectsGetPayload<
    S extends boolean | null | undefined | UsersInProjectsArgs,
    U = keyof S
      > = S extends true
        ? UsersInProjects
    : S extends undefined
    ? never
    : S extends UsersInProjectsArgs | UsersInProjectsFindManyArgs
    ?'include' extends U
    ? UsersInProjects  & {
    [P in TrueKeys<S['include']>]:
        P extends 'Project' ? ProjectGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'Project' ? ProjectGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof UsersInProjects ? UsersInProjects[P] : never
  } 
    : UsersInProjects
  : UsersInProjects


  type UsersInProjectsCountArgs = Merge<
    Omit<UsersInProjectsFindManyArgs, 'select' | 'include'> & {
      select?: UsersInProjectsCountAggregateInputType | true
    }
  >

  export interface UsersInProjectsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one UsersInProjects that matches the filter.
     * @param {UsersInProjectsFindUniqueArgs} args - Arguments to find a UsersInProjects
     * @example
     * // Get one UsersInProjects
     * const usersInProjects = await prisma.usersInProjects.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends UsersInProjectsFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, UsersInProjectsFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'UsersInProjects'> extends True ? CheckSelect<T, Prisma__UsersInProjectsClient<UsersInProjects>, Prisma__UsersInProjectsClient<UsersInProjectsGetPayload<T>>> : CheckSelect<T, Prisma__UsersInProjectsClient<UsersInProjects | null, null>, Prisma__UsersInProjectsClient<UsersInProjectsGetPayload<T> | null, null>>

    /**
     * Find the first UsersInProjects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersInProjectsFindFirstArgs} args - Arguments to find a UsersInProjects
     * @example
     * // Get one UsersInProjects
     * const usersInProjects = await prisma.usersInProjects.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends UsersInProjectsFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, UsersInProjectsFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'UsersInProjects'> extends True ? CheckSelect<T, Prisma__UsersInProjectsClient<UsersInProjects>, Prisma__UsersInProjectsClient<UsersInProjectsGetPayload<T>>> : CheckSelect<T, Prisma__UsersInProjectsClient<UsersInProjects | null, null>, Prisma__UsersInProjectsClient<UsersInProjectsGetPayload<T> | null, null>>

    /**
     * Find zero or more UsersInProjects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersInProjectsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UsersInProjects
     * const usersInProjects = await prisma.usersInProjects.findMany()
     * 
     * // Get first 10 UsersInProjects
     * const usersInProjects = await prisma.usersInProjects.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const usersInProjectsWithUserIdOnly = await prisma.usersInProjects.findMany({ select: { userId: true } })
     * 
    **/
    findMany<T extends UsersInProjectsFindManyArgs>(
      args?: SelectSubset<T, UsersInProjectsFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<UsersInProjects>>, PrismaPromise<Array<UsersInProjectsGetPayload<T>>>>

    /**
     * Create a UsersInProjects.
     * @param {UsersInProjectsCreateArgs} args - Arguments to create a UsersInProjects.
     * @example
     * // Create one UsersInProjects
     * const UsersInProjects = await prisma.usersInProjects.create({
     *   data: {
     *     // ... data to create a UsersInProjects
     *   }
     * })
     * 
    **/
    create<T extends UsersInProjectsCreateArgs>(
      args: SelectSubset<T, UsersInProjectsCreateArgs>
    ): CheckSelect<T, Prisma__UsersInProjectsClient<UsersInProjects>, Prisma__UsersInProjectsClient<UsersInProjectsGetPayload<T>>>

    /**
     * Create many UsersInProjects.
     *     @param {UsersInProjectsCreateManyArgs} args - Arguments to create many UsersInProjects.
     *     @example
     *     // Create many UsersInProjects
     *     const usersInProjects = await prisma.usersInProjects.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends UsersInProjectsCreateManyArgs>(
      args?: SelectSubset<T, UsersInProjectsCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a UsersInProjects.
     * @param {UsersInProjectsDeleteArgs} args - Arguments to delete one UsersInProjects.
     * @example
     * // Delete one UsersInProjects
     * const UsersInProjects = await prisma.usersInProjects.delete({
     *   where: {
     *     // ... filter to delete one UsersInProjects
     *   }
     * })
     * 
    **/
    delete<T extends UsersInProjectsDeleteArgs>(
      args: SelectSubset<T, UsersInProjectsDeleteArgs>
    ): CheckSelect<T, Prisma__UsersInProjectsClient<UsersInProjects>, Prisma__UsersInProjectsClient<UsersInProjectsGetPayload<T>>>

    /**
     * Update one UsersInProjects.
     * @param {UsersInProjectsUpdateArgs} args - Arguments to update one UsersInProjects.
     * @example
     * // Update one UsersInProjects
     * const usersInProjects = await prisma.usersInProjects.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends UsersInProjectsUpdateArgs>(
      args: SelectSubset<T, UsersInProjectsUpdateArgs>
    ): CheckSelect<T, Prisma__UsersInProjectsClient<UsersInProjects>, Prisma__UsersInProjectsClient<UsersInProjectsGetPayload<T>>>

    /**
     * Delete zero or more UsersInProjects.
     * @param {UsersInProjectsDeleteManyArgs} args - Arguments to filter UsersInProjects to delete.
     * @example
     * // Delete a few UsersInProjects
     * const { count } = await prisma.usersInProjects.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends UsersInProjectsDeleteManyArgs>(
      args?: SelectSubset<T, UsersInProjectsDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more UsersInProjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersInProjectsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UsersInProjects
     * const usersInProjects = await prisma.usersInProjects.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends UsersInProjectsUpdateManyArgs>(
      args: SelectSubset<T, UsersInProjectsUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one UsersInProjects.
     * @param {UsersInProjectsUpsertArgs} args - Arguments to update or create a UsersInProjects.
     * @example
     * // Update or create a UsersInProjects
     * const usersInProjects = await prisma.usersInProjects.upsert({
     *   create: {
     *     // ... data to create a UsersInProjects
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UsersInProjects we want to update
     *   }
     * })
    **/
    upsert<T extends UsersInProjectsUpsertArgs>(
      args: SelectSubset<T, UsersInProjectsUpsertArgs>
    ): CheckSelect<T, Prisma__UsersInProjectsClient<UsersInProjects>, Prisma__UsersInProjectsClient<UsersInProjectsGetPayload<T>>>

    /**
     * Find one UsersInProjects that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {UsersInProjectsFindUniqueOrThrowArgs} args - Arguments to find a UsersInProjects
     * @example
     * // Get one UsersInProjects
     * const usersInProjects = await prisma.usersInProjects.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends UsersInProjectsFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, UsersInProjectsFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__UsersInProjectsClient<UsersInProjects>, Prisma__UsersInProjectsClient<UsersInProjectsGetPayload<T>>>

    /**
     * Find the first UsersInProjects that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersInProjectsFindFirstOrThrowArgs} args - Arguments to find a UsersInProjects
     * @example
     * // Get one UsersInProjects
     * const usersInProjects = await prisma.usersInProjects.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends UsersInProjectsFindFirstOrThrowArgs>(
      args?: SelectSubset<T, UsersInProjectsFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__UsersInProjectsClient<UsersInProjects>, Prisma__UsersInProjectsClient<UsersInProjectsGetPayload<T>>>

    /**
     * Count the number of UsersInProjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersInProjectsCountArgs} args - Arguments to filter UsersInProjects to count.
     * @example
     * // Count the number of UsersInProjects
     * const count = await prisma.usersInProjects.count({
     *   where: {
     *     // ... the filter for the UsersInProjects we want to count
     *   }
     * })
    **/
    count<T extends UsersInProjectsCountArgs>(
      args?: Subset<T, UsersInProjectsCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsersInProjectsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UsersInProjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersInProjectsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsersInProjectsAggregateArgs>(args: Subset<T, UsersInProjectsAggregateArgs>): PrismaPromise<GetUsersInProjectsAggregateType<T>>

    /**
     * Group by UsersInProjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersInProjectsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UsersInProjectsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsersInProjectsGroupByArgs['orderBy'] }
        : { orderBy?: UsersInProjectsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UsersInProjectsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsersInProjectsGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for UsersInProjects.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__UsersInProjectsClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    Project<T extends ProjectArgs = {}>(args?: Subset<T, ProjectArgs>): CheckSelect<T, Prisma__ProjectClient<Project | Null>, Prisma__ProjectClient<ProjectGetPayload<T> | Null>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * UsersInProjects base type for findUnique actions
   */
  export type UsersInProjectsFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the UsersInProjects
     * 
    **/
    select?: UsersInProjectsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInProjectsInclude | null
    /**
     * Filter, which UsersInProjects to fetch.
     * 
    **/
    where: UsersInProjectsWhereUniqueInput
  }

  /**
   * UsersInProjects: findUnique
   */
  export interface UsersInProjectsFindUniqueArgs extends UsersInProjectsFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * UsersInProjects base type for findFirst actions
   */
  export type UsersInProjectsFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the UsersInProjects
     * 
    **/
    select?: UsersInProjectsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInProjectsInclude | null
    /**
     * Filter, which UsersInProjects to fetch.
     * 
    **/
    where?: UsersInProjectsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsersInProjects to fetch.
     * 
    **/
    orderBy?: Enumerable<UsersInProjectsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UsersInProjects.
     * 
    **/
    cursor?: UsersInProjectsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsersInProjects from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsersInProjects.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UsersInProjects.
     * 
    **/
    distinct?: Enumerable<UsersInProjectsScalarFieldEnum>
  }

  /**
   * UsersInProjects: findFirst
   */
  export interface UsersInProjectsFindFirstArgs extends UsersInProjectsFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * UsersInProjects findMany
   */
  export type UsersInProjectsFindManyArgs = {
    /**
     * Select specific fields to fetch from the UsersInProjects
     * 
    **/
    select?: UsersInProjectsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInProjectsInclude | null
    /**
     * Filter, which UsersInProjects to fetch.
     * 
    **/
    where?: UsersInProjectsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsersInProjects to fetch.
     * 
    **/
    orderBy?: Enumerable<UsersInProjectsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UsersInProjects.
     * 
    **/
    cursor?: UsersInProjectsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsersInProjects from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsersInProjects.
     * 
    **/
    skip?: number
    distinct?: Enumerable<UsersInProjectsScalarFieldEnum>
  }


  /**
   * UsersInProjects create
   */
  export type UsersInProjectsCreateArgs = {
    /**
     * Select specific fields to fetch from the UsersInProjects
     * 
    **/
    select?: UsersInProjectsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInProjectsInclude | null
    /**
     * The data needed to create a UsersInProjects.
     * 
    **/
    data: XOR<UsersInProjectsCreateInput, UsersInProjectsUncheckedCreateInput>
  }


  /**
   * UsersInProjects createMany
   */
  export type UsersInProjectsCreateManyArgs = {
    /**
     * The data used to create many UsersInProjects.
     * 
    **/
    data: Enumerable<UsersInProjectsCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * UsersInProjects update
   */
  export type UsersInProjectsUpdateArgs = {
    /**
     * Select specific fields to fetch from the UsersInProjects
     * 
    **/
    select?: UsersInProjectsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInProjectsInclude | null
    /**
     * The data needed to update a UsersInProjects.
     * 
    **/
    data: XOR<UsersInProjectsUpdateInput, UsersInProjectsUncheckedUpdateInput>
    /**
     * Choose, which UsersInProjects to update.
     * 
    **/
    where: UsersInProjectsWhereUniqueInput
  }


  /**
   * UsersInProjects updateMany
   */
  export type UsersInProjectsUpdateManyArgs = {
    /**
     * The data used to update UsersInProjects.
     * 
    **/
    data: XOR<UsersInProjectsUpdateManyMutationInput, UsersInProjectsUncheckedUpdateManyInput>
    /**
     * Filter which UsersInProjects to update
     * 
    **/
    where?: UsersInProjectsWhereInput
  }


  /**
   * UsersInProjects upsert
   */
  export type UsersInProjectsUpsertArgs = {
    /**
     * Select specific fields to fetch from the UsersInProjects
     * 
    **/
    select?: UsersInProjectsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInProjectsInclude | null
    /**
     * The filter to search for the UsersInProjects to update in case it exists.
     * 
    **/
    where: UsersInProjectsWhereUniqueInput
    /**
     * In case the UsersInProjects found by the `where` argument doesn't exist, create a new UsersInProjects with this data.
     * 
    **/
    create: XOR<UsersInProjectsCreateInput, UsersInProjectsUncheckedCreateInput>
    /**
     * In case the UsersInProjects was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<UsersInProjectsUpdateInput, UsersInProjectsUncheckedUpdateInput>
  }


  /**
   * UsersInProjects delete
   */
  export type UsersInProjectsDeleteArgs = {
    /**
     * Select specific fields to fetch from the UsersInProjects
     * 
    **/
    select?: UsersInProjectsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInProjectsInclude | null
    /**
     * Filter which UsersInProjects to delete.
     * 
    **/
    where: UsersInProjectsWhereUniqueInput
  }


  /**
   * UsersInProjects deleteMany
   */
  export type UsersInProjectsDeleteManyArgs = {
    /**
     * Filter which UsersInProjects to delete
     * 
    **/
    where?: UsersInProjectsWhereInput
  }


  /**
   * UsersInProjects: findUniqueOrThrow
   */
  export type UsersInProjectsFindUniqueOrThrowArgs = UsersInProjectsFindUniqueArgsBase
      

  /**
   * UsersInProjects: findFirstOrThrow
   */
  export type UsersInProjectsFindFirstOrThrowArgs = UsersInProjectsFindFirstArgsBase
      

  /**
   * UsersInProjects without action
   */
  export type UsersInProjectsArgs = {
    /**
     * Select specific fields to fetch from the UsersInProjects
     * 
    **/
    select?: UsersInProjectsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInProjectsInclude | null
  }



  /**
   * Model UsersInRASessions
   */


  export type AggregateUsersInRASessions = {
    _count: UsersInRASessionsCountAggregateOutputType | null
    _min: UsersInRASessionsMinAggregateOutputType | null
    _max: UsersInRASessionsMaxAggregateOutputType | null
  }

  export type UsersInRASessionsMinAggregateOutputType = {
    userId: string | null
    rASessionId: string | null
    userRole: SessionUserRole | null
  }

  export type UsersInRASessionsMaxAggregateOutputType = {
    userId: string | null
    rASessionId: string | null
    userRole: SessionUserRole | null
  }

  export type UsersInRASessionsCountAggregateOutputType = {
    userId: number
    rASessionId: number
    userRole: number
    _all: number
  }


  export type UsersInRASessionsMinAggregateInputType = {
    userId?: true
    rASessionId?: true
    userRole?: true
  }

  export type UsersInRASessionsMaxAggregateInputType = {
    userId?: true
    rASessionId?: true
    userRole?: true
  }

  export type UsersInRASessionsCountAggregateInputType = {
    userId?: true
    rASessionId?: true
    userRole?: true
    _all?: true
  }

  export type UsersInRASessionsAggregateArgs = {
    /**
     * Filter which UsersInRASessions to aggregate.
     * 
    **/
    where?: UsersInRASessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsersInRASessions to fetch.
     * 
    **/
    orderBy?: Enumerable<UsersInRASessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: UsersInRASessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsersInRASessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsersInRASessions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UsersInRASessions
    **/
    _count?: true | UsersInRASessionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsersInRASessionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsersInRASessionsMaxAggregateInputType
  }

  export type GetUsersInRASessionsAggregateType<T extends UsersInRASessionsAggregateArgs> = {
        [P in keyof T & keyof AggregateUsersInRASessions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsersInRASessions[P]>
      : GetScalarType<T[P], AggregateUsersInRASessions[P]>
  }




  export type UsersInRASessionsGroupByArgs = {
    where?: UsersInRASessionsWhereInput
    orderBy?: Enumerable<UsersInRASessionsOrderByWithAggregationInput>
    by: Array<UsersInRASessionsScalarFieldEnum>
    having?: UsersInRASessionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsersInRASessionsCountAggregateInputType | true
    _min?: UsersInRASessionsMinAggregateInputType
    _max?: UsersInRASessionsMaxAggregateInputType
  }


  export type UsersInRASessionsGroupByOutputType = {
    userId: string
    rASessionId: string
    userRole: SessionUserRole
    _count: UsersInRASessionsCountAggregateOutputType | null
    _min: UsersInRASessionsMinAggregateOutputType | null
    _max: UsersInRASessionsMaxAggregateOutputType | null
  }

  type GetUsersInRASessionsGroupByPayload<T extends UsersInRASessionsGroupByArgs> = PrismaPromise<
    Array<
      PickArray<UsersInRASessionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsersInRASessionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsersInRASessionsGroupByOutputType[P]>
            : GetScalarType<T[P], UsersInRASessionsGroupByOutputType[P]>
        }
      >
    >


  export type UsersInRASessionsSelect = {
    userId?: boolean
    rASessionId?: boolean
    userRole?: boolean
    RASession?: boolean | RASessionArgs
  }

  export type UsersInRASessionsInclude = {
    RASession?: boolean | RASessionArgs
  }

  export type UsersInRASessionsGetPayload<
    S extends boolean | null | undefined | UsersInRASessionsArgs,
    U = keyof S
      > = S extends true
        ? UsersInRASessions
    : S extends undefined
    ? never
    : S extends UsersInRASessionsArgs | UsersInRASessionsFindManyArgs
    ?'include' extends U
    ? UsersInRASessions  & {
    [P in TrueKeys<S['include']>]:
        P extends 'RASession' ? RASessionGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'RASession' ? RASessionGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof UsersInRASessions ? UsersInRASessions[P] : never
  } 
    : UsersInRASessions
  : UsersInRASessions


  type UsersInRASessionsCountArgs = Merge<
    Omit<UsersInRASessionsFindManyArgs, 'select' | 'include'> & {
      select?: UsersInRASessionsCountAggregateInputType | true
    }
  >

  export interface UsersInRASessionsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one UsersInRASessions that matches the filter.
     * @param {UsersInRASessionsFindUniqueArgs} args - Arguments to find a UsersInRASessions
     * @example
     * // Get one UsersInRASessions
     * const usersInRASessions = await prisma.usersInRASessions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends UsersInRASessionsFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, UsersInRASessionsFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'UsersInRASessions'> extends True ? CheckSelect<T, Prisma__UsersInRASessionsClient<UsersInRASessions>, Prisma__UsersInRASessionsClient<UsersInRASessionsGetPayload<T>>> : CheckSelect<T, Prisma__UsersInRASessionsClient<UsersInRASessions | null, null>, Prisma__UsersInRASessionsClient<UsersInRASessionsGetPayload<T> | null, null>>

    /**
     * Find the first UsersInRASessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersInRASessionsFindFirstArgs} args - Arguments to find a UsersInRASessions
     * @example
     * // Get one UsersInRASessions
     * const usersInRASessions = await prisma.usersInRASessions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends UsersInRASessionsFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, UsersInRASessionsFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'UsersInRASessions'> extends True ? CheckSelect<T, Prisma__UsersInRASessionsClient<UsersInRASessions>, Prisma__UsersInRASessionsClient<UsersInRASessionsGetPayload<T>>> : CheckSelect<T, Prisma__UsersInRASessionsClient<UsersInRASessions | null, null>, Prisma__UsersInRASessionsClient<UsersInRASessionsGetPayload<T> | null, null>>

    /**
     * Find zero or more UsersInRASessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersInRASessionsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UsersInRASessions
     * const usersInRASessions = await prisma.usersInRASessions.findMany()
     * 
     * // Get first 10 UsersInRASessions
     * const usersInRASessions = await prisma.usersInRASessions.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const usersInRASessionsWithUserIdOnly = await prisma.usersInRASessions.findMany({ select: { userId: true } })
     * 
    **/
    findMany<T extends UsersInRASessionsFindManyArgs>(
      args?: SelectSubset<T, UsersInRASessionsFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<UsersInRASessions>>, PrismaPromise<Array<UsersInRASessionsGetPayload<T>>>>

    /**
     * Create a UsersInRASessions.
     * @param {UsersInRASessionsCreateArgs} args - Arguments to create a UsersInRASessions.
     * @example
     * // Create one UsersInRASessions
     * const UsersInRASessions = await prisma.usersInRASessions.create({
     *   data: {
     *     // ... data to create a UsersInRASessions
     *   }
     * })
     * 
    **/
    create<T extends UsersInRASessionsCreateArgs>(
      args: SelectSubset<T, UsersInRASessionsCreateArgs>
    ): CheckSelect<T, Prisma__UsersInRASessionsClient<UsersInRASessions>, Prisma__UsersInRASessionsClient<UsersInRASessionsGetPayload<T>>>

    /**
     * Create many UsersInRASessions.
     *     @param {UsersInRASessionsCreateManyArgs} args - Arguments to create many UsersInRASessions.
     *     @example
     *     // Create many UsersInRASessions
     *     const usersInRASessions = await prisma.usersInRASessions.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends UsersInRASessionsCreateManyArgs>(
      args?: SelectSubset<T, UsersInRASessionsCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a UsersInRASessions.
     * @param {UsersInRASessionsDeleteArgs} args - Arguments to delete one UsersInRASessions.
     * @example
     * // Delete one UsersInRASessions
     * const UsersInRASessions = await prisma.usersInRASessions.delete({
     *   where: {
     *     // ... filter to delete one UsersInRASessions
     *   }
     * })
     * 
    **/
    delete<T extends UsersInRASessionsDeleteArgs>(
      args: SelectSubset<T, UsersInRASessionsDeleteArgs>
    ): CheckSelect<T, Prisma__UsersInRASessionsClient<UsersInRASessions>, Prisma__UsersInRASessionsClient<UsersInRASessionsGetPayload<T>>>

    /**
     * Update one UsersInRASessions.
     * @param {UsersInRASessionsUpdateArgs} args - Arguments to update one UsersInRASessions.
     * @example
     * // Update one UsersInRASessions
     * const usersInRASessions = await prisma.usersInRASessions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends UsersInRASessionsUpdateArgs>(
      args: SelectSubset<T, UsersInRASessionsUpdateArgs>
    ): CheckSelect<T, Prisma__UsersInRASessionsClient<UsersInRASessions>, Prisma__UsersInRASessionsClient<UsersInRASessionsGetPayload<T>>>

    /**
     * Delete zero or more UsersInRASessions.
     * @param {UsersInRASessionsDeleteManyArgs} args - Arguments to filter UsersInRASessions to delete.
     * @example
     * // Delete a few UsersInRASessions
     * const { count } = await prisma.usersInRASessions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends UsersInRASessionsDeleteManyArgs>(
      args?: SelectSubset<T, UsersInRASessionsDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more UsersInRASessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersInRASessionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UsersInRASessions
     * const usersInRASessions = await prisma.usersInRASessions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends UsersInRASessionsUpdateManyArgs>(
      args: SelectSubset<T, UsersInRASessionsUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one UsersInRASessions.
     * @param {UsersInRASessionsUpsertArgs} args - Arguments to update or create a UsersInRASessions.
     * @example
     * // Update or create a UsersInRASessions
     * const usersInRASessions = await prisma.usersInRASessions.upsert({
     *   create: {
     *     // ... data to create a UsersInRASessions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UsersInRASessions we want to update
     *   }
     * })
    **/
    upsert<T extends UsersInRASessionsUpsertArgs>(
      args: SelectSubset<T, UsersInRASessionsUpsertArgs>
    ): CheckSelect<T, Prisma__UsersInRASessionsClient<UsersInRASessions>, Prisma__UsersInRASessionsClient<UsersInRASessionsGetPayload<T>>>

    /**
     * Find one UsersInRASessions that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {UsersInRASessionsFindUniqueOrThrowArgs} args - Arguments to find a UsersInRASessions
     * @example
     * // Get one UsersInRASessions
     * const usersInRASessions = await prisma.usersInRASessions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends UsersInRASessionsFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, UsersInRASessionsFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__UsersInRASessionsClient<UsersInRASessions>, Prisma__UsersInRASessionsClient<UsersInRASessionsGetPayload<T>>>

    /**
     * Find the first UsersInRASessions that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersInRASessionsFindFirstOrThrowArgs} args - Arguments to find a UsersInRASessions
     * @example
     * // Get one UsersInRASessions
     * const usersInRASessions = await prisma.usersInRASessions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends UsersInRASessionsFindFirstOrThrowArgs>(
      args?: SelectSubset<T, UsersInRASessionsFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__UsersInRASessionsClient<UsersInRASessions>, Prisma__UsersInRASessionsClient<UsersInRASessionsGetPayload<T>>>

    /**
     * Count the number of UsersInRASessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersInRASessionsCountArgs} args - Arguments to filter UsersInRASessions to count.
     * @example
     * // Count the number of UsersInRASessions
     * const count = await prisma.usersInRASessions.count({
     *   where: {
     *     // ... the filter for the UsersInRASessions we want to count
     *   }
     * })
    **/
    count<T extends UsersInRASessionsCountArgs>(
      args?: Subset<T, UsersInRASessionsCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsersInRASessionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UsersInRASessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersInRASessionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsersInRASessionsAggregateArgs>(args: Subset<T, UsersInRASessionsAggregateArgs>): PrismaPromise<GetUsersInRASessionsAggregateType<T>>

    /**
     * Group by UsersInRASessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersInRASessionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UsersInRASessionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsersInRASessionsGroupByArgs['orderBy'] }
        : { orderBy?: UsersInRASessionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UsersInRASessionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsersInRASessionsGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for UsersInRASessions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__UsersInRASessionsClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    RASession<T extends RASessionArgs = {}>(args?: Subset<T, RASessionArgs>): CheckSelect<T, Prisma__RASessionClient<RASession | Null>, Prisma__RASessionClient<RASessionGetPayload<T> | Null>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * UsersInRASessions base type for findUnique actions
   */
  export type UsersInRASessionsFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the UsersInRASessions
     * 
    **/
    select?: UsersInRASessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInRASessionsInclude | null
    /**
     * Filter, which UsersInRASessions to fetch.
     * 
    **/
    where: UsersInRASessionsWhereUniqueInput
  }

  /**
   * UsersInRASessions: findUnique
   */
  export interface UsersInRASessionsFindUniqueArgs extends UsersInRASessionsFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * UsersInRASessions base type for findFirst actions
   */
  export type UsersInRASessionsFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the UsersInRASessions
     * 
    **/
    select?: UsersInRASessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInRASessionsInclude | null
    /**
     * Filter, which UsersInRASessions to fetch.
     * 
    **/
    where?: UsersInRASessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsersInRASessions to fetch.
     * 
    **/
    orderBy?: Enumerable<UsersInRASessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UsersInRASessions.
     * 
    **/
    cursor?: UsersInRASessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsersInRASessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsersInRASessions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UsersInRASessions.
     * 
    **/
    distinct?: Enumerable<UsersInRASessionsScalarFieldEnum>
  }

  /**
   * UsersInRASessions: findFirst
   */
  export interface UsersInRASessionsFindFirstArgs extends UsersInRASessionsFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * UsersInRASessions findMany
   */
  export type UsersInRASessionsFindManyArgs = {
    /**
     * Select specific fields to fetch from the UsersInRASessions
     * 
    **/
    select?: UsersInRASessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInRASessionsInclude | null
    /**
     * Filter, which UsersInRASessions to fetch.
     * 
    **/
    where?: UsersInRASessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsersInRASessions to fetch.
     * 
    **/
    orderBy?: Enumerable<UsersInRASessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UsersInRASessions.
     * 
    **/
    cursor?: UsersInRASessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsersInRASessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsersInRASessions.
     * 
    **/
    skip?: number
    distinct?: Enumerable<UsersInRASessionsScalarFieldEnum>
  }


  /**
   * UsersInRASessions create
   */
  export type UsersInRASessionsCreateArgs = {
    /**
     * Select specific fields to fetch from the UsersInRASessions
     * 
    **/
    select?: UsersInRASessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInRASessionsInclude | null
    /**
     * The data needed to create a UsersInRASessions.
     * 
    **/
    data: XOR<UsersInRASessionsCreateInput, UsersInRASessionsUncheckedCreateInput>
  }


  /**
   * UsersInRASessions createMany
   */
  export type UsersInRASessionsCreateManyArgs = {
    /**
     * The data used to create many UsersInRASessions.
     * 
    **/
    data: Enumerable<UsersInRASessionsCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * UsersInRASessions update
   */
  export type UsersInRASessionsUpdateArgs = {
    /**
     * Select specific fields to fetch from the UsersInRASessions
     * 
    **/
    select?: UsersInRASessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInRASessionsInclude | null
    /**
     * The data needed to update a UsersInRASessions.
     * 
    **/
    data: XOR<UsersInRASessionsUpdateInput, UsersInRASessionsUncheckedUpdateInput>
    /**
     * Choose, which UsersInRASessions to update.
     * 
    **/
    where: UsersInRASessionsWhereUniqueInput
  }


  /**
   * UsersInRASessions updateMany
   */
  export type UsersInRASessionsUpdateManyArgs = {
    /**
     * The data used to update UsersInRASessions.
     * 
    **/
    data: XOR<UsersInRASessionsUpdateManyMutationInput, UsersInRASessionsUncheckedUpdateManyInput>
    /**
     * Filter which UsersInRASessions to update
     * 
    **/
    where?: UsersInRASessionsWhereInput
  }


  /**
   * UsersInRASessions upsert
   */
  export type UsersInRASessionsUpsertArgs = {
    /**
     * Select specific fields to fetch from the UsersInRASessions
     * 
    **/
    select?: UsersInRASessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInRASessionsInclude | null
    /**
     * The filter to search for the UsersInRASessions to update in case it exists.
     * 
    **/
    where: UsersInRASessionsWhereUniqueInput
    /**
     * In case the UsersInRASessions found by the `where` argument doesn't exist, create a new UsersInRASessions with this data.
     * 
    **/
    create: XOR<UsersInRASessionsCreateInput, UsersInRASessionsUncheckedCreateInput>
    /**
     * In case the UsersInRASessions was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<UsersInRASessionsUpdateInput, UsersInRASessionsUncheckedUpdateInput>
  }


  /**
   * UsersInRASessions delete
   */
  export type UsersInRASessionsDeleteArgs = {
    /**
     * Select specific fields to fetch from the UsersInRASessions
     * 
    **/
    select?: UsersInRASessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInRASessionsInclude | null
    /**
     * Filter which UsersInRASessions to delete.
     * 
    **/
    where: UsersInRASessionsWhereUniqueInput
  }


  /**
   * UsersInRASessions deleteMany
   */
  export type UsersInRASessionsDeleteManyArgs = {
    /**
     * Filter which UsersInRASessions to delete
     * 
    **/
    where?: UsersInRASessionsWhereInput
  }


  /**
   * UsersInRASessions: findUniqueOrThrow
   */
  export type UsersInRASessionsFindUniqueOrThrowArgs = UsersInRASessionsFindUniqueArgsBase
      

  /**
   * UsersInRASessions: findFirstOrThrow
   */
  export type UsersInRASessionsFindFirstOrThrowArgs = UsersInRASessionsFindFirstArgsBase
      

  /**
   * UsersInRASessions without action
   */
  export type UsersInRASessionsArgs = {
    /**
     * Select specific fields to fetch from the UsersInRASessions
     * 
    **/
    select?: UsersInRASessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UsersInRASessionsInclude | null
  }



  /**
   * Model Visit
   */


  export type AggregateVisit = {
    _count: VisitCountAggregateOutputType | null
    _min: VisitMinAggregateOutputType | null
    _max: VisitMaxAggregateOutputType | null
  }

  export type VisitMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    patientId: string | null
  }

  export type VisitMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    patientId: string | null
  }

  export type VisitCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    patientId: number
    _all: number
  }


  export type VisitMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    patientId?: true
  }

  export type VisitMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    patientId?: true
  }

  export type VisitCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    patientId?: true
    _all?: true
  }

  export type VisitAggregateArgs = {
    /**
     * Filter which Visit to aggregate.
     * 
    **/
    where?: VisitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Visits to fetch.
     * 
    **/
    orderBy?: Enumerable<VisitOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: VisitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Visits from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Visits.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Visits
    **/
    _count?: true | VisitCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VisitMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VisitMaxAggregateInputType
  }

  export type GetVisitAggregateType<T extends VisitAggregateArgs> = {
        [P in keyof T & keyof AggregateVisit]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVisit[P]>
      : GetScalarType<T[P], AggregateVisit[P]>
  }




  export type VisitGroupByArgs = {
    where?: VisitWhereInput
    orderBy?: Enumerable<VisitOrderByWithAggregationInput>
    by: Array<VisitScalarFieldEnum>
    having?: VisitScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VisitCountAggregateInputType | true
    _min?: VisitMinAggregateInputType
    _max?: VisitMaxAggregateInputType
  }


  export type VisitGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    patientId: string
    _count: VisitCountAggregateOutputType | null
    _min: VisitMinAggregateOutputType | null
    _max: VisitMaxAggregateOutputType | null
  }

  type GetVisitGroupByPayload<T extends VisitGroupByArgs> = PrismaPromise<
    Array<
      PickArray<VisitGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VisitGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VisitGroupByOutputType[P]>
            : GetScalarType<T[P], VisitGroupByOutputType[P]>
        }
      >
    >


  export type VisitSelect = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    patientId?: boolean
    Patient?: boolean | PatientArgs
    RawResource?: boolean | RawResourceFindManyArgs
    VisitsInRASessions?: boolean | VisitsInRASessionsFindManyArgs
    _count?: boolean | VisitCountOutputTypeArgs
  }

  export type VisitInclude = {
    Patient?: boolean | PatientArgs
    RawResource?: boolean | RawResourceFindManyArgs
    VisitsInRASessions?: boolean | VisitsInRASessionsFindManyArgs
    _count?: boolean | VisitCountOutputTypeArgs
  }

  export type VisitGetPayload<
    S extends boolean | null | undefined | VisitArgs,
    U = keyof S
      > = S extends true
        ? Visit
    : S extends undefined
    ? never
    : S extends VisitArgs | VisitFindManyArgs
    ?'include' extends U
    ? Visit  & {
    [P in TrueKeys<S['include']>]:
        P extends 'Patient' ? PatientGetPayload<Exclude<S['include'], undefined | null>[P]> :
        P extends 'RawResource' ? Array < RawResourceGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends 'VisitsInRASessions' ? Array < VisitsInRASessionsGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends '_count' ? VisitCountOutputTypeGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'Patient' ? PatientGetPayload<Exclude<S['select'], undefined | null>[P]> :
        P extends 'RawResource' ? Array < RawResourceGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends 'VisitsInRASessions' ? Array < VisitsInRASessionsGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends '_count' ? VisitCountOutputTypeGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof Visit ? Visit[P] : never
  } 
    : Visit
  : Visit


  type VisitCountArgs = Merge<
    Omit<VisitFindManyArgs, 'select' | 'include'> & {
      select?: VisitCountAggregateInputType | true
    }
  >

  export interface VisitDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one Visit that matches the filter.
     * @param {VisitFindUniqueArgs} args - Arguments to find a Visit
     * @example
     * // Get one Visit
     * const visit = await prisma.visit.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends VisitFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, VisitFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Visit'> extends True ? CheckSelect<T, Prisma__VisitClient<Visit>, Prisma__VisitClient<VisitGetPayload<T>>> : CheckSelect<T, Prisma__VisitClient<Visit | null, null>, Prisma__VisitClient<VisitGetPayload<T> | null, null>>

    /**
     * Find the first Visit that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitFindFirstArgs} args - Arguments to find a Visit
     * @example
     * // Get one Visit
     * const visit = await prisma.visit.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends VisitFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, VisitFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Visit'> extends True ? CheckSelect<T, Prisma__VisitClient<Visit>, Prisma__VisitClient<VisitGetPayload<T>>> : CheckSelect<T, Prisma__VisitClient<Visit | null, null>, Prisma__VisitClient<VisitGetPayload<T> | null, null>>

    /**
     * Find zero or more Visits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Visits
     * const visits = await prisma.visit.findMany()
     * 
     * // Get first 10 Visits
     * const visits = await prisma.visit.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const visitWithIdOnly = await prisma.visit.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends VisitFindManyArgs>(
      args?: SelectSubset<T, VisitFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<Visit>>, PrismaPromise<Array<VisitGetPayload<T>>>>

    /**
     * Create a Visit.
     * @param {VisitCreateArgs} args - Arguments to create a Visit.
     * @example
     * // Create one Visit
     * const Visit = await prisma.visit.create({
     *   data: {
     *     // ... data to create a Visit
     *   }
     * })
     * 
    **/
    create<T extends VisitCreateArgs>(
      args: SelectSubset<T, VisitCreateArgs>
    ): CheckSelect<T, Prisma__VisitClient<Visit>, Prisma__VisitClient<VisitGetPayload<T>>>

    /**
     * Create many Visits.
     *     @param {VisitCreateManyArgs} args - Arguments to create many Visits.
     *     @example
     *     // Create many Visits
     *     const visit = await prisma.visit.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends VisitCreateManyArgs>(
      args?: SelectSubset<T, VisitCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Visit.
     * @param {VisitDeleteArgs} args - Arguments to delete one Visit.
     * @example
     * // Delete one Visit
     * const Visit = await prisma.visit.delete({
     *   where: {
     *     // ... filter to delete one Visit
     *   }
     * })
     * 
    **/
    delete<T extends VisitDeleteArgs>(
      args: SelectSubset<T, VisitDeleteArgs>
    ): CheckSelect<T, Prisma__VisitClient<Visit>, Prisma__VisitClient<VisitGetPayload<T>>>

    /**
     * Update one Visit.
     * @param {VisitUpdateArgs} args - Arguments to update one Visit.
     * @example
     * // Update one Visit
     * const visit = await prisma.visit.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends VisitUpdateArgs>(
      args: SelectSubset<T, VisitUpdateArgs>
    ): CheckSelect<T, Prisma__VisitClient<Visit>, Prisma__VisitClient<VisitGetPayload<T>>>

    /**
     * Delete zero or more Visits.
     * @param {VisitDeleteManyArgs} args - Arguments to filter Visits to delete.
     * @example
     * // Delete a few Visits
     * const { count } = await prisma.visit.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends VisitDeleteManyArgs>(
      args?: SelectSubset<T, VisitDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Visits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Visits
     * const visit = await prisma.visit.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends VisitUpdateManyArgs>(
      args: SelectSubset<T, VisitUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Visit.
     * @param {VisitUpsertArgs} args - Arguments to update or create a Visit.
     * @example
     * // Update or create a Visit
     * const visit = await prisma.visit.upsert({
     *   create: {
     *     // ... data to create a Visit
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Visit we want to update
     *   }
     * })
    **/
    upsert<T extends VisitUpsertArgs>(
      args: SelectSubset<T, VisitUpsertArgs>
    ): CheckSelect<T, Prisma__VisitClient<Visit>, Prisma__VisitClient<VisitGetPayload<T>>>

    /**
     * Find one Visit that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {VisitFindUniqueOrThrowArgs} args - Arguments to find a Visit
     * @example
     * // Get one Visit
     * const visit = await prisma.visit.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends VisitFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, VisitFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__VisitClient<Visit>, Prisma__VisitClient<VisitGetPayload<T>>>

    /**
     * Find the first Visit that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitFindFirstOrThrowArgs} args - Arguments to find a Visit
     * @example
     * // Get one Visit
     * const visit = await prisma.visit.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends VisitFindFirstOrThrowArgs>(
      args?: SelectSubset<T, VisitFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__VisitClient<Visit>, Prisma__VisitClient<VisitGetPayload<T>>>

    /**
     * Count the number of Visits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitCountArgs} args - Arguments to filter Visits to count.
     * @example
     * // Count the number of Visits
     * const count = await prisma.visit.count({
     *   where: {
     *     // ... the filter for the Visits we want to count
     *   }
     * })
    **/
    count<T extends VisitCountArgs>(
      args?: Subset<T, VisitCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VisitCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Visit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VisitAggregateArgs>(args: Subset<T, VisitAggregateArgs>): PrismaPromise<GetVisitAggregateType<T>>

    /**
     * Group by Visit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VisitGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VisitGroupByArgs['orderBy'] }
        : { orderBy?: VisitGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VisitGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVisitGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Visit.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__VisitClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    Patient<T extends PatientArgs = {}>(args?: Subset<T, PatientArgs>): CheckSelect<T, Prisma__PatientClient<Patient | Null>, Prisma__PatientClient<PatientGetPayload<T> | Null>>;

    RawResource<T extends RawResourceFindManyArgs = {}>(args?: Subset<T, RawResourceFindManyArgs>): CheckSelect<T, PrismaPromise<Array<RawResource>| Null>, PrismaPromise<Array<RawResourceGetPayload<T>>| Null>>;

    VisitsInRASessions<T extends VisitsInRASessionsFindManyArgs = {}>(args?: Subset<T, VisitsInRASessionsFindManyArgs>): CheckSelect<T, PrismaPromise<Array<VisitsInRASessions>| Null>, PrismaPromise<Array<VisitsInRASessionsGetPayload<T>>| Null>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Visit base type for findUnique actions
   */
  export type VisitFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Visit
     * 
    **/
    select?: VisitSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VisitInclude | null
    /**
     * Filter, which Visit to fetch.
     * 
    **/
    where: VisitWhereUniqueInput
  }

  /**
   * Visit: findUnique
   */
  export interface VisitFindUniqueArgs extends VisitFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Visit base type for findFirst actions
   */
  export type VisitFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Visit
     * 
    **/
    select?: VisitSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VisitInclude | null
    /**
     * Filter, which Visit to fetch.
     * 
    **/
    where?: VisitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Visits to fetch.
     * 
    **/
    orderBy?: Enumerable<VisitOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Visits.
     * 
    **/
    cursor?: VisitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Visits from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Visits.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Visits.
     * 
    **/
    distinct?: Enumerable<VisitScalarFieldEnum>
  }

  /**
   * Visit: findFirst
   */
  export interface VisitFindFirstArgs extends VisitFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Visit findMany
   */
  export type VisitFindManyArgs = {
    /**
     * Select specific fields to fetch from the Visit
     * 
    **/
    select?: VisitSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VisitInclude | null
    /**
     * Filter, which Visits to fetch.
     * 
    **/
    where?: VisitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Visits to fetch.
     * 
    **/
    orderBy?: Enumerable<VisitOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Visits.
     * 
    **/
    cursor?: VisitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Visits from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Visits.
     * 
    **/
    skip?: number
    distinct?: Enumerable<VisitScalarFieldEnum>
  }


  /**
   * Visit create
   */
  export type VisitCreateArgs = {
    /**
     * Select specific fields to fetch from the Visit
     * 
    **/
    select?: VisitSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VisitInclude | null
    /**
     * The data needed to create a Visit.
     * 
    **/
    data: XOR<VisitCreateInput, VisitUncheckedCreateInput>
  }


  /**
   * Visit createMany
   */
  export type VisitCreateManyArgs = {
    /**
     * The data used to create many Visits.
     * 
    **/
    data: Enumerable<VisitCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Visit update
   */
  export type VisitUpdateArgs = {
    /**
     * Select specific fields to fetch from the Visit
     * 
    **/
    select?: VisitSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VisitInclude | null
    /**
     * The data needed to update a Visit.
     * 
    **/
    data: XOR<VisitUpdateInput, VisitUncheckedUpdateInput>
    /**
     * Choose, which Visit to update.
     * 
    **/
    where: VisitWhereUniqueInput
  }


  /**
   * Visit updateMany
   */
  export type VisitUpdateManyArgs = {
    /**
     * The data used to update Visits.
     * 
    **/
    data: XOR<VisitUpdateManyMutationInput, VisitUncheckedUpdateManyInput>
    /**
     * Filter which Visits to update
     * 
    **/
    where?: VisitWhereInput
  }


  /**
   * Visit upsert
   */
  export type VisitUpsertArgs = {
    /**
     * Select specific fields to fetch from the Visit
     * 
    **/
    select?: VisitSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VisitInclude | null
    /**
     * The filter to search for the Visit to update in case it exists.
     * 
    **/
    where: VisitWhereUniqueInput
    /**
     * In case the Visit found by the `where` argument doesn't exist, create a new Visit with this data.
     * 
    **/
    create: XOR<VisitCreateInput, VisitUncheckedCreateInput>
    /**
     * In case the Visit was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<VisitUpdateInput, VisitUncheckedUpdateInput>
  }


  /**
   * Visit delete
   */
  export type VisitDeleteArgs = {
    /**
     * Select specific fields to fetch from the Visit
     * 
    **/
    select?: VisitSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VisitInclude | null
    /**
     * Filter which Visit to delete.
     * 
    **/
    where: VisitWhereUniqueInput
  }


  /**
   * Visit deleteMany
   */
  export type VisitDeleteManyArgs = {
    /**
     * Filter which Visits to delete
     * 
    **/
    where?: VisitWhereInput
  }


  /**
   * Visit: findUniqueOrThrow
   */
  export type VisitFindUniqueOrThrowArgs = VisitFindUniqueArgsBase
      

  /**
   * Visit: findFirstOrThrow
   */
  export type VisitFindFirstOrThrowArgs = VisitFindFirstArgsBase
      

  /**
   * Visit without action
   */
  export type VisitArgs = {
    /**
     * Select specific fields to fetch from the Visit
     * 
    **/
    select?: VisitSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VisitInclude | null
  }



  /**
   * Model VisitsInRASessions
   */


  export type AggregateVisitsInRASessions = {
    _count: VisitsInRASessionsCountAggregateOutputType | null
    _avg: VisitsInRASessionsAvgAggregateOutputType | null
    _sum: VisitsInRASessionsSumAggregateOutputType | null
    _min: VisitsInRASessionsMinAggregateOutputType | null
    _max: VisitsInRASessionsMaxAggregateOutputType | null
  }

  export type VisitsInRASessionsAvgAggregateOutputType = {
    index: number | null
  }

  export type VisitsInRASessionsSumAggregateOutputType = {
    index: number | null
  }

  export type VisitsInRASessionsMinAggregateOutputType = {
    visitId: string | null
    rASessionId: string | null
    index: number | null
    status: ExtractedResourceStatus | null
  }

  export type VisitsInRASessionsMaxAggregateOutputType = {
    visitId: string | null
    rASessionId: string | null
    index: number | null
    status: ExtractedResourceStatus | null
  }

  export type VisitsInRASessionsCountAggregateOutputType = {
    visitId: number
    rASessionId: number
    index: number
    content: number
    status: number
    result: number
    _all: number
  }


  export type VisitsInRASessionsAvgAggregateInputType = {
    index?: true
  }

  export type VisitsInRASessionsSumAggregateInputType = {
    index?: true
  }

  export type VisitsInRASessionsMinAggregateInputType = {
    visitId?: true
    rASessionId?: true
    index?: true
    status?: true
  }

  export type VisitsInRASessionsMaxAggregateInputType = {
    visitId?: true
    rASessionId?: true
    index?: true
    status?: true
  }

  export type VisitsInRASessionsCountAggregateInputType = {
    visitId?: true
    rASessionId?: true
    index?: true
    content?: true
    status?: true
    result?: true
    _all?: true
  }

  export type VisitsInRASessionsAggregateArgs = {
    /**
     * Filter which VisitsInRASessions to aggregate.
     * 
    **/
    where?: VisitsInRASessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VisitsInRASessions to fetch.
     * 
    **/
    orderBy?: Enumerable<VisitsInRASessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: VisitsInRASessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VisitsInRASessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VisitsInRASessions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VisitsInRASessions
    **/
    _count?: true | VisitsInRASessionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VisitsInRASessionsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VisitsInRASessionsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VisitsInRASessionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VisitsInRASessionsMaxAggregateInputType
  }

  export type GetVisitsInRASessionsAggregateType<T extends VisitsInRASessionsAggregateArgs> = {
        [P in keyof T & keyof AggregateVisitsInRASessions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVisitsInRASessions[P]>
      : GetScalarType<T[P], AggregateVisitsInRASessions[P]>
  }




  export type VisitsInRASessionsGroupByArgs = {
    where?: VisitsInRASessionsWhereInput
    orderBy?: Enumerable<VisitsInRASessionsOrderByWithAggregationInput>
    by: Array<VisitsInRASessionsScalarFieldEnum>
    having?: VisitsInRASessionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VisitsInRASessionsCountAggregateInputType | true
    _avg?: VisitsInRASessionsAvgAggregateInputType
    _sum?: VisitsInRASessionsSumAggregateInputType
    _min?: VisitsInRASessionsMinAggregateInputType
    _max?: VisitsInRASessionsMaxAggregateInputType
  }


  export type VisitsInRASessionsGroupByOutputType = {
    visitId: string
    rASessionId: string
    index: number
    content: JsonValue
    status: ExtractedResourceStatus
    result: JsonValue
    _count: VisitsInRASessionsCountAggregateOutputType | null
    _avg: VisitsInRASessionsAvgAggregateOutputType | null
    _sum: VisitsInRASessionsSumAggregateOutputType | null
    _min: VisitsInRASessionsMinAggregateOutputType | null
    _max: VisitsInRASessionsMaxAggregateOutputType | null
  }

  type GetVisitsInRASessionsGroupByPayload<T extends VisitsInRASessionsGroupByArgs> = PrismaPromise<
    Array<
      PickArray<VisitsInRASessionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VisitsInRASessionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VisitsInRASessionsGroupByOutputType[P]>
            : GetScalarType<T[P], VisitsInRASessionsGroupByOutputType[P]>
        }
      >
    >


  export type VisitsInRASessionsSelect = {
    visitId?: boolean
    rASessionId?: boolean
    index?: boolean
    content?: boolean
    status?: boolean
    result?: boolean
    RASession?: boolean | RASessionArgs
    Visit?: boolean | VisitArgs
  }

  export type VisitsInRASessionsInclude = {
    RASession?: boolean | RASessionArgs
    Visit?: boolean | VisitArgs
  }

  export type VisitsInRASessionsGetPayload<
    S extends boolean | null | undefined | VisitsInRASessionsArgs,
    U = keyof S
      > = S extends true
        ? VisitsInRASessions
    : S extends undefined
    ? never
    : S extends VisitsInRASessionsArgs | VisitsInRASessionsFindManyArgs
    ?'include' extends U
    ? VisitsInRASessions  & {
    [P in TrueKeys<S['include']>]:
        P extends 'RASession' ? RASessionGetPayload<Exclude<S['include'], undefined | null>[P]> :
        P extends 'Visit' ? VisitGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'RASession' ? RASessionGetPayload<Exclude<S['select'], undefined | null>[P]> :
        P extends 'Visit' ? VisitGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof VisitsInRASessions ? VisitsInRASessions[P] : never
  } 
    : VisitsInRASessions
  : VisitsInRASessions


  type VisitsInRASessionsCountArgs = Merge<
    Omit<VisitsInRASessionsFindManyArgs, 'select' | 'include'> & {
      select?: VisitsInRASessionsCountAggregateInputType | true
    }
  >

  export interface VisitsInRASessionsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one VisitsInRASessions that matches the filter.
     * @param {VisitsInRASessionsFindUniqueArgs} args - Arguments to find a VisitsInRASessions
     * @example
     * // Get one VisitsInRASessions
     * const visitsInRASessions = await prisma.visitsInRASessions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends VisitsInRASessionsFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, VisitsInRASessionsFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'VisitsInRASessions'> extends True ? CheckSelect<T, Prisma__VisitsInRASessionsClient<VisitsInRASessions>, Prisma__VisitsInRASessionsClient<VisitsInRASessionsGetPayload<T>>> : CheckSelect<T, Prisma__VisitsInRASessionsClient<VisitsInRASessions | null, null>, Prisma__VisitsInRASessionsClient<VisitsInRASessionsGetPayload<T> | null, null>>

    /**
     * Find the first VisitsInRASessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitsInRASessionsFindFirstArgs} args - Arguments to find a VisitsInRASessions
     * @example
     * // Get one VisitsInRASessions
     * const visitsInRASessions = await prisma.visitsInRASessions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends VisitsInRASessionsFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, VisitsInRASessionsFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'VisitsInRASessions'> extends True ? CheckSelect<T, Prisma__VisitsInRASessionsClient<VisitsInRASessions>, Prisma__VisitsInRASessionsClient<VisitsInRASessionsGetPayload<T>>> : CheckSelect<T, Prisma__VisitsInRASessionsClient<VisitsInRASessions | null, null>, Prisma__VisitsInRASessionsClient<VisitsInRASessionsGetPayload<T> | null, null>>

    /**
     * Find zero or more VisitsInRASessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitsInRASessionsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VisitsInRASessions
     * const visitsInRASessions = await prisma.visitsInRASessions.findMany()
     * 
     * // Get first 10 VisitsInRASessions
     * const visitsInRASessions = await prisma.visitsInRASessions.findMany({ take: 10 })
     * 
     * // Only select the `visitId`
     * const visitsInRASessionsWithVisitIdOnly = await prisma.visitsInRASessions.findMany({ select: { visitId: true } })
     * 
    **/
    findMany<T extends VisitsInRASessionsFindManyArgs>(
      args?: SelectSubset<T, VisitsInRASessionsFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<VisitsInRASessions>>, PrismaPromise<Array<VisitsInRASessionsGetPayload<T>>>>

    /**
     * Create a VisitsInRASessions.
     * @param {VisitsInRASessionsCreateArgs} args - Arguments to create a VisitsInRASessions.
     * @example
     * // Create one VisitsInRASessions
     * const VisitsInRASessions = await prisma.visitsInRASessions.create({
     *   data: {
     *     // ... data to create a VisitsInRASessions
     *   }
     * })
     * 
    **/
    create<T extends VisitsInRASessionsCreateArgs>(
      args: SelectSubset<T, VisitsInRASessionsCreateArgs>
    ): CheckSelect<T, Prisma__VisitsInRASessionsClient<VisitsInRASessions>, Prisma__VisitsInRASessionsClient<VisitsInRASessionsGetPayload<T>>>

    /**
     * Create many VisitsInRASessions.
     *     @param {VisitsInRASessionsCreateManyArgs} args - Arguments to create many VisitsInRASessions.
     *     @example
     *     // Create many VisitsInRASessions
     *     const visitsInRASessions = await prisma.visitsInRASessions.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends VisitsInRASessionsCreateManyArgs>(
      args?: SelectSubset<T, VisitsInRASessionsCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a VisitsInRASessions.
     * @param {VisitsInRASessionsDeleteArgs} args - Arguments to delete one VisitsInRASessions.
     * @example
     * // Delete one VisitsInRASessions
     * const VisitsInRASessions = await prisma.visitsInRASessions.delete({
     *   where: {
     *     // ... filter to delete one VisitsInRASessions
     *   }
     * })
     * 
    **/
    delete<T extends VisitsInRASessionsDeleteArgs>(
      args: SelectSubset<T, VisitsInRASessionsDeleteArgs>
    ): CheckSelect<T, Prisma__VisitsInRASessionsClient<VisitsInRASessions>, Prisma__VisitsInRASessionsClient<VisitsInRASessionsGetPayload<T>>>

    /**
     * Update one VisitsInRASessions.
     * @param {VisitsInRASessionsUpdateArgs} args - Arguments to update one VisitsInRASessions.
     * @example
     * // Update one VisitsInRASessions
     * const visitsInRASessions = await prisma.visitsInRASessions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends VisitsInRASessionsUpdateArgs>(
      args: SelectSubset<T, VisitsInRASessionsUpdateArgs>
    ): CheckSelect<T, Prisma__VisitsInRASessionsClient<VisitsInRASessions>, Prisma__VisitsInRASessionsClient<VisitsInRASessionsGetPayload<T>>>

    /**
     * Delete zero or more VisitsInRASessions.
     * @param {VisitsInRASessionsDeleteManyArgs} args - Arguments to filter VisitsInRASessions to delete.
     * @example
     * // Delete a few VisitsInRASessions
     * const { count } = await prisma.visitsInRASessions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends VisitsInRASessionsDeleteManyArgs>(
      args?: SelectSubset<T, VisitsInRASessionsDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more VisitsInRASessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitsInRASessionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VisitsInRASessions
     * const visitsInRASessions = await prisma.visitsInRASessions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends VisitsInRASessionsUpdateManyArgs>(
      args: SelectSubset<T, VisitsInRASessionsUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one VisitsInRASessions.
     * @param {VisitsInRASessionsUpsertArgs} args - Arguments to update or create a VisitsInRASessions.
     * @example
     * // Update or create a VisitsInRASessions
     * const visitsInRASessions = await prisma.visitsInRASessions.upsert({
     *   create: {
     *     // ... data to create a VisitsInRASessions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VisitsInRASessions we want to update
     *   }
     * })
    **/
    upsert<T extends VisitsInRASessionsUpsertArgs>(
      args: SelectSubset<T, VisitsInRASessionsUpsertArgs>
    ): CheckSelect<T, Prisma__VisitsInRASessionsClient<VisitsInRASessions>, Prisma__VisitsInRASessionsClient<VisitsInRASessionsGetPayload<T>>>

    /**
     * Find one VisitsInRASessions that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {VisitsInRASessionsFindUniqueOrThrowArgs} args - Arguments to find a VisitsInRASessions
     * @example
     * // Get one VisitsInRASessions
     * const visitsInRASessions = await prisma.visitsInRASessions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends VisitsInRASessionsFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, VisitsInRASessionsFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__VisitsInRASessionsClient<VisitsInRASessions>, Prisma__VisitsInRASessionsClient<VisitsInRASessionsGetPayload<T>>>

    /**
     * Find the first VisitsInRASessions that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitsInRASessionsFindFirstOrThrowArgs} args - Arguments to find a VisitsInRASessions
     * @example
     * // Get one VisitsInRASessions
     * const visitsInRASessions = await prisma.visitsInRASessions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends VisitsInRASessionsFindFirstOrThrowArgs>(
      args?: SelectSubset<T, VisitsInRASessionsFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__VisitsInRASessionsClient<VisitsInRASessions>, Prisma__VisitsInRASessionsClient<VisitsInRASessionsGetPayload<T>>>

    /**
     * Count the number of VisitsInRASessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitsInRASessionsCountArgs} args - Arguments to filter VisitsInRASessions to count.
     * @example
     * // Count the number of VisitsInRASessions
     * const count = await prisma.visitsInRASessions.count({
     *   where: {
     *     // ... the filter for the VisitsInRASessions we want to count
     *   }
     * })
    **/
    count<T extends VisitsInRASessionsCountArgs>(
      args?: Subset<T, VisitsInRASessionsCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VisitsInRASessionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VisitsInRASessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitsInRASessionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VisitsInRASessionsAggregateArgs>(args: Subset<T, VisitsInRASessionsAggregateArgs>): PrismaPromise<GetVisitsInRASessionsAggregateType<T>>

    /**
     * Group by VisitsInRASessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitsInRASessionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VisitsInRASessionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VisitsInRASessionsGroupByArgs['orderBy'] }
        : { orderBy?: VisitsInRASessionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VisitsInRASessionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVisitsInRASessionsGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for VisitsInRASessions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__VisitsInRASessionsClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    RASession<T extends RASessionArgs = {}>(args?: Subset<T, RASessionArgs>): CheckSelect<T, Prisma__RASessionClient<RASession | Null>, Prisma__RASessionClient<RASessionGetPayload<T> | Null>>;

    Visit<T extends VisitArgs = {}>(args?: Subset<T, VisitArgs>): CheckSelect<T, Prisma__VisitClient<Visit | Null>, Prisma__VisitClient<VisitGetPayload<T> | Null>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * VisitsInRASessions base type for findUnique actions
   */
  export type VisitsInRASessionsFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the VisitsInRASessions
     * 
    **/
    select?: VisitsInRASessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VisitsInRASessionsInclude | null
    /**
     * Filter, which VisitsInRASessions to fetch.
     * 
    **/
    where: VisitsInRASessionsWhereUniqueInput
  }

  /**
   * VisitsInRASessions: findUnique
   */
  export interface VisitsInRASessionsFindUniqueArgs extends VisitsInRASessionsFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * VisitsInRASessions base type for findFirst actions
   */
  export type VisitsInRASessionsFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the VisitsInRASessions
     * 
    **/
    select?: VisitsInRASessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VisitsInRASessionsInclude | null
    /**
     * Filter, which VisitsInRASessions to fetch.
     * 
    **/
    where?: VisitsInRASessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VisitsInRASessions to fetch.
     * 
    **/
    orderBy?: Enumerable<VisitsInRASessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VisitsInRASessions.
     * 
    **/
    cursor?: VisitsInRASessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VisitsInRASessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VisitsInRASessions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VisitsInRASessions.
     * 
    **/
    distinct?: Enumerable<VisitsInRASessionsScalarFieldEnum>
  }

  /**
   * VisitsInRASessions: findFirst
   */
  export interface VisitsInRASessionsFindFirstArgs extends VisitsInRASessionsFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * VisitsInRASessions findMany
   */
  export type VisitsInRASessionsFindManyArgs = {
    /**
     * Select specific fields to fetch from the VisitsInRASessions
     * 
    **/
    select?: VisitsInRASessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VisitsInRASessionsInclude | null
    /**
     * Filter, which VisitsInRASessions to fetch.
     * 
    **/
    where?: VisitsInRASessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VisitsInRASessions to fetch.
     * 
    **/
    orderBy?: Enumerable<VisitsInRASessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VisitsInRASessions.
     * 
    **/
    cursor?: VisitsInRASessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VisitsInRASessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VisitsInRASessions.
     * 
    **/
    skip?: number
    distinct?: Enumerable<VisitsInRASessionsScalarFieldEnum>
  }


  /**
   * VisitsInRASessions create
   */
  export type VisitsInRASessionsCreateArgs = {
    /**
     * Select specific fields to fetch from the VisitsInRASessions
     * 
    **/
    select?: VisitsInRASessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VisitsInRASessionsInclude | null
    /**
     * The data needed to create a VisitsInRASessions.
     * 
    **/
    data: XOR<VisitsInRASessionsCreateInput, VisitsInRASessionsUncheckedCreateInput>
  }


  /**
   * VisitsInRASessions createMany
   */
  export type VisitsInRASessionsCreateManyArgs = {
    /**
     * The data used to create many VisitsInRASessions.
     * 
    **/
    data: Enumerable<VisitsInRASessionsCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * VisitsInRASessions update
   */
  export type VisitsInRASessionsUpdateArgs = {
    /**
     * Select specific fields to fetch from the VisitsInRASessions
     * 
    **/
    select?: VisitsInRASessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VisitsInRASessionsInclude | null
    /**
     * The data needed to update a VisitsInRASessions.
     * 
    **/
    data: XOR<VisitsInRASessionsUpdateInput, VisitsInRASessionsUncheckedUpdateInput>
    /**
     * Choose, which VisitsInRASessions to update.
     * 
    **/
    where: VisitsInRASessionsWhereUniqueInput
  }


  /**
   * VisitsInRASessions updateMany
   */
  export type VisitsInRASessionsUpdateManyArgs = {
    /**
     * The data used to update VisitsInRASessions.
     * 
    **/
    data: XOR<VisitsInRASessionsUpdateManyMutationInput, VisitsInRASessionsUncheckedUpdateManyInput>
    /**
     * Filter which VisitsInRASessions to update
     * 
    **/
    where?: VisitsInRASessionsWhereInput
  }


  /**
   * VisitsInRASessions upsert
   */
  export type VisitsInRASessionsUpsertArgs = {
    /**
     * Select specific fields to fetch from the VisitsInRASessions
     * 
    **/
    select?: VisitsInRASessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VisitsInRASessionsInclude | null
    /**
     * The filter to search for the VisitsInRASessions to update in case it exists.
     * 
    **/
    where: VisitsInRASessionsWhereUniqueInput
    /**
     * In case the VisitsInRASessions found by the `where` argument doesn't exist, create a new VisitsInRASessions with this data.
     * 
    **/
    create: XOR<VisitsInRASessionsCreateInput, VisitsInRASessionsUncheckedCreateInput>
    /**
     * In case the VisitsInRASessions was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<VisitsInRASessionsUpdateInput, VisitsInRASessionsUncheckedUpdateInput>
  }


  /**
   * VisitsInRASessions delete
   */
  export type VisitsInRASessionsDeleteArgs = {
    /**
     * Select specific fields to fetch from the VisitsInRASessions
     * 
    **/
    select?: VisitsInRASessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VisitsInRASessionsInclude | null
    /**
     * Filter which VisitsInRASessions to delete.
     * 
    **/
    where: VisitsInRASessionsWhereUniqueInput
  }


  /**
   * VisitsInRASessions deleteMany
   */
  export type VisitsInRASessionsDeleteManyArgs = {
    /**
     * Filter which VisitsInRASessions to delete
     * 
    **/
    where?: VisitsInRASessionsWhereInput
  }


  /**
   * VisitsInRASessions: findUniqueOrThrow
   */
  export type VisitsInRASessionsFindUniqueOrThrowArgs = VisitsInRASessionsFindUniqueArgsBase
      

  /**
   * VisitsInRASessions: findFirstOrThrow
   */
  export type VisitsInRASessionsFindFirstOrThrowArgs = VisitsInRASessionsFindFirstArgsBase
      

  /**
   * VisitsInRASessions without action
   */
  export type VisitsInRASessionsArgs = {
    /**
     * Select specific fields to fetch from the VisitsInRASessions
     * 
    **/
    select?: VisitsInRASessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VisitsInRASessionsInclude | null
  }



  /**
   * Enums
   */

  // Based on
  // https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

  export const CESessionScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    name: 'name',
    description: 'description',
    priority: 'priority',
    sop: 'sop',
    resultTemplate: 'resultTemplate',
    projectId: 'projectId'
  };

  export type CESessionScalarFieldEnum = (typeof CESessionScalarFieldEnum)[keyof typeof CESessionScalarFieldEnum]


  export const DLSessionScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    name: 'name',
    description: 'description',
    priority: 'priority',
    sop: 'sop',
    projectId: 'projectId'
  };

  export type DLSessionScalarFieldEnum = (typeof DLSessionScalarFieldEnum)[keyof typeof DLSessionScalarFieldEnum]


  export const EpicScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    name: 'name',
    description: 'description'
  };

  export type EpicScalarFieldEnum = (typeof EpicScalarFieldEnum)[keyof typeof EpicScalarFieldEnum]


  export const ExtractedResourceScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    metadata: 'metadata',
    rawResourceId: 'rawResourceId'
  };

  export type ExtractedResourceScalarFieldEnum = (typeof ExtractedResourceScalarFieldEnum)[keyof typeof ExtractedResourceScalarFieldEnum]


  export const ExtractedResourcesInCESessionsScalarFieldEnum: {
    extractedResourceId: 'extractedResourceId',
    cESessionId: 'cESessionId',
    index: 'index',
    status: 'status',
    result: 'result'
  };

  export type ExtractedResourcesInCESessionsScalarFieldEnum = (typeof ExtractedResourcesInCESessionsScalarFieldEnum)[keyof typeof ExtractedResourcesInCESessionsScalarFieldEnum]


  export const ExtractedResourcesInDLSessionsScalarFieldEnum: {
    extractedResourceId: 'extractedResourceId',
    dLSessionId: 'dLSessionId',
    status: 'status'
  };

  export type ExtractedResourcesInDLSessionsScalarFieldEnum = (typeof ExtractedResourcesInDLSessionsScalarFieldEnum)[keyof typeof ExtractedResourcesInDLSessionsScalarFieldEnum]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const LabelScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    name: 'name',
    abbreviation: 'abbreviation'
  };

  export type LabelScalarFieldEnum = (typeof LabelScalarFieldEnum)[keyof typeof LabelScalarFieldEnum]


  export const LabelsInDLSessionsScalarFieldEnum: {
    labelId: 'labelId',
    dLSessionId: 'dLSessionId'
  };

  export type LabelsInDLSessionsScalarFieldEnum = (typeof LabelsInDLSessionsScalarFieldEnum)[keyof typeof LabelsInDLSessionsScalarFieldEnum]


  export const LabelsInExtractedResourcesInDLSessionsScalarFieldEnum: {
    labelId: 'labelId',
    extractedResourceId: 'extractedResourceId',
    dLSessionId: 'dLSessionId'
  };

  export type LabelsInExtractedResourcesInDLSessionsScalarFieldEnum = (typeof LabelsInExtractedResourcesInDLSessionsScalarFieldEnum)[keyof typeof LabelsInExtractedResourcesInDLSessionsScalarFieldEnum]


  export const PatientScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PatientScalarFieldEnum = (typeof PatientScalarFieldEnum)[keyof typeof PatientScalarFieldEnum]


  export const ProjectScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    name: 'name',
    description: 'description',
    epicId: 'epicId'
  };

  export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const RASessionScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    name: 'name',
    description: 'description',
    priority: 'priority',
    sop: 'sop',
    template: 'template',
    projectId: 'projectId'
  };

  export type RASessionScalarFieldEnum = (typeof RASessionScalarFieldEnum)[keyof typeof RASessionScalarFieldEnum]


  export const RawResourceScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    metadata: 'metadata',
    machine: 'machine',
    center: 'center',
    visitId: 'visitId'
  };

  export type RawResourceScalarFieldEnum = (typeof RawResourceScalarFieldEnum)[keyof typeof RawResourceScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UsersInCESessionsScalarFieldEnum: {
    userId: 'userId',
    cESessionId: 'cESessionId',
    userRole: 'userRole'
  };

  export type UsersInCESessionsScalarFieldEnum = (typeof UsersInCESessionsScalarFieldEnum)[keyof typeof UsersInCESessionsScalarFieldEnum]


  export const UsersInDLSessionsScalarFieldEnum: {
    userId: 'userId',
    dLSessionId: 'dLSessionId',
    userRole: 'userRole'
  };

  export type UsersInDLSessionsScalarFieldEnum = (typeof UsersInDLSessionsScalarFieldEnum)[keyof typeof UsersInDLSessionsScalarFieldEnum]


  export const UsersInProjectsScalarFieldEnum: {
    userId: 'userId',
    projectId: 'projectId',
    userRole: 'userRole'
  };

  export type UsersInProjectsScalarFieldEnum = (typeof UsersInProjectsScalarFieldEnum)[keyof typeof UsersInProjectsScalarFieldEnum]


  export const UsersInRASessionsScalarFieldEnum: {
    userId: 'userId',
    rASessionId: 'rASessionId',
    userRole: 'userRole'
  };

  export type UsersInRASessionsScalarFieldEnum = (typeof UsersInRASessionsScalarFieldEnum)[keyof typeof UsersInRASessionsScalarFieldEnum]


  export const VisitScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    patientId: 'patientId'
  };

  export type VisitScalarFieldEnum = (typeof VisitScalarFieldEnum)[keyof typeof VisitScalarFieldEnum]


  export const VisitsInRASessionsScalarFieldEnum: {
    visitId: 'visitId',
    rASessionId: 'rASessionId',
    index: 'index',
    content: 'content',
    status: 'status',
    result: 'result'
  };

  export type VisitsInRASessionsScalarFieldEnum = (typeof VisitsInRASessionsScalarFieldEnum)[keyof typeof VisitsInRASessionsScalarFieldEnum]


  /**
   * Deep Input Types
   */


  export type CESessionWhereInput = {
    AND?: Enumerable<CESessionWhereInput>
    OR?: Enumerable<CESessionWhereInput>
    NOT?: Enumerable<CESessionWhereInput>
    id?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    name?: StringFilter | string
    description?: StringFilter | string
    priority?: IntFilter | number
    sop?: StringNullableListFilter
    resultTemplate?: JsonFilter
    projectId?: StringFilter | string
    Project?: XOR<ProjectRelationFilter, ProjectWhereInput>
    ExtractedResourcesInCESessions?: ExtractedResourcesInCESessionsListRelationFilter
    UsersInCESessions?: UsersInCESessionsListRelationFilter
  }

  export type CESessionOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
    priority?: SortOrder
    sop?: SortOrder
    resultTemplate?: SortOrder
    projectId?: SortOrder
    Project?: ProjectOrderByWithRelationInput
    ExtractedResourcesInCESessions?: ExtractedResourcesInCESessionsOrderByRelationAggregateInput
    UsersInCESessions?: UsersInCESessionsOrderByRelationAggregateInput
  }

  export type CESessionWhereUniqueInput = {
    id?: string
  }

  export type CESessionOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
    priority?: SortOrder
    sop?: SortOrder
    resultTemplate?: SortOrder
    projectId?: SortOrder
    _count?: CESessionCountOrderByAggregateInput
    _avg?: CESessionAvgOrderByAggregateInput
    _max?: CESessionMaxOrderByAggregateInput
    _min?: CESessionMinOrderByAggregateInput
    _sum?: CESessionSumOrderByAggregateInput
  }

  export type CESessionScalarWhereWithAggregatesInput = {
    AND?: Enumerable<CESessionScalarWhereWithAggregatesInput>
    OR?: Enumerable<CESessionScalarWhereWithAggregatesInput>
    NOT?: Enumerable<CESessionScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
    name?: StringWithAggregatesFilter | string
    description?: StringWithAggregatesFilter | string
    priority?: IntWithAggregatesFilter | number
    sop?: StringNullableListFilter
    resultTemplate?: JsonWithAggregatesFilter
    projectId?: StringWithAggregatesFilter | string
  }

  export type DLSessionWhereInput = {
    AND?: Enumerable<DLSessionWhereInput>
    OR?: Enumerable<DLSessionWhereInput>
    NOT?: Enumerable<DLSessionWhereInput>
    id?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    name?: StringFilter | string
    description?: StringFilter | string
    priority?: IntFilter | number
    sop?: StringNullableListFilter
    projectId?: StringFilter | string
    Project?: XOR<ProjectRelationFilter, ProjectWhereInput>
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsListRelationFilter
    LabelsInDLSessions?: LabelsInDLSessionsListRelationFilter
    UsersInDLSessions?: UsersInDLSessionsListRelationFilter
  }

  export type DLSessionOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
    priority?: SortOrder
    sop?: SortOrder
    projectId?: SortOrder
    Project?: ProjectOrderByWithRelationInput
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsOrderByRelationAggregateInput
    LabelsInDLSessions?: LabelsInDLSessionsOrderByRelationAggregateInput
    UsersInDLSessions?: UsersInDLSessionsOrderByRelationAggregateInput
  }

  export type DLSessionWhereUniqueInput = {
    id?: string
  }

  export type DLSessionOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
    priority?: SortOrder
    sop?: SortOrder
    projectId?: SortOrder
    _count?: DLSessionCountOrderByAggregateInput
    _avg?: DLSessionAvgOrderByAggregateInput
    _max?: DLSessionMaxOrderByAggregateInput
    _min?: DLSessionMinOrderByAggregateInput
    _sum?: DLSessionSumOrderByAggregateInput
  }

  export type DLSessionScalarWhereWithAggregatesInput = {
    AND?: Enumerable<DLSessionScalarWhereWithAggregatesInput>
    OR?: Enumerable<DLSessionScalarWhereWithAggregatesInput>
    NOT?: Enumerable<DLSessionScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
    name?: StringWithAggregatesFilter | string
    description?: StringWithAggregatesFilter | string
    priority?: IntWithAggregatesFilter | number
    sop?: StringNullableListFilter
    projectId?: StringWithAggregatesFilter | string
  }

  export type EpicWhereInput = {
    AND?: Enumerable<EpicWhereInput>
    OR?: Enumerable<EpicWhereInput>
    NOT?: Enumerable<EpicWhereInput>
    id?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    name?: StringFilter | string
    description?: StringFilter | string
    Project?: ProjectListRelationFilter
  }

  export type EpicOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
    Project?: ProjectOrderByRelationAggregateInput
  }

  export type EpicWhereUniqueInput = {
    id?: string
    name?: string
  }

  export type EpicOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
    _count?: EpicCountOrderByAggregateInput
    _max?: EpicMaxOrderByAggregateInput
    _min?: EpicMinOrderByAggregateInput
  }

  export type EpicScalarWhereWithAggregatesInput = {
    AND?: Enumerable<EpicScalarWhereWithAggregatesInput>
    OR?: Enumerable<EpicScalarWhereWithAggregatesInput>
    NOT?: Enumerable<EpicScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
    name?: StringWithAggregatesFilter | string
    description?: StringWithAggregatesFilter | string
  }

  export type ExtractedResourceWhereInput = {
    AND?: Enumerable<ExtractedResourceWhereInput>
    OR?: Enumerable<ExtractedResourceWhereInput>
    NOT?: Enumerable<ExtractedResourceWhereInput>
    id?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    metadata?: JsonFilter
    rawResourceId?: StringFilter | string
    RawResource?: XOR<RawResourceRelationFilter, RawResourceWhereInput>
    ExtractedResourcesInCESessions?: ExtractedResourcesInCESessionsListRelationFilter
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsListRelationFilter
  }

  export type ExtractedResourceOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    metadata?: SortOrder
    rawResourceId?: SortOrder
    RawResource?: RawResourceOrderByWithRelationInput
    ExtractedResourcesInCESessions?: ExtractedResourcesInCESessionsOrderByRelationAggregateInput
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsOrderByRelationAggregateInput
  }

  export type ExtractedResourceWhereUniqueInput = {
    id?: string
  }

  export type ExtractedResourceOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    metadata?: SortOrder
    rawResourceId?: SortOrder
    _count?: ExtractedResourceCountOrderByAggregateInput
    _max?: ExtractedResourceMaxOrderByAggregateInput
    _min?: ExtractedResourceMinOrderByAggregateInput
  }

  export type ExtractedResourceScalarWhereWithAggregatesInput = {
    AND?: Enumerable<ExtractedResourceScalarWhereWithAggregatesInput>
    OR?: Enumerable<ExtractedResourceScalarWhereWithAggregatesInput>
    NOT?: Enumerable<ExtractedResourceScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
    metadata?: JsonWithAggregatesFilter
    rawResourceId?: StringWithAggregatesFilter | string
  }

  export type ExtractedResourcesInCESessionsWhereInput = {
    AND?: Enumerable<ExtractedResourcesInCESessionsWhereInput>
    OR?: Enumerable<ExtractedResourcesInCESessionsWhereInput>
    NOT?: Enumerable<ExtractedResourcesInCESessionsWhereInput>
    extractedResourceId?: StringFilter | string
    cESessionId?: StringFilter | string
    index?: IntFilter | number
    status?: EnumExtractedResourceStatusFilter | ExtractedResourceStatus
    result?: JsonFilter
    CESession?: XOR<CESessionRelationFilter, CESessionWhereInput>
    ExtractedResource?: XOR<ExtractedResourceRelationFilter, ExtractedResourceWhereInput>
  }

  export type ExtractedResourcesInCESessionsOrderByWithRelationInput = {
    extractedResourceId?: SortOrder
    cESessionId?: SortOrder
    index?: SortOrder
    status?: SortOrder
    result?: SortOrder
    CESession?: CESessionOrderByWithRelationInput
    ExtractedResource?: ExtractedResourceOrderByWithRelationInput
  }

  export type ExtractedResourcesInCESessionsWhereUniqueInput = {
    cESessionId_index?: ExtractedResourcesInCESessionsCESessionIdIndexCompoundUniqueInput
    extractedResourceId_cESessionId?: ExtractedResourcesInCESessionsExtractedResourceIdCESessionIdCompoundUniqueInput
  }

  export type ExtractedResourcesInCESessionsOrderByWithAggregationInput = {
    extractedResourceId?: SortOrder
    cESessionId?: SortOrder
    index?: SortOrder
    status?: SortOrder
    result?: SortOrder
    _count?: ExtractedResourcesInCESessionsCountOrderByAggregateInput
    _avg?: ExtractedResourcesInCESessionsAvgOrderByAggregateInput
    _max?: ExtractedResourcesInCESessionsMaxOrderByAggregateInput
    _min?: ExtractedResourcesInCESessionsMinOrderByAggregateInput
    _sum?: ExtractedResourcesInCESessionsSumOrderByAggregateInput
  }

  export type ExtractedResourcesInCESessionsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<ExtractedResourcesInCESessionsScalarWhereWithAggregatesInput>
    OR?: Enumerable<ExtractedResourcesInCESessionsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<ExtractedResourcesInCESessionsScalarWhereWithAggregatesInput>
    extractedResourceId?: StringWithAggregatesFilter | string
    cESessionId?: StringWithAggregatesFilter | string
    index?: IntWithAggregatesFilter | number
    status?: EnumExtractedResourceStatusWithAggregatesFilter | ExtractedResourceStatus
    result?: JsonWithAggregatesFilter
  }

  export type ExtractedResourcesInDLSessionsWhereInput = {
    AND?: Enumerable<ExtractedResourcesInDLSessionsWhereInput>
    OR?: Enumerable<ExtractedResourcesInDLSessionsWhereInput>
    NOT?: Enumerable<ExtractedResourcesInDLSessionsWhereInput>
    extractedResourceId?: StringFilter | string
    dLSessionId?: StringFilter | string
    status?: EnumExtractedResourceStatusFilter | ExtractedResourceStatus
    DLSession?: XOR<DLSessionRelationFilter, DLSessionWhereInput>
    ExtractedResource?: XOR<ExtractedResourceRelationFilter, ExtractedResourceWhereInput>
    LabelsInExtractedResourcesInDLSessions?: LabelsInExtractedResourcesInDLSessionsListRelationFilter
  }

  export type ExtractedResourcesInDLSessionsOrderByWithRelationInput = {
    extractedResourceId?: SortOrder
    dLSessionId?: SortOrder
    status?: SortOrder
    DLSession?: DLSessionOrderByWithRelationInput
    ExtractedResource?: ExtractedResourceOrderByWithRelationInput
    LabelsInExtractedResourcesInDLSessions?: LabelsInExtractedResourcesInDLSessionsOrderByRelationAggregateInput
  }

  export type ExtractedResourcesInDLSessionsWhereUniqueInput = {
    extractedResourceId_dLSessionId?: ExtractedResourcesInDLSessionsExtractedResourceIdDLSessionIdCompoundUniqueInput
  }

  export type ExtractedResourcesInDLSessionsOrderByWithAggregationInput = {
    extractedResourceId?: SortOrder
    dLSessionId?: SortOrder
    status?: SortOrder
    _count?: ExtractedResourcesInDLSessionsCountOrderByAggregateInput
    _max?: ExtractedResourcesInDLSessionsMaxOrderByAggregateInput
    _min?: ExtractedResourcesInDLSessionsMinOrderByAggregateInput
  }

  export type ExtractedResourcesInDLSessionsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<ExtractedResourcesInDLSessionsScalarWhereWithAggregatesInput>
    OR?: Enumerable<ExtractedResourcesInDLSessionsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<ExtractedResourcesInDLSessionsScalarWhereWithAggregatesInput>
    extractedResourceId?: StringWithAggregatesFilter | string
    dLSessionId?: StringWithAggregatesFilter | string
    status?: EnumExtractedResourceStatusWithAggregatesFilter | ExtractedResourceStatus
  }

  export type LabelWhereInput = {
    AND?: Enumerable<LabelWhereInput>
    OR?: Enumerable<LabelWhereInput>
    NOT?: Enumerable<LabelWhereInput>
    id?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    name?: StringFilter | string
    abbreviation?: StringFilter | string
    LabelsInDLSessions?: LabelsInDLSessionsListRelationFilter
    LabelsInExtractedResourcesInDLSessions?: LabelsInExtractedResourcesInDLSessionsListRelationFilter
  }

  export type LabelOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    abbreviation?: SortOrder
    LabelsInDLSessions?: LabelsInDLSessionsOrderByRelationAggregateInput
    LabelsInExtractedResourcesInDLSessions?: LabelsInExtractedResourcesInDLSessionsOrderByRelationAggregateInput
  }

  export type LabelWhereUniqueInput = {
    id?: string
  }

  export type LabelOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    abbreviation?: SortOrder
    _count?: LabelCountOrderByAggregateInput
    _max?: LabelMaxOrderByAggregateInput
    _min?: LabelMinOrderByAggregateInput
  }

  export type LabelScalarWhereWithAggregatesInput = {
    AND?: Enumerable<LabelScalarWhereWithAggregatesInput>
    OR?: Enumerable<LabelScalarWhereWithAggregatesInput>
    NOT?: Enumerable<LabelScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
    name?: StringWithAggregatesFilter | string
    abbreviation?: StringWithAggregatesFilter | string
  }

  export type LabelsInDLSessionsWhereInput = {
    AND?: Enumerable<LabelsInDLSessionsWhereInput>
    OR?: Enumerable<LabelsInDLSessionsWhereInput>
    NOT?: Enumerable<LabelsInDLSessionsWhereInput>
    labelId?: StringFilter | string
    dLSessionId?: StringFilter | string
    DLSession?: XOR<DLSessionRelationFilter, DLSessionWhereInput>
    Label?: XOR<LabelRelationFilter, LabelWhereInput>
  }

  export type LabelsInDLSessionsOrderByWithRelationInput = {
    labelId?: SortOrder
    dLSessionId?: SortOrder
    DLSession?: DLSessionOrderByWithRelationInput
    Label?: LabelOrderByWithRelationInput
  }

  export type LabelsInDLSessionsWhereUniqueInput = {
    labelId_dLSessionId?: LabelsInDLSessionsLabelIdDLSessionIdCompoundUniqueInput
  }

  export type LabelsInDLSessionsOrderByWithAggregationInput = {
    labelId?: SortOrder
    dLSessionId?: SortOrder
    _count?: LabelsInDLSessionsCountOrderByAggregateInput
    _max?: LabelsInDLSessionsMaxOrderByAggregateInput
    _min?: LabelsInDLSessionsMinOrderByAggregateInput
  }

  export type LabelsInDLSessionsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<LabelsInDLSessionsScalarWhereWithAggregatesInput>
    OR?: Enumerable<LabelsInDLSessionsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<LabelsInDLSessionsScalarWhereWithAggregatesInput>
    labelId?: StringWithAggregatesFilter | string
    dLSessionId?: StringWithAggregatesFilter | string
  }

  export type LabelsInExtractedResourcesInDLSessionsWhereInput = {
    AND?: Enumerable<LabelsInExtractedResourcesInDLSessionsWhereInput>
    OR?: Enumerable<LabelsInExtractedResourcesInDLSessionsWhereInput>
    NOT?: Enumerable<LabelsInExtractedResourcesInDLSessionsWhereInput>
    labelId?: StringFilter | string
    extractedResourceId?: StringFilter | string
    dLSessionId?: StringFilter | string
    ExtractedResourcesInDLSessions?: XOR<ExtractedResourcesInDLSessionsRelationFilter, ExtractedResourcesInDLSessionsWhereInput>
    Label?: XOR<LabelRelationFilter, LabelWhereInput>
  }

  export type LabelsInExtractedResourcesInDLSessionsOrderByWithRelationInput = {
    labelId?: SortOrder
    extractedResourceId?: SortOrder
    dLSessionId?: SortOrder
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsOrderByWithRelationInput
    Label?: LabelOrderByWithRelationInput
  }

  export type LabelsInExtractedResourcesInDLSessionsWhereUniqueInput = {
    labelId_extractedResourceId_dLSessionId?: LabelsInExtractedResourcesInDLSessionsLabelIdExtractedResourceIdDLSessionIdCompoundUniqueInput
  }

  export type LabelsInExtractedResourcesInDLSessionsOrderByWithAggregationInput = {
    labelId?: SortOrder
    extractedResourceId?: SortOrder
    dLSessionId?: SortOrder
    _count?: LabelsInExtractedResourcesInDLSessionsCountOrderByAggregateInput
    _max?: LabelsInExtractedResourcesInDLSessionsMaxOrderByAggregateInput
    _min?: LabelsInExtractedResourcesInDLSessionsMinOrderByAggregateInput
  }

  export type LabelsInExtractedResourcesInDLSessionsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<LabelsInExtractedResourcesInDLSessionsScalarWhereWithAggregatesInput>
    OR?: Enumerable<LabelsInExtractedResourcesInDLSessionsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<LabelsInExtractedResourcesInDLSessionsScalarWhereWithAggregatesInput>
    labelId?: StringWithAggregatesFilter | string
    extractedResourceId?: StringWithAggregatesFilter | string
    dLSessionId?: StringWithAggregatesFilter | string
  }

  export type PatientWhereInput = {
    AND?: Enumerable<PatientWhereInput>
    OR?: Enumerable<PatientWhereInput>
    NOT?: Enumerable<PatientWhereInput>
    id?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    Visit?: VisitListRelationFilter
  }

  export type PatientOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    Visit?: VisitOrderByRelationAggregateInput
  }

  export type PatientWhereUniqueInput = {
    id?: string
  }

  export type PatientOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PatientCountOrderByAggregateInput
    _max?: PatientMaxOrderByAggregateInput
    _min?: PatientMinOrderByAggregateInput
  }

  export type PatientScalarWhereWithAggregatesInput = {
    AND?: Enumerable<PatientScalarWhereWithAggregatesInput>
    OR?: Enumerable<PatientScalarWhereWithAggregatesInput>
    NOT?: Enumerable<PatientScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type ProjectWhereInput = {
    AND?: Enumerable<ProjectWhereInput>
    OR?: Enumerable<ProjectWhereInput>
    NOT?: Enumerable<ProjectWhereInput>
    id?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    name?: StringFilter | string
    description?: StringFilter | string
    epicId?: StringFilter | string
    Epic?: XOR<EpicRelationFilter, EpicWhereInput>
    CESession?: CESessionListRelationFilter
    DLSession?: DLSessionListRelationFilter
    RASession?: RASessionListRelationFilter
    UsersInProjects?: UsersInProjectsListRelationFilter
  }

  export type ProjectOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
    epicId?: SortOrder
    Epic?: EpicOrderByWithRelationInput
    CESession?: CESessionOrderByRelationAggregateInput
    DLSession?: DLSessionOrderByRelationAggregateInput
    RASession?: RASessionOrderByRelationAggregateInput
    UsersInProjects?: UsersInProjectsOrderByRelationAggregateInput
  }

  export type ProjectWhereUniqueInput = {
    id?: string
    name?: string
  }

  export type ProjectOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
    epicId?: SortOrder
    _count?: ProjectCountOrderByAggregateInput
    _max?: ProjectMaxOrderByAggregateInput
    _min?: ProjectMinOrderByAggregateInput
  }

  export type ProjectScalarWhereWithAggregatesInput = {
    AND?: Enumerable<ProjectScalarWhereWithAggregatesInput>
    OR?: Enumerable<ProjectScalarWhereWithAggregatesInput>
    NOT?: Enumerable<ProjectScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
    name?: StringWithAggregatesFilter | string
    description?: StringWithAggregatesFilter | string
    epicId?: StringWithAggregatesFilter | string
  }

  export type RASessionWhereInput = {
    AND?: Enumerable<RASessionWhereInput>
    OR?: Enumerable<RASessionWhereInput>
    NOT?: Enumerable<RASessionWhereInput>
    id?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    name?: StringFilter | string
    description?: StringFilter | string
    priority?: IntFilter | number
    sop?: StringNullableListFilter
    template?: JsonFilter
    projectId?: StringFilter | string
    Project?: XOR<ProjectRelationFilter, ProjectWhereInput>
    UsersInRASessions?: UsersInRASessionsListRelationFilter
    VisitsInRASessions?: VisitsInRASessionsListRelationFilter
  }

  export type RASessionOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
    priority?: SortOrder
    sop?: SortOrder
    template?: SortOrder
    projectId?: SortOrder
    Project?: ProjectOrderByWithRelationInput
    UsersInRASessions?: UsersInRASessionsOrderByRelationAggregateInput
    VisitsInRASessions?: VisitsInRASessionsOrderByRelationAggregateInput
  }

  export type RASessionWhereUniqueInput = {
    id?: string
  }

  export type RASessionOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
    priority?: SortOrder
    sop?: SortOrder
    template?: SortOrder
    projectId?: SortOrder
    _count?: RASessionCountOrderByAggregateInput
    _avg?: RASessionAvgOrderByAggregateInput
    _max?: RASessionMaxOrderByAggregateInput
    _min?: RASessionMinOrderByAggregateInput
    _sum?: RASessionSumOrderByAggregateInput
  }

  export type RASessionScalarWhereWithAggregatesInput = {
    AND?: Enumerable<RASessionScalarWhereWithAggregatesInput>
    OR?: Enumerable<RASessionScalarWhereWithAggregatesInput>
    NOT?: Enumerable<RASessionScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
    name?: StringWithAggregatesFilter | string
    description?: StringWithAggregatesFilter | string
    priority?: IntWithAggregatesFilter | number
    sop?: StringNullableListFilter
    template?: JsonWithAggregatesFilter
    projectId?: StringWithAggregatesFilter | string
  }

  export type RawResourceWhereInput = {
    AND?: Enumerable<RawResourceWhereInput>
    OR?: Enumerable<RawResourceWhereInput>
    NOT?: Enumerable<RawResourceWhereInput>
    id?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    metadata?: JsonFilter
    machine?: StringFilter | string
    center?: StringFilter | string
    visitId?: StringFilter | string
    Visit?: XOR<VisitRelationFilter, VisitWhereInput>
    ExtractedResource?: ExtractedResourceListRelationFilter
  }

  export type RawResourceOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    metadata?: SortOrder
    machine?: SortOrder
    center?: SortOrder
    visitId?: SortOrder
    Visit?: VisitOrderByWithRelationInput
    ExtractedResource?: ExtractedResourceOrderByRelationAggregateInput
  }

  export type RawResourceWhereUniqueInput = {
    id?: string
  }

  export type RawResourceOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    metadata?: SortOrder
    machine?: SortOrder
    center?: SortOrder
    visitId?: SortOrder
    _count?: RawResourceCountOrderByAggregateInput
    _max?: RawResourceMaxOrderByAggregateInput
    _min?: RawResourceMinOrderByAggregateInput
  }

  export type RawResourceScalarWhereWithAggregatesInput = {
    AND?: Enumerable<RawResourceScalarWhereWithAggregatesInput>
    OR?: Enumerable<RawResourceScalarWhereWithAggregatesInput>
    NOT?: Enumerable<RawResourceScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
    metadata?: JsonWithAggregatesFilter
    machine?: StringWithAggregatesFilter | string
    center?: StringWithAggregatesFilter | string
    visitId?: StringWithAggregatesFilter | string
  }

  export type UsersInCESessionsWhereInput = {
    AND?: Enumerable<UsersInCESessionsWhereInput>
    OR?: Enumerable<UsersInCESessionsWhereInput>
    NOT?: Enumerable<UsersInCESessionsWhereInput>
    userId?: StringFilter | string
    cESessionId?: StringFilter | string
    userRole?: EnumSessionUserRoleFilter | SessionUserRole
    CESession?: XOR<CESessionRelationFilter, CESessionWhereInput>
  }

  export type UsersInCESessionsOrderByWithRelationInput = {
    userId?: SortOrder
    cESessionId?: SortOrder
    userRole?: SortOrder
    CESession?: CESessionOrderByWithRelationInput
  }

  export type UsersInCESessionsWhereUniqueInput = {
    userId_cESessionId_userRole?: UsersInCESessionsUserIdCESessionIdUserRoleCompoundUniqueInput
  }

  export type UsersInCESessionsOrderByWithAggregationInput = {
    userId?: SortOrder
    cESessionId?: SortOrder
    userRole?: SortOrder
    _count?: UsersInCESessionsCountOrderByAggregateInput
    _max?: UsersInCESessionsMaxOrderByAggregateInput
    _min?: UsersInCESessionsMinOrderByAggregateInput
  }

  export type UsersInCESessionsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<UsersInCESessionsScalarWhereWithAggregatesInput>
    OR?: Enumerable<UsersInCESessionsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<UsersInCESessionsScalarWhereWithAggregatesInput>
    userId?: StringWithAggregatesFilter | string
    cESessionId?: StringWithAggregatesFilter | string
    userRole?: EnumSessionUserRoleWithAggregatesFilter | SessionUserRole
  }

  export type UsersInDLSessionsWhereInput = {
    AND?: Enumerable<UsersInDLSessionsWhereInput>
    OR?: Enumerable<UsersInDLSessionsWhereInput>
    NOT?: Enumerable<UsersInDLSessionsWhereInput>
    userId?: StringFilter | string
    dLSessionId?: StringFilter | string
    userRole?: EnumSessionUserRoleFilter | SessionUserRole
    DLSession?: XOR<DLSessionRelationFilter, DLSessionWhereInput>
  }

  export type UsersInDLSessionsOrderByWithRelationInput = {
    userId?: SortOrder
    dLSessionId?: SortOrder
    userRole?: SortOrder
    DLSession?: DLSessionOrderByWithRelationInput
  }

  export type UsersInDLSessionsWhereUniqueInput = {
    userId_dLSessionId_userRole?: UsersInDLSessionsUserIdDLSessionIdUserRoleCompoundUniqueInput
  }

  export type UsersInDLSessionsOrderByWithAggregationInput = {
    userId?: SortOrder
    dLSessionId?: SortOrder
    userRole?: SortOrder
    _count?: UsersInDLSessionsCountOrderByAggregateInput
    _max?: UsersInDLSessionsMaxOrderByAggregateInput
    _min?: UsersInDLSessionsMinOrderByAggregateInput
  }

  export type UsersInDLSessionsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<UsersInDLSessionsScalarWhereWithAggregatesInput>
    OR?: Enumerable<UsersInDLSessionsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<UsersInDLSessionsScalarWhereWithAggregatesInput>
    userId?: StringWithAggregatesFilter | string
    dLSessionId?: StringWithAggregatesFilter | string
    userRole?: EnumSessionUserRoleWithAggregatesFilter | SessionUserRole
  }

  export type UsersInProjectsWhereInput = {
    AND?: Enumerable<UsersInProjectsWhereInput>
    OR?: Enumerable<UsersInProjectsWhereInput>
    NOT?: Enumerable<UsersInProjectsWhereInput>
    userId?: StringFilter | string
    projectId?: StringFilter | string
    userRole?: EnumProjectUserRoleFilter | ProjectUserRole
    Project?: XOR<ProjectRelationFilter, ProjectWhereInput>
  }

  export type UsersInProjectsOrderByWithRelationInput = {
    userId?: SortOrder
    projectId?: SortOrder
    userRole?: SortOrder
    Project?: ProjectOrderByWithRelationInput
  }

  export type UsersInProjectsWhereUniqueInput = {
    userId_projectId_userRole?: UsersInProjectsUserIdProjectIdUserRoleCompoundUniqueInput
  }

  export type UsersInProjectsOrderByWithAggregationInput = {
    userId?: SortOrder
    projectId?: SortOrder
    userRole?: SortOrder
    _count?: UsersInProjectsCountOrderByAggregateInput
    _max?: UsersInProjectsMaxOrderByAggregateInput
    _min?: UsersInProjectsMinOrderByAggregateInput
  }

  export type UsersInProjectsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<UsersInProjectsScalarWhereWithAggregatesInput>
    OR?: Enumerable<UsersInProjectsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<UsersInProjectsScalarWhereWithAggregatesInput>
    userId?: StringWithAggregatesFilter | string
    projectId?: StringWithAggregatesFilter | string
    userRole?: EnumProjectUserRoleWithAggregatesFilter | ProjectUserRole
  }

  export type UsersInRASessionsWhereInput = {
    AND?: Enumerable<UsersInRASessionsWhereInput>
    OR?: Enumerable<UsersInRASessionsWhereInput>
    NOT?: Enumerable<UsersInRASessionsWhereInput>
    userId?: StringFilter | string
    rASessionId?: StringFilter | string
    userRole?: EnumSessionUserRoleFilter | SessionUserRole
    RASession?: XOR<RASessionRelationFilter, RASessionWhereInput>
  }

  export type UsersInRASessionsOrderByWithRelationInput = {
    userId?: SortOrder
    rASessionId?: SortOrder
    userRole?: SortOrder
    RASession?: RASessionOrderByWithRelationInput
  }

  export type UsersInRASessionsWhereUniqueInput = {
    userId_rASessionId_userRole?: UsersInRASessionsUserIdRASessionIdUserRoleCompoundUniqueInput
  }

  export type UsersInRASessionsOrderByWithAggregationInput = {
    userId?: SortOrder
    rASessionId?: SortOrder
    userRole?: SortOrder
    _count?: UsersInRASessionsCountOrderByAggregateInput
    _max?: UsersInRASessionsMaxOrderByAggregateInput
    _min?: UsersInRASessionsMinOrderByAggregateInput
  }

  export type UsersInRASessionsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<UsersInRASessionsScalarWhereWithAggregatesInput>
    OR?: Enumerable<UsersInRASessionsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<UsersInRASessionsScalarWhereWithAggregatesInput>
    userId?: StringWithAggregatesFilter | string
    rASessionId?: StringWithAggregatesFilter | string
    userRole?: EnumSessionUserRoleWithAggregatesFilter | SessionUserRole
  }

  export type VisitWhereInput = {
    AND?: Enumerable<VisitWhereInput>
    OR?: Enumerable<VisitWhereInput>
    NOT?: Enumerable<VisitWhereInput>
    id?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    patientId?: StringFilter | string
    Patient?: XOR<PatientRelationFilter, PatientWhereInput>
    RawResource?: RawResourceListRelationFilter
    VisitsInRASessions?: VisitsInRASessionsListRelationFilter
  }

  export type VisitOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    patientId?: SortOrder
    Patient?: PatientOrderByWithRelationInput
    RawResource?: RawResourceOrderByRelationAggregateInput
    VisitsInRASessions?: VisitsInRASessionsOrderByRelationAggregateInput
  }

  export type VisitWhereUniqueInput = {
    id?: string
  }

  export type VisitOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    patientId?: SortOrder
    _count?: VisitCountOrderByAggregateInput
    _max?: VisitMaxOrderByAggregateInput
    _min?: VisitMinOrderByAggregateInput
  }

  export type VisitScalarWhereWithAggregatesInput = {
    AND?: Enumerable<VisitScalarWhereWithAggregatesInput>
    OR?: Enumerable<VisitScalarWhereWithAggregatesInput>
    NOT?: Enumerable<VisitScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
    patientId?: StringWithAggregatesFilter | string
  }

  export type VisitsInRASessionsWhereInput = {
    AND?: Enumerable<VisitsInRASessionsWhereInput>
    OR?: Enumerable<VisitsInRASessionsWhereInput>
    NOT?: Enumerable<VisitsInRASessionsWhereInput>
    visitId?: StringFilter | string
    rASessionId?: StringFilter | string
    index?: IntFilter | number
    content?: JsonFilter
    status?: EnumExtractedResourceStatusFilter | ExtractedResourceStatus
    result?: JsonFilter
    RASession?: XOR<RASessionRelationFilter, RASessionWhereInput>
    Visit?: XOR<VisitRelationFilter, VisitWhereInput>
  }

  export type VisitsInRASessionsOrderByWithRelationInput = {
    visitId?: SortOrder
    rASessionId?: SortOrder
    index?: SortOrder
    content?: SortOrder
    status?: SortOrder
    result?: SortOrder
    RASession?: RASessionOrderByWithRelationInput
    Visit?: VisitOrderByWithRelationInput
  }

  export type VisitsInRASessionsWhereUniqueInput = {
    rASessionId_index?: VisitsInRASessionsRASessionIdIndexCompoundUniqueInput
    visitId_rASessionId?: VisitsInRASessionsVisitIdRASessionIdCompoundUniqueInput
  }

  export type VisitsInRASessionsOrderByWithAggregationInput = {
    visitId?: SortOrder
    rASessionId?: SortOrder
    index?: SortOrder
    content?: SortOrder
    status?: SortOrder
    result?: SortOrder
    _count?: VisitsInRASessionsCountOrderByAggregateInput
    _avg?: VisitsInRASessionsAvgOrderByAggregateInput
    _max?: VisitsInRASessionsMaxOrderByAggregateInput
    _min?: VisitsInRASessionsMinOrderByAggregateInput
    _sum?: VisitsInRASessionsSumOrderByAggregateInput
  }

  export type VisitsInRASessionsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<VisitsInRASessionsScalarWhereWithAggregatesInput>
    OR?: Enumerable<VisitsInRASessionsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<VisitsInRASessionsScalarWhereWithAggregatesInput>
    visitId?: StringWithAggregatesFilter | string
    rASessionId?: StringWithAggregatesFilter | string
    index?: IntWithAggregatesFilter | number
    content?: JsonWithAggregatesFilter
    status?: EnumExtractedResourceStatusWithAggregatesFilter | ExtractedResourceStatus
    result?: JsonWithAggregatesFilter
  }

  export type CESessionCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: CESessionCreatesopInput | Enumerable<string>
    resultTemplate: JsonNullValueInput | InputJsonValue
    Project: ProjectCreateNestedOneWithoutCESessionInput
    ExtractedResourcesInCESessions?: ExtractedResourcesInCESessionsCreateNestedManyWithoutCESessionInput
    UsersInCESessions?: UsersInCESessionsCreateNestedManyWithoutCESessionInput
  }

  export type CESessionUncheckedCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: CESessionCreatesopInput | Enumerable<string>
    resultTemplate: JsonNullValueInput | InputJsonValue
    projectId: string
    ExtractedResourcesInCESessions?: ExtractedResourcesInCESessionsUncheckedCreateNestedManyWithoutCESessionInput
    UsersInCESessions?: UsersInCESessionsUncheckedCreateNestedManyWithoutCESessionInput
  }

  export type CESessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: CESessionUpdatesopInput | Enumerable<string>
    resultTemplate?: JsonNullValueInput | InputJsonValue
    Project?: ProjectUpdateOneRequiredWithoutCESessionNestedInput
    ExtractedResourcesInCESessions?: ExtractedResourcesInCESessionsUpdateManyWithoutCESessionNestedInput
    UsersInCESessions?: UsersInCESessionsUpdateManyWithoutCESessionNestedInput
  }

  export type CESessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: CESessionUpdatesopInput | Enumerable<string>
    resultTemplate?: JsonNullValueInput | InputJsonValue
    projectId?: StringFieldUpdateOperationsInput | string
    ExtractedResourcesInCESessions?: ExtractedResourcesInCESessionsUncheckedUpdateManyWithoutCESessionNestedInput
    UsersInCESessions?: UsersInCESessionsUncheckedUpdateManyWithoutCESessionNestedInput
  }

  export type CESessionCreateManyInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: CESessionCreatesopInput | Enumerable<string>
    resultTemplate: JsonNullValueInput | InputJsonValue
    projectId: string
  }

  export type CESessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: CESessionUpdatesopInput | Enumerable<string>
    resultTemplate?: JsonNullValueInput | InputJsonValue
  }

  export type CESessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: CESessionUpdatesopInput | Enumerable<string>
    resultTemplate?: JsonNullValueInput | InputJsonValue
    projectId?: StringFieldUpdateOperationsInput | string
  }

  export type DLSessionCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: DLSessionCreatesopInput | Enumerable<string>
    Project: ProjectCreateNestedOneWithoutDLSessionInput
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsCreateNestedManyWithoutDLSessionInput
    LabelsInDLSessions?: LabelsInDLSessionsCreateNestedManyWithoutDLSessionInput
    UsersInDLSessions?: UsersInDLSessionsCreateNestedManyWithoutDLSessionInput
  }

  export type DLSessionUncheckedCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: DLSessionCreatesopInput | Enumerable<string>
    projectId: string
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsUncheckedCreateNestedManyWithoutDLSessionInput
    LabelsInDLSessions?: LabelsInDLSessionsUncheckedCreateNestedManyWithoutDLSessionInput
    UsersInDLSessions?: UsersInDLSessionsUncheckedCreateNestedManyWithoutDLSessionInput
  }

  export type DLSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: DLSessionUpdatesopInput | Enumerable<string>
    Project?: ProjectUpdateOneRequiredWithoutDLSessionNestedInput
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsUpdateManyWithoutDLSessionNestedInput
    LabelsInDLSessions?: LabelsInDLSessionsUpdateManyWithoutDLSessionNestedInput
    UsersInDLSessions?: UsersInDLSessionsUpdateManyWithoutDLSessionNestedInput
  }

  export type DLSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: DLSessionUpdatesopInput | Enumerable<string>
    projectId?: StringFieldUpdateOperationsInput | string
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsUncheckedUpdateManyWithoutDLSessionNestedInput
    LabelsInDLSessions?: LabelsInDLSessionsUncheckedUpdateManyWithoutDLSessionNestedInput
    UsersInDLSessions?: UsersInDLSessionsUncheckedUpdateManyWithoutDLSessionNestedInput
  }

  export type DLSessionCreateManyInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: DLSessionCreatesopInput | Enumerable<string>
    projectId: string
  }

  export type DLSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: DLSessionUpdatesopInput | Enumerable<string>
  }

  export type DLSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: DLSessionUpdatesopInput | Enumerable<string>
    projectId?: StringFieldUpdateOperationsInput | string
  }

  export type EpicCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    Project?: ProjectCreateNestedManyWithoutEpicInput
  }

  export type EpicUncheckedCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    Project?: ProjectUncheckedCreateNestedManyWithoutEpicInput
  }

  export type EpicUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    Project?: ProjectUpdateManyWithoutEpicNestedInput
  }

  export type EpicUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    Project?: ProjectUncheckedUpdateManyWithoutEpicNestedInput
  }

  export type EpicCreateManyInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
  }

  export type EpicUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
  }

  export type EpicUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
  }

  export type ExtractedResourceCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    metadata: JsonNullValueInput | InputJsonValue
    RawResource: RawResourceCreateNestedOneWithoutExtractedResourceInput
    ExtractedResourcesInCESessions?: ExtractedResourcesInCESessionsCreateNestedManyWithoutExtractedResourceInput
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsCreateNestedManyWithoutExtractedResourceInput
  }

  export type ExtractedResourceUncheckedCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    metadata: JsonNullValueInput | InputJsonValue
    rawResourceId: string
    ExtractedResourcesInCESessions?: ExtractedResourcesInCESessionsUncheckedCreateNestedManyWithoutExtractedResourceInput
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsUncheckedCreateNestedManyWithoutExtractedResourceInput
  }

  export type ExtractedResourceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: JsonNullValueInput | InputJsonValue
    RawResource?: RawResourceUpdateOneRequiredWithoutExtractedResourceNestedInput
    ExtractedResourcesInCESessions?: ExtractedResourcesInCESessionsUpdateManyWithoutExtractedResourceNestedInput
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsUpdateManyWithoutExtractedResourceNestedInput
  }

  export type ExtractedResourceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: JsonNullValueInput | InputJsonValue
    rawResourceId?: StringFieldUpdateOperationsInput | string
    ExtractedResourcesInCESessions?: ExtractedResourcesInCESessionsUncheckedUpdateManyWithoutExtractedResourceNestedInput
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsUncheckedUpdateManyWithoutExtractedResourceNestedInput
  }

  export type ExtractedResourceCreateManyInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    metadata: JsonNullValueInput | InputJsonValue
    thumbnailUrl: string
    rawResourceId: string
  }

  export type ExtractedResourceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type ExtractedResourceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: JsonNullValueInput | InputJsonValue
    rawResourceId?: StringFieldUpdateOperationsInput | string
  }

  export type ExtractedResourcesInCESessionsCreateInput = {
    index: number
    status?: ExtractedResourceStatus
    result: JsonNullValueInput | InputJsonValue
    CESession: CESessionCreateNestedOneWithoutExtractedResourcesInCESessionsInput
    ExtractedResource: ExtractedResourceCreateNestedOneWithoutExtractedResourcesInCESessionsInput
  }

  export type ExtractedResourcesInCESessionsUncheckedCreateInput = {
    extractedResourceId: string
    cESessionId: string
    index: number
    status?: ExtractedResourceStatus
    result: JsonNullValueInput | InputJsonValue
  }

  export type ExtractedResourcesInCESessionsUpdateInput = {
    index?: IntFieldUpdateOperationsInput | number
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
    result?: JsonNullValueInput | InputJsonValue
    CESession?: CESessionUpdateOneRequiredWithoutExtractedResourcesInCESessionsNestedInput
    ExtractedResource?: ExtractedResourceUpdateOneRequiredWithoutExtractedResourcesInCESessionsNestedInput
  }

  export type ExtractedResourcesInCESessionsUncheckedUpdateInput = {
    extractedResourceId?: StringFieldUpdateOperationsInput | string
    cESessionId?: StringFieldUpdateOperationsInput | string
    index?: IntFieldUpdateOperationsInput | number
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
    result?: JsonNullValueInput | InputJsonValue
  }

  export type ExtractedResourcesInCESessionsCreateManyInput = {
    extractedResourceId: string
    cESessionId: string
    index: number
    status?: ExtractedResourceStatus
    result: JsonNullValueInput | InputJsonValue
  }

  export type ExtractedResourcesInCESessionsUpdateManyMutationInput = {
    index?: IntFieldUpdateOperationsInput | number
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
    result?: JsonNullValueInput | InputJsonValue
  }

  export type ExtractedResourcesInCESessionsUncheckedUpdateManyInput = {
    extractedResourceId?: StringFieldUpdateOperationsInput | string
    cESessionId?: StringFieldUpdateOperationsInput | string
    index?: IntFieldUpdateOperationsInput | number
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
    result?: JsonNullValueInput | InputJsonValue
  }

  export type ExtractedResourcesInDLSessionsCreateInput = {
    status?: ExtractedResourceStatus
    DLSession: DLSessionCreateNestedOneWithoutExtractedResourcesInDLSessionsInput
    ExtractedResource: ExtractedResourceCreateNestedOneWithoutExtractedResourcesInDLSessionsInput
    LabelsInExtractedResourcesInDLSessions?: LabelsInExtractedResourcesInDLSessionsCreateNestedManyWithoutExtractedResourcesInDLSessionsInput
  }

  export type ExtractedResourcesInDLSessionsUncheckedCreateInput = {
    extractedResourceId: string
    dLSessionId: string
    status?: ExtractedResourceStatus
    LabelsInExtractedResourcesInDLSessions?: LabelsInExtractedResourcesInDLSessionsUncheckedCreateNestedManyWithoutExtractedResourcesInDLSessionsInput
  }

  export type ExtractedResourcesInDLSessionsUpdateInput = {
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
    DLSession?: DLSessionUpdateOneRequiredWithoutExtractedResourcesInDLSessionsNestedInput
    ExtractedResource?: ExtractedResourceUpdateOneRequiredWithoutExtractedResourcesInDLSessionsNestedInput
    LabelsInExtractedResourcesInDLSessions?: LabelsInExtractedResourcesInDLSessionsUpdateManyWithoutExtractedResourcesInDLSessionsNestedInput
  }

  export type ExtractedResourcesInDLSessionsUncheckedUpdateInput = {
    extractedResourceId?: StringFieldUpdateOperationsInput | string
    dLSessionId?: StringFieldUpdateOperationsInput | string
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
    LabelsInExtractedResourcesInDLSessions?: LabelsInExtractedResourcesInDLSessionsUncheckedUpdateManyWithoutExtractedResourcesInDLSessionsNestedInput
  }

  export type ExtractedResourcesInDLSessionsCreateManyInput = {
    extractedResourceId: string
    dLSessionId: string
    status?: ExtractedResourceStatus
  }

  export type ExtractedResourcesInDLSessionsUpdateManyMutationInput = {
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
  }

  export type ExtractedResourcesInDLSessionsUncheckedUpdateManyInput = {
    extractedResourceId?: StringFieldUpdateOperationsInput | string
    dLSessionId?: StringFieldUpdateOperationsInput | string
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
  }

  export type LabelCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    abbreviation: string
    LabelsInDLSessions?: LabelsInDLSessionsCreateNestedManyWithoutLabelInput
    LabelsInExtractedResourcesInDLSessions?: LabelsInExtractedResourcesInDLSessionsCreateNestedManyWithoutLabelInput
  }

  export type LabelUncheckedCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    abbreviation: string
    LabelsInDLSessions?: LabelsInDLSessionsUncheckedCreateNestedManyWithoutLabelInput
    LabelsInExtractedResourcesInDLSessions?: LabelsInExtractedResourcesInDLSessionsUncheckedCreateNestedManyWithoutLabelInput
  }

  export type LabelUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    LabelsInDLSessions?: LabelsInDLSessionsUpdateManyWithoutLabelNestedInput
    LabelsInExtractedResourcesInDLSessions?: LabelsInExtractedResourcesInDLSessionsUpdateManyWithoutLabelNestedInput
  }

  export type LabelUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    LabelsInDLSessions?: LabelsInDLSessionsUncheckedUpdateManyWithoutLabelNestedInput
    LabelsInExtractedResourcesInDLSessions?: LabelsInExtractedResourcesInDLSessionsUncheckedUpdateManyWithoutLabelNestedInput
  }

  export type LabelCreateManyInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    abbreviation: string
  }

  export type LabelUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
  }

  export type LabelUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
  }

  export type LabelsInDLSessionsCreateInput = {
    DLSession: DLSessionCreateNestedOneWithoutLabelsInDLSessionsInput
    Label: LabelCreateNestedOneWithoutLabelsInDLSessionsInput
  }

  export type LabelsInDLSessionsUncheckedCreateInput = {
    labelId: string
    dLSessionId: string
  }

  export type LabelsInDLSessionsUpdateInput = {
    DLSession?: DLSessionUpdateOneRequiredWithoutLabelsInDLSessionsNestedInput
    Label?: LabelUpdateOneRequiredWithoutLabelsInDLSessionsNestedInput
  }

  export type LabelsInDLSessionsUncheckedUpdateInput = {
    labelId?: StringFieldUpdateOperationsInput | string
    dLSessionId?: StringFieldUpdateOperationsInput | string
  }

  export type LabelsInDLSessionsCreateManyInput = {
    labelId: string
    dLSessionId: string
  }

  export type LabelsInDLSessionsUpdateManyMutationInput = {

  }

  export type LabelsInDLSessionsUncheckedUpdateManyInput = {
    labelId?: StringFieldUpdateOperationsInput | string
    dLSessionId?: StringFieldUpdateOperationsInput | string
  }

  export type LabelsInExtractedResourcesInDLSessionsCreateInput = {
    ExtractedResourcesInDLSessions: ExtractedResourcesInDLSessionsCreateNestedOneWithoutLabelsInExtractedResourcesInDLSessionsInput
    Label: LabelCreateNestedOneWithoutLabelsInExtractedResourcesInDLSessionsInput
  }

  export type LabelsInExtractedResourcesInDLSessionsUncheckedCreateInput = {
    labelId: string
    extractedResourceId: string
    dLSessionId: string
  }

  export type LabelsInExtractedResourcesInDLSessionsUpdateInput = {
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsUpdateOneRequiredWithoutLabelsInExtractedResourcesInDLSessionsNestedInput
    Label?: LabelUpdateOneRequiredWithoutLabelsInExtractedResourcesInDLSessionsNestedInput
  }

  export type LabelsInExtractedResourcesInDLSessionsUncheckedUpdateInput = {
    labelId?: StringFieldUpdateOperationsInput | string
    extractedResourceId?: StringFieldUpdateOperationsInput | string
    dLSessionId?: StringFieldUpdateOperationsInput | string
  }

  export type LabelsInExtractedResourcesInDLSessionsCreateManyInput = {
    labelId: string
    extractedResourceId: string
    dLSessionId: string
  }

  export type LabelsInExtractedResourcesInDLSessionsUpdateManyMutationInput = {

  }

  export type LabelsInExtractedResourcesInDLSessionsUncheckedUpdateManyInput = {
    labelId?: StringFieldUpdateOperationsInput | string
    extractedResourceId?: StringFieldUpdateOperationsInput | string
    dLSessionId?: StringFieldUpdateOperationsInput | string
  }

  export type PatientCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    Visit?: VisitCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    Visit?: VisitUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Visit?: VisitUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Visit?: VisitUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type PatientCreateManyInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type PatientUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    Epic: EpicCreateNestedOneWithoutProjectInput
    CESession?: CESessionCreateNestedManyWithoutProjectInput
    DLSession?: DLSessionCreateNestedManyWithoutProjectInput
    RASession?: RASessionCreateNestedManyWithoutProjectInput
    UsersInProjects?: UsersInProjectsCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    epicId: string
    CESession?: CESessionUncheckedCreateNestedManyWithoutProjectInput
    DLSession?: DLSessionUncheckedCreateNestedManyWithoutProjectInput
    RASession?: RASessionUncheckedCreateNestedManyWithoutProjectInput
    UsersInProjects?: UsersInProjectsUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    Epic?: EpicUpdateOneRequiredWithoutProjectNestedInput
    CESession?: CESessionUpdateManyWithoutProjectNestedInput
    DLSession?: DLSessionUpdateManyWithoutProjectNestedInput
    RASession?: RASessionUpdateManyWithoutProjectNestedInput
    UsersInProjects?: UsersInProjectsUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    epicId?: StringFieldUpdateOperationsInput | string
    CESession?: CESessionUncheckedUpdateManyWithoutProjectNestedInput
    DLSession?: DLSessionUncheckedUpdateManyWithoutProjectNestedInput
    RASession?: RASessionUncheckedUpdateManyWithoutProjectNestedInput
    UsersInProjects?: UsersInProjectsUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateManyInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    epicId: string
  }

  export type ProjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
  }

  export type ProjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    epicId?: StringFieldUpdateOperationsInput | string
  }

  export type RASessionCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: RASessionCreatesopInput | Enumerable<string>
    template: JsonNullValueInput | InputJsonValue
    Project: ProjectCreateNestedOneWithoutRASessionInput
    UsersInRASessions?: UsersInRASessionsCreateNestedManyWithoutRASessionInput
    VisitsInRASessions?: VisitsInRASessionsCreateNestedManyWithoutRASessionInput
  }

  export type RASessionUncheckedCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: RASessionCreatesopInput | Enumerable<string>
    template: JsonNullValueInput | InputJsonValue
    projectId: string
    UsersInRASessions?: UsersInRASessionsUncheckedCreateNestedManyWithoutRASessionInput
    VisitsInRASessions?: VisitsInRASessionsUncheckedCreateNestedManyWithoutRASessionInput
  }

  export type RASessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: RASessionUpdatesopInput | Enumerable<string>
    template?: JsonNullValueInput | InputJsonValue
    Project?: ProjectUpdateOneRequiredWithoutRASessionNestedInput
    UsersInRASessions?: UsersInRASessionsUpdateManyWithoutRASessionNestedInput
    VisitsInRASessions?: VisitsInRASessionsUpdateManyWithoutRASessionNestedInput
  }

  export type RASessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: RASessionUpdatesopInput | Enumerable<string>
    template?: JsonNullValueInput | InputJsonValue
    projectId?: StringFieldUpdateOperationsInput | string
    UsersInRASessions?: UsersInRASessionsUncheckedUpdateManyWithoutRASessionNestedInput
    VisitsInRASessions?: VisitsInRASessionsUncheckedUpdateManyWithoutRASessionNestedInput
  }

  export type RASessionCreateManyInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: RASessionCreatesopInput | Enumerable<string>
    template: JsonNullValueInput | InputJsonValue
    projectId: string
  }

  export type RASessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: RASessionUpdatesopInput | Enumerable<string>
    template?: JsonNullValueInput | InputJsonValue
  }

  export type RASessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: RASessionUpdatesopInput | Enumerable<string>
    template?: JsonNullValueInput | InputJsonValue
    projectId?: StringFieldUpdateOperationsInput | string
  }

  export type RawResourceCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    metadata: JsonNullValueInput | InputJsonValue
    machine: string
    center: string
    Visit: VisitCreateNestedOneWithoutRawResourceInput
    ExtractedResource?: ExtractedResourceCreateNestedManyWithoutRawResourceInput
  }

  export type RawResourceUncheckedCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    metadata: JsonNullValueInput | InputJsonValue
    machine: string
    center: string
    visitId: string
    ExtractedResource?: ExtractedResourceUncheckedCreateNestedManyWithoutRawResourceInput
  }

  export type RawResourceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: JsonNullValueInput | InputJsonValue
    machine?: StringFieldUpdateOperationsInput | string
    center?: StringFieldUpdateOperationsInput | string
    Visit?: VisitUpdateOneRequiredWithoutRawResourceNestedInput
    ExtractedResource?: ExtractedResourceUpdateManyWithoutRawResourceNestedInput
  }

  export type RawResourceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: JsonNullValueInput | InputJsonValue
    machine?: StringFieldUpdateOperationsInput | string
    center?: StringFieldUpdateOperationsInput | string
    visitId?: StringFieldUpdateOperationsInput | string
    ExtractedResource?: ExtractedResourceUncheckedUpdateManyWithoutRawResourceNestedInput
  }

  export type RawResourceCreateManyInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    metadata: JsonNullValueInput | InputJsonValue
    machine: string
    center: string
    visitId: string
  }

  export type RawResourceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: JsonNullValueInput | InputJsonValue
    machine?: StringFieldUpdateOperationsInput | string
    center?: StringFieldUpdateOperationsInput | string
  }

  export type RawResourceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: JsonNullValueInput | InputJsonValue
    machine?: StringFieldUpdateOperationsInput | string
    center?: StringFieldUpdateOperationsInput | string
    visitId?: StringFieldUpdateOperationsInput | string
  }

  export type UsersInCESessionsCreateInput = {
    userId: string
    userRole: SessionUserRole
    CESession: CESessionCreateNestedOneWithoutUsersInCESessionsInput
  }

  export type UsersInCESessionsUncheckedCreateInput = {
    userId: string
    cESessionId: string
    userRole: SessionUserRole
  }

  export type UsersInCESessionsUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    userRole?: EnumSessionUserRoleFieldUpdateOperationsInput | SessionUserRole
    CESession?: CESessionUpdateOneRequiredWithoutUsersInCESessionsNestedInput
  }

  export type UsersInCESessionsUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    cESessionId?: StringFieldUpdateOperationsInput | string
    userRole?: EnumSessionUserRoleFieldUpdateOperationsInput | SessionUserRole
  }

  export type UsersInCESessionsCreateManyInput = {
    userId: string
    cESessionId: string
    userRole: SessionUserRole
  }

  export type UsersInCESessionsUpdateManyMutationInput = {
    userId?: StringFieldUpdateOperationsInput | string
    userRole?: EnumSessionUserRoleFieldUpdateOperationsInput | SessionUserRole
  }

  export type UsersInCESessionsUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    cESessionId?: StringFieldUpdateOperationsInput | string
    userRole?: EnumSessionUserRoleFieldUpdateOperationsInput | SessionUserRole
  }

  export type UsersInDLSessionsCreateInput = {
    userId: string
    userRole: SessionUserRole
    DLSession: DLSessionCreateNestedOneWithoutUsersInDLSessionsInput
  }

  export type UsersInDLSessionsUncheckedCreateInput = {
    userId: string
    dLSessionId: string
    userRole: SessionUserRole
  }

  export type UsersInDLSessionsUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    userRole?: EnumSessionUserRoleFieldUpdateOperationsInput | SessionUserRole
    DLSession?: DLSessionUpdateOneRequiredWithoutUsersInDLSessionsNestedInput
  }

  export type UsersInDLSessionsUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    dLSessionId?: StringFieldUpdateOperationsInput | string
    userRole?: EnumSessionUserRoleFieldUpdateOperationsInput | SessionUserRole
  }

  export type UsersInDLSessionsCreateManyInput = {
    userId: string
    dLSessionId: string
    userRole: SessionUserRole
  }

  export type UsersInDLSessionsUpdateManyMutationInput = {
    userId?: StringFieldUpdateOperationsInput | string
    userRole?: EnumSessionUserRoleFieldUpdateOperationsInput | SessionUserRole
  }

  export type UsersInDLSessionsUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    dLSessionId?: StringFieldUpdateOperationsInput | string
    userRole?: EnumSessionUserRoleFieldUpdateOperationsInput | SessionUserRole
  }

  export type UsersInProjectsCreateInput = {
    userId: string
    userRole: ProjectUserRole
    Project: ProjectCreateNestedOneWithoutUsersInProjectsInput
  }

  export type UsersInProjectsUncheckedCreateInput = {
    userId: string
    projectId: string
    userRole: ProjectUserRole
  }

  export type UsersInProjectsUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    userRole?: EnumProjectUserRoleFieldUpdateOperationsInput | ProjectUserRole
    Project?: ProjectUpdateOneRequiredWithoutUsersInProjectsNestedInput
  }

  export type UsersInProjectsUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    userRole?: EnumProjectUserRoleFieldUpdateOperationsInput | ProjectUserRole
  }

  export type UsersInProjectsCreateManyInput = {
    userId: string
    projectId: string
    userRole: ProjectUserRole
  }

  export type UsersInProjectsUpdateManyMutationInput = {
    userId?: StringFieldUpdateOperationsInput | string
    userRole?: EnumProjectUserRoleFieldUpdateOperationsInput | ProjectUserRole
  }

  export type UsersInProjectsUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    userRole?: EnumProjectUserRoleFieldUpdateOperationsInput | ProjectUserRole
  }

  export type UsersInRASessionsCreateInput = {
    userId: string
    userRole: SessionUserRole
    RASession: RASessionCreateNestedOneWithoutUsersInRASessionsInput
  }

  export type UsersInRASessionsUncheckedCreateInput = {
    userId: string
    rASessionId: string
    userRole: SessionUserRole
  }

  export type UsersInRASessionsUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    userRole?: EnumSessionUserRoleFieldUpdateOperationsInput | SessionUserRole
    RASession?: RASessionUpdateOneRequiredWithoutUsersInRASessionsNestedInput
  }

  export type UsersInRASessionsUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    rASessionId?: StringFieldUpdateOperationsInput | string
    userRole?: EnumSessionUserRoleFieldUpdateOperationsInput | SessionUserRole
  }

  export type UsersInRASessionsCreateManyInput = {
    userId: string
    rASessionId: string
    userRole: SessionUserRole
  }

  export type UsersInRASessionsUpdateManyMutationInput = {
    userId?: StringFieldUpdateOperationsInput | string
    userRole?: EnumSessionUserRoleFieldUpdateOperationsInput | SessionUserRole
  }

  export type UsersInRASessionsUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    rASessionId?: StringFieldUpdateOperationsInput | string
    userRole?: EnumSessionUserRoleFieldUpdateOperationsInput | SessionUserRole
  }

  export type VisitCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    Patient: PatientCreateNestedOneWithoutVisitInput
    RawResource?: RawResourceCreateNestedManyWithoutVisitInput
    VisitsInRASessions?: VisitsInRASessionsCreateNestedManyWithoutVisitInput
  }

  export type VisitUncheckedCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    patientId: string
    RawResource?: RawResourceUncheckedCreateNestedManyWithoutVisitInput
    VisitsInRASessions?: VisitsInRASessionsUncheckedCreateNestedManyWithoutVisitInput
  }

  export type VisitUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Patient?: PatientUpdateOneRequiredWithoutVisitNestedInput
    RawResource?: RawResourceUpdateManyWithoutVisitNestedInput
    VisitsInRASessions?: VisitsInRASessionsUpdateManyWithoutVisitNestedInput
  }

  export type VisitUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patientId?: StringFieldUpdateOperationsInput | string
    RawResource?: RawResourceUncheckedUpdateManyWithoutVisitNestedInput
    VisitsInRASessions?: VisitsInRASessionsUncheckedUpdateManyWithoutVisitNestedInput
  }

  export type VisitCreateManyInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    patientId: string
  }

  export type VisitUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VisitUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patientId?: StringFieldUpdateOperationsInput | string
  }

  export type VisitsInRASessionsCreateInput = {
    index: number
    content: JsonNullValueInput | InputJsonValue
    status?: ExtractedResourceStatus
    result: JsonNullValueInput | InputJsonValue
    RASession: RASessionCreateNestedOneWithoutVisitsInRASessionsInput
    Visit: VisitCreateNestedOneWithoutVisitsInRASessionsInput
  }

  export type VisitsInRASessionsUncheckedCreateInput = {
    visitId: string
    rASessionId: string
    index: number
    content: JsonNullValueInput | InputJsonValue
    status?: ExtractedResourceStatus
    result: JsonNullValueInput | InputJsonValue
  }

  export type VisitsInRASessionsUpdateInput = {
    index?: IntFieldUpdateOperationsInput | number
    content?: JsonNullValueInput | InputJsonValue
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
    result?: JsonNullValueInput | InputJsonValue
    RASession?: RASessionUpdateOneRequiredWithoutVisitsInRASessionsNestedInput
    Visit?: VisitUpdateOneRequiredWithoutVisitsInRASessionsNestedInput
  }

  export type VisitsInRASessionsUncheckedUpdateInput = {
    visitId?: StringFieldUpdateOperationsInput | string
    rASessionId?: StringFieldUpdateOperationsInput | string
    index?: IntFieldUpdateOperationsInput | number
    content?: JsonNullValueInput | InputJsonValue
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
    result?: JsonNullValueInput | InputJsonValue
  }

  export type VisitsInRASessionsCreateManyInput = {
    visitId: string
    rASessionId: string
    index: number
    content: JsonNullValueInput | InputJsonValue
    status?: ExtractedResourceStatus
    result: JsonNullValueInput | InputJsonValue
  }

  export type VisitsInRASessionsUpdateManyMutationInput = {
    index?: IntFieldUpdateOperationsInput | number
    content?: JsonNullValueInput | InputJsonValue
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
    result?: JsonNullValueInput | InputJsonValue
  }

  export type VisitsInRASessionsUncheckedUpdateManyInput = {
    visitId?: StringFieldUpdateOperationsInput | string
    rASessionId?: StringFieldUpdateOperationsInput | string
    index?: IntFieldUpdateOperationsInput | number
    content?: JsonNullValueInput | InputJsonValue
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
    result?: JsonNullValueInput | InputJsonValue
  }

  export type StringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringFilter | string
  }

  export type DateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type IntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type StringNullableListFilter = {
    equals?: Enumerable<string> | null
    has?: string | null
    hasEvery?: Enumerable<string>
    hasSome?: Enumerable<string>
    isEmpty?: boolean
  }
  export type JsonFilter = 
    | PatchUndefined<
        Either<Required<JsonFilterBase>, Exclude<keyof Required<JsonFilterBase>, 'path'>>,
        Required<JsonFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase>, 'path'>>

  export type JsonFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: Array<string>
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
  }

  export type ProjectRelationFilter = {
    is?: ProjectWhereInput
    isNot?: ProjectWhereInput
  }

  export type ExtractedResourcesInCESessionsListRelationFilter = {
    every?: ExtractedResourcesInCESessionsWhereInput
    some?: ExtractedResourcesInCESessionsWhereInput
    none?: ExtractedResourcesInCESessionsWhereInput
  }

  export type UsersInCESessionsListRelationFilter = {
    every?: UsersInCESessionsWhereInput
    some?: UsersInCESessionsWhereInput
    none?: UsersInCESessionsWhereInput
  }

  export type ExtractedResourcesInCESessionsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UsersInCESessionsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CESessionCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
    priority?: SortOrder
    sop?: SortOrder
    resultTemplate?: SortOrder
    projectId?: SortOrder
  }

  export type CESessionAvgOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type CESessionMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
    priority?: SortOrder
    projectId?: SortOrder
  }

  export type CESessionMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
    priority?: SortOrder
    projectId?: SortOrder
  }

  export type CESessionSumOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type StringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type DateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type IntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }
  export type JsonWithAggregatesFilter = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase>, Exclude<keyof Required<JsonWithAggregatesFilterBase>, 'path'>>,
        Required<JsonWithAggregatesFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase>, 'path'>>

  export type JsonWithAggregatesFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: Array<string>
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
    _count?: NestedIntFilter
    _min?: NestedJsonFilter
    _max?: NestedJsonFilter
  }

  export type ExtractedResourcesInDLSessionsListRelationFilter = {
    every?: ExtractedResourcesInDLSessionsWhereInput
    some?: ExtractedResourcesInDLSessionsWhereInput
    none?: ExtractedResourcesInDLSessionsWhereInput
  }

  export type LabelsInDLSessionsListRelationFilter = {
    every?: LabelsInDLSessionsWhereInput
    some?: LabelsInDLSessionsWhereInput
    none?: LabelsInDLSessionsWhereInput
  }

  export type UsersInDLSessionsListRelationFilter = {
    every?: UsersInDLSessionsWhereInput
    some?: UsersInDLSessionsWhereInput
    none?: UsersInDLSessionsWhereInput
  }

  export type ExtractedResourcesInDLSessionsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LabelsInDLSessionsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UsersInDLSessionsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DLSessionCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
    priority?: SortOrder
    sop?: SortOrder
    projectId?: SortOrder
  }

  export type DLSessionAvgOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type DLSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
    priority?: SortOrder
    projectId?: SortOrder
  }

  export type DLSessionMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
    priority?: SortOrder
    projectId?: SortOrder
  }

  export type DLSessionSumOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type ProjectListRelationFilter = {
    every?: ProjectWhereInput
    some?: ProjectWhereInput
    none?: ProjectWhereInput
  }

  export type ProjectOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EpicCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type EpicMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type EpicMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type RawResourceRelationFilter = {
    is?: RawResourceWhereInput
    isNot?: RawResourceWhereInput
  }

  export type ExtractedResourceCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    metadata?: SortOrder
    rawResourceId?: SortOrder
  }

  export type ExtractedResourceMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    rawResourceId?: SortOrder
  }

  export type ExtractedResourceMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    rawResourceId?: SortOrder
  }

  export type EnumExtractedResourceStatusFilter = {
    equals?: ExtractedResourceStatus
    in?: Enumerable<ExtractedResourceStatus>
    notIn?: Enumerable<ExtractedResourceStatus>
    not?: NestedEnumExtractedResourceStatusFilter | ExtractedResourceStatus
  }

  export type CESessionRelationFilter = {
    is?: CESessionWhereInput
    isNot?: CESessionWhereInput
  }

  export type ExtractedResourceRelationFilter = {
    is?: ExtractedResourceWhereInput
    isNot?: ExtractedResourceWhereInput
  }

  export type ExtractedResourcesInCESessionsCESessionIdIndexCompoundUniqueInput = {
    cESessionId: string
    index: number
  }

  export type ExtractedResourcesInCESessionsExtractedResourceIdCESessionIdCompoundUniqueInput = {
    extractedResourceId: string
    cESessionId: string
  }

  export type ExtractedResourcesInCESessionsCountOrderByAggregateInput = {
    extractedResourceId?: SortOrder
    cESessionId?: SortOrder
    index?: SortOrder
    status?: SortOrder
    result?: SortOrder
  }

  export type ExtractedResourcesInCESessionsAvgOrderByAggregateInput = {
    index?: SortOrder
  }

  export type ExtractedResourcesInCESessionsMaxOrderByAggregateInput = {
    extractedResourceId?: SortOrder
    cESessionId?: SortOrder
    index?: SortOrder
    status?: SortOrder
  }

  export type ExtractedResourcesInCESessionsMinOrderByAggregateInput = {
    extractedResourceId?: SortOrder
    cESessionId?: SortOrder
    index?: SortOrder
    status?: SortOrder
  }

  export type ExtractedResourcesInCESessionsSumOrderByAggregateInput = {
    index?: SortOrder
  }

  export type EnumExtractedResourceStatusWithAggregatesFilter = {
    equals?: ExtractedResourceStatus
    in?: Enumerable<ExtractedResourceStatus>
    notIn?: Enumerable<ExtractedResourceStatus>
    not?: NestedEnumExtractedResourceStatusWithAggregatesFilter | ExtractedResourceStatus
    _count?: NestedIntFilter
    _min?: NestedEnumExtractedResourceStatusFilter
    _max?: NestedEnumExtractedResourceStatusFilter
  }

  export type DLSessionRelationFilter = {
    is?: DLSessionWhereInput
    isNot?: DLSessionWhereInput
  }

  export type LabelsInExtractedResourcesInDLSessionsListRelationFilter = {
    every?: LabelsInExtractedResourcesInDLSessionsWhereInput
    some?: LabelsInExtractedResourcesInDLSessionsWhereInput
    none?: LabelsInExtractedResourcesInDLSessionsWhereInput
  }

  export type LabelsInExtractedResourcesInDLSessionsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExtractedResourcesInDLSessionsExtractedResourceIdDLSessionIdCompoundUniqueInput = {
    extractedResourceId: string
    dLSessionId: string
  }

  export type ExtractedResourcesInDLSessionsCountOrderByAggregateInput = {
    extractedResourceId?: SortOrder
    dLSessionId?: SortOrder
    status?: SortOrder
  }

  export type ExtractedResourcesInDLSessionsMaxOrderByAggregateInput = {
    extractedResourceId?: SortOrder
    dLSessionId?: SortOrder
    status?: SortOrder
  }

  export type ExtractedResourcesInDLSessionsMinOrderByAggregateInput = {
    extractedResourceId?: SortOrder
    dLSessionId?: SortOrder
    status?: SortOrder
  }

  export type LabelCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    abbreviation?: SortOrder
  }

  export type LabelMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    abbreviation?: SortOrder
  }

  export type LabelMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    abbreviation?: SortOrder
  }

  export type LabelRelationFilter = {
    is?: LabelWhereInput
    isNot?: LabelWhereInput
  }

  export type LabelsInDLSessionsLabelIdDLSessionIdCompoundUniqueInput = {
    labelId: string
    dLSessionId: string
  }

  export type LabelsInDLSessionsCountOrderByAggregateInput = {
    labelId?: SortOrder
    dLSessionId?: SortOrder
  }

  export type LabelsInDLSessionsMaxOrderByAggregateInput = {
    labelId?: SortOrder
    dLSessionId?: SortOrder
  }

  export type LabelsInDLSessionsMinOrderByAggregateInput = {
    labelId?: SortOrder
    dLSessionId?: SortOrder
  }

  export type ExtractedResourcesInDLSessionsRelationFilter = {
    is?: ExtractedResourcesInDLSessionsWhereInput
    isNot?: ExtractedResourcesInDLSessionsWhereInput
  }

  export type LabelsInExtractedResourcesInDLSessionsLabelIdExtractedResourceIdDLSessionIdCompoundUniqueInput = {
    labelId: string
    extractedResourceId: string
    dLSessionId: string
  }

  export type LabelsInExtractedResourcesInDLSessionsCountOrderByAggregateInput = {
    labelId?: SortOrder
    extractedResourceId?: SortOrder
    dLSessionId?: SortOrder
  }

  export type LabelsInExtractedResourcesInDLSessionsMaxOrderByAggregateInput = {
    labelId?: SortOrder
    extractedResourceId?: SortOrder
    dLSessionId?: SortOrder
  }

  export type LabelsInExtractedResourcesInDLSessionsMinOrderByAggregateInput = {
    labelId?: SortOrder
    extractedResourceId?: SortOrder
    dLSessionId?: SortOrder
  }

  export type VisitListRelationFilter = {
    every?: VisitWhereInput
    some?: VisitWhereInput
    none?: VisitWhereInput
  }

  export type VisitOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PatientCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EpicRelationFilter = {
    is?: EpicWhereInput
    isNot?: EpicWhereInput
  }

  export type CESessionListRelationFilter = {
    every?: CESessionWhereInput
    some?: CESessionWhereInput
    none?: CESessionWhereInput
  }

  export type DLSessionListRelationFilter = {
    every?: DLSessionWhereInput
    some?: DLSessionWhereInput
    none?: DLSessionWhereInput
  }

  export type RASessionListRelationFilter = {
    every?: RASessionWhereInput
    some?: RASessionWhereInput
    none?: RASessionWhereInput
  }

  export type UsersInProjectsListRelationFilter = {
    every?: UsersInProjectsWhereInput
    some?: UsersInProjectsWhereInput
    none?: UsersInProjectsWhereInput
  }

  export type CESessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DLSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RASessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UsersInProjectsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
    epicId?: SortOrder
  }

  export type ProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
    epicId?: SortOrder
  }

  export type ProjectMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
    epicId?: SortOrder
  }

  export type UsersInRASessionsListRelationFilter = {
    every?: UsersInRASessionsWhereInput
    some?: UsersInRASessionsWhereInput
    none?: UsersInRASessionsWhereInput
  }

  export type VisitsInRASessionsListRelationFilter = {
    every?: VisitsInRASessionsWhereInput
    some?: VisitsInRASessionsWhereInput
    none?: VisitsInRASessionsWhereInput
  }

  export type UsersInRASessionsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VisitsInRASessionsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RASessionCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
    priority?: SortOrder
    sop?: SortOrder
    template?: SortOrder
    projectId?: SortOrder
  }

  export type RASessionAvgOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type RASessionMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
    priority?: SortOrder
    projectId?: SortOrder
  }

  export type RASessionMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
    priority?: SortOrder
    projectId?: SortOrder
  }

  export type RASessionSumOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type VisitRelationFilter = {
    is?: VisitWhereInput
    isNot?: VisitWhereInput
  }

  export type ExtractedResourceListRelationFilter = {
    every?: ExtractedResourceWhereInput
    some?: ExtractedResourceWhereInput
    none?: ExtractedResourceWhereInput
  }

  export type ExtractedResourceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RawResourceCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    metadata?: SortOrder
    machine?: SortOrder
    center?: SortOrder
    visitId?: SortOrder
  }

  export type RawResourceMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    machine?: SortOrder
    center?: SortOrder
    visitId?: SortOrder
  }

  export type RawResourceMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    machine?: SortOrder
    center?: SortOrder
    visitId?: SortOrder
  }

  export type EnumSessionUserRoleFilter = {
    equals?: SessionUserRole
    in?: Enumerable<SessionUserRole>
    notIn?: Enumerable<SessionUserRole>
    not?: NestedEnumSessionUserRoleFilter | SessionUserRole
  }

  export type UsersInCESessionsUserIdCESessionIdUserRoleCompoundUniqueInput = {
    userId: string
    cESessionId: string
    userRole: SessionUserRole
  }

  export type UsersInCESessionsCountOrderByAggregateInput = {
    userId?: SortOrder
    cESessionId?: SortOrder
    userRole?: SortOrder
  }

  export type UsersInCESessionsMaxOrderByAggregateInput = {
    userId?: SortOrder
    cESessionId?: SortOrder
    userRole?: SortOrder
  }

  export type UsersInCESessionsMinOrderByAggregateInput = {
    userId?: SortOrder
    cESessionId?: SortOrder
    userRole?: SortOrder
  }

  export type EnumSessionUserRoleWithAggregatesFilter = {
    equals?: SessionUserRole
    in?: Enumerable<SessionUserRole>
    notIn?: Enumerable<SessionUserRole>
    not?: NestedEnumSessionUserRoleWithAggregatesFilter | SessionUserRole
    _count?: NestedIntFilter
    _min?: NestedEnumSessionUserRoleFilter
    _max?: NestedEnumSessionUserRoleFilter
  }

  export type UsersInDLSessionsUserIdDLSessionIdUserRoleCompoundUniqueInput = {
    userId: string
    dLSessionId: string
    userRole: SessionUserRole
  }

  export type UsersInDLSessionsCountOrderByAggregateInput = {
    userId?: SortOrder
    dLSessionId?: SortOrder
    userRole?: SortOrder
  }

  export type UsersInDLSessionsMaxOrderByAggregateInput = {
    userId?: SortOrder
    dLSessionId?: SortOrder
    userRole?: SortOrder
  }

  export type UsersInDLSessionsMinOrderByAggregateInput = {
    userId?: SortOrder
    dLSessionId?: SortOrder
    userRole?: SortOrder
  }

  export type EnumProjectUserRoleFilter = {
    equals?: ProjectUserRole
    in?: Enumerable<ProjectUserRole>
    notIn?: Enumerable<ProjectUserRole>
    not?: NestedEnumProjectUserRoleFilter | ProjectUserRole
  }

  export type UsersInProjectsUserIdProjectIdUserRoleCompoundUniqueInput = {
    userId: string
    projectId: string
    userRole: ProjectUserRole
  }

  export type UsersInProjectsCountOrderByAggregateInput = {
    userId?: SortOrder
    projectId?: SortOrder
    userRole?: SortOrder
  }

  export type UsersInProjectsMaxOrderByAggregateInput = {
    userId?: SortOrder
    projectId?: SortOrder
    userRole?: SortOrder
  }

  export type UsersInProjectsMinOrderByAggregateInput = {
    userId?: SortOrder
    projectId?: SortOrder
    userRole?: SortOrder
  }

  export type EnumProjectUserRoleWithAggregatesFilter = {
    equals?: ProjectUserRole
    in?: Enumerable<ProjectUserRole>
    notIn?: Enumerable<ProjectUserRole>
    not?: NestedEnumProjectUserRoleWithAggregatesFilter | ProjectUserRole
    _count?: NestedIntFilter
    _min?: NestedEnumProjectUserRoleFilter
    _max?: NestedEnumProjectUserRoleFilter
  }

  export type RASessionRelationFilter = {
    is?: RASessionWhereInput
    isNot?: RASessionWhereInput
  }

  export type UsersInRASessionsUserIdRASessionIdUserRoleCompoundUniqueInput = {
    userId: string
    rASessionId: string
    userRole: SessionUserRole
  }

  export type UsersInRASessionsCountOrderByAggregateInput = {
    userId?: SortOrder
    rASessionId?: SortOrder
    userRole?: SortOrder
  }

  export type UsersInRASessionsMaxOrderByAggregateInput = {
    userId?: SortOrder
    rASessionId?: SortOrder
    userRole?: SortOrder
  }

  export type UsersInRASessionsMinOrderByAggregateInput = {
    userId?: SortOrder
    rASessionId?: SortOrder
    userRole?: SortOrder
  }

  export type PatientRelationFilter = {
    is?: PatientWhereInput
    isNot?: PatientWhereInput
  }

  export type RawResourceListRelationFilter = {
    every?: RawResourceWhereInput
    some?: RawResourceWhereInput
    none?: RawResourceWhereInput
  }

  export type RawResourceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VisitCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    patientId?: SortOrder
  }

  export type VisitMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    patientId?: SortOrder
  }

  export type VisitMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    patientId?: SortOrder
  }

  export type VisitsInRASessionsRASessionIdIndexCompoundUniqueInput = {
    rASessionId: string
    index: number
  }

  export type VisitsInRASessionsVisitIdRASessionIdCompoundUniqueInput = {
    visitId: string
    rASessionId: string
  }

  export type VisitsInRASessionsCountOrderByAggregateInput = {
    visitId?: SortOrder
    rASessionId?: SortOrder
    index?: SortOrder
    content?: SortOrder
    status?: SortOrder
    result?: SortOrder
  }

  export type VisitsInRASessionsAvgOrderByAggregateInput = {
    index?: SortOrder
  }

  export type VisitsInRASessionsMaxOrderByAggregateInput = {
    visitId?: SortOrder
    rASessionId?: SortOrder
    index?: SortOrder
    status?: SortOrder
  }

  export type VisitsInRASessionsMinOrderByAggregateInput = {
    visitId?: SortOrder
    rASessionId?: SortOrder
    index?: SortOrder
    status?: SortOrder
  }

  export type VisitsInRASessionsSumOrderByAggregateInput = {
    index?: SortOrder
  }

  export type CESessionCreatesopInput = {
    set: Enumerable<string>
  }

  export type ProjectCreateNestedOneWithoutCESessionInput = {
    create?: XOR<ProjectCreateWithoutCESessionInput, ProjectUncheckedCreateWithoutCESessionInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutCESessionInput
    connect?: ProjectWhereUniqueInput
  }

  export type ExtractedResourcesInCESessionsCreateNestedManyWithoutCESessionInput = {
    create?: XOR<Enumerable<ExtractedResourcesInCESessionsCreateWithoutCESessionInput>, Enumerable<ExtractedResourcesInCESessionsUncheckedCreateWithoutCESessionInput>>
    connectOrCreate?: Enumerable<ExtractedResourcesInCESessionsCreateOrConnectWithoutCESessionInput>
    createMany?: ExtractedResourcesInCESessionsCreateManyCESessionInputEnvelope
    connect?: Enumerable<ExtractedResourcesInCESessionsWhereUniqueInput>
  }

  export type UsersInCESessionsCreateNestedManyWithoutCESessionInput = {
    create?: XOR<Enumerable<UsersInCESessionsCreateWithoutCESessionInput>, Enumerable<UsersInCESessionsUncheckedCreateWithoutCESessionInput>>
    connectOrCreate?: Enumerable<UsersInCESessionsCreateOrConnectWithoutCESessionInput>
    createMany?: UsersInCESessionsCreateManyCESessionInputEnvelope
    connect?: Enumerable<UsersInCESessionsWhereUniqueInput>
  }

  export type ExtractedResourcesInCESessionsUncheckedCreateNestedManyWithoutCESessionInput = {
    create?: XOR<Enumerable<ExtractedResourcesInCESessionsCreateWithoutCESessionInput>, Enumerable<ExtractedResourcesInCESessionsUncheckedCreateWithoutCESessionInput>>
    connectOrCreate?: Enumerable<ExtractedResourcesInCESessionsCreateOrConnectWithoutCESessionInput>
    createMany?: ExtractedResourcesInCESessionsCreateManyCESessionInputEnvelope
    connect?: Enumerable<ExtractedResourcesInCESessionsWhereUniqueInput>
  }

  export type UsersInCESessionsUncheckedCreateNestedManyWithoutCESessionInput = {
    create?: XOR<Enumerable<UsersInCESessionsCreateWithoutCESessionInput>, Enumerable<UsersInCESessionsUncheckedCreateWithoutCESessionInput>>
    connectOrCreate?: Enumerable<UsersInCESessionsCreateOrConnectWithoutCESessionInput>
    createMany?: UsersInCESessionsCreateManyCESessionInputEnvelope
    connect?: Enumerable<UsersInCESessionsWhereUniqueInput>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CESessionUpdatesopInput = {
    set?: Enumerable<string>
    push?: string | Enumerable<string>
  }

  export type ProjectUpdateOneRequiredWithoutCESessionNestedInput = {
    create?: XOR<ProjectCreateWithoutCESessionInput, ProjectUncheckedCreateWithoutCESessionInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutCESessionInput
    upsert?: ProjectUpsertWithoutCESessionInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<ProjectUpdateWithoutCESessionInput, ProjectUncheckedUpdateWithoutCESessionInput>
  }

  export type ExtractedResourcesInCESessionsUpdateManyWithoutCESessionNestedInput = {
    create?: XOR<Enumerable<ExtractedResourcesInCESessionsCreateWithoutCESessionInput>, Enumerable<ExtractedResourcesInCESessionsUncheckedCreateWithoutCESessionInput>>
    connectOrCreate?: Enumerable<ExtractedResourcesInCESessionsCreateOrConnectWithoutCESessionInput>
    upsert?: Enumerable<ExtractedResourcesInCESessionsUpsertWithWhereUniqueWithoutCESessionInput>
    createMany?: ExtractedResourcesInCESessionsCreateManyCESessionInputEnvelope
    set?: Enumerable<ExtractedResourcesInCESessionsWhereUniqueInput>
    disconnect?: Enumerable<ExtractedResourcesInCESessionsWhereUniqueInput>
    delete?: Enumerable<ExtractedResourcesInCESessionsWhereUniqueInput>
    connect?: Enumerable<ExtractedResourcesInCESessionsWhereUniqueInput>
    update?: Enumerable<ExtractedResourcesInCESessionsUpdateWithWhereUniqueWithoutCESessionInput>
    updateMany?: Enumerable<ExtractedResourcesInCESessionsUpdateManyWithWhereWithoutCESessionInput>
    deleteMany?: Enumerable<ExtractedResourcesInCESessionsScalarWhereInput>
  }

  export type UsersInCESessionsUpdateManyWithoutCESessionNestedInput = {
    create?: XOR<Enumerable<UsersInCESessionsCreateWithoutCESessionInput>, Enumerable<UsersInCESessionsUncheckedCreateWithoutCESessionInput>>
    connectOrCreate?: Enumerable<UsersInCESessionsCreateOrConnectWithoutCESessionInput>
    upsert?: Enumerable<UsersInCESessionsUpsertWithWhereUniqueWithoutCESessionInput>
    createMany?: UsersInCESessionsCreateManyCESessionInputEnvelope
    set?: Enumerable<UsersInCESessionsWhereUniqueInput>
    disconnect?: Enumerable<UsersInCESessionsWhereUniqueInput>
    delete?: Enumerable<UsersInCESessionsWhereUniqueInput>
    connect?: Enumerable<UsersInCESessionsWhereUniqueInput>
    update?: Enumerable<UsersInCESessionsUpdateWithWhereUniqueWithoutCESessionInput>
    updateMany?: Enumerable<UsersInCESessionsUpdateManyWithWhereWithoutCESessionInput>
    deleteMany?: Enumerable<UsersInCESessionsScalarWhereInput>
  }

  export type ExtractedResourcesInCESessionsUncheckedUpdateManyWithoutCESessionNestedInput = {
    create?: XOR<Enumerable<ExtractedResourcesInCESessionsCreateWithoutCESessionInput>, Enumerable<ExtractedResourcesInCESessionsUncheckedCreateWithoutCESessionInput>>
    connectOrCreate?: Enumerable<ExtractedResourcesInCESessionsCreateOrConnectWithoutCESessionInput>
    upsert?: Enumerable<ExtractedResourcesInCESessionsUpsertWithWhereUniqueWithoutCESessionInput>
    createMany?: ExtractedResourcesInCESessionsCreateManyCESessionInputEnvelope
    set?: Enumerable<ExtractedResourcesInCESessionsWhereUniqueInput>
    disconnect?: Enumerable<ExtractedResourcesInCESessionsWhereUniqueInput>
    delete?: Enumerable<ExtractedResourcesInCESessionsWhereUniqueInput>
    connect?: Enumerable<ExtractedResourcesInCESessionsWhereUniqueInput>
    update?: Enumerable<ExtractedResourcesInCESessionsUpdateWithWhereUniqueWithoutCESessionInput>
    updateMany?: Enumerable<ExtractedResourcesInCESessionsUpdateManyWithWhereWithoutCESessionInput>
    deleteMany?: Enumerable<ExtractedResourcesInCESessionsScalarWhereInput>
  }

  export type UsersInCESessionsUncheckedUpdateManyWithoutCESessionNestedInput = {
    create?: XOR<Enumerable<UsersInCESessionsCreateWithoutCESessionInput>, Enumerable<UsersInCESessionsUncheckedCreateWithoutCESessionInput>>
    connectOrCreate?: Enumerable<UsersInCESessionsCreateOrConnectWithoutCESessionInput>
    upsert?: Enumerable<UsersInCESessionsUpsertWithWhereUniqueWithoutCESessionInput>
    createMany?: UsersInCESessionsCreateManyCESessionInputEnvelope
    set?: Enumerable<UsersInCESessionsWhereUniqueInput>
    disconnect?: Enumerable<UsersInCESessionsWhereUniqueInput>
    delete?: Enumerable<UsersInCESessionsWhereUniqueInput>
    connect?: Enumerable<UsersInCESessionsWhereUniqueInput>
    update?: Enumerable<UsersInCESessionsUpdateWithWhereUniqueWithoutCESessionInput>
    updateMany?: Enumerable<UsersInCESessionsUpdateManyWithWhereWithoutCESessionInput>
    deleteMany?: Enumerable<UsersInCESessionsScalarWhereInput>
  }

  export type DLSessionCreatesopInput = {
    set: Enumerable<string>
  }

  export type ProjectCreateNestedOneWithoutDLSessionInput = {
    create?: XOR<ProjectCreateWithoutDLSessionInput, ProjectUncheckedCreateWithoutDLSessionInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutDLSessionInput
    connect?: ProjectWhereUniqueInput
  }

  export type ExtractedResourcesInDLSessionsCreateNestedManyWithoutDLSessionInput = {
    create?: XOR<Enumerable<ExtractedResourcesInDLSessionsCreateWithoutDLSessionInput>, Enumerable<ExtractedResourcesInDLSessionsUncheckedCreateWithoutDLSessionInput>>
    connectOrCreate?: Enumerable<ExtractedResourcesInDLSessionsCreateOrConnectWithoutDLSessionInput>
    createMany?: ExtractedResourcesInDLSessionsCreateManyDLSessionInputEnvelope
    connect?: Enumerable<ExtractedResourcesInDLSessionsWhereUniqueInput>
  }

  export type LabelsInDLSessionsCreateNestedManyWithoutDLSessionInput = {
    create?: XOR<Enumerable<LabelsInDLSessionsCreateWithoutDLSessionInput>, Enumerable<LabelsInDLSessionsUncheckedCreateWithoutDLSessionInput>>
    connectOrCreate?: Enumerable<LabelsInDLSessionsCreateOrConnectWithoutDLSessionInput>
    createMany?: LabelsInDLSessionsCreateManyDLSessionInputEnvelope
    connect?: Enumerable<LabelsInDLSessionsWhereUniqueInput>
  }

  export type UsersInDLSessionsCreateNestedManyWithoutDLSessionInput = {
    create?: XOR<Enumerable<UsersInDLSessionsCreateWithoutDLSessionInput>, Enumerable<UsersInDLSessionsUncheckedCreateWithoutDLSessionInput>>
    connectOrCreate?: Enumerable<UsersInDLSessionsCreateOrConnectWithoutDLSessionInput>
    createMany?: UsersInDLSessionsCreateManyDLSessionInputEnvelope
    connect?: Enumerable<UsersInDLSessionsWhereUniqueInput>
  }

  export type ExtractedResourcesInDLSessionsUncheckedCreateNestedManyWithoutDLSessionInput = {
    create?: XOR<Enumerable<ExtractedResourcesInDLSessionsCreateWithoutDLSessionInput>, Enumerable<ExtractedResourcesInDLSessionsUncheckedCreateWithoutDLSessionInput>>
    connectOrCreate?: Enumerable<ExtractedResourcesInDLSessionsCreateOrConnectWithoutDLSessionInput>
    createMany?: ExtractedResourcesInDLSessionsCreateManyDLSessionInputEnvelope
    connect?: Enumerable<ExtractedResourcesInDLSessionsWhereUniqueInput>
  }

  export type LabelsInDLSessionsUncheckedCreateNestedManyWithoutDLSessionInput = {
    create?: XOR<Enumerable<LabelsInDLSessionsCreateWithoutDLSessionInput>, Enumerable<LabelsInDLSessionsUncheckedCreateWithoutDLSessionInput>>
    connectOrCreate?: Enumerable<LabelsInDLSessionsCreateOrConnectWithoutDLSessionInput>
    createMany?: LabelsInDLSessionsCreateManyDLSessionInputEnvelope
    connect?: Enumerable<LabelsInDLSessionsWhereUniqueInput>
  }

  export type UsersInDLSessionsUncheckedCreateNestedManyWithoutDLSessionInput = {
    create?: XOR<Enumerable<UsersInDLSessionsCreateWithoutDLSessionInput>, Enumerable<UsersInDLSessionsUncheckedCreateWithoutDLSessionInput>>
    connectOrCreate?: Enumerable<UsersInDLSessionsCreateOrConnectWithoutDLSessionInput>
    createMany?: UsersInDLSessionsCreateManyDLSessionInputEnvelope
    connect?: Enumerable<UsersInDLSessionsWhereUniqueInput>
  }

  export type DLSessionUpdatesopInput = {
    set?: Enumerable<string>
    push?: string | Enumerable<string>
  }

  export type ProjectUpdateOneRequiredWithoutDLSessionNestedInput = {
    create?: XOR<ProjectCreateWithoutDLSessionInput, ProjectUncheckedCreateWithoutDLSessionInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutDLSessionInput
    upsert?: ProjectUpsertWithoutDLSessionInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<ProjectUpdateWithoutDLSessionInput, ProjectUncheckedUpdateWithoutDLSessionInput>
  }

  export type ExtractedResourcesInDLSessionsUpdateManyWithoutDLSessionNestedInput = {
    create?: XOR<Enumerable<ExtractedResourcesInDLSessionsCreateWithoutDLSessionInput>, Enumerable<ExtractedResourcesInDLSessionsUncheckedCreateWithoutDLSessionInput>>
    connectOrCreate?: Enumerable<ExtractedResourcesInDLSessionsCreateOrConnectWithoutDLSessionInput>
    upsert?: Enumerable<ExtractedResourcesInDLSessionsUpsertWithWhereUniqueWithoutDLSessionInput>
    createMany?: ExtractedResourcesInDLSessionsCreateManyDLSessionInputEnvelope
    set?: Enumerable<ExtractedResourcesInDLSessionsWhereUniqueInput>
    disconnect?: Enumerable<ExtractedResourcesInDLSessionsWhereUniqueInput>
    delete?: Enumerable<ExtractedResourcesInDLSessionsWhereUniqueInput>
    connect?: Enumerable<ExtractedResourcesInDLSessionsWhereUniqueInput>
    update?: Enumerable<ExtractedResourcesInDLSessionsUpdateWithWhereUniqueWithoutDLSessionInput>
    updateMany?: Enumerable<ExtractedResourcesInDLSessionsUpdateManyWithWhereWithoutDLSessionInput>
    deleteMany?: Enumerable<ExtractedResourcesInDLSessionsScalarWhereInput>
  }

  export type LabelsInDLSessionsUpdateManyWithoutDLSessionNestedInput = {
    create?: XOR<Enumerable<LabelsInDLSessionsCreateWithoutDLSessionInput>, Enumerable<LabelsInDLSessionsUncheckedCreateWithoutDLSessionInput>>
    connectOrCreate?: Enumerable<LabelsInDLSessionsCreateOrConnectWithoutDLSessionInput>
    upsert?: Enumerable<LabelsInDLSessionsUpsertWithWhereUniqueWithoutDLSessionInput>
    createMany?: LabelsInDLSessionsCreateManyDLSessionInputEnvelope
    set?: Enumerable<LabelsInDLSessionsWhereUniqueInput>
    disconnect?: Enumerable<LabelsInDLSessionsWhereUniqueInput>
    delete?: Enumerable<LabelsInDLSessionsWhereUniqueInput>
    connect?: Enumerable<LabelsInDLSessionsWhereUniqueInput>
    update?: Enumerable<LabelsInDLSessionsUpdateWithWhereUniqueWithoutDLSessionInput>
    updateMany?: Enumerable<LabelsInDLSessionsUpdateManyWithWhereWithoutDLSessionInput>
    deleteMany?: Enumerable<LabelsInDLSessionsScalarWhereInput>
  }

  export type UsersInDLSessionsUpdateManyWithoutDLSessionNestedInput = {
    create?: XOR<Enumerable<UsersInDLSessionsCreateWithoutDLSessionInput>, Enumerable<UsersInDLSessionsUncheckedCreateWithoutDLSessionInput>>
    connectOrCreate?: Enumerable<UsersInDLSessionsCreateOrConnectWithoutDLSessionInput>
    upsert?: Enumerable<UsersInDLSessionsUpsertWithWhereUniqueWithoutDLSessionInput>
    createMany?: UsersInDLSessionsCreateManyDLSessionInputEnvelope
    set?: Enumerable<UsersInDLSessionsWhereUniqueInput>
    disconnect?: Enumerable<UsersInDLSessionsWhereUniqueInput>
    delete?: Enumerable<UsersInDLSessionsWhereUniqueInput>
    connect?: Enumerable<UsersInDLSessionsWhereUniqueInput>
    update?: Enumerable<UsersInDLSessionsUpdateWithWhereUniqueWithoutDLSessionInput>
    updateMany?: Enumerable<UsersInDLSessionsUpdateManyWithWhereWithoutDLSessionInput>
    deleteMany?: Enumerable<UsersInDLSessionsScalarWhereInput>
  }

  export type ExtractedResourcesInDLSessionsUncheckedUpdateManyWithoutDLSessionNestedInput = {
    create?: XOR<Enumerable<ExtractedResourcesInDLSessionsCreateWithoutDLSessionInput>, Enumerable<ExtractedResourcesInDLSessionsUncheckedCreateWithoutDLSessionInput>>
    connectOrCreate?: Enumerable<ExtractedResourcesInDLSessionsCreateOrConnectWithoutDLSessionInput>
    upsert?: Enumerable<ExtractedResourcesInDLSessionsUpsertWithWhereUniqueWithoutDLSessionInput>
    createMany?: ExtractedResourcesInDLSessionsCreateManyDLSessionInputEnvelope
    set?: Enumerable<ExtractedResourcesInDLSessionsWhereUniqueInput>
    disconnect?: Enumerable<ExtractedResourcesInDLSessionsWhereUniqueInput>
    delete?: Enumerable<ExtractedResourcesInDLSessionsWhereUniqueInput>
    connect?: Enumerable<ExtractedResourcesInDLSessionsWhereUniqueInput>
    update?: Enumerable<ExtractedResourcesInDLSessionsUpdateWithWhereUniqueWithoutDLSessionInput>
    updateMany?: Enumerable<ExtractedResourcesInDLSessionsUpdateManyWithWhereWithoutDLSessionInput>
    deleteMany?: Enumerable<ExtractedResourcesInDLSessionsScalarWhereInput>
  }

  export type LabelsInDLSessionsUncheckedUpdateManyWithoutDLSessionNestedInput = {
    create?: XOR<Enumerable<LabelsInDLSessionsCreateWithoutDLSessionInput>, Enumerable<LabelsInDLSessionsUncheckedCreateWithoutDLSessionInput>>
    connectOrCreate?: Enumerable<LabelsInDLSessionsCreateOrConnectWithoutDLSessionInput>
    upsert?: Enumerable<LabelsInDLSessionsUpsertWithWhereUniqueWithoutDLSessionInput>
    createMany?: LabelsInDLSessionsCreateManyDLSessionInputEnvelope
    set?: Enumerable<LabelsInDLSessionsWhereUniqueInput>
    disconnect?: Enumerable<LabelsInDLSessionsWhereUniqueInput>
    delete?: Enumerable<LabelsInDLSessionsWhereUniqueInput>
    connect?: Enumerable<LabelsInDLSessionsWhereUniqueInput>
    update?: Enumerable<LabelsInDLSessionsUpdateWithWhereUniqueWithoutDLSessionInput>
    updateMany?: Enumerable<LabelsInDLSessionsUpdateManyWithWhereWithoutDLSessionInput>
    deleteMany?: Enumerable<LabelsInDLSessionsScalarWhereInput>
  }

  export type UsersInDLSessionsUncheckedUpdateManyWithoutDLSessionNestedInput = {
    create?: XOR<Enumerable<UsersInDLSessionsCreateWithoutDLSessionInput>, Enumerable<UsersInDLSessionsUncheckedCreateWithoutDLSessionInput>>
    connectOrCreate?: Enumerable<UsersInDLSessionsCreateOrConnectWithoutDLSessionInput>
    upsert?: Enumerable<UsersInDLSessionsUpsertWithWhereUniqueWithoutDLSessionInput>
    createMany?: UsersInDLSessionsCreateManyDLSessionInputEnvelope
    set?: Enumerable<UsersInDLSessionsWhereUniqueInput>
    disconnect?: Enumerable<UsersInDLSessionsWhereUniqueInput>
    delete?: Enumerable<UsersInDLSessionsWhereUniqueInput>
    connect?: Enumerable<UsersInDLSessionsWhereUniqueInput>
    update?: Enumerable<UsersInDLSessionsUpdateWithWhereUniqueWithoutDLSessionInput>
    updateMany?: Enumerable<UsersInDLSessionsUpdateManyWithWhereWithoutDLSessionInput>
    deleteMany?: Enumerable<UsersInDLSessionsScalarWhereInput>
  }

  export type ProjectCreateNestedManyWithoutEpicInput = {
    create?: XOR<Enumerable<ProjectCreateWithoutEpicInput>, Enumerable<ProjectUncheckedCreateWithoutEpicInput>>
    connectOrCreate?: Enumerable<ProjectCreateOrConnectWithoutEpicInput>
    createMany?: ProjectCreateManyEpicInputEnvelope
    connect?: Enumerable<ProjectWhereUniqueInput>
  }

  export type ProjectUncheckedCreateNestedManyWithoutEpicInput = {
    create?: XOR<Enumerable<ProjectCreateWithoutEpicInput>, Enumerable<ProjectUncheckedCreateWithoutEpicInput>>
    connectOrCreate?: Enumerable<ProjectCreateOrConnectWithoutEpicInput>
    createMany?: ProjectCreateManyEpicInputEnvelope
    connect?: Enumerable<ProjectWhereUniqueInput>
  }

  export type ProjectUpdateManyWithoutEpicNestedInput = {
    create?: XOR<Enumerable<ProjectCreateWithoutEpicInput>, Enumerable<ProjectUncheckedCreateWithoutEpicInput>>
    connectOrCreate?: Enumerable<ProjectCreateOrConnectWithoutEpicInput>
    upsert?: Enumerable<ProjectUpsertWithWhereUniqueWithoutEpicInput>
    createMany?: ProjectCreateManyEpicInputEnvelope
    set?: Enumerable<ProjectWhereUniqueInput>
    disconnect?: Enumerable<ProjectWhereUniqueInput>
    delete?: Enumerable<ProjectWhereUniqueInput>
    connect?: Enumerable<ProjectWhereUniqueInput>
    update?: Enumerable<ProjectUpdateWithWhereUniqueWithoutEpicInput>
    updateMany?: Enumerable<ProjectUpdateManyWithWhereWithoutEpicInput>
    deleteMany?: Enumerable<ProjectScalarWhereInput>
  }

  export type ProjectUncheckedUpdateManyWithoutEpicNestedInput = {
    create?: XOR<Enumerable<ProjectCreateWithoutEpicInput>, Enumerable<ProjectUncheckedCreateWithoutEpicInput>>
    connectOrCreate?: Enumerable<ProjectCreateOrConnectWithoutEpicInput>
    upsert?: Enumerable<ProjectUpsertWithWhereUniqueWithoutEpicInput>
    createMany?: ProjectCreateManyEpicInputEnvelope
    set?: Enumerable<ProjectWhereUniqueInput>
    disconnect?: Enumerable<ProjectWhereUniqueInput>
    delete?: Enumerable<ProjectWhereUniqueInput>
    connect?: Enumerable<ProjectWhereUniqueInput>
    update?: Enumerable<ProjectUpdateWithWhereUniqueWithoutEpicInput>
    updateMany?: Enumerable<ProjectUpdateManyWithWhereWithoutEpicInput>
    deleteMany?: Enumerable<ProjectScalarWhereInput>
  }

  export type RawResourceCreateNestedOneWithoutExtractedResourceInput = {
    create?: XOR<RawResourceCreateWithoutExtractedResourceInput, RawResourceUncheckedCreateWithoutExtractedResourceInput>
    connectOrCreate?: RawResourceCreateOrConnectWithoutExtractedResourceInput
    connect?: RawResourceWhereUniqueInput
  }

  export type ExtractedResourcesInCESessionsCreateNestedManyWithoutExtractedResourceInput = {
    create?: XOR<Enumerable<ExtractedResourcesInCESessionsCreateWithoutExtractedResourceInput>, Enumerable<ExtractedResourcesInCESessionsUncheckedCreateWithoutExtractedResourceInput>>
    connectOrCreate?: Enumerable<ExtractedResourcesInCESessionsCreateOrConnectWithoutExtractedResourceInput>
    createMany?: ExtractedResourcesInCESessionsCreateManyExtractedResourceInputEnvelope
    connect?: Enumerable<ExtractedResourcesInCESessionsWhereUniqueInput>
  }

  export type ExtractedResourcesInDLSessionsCreateNestedManyWithoutExtractedResourceInput = {
    create?: XOR<Enumerable<ExtractedResourcesInDLSessionsCreateWithoutExtractedResourceInput>, Enumerable<ExtractedResourcesInDLSessionsUncheckedCreateWithoutExtractedResourceInput>>
    connectOrCreate?: Enumerable<ExtractedResourcesInDLSessionsCreateOrConnectWithoutExtractedResourceInput>
    createMany?: ExtractedResourcesInDLSessionsCreateManyExtractedResourceInputEnvelope
    connect?: Enumerable<ExtractedResourcesInDLSessionsWhereUniqueInput>
  }

  export type ExtractedResourcesInCESessionsUncheckedCreateNestedManyWithoutExtractedResourceInput = {
    create?: XOR<Enumerable<ExtractedResourcesInCESessionsCreateWithoutExtractedResourceInput>, Enumerable<ExtractedResourcesInCESessionsUncheckedCreateWithoutExtractedResourceInput>>
    connectOrCreate?: Enumerable<ExtractedResourcesInCESessionsCreateOrConnectWithoutExtractedResourceInput>
    createMany?: ExtractedResourcesInCESessionsCreateManyExtractedResourceInputEnvelope
    connect?: Enumerable<ExtractedResourcesInCESessionsWhereUniqueInput>
  }

  export type ExtractedResourcesInDLSessionsUncheckedCreateNestedManyWithoutExtractedResourceInput = {
    create?: XOR<Enumerable<ExtractedResourcesInDLSessionsCreateWithoutExtractedResourceInput>, Enumerable<ExtractedResourcesInDLSessionsUncheckedCreateWithoutExtractedResourceInput>>
    connectOrCreate?: Enumerable<ExtractedResourcesInDLSessionsCreateOrConnectWithoutExtractedResourceInput>
    createMany?: ExtractedResourcesInDLSessionsCreateManyExtractedResourceInputEnvelope
    connect?: Enumerable<ExtractedResourcesInDLSessionsWhereUniqueInput>
  }

  export type RawResourceUpdateOneRequiredWithoutExtractedResourceNestedInput = {
    create?: XOR<RawResourceCreateWithoutExtractedResourceInput, RawResourceUncheckedCreateWithoutExtractedResourceInput>
    connectOrCreate?: RawResourceCreateOrConnectWithoutExtractedResourceInput
    upsert?: RawResourceUpsertWithoutExtractedResourceInput
    connect?: RawResourceWhereUniqueInput
    update?: XOR<RawResourceUpdateWithoutExtractedResourceInput, RawResourceUncheckedUpdateWithoutExtractedResourceInput>
  }

  export type ExtractedResourcesInCESessionsUpdateManyWithoutExtractedResourceNestedInput = {
    create?: XOR<Enumerable<ExtractedResourcesInCESessionsCreateWithoutExtractedResourceInput>, Enumerable<ExtractedResourcesInCESessionsUncheckedCreateWithoutExtractedResourceInput>>
    connectOrCreate?: Enumerable<ExtractedResourcesInCESessionsCreateOrConnectWithoutExtractedResourceInput>
    upsert?: Enumerable<ExtractedResourcesInCESessionsUpsertWithWhereUniqueWithoutExtractedResourceInput>
    createMany?: ExtractedResourcesInCESessionsCreateManyExtractedResourceInputEnvelope
    set?: Enumerable<ExtractedResourcesInCESessionsWhereUniqueInput>
    disconnect?: Enumerable<ExtractedResourcesInCESessionsWhereUniqueInput>
    delete?: Enumerable<ExtractedResourcesInCESessionsWhereUniqueInput>
    connect?: Enumerable<ExtractedResourcesInCESessionsWhereUniqueInput>
    update?: Enumerable<ExtractedResourcesInCESessionsUpdateWithWhereUniqueWithoutExtractedResourceInput>
    updateMany?: Enumerable<ExtractedResourcesInCESessionsUpdateManyWithWhereWithoutExtractedResourceInput>
    deleteMany?: Enumerable<ExtractedResourcesInCESessionsScalarWhereInput>
  }

  export type ExtractedResourcesInDLSessionsUpdateManyWithoutExtractedResourceNestedInput = {
    create?: XOR<Enumerable<ExtractedResourcesInDLSessionsCreateWithoutExtractedResourceInput>, Enumerable<ExtractedResourcesInDLSessionsUncheckedCreateWithoutExtractedResourceInput>>
    connectOrCreate?: Enumerable<ExtractedResourcesInDLSessionsCreateOrConnectWithoutExtractedResourceInput>
    upsert?: Enumerable<ExtractedResourcesInDLSessionsUpsertWithWhereUniqueWithoutExtractedResourceInput>
    createMany?: ExtractedResourcesInDLSessionsCreateManyExtractedResourceInputEnvelope
    set?: Enumerable<ExtractedResourcesInDLSessionsWhereUniqueInput>
    disconnect?: Enumerable<ExtractedResourcesInDLSessionsWhereUniqueInput>
    delete?: Enumerable<ExtractedResourcesInDLSessionsWhereUniqueInput>
    connect?: Enumerable<ExtractedResourcesInDLSessionsWhereUniqueInput>
    update?: Enumerable<ExtractedResourcesInDLSessionsUpdateWithWhereUniqueWithoutExtractedResourceInput>
    updateMany?: Enumerable<ExtractedResourcesInDLSessionsUpdateManyWithWhereWithoutExtractedResourceInput>
    deleteMany?: Enumerable<ExtractedResourcesInDLSessionsScalarWhereInput>
  }

  export type ExtractedResourcesInCESessionsUncheckedUpdateManyWithoutExtractedResourceNestedInput = {
    create?: XOR<Enumerable<ExtractedResourcesInCESessionsCreateWithoutExtractedResourceInput>, Enumerable<ExtractedResourcesInCESessionsUncheckedCreateWithoutExtractedResourceInput>>
    connectOrCreate?: Enumerable<ExtractedResourcesInCESessionsCreateOrConnectWithoutExtractedResourceInput>
    upsert?: Enumerable<ExtractedResourcesInCESessionsUpsertWithWhereUniqueWithoutExtractedResourceInput>
    createMany?: ExtractedResourcesInCESessionsCreateManyExtractedResourceInputEnvelope
    set?: Enumerable<ExtractedResourcesInCESessionsWhereUniqueInput>
    disconnect?: Enumerable<ExtractedResourcesInCESessionsWhereUniqueInput>
    delete?: Enumerable<ExtractedResourcesInCESessionsWhereUniqueInput>
    connect?: Enumerable<ExtractedResourcesInCESessionsWhereUniqueInput>
    update?: Enumerable<ExtractedResourcesInCESessionsUpdateWithWhereUniqueWithoutExtractedResourceInput>
    updateMany?: Enumerable<ExtractedResourcesInCESessionsUpdateManyWithWhereWithoutExtractedResourceInput>
    deleteMany?: Enumerable<ExtractedResourcesInCESessionsScalarWhereInput>
  }

  export type ExtractedResourcesInDLSessionsUncheckedUpdateManyWithoutExtractedResourceNestedInput = {
    create?: XOR<Enumerable<ExtractedResourcesInDLSessionsCreateWithoutExtractedResourceInput>, Enumerable<ExtractedResourcesInDLSessionsUncheckedCreateWithoutExtractedResourceInput>>
    connectOrCreate?: Enumerable<ExtractedResourcesInDLSessionsCreateOrConnectWithoutExtractedResourceInput>
    upsert?: Enumerable<ExtractedResourcesInDLSessionsUpsertWithWhereUniqueWithoutExtractedResourceInput>
    createMany?: ExtractedResourcesInDLSessionsCreateManyExtractedResourceInputEnvelope
    set?: Enumerable<ExtractedResourcesInDLSessionsWhereUniqueInput>
    disconnect?: Enumerable<ExtractedResourcesInDLSessionsWhereUniqueInput>
    delete?: Enumerable<ExtractedResourcesInDLSessionsWhereUniqueInput>
    connect?: Enumerable<ExtractedResourcesInDLSessionsWhereUniqueInput>
    update?: Enumerable<ExtractedResourcesInDLSessionsUpdateWithWhereUniqueWithoutExtractedResourceInput>
    updateMany?: Enumerable<ExtractedResourcesInDLSessionsUpdateManyWithWhereWithoutExtractedResourceInput>
    deleteMany?: Enumerable<ExtractedResourcesInDLSessionsScalarWhereInput>
  }

  export type CESessionCreateNestedOneWithoutExtractedResourcesInCESessionsInput = {
    create?: XOR<CESessionCreateWithoutExtractedResourcesInCESessionsInput, CESessionUncheckedCreateWithoutExtractedResourcesInCESessionsInput>
    connectOrCreate?: CESessionCreateOrConnectWithoutExtractedResourcesInCESessionsInput
    connect?: CESessionWhereUniqueInput
  }

  export type ExtractedResourceCreateNestedOneWithoutExtractedResourcesInCESessionsInput = {
    create?: XOR<ExtractedResourceCreateWithoutExtractedResourcesInCESessionsInput, ExtractedResourceUncheckedCreateWithoutExtractedResourcesInCESessionsInput>
    connectOrCreate?: ExtractedResourceCreateOrConnectWithoutExtractedResourcesInCESessionsInput
    connect?: ExtractedResourceWhereUniqueInput
  }

  export type EnumExtractedResourceStatusFieldUpdateOperationsInput = {
    set?: ExtractedResourceStatus
  }

  export type CESessionUpdateOneRequiredWithoutExtractedResourcesInCESessionsNestedInput = {
    create?: XOR<CESessionCreateWithoutExtractedResourcesInCESessionsInput, CESessionUncheckedCreateWithoutExtractedResourcesInCESessionsInput>
    connectOrCreate?: CESessionCreateOrConnectWithoutExtractedResourcesInCESessionsInput
    upsert?: CESessionUpsertWithoutExtractedResourcesInCESessionsInput
    connect?: CESessionWhereUniqueInput
    update?: XOR<CESessionUpdateWithoutExtractedResourcesInCESessionsInput, CESessionUncheckedUpdateWithoutExtractedResourcesInCESessionsInput>
  }

  export type ExtractedResourceUpdateOneRequiredWithoutExtractedResourcesInCESessionsNestedInput = {
    create?: XOR<ExtractedResourceCreateWithoutExtractedResourcesInCESessionsInput, ExtractedResourceUncheckedCreateWithoutExtractedResourcesInCESessionsInput>
    connectOrCreate?: ExtractedResourceCreateOrConnectWithoutExtractedResourcesInCESessionsInput
    upsert?: ExtractedResourceUpsertWithoutExtractedResourcesInCESessionsInput
    connect?: ExtractedResourceWhereUniqueInput
    update?: XOR<ExtractedResourceUpdateWithoutExtractedResourcesInCESessionsInput, ExtractedResourceUncheckedUpdateWithoutExtractedResourcesInCESessionsInput>
  }

  export type DLSessionCreateNestedOneWithoutExtractedResourcesInDLSessionsInput = {
    create?: XOR<DLSessionCreateWithoutExtractedResourcesInDLSessionsInput, DLSessionUncheckedCreateWithoutExtractedResourcesInDLSessionsInput>
    connectOrCreate?: DLSessionCreateOrConnectWithoutExtractedResourcesInDLSessionsInput
    connect?: DLSessionWhereUniqueInput
  }

  export type ExtractedResourceCreateNestedOneWithoutExtractedResourcesInDLSessionsInput = {
    create?: XOR<ExtractedResourceCreateWithoutExtractedResourcesInDLSessionsInput, ExtractedResourceUncheckedCreateWithoutExtractedResourcesInDLSessionsInput>
    connectOrCreate?: ExtractedResourceCreateOrConnectWithoutExtractedResourcesInDLSessionsInput
    connect?: ExtractedResourceWhereUniqueInput
  }

  export type LabelsInExtractedResourcesInDLSessionsCreateNestedManyWithoutExtractedResourcesInDLSessionsInput = {
    create?: XOR<Enumerable<LabelsInExtractedResourcesInDLSessionsCreateWithoutExtractedResourcesInDLSessionsInput>, Enumerable<LabelsInExtractedResourcesInDLSessionsUncheckedCreateWithoutExtractedResourcesInDLSessionsInput>>
    connectOrCreate?: Enumerable<LabelsInExtractedResourcesInDLSessionsCreateOrConnectWithoutExtractedResourcesInDLSessionsInput>
    createMany?: LabelsInExtractedResourcesInDLSessionsCreateManyExtractedResourcesInDLSessionsInputEnvelope
    connect?: Enumerable<LabelsInExtractedResourcesInDLSessionsWhereUniqueInput>
  }

  export type LabelsInExtractedResourcesInDLSessionsUncheckedCreateNestedManyWithoutExtractedResourcesInDLSessionsInput = {
    create?: XOR<Enumerable<LabelsInExtractedResourcesInDLSessionsCreateWithoutExtractedResourcesInDLSessionsInput>, Enumerable<LabelsInExtractedResourcesInDLSessionsUncheckedCreateWithoutExtractedResourcesInDLSessionsInput>>
    connectOrCreate?: Enumerable<LabelsInExtractedResourcesInDLSessionsCreateOrConnectWithoutExtractedResourcesInDLSessionsInput>
    createMany?: LabelsInExtractedResourcesInDLSessionsCreateManyExtractedResourcesInDLSessionsInputEnvelope
    connect?: Enumerable<LabelsInExtractedResourcesInDLSessionsWhereUniqueInput>
  }

  export type DLSessionUpdateOneRequiredWithoutExtractedResourcesInDLSessionsNestedInput = {
    create?: XOR<DLSessionCreateWithoutExtractedResourcesInDLSessionsInput, DLSessionUncheckedCreateWithoutExtractedResourcesInDLSessionsInput>
    connectOrCreate?: DLSessionCreateOrConnectWithoutExtractedResourcesInDLSessionsInput
    upsert?: DLSessionUpsertWithoutExtractedResourcesInDLSessionsInput
    connect?: DLSessionWhereUniqueInput
    update?: XOR<DLSessionUpdateWithoutExtractedResourcesInDLSessionsInput, DLSessionUncheckedUpdateWithoutExtractedResourcesInDLSessionsInput>
  }

  export type ExtractedResourceUpdateOneRequiredWithoutExtractedResourcesInDLSessionsNestedInput = {
    create?: XOR<ExtractedResourceCreateWithoutExtractedResourcesInDLSessionsInput, ExtractedResourceUncheckedCreateWithoutExtractedResourcesInDLSessionsInput>
    connectOrCreate?: ExtractedResourceCreateOrConnectWithoutExtractedResourcesInDLSessionsInput
    upsert?: ExtractedResourceUpsertWithoutExtractedResourcesInDLSessionsInput
    connect?: ExtractedResourceWhereUniqueInput
    update?: XOR<ExtractedResourceUpdateWithoutExtractedResourcesInDLSessionsInput, ExtractedResourceUncheckedUpdateWithoutExtractedResourcesInDLSessionsInput>
  }

  export type LabelsInExtractedResourcesInDLSessionsUpdateManyWithoutExtractedResourcesInDLSessionsNestedInput = {
    create?: XOR<Enumerable<LabelsInExtractedResourcesInDLSessionsCreateWithoutExtractedResourcesInDLSessionsInput>, Enumerable<LabelsInExtractedResourcesInDLSessionsUncheckedCreateWithoutExtractedResourcesInDLSessionsInput>>
    connectOrCreate?: Enumerable<LabelsInExtractedResourcesInDLSessionsCreateOrConnectWithoutExtractedResourcesInDLSessionsInput>
    upsert?: Enumerable<LabelsInExtractedResourcesInDLSessionsUpsertWithWhereUniqueWithoutExtractedResourcesInDLSessionsInput>
    createMany?: LabelsInExtractedResourcesInDLSessionsCreateManyExtractedResourcesInDLSessionsInputEnvelope
    set?: Enumerable<LabelsInExtractedResourcesInDLSessionsWhereUniqueInput>
    disconnect?: Enumerable<LabelsInExtractedResourcesInDLSessionsWhereUniqueInput>
    delete?: Enumerable<LabelsInExtractedResourcesInDLSessionsWhereUniqueInput>
    connect?: Enumerable<LabelsInExtractedResourcesInDLSessionsWhereUniqueInput>
    update?: Enumerable<LabelsInExtractedResourcesInDLSessionsUpdateWithWhereUniqueWithoutExtractedResourcesInDLSessionsInput>
    updateMany?: Enumerable<LabelsInExtractedResourcesInDLSessionsUpdateManyWithWhereWithoutExtractedResourcesInDLSessionsInput>
    deleteMany?: Enumerable<LabelsInExtractedResourcesInDLSessionsScalarWhereInput>
  }

  export type LabelsInExtractedResourcesInDLSessionsUncheckedUpdateManyWithoutExtractedResourcesInDLSessionsNestedInput = {
    create?: XOR<Enumerable<LabelsInExtractedResourcesInDLSessionsCreateWithoutExtractedResourcesInDLSessionsInput>, Enumerable<LabelsInExtractedResourcesInDLSessionsUncheckedCreateWithoutExtractedResourcesInDLSessionsInput>>
    connectOrCreate?: Enumerable<LabelsInExtractedResourcesInDLSessionsCreateOrConnectWithoutExtractedResourcesInDLSessionsInput>
    upsert?: Enumerable<LabelsInExtractedResourcesInDLSessionsUpsertWithWhereUniqueWithoutExtractedResourcesInDLSessionsInput>
    createMany?: LabelsInExtractedResourcesInDLSessionsCreateManyExtractedResourcesInDLSessionsInputEnvelope
    set?: Enumerable<LabelsInExtractedResourcesInDLSessionsWhereUniqueInput>
    disconnect?: Enumerable<LabelsInExtractedResourcesInDLSessionsWhereUniqueInput>
    delete?: Enumerable<LabelsInExtractedResourcesInDLSessionsWhereUniqueInput>
    connect?: Enumerable<LabelsInExtractedResourcesInDLSessionsWhereUniqueInput>
    update?: Enumerable<LabelsInExtractedResourcesInDLSessionsUpdateWithWhereUniqueWithoutExtractedResourcesInDLSessionsInput>
    updateMany?: Enumerable<LabelsInExtractedResourcesInDLSessionsUpdateManyWithWhereWithoutExtractedResourcesInDLSessionsInput>
    deleteMany?: Enumerable<LabelsInExtractedResourcesInDLSessionsScalarWhereInput>
  }

  export type LabelsInDLSessionsCreateNestedManyWithoutLabelInput = {
    create?: XOR<Enumerable<LabelsInDLSessionsCreateWithoutLabelInput>, Enumerable<LabelsInDLSessionsUncheckedCreateWithoutLabelInput>>
    connectOrCreate?: Enumerable<LabelsInDLSessionsCreateOrConnectWithoutLabelInput>
    createMany?: LabelsInDLSessionsCreateManyLabelInputEnvelope
    connect?: Enumerable<LabelsInDLSessionsWhereUniqueInput>
  }

  export type LabelsInExtractedResourcesInDLSessionsCreateNestedManyWithoutLabelInput = {
    create?: XOR<Enumerable<LabelsInExtractedResourcesInDLSessionsCreateWithoutLabelInput>, Enumerable<LabelsInExtractedResourcesInDLSessionsUncheckedCreateWithoutLabelInput>>
    connectOrCreate?: Enumerable<LabelsInExtractedResourcesInDLSessionsCreateOrConnectWithoutLabelInput>
    createMany?: LabelsInExtractedResourcesInDLSessionsCreateManyLabelInputEnvelope
    connect?: Enumerable<LabelsInExtractedResourcesInDLSessionsWhereUniqueInput>
  }

  export type LabelsInDLSessionsUncheckedCreateNestedManyWithoutLabelInput = {
    create?: XOR<Enumerable<LabelsInDLSessionsCreateWithoutLabelInput>, Enumerable<LabelsInDLSessionsUncheckedCreateWithoutLabelInput>>
    connectOrCreate?: Enumerable<LabelsInDLSessionsCreateOrConnectWithoutLabelInput>
    createMany?: LabelsInDLSessionsCreateManyLabelInputEnvelope
    connect?: Enumerable<LabelsInDLSessionsWhereUniqueInput>
  }

  export type LabelsInExtractedResourcesInDLSessionsUncheckedCreateNestedManyWithoutLabelInput = {
    create?: XOR<Enumerable<LabelsInExtractedResourcesInDLSessionsCreateWithoutLabelInput>, Enumerable<LabelsInExtractedResourcesInDLSessionsUncheckedCreateWithoutLabelInput>>
    connectOrCreate?: Enumerable<LabelsInExtractedResourcesInDLSessionsCreateOrConnectWithoutLabelInput>
    createMany?: LabelsInExtractedResourcesInDLSessionsCreateManyLabelInputEnvelope
    connect?: Enumerable<LabelsInExtractedResourcesInDLSessionsWhereUniqueInput>
  }

  export type LabelsInDLSessionsUpdateManyWithoutLabelNestedInput = {
    create?: XOR<Enumerable<LabelsInDLSessionsCreateWithoutLabelInput>, Enumerable<LabelsInDLSessionsUncheckedCreateWithoutLabelInput>>
    connectOrCreate?: Enumerable<LabelsInDLSessionsCreateOrConnectWithoutLabelInput>
    upsert?: Enumerable<LabelsInDLSessionsUpsertWithWhereUniqueWithoutLabelInput>
    createMany?: LabelsInDLSessionsCreateManyLabelInputEnvelope
    set?: Enumerable<LabelsInDLSessionsWhereUniqueInput>
    disconnect?: Enumerable<LabelsInDLSessionsWhereUniqueInput>
    delete?: Enumerable<LabelsInDLSessionsWhereUniqueInput>
    connect?: Enumerable<LabelsInDLSessionsWhereUniqueInput>
    update?: Enumerable<LabelsInDLSessionsUpdateWithWhereUniqueWithoutLabelInput>
    updateMany?: Enumerable<LabelsInDLSessionsUpdateManyWithWhereWithoutLabelInput>
    deleteMany?: Enumerable<LabelsInDLSessionsScalarWhereInput>
  }

  export type LabelsInExtractedResourcesInDLSessionsUpdateManyWithoutLabelNestedInput = {
    create?: XOR<Enumerable<LabelsInExtractedResourcesInDLSessionsCreateWithoutLabelInput>, Enumerable<LabelsInExtractedResourcesInDLSessionsUncheckedCreateWithoutLabelInput>>
    connectOrCreate?: Enumerable<LabelsInExtractedResourcesInDLSessionsCreateOrConnectWithoutLabelInput>
    upsert?: Enumerable<LabelsInExtractedResourcesInDLSessionsUpsertWithWhereUniqueWithoutLabelInput>
    createMany?: LabelsInExtractedResourcesInDLSessionsCreateManyLabelInputEnvelope
    set?: Enumerable<LabelsInExtractedResourcesInDLSessionsWhereUniqueInput>
    disconnect?: Enumerable<LabelsInExtractedResourcesInDLSessionsWhereUniqueInput>
    delete?: Enumerable<LabelsInExtractedResourcesInDLSessionsWhereUniqueInput>
    connect?: Enumerable<LabelsInExtractedResourcesInDLSessionsWhereUniqueInput>
    update?: Enumerable<LabelsInExtractedResourcesInDLSessionsUpdateWithWhereUniqueWithoutLabelInput>
    updateMany?: Enumerable<LabelsInExtractedResourcesInDLSessionsUpdateManyWithWhereWithoutLabelInput>
    deleteMany?: Enumerable<LabelsInExtractedResourcesInDLSessionsScalarWhereInput>
  }

  export type LabelsInDLSessionsUncheckedUpdateManyWithoutLabelNestedInput = {
    create?: XOR<Enumerable<LabelsInDLSessionsCreateWithoutLabelInput>, Enumerable<LabelsInDLSessionsUncheckedCreateWithoutLabelInput>>
    connectOrCreate?: Enumerable<LabelsInDLSessionsCreateOrConnectWithoutLabelInput>
    upsert?: Enumerable<LabelsInDLSessionsUpsertWithWhereUniqueWithoutLabelInput>
    createMany?: LabelsInDLSessionsCreateManyLabelInputEnvelope
    set?: Enumerable<LabelsInDLSessionsWhereUniqueInput>
    disconnect?: Enumerable<LabelsInDLSessionsWhereUniqueInput>
    delete?: Enumerable<LabelsInDLSessionsWhereUniqueInput>
    connect?: Enumerable<LabelsInDLSessionsWhereUniqueInput>
    update?: Enumerable<LabelsInDLSessionsUpdateWithWhereUniqueWithoutLabelInput>
    updateMany?: Enumerable<LabelsInDLSessionsUpdateManyWithWhereWithoutLabelInput>
    deleteMany?: Enumerable<LabelsInDLSessionsScalarWhereInput>
  }

  export type LabelsInExtractedResourcesInDLSessionsUncheckedUpdateManyWithoutLabelNestedInput = {
    create?: XOR<Enumerable<LabelsInExtractedResourcesInDLSessionsCreateWithoutLabelInput>, Enumerable<LabelsInExtractedResourcesInDLSessionsUncheckedCreateWithoutLabelInput>>
    connectOrCreate?: Enumerable<LabelsInExtractedResourcesInDLSessionsCreateOrConnectWithoutLabelInput>
    upsert?: Enumerable<LabelsInExtractedResourcesInDLSessionsUpsertWithWhereUniqueWithoutLabelInput>
    createMany?: LabelsInExtractedResourcesInDLSessionsCreateManyLabelInputEnvelope
    set?: Enumerable<LabelsInExtractedResourcesInDLSessionsWhereUniqueInput>
    disconnect?: Enumerable<LabelsInExtractedResourcesInDLSessionsWhereUniqueInput>
    delete?: Enumerable<LabelsInExtractedResourcesInDLSessionsWhereUniqueInput>
    connect?: Enumerable<LabelsInExtractedResourcesInDLSessionsWhereUniqueInput>
    update?: Enumerable<LabelsInExtractedResourcesInDLSessionsUpdateWithWhereUniqueWithoutLabelInput>
    updateMany?: Enumerable<LabelsInExtractedResourcesInDLSessionsUpdateManyWithWhereWithoutLabelInput>
    deleteMany?: Enumerable<LabelsInExtractedResourcesInDLSessionsScalarWhereInput>
  }

  export type DLSessionCreateNestedOneWithoutLabelsInDLSessionsInput = {
    create?: XOR<DLSessionCreateWithoutLabelsInDLSessionsInput, DLSessionUncheckedCreateWithoutLabelsInDLSessionsInput>
    connectOrCreate?: DLSessionCreateOrConnectWithoutLabelsInDLSessionsInput
    connect?: DLSessionWhereUniqueInput
  }

  export type LabelCreateNestedOneWithoutLabelsInDLSessionsInput = {
    create?: XOR<LabelCreateWithoutLabelsInDLSessionsInput, LabelUncheckedCreateWithoutLabelsInDLSessionsInput>
    connectOrCreate?: LabelCreateOrConnectWithoutLabelsInDLSessionsInput
    connect?: LabelWhereUniqueInput
  }

  export type DLSessionUpdateOneRequiredWithoutLabelsInDLSessionsNestedInput = {
    create?: XOR<DLSessionCreateWithoutLabelsInDLSessionsInput, DLSessionUncheckedCreateWithoutLabelsInDLSessionsInput>
    connectOrCreate?: DLSessionCreateOrConnectWithoutLabelsInDLSessionsInput
    upsert?: DLSessionUpsertWithoutLabelsInDLSessionsInput
    connect?: DLSessionWhereUniqueInput
    update?: XOR<DLSessionUpdateWithoutLabelsInDLSessionsInput, DLSessionUncheckedUpdateWithoutLabelsInDLSessionsInput>
  }

  export type LabelUpdateOneRequiredWithoutLabelsInDLSessionsNestedInput = {
    create?: XOR<LabelCreateWithoutLabelsInDLSessionsInput, LabelUncheckedCreateWithoutLabelsInDLSessionsInput>
    connectOrCreate?: LabelCreateOrConnectWithoutLabelsInDLSessionsInput
    upsert?: LabelUpsertWithoutLabelsInDLSessionsInput
    connect?: LabelWhereUniqueInput
    update?: XOR<LabelUpdateWithoutLabelsInDLSessionsInput, LabelUncheckedUpdateWithoutLabelsInDLSessionsInput>
  }

  export type ExtractedResourcesInDLSessionsCreateNestedOneWithoutLabelsInExtractedResourcesInDLSessionsInput = {
    create?: XOR<ExtractedResourcesInDLSessionsCreateWithoutLabelsInExtractedResourcesInDLSessionsInput, ExtractedResourcesInDLSessionsUncheckedCreateWithoutLabelsInExtractedResourcesInDLSessionsInput>
    connectOrCreate?: ExtractedResourcesInDLSessionsCreateOrConnectWithoutLabelsInExtractedResourcesInDLSessionsInput
    connect?: ExtractedResourcesInDLSessionsWhereUniqueInput
  }

  export type LabelCreateNestedOneWithoutLabelsInExtractedResourcesInDLSessionsInput = {
    create?: XOR<LabelCreateWithoutLabelsInExtractedResourcesInDLSessionsInput, LabelUncheckedCreateWithoutLabelsInExtractedResourcesInDLSessionsInput>
    connectOrCreate?: LabelCreateOrConnectWithoutLabelsInExtractedResourcesInDLSessionsInput
    connect?: LabelWhereUniqueInput
  }

  export type ExtractedResourcesInDLSessionsUpdateOneRequiredWithoutLabelsInExtractedResourcesInDLSessionsNestedInput = {
    create?: XOR<ExtractedResourcesInDLSessionsCreateWithoutLabelsInExtractedResourcesInDLSessionsInput, ExtractedResourcesInDLSessionsUncheckedCreateWithoutLabelsInExtractedResourcesInDLSessionsInput>
    connectOrCreate?: ExtractedResourcesInDLSessionsCreateOrConnectWithoutLabelsInExtractedResourcesInDLSessionsInput
    upsert?: ExtractedResourcesInDLSessionsUpsertWithoutLabelsInExtractedResourcesInDLSessionsInput
    connect?: ExtractedResourcesInDLSessionsWhereUniqueInput
    update?: XOR<ExtractedResourcesInDLSessionsUpdateWithoutLabelsInExtractedResourcesInDLSessionsInput, ExtractedResourcesInDLSessionsUncheckedUpdateWithoutLabelsInExtractedResourcesInDLSessionsInput>
  }

  export type LabelUpdateOneRequiredWithoutLabelsInExtractedResourcesInDLSessionsNestedInput = {
    create?: XOR<LabelCreateWithoutLabelsInExtractedResourcesInDLSessionsInput, LabelUncheckedCreateWithoutLabelsInExtractedResourcesInDLSessionsInput>
    connectOrCreate?: LabelCreateOrConnectWithoutLabelsInExtractedResourcesInDLSessionsInput
    upsert?: LabelUpsertWithoutLabelsInExtractedResourcesInDLSessionsInput
    connect?: LabelWhereUniqueInput
    update?: XOR<LabelUpdateWithoutLabelsInExtractedResourcesInDLSessionsInput, LabelUncheckedUpdateWithoutLabelsInExtractedResourcesInDLSessionsInput>
  }

  export type VisitCreateNestedManyWithoutPatientInput = {
    create?: XOR<Enumerable<VisitCreateWithoutPatientInput>, Enumerable<VisitUncheckedCreateWithoutPatientInput>>
    connectOrCreate?: Enumerable<VisitCreateOrConnectWithoutPatientInput>
    createMany?: VisitCreateManyPatientInputEnvelope
    connect?: Enumerable<VisitWhereUniqueInput>
  }

  export type VisitUncheckedCreateNestedManyWithoutPatientInput = {
    create?: XOR<Enumerable<VisitCreateWithoutPatientInput>, Enumerable<VisitUncheckedCreateWithoutPatientInput>>
    connectOrCreate?: Enumerable<VisitCreateOrConnectWithoutPatientInput>
    createMany?: VisitCreateManyPatientInputEnvelope
    connect?: Enumerable<VisitWhereUniqueInput>
  }

  export type VisitUpdateManyWithoutPatientNestedInput = {
    create?: XOR<Enumerable<VisitCreateWithoutPatientInput>, Enumerable<VisitUncheckedCreateWithoutPatientInput>>
    connectOrCreate?: Enumerable<VisitCreateOrConnectWithoutPatientInput>
    upsert?: Enumerable<VisitUpsertWithWhereUniqueWithoutPatientInput>
    createMany?: VisitCreateManyPatientInputEnvelope
    set?: Enumerable<VisitWhereUniqueInput>
    disconnect?: Enumerable<VisitWhereUniqueInput>
    delete?: Enumerable<VisitWhereUniqueInput>
    connect?: Enumerable<VisitWhereUniqueInput>
    update?: Enumerable<VisitUpdateWithWhereUniqueWithoutPatientInput>
    updateMany?: Enumerable<VisitUpdateManyWithWhereWithoutPatientInput>
    deleteMany?: Enumerable<VisitScalarWhereInput>
  }

  export type VisitUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: XOR<Enumerable<VisitCreateWithoutPatientInput>, Enumerable<VisitUncheckedCreateWithoutPatientInput>>
    connectOrCreate?: Enumerable<VisitCreateOrConnectWithoutPatientInput>
    upsert?: Enumerable<VisitUpsertWithWhereUniqueWithoutPatientInput>
    createMany?: VisitCreateManyPatientInputEnvelope
    set?: Enumerable<VisitWhereUniqueInput>
    disconnect?: Enumerable<VisitWhereUniqueInput>
    delete?: Enumerable<VisitWhereUniqueInput>
    connect?: Enumerable<VisitWhereUniqueInput>
    update?: Enumerable<VisitUpdateWithWhereUniqueWithoutPatientInput>
    updateMany?: Enumerable<VisitUpdateManyWithWhereWithoutPatientInput>
    deleteMany?: Enumerable<VisitScalarWhereInput>
  }

  export type EpicCreateNestedOneWithoutProjectInput = {
    create?: XOR<EpicCreateWithoutProjectInput, EpicUncheckedCreateWithoutProjectInput>
    connectOrCreate?: EpicCreateOrConnectWithoutProjectInput
    connect?: EpicWhereUniqueInput
  }

  export type CESessionCreateNestedManyWithoutProjectInput = {
    create?: XOR<Enumerable<CESessionCreateWithoutProjectInput>, Enumerable<CESessionUncheckedCreateWithoutProjectInput>>
    connectOrCreate?: Enumerable<CESessionCreateOrConnectWithoutProjectInput>
    createMany?: CESessionCreateManyProjectInputEnvelope
    connect?: Enumerable<CESessionWhereUniqueInput>
  }

  export type DLSessionCreateNestedManyWithoutProjectInput = {
    create?: XOR<Enumerable<DLSessionCreateWithoutProjectInput>, Enumerable<DLSessionUncheckedCreateWithoutProjectInput>>
    connectOrCreate?: Enumerable<DLSessionCreateOrConnectWithoutProjectInput>
    createMany?: DLSessionCreateManyProjectInputEnvelope
    connect?: Enumerable<DLSessionWhereUniqueInput>
  }

  export type RASessionCreateNestedManyWithoutProjectInput = {
    create?: XOR<Enumerable<RASessionCreateWithoutProjectInput>, Enumerable<RASessionUncheckedCreateWithoutProjectInput>>
    connectOrCreate?: Enumerable<RASessionCreateOrConnectWithoutProjectInput>
    createMany?: RASessionCreateManyProjectInputEnvelope
    connect?: Enumerable<RASessionWhereUniqueInput>
  }

  export type UsersInProjectsCreateNestedManyWithoutProjectInput = {
    create?: XOR<Enumerable<UsersInProjectsCreateWithoutProjectInput>, Enumerable<UsersInProjectsUncheckedCreateWithoutProjectInput>>
    connectOrCreate?: Enumerable<UsersInProjectsCreateOrConnectWithoutProjectInput>
    createMany?: UsersInProjectsCreateManyProjectInputEnvelope
    connect?: Enumerable<UsersInProjectsWhereUniqueInput>
  }

  export type CESessionUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<Enumerable<CESessionCreateWithoutProjectInput>, Enumerable<CESessionUncheckedCreateWithoutProjectInput>>
    connectOrCreate?: Enumerable<CESessionCreateOrConnectWithoutProjectInput>
    createMany?: CESessionCreateManyProjectInputEnvelope
    connect?: Enumerable<CESessionWhereUniqueInput>
  }

  export type DLSessionUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<Enumerable<DLSessionCreateWithoutProjectInput>, Enumerable<DLSessionUncheckedCreateWithoutProjectInput>>
    connectOrCreate?: Enumerable<DLSessionCreateOrConnectWithoutProjectInput>
    createMany?: DLSessionCreateManyProjectInputEnvelope
    connect?: Enumerable<DLSessionWhereUniqueInput>
  }

  export type RASessionUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<Enumerable<RASessionCreateWithoutProjectInput>, Enumerable<RASessionUncheckedCreateWithoutProjectInput>>
    connectOrCreate?: Enumerable<RASessionCreateOrConnectWithoutProjectInput>
    createMany?: RASessionCreateManyProjectInputEnvelope
    connect?: Enumerable<RASessionWhereUniqueInput>
  }

  export type UsersInProjectsUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<Enumerable<UsersInProjectsCreateWithoutProjectInput>, Enumerable<UsersInProjectsUncheckedCreateWithoutProjectInput>>
    connectOrCreate?: Enumerable<UsersInProjectsCreateOrConnectWithoutProjectInput>
    createMany?: UsersInProjectsCreateManyProjectInputEnvelope
    connect?: Enumerable<UsersInProjectsWhereUniqueInput>
  }

  export type EpicUpdateOneRequiredWithoutProjectNestedInput = {
    create?: XOR<EpicCreateWithoutProjectInput, EpicUncheckedCreateWithoutProjectInput>
    connectOrCreate?: EpicCreateOrConnectWithoutProjectInput
    upsert?: EpicUpsertWithoutProjectInput
    connect?: EpicWhereUniqueInput
    update?: XOR<EpicUpdateWithoutProjectInput, EpicUncheckedUpdateWithoutProjectInput>
  }

  export type CESessionUpdateManyWithoutProjectNestedInput = {
    create?: XOR<Enumerable<CESessionCreateWithoutProjectInput>, Enumerable<CESessionUncheckedCreateWithoutProjectInput>>
    connectOrCreate?: Enumerable<CESessionCreateOrConnectWithoutProjectInput>
    upsert?: Enumerable<CESessionUpsertWithWhereUniqueWithoutProjectInput>
    createMany?: CESessionCreateManyProjectInputEnvelope
    set?: Enumerable<CESessionWhereUniqueInput>
    disconnect?: Enumerable<CESessionWhereUniqueInput>
    delete?: Enumerable<CESessionWhereUniqueInput>
    connect?: Enumerable<CESessionWhereUniqueInput>
    update?: Enumerable<CESessionUpdateWithWhereUniqueWithoutProjectInput>
    updateMany?: Enumerable<CESessionUpdateManyWithWhereWithoutProjectInput>
    deleteMany?: Enumerable<CESessionScalarWhereInput>
  }

  export type DLSessionUpdateManyWithoutProjectNestedInput = {
    create?: XOR<Enumerable<DLSessionCreateWithoutProjectInput>, Enumerable<DLSessionUncheckedCreateWithoutProjectInput>>
    connectOrCreate?: Enumerable<DLSessionCreateOrConnectWithoutProjectInput>
    upsert?: Enumerable<DLSessionUpsertWithWhereUniqueWithoutProjectInput>
    createMany?: DLSessionCreateManyProjectInputEnvelope
    set?: Enumerable<DLSessionWhereUniqueInput>
    disconnect?: Enumerable<DLSessionWhereUniqueInput>
    delete?: Enumerable<DLSessionWhereUniqueInput>
    connect?: Enumerable<DLSessionWhereUniqueInput>
    update?: Enumerable<DLSessionUpdateWithWhereUniqueWithoutProjectInput>
    updateMany?: Enumerable<DLSessionUpdateManyWithWhereWithoutProjectInput>
    deleteMany?: Enumerable<DLSessionScalarWhereInput>
  }

  export type RASessionUpdateManyWithoutProjectNestedInput = {
    create?: XOR<Enumerable<RASessionCreateWithoutProjectInput>, Enumerable<RASessionUncheckedCreateWithoutProjectInput>>
    connectOrCreate?: Enumerable<RASessionCreateOrConnectWithoutProjectInput>
    upsert?: Enumerable<RASessionUpsertWithWhereUniqueWithoutProjectInput>
    createMany?: RASessionCreateManyProjectInputEnvelope
    set?: Enumerable<RASessionWhereUniqueInput>
    disconnect?: Enumerable<RASessionWhereUniqueInput>
    delete?: Enumerable<RASessionWhereUniqueInput>
    connect?: Enumerable<RASessionWhereUniqueInput>
    update?: Enumerable<RASessionUpdateWithWhereUniqueWithoutProjectInput>
    updateMany?: Enumerable<RASessionUpdateManyWithWhereWithoutProjectInput>
    deleteMany?: Enumerable<RASessionScalarWhereInput>
  }

  export type UsersInProjectsUpdateManyWithoutProjectNestedInput = {
    create?: XOR<Enumerable<UsersInProjectsCreateWithoutProjectInput>, Enumerable<UsersInProjectsUncheckedCreateWithoutProjectInput>>
    connectOrCreate?: Enumerable<UsersInProjectsCreateOrConnectWithoutProjectInput>
    upsert?: Enumerable<UsersInProjectsUpsertWithWhereUniqueWithoutProjectInput>
    createMany?: UsersInProjectsCreateManyProjectInputEnvelope
    set?: Enumerable<UsersInProjectsWhereUniqueInput>
    disconnect?: Enumerable<UsersInProjectsWhereUniqueInput>
    delete?: Enumerable<UsersInProjectsWhereUniqueInput>
    connect?: Enumerable<UsersInProjectsWhereUniqueInput>
    update?: Enumerable<UsersInProjectsUpdateWithWhereUniqueWithoutProjectInput>
    updateMany?: Enumerable<UsersInProjectsUpdateManyWithWhereWithoutProjectInput>
    deleteMany?: Enumerable<UsersInProjectsScalarWhereInput>
  }

  export type CESessionUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<Enumerable<CESessionCreateWithoutProjectInput>, Enumerable<CESessionUncheckedCreateWithoutProjectInput>>
    connectOrCreate?: Enumerable<CESessionCreateOrConnectWithoutProjectInput>
    upsert?: Enumerable<CESessionUpsertWithWhereUniqueWithoutProjectInput>
    createMany?: CESessionCreateManyProjectInputEnvelope
    set?: Enumerable<CESessionWhereUniqueInput>
    disconnect?: Enumerable<CESessionWhereUniqueInput>
    delete?: Enumerable<CESessionWhereUniqueInput>
    connect?: Enumerable<CESessionWhereUniqueInput>
    update?: Enumerable<CESessionUpdateWithWhereUniqueWithoutProjectInput>
    updateMany?: Enumerable<CESessionUpdateManyWithWhereWithoutProjectInput>
    deleteMany?: Enumerable<CESessionScalarWhereInput>
  }

  export type DLSessionUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<Enumerable<DLSessionCreateWithoutProjectInput>, Enumerable<DLSessionUncheckedCreateWithoutProjectInput>>
    connectOrCreate?: Enumerable<DLSessionCreateOrConnectWithoutProjectInput>
    upsert?: Enumerable<DLSessionUpsertWithWhereUniqueWithoutProjectInput>
    createMany?: DLSessionCreateManyProjectInputEnvelope
    set?: Enumerable<DLSessionWhereUniqueInput>
    disconnect?: Enumerable<DLSessionWhereUniqueInput>
    delete?: Enumerable<DLSessionWhereUniqueInput>
    connect?: Enumerable<DLSessionWhereUniqueInput>
    update?: Enumerable<DLSessionUpdateWithWhereUniqueWithoutProjectInput>
    updateMany?: Enumerable<DLSessionUpdateManyWithWhereWithoutProjectInput>
    deleteMany?: Enumerable<DLSessionScalarWhereInput>
  }

  export type RASessionUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<Enumerable<RASessionCreateWithoutProjectInput>, Enumerable<RASessionUncheckedCreateWithoutProjectInput>>
    connectOrCreate?: Enumerable<RASessionCreateOrConnectWithoutProjectInput>
    upsert?: Enumerable<RASessionUpsertWithWhereUniqueWithoutProjectInput>
    createMany?: RASessionCreateManyProjectInputEnvelope
    set?: Enumerable<RASessionWhereUniqueInput>
    disconnect?: Enumerable<RASessionWhereUniqueInput>
    delete?: Enumerable<RASessionWhereUniqueInput>
    connect?: Enumerable<RASessionWhereUniqueInput>
    update?: Enumerable<RASessionUpdateWithWhereUniqueWithoutProjectInput>
    updateMany?: Enumerable<RASessionUpdateManyWithWhereWithoutProjectInput>
    deleteMany?: Enumerable<RASessionScalarWhereInput>
  }

  export type UsersInProjectsUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<Enumerable<UsersInProjectsCreateWithoutProjectInput>, Enumerable<UsersInProjectsUncheckedCreateWithoutProjectInput>>
    connectOrCreate?: Enumerable<UsersInProjectsCreateOrConnectWithoutProjectInput>
    upsert?: Enumerable<UsersInProjectsUpsertWithWhereUniqueWithoutProjectInput>
    createMany?: UsersInProjectsCreateManyProjectInputEnvelope
    set?: Enumerable<UsersInProjectsWhereUniqueInput>
    disconnect?: Enumerable<UsersInProjectsWhereUniqueInput>
    delete?: Enumerable<UsersInProjectsWhereUniqueInput>
    connect?: Enumerable<UsersInProjectsWhereUniqueInput>
    update?: Enumerable<UsersInProjectsUpdateWithWhereUniqueWithoutProjectInput>
    updateMany?: Enumerable<UsersInProjectsUpdateManyWithWhereWithoutProjectInput>
    deleteMany?: Enumerable<UsersInProjectsScalarWhereInput>
  }

  export type RASessionCreatesopInput = {
    set: Enumerable<string>
  }

  export type ProjectCreateNestedOneWithoutRASessionInput = {
    create?: XOR<ProjectCreateWithoutRASessionInput, ProjectUncheckedCreateWithoutRASessionInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutRASessionInput
    connect?: ProjectWhereUniqueInput
  }

  export type UsersInRASessionsCreateNestedManyWithoutRASessionInput = {
    create?: XOR<Enumerable<UsersInRASessionsCreateWithoutRASessionInput>, Enumerable<UsersInRASessionsUncheckedCreateWithoutRASessionInput>>
    connectOrCreate?: Enumerable<UsersInRASessionsCreateOrConnectWithoutRASessionInput>
    createMany?: UsersInRASessionsCreateManyRASessionInputEnvelope
    connect?: Enumerable<UsersInRASessionsWhereUniqueInput>
  }

  export type VisitsInRASessionsCreateNestedManyWithoutRASessionInput = {
    create?: XOR<Enumerable<VisitsInRASessionsCreateWithoutRASessionInput>, Enumerable<VisitsInRASessionsUncheckedCreateWithoutRASessionInput>>
    connectOrCreate?: Enumerable<VisitsInRASessionsCreateOrConnectWithoutRASessionInput>
    createMany?: VisitsInRASessionsCreateManyRASessionInputEnvelope
    connect?: Enumerable<VisitsInRASessionsWhereUniqueInput>
  }

  export type UsersInRASessionsUncheckedCreateNestedManyWithoutRASessionInput = {
    create?: XOR<Enumerable<UsersInRASessionsCreateWithoutRASessionInput>, Enumerable<UsersInRASessionsUncheckedCreateWithoutRASessionInput>>
    connectOrCreate?: Enumerable<UsersInRASessionsCreateOrConnectWithoutRASessionInput>
    createMany?: UsersInRASessionsCreateManyRASessionInputEnvelope
    connect?: Enumerable<UsersInRASessionsWhereUniqueInput>
  }

  export type VisitsInRASessionsUncheckedCreateNestedManyWithoutRASessionInput = {
    create?: XOR<Enumerable<VisitsInRASessionsCreateWithoutRASessionInput>, Enumerable<VisitsInRASessionsUncheckedCreateWithoutRASessionInput>>
    connectOrCreate?: Enumerable<VisitsInRASessionsCreateOrConnectWithoutRASessionInput>
    createMany?: VisitsInRASessionsCreateManyRASessionInputEnvelope
    connect?: Enumerable<VisitsInRASessionsWhereUniqueInput>
  }

  export type RASessionUpdatesopInput = {
    set?: Enumerable<string>
    push?: string | Enumerable<string>
  }

  export type ProjectUpdateOneRequiredWithoutRASessionNestedInput = {
    create?: XOR<ProjectCreateWithoutRASessionInput, ProjectUncheckedCreateWithoutRASessionInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutRASessionInput
    upsert?: ProjectUpsertWithoutRASessionInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<ProjectUpdateWithoutRASessionInput, ProjectUncheckedUpdateWithoutRASessionInput>
  }

  export type UsersInRASessionsUpdateManyWithoutRASessionNestedInput = {
    create?: XOR<Enumerable<UsersInRASessionsCreateWithoutRASessionInput>, Enumerable<UsersInRASessionsUncheckedCreateWithoutRASessionInput>>
    connectOrCreate?: Enumerable<UsersInRASessionsCreateOrConnectWithoutRASessionInput>
    upsert?: Enumerable<UsersInRASessionsUpsertWithWhereUniqueWithoutRASessionInput>
    createMany?: UsersInRASessionsCreateManyRASessionInputEnvelope
    set?: Enumerable<UsersInRASessionsWhereUniqueInput>
    disconnect?: Enumerable<UsersInRASessionsWhereUniqueInput>
    delete?: Enumerable<UsersInRASessionsWhereUniqueInput>
    connect?: Enumerable<UsersInRASessionsWhereUniqueInput>
    update?: Enumerable<UsersInRASessionsUpdateWithWhereUniqueWithoutRASessionInput>
    updateMany?: Enumerable<UsersInRASessionsUpdateManyWithWhereWithoutRASessionInput>
    deleteMany?: Enumerable<UsersInRASessionsScalarWhereInput>
  }

  export type VisitsInRASessionsUpdateManyWithoutRASessionNestedInput = {
    create?: XOR<Enumerable<VisitsInRASessionsCreateWithoutRASessionInput>, Enumerable<VisitsInRASessionsUncheckedCreateWithoutRASessionInput>>
    connectOrCreate?: Enumerable<VisitsInRASessionsCreateOrConnectWithoutRASessionInput>
    upsert?: Enumerable<VisitsInRASessionsUpsertWithWhereUniqueWithoutRASessionInput>
    createMany?: VisitsInRASessionsCreateManyRASessionInputEnvelope
    set?: Enumerable<VisitsInRASessionsWhereUniqueInput>
    disconnect?: Enumerable<VisitsInRASessionsWhereUniqueInput>
    delete?: Enumerable<VisitsInRASessionsWhereUniqueInput>
    connect?: Enumerable<VisitsInRASessionsWhereUniqueInput>
    update?: Enumerable<VisitsInRASessionsUpdateWithWhereUniqueWithoutRASessionInput>
    updateMany?: Enumerable<VisitsInRASessionsUpdateManyWithWhereWithoutRASessionInput>
    deleteMany?: Enumerable<VisitsInRASessionsScalarWhereInput>
  }

  export type UsersInRASessionsUncheckedUpdateManyWithoutRASessionNestedInput = {
    create?: XOR<Enumerable<UsersInRASessionsCreateWithoutRASessionInput>, Enumerable<UsersInRASessionsUncheckedCreateWithoutRASessionInput>>
    connectOrCreate?: Enumerable<UsersInRASessionsCreateOrConnectWithoutRASessionInput>
    upsert?: Enumerable<UsersInRASessionsUpsertWithWhereUniqueWithoutRASessionInput>
    createMany?: UsersInRASessionsCreateManyRASessionInputEnvelope
    set?: Enumerable<UsersInRASessionsWhereUniqueInput>
    disconnect?: Enumerable<UsersInRASessionsWhereUniqueInput>
    delete?: Enumerable<UsersInRASessionsWhereUniqueInput>
    connect?: Enumerable<UsersInRASessionsWhereUniqueInput>
    update?: Enumerable<UsersInRASessionsUpdateWithWhereUniqueWithoutRASessionInput>
    updateMany?: Enumerable<UsersInRASessionsUpdateManyWithWhereWithoutRASessionInput>
    deleteMany?: Enumerable<UsersInRASessionsScalarWhereInput>
  }

  export type VisitsInRASessionsUncheckedUpdateManyWithoutRASessionNestedInput = {
    create?: XOR<Enumerable<VisitsInRASessionsCreateWithoutRASessionInput>, Enumerable<VisitsInRASessionsUncheckedCreateWithoutRASessionInput>>
    connectOrCreate?: Enumerable<VisitsInRASessionsCreateOrConnectWithoutRASessionInput>
    upsert?: Enumerable<VisitsInRASessionsUpsertWithWhereUniqueWithoutRASessionInput>
    createMany?: VisitsInRASessionsCreateManyRASessionInputEnvelope
    set?: Enumerable<VisitsInRASessionsWhereUniqueInput>
    disconnect?: Enumerable<VisitsInRASessionsWhereUniqueInput>
    delete?: Enumerable<VisitsInRASessionsWhereUniqueInput>
    connect?: Enumerable<VisitsInRASessionsWhereUniqueInput>
    update?: Enumerable<VisitsInRASessionsUpdateWithWhereUniqueWithoutRASessionInput>
    updateMany?: Enumerable<VisitsInRASessionsUpdateManyWithWhereWithoutRASessionInput>
    deleteMany?: Enumerable<VisitsInRASessionsScalarWhereInput>
  }

  export type VisitCreateNestedOneWithoutRawResourceInput = {
    create?: XOR<VisitCreateWithoutRawResourceInput, VisitUncheckedCreateWithoutRawResourceInput>
    connectOrCreate?: VisitCreateOrConnectWithoutRawResourceInput
    connect?: VisitWhereUniqueInput
  }

  export type ExtractedResourceCreateNestedManyWithoutRawResourceInput = {
    create?: XOR<Enumerable<ExtractedResourceCreateWithoutRawResourceInput>, Enumerable<ExtractedResourceUncheckedCreateWithoutRawResourceInput>>
    connectOrCreate?: Enumerable<ExtractedResourceCreateOrConnectWithoutRawResourceInput>
    createMany?: ExtractedResourceCreateManyRawResourceInputEnvelope
    connect?: Enumerable<ExtractedResourceWhereUniqueInput>
  }

  export type ExtractedResourceUncheckedCreateNestedManyWithoutRawResourceInput = {
    create?: XOR<Enumerable<ExtractedResourceCreateWithoutRawResourceInput>, Enumerable<ExtractedResourceUncheckedCreateWithoutRawResourceInput>>
    connectOrCreate?: Enumerable<ExtractedResourceCreateOrConnectWithoutRawResourceInput>
    createMany?: ExtractedResourceCreateManyRawResourceInputEnvelope
    connect?: Enumerable<ExtractedResourceWhereUniqueInput>
  }

  export type VisitUpdateOneRequiredWithoutRawResourceNestedInput = {
    create?: XOR<VisitCreateWithoutRawResourceInput, VisitUncheckedCreateWithoutRawResourceInput>
    connectOrCreate?: VisitCreateOrConnectWithoutRawResourceInput
    upsert?: VisitUpsertWithoutRawResourceInput
    connect?: VisitWhereUniqueInput
    update?: XOR<VisitUpdateWithoutRawResourceInput, VisitUncheckedUpdateWithoutRawResourceInput>
  }

  export type ExtractedResourceUpdateManyWithoutRawResourceNestedInput = {
    create?: XOR<Enumerable<ExtractedResourceCreateWithoutRawResourceInput>, Enumerable<ExtractedResourceUncheckedCreateWithoutRawResourceInput>>
    connectOrCreate?: Enumerable<ExtractedResourceCreateOrConnectWithoutRawResourceInput>
    upsert?: Enumerable<ExtractedResourceUpsertWithWhereUniqueWithoutRawResourceInput>
    createMany?: ExtractedResourceCreateManyRawResourceInputEnvelope
    set?: Enumerable<ExtractedResourceWhereUniqueInput>
    disconnect?: Enumerable<ExtractedResourceWhereUniqueInput>
    delete?: Enumerable<ExtractedResourceWhereUniqueInput>
    connect?: Enumerable<ExtractedResourceWhereUniqueInput>
    update?: Enumerable<ExtractedResourceUpdateWithWhereUniqueWithoutRawResourceInput>
    updateMany?: Enumerable<ExtractedResourceUpdateManyWithWhereWithoutRawResourceInput>
    deleteMany?: Enumerable<ExtractedResourceScalarWhereInput>
  }

  export type ExtractedResourceUncheckedUpdateManyWithoutRawResourceNestedInput = {
    create?: XOR<Enumerable<ExtractedResourceCreateWithoutRawResourceInput>, Enumerable<ExtractedResourceUncheckedCreateWithoutRawResourceInput>>
    connectOrCreate?: Enumerable<ExtractedResourceCreateOrConnectWithoutRawResourceInput>
    upsert?: Enumerable<ExtractedResourceUpsertWithWhereUniqueWithoutRawResourceInput>
    createMany?: ExtractedResourceCreateManyRawResourceInputEnvelope
    set?: Enumerable<ExtractedResourceWhereUniqueInput>
    disconnect?: Enumerable<ExtractedResourceWhereUniqueInput>
    delete?: Enumerable<ExtractedResourceWhereUniqueInput>
    connect?: Enumerable<ExtractedResourceWhereUniqueInput>
    update?: Enumerable<ExtractedResourceUpdateWithWhereUniqueWithoutRawResourceInput>
    updateMany?: Enumerable<ExtractedResourceUpdateManyWithWhereWithoutRawResourceInput>
    deleteMany?: Enumerable<ExtractedResourceScalarWhereInput>
  }

  export type CESessionCreateNestedOneWithoutUsersInCESessionsInput = {
    create?: XOR<CESessionCreateWithoutUsersInCESessionsInput, CESessionUncheckedCreateWithoutUsersInCESessionsInput>
    connectOrCreate?: CESessionCreateOrConnectWithoutUsersInCESessionsInput
    connect?: CESessionWhereUniqueInput
  }

  export type EnumSessionUserRoleFieldUpdateOperationsInput = {
    set?: SessionUserRole
  }

  export type CESessionUpdateOneRequiredWithoutUsersInCESessionsNestedInput = {
    create?: XOR<CESessionCreateWithoutUsersInCESessionsInput, CESessionUncheckedCreateWithoutUsersInCESessionsInput>
    connectOrCreate?: CESessionCreateOrConnectWithoutUsersInCESessionsInput
    upsert?: CESessionUpsertWithoutUsersInCESessionsInput
    connect?: CESessionWhereUniqueInput
    update?: XOR<CESessionUpdateWithoutUsersInCESessionsInput, CESessionUncheckedUpdateWithoutUsersInCESessionsInput>
  }

  export type DLSessionCreateNestedOneWithoutUsersInDLSessionsInput = {
    create?: XOR<DLSessionCreateWithoutUsersInDLSessionsInput, DLSessionUncheckedCreateWithoutUsersInDLSessionsInput>
    connectOrCreate?: DLSessionCreateOrConnectWithoutUsersInDLSessionsInput
    connect?: DLSessionWhereUniqueInput
  }

  export type DLSessionUpdateOneRequiredWithoutUsersInDLSessionsNestedInput = {
    create?: XOR<DLSessionCreateWithoutUsersInDLSessionsInput, DLSessionUncheckedCreateWithoutUsersInDLSessionsInput>
    connectOrCreate?: DLSessionCreateOrConnectWithoutUsersInDLSessionsInput
    upsert?: DLSessionUpsertWithoutUsersInDLSessionsInput
    connect?: DLSessionWhereUniqueInput
    update?: XOR<DLSessionUpdateWithoutUsersInDLSessionsInput, DLSessionUncheckedUpdateWithoutUsersInDLSessionsInput>
  }

  export type ProjectCreateNestedOneWithoutUsersInProjectsInput = {
    create?: XOR<ProjectCreateWithoutUsersInProjectsInput, ProjectUncheckedCreateWithoutUsersInProjectsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutUsersInProjectsInput
    connect?: ProjectWhereUniqueInput
  }

  export type EnumProjectUserRoleFieldUpdateOperationsInput = {
    set?: ProjectUserRole
  }

  export type ProjectUpdateOneRequiredWithoutUsersInProjectsNestedInput = {
    create?: XOR<ProjectCreateWithoutUsersInProjectsInput, ProjectUncheckedCreateWithoutUsersInProjectsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutUsersInProjectsInput
    upsert?: ProjectUpsertWithoutUsersInProjectsInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<ProjectUpdateWithoutUsersInProjectsInput, ProjectUncheckedUpdateWithoutUsersInProjectsInput>
  }

  export type RASessionCreateNestedOneWithoutUsersInRASessionsInput = {
    create?: XOR<RASessionCreateWithoutUsersInRASessionsInput, RASessionUncheckedCreateWithoutUsersInRASessionsInput>
    connectOrCreate?: RASessionCreateOrConnectWithoutUsersInRASessionsInput
    connect?: RASessionWhereUniqueInput
  }

  export type RASessionUpdateOneRequiredWithoutUsersInRASessionsNestedInput = {
    create?: XOR<RASessionCreateWithoutUsersInRASessionsInput, RASessionUncheckedCreateWithoutUsersInRASessionsInput>
    connectOrCreate?: RASessionCreateOrConnectWithoutUsersInRASessionsInput
    upsert?: RASessionUpsertWithoutUsersInRASessionsInput
    connect?: RASessionWhereUniqueInput
    update?: XOR<RASessionUpdateWithoutUsersInRASessionsInput, RASessionUncheckedUpdateWithoutUsersInRASessionsInput>
  }

  export type PatientCreateNestedOneWithoutVisitInput = {
    create?: XOR<PatientCreateWithoutVisitInput, PatientUncheckedCreateWithoutVisitInput>
    connectOrCreate?: PatientCreateOrConnectWithoutVisitInput
    connect?: PatientWhereUniqueInput
  }

  export type RawResourceCreateNestedManyWithoutVisitInput = {
    create?: XOR<Enumerable<RawResourceCreateWithoutVisitInput>, Enumerable<RawResourceUncheckedCreateWithoutVisitInput>>
    connectOrCreate?: Enumerable<RawResourceCreateOrConnectWithoutVisitInput>
    createMany?: RawResourceCreateManyVisitInputEnvelope
    connect?: Enumerable<RawResourceWhereUniqueInput>
  }

  export type VisitsInRASessionsCreateNestedManyWithoutVisitInput = {
    create?: XOR<Enumerable<VisitsInRASessionsCreateWithoutVisitInput>, Enumerable<VisitsInRASessionsUncheckedCreateWithoutVisitInput>>
    connectOrCreate?: Enumerable<VisitsInRASessionsCreateOrConnectWithoutVisitInput>
    createMany?: VisitsInRASessionsCreateManyVisitInputEnvelope
    connect?: Enumerable<VisitsInRASessionsWhereUniqueInput>
  }

  export type RawResourceUncheckedCreateNestedManyWithoutVisitInput = {
    create?: XOR<Enumerable<RawResourceCreateWithoutVisitInput>, Enumerable<RawResourceUncheckedCreateWithoutVisitInput>>
    connectOrCreate?: Enumerable<RawResourceCreateOrConnectWithoutVisitInput>
    createMany?: RawResourceCreateManyVisitInputEnvelope
    connect?: Enumerable<RawResourceWhereUniqueInput>
  }

  export type VisitsInRASessionsUncheckedCreateNestedManyWithoutVisitInput = {
    create?: XOR<Enumerable<VisitsInRASessionsCreateWithoutVisitInput>, Enumerable<VisitsInRASessionsUncheckedCreateWithoutVisitInput>>
    connectOrCreate?: Enumerable<VisitsInRASessionsCreateOrConnectWithoutVisitInput>
    createMany?: VisitsInRASessionsCreateManyVisitInputEnvelope
    connect?: Enumerable<VisitsInRASessionsWhereUniqueInput>
  }

  export type PatientUpdateOneRequiredWithoutVisitNestedInput = {
    create?: XOR<PatientCreateWithoutVisitInput, PatientUncheckedCreateWithoutVisitInput>
    connectOrCreate?: PatientCreateOrConnectWithoutVisitInput
    upsert?: PatientUpsertWithoutVisitInput
    connect?: PatientWhereUniqueInput
    update?: XOR<PatientUpdateWithoutVisitInput, PatientUncheckedUpdateWithoutVisitInput>
  }

  export type RawResourceUpdateManyWithoutVisitNestedInput = {
    create?: XOR<Enumerable<RawResourceCreateWithoutVisitInput>, Enumerable<RawResourceUncheckedCreateWithoutVisitInput>>
    connectOrCreate?: Enumerable<RawResourceCreateOrConnectWithoutVisitInput>
    upsert?: Enumerable<RawResourceUpsertWithWhereUniqueWithoutVisitInput>
    createMany?: RawResourceCreateManyVisitInputEnvelope
    set?: Enumerable<RawResourceWhereUniqueInput>
    disconnect?: Enumerable<RawResourceWhereUniqueInput>
    delete?: Enumerable<RawResourceWhereUniqueInput>
    connect?: Enumerable<RawResourceWhereUniqueInput>
    update?: Enumerable<RawResourceUpdateWithWhereUniqueWithoutVisitInput>
    updateMany?: Enumerable<RawResourceUpdateManyWithWhereWithoutVisitInput>
    deleteMany?: Enumerable<RawResourceScalarWhereInput>
  }

  export type VisitsInRASessionsUpdateManyWithoutVisitNestedInput = {
    create?: XOR<Enumerable<VisitsInRASessionsCreateWithoutVisitInput>, Enumerable<VisitsInRASessionsUncheckedCreateWithoutVisitInput>>
    connectOrCreate?: Enumerable<VisitsInRASessionsCreateOrConnectWithoutVisitInput>
    upsert?: Enumerable<VisitsInRASessionsUpsertWithWhereUniqueWithoutVisitInput>
    createMany?: VisitsInRASessionsCreateManyVisitInputEnvelope
    set?: Enumerable<VisitsInRASessionsWhereUniqueInput>
    disconnect?: Enumerable<VisitsInRASessionsWhereUniqueInput>
    delete?: Enumerable<VisitsInRASessionsWhereUniqueInput>
    connect?: Enumerable<VisitsInRASessionsWhereUniqueInput>
    update?: Enumerable<VisitsInRASessionsUpdateWithWhereUniqueWithoutVisitInput>
    updateMany?: Enumerable<VisitsInRASessionsUpdateManyWithWhereWithoutVisitInput>
    deleteMany?: Enumerable<VisitsInRASessionsScalarWhereInput>
  }

  export type RawResourceUncheckedUpdateManyWithoutVisitNestedInput = {
    create?: XOR<Enumerable<RawResourceCreateWithoutVisitInput>, Enumerable<RawResourceUncheckedCreateWithoutVisitInput>>
    connectOrCreate?: Enumerable<RawResourceCreateOrConnectWithoutVisitInput>
    upsert?: Enumerable<RawResourceUpsertWithWhereUniqueWithoutVisitInput>
    createMany?: RawResourceCreateManyVisitInputEnvelope
    set?: Enumerable<RawResourceWhereUniqueInput>
    disconnect?: Enumerable<RawResourceWhereUniqueInput>
    delete?: Enumerable<RawResourceWhereUniqueInput>
    connect?: Enumerable<RawResourceWhereUniqueInput>
    update?: Enumerable<RawResourceUpdateWithWhereUniqueWithoutVisitInput>
    updateMany?: Enumerable<RawResourceUpdateManyWithWhereWithoutVisitInput>
    deleteMany?: Enumerable<RawResourceScalarWhereInput>
  }

  export type VisitsInRASessionsUncheckedUpdateManyWithoutVisitNestedInput = {
    create?: XOR<Enumerable<VisitsInRASessionsCreateWithoutVisitInput>, Enumerable<VisitsInRASessionsUncheckedCreateWithoutVisitInput>>
    connectOrCreate?: Enumerable<VisitsInRASessionsCreateOrConnectWithoutVisitInput>
    upsert?: Enumerable<VisitsInRASessionsUpsertWithWhereUniqueWithoutVisitInput>
    createMany?: VisitsInRASessionsCreateManyVisitInputEnvelope
    set?: Enumerable<VisitsInRASessionsWhereUniqueInput>
    disconnect?: Enumerable<VisitsInRASessionsWhereUniqueInput>
    delete?: Enumerable<VisitsInRASessionsWhereUniqueInput>
    connect?: Enumerable<VisitsInRASessionsWhereUniqueInput>
    update?: Enumerable<VisitsInRASessionsUpdateWithWhereUniqueWithoutVisitInput>
    updateMany?: Enumerable<VisitsInRASessionsUpdateManyWithWhereWithoutVisitInput>
    deleteMany?: Enumerable<VisitsInRASessionsScalarWhereInput>
  }

  export type RASessionCreateNestedOneWithoutVisitsInRASessionsInput = {
    create?: XOR<RASessionCreateWithoutVisitsInRASessionsInput, RASessionUncheckedCreateWithoutVisitsInRASessionsInput>
    connectOrCreate?: RASessionCreateOrConnectWithoutVisitsInRASessionsInput
    connect?: RASessionWhereUniqueInput
  }

  export type VisitCreateNestedOneWithoutVisitsInRASessionsInput = {
    create?: XOR<VisitCreateWithoutVisitsInRASessionsInput, VisitUncheckedCreateWithoutVisitsInRASessionsInput>
    connectOrCreate?: VisitCreateOrConnectWithoutVisitsInRASessionsInput
    connect?: VisitWhereUniqueInput
  }

  export type RASessionUpdateOneRequiredWithoutVisitsInRASessionsNestedInput = {
    create?: XOR<RASessionCreateWithoutVisitsInRASessionsInput, RASessionUncheckedCreateWithoutVisitsInRASessionsInput>
    connectOrCreate?: RASessionCreateOrConnectWithoutVisitsInRASessionsInput
    upsert?: RASessionUpsertWithoutVisitsInRASessionsInput
    connect?: RASessionWhereUniqueInput
    update?: XOR<RASessionUpdateWithoutVisitsInRASessionsInput, RASessionUncheckedUpdateWithoutVisitsInRASessionsInput>
  }

  export type VisitUpdateOneRequiredWithoutVisitsInRASessionsNestedInput = {
    create?: XOR<VisitCreateWithoutVisitsInRASessionsInput, VisitUncheckedCreateWithoutVisitsInRASessionsInput>
    connectOrCreate?: VisitCreateOrConnectWithoutVisitsInRASessionsInput
    upsert?: VisitUpsertWithoutVisitsInRASessionsInput
    connect?: VisitWhereUniqueInput
    update?: XOR<VisitUpdateWithoutVisitsInRASessionsInput, VisitUncheckedUpdateWithoutVisitsInRASessionsInput>
  }

  export type NestedStringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringFilter | string
  }

  export type NestedDateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type NestedIntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type NestedStringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type NestedDateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type NestedIntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type NestedFloatFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatFilter | number
  }
  export type NestedJsonFilter = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase>, Exclude<keyof Required<NestedJsonFilterBase>, 'path'>>,
        Required<NestedJsonFilterBase>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase>, 'path'>>

  export type NestedJsonFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: Array<string>
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
  }

  export type NestedEnumExtractedResourceStatusFilter = {
    equals?: ExtractedResourceStatus
    in?: Enumerable<ExtractedResourceStatus>
    notIn?: Enumerable<ExtractedResourceStatus>
    not?: NestedEnumExtractedResourceStatusFilter | ExtractedResourceStatus
  }

  export type NestedEnumExtractedResourceStatusWithAggregatesFilter = {
    equals?: ExtractedResourceStatus
    in?: Enumerable<ExtractedResourceStatus>
    notIn?: Enumerable<ExtractedResourceStatus>
    not?: NestedEnumExtractedResourceStatusWithAggregatesFilter | ExtractedResourceStatus
    _count?: NestedIntFilter
    _min?: NestedEnumExtractedResourceStatusFilter
    _max?: NestedEnumExtractedResourceStatusFilter
  }

  export type NestedEnumSessionUserRoleFilter = {
    equals?: SessionUserRole
    in?: Enumerable<SessionUserRole>
    notIn?: Enumerable<SessionUserRole>
    not?: NestedEnumSessionUserRoleFilter | SessionUserRole
  }

  export type NestedEnumSessionUserRoleWithAggregatesFilter = {
    equals?: SessionUserRole
    in?: Enumerable<SessionUserRole>
    notIn?: Enumerable<SessionUserRole>
    not?: NestedEnumSessionUserRoleWithAggregatesFilter | SessionUserRole
    _count?: NestedIntFilter
    _min?: NestedEnumSessionUserRoleFilter
    _max?: NestedEnumSessionUserRoleFilter
  }

  export type NestedEnumProjectUserRoleFilter = {
    equals?: ProjectUserRole
    in?: Enumerable<ProjectUserRole>
    notIn?: Enumerable<ProjectUserRole>
    not?: NestedEnumProjectUserRoleFilter | ProjectUserRole
  }

  export type NestedEnumProjectUserRoleWithAggregatesFilter = {
    equals?: ProjectUserRole
    in?: Enumerable<ProjectUserRole>
    notIn?: Enumerable<ProjectUserRole>
    not?: NestedEnumProjectUserRoleWithAggregatesFilter | ProjectUserRole
    _count?: NestedIntFilter
    _min?: NestedEnumProjectUserRoleFilter
    _max?: NestedEnumProjectUserRoleFilter
  }

  export type ProjectCreateWithoutCESessionInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    Epic: EpicCreateNestedOneWithoutProjectInput
    DLSession?: DLSessionCreateNestedManyWithoutProjectInput
    RASession?: RASessionCreateNestedManyWithoutProjectInput
    UsersInProjects?: UsersInProjectsCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutCESessionInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    epicId: string
    DLSession?: DLSessionUncheckedCreateNestedManyWithoutProjectInput
    RASession?: RASessionUncheckedCreateNestedManyWithoutProjectInput
    UsersInProjects?: UsersInProjectsUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutCESessionInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutCESessionInput, ProjectUncheckedCreateWithoutCESessionInput>
  }

  export type ExtractedResourcesInCESessionsCreateWithoutCESessionInput = {
    index: number
    status?: ExtractedResourceStatus
    result: JsonNullValueInput | InputJsonValue
    ExtractedResource: ExtractedResourceCreateNestedOneWithoutExtractedResourcesInCESessionsInput
  }

  export type ExtractedResourcesInCESessionsUncheckedCreateWithoutCESessionInput = {
    extractedResourceId: string
    index: number
    status?: ExtractedResourceStatus
    result: JsonNullValueInput | InputJsonValue
  }

  export type ExtractedResourcesInCESessionsCreateOrConnectWithoutCESessionInput = {
    where: ExtractedResourcesInCESessionsWhereUniqueInput
    create: XOR<ExtractedResourcesInCESessionsCreateWithoutCESessionInput, ExtractedResourcesInCESessionsUncheckedCreateWithoutCESessionInput>
  }

  export type ExtractedResourcesInCESessionsCreateManyCESessionInputEnvelope = {
    data: Enumerable<ExtractedResourcesInCESessionsCreateManyCESessionInput>
    skipDuplicates?: boolean
  }

  export type UsersInCESessionsCreateWithoutCESessionInput = {
    userId: string
    userRole: SessionUserRole
  }

  export type UsersInCESessionsUncheckedCreateWithoutCESessionInput = {
    userId: string
    userRole: SessionUserRole
  }

  export type UsersInCESessionsCreateOrConnectWithoutCESessionInput = {
    where: UsersInCESessionsWhereUniqueInput
    create: XOR<UsersInCESessionsCreateWithoutCESessionInput, UsersInCESessionsUncheckedCreateWithoutCESessionInput>
  }

  export type UsersInCESessionsCreateManyCESessionInputEnvelope = {
    data: Enumerable<UsersInCESessionsCreateManyCESessionInput>
    skipDuplicates?: boolean
  }

  export type ProjectUpsertWithoutCESessionInput = {
    update: XOR<ProjectUpdateWithoutCESessionInput, ProjectUncheckedUpdateWithoutCESessionInput>
    create: XOR<ProjectCreateWithoutCESessionInput, ProjectUncheckedCreateWithoutCESessionInput>
  }

  export type ProjectUpdateWithoutCESessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    Epic?: EpicUpdateOneRequiredWithoutProjectNestedInput
    DLSession?: DLSessionUpdateManyWithoutProjectNestedInput
    RASession?: RASessionUpdateManyWithoutProjectNestedInput
    UsersInProjects?: UsersInProjectsUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutCESessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    epicId?: StringFieldUpdateOperationsInput | string
    DLSession?: DLSessionUncheckedUpdateManyWithoutProjectNestedInput
    RASession?: RASessionUncheckedUpdateManyWithoutProjectNestedInput
    UsersInProjects?: UsersInProjectsUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ExtractedResourcesInCESessionsUpsertWithWhereUniqueWithoutCESessionInput = {
    where: ExtractedResourcesInCESessionsWhereUniqueInput
    update: XOR<ExtractedResourcesInCESessionsUpdateWithoutCESessionInput, ExtractedResourcesInCESessionsUncheckedUpdateWithoutCESessionInput>
    create: XOR<ExtractedResourcesInCESessionsCreateWithoutCESessionInput, ExtractedResourcesInCESessionsUncheckedCreateWithoutCESessionInput>
  }

  export type ExtractedResourcesInCESessionsUpdateWithWhereUniqueWithoutCESessionInput = {
    where: ExtractedResourcesInCESessionsWhereUniqueInput
    data: XOR<ExtractedResourcesInCESessionsUpdateWithoutCESessionInput, ExtractedResourcesInCESessionsUncheckedUpdateWithoutCESessionInput>
  }

  export type ExtractedResourcesInCESessionsUpdateManyWithWhereWithoutCESessionInput = {
    where: ExtractedResourcesInCESessionsScalarWhereInput
    data: XOR<ExtractedResourcesInCESessionsUpdateManyMutationInput, ExtractedResourcesInCESessionsUncheckedUpdateManyWithoutExtractedResourcesInCESessionsInput>
  }

  export type ExtractedResourcesInCESessionsScalarWhereInput = {
    AND?: Enumerable<ExtractedResourcesInCESessionsScalarWhereInput>
    OR?: Enumerable<ExtractedResourcesInCESessionsScalarWhereInput>
    NOT?: Enumerable<ExtractedResourcesInCESessionsScalarWhereInput>
    extractedResourceId?: StringFilter | string
    cESessionId?: StringFilter | string
    index?: IntFilter | number
    status?: EnumExtractedResourceStatusFilter | ExtractedResourceStatus
    result?: JsonFilter
  }

  export type UsersInCESessionsUpsertWithWhereUniqueWithoutCESessionInput = {
    where: UsersInCESessionsWhereUniqueInput
    update: XOR<UsersInCESessionsUpdateWithoutCESessionInput, UsersInCESessionsUncheckedUpdateWithoutCESessionInput>
    create: XOR<UsersInCESessionsCreateWithoutCESessionInput, UsersInCESessionsUncheckedCreateWithoutCESessionInput>
  }

  export type UsersInCESessionsUpdateWithWhereUniqueWithoutCESessionInput = {
    where: UsersInCESessionsWhereUniqueInput
    data: XOR<UsersInCESessionsUpdateWithoutCESessionInput, UsersInCESessionsUncheckedUpdateWithoutCESessionInput>
  }

  export type UsersInCESessionsUpdateManyWithWhereWithoutCESessionInput = {
    where: UsersInCESessionsScalarWhereInput
    data: XOR<UsersInCESessionsUpdateManyMutationInput, UsersInCESessionsUncheckedUpdateManyWithoutUsersInCESessionsInput>
  }

  export type UsersInCESessionsScalarWhereInput = {
    AND?: Enumerable<UsersInCESessionsScalarWhereInput>
    OR?: Enumerable<UsersInCESessionsScalarWhereInput>
    NOT?: Enumerable<UsersInCESessionsScalarWhereInput>
    userId?: StringFilter | string
    cESessionId?: StringFilter | string
    userRole?: EnumSessionUserRoleFilter | SessionUserRole
  }

  export type ProjectCreateWithoutDLSessionInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    Epic: EpicCreateNestedOneWithoutProjectInput
    CESession?: CESessionCreateNestedManyWithoutProjectInput
    RASession?: RASessionCreateNestedManyWithoutProjectInput
    UsersInProjects?: UsersInProjectsCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutDLSessionInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    epicId: string
    CESession?: CESessionUncheckedCreateNestedManyWithoutProjectInput
    RASession?: RASessionUncheckedCreateNestedManyWithoutProjectInput
    UsersInProjects?: UsersInProjectsUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutDLSessionInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutDLSessionInput, ProjectUncheckedCreateWithoutDLSessionInput>
  }

  export type ExtractedResourcesInDLSessionsCreateWithoutDLSessionInput = {
    status?: ExtractedResourceStatus
    ExtractedResource: ExtractedResourceCreateNestedOneWithoutExtractedResourcesInDLSessionsInput
    LabelsInExtractedResourcesInDLSessions?: LabelsInExtractedResourcesInDLSessionsCreateNestedManyWithoutExtractedResourcesInDLSessionsInput
  }

  export type ExtractedResourcesInDLSessionsUncheckedCreateWithoutDLSessionInput = {
    extractedResourceId: string
    status?: ExtractedResourceStatus
    LabelsInExtractedResourcesInDLSessions?: LabelsInExtractedResourcesInDLSessionsUncheckedCreateNestedManyWithoutExtractedResourcesInDLSessionsInput
  }

  export type ExtractedResourcesInDLSessionsCreateOrConnectWithoutDLSessionInput = {
    where: ExtractedResourcesInDLSessionsWhereUniqueInput
    create: XOR<ExtractedResourcesInDLSessionsCreateWithoutDLSessionInput, ExtractedResourcesInDLSessionsUncheckedCreateWithoutDLSessionInput>
  }

  export type ExtractedResourcesInDLSessionsCreateManyDLSessionInputEnvelope = {
    data: Enumerable<ExtractedResourcesInDLSessionsCreateManyDLSessionInput>
    skipDuplicates?: boolean
  }

  export type LabelsInDLSessionsCreateWithoutDLSessionInput = {
    Label: LabelCreateNestedOneWithoutLabelsInDLSessionsInput
  }

  export type LabelsInDLSessionsUncheckedCreateWithoutDLSessionInput = {
    labelId: string
  }

  export type LabelsInDLSessionsCreateOrConnectWithoutDLSessionInput = {
    where: LabelsInDLSessionsWhereUniqueInput
    create: XOR<LabelsInDLSessionsCreateWithoutDLSessionInput, LabelsInDLSessionsUncheckedCreateWithoutDLSessionInput>
  }

  export type LabelsInDLSessionsCreateManyDLSessionInputEnvelope = {
    data: Enumerable<LabelsInDLSessionsCreateManyDLSessionInput>
    skipDuplicates?: boolean
  }

  export type UsersInDLSessionsCreateWithoutDLSessionInput = {
    userId: string
    userRole: SessionUserRole
  }

  export type UsersInDLSessionsUncheckedCreateWithoutDLSessionInput = {
    userId: string
    userRole: SessionUserRole
  }

  export type UsersInDLSessionsCreateOrConnectWithoutDLSessionInput = {
    where: UsersInDLSessionsWhereUniqueInput
    create: XOR<UsersInDLSessionsCreateWithoutDLSessionInput, UsersInDLSessionsUncheckedCreateWithoutDLSessionInput>
  }

  export type UsersInDLSessionsCreateManyDLSessionInputEnvelope = {
    data: Enumerable<UsersInDLSessionsCreateManyDLSessionInput>
    skipDuplicates?: boolean
  }

  export type ProjectUpsertWithoutDLSessionInput = {
    update: XOR<ProjectUpdateWithoutDLSessionInput, ProjectUncheckedUpdateWithoutDLSessionInput>
    create: XOR<ProjectCreateWithoutDLSessionInput, ProjectUncheckedCreateWithoutDLSessionInput>
  }

  export type ProjectUpdateWithoutDLSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    Epic?: EpicUpdateOneRequiredWithoutProjectNestedInput
    CESession?: CESessionUpdateManyWithoutProjectNestedInput
    RASession?: RASessionUpdateManyWithoutProjectNestedInput
    UsersInProjects?: UsersInProjectsUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutDLSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    epicId?: StringFieldUpdateOperationsInput | string
    CESession?: CESessionUncheckedUpdateManyWithoutProjectNestedInput
    RASession?: RASessionUncheckedUpdateManyWithoutProjectNestedInput
    UsersInProjects?: UsersInProjectsUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ExtractedResourcesInDLSessionsUpsertWithWhereUniqueWithoutDLSessionInput = {
    where: ExtractedResourcesInDLSessionsWhereUniqueInput
    update: XOR<ExtractedResourcesInDLSessionsUpdateWithoutDLSessionInput, ExtractedResourcesInDLSessionsUncheckedUpdateWithoutDLSessionInput>
    create: XOR<ExtractedResourcesInDLSessionsCreateWithoutDLSessionInput, ExtractedResourcesInDLSessionsUncheckedCreateWithoutDLSessionInput>
  }

  export type ExtractedResourcesInDLSessionsUpdateWithWhereUniqueWithoutDLSessionInput = {
    where: ExtractedResourcesInDLSessionsWhereUniqueInput
    data: XOR<ExtractedResourcesInDLSessionsUpdateWithoutDLSessionInput, ExtractedResourcesInDLSessionsUncheckedUpdateWithoutDLSessionInput>
  }

  export type ExtractedResourcesInDLSessionsUpdateManyWithWhereWithoutDLSessionInput = {
    where: ExtractedResourcesInDLSessionsScalarWhereInput
    data: XOR<ExtractedResourcesInDLSessionsUpdateManyMutationInput, ExtractedResourcesInDLSessionsUncheckedUpdateManyWithoutExtractedResourcesInDLSessionsInput>
  }

  export type ExtractedResourcesInDLSessionsScalarWhereInput = {
    AND?: Enumerable<ExtractedResourcesInDLSessionsScalarWhereInput>
    OR?: Enumerable<ExtractedResourcesInDLSessionsScalarWhereInput>
    NOT?: Enumerable<ExtractedResourcesInDLSessionsScalarWhereInput>
    extractedResourceId?: StringFilter | string
    dLSessionId?: StringFilter | string
    status?: EnumExtractedResourceStatusFilter | ExtractedResourceStatus
  }

  export type LabelsInDLSessionsUpsertWithWhereUniqueWithoutDLSessionInput = {
    where: LabelsInDLSessionsWhereUniqueInput
    update: XOR<LabelsInDLSessionsUpdateWithoutDLSessionInput, LabelsInDLSessionsUncheckedUpdateWithoutDLSessionInput>
    create: XOR<LabelsInDLSessionsCreateWithoutDLSessionInput, LabelsInDLSessionsUncheckedCreateWithoutDLSessionInput>
  }

  export type LabelsInDLSessionsUpdateWithWhereUniqueWithoutDLSessionInput = {
    where: LabelsInDLSessionsWhereUniqueInput
    data: XOR<LabelsInDLSessionsUpdateWithoutDLSessionInput, LabelsInDLSessionsUncheckedUpdateWithoutDLSessionInput>
  }

  export type LabelsInDLSessionsUpdateManyWithWhereWithoutDLSessionInput = {
    where: LabelsInDLSessionsScalarWhereInput
    data: XOR<LabelsInDLSessionsUpdateManyMutationInput, LabelsInDLSessionsUncheckedUpdateManyWithoutLabelsInDLSessionsInput>
  }

  export type LabelsInDLSessionsScalarWhereInput = {
    AND?: Enumerable<LabelsInDLSessionsScalarWhereInput>
    OR?: Enumerable<LabelsInDLSessionsScalarWhereInput>
    NOT?: Enumerable<LabelsInDLSessionsScalarWhereInput>
    labelId?: StringFilter | string
    dLSessionId?: StringFilter | string
  }

  export type UsersInDLSessionsUpsertWithWhereUniqueWithoutDLSessionInput = {
    where: UsersInDLSessionsWhereUniqueInput
    update: XOR<UsersInDLSessionsUpdateWithoutDLSessionInput, UsersInDLSessionsUncheckedUpdateWithoutDLSessionInput>
    create: XOR<UsersInDLSessionsCreateWithoutDLSessionInput, UsersInDLSessionsUncheckedCreateWithoutDLSessionInput>
  }

  export type UsersInDLSessionsUpdateWithWhereUniqueWithoutDLSessionInput = {
    where: UsersInDLSessionsWhereUniqueInput
    data: XOR<UsersInDLSessionsUpdateWithoutDLSessionInput, UsersInDLSessionsUncheckedUpdateWithoutDLSessionInput>
  }

  export type UsersInDLSessionsUpdateManyWithWhereWithoutDLSessionInput = {
    where: UsersInDLSessionsScalarWhereInput
    data: XOR<UsersInDLSessionsUpdateManyMutationInput, UsersInDLSessionsUncheckedUpdateManyWithoutUsersInDLSessionsInput>
  }

  export type UsersInDLSessionsScalarWhereInput = {
    AND?: Enumerable<UsersInDLSessionsScalarWhereInput>
    OR?: Enumerable<UsersInDLSessionsScalarWhereInput>
    NOT?: Enumerable<UsersInDLSessionsScalarWhereInput>
    userId?: StringFilter | string
    dLSessionId?: StringFilter | string
    userRole?: EnumSessionUserRoleFilter | SessionUserRole
  }

  export type ProjectCreateWithoutEpicInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    CESession?: CESessionCreateNestedManyWithoutProjectInput
    DLSession?: DLSessionCreateNestedManyWithoutProjectInput
    RASession?: RASessionCreateNestedManyWithoutProjectInput
    UsersInProjects?: UsersInProjectsCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutEpicInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    CESession?: CESessionUncheckedCreateNestedManyWithoutProjectInput
    DLSession?: DLSessionUncheckedCreateNestedManyWithoutProjectInput
    RASession?: RASessionUncheckedCreateNestedManyWithoutProjectInput
    UsersInProjects?: UsersInProjectsUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutEpicInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutEpicInput, ProjectUncheckedCreateWithoutEpicInput>
  }

  export type ProjectCreateManyEpicInputEnvelope = {
    data: Enumerable<ProjectCreateManyEpicInput>
    skipDuplicates?: boolean
  }

  export type ProjectUpsertWithWhereUniqueWithoutEpicInput = {
    where: ProjectWhereUniqueInput
    update: XOR<ProjectUpdateWithoutEpicInput, ProjectUncheckedUpdateWithoutEpicInput>
    create: XOR<ProjectCreateWithoutEpicInput, ProjectUncheckedCreateWithoutEpicInput>
  }

  export type ProjectUpdateWithWhereUniqueWithoutEpicInput = {
    where: ProjectWhereUniqueInput
    data: XOR<ProjectUpdateWithoutEpicInput, ProjectUncheckedUpdateWithoutEpicInput>
  }

  export type ProjectUpdateManyWithWhereWithoutEpicInput = {
    where: ProjectScalarWhereInput
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyWithoutProjectInput>
  }

  export type ProjectScalarWhereInput = {
    AND?: Enumerable<ProjectScalarWhereInput>
    OR?: Enumerable<ProjectScalarWhereInput>
    NOT?: Enumerable<ProjectScalarWhereInput>
    id?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    name?: StringFilter | string
    description?: StringFilter | string
    epicId?: StringFilter | string
  }

  export type RawResourceCreateWithoutExtractedResourceInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    metadata: JsonNullValueInput | InputJsonValue
    machine: string
    center: string
    Visit: VisitCreateNestedOneWithoutRawResourceInput
  }

  export type RawResourceUncheckedCreateWithoutExtractedResourceInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    metadata: JsonNullValueInput | InputJsonValue
    machine: string
    center: string
    visitId: string
  }

  export type RawResourceCreateOrConnectWithoutExtractedResourceInput = {
    where: RawResourceWhereUniqueInput
    create: XOR<RawResourceCreateWithoutExtractedResourceInput, RawResourceUncheckedCreateWithoutExtractedResourceInput>
  }

  export type ExtractedResourcesInCESessionsCreateWithoutExtractedResourceInput = {
    index: number
    status?: ExtractedResourceStatus
    result: JsonNullValueInput | InputJsonValue
    CESession: CESessionCreateNestedOneWithoutExtractedResourcesInCESessionsInput
  }

  export type ExtractedResourcesInCESessionsUncheckedCreateWithoutExtractedResourceInput = {
    cESessionId: string
    index: number
    status?: ExtractedResourceStatus
    result: JsonNullValueInput | InputJsonValue
  }

  export type ExtractedResourcesInCESessionsCreateOrConnectWithoutExtractedResourceInput = {
    where: ExtractedResourcesInCESessionsWhereUniqueInput
    create: XOR<ExtractedResourcesInCESessionsCreateWithoutExtractedResourceInput, ExtractedResourcesInCESessionsUncheckedCreateWithoutExtractedResourceInput>
  }

  export type ExtractedResourcesInCESessionsCreateManyExtractedResourceInputEnvelope = {
    data: Enumerable<ExtractedResourcesInCESessionsCreateManyExtractedResourceInput>
    skipDuplicates?: boolean
  }

  export type ExtractedResourcesInDLSessionsCreateWithoutExtractedResourceInput = {
    status?: ExtractedResourceStatus
    DLSession: DLSessionCreateNestedOneWithoutExtractedResourcesInDLSessionsInput
    LabelsInExtractedResourcesInDLSessions?: LabelsInExtractedResourcesInDLSessionsCreateNestedManyWithoutExtractedResourcesInDLSessionsInput
  }

  export type ExtractedResourcesInDLSessionsUncheckedCreateWithoutExtractedResourceInput = {
    dLSessionId: string
    status?: ExtractedResourceStatus
    LabelsInExtractedResourcesInDLSessions?: LabelsInExtractedResourcesInDLSessionsUncheckedCreateNestedManyWithoutExtractedResourcesInDLSessionsInput
  }

  export type ExtractedResourcesInDLSessionsCreateOrConnectWithoutExtractedResourceInput = {
    where: ExtractedResourcesInDLSessionsWhereUniqueInput
    create: XOR<ExtractedResourcesInDLSessionsCreateWithoutExtractedResourceInput, ExtractedResourcesInDLSessionsUncheckedCreateWithoutExtractedResourceInput>
  }

  export type ExtractedResourcesInDLSessionsCreateManyExtractedResourceInputEnvelope = {
    data: Enumerable<ExtractedResourcesInDLSessionsCreateManyExtractedResourceInput>
    skipDuplicates?: boolean
  }

  export type RawResourceUpsertWithoutExtractedResourceInput = {
    update: XOR<RawResourceUpdateWithoutExtractedResourceInput, RawResourceUncheckedUpdateWithoutExtractedResourceInput>
    create: XOR<RawResourceCreateWithoutExtractedResourceInput, RawResourceUncheckedCreateWithoutExtractedResourceInput>
  }

  export type RawResourceUpdateWithoutExtractedResourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: JsonNullValueInput | InputJsonValue
    machine?: StringFieldUpdateOperationsInput | string
    center?: StringFieldUpdateOperationsInput | string
    Visit?: VisitUpdateOneRequiredWithoutRawResourceNestedInput
  }

  export type RawResourceUncheckedUpdateWithoutExtractedResourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: JsonNullValueInput | InputJsonValue
    machine?: StringFieldUpdateOperationsInput | string
    center?: StringFieldUpdateOperationsInput | string
    visitId?: StringFieldUpdateOperationsInput | string
  }

  export type ExtractedResourcesInCESessionsUpsertWithWhereUniqueWithoutExtractedResourceInput = {
    where: ExtractedResourcesInCESessionsWhereUniqueInput
    update: XOR<ExtractedResourcesInCESessionsUpdateWithoutExtractedResourceInput, ExtractedResourcesInCESessionsUncheckedUpdateWithoutExtractedResourceInput>
    create: XOR<ExtractedResourcesInCESessionsCreateWithoutExtractedResourceInput, ExtractedResourcesInCESessionsUncheckedCreateWithoutExtractedResourceInput>
  }

  export type ExtractedResourcesInCESessionsUpdateWithWhereUniqueWithoutExtractedResourceInput = {
    where: ExtractedResourcesInCESessionsWhereUniqueInput
    data: XOR<ExtractedResourcesInCESessionsUpdateWithoutExtractedResourceInput, ExtractedResourcesInCESessionsUncheckedUpdateWithoutExtractedResourceInput>
  }

  export type ExtractedResourcesInCESessionsUpdateManyWithWhereWithoutExtractedResourceInput = {
    where: ExtractedResourcesInCESessionsScalarWhereInput
    data: XOR<ExtractedResourcesInCESessionsUpdateManyMutationInput, ExtractedResourcesInCESessionsUncheckedUpdateManyWithoutExtractedResourcesInCESessionsInput>
  }

  export type ExtractedResourcesInDLSessionsUpsertWithWhereUniqueWithoutExtractedResourceInput = {
    where: ExtractedResourcesInDLSessionsWhereUniqueInput
    update: XOR<ExtractedResourcesInDLSessionsUpdateWithoutExtractedResourceInput, ExtractedResourcesInDLSessionsUncheckedUpdateWithoutExtractedResourceInput>
    create: XOR<ExtractedResourcesInDLSessionsCreateWithoutExtractedResourceInput, ExtractedResourcesInDLSessionsUncheckedCreateWithoutExtractedResourceInput>
  }

  export type ExtractedResourcesInDLSessionsUpdateWithWhereUniqueWithoutExtractedResourceInput = {
    where: ExtractedResourcesInDLSessionsWhereUniqueInput
    data: XOR<ExtractedResourcesInDLSessionsUpdateWithoutExtractedResourceInput, ExtractedResourcesInDLSessionsUncheckedUpdateWithoutExtractedResourceInput>
  }

  export type ExtractedResourcesInDLSessionsUpdateManyWithWhereWithoutExtractedResourceInput = {
    where: ExtractedResourcesInDLSessionsScalarWhereInput
    data: XOR<ExtractedResourcesInDLSessionsUpdateManyMutationInput, ExtractedResourcesInDLSessionsUncheckedUpdateManyWithoutExtractedResourcesInDLSessionsInput>
  }

  export type CESessionCreateWithoutExtractedResourcesInCESessionsInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: CESessionCreatesopInput | Enumerable<string>
    resultTemplate: JsonNullValueInput | InputJsonValue
    Project: ProjectCreateNestedOneWithoutCESessionInput
    UsersInCESessions?: UsersInCESessionsCreateNestedManyWithoutCESessionInput
  }

  export type CESessionUncheckedCreateWithoutExtractedResourcesInCESessionsInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: CESessionCreatesopInput | Enumerable<string>
    resultTemplate: JsonNullValueInput | InputJsonValue
    projectId: string
    UsersInCESessions?: UsersInCESessionsUncheckedCreateNestedManyWithoutCESessionInput
  }

  export type CESessionCreateOrConnectWithoutExtractedResourcesInCESessionsInput = {
    where: CESessionWhereUniqueInput
    create: XOR<CESessionCreateWithoutExtractedResourcesInCESessionsInput, CESessionUncheckedCreateWithoutExtractedResourcesInCESessionsInput>
  }

  export type ExtractedResourceCreateWithoutExtractedResourcesInCESessionsInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    metadata: JsonNullValueInput | InputJsonValue
    RawResource: RawResourceCreateNestedOneWithoutExtractedResourceInput
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsCreateNestedManyWithoutExtractedResourceInput
  }

  export type ExtractedResourceUncheckedCreateWithoutExtractedResourcesInCESessionsInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    metadata: JsonNullValueInput | InputJsonValue
    rawResourceId: string
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsUncheckedCreateNestedManyWithoutExtractedResourceInput
  }

  export type ExtractedResourceCreateOrConnectWithoutExtractedResourcesInCESessionsInput = {
    where: ExtractedResourceWhereUniqueInput
    create: XOR<ExtractedResourceCreateWithoutExtractedResourcesInCESessionsInput, ExtractedResourceUncheckedCreateWithoutExtractedResourcesInCESessionsInput>
  }

  export type CESessionUpsertWithoutExtractedResourcesInCESessionsInput = {
    update: XOR<CESessionUpdateWithoutExtractedResourcesInCESessionsInput, CESessionUncheckedUpdateWithoutExtractedResourcesInCESessionsInput>
    create: XOR<CESessionCreateWithoutExtractedResourcesInCESessionsInput, CESessionUncheckedCreateWithoutExtractedResourcesInCESessionsInput>
  }

  export type CESessionUpdateWithoutExtractedResourcesInCESessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: CESessionUpdatesopInput | Enumerable<string>
    resultTemplate?: JsonNullValueInput | InputJsonValue
    Project?: ProjectUpdateOneRequiredWithoutCESessionNestedInput
    UsersInCESessions?: UsersInCESessionsUpdateManyWithoutCESessionNestedInput
  }

  export type CESessionUncheckedUpdateWithoutExtractedResourcesInCESessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: CESessionUpdatesopInput | Enumerable<string>
    resultTemplate?: JsonNullValueInput | InputJsonValue
    projectId?: StringFieldUpdateOperationsInput | string
    UsersInCESessions?: UsersInCESessionsUncheckedUpdateManyWithoutCESessionNestedInput
  }

  export type ExtractedResourceUpsertWithoutExtractedResourcesInCESessionsInput = {
    update: XOR<ExtractedResourceUpdateWithoutExtractedResourcesInCESessionsInput, ExtractedResourceUncheckedUpdateWithoutExtractedResourcesInCESessionsInput>
    create: XOR<ExtractedResourceCreateWithoutExtractedResourcesInCESessionsInput, ExtractedResourceUncheckedCreateWithoutExtractedResourcesInCESessionsInput>
  }

  export type ExtractedResourceUpdateWithoutExtractedResourcesInCESessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: JsonNullValueInput | InputJsonValue
    RawResource?: RawResourceUpdateOneRequiredWithoutExtractedResourceNestedInput
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsUpdateManyWithoutExtractedResourceNestedInput
  }

  export type ExtractedResourceUncheckedUpdateWithoutExtractedResourcesInCESessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: JsonNullValueInput | InputJsonValue
    rawResourceId?: StringFieldUpdateOperationsInput | string
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsUncheckedUpdateManyWithoutExtractedResourceNestedInput
  }

  export type DLSessionCreateWithoutExtractedResourcesInDLSessionsInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: DLSessionCreatesopInput | Enumerable<string>
    Project: ProjectCreateNestedOneWithoutDLSessionInput
    LabelsInDLSessions?: LabelsInDLSessionsCreateNestedManyWithoutDLSessionInput
    UsersInDLSessions?: UsersInDLSessionsCreateNestedManyWithoutDLSessionInput
  }

  export type DLSessionUncheckedCreateWithoutExtractedResourcesInDLSessionsInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: DLSessionCreatesopInput | Enumerable<string>
    projectId: string
    LabelsInDLSessions?: LabelsInDLSessionsUncheckedCreateNestedManyWithoutDLSessionInput
    UsersInDLSessions?: UsersInDLSessionsUncheckedCreateNestedManyWithoutDLSessionInput
  }

  export type DLSessionCreateOrConnectWithoutExtractedResourcesInDLSessionsInput = {
    where: DLSessionWhereUniqueInput
    create: XOR<DLSessionCreateWithoutExtractedResourcesInDLSessionsInput, DLSessionUncheckedCreateWithoutExtractedResourcesInDLSessionsInput>
  }

  export type ExtractedResourceCreateWithoutExtractedResourcesInDLSessionsInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    metadata: JsonNullValueInput | InputJsonValue
    RawResource: RawResourceCreateNestedOneWithoutExtractedResourceInput
    ExtractedResourcesInCESessions?: ExtractedResourcesInCESessionsCreateNestedManyWithoutExtractedResourceInput
  }

  export type ExtractedResourceUncheckedCreateWithoutExtractedResourcesInDLSessionsInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    metadata: JsonNullValueInput | InputJsonValue
    rawResourceId: string
    ExtractedResourcesInCESessions?: ExtractedResourcesInCESessionsUncheckedCreateNestedManyWithoutExtractedResourceInput
  }

  export type ExtractedResourceCreateOrConnectWithoutExtractedResourcesInDLSessionsInput = {
    where: ExtractedResourceWhereUniqueInput
    create: XOR<ExtractedResourceCreateWithoutExtractedResourcesInDLSessionsInput, ExtractedResourceUncheckedCreateWithoutExtractedResourcesInDLSessionsInput>
  }

  export type LabelsInExtractedResourcesInDLSessionsCreateWithoutExtractedResourcesInDLSessionsInput = {
    Label: LabelCreateNestedOneWithoutLabelsInExtractedResourcesInDLSessionsInput
  }

  export type LabelsInExtractedResourcesInDLSessionsUncheckedCreateWithoutExtractedResourcesInDLSessionsInput = {
    labelId: string
  }

  export type LabelsInExtractedResourcesInDLSessionsCreateOrConnectWithoutExtractedResourcesInDLSessionsInput = {
    where: LabelsInExtractedResourcesInDLSessionsWhereUniqueInput
    create: XOR<LabelsInExtractedResourcesInDLSessionsCreateWithoutExtractedResourcesInDLSessionsInput, LabelsInExtractedResourcesInDLSessionsUncheckedCreateWithoutExtractedResourcesInDLSessionsInput>
  }

  export type LabelsInExtractedResourcesInDLSessionsCreateManyExtractedResourcesInDLSessionsInputEnvelope = {
    data: Enumerable<LabelsInExtractedResourcesInDLSessionsCreateManyExtractedResourcesInDLSessionsInput>
    skipDuplicates?: boolean
  }

  export type DLSessionUpsertWithoutExtractedResourcesInDLSessionsInput = {
    update: XOR<DLSessionUpdateWithoutExtractedResourcesInDLSessionsInput, DLSessionUncheckedUpdateWithoutExtractedResourcesInDLSessionsInput>
    create: XOR<DLSessionCreateWithoutExtractedResourcesInDLSessionsInput, DLSessionUncheckedCreateWithoutExtractedResourcesInDLSessionsInput>
  }

  export type DLSessionUpdateWithoutExtractedResourcesInDLSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: DLSessionUpdatesopInput | Enumerable<string>
    Project?: ProjectUpdateOneRequiredWithoutDLSessionNestedInput
    LabelsInDLSessions?: LabelsInDLSessionsUpdateManyWithoutDLSessionNestedInput
    UsersInDLSessions?: UsersInDLSessionsUpdateManyWithoutDLSessionNestedInput
  }

  export type DLSessionUncheckedUpdateWithoutExtractedResourcesInDLSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: DLSessionUpdatesopInput | Enumerable<string>
    projectId?: StringFieldUpdateOperationsInput | string
    LabelsInDLSessions?: LabelsInDLSessionsUncheckedUpdateManyWithoutDLSessionNestedInput
    UsersInDLSessions?: UsersInDLSessionsUncheckedUpdateManyWithoutDLSessionNestedInput
  }

  export type ExtractedResourceUpsertWithoutExtractedResourcesInDLSessionsInput = {
    update: XOR<ExtractedResourceUpdateWithoutExtractedResourcesInDLSessionsInput, ExtractedResourceUncheckedUpdateWithoutExtractedResourcesInDLSessionsInput>
    create: XOR<ExtractedResourceCreateWithoutExtractedResourcesInDLSessionsInput, ExtractedResourceUncheckedCreateWithoutExtractedResourcesInDLSessionsInput>
  }

  export type ExtractedResourceUpdateWithoutExtractedResourcesInDLSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: JsonNullValueInput | InputJsonValue
    RawResource?: RawResourceUpdateOneRequiredWithoutExtractedResourceNestedInput
    ExtractedResourcesInCESessions?: ExtractedResourcesInCESessionsUpdateManyWithoutExtractedResourceNestedInput
  }

  export type ExtractedResourceUncheckedUpdateWithoutExtractedResourcesInDLSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: JsonNullValueInput | InputJsonValue
    rawResourceId?: StringFieldUpdateOperationsInput | string
    ExtractedResourcesInCESessions?: ExtractedResourcesInCESessionsUncheckedUpdateManyWithoutExtractedResourceNestedInput
  }

  export type LabelsInExtractedResourcesInDLSessionsUpsertWithWhereUniqueWithoutExtractedResourcesInDLSessionsInput = {
    where: LabelsInExtractedResourcesInDLSessionsWhereUniqueInput
    update: XOR<LabelsInExtractedResourcesInDLSessionsUpdateWithoutExtractedResourcesInDLSessionsInput, LabelsInExtractedResourcesInDLSessionsUncheckedUpdateWithoutExtractedResourcesInDLSessionsInput>
    create: XOR<LabelsInExtractedResourcesInDLSessionsCreateWithoutExtractedResourcesInDLSessionsInput, LabelsInExtractedResourcesInDLSessionsUncheckedCreateWithoutExtractedResourcesInDLSessionsInput>
  }

  export type LabelsInExtractedResourcesInDLSessionsUpdateWithWhereUniqueWithoutExtractedResourcesInDLSessionsInput = {
    where: LabelsInExtractedResourcesInDLSessionsWhereUniqueInput
    data: XOR<LabelsInExtractedResourcesInDLSessionsUpdateWithoutExtractedResourcesInDLSessionsInput, LabelsInExtractedResourcesInDLSessionsUncheckedUpdateWithoutExtractedResourcesInDLSessionsInput>
  }

  export type LabelsInExtractedResourcesInDLSessionsUpdateManyWithWhereWithoutExtractedResourcesInDLSessionsInput = {
    where: LabelsInExtractedResourcesInDLSessionsScalarWhereInput
    data: XOR<LabelsInExtractedResourcesInDLSessionsUpdateManyMutationInput, LabelsInExtractedResourcesInDLSessionsUncheckedUpdateManyWithoutLabelsInExtractedResourcesInDLSessionsInput>
  }

  export type LabelsInExtractedResourcesInDLSessionsScalarWhereInput = {
    AND?: Enumerable<LabelsInExtractedResourcesInDLSessionsScalarWhereInput>
    OR?: Enumerable<LabelsInExtractedResourcesInDLSessionsScalarWhereInput>
    NOT?: Enumerable<LabelsInExtractedResourcesInDLSessionsScalarWhereInput>
    labelId?: StringFilter | string
    extractedResourceId?: StringFilter | string
    dLSessionId?: StringFilter | string
  }

  export type LabelsInDLSessionsCreateWithoutLabelInput = {
    DLSession: DLSessionCreateNestedOneWithoutLabelsInDLSessionsInput
  }

  export type LabelsInDLSessionsUncheckedCreateWithoutLabelInput = {
    dLSessionId: string
  }

  export type LabelsInDLSessionsCreateOrConnectWithoutLabelInput = {
    where: LabelsInDLSessionsWhereUniqueInput
    create: XOR<LabelsInDLSessionsCreateWithoutLabelInput, LabelsInDLSessionsUncheckedCreateWithoutLabelInput>
  }

  export type LabelsInDLSessionsCreateManyLabelInputEnvelope = {
    data: Enumerable<LabelsInDLSessionsCreateManyLabelInput>
    skipDuplicates?: boolean
  }

  export type LabelsInExtractedResourcesInDLSessionsCreateWithoutLabelInput = {
    ExtractedResourcesInDLSessions: ExtractedResourcesInDLSessionsCreateNestedOneWithoutLabelsInExtractedResourcesInDLSessionsInput
  }

  export type LabelsInExtractedResourcesInDLSessionsUncheckedCreateWithoutLabelInput = {
    extractedResourceId: string
    dLSessionId: string
  }

  export type LabelsInExtractedResourcesInDLSessionsCreateOrConnectWithoutLabelInput = {
    where: LabelsInExtractedResourcesInDLSessionsWhereUniqueInput
    create: XOR<LabelsInExtractedResourcesInDLSessionsCreateWithoutLabelInput, LabelsInExtractedResourcesInDLSessionsUncheckedCreateWithoutLabelInput>
  }

  export type LabelsInExtractedResourcesInDLSessionsCreateManyLabelInputEnvelope = {
    data: Enumerable<LabelsInExtractedResourcesInDLSessionsCreateManyLabelInput>
    skipDuplicates?: boolean
  }

  export type LabelsInDLSessionsUpsertWithWhereUniqueWithoutLabelInput = {
    where: LabelsInDLSessionsWhereUniqueInput
    update: XOR<LabelsInDLSessionsUpdateWithoutLabelInput, LabelsInDLSessionsUncheckedUpdateWithoutLabelInput>
    create: XOR<LabelsInDLSessionsCreateWithoutLabelInput, LabelsInDLSessionsUncheckedCreateWithoutLabelInput>
  }

  export type LabelsInDLSessionsUpdateWithWhereUniqueWithoutLabelInput = {
    where: LabelsInDLSessionsWhereUniqueInput
    data: XOR<LabelsInDLSessionsUpdateWithoutLabelInput, LabelsInDLSessionsUncheckedUpdateWithoutLabelInput>
  }

  export type LabelsInDLSessionsUpdateManyWithWhereWithoutLabelInput = {
    where: LabelsInDLSessionsScalarWhereInput
    data: XOR<LabelsInDLSessionsUpdateManyMutationInput, LabelsInDLSessionsUncheckedUpdateManyWithoutLabelsInDLSessionsInput>
  }

  export type LabelsInExtractedResourcesInDLSessionsUpsertWithWhereUniqueWithoutLabelInput = {
    where: LabelsInExtractedResourcesInDLSessionsWhereUniqueInput
    update: XOR<LabelsInExtractedResourcesInDLSessionsUpdateWithoutLabelInput, LabelsInExtractedResourcesInDLSessionsUncheckedUpdateWithoutLabelInput>
    create: XOR<LabelsInExtractedResourcesInDLSessionsCreateWithoutLabelInput, LabelsInExtractedResourcesInDLSessionsUncheckedCreateWithoutLabelInput>
  }

  export type LabelsInExtractedResourcesInDLSessionsUpdateWithWhereUniqueWithoutLabelInput = {
    where: LabelsInExtractedResourcesInDLSessionsWhereUniqueInput
    data: XOR<LabelsInExtractedResourcesInDLSessionsUpdateWithoutLabelInput, LabelsInExtractedResourcesInDLSessionsUncheckedUpdateWithoutLabelInput>
  }

  export type LabelsInExtractedResourcesInDLSessionsUpdateManyWithWhereWithoutLabelInput = {
    where: LabelsInExtractedResourcesInDLSessionsScalarWhereInput
    data: XOR<LabelsInExtractedResourcesInDLSessionsUpdateManyMutationInput, LabelsInExtractedResourcesInDLSessionsUncheckedUpdateManyWithoutLabelsInExtractedResourcesInDLSessionsInput>
  }

  export type DLSessionCreateWithoutLabelsInDLSessionsInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: DLSessionCreatesopInput | Enumerable<string>
    Project: ProjectCreateNestedOneWithoutDLSessionInput
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsCreateNestedManyWithoutDLSessionInput
    UsersInDLSessions?: UsersInDLSessionsCreateNestedManyWithoutDLSessionInput
  }

  export type DLSessionUncheckedCreateWithoutLabelsInDLSessionsInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: DLSessionCreatesopInput | Enumerable<string>
    projectId: string
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsUncheckedCreateNestedManyWithoutDLSessionInput
    UsersInDLSessions?: UsersInDLSessionsUncheckedCreateNestedManyWithoutDLSessionInput
  }

  export type DLSessionCreateOrConnectWithoutLabelsInDLSessionsInput = {
    where: DLSessionWhereUniqueInput
    create: XOR<DLSessionCreateWithoutLabelsInDLSessionsInput, DLSessionUncheckedCreateWithoutLabelsInDLSessionsInput>
  }

  export type LabelCreateWithoutLabelsInDLSessionsInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    abbreviation: string
    LabelsInExtractedResourcesInDLSessions?: LabelsInExtractedResourcesInDLSessionsCreateNestedManyWithoutLabelInput
  }

  export type LabelUncheckedCreateWithoutLabelsInDLSessionsInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    abbreviation: string
    LabelsInExtractedResourcesInDLSessions?: LabelsInExtractedResourcesInDLSessionsUncheckedCreateNestedManyWithoutLabelInput
  }

  export type LabelCreateOrConnectWithoutLabelsInDLSessionsInput = {
    where: LabelWhereUniqueInput
    create: XOR<LabelCreateWithoutLabelsInDLSessionsInput, LabelUncheckedCreateWithoutLabelsInDLSessionsInput>
  }

  export type DLSessionUpsertWithoutLabelsInDLSessionsInput = {
    update: XOR<DLSessionUpdateWithoutLabelsInDLSessionsInput, DLSessionUncheckedUpdateWithoutLabelsInDLSessionsInput>
    create: XOR<DLSessionCreateWithoutLabelsInDLSessionsInput, DLSessionUncheckedCreateWithoutLabelsInDLSessionsInput>
  }

  export type DLSessionUpdateWithoutLabelsInDLSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: DLSessionUpdatesopInput | Enumerable<string>
    Project?: ProjectUpdateOneRequiredWithoutDLSessionNestedInput
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsUpdateManyWithoutDLSessionNestedInput
    UsersInDLSessions?: UsersInDLSessionsUpdateManyWithoutDLSessionNestedInput
  }

  export type DLSessionUncheckedUpdateWithoutLabelsInDLSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: DLSessionUpdatesopInput | Enumerable<string>
    projectId?: StringFieldUpdateOperationsInput | string
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsUncheckedUpdateManyWithoutDLSessionNestedInput
    UsersInDLSessions?: UsersInDLSessionsUncheckedUpdateManyWithoutDLSessionNestedInput
  }

  export type LabelUpsertWithoutLabelsInDLSessionsInput = {
    update: XOR<LabelUpdateWithoutLabelsInDLSessionsInput, LabelUncheckedUpdateWithoutLabelsInDLSessionsInput>
    create: XOR<LabelCreateWithoutLabelsInDLSessionsInput, LabelUncheckedCreateWithoutLabelsInDLSessionsInput>
  }

  export type LabelUpdateWithoutLabelsInDLSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    LabelsInExtractedResourcesInDLSessions?: LabelsInExtractedResourcesInDLSessionsUpdateManyWithoutLabelNestedInput
  }

  export type LabelUncheckedUpdateWithoutLabelsInDLSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    LabelsInExtractedResourcesInDLSessions?: LabelsInExtractedResourcesInDLSessionsUncheckedUpdateManyWithoutLabelNestedInput
  }

  export type ExtractedResourcesInDLSessionsCreateWithoutLabelsInExtractedResourcesInDLSessionsInput = {
    status?: ExtractedResourceStatus
    DLSession: DLSessionCreateNestedOneWithoutExtractedResourcesInDLSessionsInput
    ExtractedResource: ExtractedResourceCreateNestedOneWithoutExtractedResourcesInDLSessionsInput
  }

  export type ExtractedResourcesInDLSessionsUncheckedCreateWithoutLabelsInExtractedResourcesInDLSessionsInput = {
    extractedResourceId: string
    dLSessionId: string
    status?: ExtractedResourceStatus
  }

  export type ExtractedResourcesInDLSessionsCreateOrConnectWithoutLabelsInExtractedResourcesInDLSessionsInput = {
    where: ExtractedResourcesInDLSessionsWhereUniqueInput
    create: XOR<ExtractedResourcesInDLSessionsCreateWithoutLabelsInExtractedResourcesInDLSessionsInput, ExtractedResourcesInDLSessionsUncheckedCreateWithoutLabelsInExtractedResourcesInDLSessionsInput>
  }

  export type LabelCreateWithoutLabelsInExtractedResourcesInDLSessionsInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    abbreviation: string
    LabelsInDLSessions?: LabelsInDLSessionsCreateNestedManyWithoutLabelInput
  }

  export type LabelUncheckedCreateWithoutLabelsInExtractedResourcesInDLSessionsInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    abbreviation: string
    LabelsInDLSessions?: LabelsInDLSessionsUncheckedCreateNestedManyWithoutLabelInput
  }

  export type LabelCreateOrConnectWithoutLabelsInExtractedResourcesInDLSessionsInput = {
    where: LabelWhereUniqueInput
    create: XOR<LabelCreateWithoutLabelsInExtractedResourcesInDLSessionsInput, LabelUncheckedCreateWithoutLabelsInExtractedResourcesInDLSessionsInput>
  }

  export type ExtractedResourcesInDLSessionsUpsertWithoutLabelsInExtractedResourcesInDLSessionsInput = {
    update: XOR<ExtractedResourcesInDLSessionsUpdateWithoutLabelsInExtractedResourcesInDLSessionsInput, ExtractedResourcesInDLSessionsUncheckedUpdateWithoutLabelsInExtractedResourcesInDLSessionsInput>
    create: XOR<ExtractedResourcesInDLSessionsCreateWithoutLabelsInExtractedResourcesInDLSessionsInput, ExtractedResourcesInDLSessionsUncheckedCreateWithoutLabelsInExtractedResourcesInDLSessionsInput>
  }

  export type ExtractedResourcesInDLSessionsUpdateWithoutLabelsInExtractedResourcesInDLSessionsInput = {
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
    DLSession?: DLSessionUpdateOneRequiredWithoutExtractedResourcesInDLSessionsNestedInput
    ExtractedResource?: ExtractedResourceUpdateOneRequiredWithoutExtractedResourcesInDLSessionsNestedInput
  }

  export type ExtractedResourcesInDLSessionsUncheckedUpdateWithoutLabelsInExtractedResourcesInDLSessionsInput = {
    extractedResourceId?: StringFieldUpdateOperationsInput | string
    dLSessionId?: StringFieldUpdateOperationsInput | string
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
  }

  export type LabelUpsertWithoutLabelsInExtractedResourcesInDLSessionsInput = {
    update: XOR<LabelUpdateWithoutLabelsInExtractedResourcesInDLSessionsInput, LabelUncheckedUpdateWithoutLabelsInExtractedResourcesInDLSessionsInput>
    create: XOR<LabelCreateWithoutLabelsInExtractedResourcesInDLSessionsInput, LabelUncheckedCreateWithoutLabelsInExtractedResourcesInDLSessionsInput>
  }

  export type LabelUpdateWithoutLabelsInExtractedResourcesInDLSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    LabelsInDLSessions?: LabelsInDLSessionsUpdateManyWithoutLabelNestedInput
  }

  export type LabelUncheckedUpdateWithoutLabelsInExtractedResourcesInDLSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    LabelsInDLSessions?: LabelsInDLSessionsUncheckedUpdateManyWithoutLabelNestedInput
  }

  export type VisitCreateWithoutPatientInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    RawResource?: RawResourceCreateNestedManyWithoutVisitInput
    VisitsInRASessions?: VisitsInRASessionsCreateNestedManyWithoutVisitInput
  }

  export type VisitUncheckedCreateWithoutPatientInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    RawResource?: RawResourceUncheckedCreateNestedManyWithoutVisitInput
    VisitsInRASessions?: VisitsInRASessionsUncheckedCreateNestedManyWithoutVisitInput
  }

  export type VisitCreateOrConnectWithoutPatientInput = {
    where: VisitWhereUniqueInput
    create: XOR<VisitCreateWithoutPatientInput, VisitUncheckedCreateWithoutPatientInput>
  }

  export type VisitCreateManyPatientInputEnvelope = {
    data: Enumerable<VisitCreateManyPatientInput>
    skipDuplicates?: boolean
  }

  export type VisitUpsertWithWhereUniqueWithoutPatientInput = {
    where: VisitWhereUniqueInput
    update: XOR<VisitUpdateWithoutPatientInput, VisitUncheckedUpdateWithoutPatientInput>
    create: XOR<VisitCreateWithoutPatientInput, VisitUncheckedCreateWithoutPatientInput>
  }

  export type VisitUpdateWithWhereUniqueWithoutPatientInput = {
    where: VisitWhereUniqueInput
    data: XOR<VisitUpdateWithoutPatientInput, VisitUncheckedUpdateWithoutPatientInput>
  }

  export type VisitUpdateManyWithWhereWithoutPatientInput = {
    where: VisitScalarWhereInput
    data: XOR<VisitUpdateManyMutationInput, VisitUncheckedUpdateManyWithoutVisitInput>
  }

  export type VisitScalarWhereInput = {
    AND?: Enumerable<VisitScalarWhereInput>
    OR?: Enumerable<VisitScalarWhereInput>
    NOT?: Enumerable<VisitScalarWhereInput>
    id?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    patientId?: StringFilter | string
  }

  export type EpicCreateWithoutProjectInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
  }

  export type EpicUncheckedCreateWithoutProjectInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
  }

  export type EpicCreateOrConnectWithoutProjectInput = {
    where: EpicWhereUniqueInput
    create: XOR<EpicCreateWithoutProjectInput, EpicUncheckedCreateWithoutProjectInput>
  }

  export type CESessionCreateWithoutProjectInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: CESessionCreatesopInput | Enumerable<string>
    resultTemplate: JsonNullValueInput | InputJsonValue
    ExtractedResourcesInCESessions?: ExtractedResourcesInCESessionsCreateNestedManyWithoutCESessionInput
    UsersInCESessions?: UsersInCESessionsCreateNestedManyWithoutCESessionInput
  }

  export type CESessionUncheckedCreateWithoutProjectInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: CESessionCreatesopInput | Enumerable<string>
    resultTemplate: JsonNullValueInput | InputJsonValue
    ExtractedResourcesInCESessions?: ExtractedResourcesInCESessionsUncheckedCreateNestedManyWithoutCESessionInput
    UsersInCESessions?: UsersInCESessionsUncheckedCreateNestedManyWithoutCESessionInput
  }

  export type CESessionCreateOrConnectWithoutProjectInput = {
    where: CESessionWhereUniqueInput
    create: XOR<CESessionCreateWithoutProjectInput, CESessionUncheckedCreateWithoutProjectInput>
  }

  export type CESessionCreateManyProjectInputEnvelope = {
    data: Enumerable<CESessionCreateManyProjectInput>
    skipDuplicates?: boolean
  }

  export type DLSessionCreateWithoutProjectInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: DLSessionCreatesopInput | Enumerable<string>
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsCreateNestedManyWithoutDLSessionInput
    LabelsInDLSessions?: LabelsInDLSessionsCreateNestedManyWithoutDLSessionInput
    UsersInDLSessions?: UsersInDLSessionsCreateNestedManyWithoutDLSessionInput
  }

  export type DLSessionUncheckedCreateWithoutProjectInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: DLSessionCreatesopInput | Enumerable<string>
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsUncheckedCreateNestedManyWithoutDLSessionInput
    LabelsInDLSessions?: LabelsInDLSessionsUncheckedCreateNestedManyWithoutDLSessionInput
    UsersInDLSessions?: UsersInDLSessionsUncheckedCreateNestedManyWithoutDLSessionInput
  }

  export type DLSessionCreateOrConnectWithoutProjectInput = {
    where: DLSessionWhereUniqueInput
    create: XOR<DLSessionCreateWithoutProjectInput, DLSessionUncheckedCreateWithoutProjectInput>
  }

  export type DLSessionCreateManyProjectInputEnvelope = {
    data: Enumerable<DLSessionCreateManyProjectInput>
    skipDuplicates?: boolean
  }

  export type RASessionCreateWithoutProjectInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: RASessionCreatesopInput | Enumerable<string>
    template: JsonNullValueInput | InputJsonValue
    UsersInRASessions?: UsersInRASessionsCreateNestedManyWithoutRASessionInput
    VisitsInRASessions?: VisitsInRASessionsCreateNestedManyWithoutRASessionInput
  }

  export type RASessionUncheckedCreateWithoutProjectInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: RASessionCreatesopInput | Enumerable<string>
    template: JsonNullValueInput | InputJsonValue
    UsersInRASessions?: UsersInRASessionsUncheckedCreateNestedManyWithoutRASessionInput
    VisitsInRASessions?: VisitsInRASessionsUncheckedCreateNestedManyWithoutRASessionInput
  }

  export type RASessionCreateOrConnectWithoutProjectInput = {
    where: RASessionWhereUniqueInput
    create: XOR<RASessionCreateWithoutProjectInput, RASessionUncheckedCreateWithoutProjectInput>
  }

  export type RASessionCreateManyProjectInputEnvelope = {
    data: Enumerable<RASessionCreateManyProjectInput>
    skipDuplicates?: boolean
  }

  export type UsersInProjectsCreateWithoutProjectInput = {
    userId: string
    userRole: ProjectUserRole
  }

  export type UsersInProjectsUncheckedCreateWithoutProjectInput = {
    userId: string
    userRole: ProjectUserRole
  }

  export type UsersInProjectsCreateOrConnectWithoutProjectInput = {
    where: UsersInProjectsWhereUniqueInput
    create: XOR<UsersInProjectsCreateWithoutProjectInput, UsersInProjectsUncheckedCreateWithoutProjectInput>
  }

  export type UsersInProjectsCreateManyProjectInputEnvelope = {
    data: Enumerable<UsersInProjectsCreateManyProjectInput>
    skipDuplicates?: boolean
  }

  export type EpicUpsertWithoutProjectInput = {
    update: XOR<EpicUpdateWithoutProjectInput, EpicUncheckedUpdateWithoutProjectInput>
    create: XOR<EpicCreateWithoutProjectInput, EpicUncheckedCreateWithoutProjectInput>
  }

  export type EpicUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
  }

  export type EpicUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
  }

  export type CESessionUpsertWithWhereUniqueWithoutProjectInput = {
    where: CESessionWhereUniqueInput
    update: XOR<CESessionUpdateWithoutProjectInput, CESessionUncheckedUpdateWithoutProjectInput>
    create: XOR<CESessionCreateWithoutProjectInput, CESessionUncheckedCreateWithoutProjectInput>
  }

  export type CESessionUpdateWithWhereUniqueWithoutProjectInput = {
    where: CESessionWhereUniqueInput
    data: XOR<CESessionUpdateWithoutProjectInput, CESessionUncheckedUpdateWithoutProjectInput>
  }

  export type CESessionUpdateManyWithWhereWithoutProjectInput = {
    where: CESessionScalarWhereInput
    data: XOR<CESessionUpdateManyMutationInput, CESessionUncheckedUpdateManyWithoutCESessionInput>
  }

  export type CESessionScalarWhereInput = {
    AND?: Enumerable<CESessionScalarWhereInput>
    OR?: Enumerable<CESessionScalarWhereInput>
    NOT?: Enumerable<CESessionScalarWhereInput>
    id?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    name?: StringFilter | string
    description?: StringFilter | string
    priority?: IntFilter | number
    sop?: StringNullableListFilter
    resultTemplate?: JsonFilter
    projectId?: StringFilter | string
  }

  export type DLSessionUpsertWithWhereUniqueWithoutProjectInput = {
    where: DLSessionWhereUniqueInput
    update: XOR<DLSessionUpdateWithoutProjectInput, DLSessionUncheckedUpdateWithoutProjectInput>
    create: XOR<DLSessionCreateWithoutProjectInput, DLSessionUncheckedCreateWithoutProjectInput>
  }

  export type DLSessionUpdateWithWhereUniqueWithoutProjectInput = {
    where: DLSessionWhereUniqueInput
    data: XOR<DLSessionUpdateWithoutProjectInput, DLSessionUncheckedUpdateWithoutProjectInput>
  }

  export type DLSessionUpdateManyWithWhereWithoutProjectInput = {
    where: DLSessionScalarWhereInput
    data: XOR<DLSessionUpdateManyMutationInput, DLSessionUncheckedUpdateManyWithoutDLSessionInput>
  }

  export type DLSessionScalarWhereInput = {
    AND?: Enumerable<DLSessionScalarWhereInput>
    OR?: Enumerable<DLSessionScalarWhereInput>
    NOT?: Enumerable<DLSessionScalarWhereInput>
    id?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    name?: StringFilter | string
    description?: StringFilter | string
    priority?: IntFilter | number
    sop?: StringNullableListFilter
    projectId?: StringFilter | string
  }

  export type RASessionUpsertWithWhereUniqueWithoutProjectInput = {
    where: RASessionWhereUniqueInput
    update: XOR<RASessionUpdateWithoutProjectInput, RASessionUncheckedUpdateWithoutProjectInput>
    create: XOR<RASessionCreateWithoutProjectInput, RASessionUncheckedCreateWithoutProjectInput>
  }

  export type RASessionUpdateWithWhereUniqueWithoutProjectInput = {
    where: RASessionWhereUniqueInput
    data: XOR<RASessionUpdateWithoutProjectInput, RASessionUncheckedUpdateWithoutProjectInput>
  }

  export type RASessionUpdateManyWithWhereWithoutProjectInput = {
    where: RASessionScalarWhereInput
    data: XOR<RASessionUpdateManyMutationInput, RASessionUncheckedUpdateManyWithoutRASessionInput>
  }

  export type RASessionScalarWhereInput = {
    AND?: Enumerable<RASessionScalarWhereInput>
    OR?: Enumerable<RASessionScalarWhereInput>
    NOT?: Enumerable<RASessionScalarWhereInput>
    id?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    name?: StringFilter | string
    description?: StringFilter | string
    priority?: IntFilter | number
    sop?: StringNullableListFilter
    template?: JsonFilter
    projectId?: StringFilter | string
  }

  export type UsersInProjectsUpsertWithWhereUniqueWithoutProjectInput = {
    where: UsersInProjectsWhereUniqueInput
    update: XOR<UsersInProjectsUpdateWithoutProjectInput, UsersInProjectsUncheckedUpdateWithoutProjectInput>
    create: XOR<UsersInProjectsCreateWithoutProjectInput, UsersInProjectsUncheckedCreateWithoutProjectInput>
  }

  export type UsersInProjectsUpdateWithWhereUniqueWithoutProjectInput = {
    where: UsersInProjectsWhereUniqueInput
    data: XOR<UsersInProjectsUpdateWithoutProjectInput, UsersInProjectsUncheckedUpdateWithoutProjectInput>
  }

  export type UsersInProjectsUpdateManyWithWhereWithoutProjectInput = {
    where: UsersInProjectsScalarWhereInput
    data: XOR<UsersInProjectsUpdateManyMutationInput, UsersInProjectsUncheckedUpdateManyWithoutUsersInProjectsInput>
  }

  export type UsersInProjectsScalarWhereInput = {
    AND?: Enumerable<UsersInProjectsScalarWhereInput>
    OR?: Enumerable<UsersInProjectsScalarWhereInput>
    NOT?: Enumerable<UsersInProjectsScalarWhereInput>
    userId?: StringFilter | string
    projectId?: StringFilter | string
    userRole?: EnumProjectUserRoleFilter | ProjectUserRole
  }

  export type ProjectCreateWithoutRASessionInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    Epic: EpicCreateNestedOneWithoutProjectInput
    CESession?: CESessionCreateNestedManyWithoutProjectInput
    DLSession?: DLSessionCreateNestedManyWithoutProjectInput
    UsersInProjects?: UsersInProjectsCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutRASessionInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    epicId: string
    CESession?: CESessionUncheckedCreateNestedManyWithoutProjectInput
    DLSession?: DLSessionUncheckedCreateNestedManyWithoutProjectInput
    UsersInProjects?: UsersInProjectsUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutRASessionInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutRASessionInput, ProjectUncheckedCreateWithoutRASessionInput>
  }

  export type UsersInRASessionsCreateWithoutRASessionInput = {
    userId: string
    userRole: SessionUserRole
  }

  export type UsersInRASessionsUncheckedCreateWithoutRASessionInput = {
    userId: string
    userRole: SessionUserRole
  }

  export type UsersInRASessionsCreateOrConnectWithoutRASessionInput = {
    where: UsersInRASessionsWhereUniqueInput
    create: XOR<UsersInRASessionsCreateWithoutRASessionInput, UsersInRASessionsUncheckedCreateWithoutRASessionInput>
  }

  export type UsersInRASessionsCreateManyRASessionInputEnvelope = {
    data: Enumerable<UsersInRASessionsCreateManyRASessionInput>
    skipDuplicates?: boolean
  }

  export type VisitsInRASessionsCreateWithoutRASessionInput = {
    index: number
    content: JsonNullValueInput | InputJsonValue
    status?: ExtractedResourceStatus
    result: JsonNullValueInput | InputJsonValue
    Visit: VisitCreateNestedOneWithoutVisitsInRASessionsInput
  }

  export type VisitsInRASessionsUncheckedCreateWithoutRASessionInput = {
    visitId: string
    index: number
    content: JsonNullValueInput | InputJsonValue
    status?: ExtractedResourceStatus
    result: JsonNullValueInput | InputJsonValue
  }

  export type VisitsInRASessionsCreateOrConnectWithoutRASessionInput = {
    where: VisitsInRASessionsWhereUniqueInput
    create: XOR<VisitsInRASessionsCreateWithoutRASessionInput, VisitsInRASessionsUncheckedCreateWithoutRASessionInput>
  }

  export type VisitsInRASessionsCreateManyRASessionInputEnvelope = {
    data: Enumerable<VisitsInRASessionsCreateManyRASessionInput>
    skipDuplicates?: boolean
  }

  export type ProjectUpsertWithoutRASessionInput = {
    update: XOR<ProjectUpdateWithoutRASessionInput, ProjectUncheckedUpdateWithoutRASessionInput>
    create: XOR<ProjectCreateWithoutRASessionInput, ProjectUncheckedCreateWithoutRASessionInput>
  }

  export type ProjectUpdateWithoutRASessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    Epic?: EpicUpdateOneRequiredWithoutProjectNestedInput
    CESession?: CESessionUpdateManyWithoutProjectNestedInput
    DLSession?: DLSessionUpdateManyWithoutProjectNestedInput
    UsersInProjects?: UsersInProjectsUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutRASessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    epicId?: StringFieldUpdateOperationsInput | string
    CESession?: CESessionUncheckedUpdateManyWithoutProjectNestedInput
    DLSession?: DLSessionUncheckedUpdateManyWithoutProjectNestedInput
    UsersInProjects?: UsersInProjectsUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type UsersInRASessionsUpsertWithWhereUniqueWithoutRASessionInput = {
    where: UsersInRASessionsWhereUniqueInput
    update: XOR<UsersInRASessionsUpdateWithoutRASessionInput, UsersInRASessionsUncheckedUpdateWithoutRASessionInput>
    create: XOR<UsersInRASessionsCreateWithoutRASessionInput, UsersInRASessionsUncheckedCreateWithoutRASessionInput>
  }

  export type UsersInRASessionsUpdateWithWhereUniqueWithoutRASessionInput = {
    where: UsersInRASessionsWhereUniqueInput
    data: XOR<UsersInRASessionsUpdateWithoutRASessionInput, UsersInRASessionsUncheckedUpdateWithoutRASessionInput>
  }

  export type UsersInRASessionsUpdateManyWithWhereWithoutRASessionInput = {
    where: UsersInRASessionsScalarWhereInput
    data: XOR<UsersInRASessionsUpdateManyMutationInput, UsersInRASessionsUncheckedUpdateManyWithoutUsersInRASessionsInput>
  }

  export type UsersInRASessionsScalarWhereInput = {
    AND?: Enumerable<UsersInRASessionsScalarWhereInput>
    OR?: Enumerable<UsersInRASessionsScalarWhereInput>
    NOT?: Enumerable<UsersInRASessionsScalarWhereInput>
    userId?: StringFilter | string
    rASessionId?: StringFilter | string
    userRole?: EnumSessionUserRoleFilter | SessionUserRole
  }

  export type VisitsInRASessionsUpsertWithWhereUniqueWithoutRASessionInput = {
    where: VisitsInRASessionsWhereUniqueInput
    update: XOR<VisitsInRASessionsUpdateWithoutRASessionInput, VisitsInRASessionsUncheckedUpdateWithoutRASessionInput>
    create: XOR<VisitsInRASessionsCreateWithoutRASessionInput, VisitsInRASessionsUncheckedCreateWithoutRASessionInput>
  }

  export type VisitsInRASessionsUpdateWithWhereUniqueWithoutRASessionInput = {
    where: VisitsInRASessionsWhereUniqueInput
    data: XOR<VisitsInRASessionsUpdateWithoutRASessionInput, VisitsInRASessionsUncheckedUpdateWithoutRASessionInput>
  }

  export type VisitsInRASessionsUpdateManyWithWhereWithoutRASessionInput = {
    where: VisitsInRASessionsScalarWhereInput
    data: XOR<VisitsInRASessionsUpdateManyMutationInput, VisitsInRASessionsUncheckedUpdateManyWithoutVisitsInRASessionsInput>
  }

  export type VisitsInRASessionsScalarWhereInput = {
    AND?: Enumerable<VisitsInRASessionsScalarWhereInput>
    OR?: Enumerable<VisitsInRASessionsScalarWhereInput>
    NOT?: Enumerable<VisitsInRASessionsScalarWhereInput>
    visitId?: StringFilter | string
    rASessionId?: StringFilter | string
    index?: IntFilter | number
    content?: JsonFilter
    status?: EnumExtractedResourceStatusFilter | ExtractedResourceStatus
    result?: JsonFilter
  }

  export type VisitCreateWithoutRawResourceInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    Patient: PatientCreateNestedOneWithoutVisitInput
    VisitsInRASessions?: VisitsInRASessionsCreateNestedManyWithoutVisitInput
  }

  export type VisitUncheckedCreateWithoutRawResourceInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    patientId: string
    VisitsInRASessions?: VisitsInRASessionsUncheckedCreateNestedManyWithoutVisitInput
  }

  export type VisitCreateOrConnectWithoutRawResourceInput = {
    where: VisitWhereUniqueInput
    create: XOR<VisitCreateWithoutRawResourceInput, VisitUncheckedCreateWithoutRawResourceInput>
  }

  export type ExtractedResourceCreateWithoutRawResourceInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    metadata: JsonNullValueInput | InputJsonValue
    ExtractedResourcesInCESessions?: ExtractedResourcesInCESessionsCreateNestedManyWithoutExtractedResourceInput
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsCreateNestedManyWithoutExtractedResourceInput
  }

  export type ExtractedResourceUncheckedCreateWithoutRawResourceInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    metadata: JsonNullValueInput | InputJsonValue
    ExtractedResourcesInCESessions?: ExtractedResourcesInCESessionsUncheckedCreateNestedManyWithoutExtractedResourceInput
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsUncheckedCreateNestedManyWithoutExtractedResourceInput
  }

  export type ExtractedResourceCreateOrConnectWithoutRawResourceInput = {
    where: ExtractedResourceWhereUniqueInput
    create: XOR<ExtractedResourceCreateWithoutRawResourceInput, ExtractedResourceUncheckedCreateWithoutRawResourceInput>
  }

  export type ExtractedResourceCreateManyRawResourceInputEnvelope = {
    data: Enumerable<ExtractedResourceCreateManyRawResourceInput>
    skipDuplicates?: boolean
  }

  export type VisitUpsertWithoutRawResourceInput = {
    update: XOR<VisitUpdateWithoutRawResourceInput, VisitUncheckedUpdateWithoutRawResourceInput>
    create: XOR<VisitCreateWithoutRawResourceInput, VisitUncheckedCreateWithoutRawResourceInput>
  }

  export type VisitUpdateWithoutRawResourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Patient?: PatientUpdateOneRequiredWithoutVisitNestedInput
    VisitsInRASessions?: VisitsInRASessionsUpdateManyWithoutVisitNestedInput
  }

  export type VisitUncheckedUpdateWithoutRawResourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patientId?: StringFieldUpdateOperationsInput | string
    VisitsInRASessions?: VisitsInRASessionsUncheckedUpdateManyWithoutVisitNestedInput
  }

  export type ExtractedResourceUpsertWithWhereUniqueWithoutRawResourceInput = {
    where: ExtractedResourceWhereUniqueInput
    update: XOR<ExtractedResourceUpdateWithoutRawResourceInput, ExtractedResourceUncheckedUpdateWithoutRawResourceInput>
    create: XOR<ExtractedResourceCreateWithoutRawResourceInput, ExtractedResourceUncheckedCreateWithoutRawResourceInput>
  }

  export type ExtractedResourceUpdateWithWhereUniqueWithoutRawResourceInput = {
    where: ExtractedResourceWhereUniqueInput
    data: XOR<ExtractedResourceUpdateWithoutRawResourceInput, ExtractedResourceUncheckedUpdateWithoutRawResourceInput>
  }

  export type ExtractedResourceUpdateManyWithWhereWithoutRawResourceInput = {
    where: ExtractedResourceScalarWhereInput
    data: XOR<ExtractedResourceUpdateManyMutationInput, ExtractedResourceUncheckedUpdateManyWithoutExtractedResourceInput>
  }

  export type ExtractedResourceScalarWhereInput = {
    AND?: Enumerable<ExtractedResourceScalarWhereInput>
    OR?: Enumerable<ExtractedResourceScalarWhereInput>
    NOT?: Enumerable<ExtractedResourceScalarWhereInput>
    id?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    metadata?: JsonFilter
    rawResourceId?: StringFilter | string
  }

  export type CESessionCreateWithoutUsersInCESessionsInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: CESessionCreatesopInput | Enumerable<string>
    resultTemplate: JsonNullValueInput | InputJsonValue
    Project: ProjectCreateNestedOneWithoutCESessionInput
    ExtractedResourcesInCESessions?: ExtractedResourcesInCESessionsCreateNestedManyWithoutCESessionInput
  }

  export type CESessionUncheckedCreateWithoutUsersInCESessionsInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: CESessionCreatesopInput | Enumerable<string>
    resultTemplate: JsonNullValueInput | InputJsonValue
    projectId: string
    ExtractedResourcesInCESessions?: ExtractedResourcesInCESessionsUncheckedCreateNestedManyWithoutCESessionInput
  }

  export type CESessionCreateOrConnectWithoutUsersInCESessionsInput = {
    where: CESessionWhereUniqueInput
    create: XOR<CESessionCreateWithoutUsersInCESessionsInput, CESessionUncheckedCreateWithoutUsersInCESessionsInput>
  }

  export type CESessionUpsertWithoutUsersInCESessionsInput = {
    update: XOR<CESessionUpdateWithoutUsersInCESessionsInput, CESessionUncheckedUpdateWithoutUsersInCESessionsInput>
    create: XOR<CESessionCreateWithoutUsersInCESessionsInput, CESessionUncheckedCreateWithoutUsersInCESessionsInput>
  }

  export type CESessionUpdateWithoutUsersInCESessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: CESessionUpdatesopInput | Enumerable<string>
    resultTemplate?: JsonNullValueInput | InputJsonValue
    Project?: ProjectUpdateOneRequiredWithoutCESessionNestedInput
    ExtractedResourcesInCESessions?: ExtractedResourcesInCESessionsUpdateManyWithoutCESessionNestedInput
  }

  export type CESessionUncheckedUpdateWithoutUsersInCESessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: CESessionUpdatesopInput | Enumerable<string>
    resultTemplate?: JsonNullValueInput | InputJsonValue
    projectId?: StringFieldUpdateOperationsInput | string
    ExtractedResourcesInCESessions?: ExtractedResourcesInCESessionsUncheckedUpdateManyWithoutCESessionNestedInput
  }

  export type DLSessionCreateWithoutUsersInDLSessionsInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: DLSessionCreatesopInput | Enumerable<string>
    Project: ProjectCreateNestedOneWithoutDLSessionInput
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsCreateNestedManyWithoutDLSessionInput
    LabelsInDLSessions?: LabelsInDLSessionsCreateNestedManyWithoutDLSessionInput
  }

  export type DLSessionUncheckedCreateWithoutUsersInDLSessionsInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: DLSessionCreatesopInput | Enumerable<string>
    projectId: string
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsUncheckedCreateNestedManyWithoutDLSessionInput
    LabelsInDLSessions?: LabelsInDLSessionsUncheckedCreateNestedManyWithoutDLSessionInput
  }

  export type DLSessionCreateOrConnectWithoutUsersInDLSessionsInput = {
    where: DLSessionWhereUniqueInput
    create: XOR<DLSessionCreateWithoutUsersInDLSessionsInput, DLSessionUncheckedCreateWithoutUsersInDLSessionsInput>
  }

  export type DLSessionUpsertWithoutUsersInDLSessionsInput = {
    update: XOR<DLSessionUpdateWithoutUsersInDLSessionsInput, DLSessionUncheckedUpdateWithoutUsersInDLSessionsInput>
    create: XOR<DLSessionCreateWithoutUsersInDLSessionsInput, DLSessionUncheckedCreateWithoutUsersInDLSessionsInput>
  }

  export type DLSessionUpdateWithoutUsersInDLSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: DLSessionUpdatesopInput | Enumerable<string>
    Project?: ProjectUpdateOneRequiredWithoutDLSessionNestedInput
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsUpdateManyWithoutDLSessionNestedInput
    LabelsInDLSessions?: LabelsInDLSessionsUpdateManyWithoutDLSessionNestedInput
  }

  export type DLSessionUncheckedUpdateWithoutUsersInDLSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: DLSessionUpdatesopInput | Enumerable<string>
    projectId?: StringFieldUpdateOperationsInput | string
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsUncheckedUpdateManyWithoutDLSessionNestedInput
    LabelsInDLSessions?: LabelsInDLSessionsUncheckedUpdateManyWithoutDLSessionNestedInput
  }

  export type ProjectCreateWithoutUsersInProjectsInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    Epic: EpicCreateNestedOneWithoutProjectInput
    CESession?: CESessionCreateNestedManyWithoutProjectInput
    DLSession?: DLSessionCreateNestedManyWithoutProjectInput
    RASession?: RASessionCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutUsersInProjectsInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    epicId: string
    CESession?: CESessionUncheckedCreateNestedManyWithoutProjectInput
    DLSession?: DLSessionUncheckedCreateNestedManyWithoutProjectInput
    RASession?: RASessionUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutUsersInProjectsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutUsersInProjectsInput, ProjectUncheckedCreateWithoutUsersInProjectsInput>
  }

  export type ProjectUpsertWithoutUsersInProjectsInput = {
    update: XOR<ProjectUpdateWithoutUsersInProjectsInput, ProjectUncheckedUpdateWithoutUsersInProjectsInput>
    create: XOR<ProjectCreateWithoutUsersInProjectsInput, ProjectUncheckedCreateWithoutUsersInProjectsInput>
  }

  export type ProjectUpdateWithoutUsersInProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    Epic?: EpicUpdateOneRequiredWithoutProjectNestedInput
    CESession?: CESessionUpdateManyWithoutProjectNestedInput
    DLSession?: DLSessionUpdateManyWithoutProjectNestedInput
    RASession?: RASessionUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutUsersInProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    epicId?: StringFieldUpdateOperationsInput | string
    CESession?: CESessionUncheckedUpdateManyWithoutProjectNestedInput
    DLSession?: DLSessionUncheckedUpdateManyWithoutProjectNestedInput
    RASession?: RASessionUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type RASessionCreateWithoutUsersInRASessionsInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: RASessionCreatesopInput | Enumerable<string>
    template: JsonNullValueInput | InputJsonValue
    Project: ProjectCreateNestedOneWithoutRASessionInput
    VisitsInRASessions?: VisitsInRASessionsCreateNestedManyWithoutRASessionInput
  }

  export type RASessionUncheckedCreateWithoutUsersInRASessionsInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: RASessionCreatesopInput | Enumerable<string>
    template: JsonNullValueInput | InputJsonValue
    projectId: string
    VisitsInRASessions?: VisitsInRASessionsUncheckedCreateNestedManyWithoutRASessionInput
  }

  export type RASessionCreateOrConnectWithoutUsersInRASessionsInput = {
    where: RASessionWhereUniqueInput
    create: XOR<RASessionCreateWithoutUsersInRASessionsInput, RASessionUncheckedCreateWithoutUsersInRASessionsInput>
  }

  export type RASessionUpsertWithoutUsersInRASessionsInput = {
    update: XOR<RASessionUpdateWithoutUsersInRASessionsInput, RASessionUncheckedUpdateWithoutUsersInRASessionsInput>
    create: XOR<RASessionCreateWithoutUsersInRASessionsInput, RASessionUncheckedCreateWithoutUsersInRASessionsInput>
  }

  export type RASessionUpdateWithoutUsersInRASessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: RASessionUpdatesopInput | Enumerable<string>
    template?: JsonNullValueInput | InputJsonValue
    Project?: ProjectUpdateOneRequiredWithoutRASessionNestedInput
    VisitsInRASessions?: VisitsInRASessionsUpdateManyWithoutRASessionNestedInput
  }

  export type RASessionUncheckedUpdateWithoutUsersInRASessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: RASessionUpdatesopInput | Enumerable<string>
    template?: JsonNullValueInput | InputJsonValue
    projectId?: StringFieldUpdateOperationsInput | string
    VisitsInRASessions?: VisitsInRASessionsUncheckedUpdateManyWithoutRASessionNestedInput
  }

  export type PatientCreateWithoutVisitInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type PatientUncheckedCreateWithoutVisitInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type PatientCreateOrConnectWithoutVisitInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutVisitInput, PatientUncheckedCreateWithoutVisitInput>
  }

  export type RawResourceCreateWithoutVisitInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    metadata: JsonNullValueInput | InputJsonValue
    machine: string
    center: string
    ExtractedResource?: ExtractedResourceCreateNestedManyWithoutRawResourceInput
  }

  export type RawResourceUncheckedCreateWithoutVisitInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    metadata: JsonNullValueInput | InputJsonValue
    machine: string
    center: string
    ExtractedResource?: ExtractedResourceUncheckedCreateNestedManyWithoutRawResourceInput
  }

  export type RawResourceCreateOrConnectWithoutVisitInput = {
    where: RawResourceWhereUniqueInput
    create: XOR<RawResourceCreateWithoutVisitInput, RawResourceUncheckedCreateWithoutVisitInput>
  }

  export type RawResourceCreateManyVisitInputEnvelope = {
    data: Enumerable<RawResourceCreateManyVisitInput>
    skipDuplicates?: boolean
  }

  export type VisitsInRASessionsCreateWithoutVisitInput = {
    index: number
    content: JsonNullValueInput | InputJsonValue
    status?: ExtractedResourceStatus
    result: JsonNullValueInput | InputJsonValue
    RASession: RASessionCreateNestedOneWithoutVisitsInRASessionsInput
  }

  export type VisitsInRASessionsUncheckedCreateWithoutVisitInput = {
    rASessionId: string
    index: number
    content: JsonNullValueInput | InputJsonValue
    status?: ExtractedResourceStatus
    result: JsonNullValueInput | InputJsonValue
  }

  export type VisitsInRASessionsCreateOrConnectWithoutVisitInput = {
    where: VisitsInRASessionsWhereUniqueInput
    create: XOR<VisitsInRASessionsCreateWithoutVisitInput, VisitsInRASessionsUncheckedCreateWithoutVisitInput>
  }

  export type VisitsInRASessionsCreateManyVisitInputEnvelope = {
    data: Enumerable<VisitsInRASessionsCreateManyVisitInput>
    skipDuplicates?: boolean
  }

  export type PatientUpsertWithoutVisitInput = {
    update: XOR<PatientUpdateWithoutVisitInput, PatientUncheckedUpdateWithoutVisitInput>
    create: XOR<PatientCreateWithoutVisitInput, PatientUncheckedCreateWithoutVisitInput>
  }

  export type PatientUpdateWithoutVisitInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientUncheckedUpdateWithoutVisitInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RawResourceUpsertWithWhereUniqueWithoutVisitInput = {
    where: RawResourceWhereUniqueInput
    update: XOR<RawResourceUpdateWithoutVisitInput, RawResourceUncheckedUpdateWithoutVisitInput>
    create: XOR<RawResourceCreateWithoutVisitInput, RawResourceUncheckedCreateWithoutVisitInput>
  }

  export type RawResourceUpdateWithWhereUniqueWithoutVisitInput = {
    where: RawResourceWhereUniqueInput
    data: XOR<RawResourceUpdateWithoutVisitInput, RawResourceUncheckedUpdateWithoutVisitInput>
  }

  export type RawResourceUpdateManyWithWhereWithoutVisitInput = {
    where: RawResourceScalarWhereInput
    data: XOR<RawResourceUpdateManyMutationInput, RawResourceUncheckedUpdateManyWithoutRawResourceInput>
  }

  export type RawResourceScalarWhereInput = {
    AND?: Enumerable<RawResourceScalarWhereInput>
    OR?: Enumerable<RawResourceScalarWhereInput>
    NOT?: Enumerable<RawResourceScalarWhereInput>
    id?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    metadata?: JsonFilter
    machine?: StringFilter | string
    center?: StringFilter | string
    visitId?: StringFilter | string
  }

  export type VisitsInRASessionsUpsertWithWhereUniqueWithoutVisitInput = {
    where: VisitsInRASessionsWhereUniqueInput
    update: XOR<VisitsInRASessionsUpdateWithoutVisitInput, VisitsInRASessionsUncheckedUpdateWithoutVisitInput>
    create: XOR<VisitsInRASessionsCreateWithoutVisitInput, VisitsInRASessionsUncheckedCreateWithoutVisitInput>
  }

  export type VisitsInRASessionsUpdateWithWhereUniqueWithoutVisitInput = {
    where: VisitsInRASessionsWhereUniqueInput
    data: XOR<VisitsInRASessionsUpdateWithoutVisitInput, VisitsInRASessionsUncheckedUpdateWithoutVisitInput>
  }

  export type VisitsInRASessionsUpdateManyWithWhereWithoutVisitInput = {
    where: VisitsInRASessionsScalarWhereInput
    data: XOR<VisitsInRASessionsUpdateManyMutationInput, VisitsInRASessionsUncheckedUpdateManyWithoutVisitsInRASessionsInput>
  }

  export type RASessionCreateWithoutVisitsInRASessionsInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: RASessionCreatesopInput | Enumerable<string>
    template: JsonNullValueInput | InputJsonValue
    Project: ProjectCreateNestedOneWithoutRASessionInput
    UsersInRASessions?: UsersInRASessionsCreateNestedManyWithoutRASessionInput
  }

  export type RASessionUncheckedCreateWithoutVisitsInRASessionsInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: RASessionCreatesopInput | Enumerable<string>
    template: JsonNullValueInput | InputJsonValue
    projectId: string
    UsersInRASessions?: UsersInRASessionsUncheckedCreateNestedManyWithoutRASessionInput
  }

  export type RASessionCreateOrConnectWithoutVisitsInRASessionsInput = {
    where: RASessionWhereUniqueInput
    create: XOR<RASessionCreateWithoutVisitsInRASessionsInput, RASessionUncheckedCreateWithoutVisitsInRASessionsInput>
  }

  export type VisitCreateWithoutVisitsInRASessionsInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    Patient: PatientCreateNestedOneWithoutVisitInput
    RawResource?: RawResourceCreateNestedManyWithoutVisitInput
  }

  export type VisitUncheckedCreateWithoutVisitsInRASessionsInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    patientId: string
    RawResource?: RawResourceUncheckedCreateNestedManyWithoutVisitInput
  }

  export type VisitCreateOrConnectWithoutVisitsInRASessionsInput = {
    where: VisitWhereUniqueInput
    create: XOR<VisitCreateWithoutVisitsInRASessionsInput, VisitUncheckedCreateWithoutVisitsInRASessionsInput>
  }

  export type RASessionUpsertWithoutVisitsInRASessionsInput = {
    update: XOR<RASessionUpdateWithoutVisitsInRASessionsInput, RASessionUncheckedUpdateWithoutVisitsInRASessionsInput>
    create: XOR<RASessionCreateWithoutVisitsInRASessionsInput, RASessionUncheckedCreateWithoutVisitsInRASessionsInput>
  }

  export type RASessionUpdateWithoutVisitsInRASessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: RASessionUpdatesopInput | Enumerable<string>
    template?: JsonNullValueInput | InputJsonValue
    Project?: ProjectUpdateOneRequiredWithoutRASessionNestedInput
    UsersInRASessions?: UsersInRASessionsUpdateManyWithoutRASessionNestedInput
  }

  export type RASessionUncheckedUpdateWithoutVisitsInRASessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: RASessionUpdatesopInput | Enumerable<string>
    template?: JsonNullValueInput | InputJsonValue
    projectId?: StringFieldUpdateOperationsInput | string
    UsersInRASessions?: UsersInRASessionsUncheckedUpdateManyWithoutRASessionNestedInput
  }

  export type VisitUpsertWithoutVisitsInRASessionsInput = {
    update: XOR<VisitUpdateWithoutVisitsInRASessionsInput, VisitUncheckedUpdateWithoutVisitsInRASessionsInput>
    create: XOR<VisitCreateWithoutVisitsInRASessionsInput, VisitUncheckedCreateWithoutVisitsInRASessionsInput>
  }

  export type VisitUpdateWithoutVisitsInRASessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Patient?: PatientUpdateOneRequiredWithoutVisitNestedInput
    RawResource?: RawResourceUpdateManyWithoutVisitNestedInput
  }

  export type VisitUncheckedUpdateWithoutVisitsInRASessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patientId?: StringFieldUpdateOperationsInput | string
    RawResource?: RawResourceUncheckedUpdateManyWithoutVisitNestedInput
  }

  export type ExtractedResourcesInCESessionsCreateManyCESessionInput = {
    extractedResourceId: string
    index: number
    status?: ExtractedResourceStatus
    result: JsonNullValueInput | InputJsonValue
  }

  export type UsersInCESessionsCreateManyCESessionInput = {
    userId: string
    userRole: SessionUserRole
  }

  export type ExtractedResourcesInCESessionsUpdateWithoutCESessionInput = {
    index?: IntFieldUpdateOperationsInput | number
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
    result?: JsonNullValueInput | InputJsonValue
    ExtractedResource?: ExtractedResourceUpdateOneRequiredWithoutExtractedResourcesInCESessionsNestedInput
  }

  export type ExtractedResourcesInCESessionsUncheckedUpdateWithoutCESessionInput = {
    extractedResourceId?: StringFieldUpdateOperationsInput | string
    index?: IntFieldUpdateOperationsInput | number
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
    result?: JsonNullValueInput | InputJsonValue
  }

  export type ExtractedResourcesInCESessionsUncheckedUpdateManyWithoutExtractedResourcesInCESessionsInput = {
    extractedResourceId?: StringFieldUpdateOperationsInput | string
    index?: IntFieldUpdateOperationsInput | number
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
    result?: JsonNullValueInput | InputJsonValue
  }

  export type UsersInCESessionsUpdateWithoutCESessionInput = {
    userId?: StringFieldUpdateOperationsInput | string
    userRole?: EnumSessionUserRoleFieldUpdateOperationsInput | SessionUserRole
  }

  export type UsersInCESessionsUncheckedUpdateWithoutCESessionInput = {
    userId?: StringFieldUpdateOperationsInput | string
    userRole?: EnumSessionUserRoleFieldUpdateOperationsInput | SessionUserRole
  }

  export type UsersInCESessionsUncheckedUpdateManyWithoutUsersInCESessionsInput = {
    userId?: StringFieldUpdateOperationsInput | string
    userRole?: EnumSessionUserRoleFieldUpdateOperationsInput | SessionUserRole
  }

  export type ExtractedResourcesInDLSessionsCreateManyDLSessionInput = {
    extractedResourceId: string
    status?: ExtractedResourceStatus
  }

  export type LabelsInDLSessionsCreateManyDLSessionInput = {
    labelId: string
  }

  export type UsersInDLSessionsCreateManyDLSessionInput = {
    userId: string
    userRole: SessionUserRole
  }

  export type ExtractedResourcesInDLSessionsUpdateWithoutDLSessionInput = {
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
    ExtractedResource?: ExtractedResourceUpdateOneRequiredWithoutExtractedResourcesInDLSessionsNestedInput
    LabelsInExtractedResourcesInDLSessions?: LabelsInExtractedResourcesInDLSessionsUpdateManyWithoutExtractedResourcesInDLSessionsNestedInput
  }

  export type ExtractedResourcesInDLSessionsUncheckedUpdateWithoutDLSessionInput = {
    extractedResourceId?: StringFieldUpdateOperationsInput | string
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
    LabelsInExtractedResourcesInDLSessions?: LabelsInExtractedResourcesInDLSessionsUncheckedUpdateManyWithoutExtractedResourcesInDLSessionsNestedInput
  }

  export type ExtractedResourcesInDLSessionsUncheckedUpdateManyWithoutExtractedResourcesInDLSessionsInput = {
    extractedResourceId?: StringFieldUpdateOperationsInput | string
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
  }

  export type LabelsInDLSessionsUpdateWithoutDLSessionInput = {
    Label?: LabelUpdateOneRequiredWithoutLabelsInDLSessionsNestedInput
  }

  export type LabelsInDLSessionsUncheckedUpdateWithoutDLSessionInput = {
    labelId?: StringFieldUpdateOperationsInput | string
  }

  export type LabelsInDLSessionsUncheckedUpdateManyWithoutLabelsInDLSessionsInput = {
    labelId?: StringFieldUpdateOperationsInput | string
  }

  export type UsersInDLSessionsUpdateWithoutDLSessionInput = {
    userId?: StringFieldUpdateOperationsInput | string
    userRole?: EnumSessionUserRoleFieldUpdateOperationsInput | SessionUserRole
  }

  export type UsersInDLSessionsUncheckedUpdateWithoutDLSessionInput = {
    userId?: StringFieldUpdateOperationsInput | string
    userRole?: EnumSessionUserRoleFieldUpdateOperationsInput | SessionUserRole
  }

  export type UsersInDLSessionsUncheckedUpdateManyWithoutUsersInDLSessionsInput = {
    userId?: StringFieldUpdateOperationsInput | string
    userRole?: EnumSessionUserRoleFieldUpdateOperationsInput | SessionUserRole
  }

  export type ProjectCreateManyEpicInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
  }

  export type ProjectUpdateWithoutEpicInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    CESession?: CESessionUpdateManyWithoutProjectNestedInput
    DLSession?: DLSessionUpdateManyWithoutProjectNestedInput
    RASession?: RASessionUpdateManyWithoutProjectNestedInput
    UsersInProjects?: UsersInProjectsUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutEpicInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    CESession?: CESessionUncheckedUpdateManyWithoutProjectNestedInput
    DLSession?: DLSessionUncheckedUpdateManyWithoutProjectNestedInput
    RASession?: RASessionUncheckedUpdateManyWithoutProjectNestedInput
    UsersInProjects?: UsersInProjectsUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
  }

  export type ExtractedResourcesInCESessionsCreateManyExtractedResourceInput = {
    cESessionId: string
    index: number
    status?: ExtractedResourceStatus
    result: JsonNullValueInput | InputJsonValue
  }

  export type ExtractedResourcesInDLSessionsCreateManyExtractedResourceInput = {
    dLSessionId: string
    status?: ExtractedResourceStatus
  }

  export type ExtractedResourcesInCESessionsUpdateWithoutExtractedResourceInput = {
    index?: IntFieldUpdateOperationsInput | number
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
    result?: JsonNullValueInput | InputJsonValue
    CESession?: CESessionUpdateOneRequiredWithoutExtractedResourcesInCESessionsNestedInput
  }

  export type ExtractedResourcesInCESessionsUncheckedUpdateWithoutExtractedResourceInput = {
    cESessionId?: StringFieldUpdateOperationsInput | string
    index?: IntFieldUpdateOperationsInput | number
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
    result?: JsonNullValueInput | InputJsonValue
  }

  export type ExtractedResourcesInDLSessionsUpdateWithoutExtractedResourceInput = {
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
    DLSession?: DLSessionUpdateOneRequiredWithoutExtractedResourcesInDLSessionsNestedInput
    LabelsInExtractedResourcesInDLSessions?: LabelsInExtractedResourcesInDLSessionsUpdateManyWithoutExtractedResourcesInDLSessionsNestedInput
  }

  export type ExtractedResourcesInDLSessionsUncheckedUpdateWithoutExtractedResourceInput = {
    dLSessionId?: StringFieldUpdateOperationsInput | string
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
    LabelsInExtractedResourcesInDLSessions?: LabelsInExtractedResourcesInDLSessionsUncheckedUpdateManyWithoutExtractedResourcesInDLSessionsNestedInput
  }

  export type LabelsInExtractedResourcesInDLSessionsCreateManyExtractedResourcesInDLSessionsInput = {
    labelId: string
  }

  export type LabelsInExtractedResourcesInDLSessionsUpdateWithoutExtractedResourcesInDLSessionsInput = {
    Label?: LabelUpdateOneRequiredWithoutLabelsInExtractedResourcesInDLSessionsNestedInput
  }

  export type LabelsInExtractedResourcesInDLSessionsUncheckedUpdateWithoutExtractedResourcesInDLSessionsInput = {
    labelId?: StringFieldUpdateOperationsInput | string
  }

  export type LabelsInExtractedResourcesInDLSessionsUncheckedUpdateManyWithoutLabelsInExtractedResourcesInDLSessionsInput = {
    labelId?: StringFieldUpdateOperationsInput | string
  }

  export type LabelsInDLSessionsCreateManyLabelInput = {
    dLSessionId: string
  }

  export type LabelsInExtractedResourcesInDLSessionsCreateManyLabelInput = {
    extractedResourceId: string
    dLSessionId: string
  }

  export type LabelsInDLSessionsUpdateWithoutLabelInput = {
    DLSession?: DLSessionUpdateOneRequiredWithoutLabelsInDLSessionsNestedInput
  }

  export type LabelsInDLSessionsUncheckedUpdateWithoutLabelInput = {
    dLSessionId?: StringFieldUpdateOperationsInput | string
  }

  export type LabelsInExtractedResourcesInDLSessionsUpdateWithoutLabelInput = {
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsUpdateOneRequiredWithoutLabelsInExtractedResourcesInDLSessionsNestedInput
  }

  export type LabelsInExtractedResourcesInDLSessionsUncheckedUpdateWithoutLabelInput = {
    extractedResourceId?: StringFieldUpdateOperationsInput | string
    dLSessionId?: StringFieldUpdateOperationsInput | string
  }

  export type VisitCreateManyPatientInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type VisitUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    RawResource?: RawResourceUpdateManyWithoutVisitNestedInput
    VisitsInRASessions?: VisitsInRASessionsUpdateManyWithoutVisitNestedInput
  }

  export type VisitUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    RawResource?: RawResourceUncheckedUpdateManyWithoutVisitNestedInput
    VisitsInRASessions?: VisitsInRASessionsUncheckedUpdateManyWithoutVisitNestedInput
  }

  export type VisitUncheckedUpdateManyWithoutVisitInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CESessionCreateManyProjectInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: CESessionCreatesopInput | Enumerable<string>
    resultTemplate: JsonNullValueInput | InputJsonValue
  }

  export type DLSessionCreateManyProjectInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: DLSessionCreatesopInput | Enumerable<string>
  }

  export type RASessionCreateManyProjectInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    name: string
    description: string
    priority: number
    sop?: RASessionCreatesopInput | Enumerable<string>
    template: JsonNullValueInput | InputJsonValue
  }

  export type UsersInProjectsCreateManyProjectInput = {
    userId: string
    userRole: ProjectUserRole
  }

  export type CESessionUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: CESessionUpdatesopInput | Enumerable<string>
    resultTemplate?: JsonNullValueInput | InputJsonValue
    ExtractedResourcesInCESessions?: ExtractedResourcesInCESessionsUpdateManyWithoutCESessionNestedInput
    UsersInCESessions?: UsersInCESessionsUpdateManyWithoutCESessionNestedInput
  }

  export type CESessionUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: CESessionUpdatesopInput | Enumerable<string>
    resultTemplate?: JsonNullValueInput | InputJsonValue
    ExtractedResourcesInCESessions?: ExtractedResourcesInCESessionsUncheckedUpdateManyWithoutCESessionNestedInput
    UsersInCESessions?: UsersInCESessionsUncheckedUpdateManyWithoutCESessionNestedInput
  }

  export type CESessionUncheckedUpdateManyWithoutCESessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: CESessionUpdatesopInput | Enumerable<string>
    resultTemplate?: JsonNullValueInput | InputJsonValue
  }

  export type DLSessionUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: DLSessionUpdatesopInput | Enumerable<string>
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsUpdateManyWithoutDLSessionNestedInput
    LabelsInDLSessions?: LabelsInDLSessionsUpdateManyWithoutDLSessionNestedInput
    UsersInDLSessions?: UsersInDLSessionsUpdateManyWithoutDLSessionNestedInput
  }

  export type DLSessionUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: DLSessionUpdatesopInput | Enumerable<string>
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsUncheckedUpdateManyWithoutDLSessionNestedInput
    LabelsInDLSessions?: LabelsInDLSessionsUncheckedUpdateManyWithoutDLSessionNestedInput
    UsersInDLSessions?: UsersInDLSessionsUncheckedUpdateManyWithoutDLSessionNestedInput
  }

  export type DLSessionUncheckedUpdateManyWithoutDLSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: DLSessionUpdatesopInput | Enumerable<string>
  }

  export type RASessionUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: RASessionUpdatesopInput | Enumerable<string>
    template?: JsonNullValueInput | InputJsonValue
    UsersInRASessions?: UsersInRASessionsUpdateManyWithoutRASessionNestedInput
    VisitsInRASessions?: VisitsInRASessionsUpdateManyWithoutRASessionNestedInput
  }

  export type RASessionUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: RASessionUpdatesopInput | Enumerable<string>
    template?: JsonNullValueInput | InputJsonValue
    UsersInRASessions?: UsersInRASessionsUncheckedUpdateManyWithoutRASessionNestedInput
    VisitsInRASessions?: VisitsInRASessionsUncheckedUpdateManyWithoutRASessionNestedInput
  }

  export type RASessionUncheckedUpdateManyWithoutRASessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    sop?: RASessionUpdatesopInput | Enumerable<string>
    template?: JsonNullValueInput | InputJsonValue
  }

  export type UsersInProjectsUpdateWithoutProjectInput = {
    userId?: StringFieldUpdateOperationsInput | string
    userRole?: EnumProjectUserRoleFieldUpdateOperationsInput | ProjectUserRole
  }

  export type UsersInProjectsUncheckedUpdateWithoutProjectInput = {
    userId?: StringFieldUpdateOperationsInput | string
    userRole?: EnumProjectUserRoleFieldUpdateOperationsInput | ProjectUserRole
  }

  export type UsersInProjectsUncheckedUpdateManyWithoutUsersInProjectsInput = {
    userId?: StringFieldUpdateOperationsInput | string
    userRole?: EnumProjectUserRoleFieldUpdateOperationsInput | ProjectUserRole
  }

  export type UsersInRASessionsCreateManyRASessionInput = {
    userId: string
    userRole: SessionUserRole
  }

  export type VisitsInRASessionsCreateManyRASessionInput = {
    visitId: string
    index: number
    content: JsonNullValueInput | InputJsonValue
    status?: ExtractedResourceStatus
    result: JsonNullValueInput | InputJsonValue
  }

  export type UsersInRASessionsUpdateWithoutRASessionInput = {
    userId?: StringFieldUpdateOperationsInput | string
    userRole?: EnumSessionUserRoleFieldUpdateOperationsInput | SessionUserRole
  }

  export type UsersInRASessionsUncheckedUpdateWithoutRASessionInput = {
    userId?: StringFieldUpdateOperationsInput | string
    userRole?: EnumSessionUserRoleFieldUpdateOperationsInput | SessionUserRole
  }

  export type UsersInRASessionsUncheckedUpdateManyWithoutUsersInRASessionsInput = {
    userId?: StringFieldUpdateOperationsInput | string
    userRole?: EnumSessionUserRoleFieldUpdateOperationsInput | SessionUserRole
  }

  export type VisitsInRASessionsUpdateWithoutRASessionInput = {
    index?: IntFieldUpdateOperationsInput | number
    content?: JsonNullValueInput | InputJsonValue
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
    result?: JsonNullValueInput | InputJsonValue
    Visit?: VisitUpdateOneRequiredWithoutVisitsInRASessionsNestedInput
  }

  export type VisitsInRASessionsUncheckedUpdateWithoutRASessionInput = {
    visitId?: StringFieldUpdateOperationsInput | string
    index?: IntFieldUpdateOperationsInput | number
    content?: JsonNullValueInput | InputJsonValue
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
    result?: JsonNullValueInput | InputJsonValue
  }

  export type VisitsInRASessionsUncheckedUpdateManyWithoutVisitsInRASessionsInput = {
    visitId?: StringFieldUpdateOperationsInput | string
    index?: IntFieldUpdateOperationsInput | number
    content?: JsonNullValueInput | InputJsonValue
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
    result?: JsonNullValueInput | InputJsonValue
  }

  export type ExtractedResourceCreateManyRawResourceInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    metadata: JsonNullValueInput | InputJsonValue
  }

  export type ExtractedResourceUpdateWithoutRawResourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: JsonNullValueInput | InputJsonValue
    ExtractedResourcesInCESessions?: ExtractedResourcesInCESessionsUpdateManyWithoutExtractedResourceNestedInput
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsUpdateManyWithoutExtractedResourceNestedInput
  }

  export type ExtractedResourceUncheckedUpdateWithoutRawResourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: JsonNullValueInput | InputJsonValue
    ExtractedResourcesInCESessions?: ExtractedResourcesInCESessionsUncheckedUpdateManyWithoutExtractedResourceNestedInput
    ExtractedResourcesInDLSessions?: ExtractedResourcesInDLSessionsUncheckedUpdateManyWithoutExtractedResourceNestedInput
  }

  export type ExtractedResourceUncheckedUpdateManyWithoutExtractedResourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: JsonNullValueInput | InputJsonValue
  }

  export type RawResourceCreateManyVisitInput = {
    id: string
    createdAt?: Date | string
    updatedAt: Date | string
    metadata: JsonNullValueInput | InputJsonValue
    machine: string
    center: string
  }

  export type VisitsInRASessionsCreateManyVisitInput = {
    rASessionId: string
    index: number
    content: JsonNullValueInput | InputJsonValue
    status?: ExtractedResourceStatus
    result: JsonNullValueInput | InputJsonValue
  }

  export type RawResourceUpdateWithoutVisitInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: JsonNullValueInput | InputJsonValue
    machine?: StringFieldUpdateOperationsInput | string
    center?: StringFieldUpdateOperationsInput | string
    ExtractedResource?: ExtractedResourceUpdateManyWithoutRawResourceNestedInput
  }

  export type RawResourceUncheckedUpdateWithoutVisitInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: JsonNullValueInput | InputJsonValue
    machine?: StringFieldUpdateOperationsInput | string
    center?: StringFieldUpdateOperationsInput | string
    ExtractedResource?: ExtractedResourceUncheckedUpdateManyWithoutRawResourceNestedInput
  }

  export type RawResourceUncheckedUpdateManyWithoutRawResourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: JsonNullValueInput | InputJsonValue
    machine?: StringFieldUpdateOperationsInput | string
    center?: StringFieldUpdateOperationsInput | string
  }

  export type VisitsInRASessionsUpdateWithoutVisitInput = {
    index?: IntFieldUpdateOperationsInput | number
    content?: JsonNullValueInput | InputJsonValue
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
    result?: JsonNullValueInput | InputJsonValue
    RASession?: RASessionUpdateOneRequiredWithoutVisitsInRASessionsNestedInput
  }

  export type VisitsInRASessionsUncheckedUpdateWithoutVisitInput = {
    rASessionId?: StringFieldUpdateOperationsInput | string
    index?: IntFieldUpdateOperationsInput | number
    content?: JsonNullValueInput | InputJsonValue
    status?: EnumExtractedResourceStatusFieldUpdateOperationsInput | ExtractedResourceStatus
    result?: JsonNullValueInput | InputJsonValue
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}