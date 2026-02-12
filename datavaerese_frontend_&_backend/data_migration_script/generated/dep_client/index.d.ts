
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
 * Model alembic_version
 * 
 */
export type alembic_version = {
  version_num: string
}

/**
 * Model extracted_resource_labels
 * 
 */
export type extracted_resource_labels = {
  extracted_resource_id: string
  label_id: string
}

/**
 * Model extracted_resources
 * 
 */
export type extracted_resources = {
  id: string
  created_at: Date | null
  updated_at: Date | null
  resource_path: string
  filetype: resourcetype
  feature: Prisma.JsonValue | null
  raw_resource_id: string
  patient_id: string
  session_id: string | null
}

/**
 * Model labels
 * 
 */
export type labels = {
  id: string
  created_at: Date | null
  updated_at: Date | null
  name: string
  abbreviation: string
}

/**
 * Model session_labels
 * 
 */
export type session_labels = {
  session_id: string
  label_id: string
}

/**
 * Model sessions
 * 
 */
export type sessions = {
  id: string
  created_at: Date | null
  updated_at: Date | null
  name: string
  description: string | null
  user_id: string
}


/**
 * Enums
 */

// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

export const resourcetype: {
  DICOM: 'DICOM',
  PDF: 'PDF',
  ZIP: 'ZIP',
  IMAGE: 'IMAGE'
};

export type resourcetype = (typeof resourcetype)[keyof typeof resourcetype]


/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Alembic_versions
 * const alembic_versions = await prisma.alembic_version.findMany()
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
   * // Fetch zero or more Alembic_versions
   * const alembic_versions = await prisma.alembic_version.findMany()
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
   * `prisma.alembic_version`: Exposes CRUD operations for the **alembic_version** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Alembic_versions
    * const alembic_versions = await prisma.alembic_version.findMany()
    * ```
    */
  get alembic_version(): Prisma.alembic_versionDelegate<GlobalReject>;

  /**
   * `prisma.extracted_resource_labels`: Exposes CRUD operations for the **extracted_resource_labels** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Extracted_resource_labels
    * const extracted_resource_labels = await prisma.extracted_resource_labels.findMany()
    * ```
    */
  get extracted_resource_labels(): Prisma.extracted_resource_labelsDelegate<GlobalReject>;

  /**
   * `prisma.extracted_resources`: Exposes CRUD operations for the **extracted_resources** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Extracted_resources
    * const extracted_resources = await prisma.extracted_resources.findMany()
    * ```
    */
  get extracted_resources(): Prisma.extracted_resourcesDelegate<GlobalReject>;

  /**
   * `prisma.labels`: Exposes CRUD operations for the **labels** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Labels
    * const labels = await prisma.labels.findMany()
    * ```
    */
  get labels(): Prisma.labelsDelegate<GlobalReject>;

  /**
   * `prisma.session_labels`: Exposes CRUD operations for the **session_labels** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Session_labels
    * const session_labels = await prisma.session_labels.findMany()
    * ```
    */
  get session_labels(): Prisma.session_labelsDelegate<GlobalReject>;

  /**
   * `prisma.sessions`: Exposes CRUD operations for the **sessions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.sessions.findMany()
    * ```
    */
  get sessions(): Prisma.sessionsDelegate<GlobalReject>;
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
    alembic_version: 'alembic_version',
    extracted_resource_labels: 'extracted_resource_labels',
    extracted_resources: 'extracted_resources',
    labels: 'labels',
    session_labels: 'session_labels',
    sessions: 'sessions'
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
   * Count Type Extracted_resourcesCountOutputType
   */


  export type Extracted_resourcesCountOutputType = {
    extracted_resource_labels: number
  }

  export type Extracted_resourcesCountOutputTypeSelect = {
    extracted_resource_labels?: boolean
  }

  export type Extracted_resourcesCountOutputTypeGetPayload<
    S extends boolean | null | undefined | Extracted_resourcesCountOutputTypeArgs,
    U = keyof S
      > = S extends true
        ? Extracted_resourcesCountOutputType
    : S extends undefined
    ? never
    : S extends Extracted_resourcesCountOutputTypeArgs
    ?'include' extends U
    ? Extracted_resourcesCountOutputType 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof Extracted_resourcesCountOutputType ? Extracted_resourcesCountOutputType[P] : never
  } 
    : Extracted_resourcesCountOutputType
  : Extracted_resourcesCountOutputType




  // Custom InputTypes

  /**
   * Extracted_resourcesCountOutputType without action
   */
  export type Extracted_resourcesCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the Extracted_resourcesCountOutputType
     * 
    **/
    select?: Extracted_resourcesCountOutputTypeSelect | null
  }



  /**
   * Count Type LabelsCountOutputType
   */


  export type LabelsCountOutputType = {
    extracted_resource_labels: number
    session_labels: number
  }

  export type LabelsCountOutputTypeSelect = {
    extracted_resource_labels?: boolean
    session_labels?: boolean
  }

  export type LabelsCountOutputTypeGetPayload<
    S extends boolean | null | undefined | LabelsCountOutputTypeArgs,
    U = keyof S
      > = S extends true
        ? LabelsCountOutputType
    : S extends undefined
    ? never
    : S extends LabelsCountOutputTypeArgs
    ?'include' extends U
    ? LabelsCountOutputType 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof LabelsCountOutputType ? LabelsCountOutputType[P] : never
  } 
    : LabelsCountOutputType
  : LabelsCountOutputType




  // Custom InputTypes

  /**
   * LabelsCountOutputType without action
   */
  export type LabelsCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the LabelsCountOutputType
     * 
    **/
    select?: LabelsCountOutputTypeSelect | null
  }



  /**
   * Count Type SessionsCountOutputType
   */


  export type SessionsCountOutputType = {
    extracted_resources: number
    session_labels: number
  }

  export type SessionsCountOutputTypeSelect = {
    extracted_resources?: boolean
    session_labels?: boolean
  }

  export type SessionsCountOutputTypeGetPayload<
    S extends boolean | null | undefined | SessionsCountOutputTypeArgs,
    U = keyof S
      > = S extends true
        ? SessionsCountOutputType
    : S extends undefined
    ? never
    : S extends SessionsCountOutputTypeArgs
    ?'include' extends U
    ? SessionsCountOutputType 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof SessionsCountOutputType ? SessionsCountOutputType[P] : never
  } 
    : SessionsCountOutputType
  : SessionsCountOutputType




  // Custom InputTypes

  /**
   * SessionsCountOutputType without action
   */
  export type SessionsCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the SessionsCountOutputType
     * 
    **/
    select?: SessionsCountOutputTypeSelect | null
  }



  /**
   * Models
   */

  /**
   * Model alembic_version
   */


  export type AggregateAlembic_version = {
    _count: Alembic_versionCountAggregateOutputType | null
    _min: Alembic_versionMinAggregateOutputType | null
    _max: Alembic_versionMaxAggregateOutputType | null
  }

  export type Alembic_versionMinAggregateOutputType = {
    version_num: string | null
  }

  export type Alembic_versionMaxAggregateOutputType = {
    version_num: string | null
  }

  export type Alembic_versionCountAggregateOutputType = {
    version_num: number
    _all: number
  }


  export type Alembic_versionMinAggregateInputType = {
    version_num?: true
  }

  export type Alembic_versionMaxAggregateInputType = {
    version_num?: true
  }

  export type Alembic_versionCountAggregateInputType = {
    version_num?: true
    _all?: true
  }

  export type Alembic_versionAggregateArgs = {
    /**
     * Filter which alembic_version to aggregate.
     * 
    **/
    where?: alembic_versionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of alembic_versions to fetch.
     * 
    **/
    orderBy?: Enumerable<alembic_versionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: alembic_versionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` alembic_versions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` alembic_versions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned alembic_versions
    **/
    _count?: true | Alembic_versionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Alembic_versionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Alembic_versionMaxAggregateInputType
  }

  export type GetAlembic_versionAggregateType<T extends Alembic_versionAggregateArgs> = {
        [P in keyof T & keyof AggregateAlembic_version]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAlembic_version[P]>
      : GetScalarType<T[P], AggregateAlembic_version[P]>
  }




  export type Alembic_versionGroupByArgs = {
    where?: alembic_versionWhereInput
    orderBy?: Enumerable<alembic_versionOrderByWithAggregationInput>
    by: Array<Alembic_versionScalarFieldEnum>
    having?: alembic_versionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Alembic_versionCountAggregateInputType | true
    _min?: Alembic_versionMinAggregateInputType
    _max?: Alembic_versionMaxAggregateInputType
  }


  export type Alembic_versionGroupByOutputType = {
    version_num: string
    _count: Alembic_versionCountAggregateOutputType | null
    _min: Alembic_versionMinAggregateOutputType | null
    _max: Alembic_versionMaxAggregateOutputType | null
  }

  type GetAlembic_versionGroupByPayload<T extends Alembic_versionGroupByArgs> = PrismaPromise<
    Array<
      PickArray<Alembic_versionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Alembic_versionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Alembic_versionGroupByOutputType[P]>
            : GetScalarType<T[P], Alembic_versionGroupByOutputType[P]>
        }
      >
    >


  export type alembic_versionSelect = {
    version_num?: boolean
  }

  export type alembic_versionGetPayload<
    S extends boolean | null | undefined | alembic_versionArgs,
    U = keyof S
      > = S extends true
        ? alembic_version
    : S extends undefined
    ? never
    : S extends alembic_versionArgs | alembic_versionFindManyArgs
    ?'include' extends U
    ? alembic_version 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof alembic_version ? alembic_version[P] : never
  } 
    : alembic_version
  : alembic_version


  type alembic_versionCountArgs = Merge<
    Omit<alembic_versionFindManyArgs, 'select' | 'include'> & {
      select?: Alembic_versionCountAggregateInputType | true
    }
  >

  export interface alembic_versionDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one Alembic_version that matches the filter.
     * @param {alembic_versionFindUniqueArgs} args - Arguments to find a Alembic_version
     * @example
     * // Get one Alembic_version
     * const alembic_version = await prisma.alembic_version.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends alembic_versionFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, alembic_versionFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'alembic_version'> extends True ? CheckSelect<T, Prisma__alembic_versionClient<alembic_version>, Prisma__alembic_versionClient<alembic_versionGetPayload<T>>> : CheckSelect<T, Prisma__alembic_versionClient<alembic_version | null, null>, Prisma__alembic_versionClient<alembic_versionGetPayload<T> | null, null>>

    /**
     * Find the first Alembic_version that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {alembic_versionFindFirstArgs} args - Arguments to find a Alembic_version
     * @example
     * // Get one Alembic_version
     * const alembic_version = await prisma.alembic_version.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends alembic_versionFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, alembic_versionFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'alembic_version'> extends True ? CheckSelect<T, Prisma__alembic_versionClient<alembic_version>, Prisma__alembic_versionClient<alembic_versionGetPayload<T>>> : CheckSelect<T, Prisma__alembic_versionClient<alembic_version | null, null>, Prisma__alembic_versionClient<alembic_versionGetPayload<T> | null, null>>

    /**
     * Find zero or more Alembic_versions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {alembic_versionFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Alembic_versions
     * const alembic_versions = await prisma.alembic_version.findMany()
     * 
     * // Get first 10 Alembic_versions
     * const alembic_versions = await prisma.alembic_version.findMany({ take: 10 })
     * 
     * // Only select the `version_num`
     * const alembic_versionWithVersion_numOnly = await prisma.alembic_version.findMany({ select: { version_num: true } })
     * 
    **/
    findMany<T extends alembic_versionFindManyArgs>(
      args?: SelectSubset<T, alembic_versionFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<alembic_version>>, PrismaPromise<Array<alembic_versionGetPayload<T>>>>

    /**
     * Create a Alembic_version.
     * @param {alembic_versionCreateArgs} args - Arguments to create a Alembic_version.
     * @example
     * // Create one Alembic_version
     * const Alembic_version = await prisma.alembic_version.create({
     *   data: {
     *     // ... data to create a Alembic_version
     *   }
     * })
     * 
    **/
    create<T extends alembic_versionCreateArgs>(
      args: SelectSubset<T, alembic_versionCreateArgs>
    ): CheckSelect<T, Prisma__alembic_versionClient<alembic_version>, Prisma__alembic_versionClient<alembic_versionGetPayload<T>>>

    /**
     * Create many Alembic_versions.
     *     @param {alembic_versionCreateManyArgs} args - Arguments to create many Alembic_versions.
     *     @example
     *     // Create many Alembic_versions
     *     const alembic_version = await prisma.alembic_version.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends alembic_versionCreateManyArgs>(
      args?: SelectSubset<T, alembic_versionCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Alembic_version.
     * @param {alembic_versionDeleteArgs} args - Arguments to delete one Alembic_version.
     * @example
     * // Delete one Alembic_version
     * const Alembic_version = await prisma.alembic_version.delete({
     *   where: {
     *     // ... filter to delete one Alembic_version
     *   }
     * })
     * 
    **/
    delete<T extends alembic_versionDeleteArgs>(
      args: SelectSubset<T, alembic_versionDeleteArgs>
    ): CheckSelect<T, Prisma__alembic_versionClient<alembic_version>, Prisma__alembic_versionClient<alembic_versionGetPayload<T>>>

    /**
     * Update one Alembic_version.
     * @param {alembic_versionUpdateArgs} args - Arguments to update one Alembic_version.
     * @example
     * // Update one Alembic_version
     * const alembic_version = await prisma.alembic_version.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends alembic_versionUpdateArgs>(
      args: SelectSubset<T, alembic_versionUpdateArgs>
    ): CheckSelect<T, Prisma__alembic_versionClient<alembic_version>, Prisma__alembic_versionClient<alembic_versionGetPayload<T>>>

    /**
     * Delete zero or more Alembic_versions.
     * @param {alembic_versionDeleteManyArgs} args - Arguments to filter Alembic_versions to delete.
     * @example
     * // Delete a few Alembic_versions
     * const { count } = await prisma.alembic_version.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends alembic_versionDeleteManyArgs>(
      args?: SelectSubset<T, alembic_versionDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Alembic_versions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {alembic_versionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Alembic_versions
     * const alembic_version = await prisma.alembic_version.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends alembic_versionUpdateManyArgs>(
      args: SelectSubset<T, alembic_versionUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Alembic_version.
     * @param {alembic_versionUpsertArgs} args - Arguments to update or create a Alembic_version.
     * @example
     * // Update or create a Alembic_version
     * const alembic_version = await prisma.alembic_version.upsert({
     *   create: {
     *     // ... data to create a Alembic_version
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Alembic_version we want to update
     *   }
     * })
    **/
    upsert<T extends alembic_versionUpsertArgs>(
      args: SelectSubset<T, alembic_versionUpsertArgs>
    ): CheckSelect<T, Prisma__alembic_versionClient<alembic_version>, Prisma__alembic_versionClient<alembic_versionGetPayload<T>>>

    /**
     * Find one Alembic_version that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {alembic_versionFindUniqueOrThrowArgs} args - Arguments to find a Alembic_version
     * @example
     * // Get one Alembic_version
     * const alembic_version = await prisma.alembic_version.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends alembic_versionFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, alembic_versionFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__alembic_versionClient<alembic_version>, Prisma__alembic_versionClient<alembic_versionGetPayload<T>>>

    /**
     * Find the first Alembic_version that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {alembic_versionFindFirstOrThrowArgs} args - Arguments to find a Alembic_version
     * @example
     * // Get one Alembic_version
     * const alembic_version = await prisma.alembic_version.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends alembic_versionFindFirstOrThrowArgs>(
      args?: SelectSubset<T, alembic_versionFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__alembic_versionClient<alembic_version>, Prisma__alembic_versionClient<alembic_versionGetPayload<T>>>

    /**
     * Count the number of Alembic_versions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {alembic_versionCountArgs} args - Arguments to filter Alembic_versions to count.
     * @example
     * // Count the number of Alembic_versions
     * const count = await prisma.alembic_version.count({
     *   where: {
     *     // ... the filter for the Alembic_versions we want to count
     *   }
     * })
    **/
    count<T extends alembic_versionCountArgs>(
      args?: Subset<T, alembic_versionCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Alembic_versionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Alembic_version.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Alembic_versionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Alembic_versionAggregateArgs>(args: Subset<T, Alembic_versionAggregateArgs>): PrismaPromise<GetAlembic_versionAggregateType<T>>

    /**
     * Group by Alembic_version.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Alembic_versionGroupByArgs} args - Group by arguments.
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
      T extends Alembic_versionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: Alembic_versionGroupByArgs['orderBy'] }
        : { orderBy?: Alembic_versionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, Alembic_versionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAlembic_versionGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for alembic_version.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__alembic_versionClient<T, Null = never> implements PrismaPromise<T> {
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
   * alembic_version base type for findUnique actions
   */
  export type alembic_versionFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the alembic_version
     * 
    **/
    select?: alembic_versionSelect | null
    /**
     * Filter, which alembic_version to fetch.
     * 
    **/
    where: alembic_versionWhereUniqueInput
  }

  /**
   * alembic_version: findUnique
   */
  export interface alembic_versionFindUniqueArgs extends alembic_versionFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * alembic_version base type for findFirst actions
   */
  export type alembic_versionFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the alembic_version
     * 
    **/
    select?: alembic_versionSelect | null
    /**
     * Filter, which alembic_version to fetch.
     * 
    **/
    where?: alembic_versionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of alembic_versions to fetch.
     * 
    **/
    orderBy?: Enumerable<alembic_versionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for alembic_versions.
     * 
    **/
    cursor?: alembic_versionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` alembic_versions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` alembic_versions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of alembic_versions.
     * 
    **/
    distinct?: Enumerable<Alembic_versionScalarFieldEnum>
  }

  /**
   * alembic_version: findFirst
   */
  export interface alembic_versionFindFirstArgs extends alembic_versionFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * alembic_version findMany
   */
  export type alembic_versionFindManyArgs = {
    /**
     * Select specific fields to fetch from the alembic_version
     * 
    **/
    select?: alembic_versionSelect | null
    /**
     * Filter, which alembic_versions to fetch.
     * 
    **/
    where?: alembic_versionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of alembic_versions to fetch.
     * 
    **/
    orderBy?: Enumerable<alembic_versionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing alembic_versions.
     * 
    **/
    cursor?: alembic_versionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` alembic_versions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` alembic_versions.
     * 
    **/
    skip?: number
    distinct?: Enumerable<Alembic_versionScalarFieldEnum>
  }


  /**
   * alembic_version create
   */
  export type alembic_versionCreateArgs = {
    /**
     * Select specific fields to fetch from the alembic_version
     * 
    **/
    select?: alembic_versionSelect | null
    /**
     * The data needed to create a alembic_version.
     * 
    **/
    data: XOR<alembic_versionCreateInput, alembic_versionUncheckedCreateInput>
  }


  /**
   * alembic_version createMany
   */
  export type alembic_versionCreateManyArgs = {
    /**
     * The data used to create many alembic_versions.
     * 
    **/
    data: Enumerable<alembic_versionCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * alembic_version update
   */
  export type alembic_versionUpdateArgs = {
    /**
     * Select specific fields to fetch from the alembic_version
     * 
    **/
    select?: alembic_versionSelect | null
    /**
     * The data needed to update a alembic_version.
     * 
    **/
    data: XOR<alembic_versionUpdateInput, alembic_versionUncheckedUpdateInput>
    /**
     * Choose, which alembic_version to update.
     * 
    **/
    where: alembic_versionWhereUniqueInput
  }


  /**
   * alembic_version updateMany
   */
  export type alembic_versionUpdateManyArgs = {
    /**
     * The data used to update alembic_versions.
     * 
    **/
    data: XOR<alembic_versionUpdateManyMutationInput, alembic_versionUncheckedUpdateManyInput>
    /**
     * Filter which alembic_versions to update
     * 
    **/
    where?: alembic_versionWhereInput
  }


  /**
   * alembic_version upsert
   */
  export type alembic_versionUpsertArgs = {
    /**
     * Select specific fields to fetch from the alembic_version
     * 
    **/
    select?: alembic_versionSelect | null
    /**
     * The filter to search for the alembic_version to update in case it exists.
     * 
    **/
    where: alembic_versionWhereUniqueInput
    /**
     * In case the alembic_version found by the `where` argument doesn't exist, create a new alembic_version with this data.
     * 
    **/
    create: XOR<alembic_versionCreateInput, alembic_versionUncheckedCreateInput>
    /**
     * In case the alembic_version was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<alembic_versionUpdateInput, alembic_versionUncheckedUpdateInput>
  }


  /**
   * alembic_version delete
   */
  export type alembic_versionDeleteArgs = {
    /**
     * Select specific fields to fetch from the alembic_version
     * 
    **/
    select?: alembic_versionSelect | null
    /**
     * Filter which alembic_version to delete.
     * 
    **/
    where: alembic_versionWhereUniqueInput
  }


  /**
   * alembic_version deleteMany
   */
  export type alembic_versionDeleteManyArgs = {
    /**
     * Filter which alembic_versions to delete
     * 
    **/
    where?: alembic_versionWhereInput
  }


  /**
   * alembic_version: findUniqueOrThrow
   */
  export type alembic_versionFindUniqueOrThrowArgs = alembic_versionFindUniqueArgsBase
      

  /**
   * alembic_version: findFirstOrThrow
   */
  export type alembic_versionFindFirstOrThrowArgs = alembic_versionFindFirstArgsBase
      

  /**
   * alembic_version without action
   */
  export type alembic_versionArgs = {
    /**
     * Select specific fields to fetch from the alembic_version
     * 
    **/
    select?: alembic_versionSelect | null
  }



  /**
   * Model extracted_resource_labels
   */


  export type AggregateExtracted_resource_labels = {
    _count: Extracted_resource_labelsCountAggregateOutputType | null
    _min: Extracted_resource_labelsMinAggregateOutputType | null
    _max: Extracted_resource_labelsMaxAggregateOutputType | null
  }

  export type Extracted_resource_labelsMinAggregateOutputType = {
    extracted_resource_id: string | null
    label_id: string | null
  }

  export type Extracted_resource_labelsMaxAggregateOutputType = {
    extracted_resource_id: string | null
    label_id: string | null
  }

  export type Extracted_resource_labelsCountAggregateOutputType = {
    extracted_resource_id: number
    label_id: number
    _all: number
  }


  export type Extracted_resource_labelsMinAggregateInputType = {
    extracted_resource_id?: true
    label_id?: true
  }

  export type Extracted_resource_labelsMaxAggregateInputType = {
    extracted_resource_id?: true
    label_id?: true
  }

  export type Extracted_resource_labelsCountAggregateInputType = {
    extracted_resource_id?: true
    label_id?: true
    _all?: true
  }

  export type Extracted_resource_labelsAggregateArgs = {
    /**
     * Filter which extracted_resource_labels to aggregate.
     * 
    **/
    where?: extracted_resource_labelsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of extracted_resource_labels to fetch.
     * 
    **/
    orderBy?: Enumerable<extracted_resource_labelsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: extracted_resource_labelsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` extracted_resource_labels from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` extracted_resource_labels.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned extracted_resource_labels
    **/
    _count?: true | Extracted_resource_labelsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Extracted_resource_labelsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Extracted_resource_labelsMaxAggregateInputType
  }

  export type GetExtracted_resource_labelsAggregateType<T extends Extracted_resource_labelsAggregateArgs> = {
        [P in keyof T & keyof AggregateExtracted_resource_labels]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExtracted_resource_labels[P]>
      : GetScalarType<T[P], AggregateExtracted_resource_labels[P]>
  }




  export type Extracted_resource_labelsGroupByArgs = {
    where?: extracted_resource_labelsWhereInput
    orderBy?: Enumerable<extracted_resource_labelsOrderByWithAggregationInput>
    by: Array<Extracted_resource_labelsScalarFieldEnum>
    having?: extracted_resource_labelsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Extracted_resource_labelsCountAggregateInputType | true
    _min?: Extracted_resource_labelsMinAggregateInputType
    _max?: Extracted_resource_labelsMaxAggregateInputType
  }


  export type Extracted_resource_labelsGroupByOutputType = {
    extracted_resource_id: string
    label_id: string
    _count: Extracted_resource_labelsCountAggregateOutputType | null
    _min: Extracted_resource_labelsMinAggregateOutputType | null
    _max: Extracted_resource_labelsMaxAggregateOutputType | null
  }

  type GetExtracted_resource_labelsGroupByPayload<T extends Extracted_resource_labelsGroupByArgs> = PrismaPromise<
    Array<
      PickArray<Extracted_resource_labelsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Extracted_resource_labelsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Extracted_resource_labelsGroupByOutputType[P]>
            : GetScalarType<T[P], Extracted_resource_labelsGroupByOutputType[P]>
        }
      >
    >


  export type extracted_resource_labelsSelect = {
    extracted_resource_id?: boolean
    label_id?: boolean
    extracted_resources?: boolean | extracted_resourcesArgs
    labels?: boolean | labelsArgs
  }

  export type extracted_resource_labelsInclude = {
    extracted_resources?: boolean | extracted_resourcesArgs
    labels?: boolean | labelsArgs
  }

  export type extracted_resource_labelsGetPayload<
    S extends boolean | null | undefined | extracted_resource_labelsArgs,
    U = keyof S
      > = S extends true
        ? extracted_resource_labels
    : S extends undefined
    ? never
    : S extends extracted_resource_labelsArgs | extracted_resource_labelsFindManyArgs
    ?'include' extends U
    ? extracted_resource_labels  & {
    [P in TrueKeys<S['include']>]:
        P extends 'extracted_resources' ? extracted_resourcesGetPayload<Exclude<S['include'], undefined | null>[P]> :
        P extends 'labels' ? labelsGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'extracted_resources' ? extracted_resourcesGetPayload<Exclude<S['select'], undefined | null>[P]> :
        P extends 'labels' ? labelsGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof extracted_resource_labels ? extracted_resource_labels[P] : never
  } 
    : extracted_resource_labels
  : extracted_resource_labels


  type extracted_resource_labelsCountArgs = Merge<
    Omit<extracted_resource_labelsFindManyArgs, 'select' | 'include'> & {
      select?: Extracted_resource_labelsCountAggregateInputType | true
    }
  >

  export interface extracted_resource_labelsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one Extracted_resource_labels that matches the filter.
     * @param {extracted_resource_labelsFindUniqueArgs} args - Arguments to find a Extracted_resource_labels
     * @example
     * // Get one Extracted_resource_labels
     * const extracted_resource_labels = await prisma.extracted_resource_labels.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends extracted_resource_labelsFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, extracted_resource_labelsFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'extracted_resource_labels'> extends True ? CheckSelect<T, Prisma__extracted_resource_labelsClient<extracted_resource_labels>, Prisma__extracted_resource_labelsClient<extracted_resource_labelsGetPayload<T>>> : CheckSelect<T, Prisma__extracted_resource_labelsClient<extracted_resource_labels | null, null>, Prisma__extracted_resource_labelsClient<extracted_resource_labelsGetPayload<T> | null, null>>

    /**
     * Find the first Extracted_resource_labels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {extracted_resource_labelsFindFirstArgs} args - Arguments to find a Extracted_resource_labels
     * @example
     * // Get one Extracted_resource_labels
     * const extracted_resource_labels = await prisma.extracted_resource_labels.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends extracted_resource_labelsFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, extracted_resource_labelsFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'extracted_resource_labels'> extends True ? CheckSelect<T, Prisma__extracted_resource_labelsClient<extracted_resource_labels>, Prisma__extracted_resource_labelsClient<extracted_resource_labelsGetPayload<T>>> : CheckSelect<T, Prisma__extracted_resource_labelsClient<extracted_resource_labels | null, null>, Prisma__extracted_resource_labelsClient<extracted_resource_labelsGetPayload<T> | null, null>>

    /**
     * Find zero or more Extracted_resource_labels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {extracted_resource_labelsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Extracted_resource_labels
     * const extracted_resource_labels = await prisma.extracted_resource_labels.findMany()
     * 
     * // Get first 10 Extracted_resource_labels
     * const extracted_resource_labels = await prisma.extracted_resource_labels.findMany({ take: 10 })
     * 
     * // Only select the `extracted_resource_id`
     * const extracted_resource_labelsWithExtracted_resource_idOnly = await prisma.extracted_resource_labels.findMany({ select: { extracted_resource_id: true } })
     * 
    **/
    findMany<T extends extracted_resource_labelsFindManyArgs>(
      args?: SelectSubset<T, extracted_resource_labelsFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<extracted_resource_labels>>, PrismaPromise<Array<extracted_resource_labelsGetPayload<T>>>>

    /**
     * Create a Extracted_resource_labels.
     * @param {extracted_resource_labelsCreateArgs} args - Arguments to create a Extracted_resource_labels.
     * @example
     * // Create one Extracted_resource_labels
     * const Extracted_resource_labels = await prisma.extracted_resource_labels.create({
     *   data: {
     *     // ... data to create a Extracted_resource_labels
     *   }
     * })
     * 
    **/
    create<T extends extracted_resource_labelsCreateArgs>(
      args: SelectSubset<T, extracted_resource_labelsCreateArgs>
    ): CheckSelect<T, Prisma__extracted_resource_labelsClient<extracted_resource_labels>, Prisma__extracted_resource_labelsClient<extracted_resource_labelsGetPayload<T>>>

    /**
     * Create many Extracted_resource_labels.
     *     @param {extracted_resource_labelsCreateManyArgs} args - Arguments to create many Extracted_resource_labels.
     *     @example
     *     // Create many Extracted_resource_labels
     *     const extracted_resource_labels = await prisma.extracted_resource_labels.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends extracted_resource_labelsCreateManyArgs>(
      args?: SelectSubset<T, extracted_resource_labelsCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Extracted_resource_labels.
     * @param {extracted_resource_labelsDeleteArgs} args - Arguments to delete one Extracted_resource_labels.
     * @example
     * // Delete one Extracted_resource_labels
     * const Extracted_resource_labels = await prisma.extracted_resource_labels.delete({
     *   where: {
     *     // ... filter to delete one Extracted_resource_labels
     *   }
     * })
     * 
    **/
    delete<T extends extracted_resource_labelsDeleteArgs>(
      args: SelectSubset<T, extracted_resource_labelsDeleteArgs>
    ): CheckSelect<T, Prisma__extracted_resource_labelsClient<extracted_resource_labels>, Prisma__extracted_resource_labelsClient<extracted_resource_labelsGetPayload<T>>>

    /**
     * Update one Extracted_resource_labels.
     * @param {extracted_resource_labelsUpdateArgs} args - Arguments to update one Extracted_resource_labels.
     * @example
     * // Update one Extracted_resource_labels
     * const extracted_resource_labels = await prisma.extracted_resource_labels.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends extracted_resource_labelsUpdateArgs>(
      args: SelectSubset<T, extracted_resource_labelsUpdateArgs>
    ): CheckSelect<T, Prisma__extracted_resource_labelsClient<extracted_resource_labels>, Prisma__extracted_resource_labelsClient<extracted_resource_labelsGetPayload<T>>>

    /**
     * Delete zero or more Extracted_resource_labels.
     * @param {extracted_resource_labelsDeleteManyArgs} args - Arguments to filter Extracted_resource_labels to delete.
     * @example
     * // Delete a few Extracted_resource_labels
     * const { count } = await prisma.extracted_resource_labels.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends extracted_resource_labelsDeleteManyArgs>(
      args?: SelectSubset<T, extracted_resource_labelsDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Extracted_resource_labels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {extracted_resource_labelsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Extracted_resource_labels
     * const extracted_resource_labels = await prisma.extracted_resource_labels.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends extracted_resource_labelsUpdateManyArgs>(
      args: SelectSubset<T, extracted_resource_labelsUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Extracted_resource_labels.
     * @param {extracted_resource_labelsUpsertArgs} args - Arguments to update or create a Extracted_resource_labels.
     * @example
     * // Update or create a Extracted_resource_labels
     * const extracted_resource_labels = await prisma.extracted_resource_labels.upsert({
     *   create: {
     *     // ... data to create a Extracted_resource_labels
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Extracted_resource_labels we want to update
     *   }
     * })
    **/
    upsert<T extends extracted_resource_labelsUpsertArgs>(
      args: SelectSubset<T, extracted_resource_labelsUpsertArgs>
    ): CheckSelect<T, Prisma__extracted_resource_labelsClient<extracted_resource_labels>, Prisma__extracted_resource_labelsClient<extracted_resource_labelsGetPayload<T>>>

    /**
     * Find one Extracted_resource_labels that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {extracted_resource_labelsFindUniqueOrThrowArgs} args - Arguments to find a Extracted_resource_labels
     * @example
     * // Get one Extracted_resource_labels
     * const extracted_resource_labels = await prisma.extracted_resource_labels.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends extracted_resource_labelsFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, extracted_resource_labelsFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__extracted_resource_labelsClient<extracted_resource_labels>, Prisma__extracted_resource_labelsClient<extracted_resource_labelsGetPayload<T>>>

    /**
     * Find the first Extracted_resource_labels that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {extracted_resource_labelsFindFirstOrThrowArgs} args - Arguments to find a Extracted_resource_labels
     * @example
     * // Get one Extracted_resource_labels
     * const extracted_resource_labels = await prisma.extracted_resource_labels.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends extracted_resource_labelsFindFirstOrThrowArgs>(
      args?: SelectSubset<T, extracted_resource_labelsFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__extracted_resource_labelsClient<extracted_resource_labels>, Prisma__extracted_resource_labelsClient<extracted_resource_labelsGetPayload<T>>>

    /**
     * Count the number of Extracted_resource_labels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {extracted_resource_labelsCountArgs} args - Arguments to filter Extracted_resource_labels to count.
     * @example
     * // Count the number of Extracted_resource_labels
     * const count = await prisma.extracted_resource_labels.count({
     *   where: {
     *     // ... the filter for the Extracted_resource_labels we want to count
     *   }
     * })
    **/
    count<T extends extracted_resource_labelsCountArgs>(
      args?: Subset<T, extracted_resource_labelsCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Extracted_resource_labelsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Extracted_resource_labels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Extracted_resource_labelsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Extracted_resource_labelsAggregateArgs>(args: Subset<T, Extracted_resource_labelsAggregateArgs>): PrismaPromise<GetExtracted_resource_labelsAggregateType<T>>

    /**
     * Group by Extracted_resource_labels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Extracted_resource_labelsGroupByArgs} args - Group by arguments.
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
      T extends Extracted_resource_labelsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: Extracted_resource_labelsGroupByArgs['orderBy'] }
        : { orderBy?: Extracted_resource_labelsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, Extracted_resource_labelsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExtracted_resource_labelsGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for extracted_resource_labels.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__extracted_resource_labelsClient<T, Null = never> implements PrismaPromise<T> {
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

    extracted_resources<T extends extracted_resourcesArgs = {}>(args?: Subset<T, extracted_resourcesArgs>): CheckSelect<T, Prisma__extracted_resourcesClient<extracted_resources | Null>, Prisma__extracted_resourcesClient<extracted_resourcesGetPayload<T> | Null>>;

    labels<T extends labelsArgs = {}>(args?: Subset<T, labelsArgs>): CheckSelect<T, Prisma__labelsClient<labels | Null>, Prisma__labelsClient<labelsGetPayload<T> | Null>>;

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
   * extracted_resource_labels base type for findUnique actions
   */
  export type extracted_resource_labelsFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the extracted_resource_labels
     * 
    **/
    select?: extracted_resource_labelsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: extracted_resource_labelsInclude | null
    /**
     * Filter, which extracted_resource_labels to fetch.
     * 
    **/
    where: extracted_resource_labelsWhereUniqueInput
  }

  /**
   * extracted_resource_labels: findUnique
   */
  export interface extracted_resource_labelsFindUniqueArgs extends extracted_resource_labelsFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * extracted_resource_labels base type for findFirst actions
   */
  export type extracted_resource_labelsFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the extracted_resource_labels
     * 
    **/
    select?: extracted_resource_labelsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: extracted_resource_labelsInclude | null
    /**
     * Filter, which extracted_resource_labels to fetch.
     * 
    **/
    where?: extracted_resource_labelsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of extracted_resource_labels to fetch.
     * 
    **/
    orderBy?: Enumerable<extracted_resource_labelsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for extracted_resource_labels.
     * 
    **/
    cursor?: extracted_resource_labelsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` extracted_resource_labels from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` extracted_resource_labels.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of extracted_resource_labels.
     * 
    **/
    distinct?: Enumerable<Extracted_resource_labelsScalarFieldEnum>
  }

  /**
   * extracted_resource_labels: findFirst
   */
  export interface extracted_resource_labelsFindFirstArgs extends extracted_resource_labelsFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * extracted_resource_labels findMany
   */
  export type extracted_resource_labelsFindManyArgs = {
    /**
     * Select specific fields to fetch from the extracted_resource_labels
     * 
    **/
    select?: extracted_resource_labelsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: extracted_resource_labelsInclude | null
    /**
     * Filter, which extracted_resource_labels to fetch.
     * 
    **/
    where?: extracted_resource_labelsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of extracted_resource_labels to fetch.
     * 
    **/
    orderBy?: Enumerable<extracted_resource_labelsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing extracted_resource_labels.
     * 
    **/
    cursor?: extracted_resource_labelsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` extracted_resource_labels from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` extracted_resource_labels.
     * 
    **/
    skip?: number
    distinct?: Enumerable<Extracted_resource_labelsScalarFieldEnum>
  }


  /**
   * extracted_resource_labels create
   */
  export type extracted_resource_labelsCreateArgs = {
    /**
     * Select specific fields to fetch from the extracted_resource_labels
     * 
    **/
    select?: extracted_resource_labelsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: extracted_resource_labelsInclude | null
    /**
     * The data needed to create a extracted_resource_labels.
     * 
    **/
    data: XOR<extracted_resource_labelsCreateInput, extracted_resource_labelsUncheckedCreateInput>
  }


  /**
   * extracted_resource_labels createMany
   */
  export type extracted_resource_labelsCreateManyArgs = {
    /**
     * The data used to create many extracted_resource_labels.
     * 
    **/
    data: Enumerable<extracted_resource_labelsCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * extracted_resource_labels update
   */
  export type extracted_resource_labelsUpdateArgs = {
    /**
     * Select specific fields to fetch from the extracted_resource_labels
     * 
    **/
    select?: extracted_resource_labelsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: extracted_resource_labelsInclude | null
    /**
     * The data needed to update a extracted_resource_labels.
     * 
    **/
    data: XOR<extracted_resource_labelsUpdateInput, extracted_resource_labelsUncheckedUpdateInput>
    /**
     * Choose, which extracted_resource_labels to update.
     * 
    **/
    where: extracted_resource_labelsWhereUniqueInput
  }


  /**
   * extracted_resource_labels updateMany
   */
  export type extracted_resource_labelsUpdateManyArgs = {
    /**
     * The data used to update extracted_resource_labels.
     * 
    **/
    data: XOR<extracted_resource_labelsUpdateManyMutationInput, extracted_resource_labelsUncheckedUpdateManyInput>
    /**
     * Filter which extracted_resource_labels to update
     * 
    **/
    where?: extracted_resource_labelsWhereInput
  }


  /**
   * extracted_resource_labels upsert
   */
  export type extracted_resource_labelsUpsertArgs = {
    /**
     * Select specific fields to fetch from the extracted_resource_labels
     * 
    **/
    select?: extracted_resource_labelsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: extracted_resource_labelsInclude | null
    /**
     * The filter to search for the extracted_resource_labels to update in case it exists.
     * 
    **/
    where: extracted_resource_labelsWhereUniqueInput
    /**
     * In case the extracted_resource_labels found by the `where` argument doesn't exist, create a new extracted_resource_labels with this data.
     * 
    **/
    create: XOR<extracted_resource_labelsCreateInput, extracted_resource_labelsUncheckedCreateInput>
    /**
     * In case the extracted_resource_labels was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<extracted_resource_labelsUpdateInput, extracted_resource_labelsUncheckedUpdateInput>
  }


  /**
   * extracted_resource_labels delete
   */
  export type extracted_resource_labelsDeleteArgs = {
    /**
     * Select specific fields to fetch from the extracted_resource_labels
     * 
    **/
    select?: extracted_resource_labelsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: extracted_resource_labelsInclude | null
    /**
     * Filter which extracted_resource_labels to delete.
     * 
    **/
    where: extracted_resource_labelsWhereUniqueInput
  }


  /**
   * extracted_resource_labels deleteMany
   */
  export type extracted_resource_labelsDeleteManyArgs = {
    /**
     * Filter which extracted_resource_labels to delete
     * 
    **/
    where?: extracted_resource_labelsWhereInput
  }


  /**
   * extracted_resource_labels: findUniqueOrThrow
   */
  export type extracted_resource_labelsFindUniqueOrThrowArgs = extracted_resource_labelsFindUniqueArgsBase
      

  /**
   * extracted_resource_labels: findFirstOrThrow
   */
  export type extracted_resource_labelsFindFirstOrThrowArgs = extracted_resource_labelsFindFirstArgsBase
      

  /**
   * extracted_resource_labels without action
   */
  export type extracted_resource_labelsArgs = {
    /**
     * Select specific fields to fetch from the extracted_resource_labels
     * 
    **/
    select?: extracted_resource_labelsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: extracted_resource_labelsInclude | null
  }



  /**
   * Model extracted_resources
   */


  export type AggregateExtracted_resources = {
    _count: Extracted_resourcesCountAggregateOutputType | null
    _min: Extracted_resourcesMinAggregateOutputType | null
    _max: Extracted_resourcesMaxAggregateOutputType | null
  }

  export type Extracted_resourcesMinAggregateOutputType = {
    id: string | null
    created_at: Date | null
    updated_at: Date | null
    resource_path: string | null
    filetype: resourcetype | null
    raw_resource_id: string | null
    patient_id: string | null
    session_id: string | null
  }

  export type Extracted_resourcesMaxAggregateOutputType = {
    id: string | null
    created_at: Date | null
    updated_at: Date | null
    resource_path: string | null
    filetype: resourcetype | null
    raw_resource_id: string | null
    patient_id: string | null
    session_id: string | null
  }

  export type Extracted_resourcesCountAggregateOutputType = {
    id: number
    created_at: number
    updated_at: number
    resource_path: number
    filetype: number
    feature: number
    raw_resource_id: number
    patient_id: number
    session_id: number
    _all: number
  }


  export type Extracted_resourcesMinAggregateInputType = {
    id?: true
    created_at?: true
    updated_at?: true
    resource_path?: true
    filetype?: true
    raw_resource_id?: true
    patient_id?: true
    session_id?: true
  }

  export type Extracted_resourcesMaxAggregateInputType = {
    id?: true
    created_at?: true
    updated_at?: true
    resource_path?: true
    filetype?: true
    raw_resource_id?: true
    patient_id?: true
    session_id?: true
  }

  export type Extracted_resourcesCountAggregateInputType = {
    id?: true
    created_at?: true
    updated_at?: true
    resource_path?: true
    filetype?: true
    feature?: true
    raw_resource_id?: true
    patient_id?: true
    session_id?: true
    _all?: true
  }

  export type Extracted_resourcesAggregateArgs = {
    /**
     * Filter which extracted_resources to aggregate.
     * 
    **/
    where?: extracted_resourcesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of extracted_resources to fetch.
     * 
    **/
    orderBy?: Enumerable<extracted_resourcesOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: extracted_resourcesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` extracted_resources from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` extracted_resources.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned extracted_resources
    **/
    _count?: true | Extracted_resourcesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Extracted_resourcesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Extracted_resourcesMaxAggregateInputType
  }

  export type GetExtracted_resourcesAggregateType<T extends Extracted_resourcesAggregateArgs> = {
        [P in keyof T & keyof AggregateExtracted_resources]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExtracted_resources[P]>
      : GetScalarType<T[P], AggregateExtracted_resources[P]>
  }




  export type Extracted_resourcesGroupByArgs = {
    where?: extracted_resourcesWhereInput
    orderBy?: Enumerable<extracted_resourcesOrderByWithAggregationInput>
    by: Array<Extracted_resourcesScalarFieldEnum>
    having?: extracted_resourcesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Extracted_resourcesCountAggregateInputType | true
    _min?: Extracted_resourcesMinAggregateInputType
    _max?: Extracted_resourcesMaxAggregateInputType
  }


  export type Extracted_resourcesGroupByOutputType = {
    id: string
    created_at: Date | null
    updated_at: Date | null
    resource_path: string
    filetype: resourcetype
    feature: JsonValue | null
    raw_resource_id: string
    patient_id: string
    session_id: string | null
    _count: Extracted_resourcesCountAggregateOutputType | null
    _min: Extracted_resourcesMinAggregateOutputType | null
    _max: Extracted_resourcesMaxAggregateOutputType | null
  }

  type GetExtracted_resourcesGroupByPayload<T extends Extracted_resourcesGroupByArgs> = PrismaPromise<
    Array<
      PickArray<Extracted_resourcesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Extracted_resourcesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Extracted_resourcesGroupByOutputType[P]>
            : GetScalarType<T[P], Extracted_resourcesGroupByOutputType[P]>
        }
      >
    >


  export type extracted_resourcesSelect = {
    id?: boolean
    created_at?: boolean
    updated_at?: boolean
    resource_path?: boolean
    filetype?: boolean
    feature?: boolean
    raw_resource_id?: boolean
    patient_id?: boolean
    session_id?: boolean
    sessions?: boolean | sessionsArgs
    extracted_resource_labels?: boolean | extracted_resource_labelsFindManyArgs
    _count?: boolean | Extracted_resourcesCountOutputTypeArgs
  }

  export type extracted_resourcesInclude = {
    sessions?: boolean | sessionsArgs
    extracted_resource_labels?: boolean | extracted_resource_labelsFindManyArgs
    _count?: boolean | Extracted_resourcesCountOutputTypeArgs
  }

  export type extracted_resourcesGetPayload<
    S extends boolean | null | undefined | extracted_resourcesArgs,
    U = keyof S
      > = S extends true
        ? extracted_resources
    : S extends undefined
    ? never
    : S extends extracted_resourcesArgs | extracted_resourcesFindManyArgs
    ?'include' extends U
    ? extracted_resources  & {
    [P in TrueKeys<S['include']>]:
        P extends 'sessions' ? sessionsGetPayload<Exclude<S['include'], undefined | null>[P]> | null :
        P extends 'extracted_resource_labels' ? Array < extracted_resource_labelsGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends '_count' ? Extracted_resourcesCountOutputTypeGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'sessions' ? sessionsGetPayload<Exclude<S['select'], undefined | null>[P]> | null :
        P extends 'extracted_resource_labels' ? Array < extracted_resource_labelsGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends '_count' ? Extracted_resourcesCountOutputTypeGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof extracted_resources ? extracted_resources[P] : never
  } 
    : extracted_resources
  : extracted_resources


  type extracted_resourcesCountArgs = Merge<
    Omit<extracted_resourcesFindManyArgs, 'select' | 'include'> & {
      select?: Extracted_resourcesCountAggregateInputType | true
    }
  >

  export interface extracted_resourcesDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one Extracted_resources that matches the filter.
     * @param {extracted_resourcesFindUniqueArgs} args - Arguments to find a Extracted_resources
     * @example
     * // Get one Extracted_resources
     * const extracted_resources = await prisma.extracted_resources.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends extracted_resourcesFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, extracted_resourcesFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'extracted_resources'> extends True ? CheckSelect<T, Prisma__extracted_resourcesClient<extracted_resources>, Prisma__extracted_resourcesClient<extracted_resourcesGetPayload<T>>> : CheckSelect<T, Prisma__extracted_resourcesClient<extracted_resources | null, null>, Prisma__extracted_resourcesClient<extracted_resourcesGetPayload<T> | null, null>>

    /**
     * Find the first Extracted_resources that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {extracted_resourcesFindFirstArgs} args - Arguments to find a Extracted_resources
     * @example
     * // Get one Extracted_resources
     * const extracted_resources = await prisma.extracted_resources.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends extracted_resourcesFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, extracted_resourcesFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'extracted_resources'> extends True ? CheckSelect<T, Prisma__extracted_resourcesClient<extracted_resources>, Prisma__extracted_resourcesClient<extracted_resourcesGetPayload<T>>> : CheckSelect<T, Prisma__extracted_resourcesClient<extracted_resources | null, null>, Prisma__extracted_resourcesClient<extracted_resourcesGetPayload<T> | null, null>>

    /**
     * Find zero or more Extracted_resources that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {extracted_resourcesFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Extracted_resources
     * const extracted_resources = await prisma.extracted_resources.findMany()
     * 
     * // Get first 10 Extracted_resources
     * const extracted_resources = await prisma.extracted_resources.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const extracted_resourcesWithIdOnly = await prisma.extracted_resources.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends extracted_resourcesFindManyArgs>(
      args?: SelectSubset<T, extracted_resourcesFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<extracted_resources>>, PrismaPromise<Array<extracted_resourcesGetPayload<T>>>>

    /**
     * Create a Extracted_resources.
     * @param {extracted_resourcesCreateArgs} args - Arguments to create a Extracted_resources.
     * @example
     * // Create one Extracted_resources
     * const Extracted_resources = await prisma.extracted_resources.create({
     *   data: {
     *     // ... data to create a Extracted_resources
     *   }
     * })
     * 
    **/
    create<T extends extracted_resourcesCreateArgs>(
      args: SelectSubset<T, extracted_resourcesCreateArgs>
    ): CheckSelect<T, Prisma__extracted_resourcesClient<extracted_resources>, Prisma__extracted_resourcesClient<extracted_resourcesGetPayload<T>>>

    /**
     * Create many Extracted_resources.
     *     @param {extracted_resourcesCreateManyArgs} args - Arguments to create many Extracted_resources.
     *     @example
     *     // Create many Extracted_resources
     *     const extracted_resources = await prisma.extracted_resources.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends extracted_resourcesCreateManyArgs>(
      args?: SelectSubset<T, extracted_resourcesCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Extracted_resources.
     * @param {extracted_resourcesDeleteArgs} args - Arguments to delete one Extracted_resources.
     * @example
     * // Delete one Extracted_resources
     * const Extracted_resources = await prisma.extracted_resources.delete({
     *   where: {
     *     // ... filter to delete one Extracted_resources
     *   }
     * })
     * 
    **/
    delete<T extends extracted_resourcesDeleteArgs>(
      args: SelectSubset<T, extracted_resourcesDeleteArgs>
    ): CheckSelect<T, Prisma__extracted_resourcesClient<extracted_resources>, Prisma__extracted_resourcesClient<extracted_resourcesGetPayload<T>>>

    /**
     * Update one Extracted_resources.
     * @param {extracted_resourcesUpdateArgs} args - Arguments to update one Extracted_resources.
     * @example
     * // Update one Extracted_resources
     * const extracted_resources = await prisma.extracted_resources.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends extracted_resourcesUpdateArgs>(
      args: SelectSubset<T, extracted_resourcesUpdateArgs>
    ): CheckSelect<T, Prisma__extracted_resourcesClient<extracted_resources>, Prisma__extracted_resourcesClient<extracted_resourcesGetPayload<T>>>

    /**
     * Delete zero or more Extracted_resources.
     * @param {extracted_resourcesDeleteManyArgs} args - Arguments to filter Extracted_resources to delete.
     * @example
     * // Delete a few Extracted_resources
     * const { count } = await prisma.extracted_resources.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends extracted_resourcesDeleteManyArgs>(
      args?: SelectSubset<T, extracted_resourcesDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Extracted_resources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {extracted_resourcesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Extracted_resources
     * const extracted_resources = await prisma.extracted_resources.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends extracted_resourcesUpdateManyArgs>(
      args: SelectSubset<T, extracted_resourcesUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Extracted_resources.
     * @param {extracted_resourcesUpsertArgs} args - Arguments to update or create a Extracted_resources.
     * @example
     * // Update or create a Extracted_resources
     * const extracted_resources = await prisma.extracted_resources.upsert({
     *   create: {
     *     // ... data to create a Extracted_resources
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Extracted_resources we want to update
     *   }
     * })
    **/
    upsert<T extends extracted_resourcesUpsertArgs>(
      args: SelectSubset<T, extracted_resourcesUpsertArgs>
    ): CheckSelect<T, Prisma__extracted_resourcesClient<extracted_resources>, Prisma__extracted_resourcesClient<extracted_resourcesGetPayload<T>>>

    /**
     * Find one Extracted_resources that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {extracted_resourcesFindUniqueOrThrowArgs} args - Arguments to find a Extracted_resources
     * @example
     * // Get one Extracted_resources
     * const extracted_resources = await prisma.extracted_resources.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends extracted_resourcesFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, extracted_resourcesFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__extracted_resourcesClient<extracted_resources>, Prisma__extracted_resourcesClient<extracted_resourcesGetPayload<T>>>

    /**
     * Find the first Extracted_resources that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {extracted_resourcesFindFirstOrThrowArgs} args - Arguments to find a Extracted_resources
     * @example
     * // Get one Extracted_resources
     * const extracted_resources = await prisma.extracted_resources.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends extracted_resourcesFindFirstOrThrowArgs>(
      args?: SelectSubset<T, extracted_resourcesFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__extracted_resourcesClient<extracted_resources>, Prisma__extracted_resourcesClient<extracted_resourcesGetPayload<T>>>

    /**
     * Count the number of Extracted_resources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {extracted_resourcesCountArgs} args - Arguments to filter Extracted_resources to count.
     * @example
     * // Count the number of Extracted_resources
     * const count = await prisma.extracted_resources.count({
     *   where: {
     *     // ... the filter for the Extracted_resources we want to count
     *   }
     * })
    **/
    count<T extends extracted_resourcesCountArgs>(
      args?: Subset<T, extracted_resourcesCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Extracted_resourcesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Extracted_resources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Extracted_resourcesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Extracted_resourcesAggregateArgs>(args: Subset<T, Extracted_resourcesAggregateArgs>): PrismaPromise<GetExtracted_resourcesAggregateType<T>>

    /**
     * Group by Extracted_resources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Extracted_resourcesGroupByArgs} args - Group by arguments.
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
      T extends Extracted_resourcesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: Extracted_resourcesGroupByArgs['orderBy'] }
        : { orderBy?: Extracted_resourcesGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, Extracted_resourcesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExtracted_resourcesGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for extracted_resources.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__extracted_resourcesClient<T, Null = never> implements PrismaPromise<T> {
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

    sessions<T extends sessionsArgs = {}>(args?: Subset<T, sessionsArgs>): CheckSelect<T, Prisma__sessionsClient<sessions | Null>, Prisma__sessionsClient<sessionsGetPayload<T> | Null>>;

    extracted_resource_labels<T extends extracted_resource_labelsFindManyArgs = {}>(args?: Subset<T, extracted_resource_labelsFindManyArgs>): CheckSelect<T, PrismaPromise<Array<extracted_resource_labels>| Null>, PrismaPromise<Array<extracted_resource_labelsGetPayload<T>>| Null>>;

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
   * extracted_resources base type for findUnique actions
   */
  export type extracted_resourcesFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the extracted_resources
     * 
    **/
    select?: extracted_resourcesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: extracted_resourcesInclude | null
    /**
     * Filter, which extracted_resources to fetch.
     * 
    **/
    where: extracted_resourcesWhereUniqueInput
  }

  /**
   * extracted_resources: findUnique
   */
  export interface extracted_resourcesFindUniqueArgs extends extracted_resourcesFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * extracted_resources base type for findFirst actions
   */
  export type extracted_resourcesFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the extracted_resources
     * 
    **/
    select?: extracted_resourcesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: extracted_resourcesInclude | null
    /**
     * Filter, which extracted_resources to fetch.
     * 
    **/
    where?: extracted_resourcesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of extracted_resources to fetch.
     * 
    **/
    orderBy?: Enumerable<extracted_resourcesOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for extracted_resources.
     * 
    **/
    cursor?: extracted_resourcesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` extracted_resources from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` extracted_resources.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of extracted_resources.
     * 
    **/
    distinct?: Enumerable<Extracted_resourcesScalarFieldEnum>
  }

  /**
   * extracted_resources: findFirst
   */
  export interface extracted_resourcesFindFirstArgs extends extracted_resourcesFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * extracted_resources findMany
   */
  export type extracted_resourcesFindManyArgs = {
    /**
     * Select specific fields to fetch from the extracted_resources
     * 
    **/
    select?: extracted_resourcesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: extracted_resourcesInclude | null
    /**
     * Filter, which extracted_resources to fetch.
     * 
    **/
    where?: extracted_resourcesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of extracted_resources to fetch.
     * 
    **/
    orderBy?: Enumerable<extracted_resourcesOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing extracted_resources.
     * 
    **/
    cursor?: extracted_resourcesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` extracted_resources from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` extracted_resources.
     * 
    **/
    skip?: number
    distinct?: Enumerable<Extracted_resourcesScalarFieldEnum>
  }


  /**
   * extracted_resources create
   */
  export type extracted_resourcesCreateArgs = {
    /**
     * Select specific fields to fetch from the extracted_resources
     * 
    **/
    select?: extracted_resourcesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: extracted_resourcesInclude | null
    /**
     * The data needed to create a extracted_resources.
     * 
    **/
    data: XOR<extracted_resourcesCreateInput, extracted_resourcesUncheckedCreateInput>
  }


  /**
   * extracted_resources createMany
   */
  export type extracted_resourcesCreateManyArgs = {
    /**
     * The data used to create many extracted_resources.
     * 
    **/
    data: Enumerable<extracted_resourcesCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * extracted_resources update
   */
  export type extracted_resourcesUpdateArgs = {
    /**
     * Select specific fields to fetch from the extracted_resources
     * 
    **/
    select?: extracted_resourcesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: extracted_resourcesInclude | null
    /**
     * The data needed to update a extracted_resources.
     * 
    **/
    data: XOR<extracted_resourcesUpdateInput, extracted_resourcesUncheckedUpdateInput>
    /**
     * Choose, which extracted_resources to update.
     * 
    **/
    where: extracted_resourcesWhereUniqueInput
  }


  /**
   * extracted_resources updateMany
   */
  export type extracted_resourcesUpdateManyArgs = {
    /**
     * The data used to update extracted_resources.
     * 
    **/
    data: XOR<extracted_resourcesUpdateManyMutationInput, extracted_resourcesUncheckedUpdateManyInput>
    /**
     * Filter which extracted_resources to update
     * 
    **/
    where?: extracted_resourcesWhereInput
  }


  /**
   * extracted_resources upsert
   */
  export type extracted_resourcesUpsertArgs = {
    /**
     * Select specific fields to fetch from the extracted_resources
     * 
    **/
    select?: extracted_resourcesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: extracted_resourcesInclude | null
    /**
     * The filter to search for the extracted_resources to update in case it exists.
     * 
    **/
    where: extracted_resourcesWhereUniqueInput
    /**
     * In case the extracted_resources found by the `where` argument doesn't exist, create a new extracted_resources with this data.
     * 
    **/
    create: XOR<extracted_resourcesCreateInput, extracted_resourcesUncheckedCreateInput>
    /**
     * In case the extracted_resources was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<extracted_resourcesUpdateInput, extracted_resourcesUncheckedUpdateInput>
  }


  /**
   * extracted_resources delete
   */
  export type extracted_resourcesDeleteArgs = {
    /**
     * Select specific fields to fetch from the extracted_resources
     * 
    **/
    select?: extracted_resourcesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: extracted_resourcesInclude | null
    /**
     * Filter which extracted_resources to delete.
     * 
    **/
    where: extracted_resourcesWhereUniqueInput
  }


  /**
   * extracted_resources deleteMany
   */
  export type extracted_resourcesDeleteManyArgs = {
    /**
     * Filter which extracted_resources to delete
     * 
    **/
    where?: extracted_resourcesWhereInput
  }


  /**
   * extracted_resources: findUniqueOrThrow
   */
  export type extracted_resourcesFindUniqueOrThrowArgs = extracted_resourcesFindUniqueArgsBase
      

  /**
   * extracted_resources: findFirstOrThrow
   */
  export type extracted_resourcesFindFirstOrThrowArgs = extracted_resourcesFindFirstArgsBase
      

  /**
   * extracted_resources without action
   */
  export type extracted_resourcesArgs = {
    /**
     * Select specific fields to fetch from the extracted_resources
     * 
    **/
    select?: extracted_resourcesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: extracted_resourcesInclude | null
  }



  /**
   * Model labels
   */


  export type AggregateLabels = {
    _count: LabelsCountAggregateOutputType | null
    _min: LabelsMinAggregateOutputType | null
    _max: LabelsMaxAggregateOutputType | null
  }

  export type LabelsMinAggregateOutputType = {
    id: string | null
    created_at: Date | null
    updated_at: Date | null
    name: string | null
    abbreviation: string | null
  }

  export type LabelsMaxAggregateOutputType = {
    id: string | null
    created_at: Date | null
    updated_at: Date | null
    name: string | null
    abbreviation: string | null
  }

  export type LabelsCountAggregateOutputType = {
    id: number
    created_at: number
    updated_at: number
    name: number
    abbreviation: number
    _all: number
  }


  export type LabelsMinAggregateInputType = {
    id?: true
    created_at?: true
    updated_at?: true
    name?: true
    abbreviation?: true
  }

  export type LabelsMaxAggregateInputType = {
    id?: true
    created_at?: true
    updated_at?: true
    name?: true
    abbreviation?: true
  }

  export type LabelsCountAggregateInputType = {
    id?: true
    created_at?: true
    updated_at?: true
    name?: true
    abbreviation?: true
    _all?: true
  }

  export type LabelsAggregateArgs = {
    /**
     * Filter which labels to aggregate.
     * 
    **/
    where?: labelsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of labels to fetch.
     * 
    **/
    orderBy?: Enumerable<labelsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: labelsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` labels from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` labels.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned labels
    **/
    _count?: true | LabelsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LabelsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LabelsMaxAggregateInputType
  }

  export type GetLabelsAggregateType<T extends LabelsAggregateArgs> = {
        [P in keyof T & keyof AggregateLabels]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLabels[P]>
      : GetScalarType<T[P], AggregateLabels[P]>
  }




  export type LabelsGroupByArgs = {
    where?: labelsWhereInput
    orderBy?: Enumerable<labelsOrderByWithAggregationInput>
    by: Array<LabelsScalarFieldEnum>
    having?: labelsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LabelsCountAggregateInputType | true
    _min?: LabelsMinAggregateInputType
    _max?: LabelsMaxAggregateInputType
  }


  export type LabelsGroupByOutputType = {
    id: string
    created_at: Date | null
    updated_at: Date | null
    name: string
    abbreviation: string
    _count: LabelsCountAggregateOutputType | null
    _min: LabelsMinAggregateOutputType | null
    _max: LabelsMaxAggregateOutputType | null
  }

  type GetLabelsGroupByPayload<T extends LabelsGroupByArgs> = PrismaPromise<
    Array<
      PickArray<LabelsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LabelsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LabelsGroupByOutputType[P]>
            : GetScalarType<T[P], LabelsGroupByOutputType[P]>
        }
      >
    >


  export type labelsSelect = {
    id?: boolean
    created_at?: boolean
    updated_at?: boolean
    name?: boolean
    abbreviation?: boolean
    extracted_resource_labels?: boolean | extracted_resource_labelsFindManyArgs
    session_labels?: boolean | session_labelsFindManyArgs
    _count?: boolean | LabelsCountOutputTypeArgs
  }

  export type labelsInclude = {
    extracted_resource_labels?: boolean | extracted_resource_labelsFindManyArgs
    session_labels?: boolean | session_labelsFindManyArgs
    _count?: boolean | LabelsCountOutputTypeArgs
  }

  export type labelsGetPayload<
    S extends boolean | null | undefined | labelsArgs,
    U = keyof S
      > = S extends true
        ? labels
    : S extends undefined
    ? never
    : S extends labelsArgs | labelsFindManyArgs
    ?'include' extends U
    ? labels  & {
    [P in TrueKeys<S['include']>]:
        P extends 'extracted_resource_labels' ? Array < extracted_resource_labelsGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends 'session_labels' ? Array < session_labelsGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends '_count' ? LabelsCountOutputTypeGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'extracted_resource_labels' ? Array < extracted_resource_labelsGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends 'session_labels' ? Array < session_labelsGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends '_count' ? LabelsCountOutputTypeGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof labels ? labels[P] : never
  } 
    : labels
  : labels


  type labelsCountArgs = Merge<
    Omit<labelsFindManyArgs, 'select' | 'include'> & {
      select?: LabelsCountAggregateInputType | true
    }
  >

  export interface labelsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one Labels that matches the filter.
     * @param {labelsFindUniqueArgs} args - Arguments to find a Labels
     * @example
     * // Get one Labels
     * const labels = await prisma.labels.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends labelsFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, labelsFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'labels'> extends True ? CheckSelect<T, Prisma__labelsClient<labels>, Prisma__labelsClient<labelsGetPayload<T>>> : CheckSelect<T, Prisma__labelsClient<labels | null, null>, Prisma__labelsClient<labelsGetPayload<T> | null, null>>

    /**
     * Find the first Labels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {labelsFindFirstArgs} args - Arguments to find a Labels
     * @example
     * // Get one Labels
     * const labels = await prisma.labels.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends labelsFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, labelsFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'labels'> extends True ? CheckSelect<T, Prisma__labelsClient<labels>, Prisma__labelsClient<labelsGetPayload<T>>> : CheckSelect<T, Prisma__labelsClient<labels | null, null>, Prisma__labelsClient<labelsGetPayload<T> | null, null>>

    /**
     * Find zero or more Labels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {labelsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Labels
     * const labels = await prisma.labels.findMany()
     * 
     * // Get first 10 Labels
     * const labels = await prisma.labels.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const labelsWithIdOnly = await prisma.labels.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends labelsFindManyArgs>(
      args?: SelectSubset<T, labelsFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<labels>>, PrismaPromise<Array<labelsGetPayload<T>>>>

    /**
     * Create a Labels.
     * @param {labelsCreateArgs} args - Arguments to create a Labels.
     * @example
     * // Create one Labels
     * const Labels = await prisma.labels.create({
     *   data: {
     *     // ... data to create a Labels
     *   }
     * })
     * 
    **/
    create<T extends labelsCreateArgs>(
      args: SelectSubset<T, labelsCreateArgs>
    ): CheckSelect<T, Prisma__labelsClient<labels>, Prisma__labelsClient<labelsGetPayload<T>>>

    /**
     * Create many Labels.
     *     @param {labelsCreateManyArgs} args - Arguments to create many Labels.
     *     @example
     *     // Create many Labels
     *     const labels = await prisma.labels.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends labelsCreateManyArgs>(
      args?: SelectSubset<T, labelsCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Labels.
     * @param {labelsDeleteArgs} args - Arguments to delete one Labels.
     * @example
     * // Delete one Labels
     * const Labels = await prisma.labels.delete({
     *   where: {
     *     // ... filter to delete one Labels
     *   }
     * })
     * 
    **/
    delete<T extends labelsDeleteArgs>(
      args: SelectSubset<T, labelsDeleteArgs>
    ): CheckSelect<T, Prisma__labelsClient<labels>, Prisma__labelsClient<labelsGetPayload<T>>>

    /**
     * Update one Labels.
     * @param {labelsUpdateArgs} args - Arguments to update one Labels.
     * @example
     * // Update one Labels
     * const labels = await prisma.labels.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends labelsUpdateArgs>(
      args: SelectSubset<T, labelsUpdateArgs>
    ): CheckSelect<T, Prisma__labelsClient<labels>, Prisma__labelsClient<labelsGetPayload<T>>>

    /**
     * Delete zero or more Labels.
     * @param {labelsDeleteManyArgs} args - Arguments to filter Labels to delete.
     * @example
     * // Delete a few Labels
     * const { count } = await prisma.labels.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends labelsDeleteManyArgs>(
      args?: SelectSubset<T, labelsDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Labels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {labelsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Labels
     * const labels = await prisma.labels.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends labelsUpdateManyArgs>(
      args: SelectSubset<T, labelsUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Labels.
     * @param {labelsUpsertArgs} args - Arguments to update or create a Labels.
     * @example
     * // Update or create a Labels
     * const labels = await prisma.labels.upsert({
     *   create: {
     *     // ... data to create a Labels
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Labels we want to update
     *   }
     * })
    **/
    upsert<T extends labelsUpsertArgs>(
      args: SelectSubset<T, labelsUpsertArgs>
    ): CheckSelect<T, Prisma__labelsClient<labels>, Prisma__labelsClient<labelsGetPayload<T>>>

    /**
     * Find one Labels that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {labelsFindUniqueOrThrowArgs} args - Arguments to find a Labels
     * @example
     * // Get one Labels
     * const labels = await prisma.labels.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends labelsFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, labelsFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__labelsClient<labels>, Prisma__labelsClient<labelsGetPayload<T>>>

    /**
     * Find the first Labels that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {labelsFindFirstOrThrowArgs} args - Arguments to find a Labels
     * @example
     * // Get one Labels
     * const labels = await prisma.labels.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends labelsFindFirstOrThrowArgs>(
      args?: SelectSubset<T, labelsFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__labelsClient<labels>, Prisma__labelsClient<labelsGetPayload<T>>>

    /**
     * Count the number of Labels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {labelsCountArgs} args - Arguments to filter Labels to count.
     * @example
     * // Count the number of Labels
     * const count = await prisma.labels.count({
     *   where: {
     *     // ... the filter for the Labels we want to count
     *   }
     * })
    **/
    count<T extends labelsCountArgs>(
      args?: Subset<T, labelsCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LabelsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Labels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabelsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends LabelsAggregateArgs>(args: Subset<T, LabelsAggregateArgs>): PrismaPromise<GetLabelsAggregateType<T>>

    /**
     * Group by Labels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabelsGroupByArgs} args - Group by arguments.
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
      T extends LabelsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LabelsGroupByArgs['orderBy'] }
        : { orderBy?: LabelsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, LabelsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLabelsGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for labels.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__labelsClient<T, Null = never> implements PrismaPromise<T> {
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

    extracted_resource_labels<T extends extracted_resource_labelsFindManyArgs = {}>(args?: Subset<T, extracted_resource_labelsFindManyArgs>): CheckSelect<T, PrismaPromise<Array<extracted_resource_labels>| Null>, PrismaPromise<Array<extracted_resource_labelsGetPayload<T>>| Null>>;

    session_labels<T extends session_labelsFindManyArgs = {}>(args?: Subset<T, session_labelsFindManyArgs>): CheckSelect<T, PrismaPromise<Array<session_labels>| Null>, PrismaPromise<Array<session_labelsGetPayload<T>>| Null>>;

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
   * labels base type for findUnique actions
   */
  export type labelsFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the labels
     * 
    **/
    select?: labelsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: labelsInclude | null
    /**
     * Filter, which labels to fetch.
     * 
    **/
    where: labelsWhereUniqueInput
  }

  /**
   * labels: findUnique
   */
  export interface labelsFindUniqueArgs extends labelsFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * labels base type for findFirst actions
   */
  export type labelsFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the labels
     * 
    **/
    select?: labelsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: labelsInclude | null
    /**
     * Filter, which labels to fetch.
     * 
    **/
    where?: labelsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of labels to fetch.
     * 
    **/
    orderBy?: Enumerable<labelsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for labels.
     * 
    **/
    cursor?: labelsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` labels from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` labels.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of labels.
     * 
    **/
    distinct?: Enumerable<LabelsScalarFieldEnum>
  }

  /**
   * labels: findFirst
   */
  export interface labelsFindFirstArgs extends labelsFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * labels findMany
   */
  export type labelsFindManyArgs = {
    /**
     * Select specific fields to fetch from the labels
     * 
    **/
    select?: labelsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: labelsInclude | null
    /**
     * Filter, which labels to fetch.
     * 
    **/
    where?: labelsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of labels to fetch.
     * 
    **/
    orderBy?: Enumerable<labelsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing labels.
     * 
    **/
    cursor?: labelsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` labels from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` labels.
     * 
    **/
    skip?: number
    distinct?: Enumerable<LabelsScalarFieldEnum>
  }


  /**
   * labels create
   */
  export type labelsCreateArgs = {
    /**
     * Select specific fields to fetch from the labels
     * 
    **/
    select?: labelsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: labelsInclude | null
    /**
     * The data needed to create a labels.
     * 
    **/
    data: XOR<labelsCreateInput, labelsUncheckedCreateInput>
  }


  /**
   * labels createMany
   */
  export type labelsCreateManyArgs = {
    /**
     * The data used to create many labels.
     * 
    **/
    data: Enumerable<labelsCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * labels update
   */
  export type labelsUpdateArgs = {
    /**
     * Select specific fields to fetch from the labels
     * 
    **/
    select?: labelsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: labelsInclude | null
    /**
     * The data needed to update a labels.
     * 
    **/
    data: XOR<labelsUpdateInput, labelsUncheckedUpdateInput>
    /**
     * Choose, which labels to update.
     * 
    **/
    where: labelsWhereUniqueInput
  }


  /**
   * labels updateMany
   */
  export type labelsUpdateManyArgs = {
    /**
     * The data used to update labels.
     * 
    **/
    data: XOR<labelsUpdateManyMutationInput, labelsUncheckedUpdateManyInput>
    /**
     * Filter which labels to update
     * 
    **/
    where?: labelsWhereInput
  }


  /**
   * labels upsert
   */
  export type labelsUpsertArgs = {
    /**
     * Select specific fields to fetch from the labels
     * 
    **/
    select?: labelsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: labelsInclude | null
    /**
     * The filter to search for the labels to update in case it exists.
     * 
    **/
    where: labelsWhereUniqueInput
    /**
     * In case the labels found by the `where` argument doesn't exist, create a new labels with this data.
     * 
    **/
    create: XOR<labelsCreateInput, labelsUncheckedCreateInput>
    /**
     * In case the labels was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<labelsUpdateInput, labelsUncheckedUpdateInput>
  }


  /**
   * labels delete
   */
  export type labelsDeleteArgs = {
    /**
     * Select specific fields to fetch from the labels
     * 
    **/
    select?: labelsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: labelsInclude | null
    /**
     * Filter which labels to delete.
     * 
    **/
    where: labelsWhereUniqueInput
  }


  /**
   * labels deleteMany
   */
  export type labelsDeleteManyArgs = {
    /**
     * Filter which labels to delete
     * 
    **/
    where?: labelsWhereInput
  }


  /**
   * labels: findUniqueOrThrow
   */
  export type labelsFindUniqueOrThrowArgs = labelsFindUniqueArgsBase
      

  /**
   * labels: findFirstOrThrow
   */
  export type labelsFindFirstOrThrowArgs = labelsFindFirstArgsBase
      

  /**
   * labels without action
   */
  export type labelsArgs = {
    /**
     * Select specific fields to fetch from the labels
     * 
    **/
    select?: labelsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: labelsInclude | null
  }



  /**
   * Model session_labels
   */


  export type AggregateSession_labels = {
    _count: Session_labelsCountAggregateOutputType | null
    _min: Session_labelsMinAggregateOutputType | null
    _max: Session_labelsMaxAggregateOutputType | null
  }

  export type Session_labelsMinAggregateOutputType = {
    session_id: string | null
    label_id: string | null
  }

  export type Session_labelsMaxAggregateOutputType = {
    session_id: string | null
    label_id: string | null
  }

  export type Session_labelsCountAggregateOutputType = {
    session_id: number
    label_id: number
    _all: number
  }


  export type Session_labelsMinAggregateInputType = {
    session_id?: true
    label_id?: true
  }

  export type Session_labelsMaxAggregateInputType = {
    session_id?: true
    label_id?: true
  }

  export type Session_labelsCountAggregateInputType = {
    session_id?: true
    label_id?: true
    _all?: true
  }

  export type Session_labelsAggregateArgs = {
    /**
     * Filter which session_labels to aggregate.
     * 
    **/
    where?: session_labelsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of session_labels to fetch.
     * 
    **/
    orderBy?: Enumerable<session_labelsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: session_labelsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` session_labels from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` session_labels.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned session_labels
    **/
    _count?: true | Session_labelsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Session_labelsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Session_labelsMaxAggregateInputType
  }

  export type GetSession_labelsAggregateType<T extends Session_labelsAggregateArgs> = {
        [P in keyof T & keyof AggregateSession_labels]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession_labels[P]>
      : GetScalarType<T[P], AggregateSession_labels[P]>
  }




  export type Session_labelsGroupByArgs = {
    where?: session_labelsWhereInput
    orderBy?: Enumerable<session_labelsOrderByWithAggregationInput>
    by: Array<Session_labelsScalarFieldEnum>
    having?: session_labelsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Session_labelsCountAggregateInputType | true
    _min?: Session_labelsMinAggregateInputType
    _max?: Session_labelsMaxAggregateInputType
  }


  export type Session_labelsGroupByOutputType = {
    session_id: string
    label_id: string
    _count: Session_labelsCountAggregateOutputType | null
    _min: Session_labelsMinAggregateOutputType | null
    _max: Session_labelsMaxAggregateOutputType | null
  }

  type GetSession_labelsGroupByPayload<T extends Session_labelsGroupByArgs> = PrismaPromise<
    Array<
      PickArray<Session_labelsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Session_labelsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Session_labelsGroupByOutputType[P]>
            : GetScalarType<T[P], Session_labelsGroupByOutputType[P]>
        }
      >
    >


  export type session_labelsSelect = {
    session_id?: boolean
    label_id?: boolean
    labels?: boolean | labelsArgs
    sessions?: boolean | sessionsArgs
  }

  export type session_labelsInclude = {
    labels?: boolean | labelsArgs
    sessions?: boolean | sessionsArgs
  }

  export type session_labelsGetPayload<
    S extends boolean | null | undefined | session_labelsArgs,
    U = keyof S
      > = S extends true
        ? session_labels
    : S extends undefined
    ? never
    : S extends session_labelsArgs | session_labelsFindManyArgs
    ?'include' extends U
    ? session_labels  & {
    [P in TrueKeys<S['include']>]:
        P extends 'labels' ? labelsGetPayload<Exclude<S['include'], undefined | null>[P]> :
        P extends 'sessions' ? sessionsGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'labels' ? labelsGetPayload<Exclude<S['select'], undefined | null>[P]> :
        P extends 'sessions' ? sessionsGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof session_labels ? session_labels[P] : never
  } 
    : session_labels
  : session_labels


  type session_labelsCountArgs = Merge<
    Omit<session_labelsFindManyArgs, 'select' | 'include'> & {
      select?: Session_labelsCountAggregateInputType | true
    }
  >

  export interface session_labelsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one Session_labels that matches the filter.
     * @param {session_labelsFindUniqueArgs} args - Arguments to find a Session_labels
     * @example
     * // Get one Session_labels
     * const session_labels = await prisma.session_labels.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends session_labelsFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, session_labelsFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'session_labels'> extends True ? CheckSelect<T, Prisma__session_labelsClient<session_labels>, Prisma__session_labelsClient<session_labelsGetPayload<T>>> : CheckSelect<T, Prisma__session_labelsClient<session_labels | null, null>, Prisma__session_labelsClient<session_labelsGetPayload<T> | null, null>>

    /**
     * Find the first Session_labels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {session_labelsFindFirstArgs} args - Arguments to find a Session_labels
     * @example
     * // Get one Session_labels
     * const session_labels = await prisma.session_labels.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends session_labelsFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, session_labelsFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'session_labels'> extends True ? CheckSelect<T, Prisma__session_labelsClient<session_labels>, Prisma__session_labelsClient<session_labelsGetPayload<T>>> : CheckSelect<T, Prisma__session_labelsClient<session_labels | null, null>, Prisma__session_labelsClient<session_labelsGetPayload<T> | null, null>>

    /**
     * Find zero or more Session_labels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {session_labelsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Session_labels
     * const session_labels = await prisma.session_labels.findMany()
     * 
     * // Get first 10 Session_labels
     * const session_labels = await prisma.session_labels.findMany({ take: 10 })
     * 
     * // Only select the `session_id`
     * const session_labelsWithSession_idOnly = await prisma.session_labels.findMany({ select: { session_id: true } })
     * 
    **/
    findMany<T extends session_labelsFindManyArgs>(
      args?: SelectSubset<T, session_labelsFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<session_labels>>, PrismaPromise<Array<session_labelsGetPayload<T>>>>

    /**
     * Create a Session_labels.
     * @param {session_labelsCreateArgs} args - Arguments to create a Session_labels.
     * @example
     * // Create one Session_labels
     * const Session_labels = await prisma.session_labels.create({
     *   data: {
     *     // ... data to create a Session_labels
     *   }
     * })
     * 
    **/
    create<T extends session_labelsCreateArgs>(
      args: SelectSubset<T, session_labelsCreateArgs>
    ): CheckSelect<T, Prisma__session_labelsClient<session_labels>, Prisma__session_labelsClient<session_labelsGetPayload<T>>>

    /**
     * Create many Session_labels.
     *     @param {session_labelsCreateManyArgs} args - Arguments to create many Session_labels.
     *     @example
     *     // Create many Session_labels
     *     const session_labels = await prisma.session_labels.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends session_labelsCreateManyArgs>(
      args?: SelectSubset<T, session_labelsCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Session_labels.
     * @param {session_labelsDeleteArgs} args - Arguments to delete one Session_labels.
     * @example
     * // Delete one Session_labels
     * const Session_labels = await prisma.session_labels.delete({
     *   where: {
     *     // ... filter to delete one Session_labels
     *   }
     * })
     * 
    **/
    delete<T extends session_labelsDeleteArgs>(
      args: SelectSubset<T, session_labelsDeleteArgs>
    ): CheckSelect<T, Prisma__session_labelsClient<session_labels>, Prisma__session_labelsClient<session_labelsGetPayload<T>>>

    /**
     * Update one Session_labels.
     * @param {session_labelsUpdateArgs} args - Arguments to update one Session_labels.
     * @example
     * // Update one Session_labels
     * const session_labels = await prisma.session_labels.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends session_labelsUpdateArgs>(
      args: SelectSubset<T, session_labelsUpdateArgs>
    ): CheckSelect<T, Prisma__session_labelsClient<session_labels>, Prisma__session_labelsClient<session_labelsGetPayload<T>>>

    /**
     * Delete zero or more Session_labels.
     * @param {session_labelsDeleteManyArgs} args - Arguments to filter Session_labels to delete.
     * @example
     * // Delete a few Session_labels
     * const { count } = await prisma.session_labels.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends session_labelsDeleteManyArgs>(
      args?: SelectSubset<T, session_labelsDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Session_labels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {session_labelsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Session_labels
     * const session_labels = await prisma.session_labels.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends session_labelsUpdateManyArgs>(
      args: SelectSubset<T, session_labelsUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Session_labels.
     * @param {session_labelsUpsertArgs} args - Arguments to update or create a Session_labels.
     * @example
     * // Update or create a Session_labels
     * const session_labels = await prisma.session_labels.upsert({
     *   create: {
     *     // ... data to create a Session_labels
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session_labels we want to update
     *   }
     * })
    **/
    upsert<T extends session_labelsUpsertArgs>(
      args: SelectSubset<T, session_labelsUpsertArgs>
    ): CheckSelect<T, Prisma__session_labelsClient<session_labels>, Prisma__session_labelsClient<session_labelsGetPayload<T>>>

    /**
     * Find one Session_labels that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {session_labelsFindUniqueOrThrowArgs} args - Arguments to find a Session_labels
     * @example
     * // Get one Session_labels
     * const session_labels = await prisma.session_labels.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends session_labelsFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, session_labelsFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__session_labelsClient<session_labels>, Prisma__session_labelsClient<session_labelsGetPayload<T>>>

    /**
     * Find the first Session_labels that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {session_labelsFindFirstOrThrowArgs} args - Arguments to find a Session_labels
     * @example
     * // Get one Session_labels
     * const session_labels = await prisma.session_labels.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends session_labelsFindFirstOrThrowArgs>(
      args?: SelectSubset<T, session_labelsFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__session_labelsClient<session_labels>, Prisma__session_labelsClient<session_labelsGetPayload<T>>>

    /**
     * Count the number of Session_labels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {session_labelsCountArgs} args - Arguments to filter Session_labels to count.
     * @example
     * // Count the number of Session_labels
     * const count = await prisma.session_labels.count({
     *   where: {
     *     // ... the filter for the Session_labels we want to count
     *   }
     * })
    **/
    count<T extends session_labelsCountArgs>(
      args?: Subset<T, session_labelsCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Session_labelsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session_labels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Session_labelsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Session_labelsAggregateArgs>(args: Subset<T, Session_labelsAggregateArgs>): PrismaPromise<GetSession_labelsAggregateType<T>>

    /**
     * Group by Session_labels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Session_labelsGroupByArgs} args - Group by arguments.
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
      T extends Session_labelsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: Session_labelsGroupByArgs['orderBy'] }
        : { orderBy?: Session_labelsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, Session_labelsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSession_labelsGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for session_labels.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__session_labelsClient<T, Null = never> implements PrismaPromise<T> {
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

    labels<T extends labelsArgs = {}>(args?: Subset<T, labelsArgs>): CheckSelect<T, Prisma__labelsClient<labels | Null>, Prisma__labelsClient<labelsGetPayload<T> | Null>>;

    sessions<T extends sessionsArgs = {}>(args?: Subset<T, sessionsArgs>): CheckSelect<T, Prisma__sessionsClient<sessions | Null>, Prisma__sessionsClient<sessionsGetPayload<T> | Null>>;

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
   * session_labels base type for findUnique actions
   */
  export type session_labelsFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the session_labels
     * 
    **/
    select?: session_labelsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: session_labelsInclude | null
    /**
     * Filter, which session_labels to fetch.
     * 
    **/
    where: session_labelsWhereUniqueInput
  }

  /**
   * session_labels: findUnique
   */
  export interface session_labelsFindUniqueArgs extends session_labelsFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * session_labels base type for findFirst actions
   */
  export type session_labelsFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the session_labels
     * 
    **/
    select?: session_labelsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: session_labelsInclude | null
    /**
     * Filter, which session_labels to fetch.
     * 
    **/
    where?: session_labelsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of session_labels to fetch.
     * 
    **/
    orderBy?: Enumerable<session_labelsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for session_labels.
     * 
    **/
    cursor?: session_labelsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` session_labels from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` session_labels.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of session_labels.
     * 
    **/
    distinct?: Enumerable<Session_labelsScalarFieldEnum>
  }

  /**
   * session_labels: findFirst
   */
  export interface session_labelsFindFirstArgs extends session_labelsFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * session_labels findMany
   */
  export type session_labelsFindManyArgs = {
    /**
     * Select specific fields to fetch from the session_labels
     * 
    **/
    select?: session_labelsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: session_labelsInclude | null
    /**
     * Filter, which session_labels to fetch.
     * 
    **/
    where?: session_labelsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of session_labels to fetch.
     * 
    **/
    orderBy?: Enumerable<session_labelsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing session_labels.
     * 
    **/
    cursor?: session_labelsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` session_labels from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` session_labels.
     * 
    **/
    skip?: number
    distinct?: Enumerable<Session_labelsScalarFieldEnum>
  }


  /**
   * session_labels create
   */
  export type session_labelsCreateArgs = {
    /**
     * Select specific fields to fetch from the session_labels
     * 
    **/
    select?: session_labelsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: session_labelsInclude | null
    /**
     * The data needed to create a session_labels.
     * 
    **/
    data: XOR<session_labelsCreateInput, session_labelsUncheckedCreateInput>
  }


  /**
   * session_labels createMany
   */
  export type session_labelsCreateManyArgs = {
    /**
     * The data used to create many session_labels.
     * 
    **/
    data: Enumerable<session_labelsCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * session_labels update
   */
  export type session_labelsUpdateArgs = {
    /**
     * Select specific fields to fetch from the session_labels
     * 
    **/
    select?: session_labelsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: session_labelsInclude | null
    /**
     * The data needed to update a session_labels.
     * 
    **/
    data: XOR<session_labelsUpdateInput, session_labelsUncheckedUpdateInput>
    /**
     * Choose, which session_labels to update.
     * 
    **/
    where: session_labelsWhereUniqueInput
  }


  /**
   * session_labels updateMany
   */
  export type session_labelsUpdateManyArgs = {
    /**
     * The data used to update session_labels.
     * 
    **/
    data: XOR<session_labelsUpdateManyMutationInput, session_labelsUncheckedUpdateManyInput>
    /**
     * Filter which session_labels to update
     * 
    **/
    where?: session_labelsWhereInput
  }


  /**
   * session_labels upsert
   */
  export type session_labelsUpsertArgs = {
    /**
     * Select specific fields to fetch from the session_labels
     * 
    **/
    select?: session_labelsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: session_labelsInclude | null
    /**
     * The filter to search for the session_labels to update in case it exists.
     * 
    **/
    where: session_labelsWhereUniqueInput
    /**
     * In case the session_labels found by the `where` argument doesn't exist, create a new session_labels with this data.
     * 
    **/
    create: XOR<session_labelsCreateInput, session_labelsUncheckedCreateInput>
    /**
     * In case the session_labels was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<session_labelsUpdateInput, session_labelsUncheckedUpdateInput>
  }


  /**
   * session_labels delete
   */
  export type session_labelsDeleteArgs = {
    /**
     * Select specific fields to fetch from the session_labels
     * 
    **/
    select?: session_labelsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: session_labelsInclude | null
    /**
     * Filter which session_labels to delete.
     * 
    **/
    where: session_labelsWhereUniqueInput
  }


  /**
   * session_labels deleteMany
   */
  export type session_labelsDeleteManyArgs = {
    /**
     * Filter which session_labels to delete
     * 
    **/
    where?: session_labelsWhereInput
  }


  /**
   * session_labels: findUniqueOrThrow
   */
  export type session_labelsFindUniqueOrThrowArgs = session_labelsFindUniqueArgsBase
      

  /**
   * session_labels: findFirstOrThrow
   */
  export type session_labelsFindFirstOrThrowArgs = session_labelsFindFirstArgsBase
      

  /**
   * session_labels without action
   */
  export type session_labelsArgs = {
    /**
     * Select specific fields to fetch from the session_labels
     * 
    **/
    select?: session_labelsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: session_labelsInclude | null
  }



  /**
   * Model sessions
   */


  export type AggregateSessions = {
    _count: SessionsCountAggregateOutputType | null
    _min: SessionsMinAggregateOutputType | null
    _max: SessionsMaxAggregateOutputType | null
  }

  export type SessionsMinAggregateOutputType = {
    id: string | null
    created_at: Date | null
    updated_at: Date | null
    name: string | null
    description: string | null
    user_id: string | null
  }

  export type SessionsMaxAggregateOutputType = {
    id: string | null
    created_at: Date | null
    updated_at: Date | null
    name: string | null
    description: string | null
    user_id: string | null
  }

  export type SessionsCountAggregateOutputType = {
    id: number
    created_at: number
    updated_at: number
    name: number
    description: number
    user_id: number
    _all: number
  }


  export type SessionsMinAggregateInputType = {
    id?: true
    created_at?: true
    updated_at?: true
    name?: true
    description?: true
    user_id?: true
  }

  export type SessionsMaxAggregateInputType = {
    id?: true
    created_at?: true
    updated_at?: true
    name?: true
    description?: true
    user_id?: true
  }

  export type SessionsCountAggregateInputType = {
    id?: true
    created_at?: true
    updated_at?: true
    name?: true
    description?: true
    user_id?: true
    _all?: true
  }

  export type SessionsAggregateArgs = {
    /**
     * Filter which sessions to aggregate.
     * 
    **/
    where?: sessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sessions to fetch.
     * 
    **/
    orderBy?: Enumerable<sessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: sessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sessions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned sessions
    **/
    _count?: true | SessionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionsMaxAggregateInputType
  }

  export type GetSessionsAggregateType<T extends SessionsAggregateArgs> = {
        [P in keyof T & keyof AggregateSessions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSessions[P]>
      : GetScalarType<T[P], AggregateSessions[P]>
  }




  export type SessionsGroupByArgs = {
    where?: sessionsWhereInput
    orderBy?: Enumerable<sessionsOrderByWithAggregationInput>
    by: Array<SessionsScalarFieldEnum>
    having?: sessionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionsCountAggregateInputType | true
    _min?: SessionsMinAggregateInputType
    _max?: SessionsMaxAggregateInputType
  }


  export type SessionsGroupByOutputType = {
    id: string
    created_at: Date | null
    updated_at: Date | null
    name: string
    description: string | null
    user_id: string
    _count: SessionsCountAggregateOutputType | null
    _min: SessionsMinAggregateOutputType | null
    _max: SessionsMaxAggregateOutputType | null
  }

  type GetSessionsGroupByPayload<T extends SessionsGroupByArgs> = PrismaPromise<
    Array<
      PickArray<SessionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionsGroupByOutputType[P]>
            : GetScalarType<T[P], SessionsGroupByOutputType[P]>
        }
      >
    >


  export type sessionsSelect = {
    id?: boolean
    created_at?: boolean
    updated_at?: boolean
    name?: boolean
    description?: boolean
    user_id?: boolean
    extracted_resources?: boolean | extracted_resourcesFindManyArgs
    session_labels?: boolean | session_labelsFindManyArgs
    _count?: boolean | SessionsCountOutputTypeArgs
  }

  export type sessionsInclude = {
    extracted_resources?: boolean | extracted_resourcesFindManyArgs
    session_labels?: boolean | session_labelsFindManyArgs
    _count?: boolean | SessionsCountOutputTypeArgs
  }

  export type sessionsGetPayload<
    S extends boolean | null | undefined | sessionsArgs,
    U = keyof S
      > = S extends true
        ? sessions
    : S extends undefined
    ? never
    : S extends sessionsArgs | sessionsFindManyArgs
    ?'include' extends U
    ? sessions  & {
    [P in TrueKeys<S['include']>]:
        P extends 'extracted_resources' ? Array < extracted_resourcesGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends 'session_labels' ? Array < session_labelsGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends '_count' ? SessionsCountOutputTypeGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'extracted_resources' ? Array < extracted_resourcesGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends 'session_labels' ? Array < session_labelsGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends '_count' ? SessionsCountOutputTypeGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof sessions ? sessions[P] : never
  } 
    : sessions
  : sessions


  type sessionsCountArgs = Merge<
    Omit<sessionsFindManyArgs, 'select' | 'include'> & {
      select?: SessionsCountAggregateInputType | true
    }
  >

  export interface sessionsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one Sessions that matches the filter.
     * @param {sessionsFindUniqueArgs} args - Arguments to find a Sessions
     * @example
     * // Get one Sessions
     * const sessions = await prisma.sessions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends sessionsFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, sessionsFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'sessions'> extends True ? CheckSelect<T, Prisma__sessionsClient<sessions>, Prisma__sessionsClient<sessionsGetPayload<T>>> : CheckSelect<T, Prisma__sessionsClient<sessions | null, null>, Prisma__sessionsClient<sessionsGetPayload<T> | null, null>>

    /**
     * Find the first Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sessionsFindFirstArgs} args - Arguments to find a Sessions
     * @example
     * // Get one Sessions
     * const sessions = await prisma.sessions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends sessionsFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, sessionsFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'sessions'> extends True ? CheckSelect<T, Prisma__sessionsClient<sessions>, Prisma__sessionsClient<sessionsGetPayload<T>>> : CheckSelect<T, Prisma__sessionsClient<sessions | null, null>, Prisma__sessionsClient<sessionsGetPayload<T> | null, null>>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sessionsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.sessions.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.sessions.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionsWithIdOnly = await prisma.sessions.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends sessionsFindManyArgs>(
      args?: SelectSubset<T, sessionsFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<sessions>>, PrismaPromise<Array<sessionsGetPayload<T>>>>

    /**
     * Create a Sessions.
     * @param {sessionsCreateArgs} args - Arguments to create a Sessions.
     * @example
     * // Create one Sessions
     * const Sessions = await prisma.sessions.create({
     *   data: {
     *     // ... data to create a Sessions
     *   }
     * })
     * 
    **/
    create<T extends sessionsCreateArgs>(
      args: SelectSubset<T, sessionsCreateArgs>
    ): CheckSelect<T, Prisma__sessionsClient<sessions>, Prisma__sessionsClient<sessionsGetPayload<T>>>

    /**
     * Create many Sessions.
     *     @param {sessionsCreateManyArgs} args - Arguments to create many Sessions.
     *     @example
     *     // Create many Sessions
     *     const sessions = await prisma.sessions.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends sessionsCreateManyArgs>(
      args?: SelectSubset<T, sessionsCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Sessions.
     * @param {sessionsDeleteArgs} args - Arguments to delete one Sessions.
     * @example
     * // Delete one Sessions
     * const Sessions = await prisma.sessions.delete({
     *   where: {
     *     // ... filter to delete one Sessions
     *   }
     * })
     * 
    **/
    delete<T extends sessionsDeleteArgs>(
      args: SelectSubset<T, sessionsDeleteArgs>
    ): CheckSelect<T, Prisma__sessionsClient<sessions>, Prisma__sessionsClient<sessionsGetPayload<T>>>

    /**
     * Update one Sessions.
     * @param {sessionsUpdateArgs} args - Arguments to update one Sessions.
     * @example
     * // Update one Sessions
     * const sessions = await prisma.sessions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends sessionsUpdateArgs>(
      args: SelectSubset<T, sessionsUpdateArgs>
    ): CheckSelect<T, Prisma__sessionsClient<sessions>, Prisma__sessionsClient<sessionsGetPayload<T>>>

    /**
     * Delete zero or more Sessions.
     * @param {sessionsDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.sessions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends sessionsDeleteManyArgs>(
      args?: SelectSubset<T, sessionsDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sessionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const sessions = await prisma.sessions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends sessionsUpdateManyArgs>(
      args: SelectSubset<T, sessionsUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Sessions.
     * @param {sessionsUpsertArgs} args - Arguments to update or create a Sessions.
     * @example
     * // Update or create a Sessions
     * const sessions = await prisma.sessions.upsert({
     *   create: {
     *     // ... data to create a Sessions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Sessions we want to update
     *   }
     * })
    **/
    upsert<T extends sessionsUpsertArgs>(
      args: SelectSubset<T, sessionsUpsertArgs>
    ): CheckSelect<T, Prisma__sessionsClient<sessions>, Prisma__sessionsClient<sessionsGetPayload<T>>>

    /**
     * Find one Sessions that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {sessionsFindUniqueOrThrowArgs} args - Arguments to find a Sessions
     * @example
     * // Get one Sessions
     * const sessions = await prisma.sessions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends sessionsFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, sessionsFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__sessionsClient<sessions>, Prisma__sessionsClient<sessionsGetPayload<T>>>

    /**
     * Find the first Sessions that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sessionsFindFirstOrThrowArgs} args - Arguments to find a Sessions
     * @example
     * // Get one Sessions
     * const sessions = await prisma.sessions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends sessionsFindFirstOrThrowArgs>(
      args?: SelectSubset<T, sessionsFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__sessionsClient<sessions>, Prisma__sessionsClient<sessionsGetPayload<T>>>

    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sessionsCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.sessions.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends sessionsCountArgs>(
      args?: Subset<T, sessionsCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SessionsAggregateArgs>(args: Subset<T, SessionsAggregateArgs>): PrismaPromise<GetSessionsAggregateType<T>>

    /**
     * Group by Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionsGroupByArgs} args - Group by arguments.
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
      T extends SessionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionsGroupByArgs['orderBy'] }
        : { orderBy?: SessionsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SessionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionsGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for sessions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__sessionsClient<T, Null = never> implements PrismaPromise<T> {
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

    extracted_resources<T extends extracted_resourcesFindManyArgs = {}>(args?: Subset<T, extracted_resourcesFindManyArgs>): CheckSelect<T, PrismaPromise<Array<extracted_resources>| Null>, PrismaPromise<Array<extracted_resourcesGetPayload<T>>| Null>>;

    session_labels<T extends session_labelsFindManyArgs = {}>(args?: Subset<T, session_labelsFindManyArgs>): CheckSelect<T, PrismaPromise<Array<session_labels>| Null>, PrismaPromise<Array<session_labelsGetPayload<T>>| Null>>;

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
   * sessions base type for findUnique actions
   */
  export type sessionsFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the sessions
     * 
    **/
    select?: sessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: sessionsInclude | null
    /**
     * Filter, which sessions to fetch.
     * 
    **/
    where: sessionsWhereUniqueInput
  }

  /**
   * sessions: findUnique
   */
  export interface sessionsFindUniqueArgs extends sessionsFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * sessions base type for findFirst actions
   */
  export type sessionsFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the sessions
     * 
    **/
    select?: sessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: sessionsInclude | null
    /**
     * Filter, which sessions to fetch.
     * 
    **/
    where?: sessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sessions to fetch.
     * 
    **/
    orderBy?: Enumerable<sessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for sessions.
     * 
    **/
    cursor?: sessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sessions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of sessions.
     * 
    **/
    distinct?: Enumerable<SessionsScalarFieldEnum>
  }

  /**
   * sessions: findFirst
   */
  export interface sessionsFindFirstArgs extends sessionsFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * sessions findMany
   */
  export type sessionsFindManyArgs = {
    /**
     * Select specific fields to fetch from the sessions
     * 
    **/
    select?: sessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: sessionsInclude | null
    /**
     * Filter, which sessions to fetch.
     * 
    **/
    where?: sessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sessions to fetch.
     * 
    **/
    orderBy?: Enumerable<sessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing sessions.
     * 
    **/
    cursor?: sessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sessions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sessions.
     * 
    **/
    skip?: number
    distinct?: Enumerable<SessionsScalarFieldEnum>
  }


  /**
   * sessions create
   */
  export type sessionsCreateArgs = {
    /**
     * Select specific fields to fetch from the sessions
     * 
    **/
    select?: sessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: sessionsInclude | null
    /**
     * The data needed to create a sessions.
     * 
    **/
    data: XOR<sessionsCreateInput, sessionsUncheckedCreateInput>
  }


  /**
   * sessions createMany
   */
  export type sessionsCreateManyArgs = {
    /**
     * The data used to create many sessions.
     * 
    **/
    data: Enumerable<sessionsCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * sessions update
   */
  export type sessionsUpdateArgs = {
    /**
     * Select specific fields to fetch from the sessions
     * 
    **/
    select?: sessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: sessionsInclude | null
    /**
     * The data needed to update a sessions.
     * 
    **/
    data: XOR<sessionsUpdateInput, sessionsUncheckedUpdateInput>
    /**
     * Choose, which sessions to update.
     * 
    **/
    where: sessionsWhereUniqueInput
  }


  /**
   * sessions updateMany
   */
  export type sessionsUpdateManyArgs = {
    /**
     * The data used to update sessions.
     * 
    **/
    data: XOR<sessionsUpdateManyMutationInput, sessionsUncheckedUpdateManyInput>
    /**
     * Filter which sessions to update
     * 
    **/
    where?: sessionsWhereInput
  }


  /**
   * sessions upsert
   */
  export type sessionsUpsertArgs = {
    /**
     * Select specific fields to fetch from the sessions
     * 
    **/
    select?: sessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: sessionsInclude | null
    /**
     * The filter to search for the sessions to update in case it exists.
     * 
    **/
    where: sessionsWhereUniqueInput
    /**
     * In case the sessions found by the `where` argument doesn't exist, create a new sessions with this data.
     * 
    **/
    create: XOR<sessionsCreateInput, sessionsUncheckedCreateInput>
    /**
     * In case the sessions was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<sessionsUpdateInput, sessionsUncheckedUpdateInput>
  }


  /**
   * sessions delete
   */
  export type sessionsDeleteArgs = {
    /**
     * Select specific fields to fetch from the sessions
     * 
    **/
    select?: sessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: sessionsInclude | null
    /**
     * Filter which sessions to delete.
     * 
    **/
    where: sessionsWhereUniqueInput
  }


  /**
   * sessions deleteMany
   */
  export type sessionsDeleteManyArgs = {
    /**
     * Filter which sessions to delete
     * 
    **/
    where?: sessionsWhereInput
  }


  /**
   * sessions: findUniqueOrThrow
   */
  export type sessionsFindUniqueOrThrowArgs = sessionsFindUniqueArgsBase
      

  /**
   * sessions: findFirstOrThrow
   */
  export type sessionsFindFirstOrThrowArgs = sessionsFindFirstArgsBase
      

  /**
   * sessions without action
   */
  export type sessionsArgs = {
    /**
     * Select specific fields to fetch from the sessions
     * 
    **/
    select?: sessionsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: sessionsInclude | null
  }



  /**
   * Enums
   */

  // Based on
  // https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

  export const Alembic_versionScalarFieldEnum: {
    version_num: 'version_num'
  };

  export type Alembic_versionScalarFieldEnum = (typeof Alembic_versionScalarFieldEnum)[keyof typeof Alembic_versionScalarFieldEnum]


  export const Extracted_resource_labelsScalarFieldEnum: {
    extracted_resource_id: 'extracted_resource_id',
    label_id: 'label_id'
  };

  export type Extracted_resource_labelsScalarFieldEnum = (typeof Extracted_resource_labelsScalarFieldEnum)[keyof typeof Extracted_resource_labelsScalarFieldEnum]


  export const Extracted_resourcesScalarFieldEnum: {
    id: 'id',
    created_at: 'created_at',
    updated_at: 'updated_at',
    resource_path: 'resource_path',
    filetype: 'filetype',
    feature: 'feature',
    raw_resource_id: 'raw_resource_id',
    patient_id: 'patient_id',
    session_id: 'session_id'
  };

  export type Extracted_resourcesScalarFieldEnum = (typeof Extracted_resourcesScalarFieldEnum)[keyof typeof Extracted_resourcesScalarFieldEnum]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const LabelsScalarFieldEnum: {
    id: 'id',
    created_at: 'created_at',
    updated_at: 'updated_at',
    name: 'name',
    abbreviation: 'abbreviation'
  };

  export type LabelsScalarFieldEnum = (typeof LabelsScalarFieldEnum)[keyof typeof LabelsScalarFieldEnum]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const Session_labelsScalarFieldEnum: {
    session_id: 'session_id',
    label_id: 'label_id'
  };

  export type Session_labelsScalarFieldEnum = (typeof Session_labelsScalarFieldEnum)[keyof typeof Session_labelsScalarFieldEnum]


  export const SessionsScalarFieldEnum: {
    id: 'id',
    created_at: 'created_at',
    updated_at: 'updated_at',
    name: 'name',
    description: 'description',
    user_id: 'user_id'
  };

  export type SessionsScalarFieldEnum = (typeof SessionsScalarFieldEnum)[keyof typeof SessionsScalarFieldEnum]


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


  /**
   * Deep Input Types
   */


  export type alembic_versionWhereInput = {
    AND?: Enumerable<alembic_versionWhereInput>
    OR?: Enumerable<alembic_versionWhereInput>
    NOT?: Enumerable<alembic_versionWhereInput>
    version_num?: StringFilter | string
  }

  export type alembic_versionOrderByWithRelationInput = {
    version_num?: SortOrder
  }

  export type alembic_versionWhereUniqueInput = {
    version_num?: string
  }

  export type alembic_versionOrderByWithAggregationInput = {
    version_num?: SortOrder
    _count?: alembic_versionCountOrderByAggregateInput
    _max?: alembic_versionMaxOrderByAggregateInput
    _min?: alembic_versionMinOrderByAggregateInput
  }

  export type alembic_versionScalarWhereWithAggregatesInput = {
    AND?: Enumerable<alembic_versionScalarWhereWithAggregatesInput>
    OR?: Enumerable<alembic_versionScalarWhereWithAggregatesInput>
    NOT?: Enumerable<alembic_versionScalarWhereWithAggregatesInput>
    version_num?: StringWithAggregatesFilter | string
  }

  export type extracted_resource_labelsWhereInput = {
    AND?: Enumerable<extracted_resource_labelsWhereInput>
    OR?: Enumerable<extracted_resource_labelsWhereInput>
    NOT?: Enumerable<extracted_resource_labelsWhereInput>
    extracted_resource_id?: StringFilter | string
    label_id?: StringFilter | string
    extracted_resources?: XOR<Extracted_resourcesRelationFilter, extracted_resourcesWhereInput>
    labels?: XOR<LabelsRelationFilter, labelsWhereInput>
  }

  export type extracted_resource_labelsOrderByWithRelationInput = {
    extracted_resource_id?: SortOrder
    label_id?: SortOrder
    extracted_resources?: extracted_resourcesOrderByWithRelationInput
    labels?: labelsOrderByWithRelationInput
  }

  export type extracted_resource_labelsWhereUniqueInput = {
    extracted_resource_id_label_id?: extracted_resource_labelsExtracted_resource_idLabel_idCompoundUniqueInput
  }

  export type extracted_resource_labelsOrderByWithAggregationInput = {
    extracted_resource_id?: SortOrder
    label_id?: SortOrder
    _count?: extracted_resource_labelsCountOrderByAggregateInput
    _max?: extracted_resource_labelsMaxOrderByAggregateInput
    _min?: extracted_resource_labelsMinOrderByAggregateInput
  }

  export type extracted_resource_labelsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<extracted_resource_labelsScalarWhereWithAggregatesInput>
    OR?: Enumerable<extracted_resource_labelsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<extracted_resource_labelsScalarWhereWithAggregatesInput>
    extracted_resource_id?: StringWithAggregatesFilter | string
    label_id?: StringWithAggregatesFilter | string
  }

  export type extracted_resourcesWhereInput = {
    AND?: Enumerable<extracted_resourcesWhereInput>
    OR?: Enumerable<extracted_resourcesWhereInput>
    NOT?: Enumerable<extracted_resourcesWhereInput>
    id?: StringFilter | string
    created_at?: DateTimeNullableFilter | Date | string | null
    updated_at?: DateTimeNullableFilter | Date | string | null
    resource_path?: StringFilter | string
    filetype?: EnumresourcetypeFilter | resourcetype
    feature?: JsonNullableFilter
    raw_resource_id?: StringFilter | string
    patient_id?: StringFilter | string
    session_id?: UuidNullableFilter | string | null
    sessions?: XOR<SessionsRelationFilter, sessionsWhereInput> | null
    extracted_resource_labels?: Extracted_resource_labelsListRelationFilter
  }

  export type extracted_resourcesOrderByWithRelationInput = {
    id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    resource_path?: SortOrder
    filetype?: SortOrder
    feature?: SortOrder
    raw_resource_id?: SortOrder
    patient_id?: SortOrder
    session_id?: SortOrder
    sessions?: sessionsOrderByWithRelationInput
    extracted_resource_labels?: extracted_resource_labelsOrderByRelationAggregateInput
  }

  export type extracted_resourcesWhereUniqueInput = {
    id?: string
    resource_path_session_id?: extracted_resourcesResource_pathSession_idCompoundUniqueInput
  }

  export type extracted_resourcesOrderByWithAggregationInput = {
    id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    resource_path?: SortOrder
    filetype?: SortOrder
    feature?: SortOrder
    raw_resource_id?: SortOrder
    patient_id?: SortOrder
    session_id?: SortOrder
    _count?: extracted_resourcesCountOrderByAggregateInput
    _max?: extracted_resourcesMaxOrderByAggregateInput
    _min?: extracted_resourcesMinOrderByAggregateInput
  }

  export type extracted_resourcesScalarWhereWithAggregatesInput = {
    AND?: Enumerable<extracted_resourcesScalarWhereWithAggregatesInput>
    OR?: Enumerable<extracted_resourcesScalarWhereWithAggregatesInput>
    NOT?: Enumerable<extracted_resourcesScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    created_at?: DateTimeNullableWithAggregatesFilter | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter | Date | string | null
    resource_path?: StringWithAggregatesFilter | string
    filetype?: EnumresourcetypeWithAggregatesFilter | resourcetype
    feature?: JsonNullableWithAggregatesFilter
    raw_resource_id?: StringWithAggregatesFilter | string
    patient_id?: StringWithAggregatesFilter | string
    session_id?: UuidNullableWithAggregatesFilter | string | null
  }

  export type labelsWhereInput = {
    AND?: Enumerable<labelsWhereInput>
    OR?: Enumerable<labelsWhereInput>
    NOT?: Enumerable<labelsWhereInput>
    id?: StringFilter | string
    created_at?: DateTimeNullableFilter | Date | string | null
    updated_at?: DateTimeNullableFilter | Date | string | null
    name?: StringFilter | string
    abbreviation?: StringFilter | string
    extracted_resource_labels?: Extracted_resource_labelsListRelationFilter
    session_labels?: Session_labelsListRelationFilter
  }

  export type labelsOrderByWithRelationInput = {
    id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    name?: SortOrder
    abbreviation?: SortOrder
    extracted_resource_labels?: extracted_resource_labelsOrderByRelationAggregateInput
    session_labels?: session_labelsOrderByRelationAggregateInput
  }

  export type labelsWhereUniqueInput = {
    id?: string
    name?: string
  }

  export type labelsOrderByWithAggregationInput = {
    id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    name?: SortOrder
    abbreviation?: SortOrder
    _count?: labelsCountOrderByAggregateInput
    _max?: labelsMaxOrderByAggregateInput
    _min?: labelsMinOrderByAggregateInput
  }

  export type labelsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<labelsScalarWhereWithAggregatesInput>
    OR?: Enumerable<labelsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<labelsScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    created_at?: DateTimeNullableWithAggregatesFilter | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter | Date | string | null
    name?: StringWithAggregatesFilter | string
    abbreviation?: StringWithAggregatesFilter | string
  }

  export type session_labelsWhereInput = {
    AND?: Enumerable<session_labelsWhereInput>
    OR?: Enumerable<session_labelsWhereInput>
    NOT?: Enumerable<session_labelsWhereInput>
    session_id?: UuidFilter | string
    label_id?: UuidFilter | string
    labels?: XOR<LabelsRelationFilter, labelsWhereInput>
    sessions?: XOR<SessionsRelationFilter, sessionsWhereInput>
  }

  export type session_labelsOrderByWithRelationInput = {
    session_id?: SortOrder
    label_id?: SortOrder
    labels?: labelsOrderByWithRelationInput
    sessions?: sessionsOrderByWithRelationInput
  }

  export type session_labelsWhereUniqueInput = {
    session_id_label_id?: session_labelsSession_idLabel_idCompoundUniqueInput
  }

  export type session_labelsOrderByWithAggregationInput = {
    session_id?: SortOrder
    label_id?: SortOrder
    _count?: session_labelsCountOrderByAggregateInput
    _max?: session_labelsMaxOrderByAggregateInput
    _min?: session_labelsMinOrderByAggregateInput
  }

  export type session_labelsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<session_labelsScalarWhereWithAggregatesInput>
    OR?: Enumerable<session_labelsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<session_labelsScalarWhereWithAggregatesInput>
    session_id?: UuidWithAggregatesFilter | string
    label_id?: UuidWithAggregatesFilter | string
  }

  export type sessionsWhereInput = {
    AND?: Enumerable<sessionsWhereInput>
    OR?: Enumerable<sessionsWhereInput>
    NOT?: Enumerable<sessionsWhereInput>
    id?: StringFilter | string
    created_at?: DateTimeNullableFilter | Date | string | null
    updated_at?: DateTimeNullableFilter | Date | string | null
    name?: StringFilter | string
    description?: StringNullableFilter | string | null
    user_id?: StringFilter | string
    extracted_resources?: Extracted_resourcesListRelationFilter
    session_labels?: Session_labelsListRelationFilter
  }

  export type sessionsOrderByWithRelationInput = {
    id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    name?: SortOrder
    description?: SortOrder
    user_id?: SortOrder
    extracted_resources?: extracted_resourcesOrderByRelationAggregateInput
    session_labels?: session_labelsOrderByRelationAggregateInput
  }

  export type sessionsWhereUniqueInput = {
    id?: string
    name_user_id?: sessionsNameUser_idCompoundUniqueInput
  }

  export type sessionsOrderByWithAggregationInput = {
    id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    name?: SortOrder
    description?: SortOrder
    user_id?: SortOrder
    _count?: sessionsCountOrderByAggregateInput
    _max?: sessionsMaxOrderByAggregateInput
    _min?: sessionsMinOrderByAggregateInput
  }

  export type sessionsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<sessionsScalarWhereWithAggregatesInput>
    OR?: Enumerable<sessionsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<sessionsScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    created_at?: DateTimeNullableWithAggregatesFilter | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter | Date | string | null
    name?: StringWithAggregatesFilter | string
    description?: StringNullableWithAggregatesFilter | string | null
    user_id?: StringWithAggregatesFilter | string
  }

  export type alembic_versionCreateInput = {
    version_num: string
  }

  export type alembic_versionUncheckedCreateInput = {
    version_num: string
  }

  export type alembic_versionUpdateInput = {
    version_num?: StringFieldUpdateOperationsInput | string
  }

  export type alembic_versionUncheckedUpdateInput = {
    version_num?: StringFieldUpdateOperationsInput | string
  }

  export type alembic_versionCreateManyInput = {
    version_num: string
  }

  export type alembic_versionUpdateManyMutationInput = {
    version_num?: StringFieldUpdateOperationsInput | string
  }

  export type alembic_versionUncheckedUpdateManyInput = {
    version_num?: StringFieldUpdateOperationsInput | string
  }

  export type extracted_resource_labelsCreateInput = {
    extracted_resources: extracted_resourcesCreateNestedOneWithoutExtracted_resource_labelsInput
    labels: labelsCreateNestedOneWithoutExtracted_resource_labelsInput
  }

  export type extracted_resource_labelsUncheckedCreateInput = {
    extracted_resource_id: string
    label_id: string
  }

  export type extracted_resource_labelsUpdateInput = {
    extracted_resources?: extracted_resourcesUpdateOneRequiredWithoutExtracted_resource_labelsNestedInput
    labels?: labelsUpdateOneRequiredWithoutExtracted_resource_labelsNestedInput
  }

  export type extracted_resource_labelsUncheckedUpdateInput = {
    extracted_resource_id?: StringFieldUpdateOperationsInput | string
    label_id?: StringFieldUpdateOperationsInput | string
  }

  export type extracted_resource_labelsCreateManyInput = {
    extracted_resource_id: string
    label_id: string
  }

  export type extracted_resource_labelsUpdateManyMutationInput = {

  }

  export type extracted_resource_labelsUncheckedUpdateManyInput = {
    extracted_resource_id?: StringFieldUpdateOperationsInput | string
    label_id?: StringFieldUpdateOperationsInput | string
  }

  export type extracted_resourcesCreateInput = {
    id?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    resource_path: string
    filetype: resourcetype
    feature?: NullableJsonNullValueInput | InputJsonValue
    raw_resource_id: string
    patient_id: string
    sessions?: sessionsCreateNestedOneWithoutExtracted_resourcesInput
    extracted_resource_labels?: extracted_resource_labelsCreateNestedManyWithoutExtracted_resourcesInput
  }

  export type extracted_resourcesUncheckedCreateInput = {
    id?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    resource_path: string
    filetype: resourcetype
    feature?: NullableJsonNullValueInput | InputJsonValue
    raw_resource_id: string
    patient_id: string
    session_id?: string | null
    extracted_resource_labels?: extracted_resource_labelsUncheckedCreateNestedManyWithoutExtracted_resourcesInput
  }

  export type extracted_resourcesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resource_path?: StringFieldUpdateOperationsInput | string
    filetype?: EnumresourcetypeFieldUpdateOperationsInput | resourcetype
    feature?: NullableJsonNullValueInput | InputJsonValue
    raw_resource_id?: StringFieldUpdateOperationsInput | string
    patient_id?: StringFieldUpdateOperationsInput | string
    sessions?: sessionsUpdateOneWithoutExtracted_resourcesNestedInput
    extracted_resource_labels?: extracted_resource_labelsUpdateManyWithoutExtracted_resourcesNestedInput
  }

  export type extracted_resourcesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resource_path?: StringFieldUpdateOperationsInput | string
    filetype?: EnumresourcetypeFieldUpdateOperationsInput | resourcetype
    feature?: NullableJsonNullValueInput | InputJsonValue
    raw_resource_id?: StringFieldUpdateOperationsInput | string
    patient_id?: StringFieldUpdateOperationsInput | string
    session_id?: NullableStringFieldUpdateOperationsInput | string | null
    extracted_resource_labels?: extracted_resource_labelsUncheckedUpdateManyWithoutExtracted_resourcesNestedInput
  }

  export type extracted_resourcesCreateManyInput = {
    id?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    resource_path: string
    filetype: resourcetype
    feature?: NullableJsonNullValueInput | InputJsonValue
    raw_resource_id: string
    patient_id: string
    session_id?: string | null
  }

  export type extracted_resourcesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resource_path?: StringFieldUpdateOperationsInput | string
    filetype?: EnumresourcetypeFieldUpdateOperationsInput | resourcetype
    feature?: NullableJsonNullValueInput | InputJsonValue
    raw_resource_id?: StringFieldUpdateOperationsInput | string
    patient_id?: StringFieldUpdateOperationsInput | string
  }

  export type extracted_resourcesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resource_path?: StringFieldUpdateOperationsInput | string
    filetype?: EnumresourcetypeFieldUpdateOperationsInput | resourcetype
    feature?: NullableJsonNullValueInput | InputJsonValue
    raw_resource_id?: StringFieldUpdateOperationsInput | string
    patient_id?: StringFieldUpdateOperationsInput | string
    session_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type labelsCreateInput = {
    id?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    name: string
    abbreviation: string
    extracted_resource_labels?: extracted_resource_labelsCreateNestedManyWithoutLabelsInput
    session_labels?: session_labelsCreateNestedManyWithoutLabelsInput
  }

  export type labelsUncheckedCreateInput = {
    id?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    name: string
    abbreviation: string
    extracted_resource_labels?: extracted_resource_labelsUncheckedCreateNestedManyWithoutLabelsInput
    session_labels?: session_labelsUncheckedCreateNestedManyWithoutLabelsInput
  }

  export type labelsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    extracted_resource_labels?: extracted_resource_labelsUpdateManyWithoutLabelsNestedInput
    session_labels?: session_labelsUpdateManyWithoutLabelsNestedInput
  }

  export type labelsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    extracted_resource_labels?: extracted_resource_labelsUncheckedUpdateManyWithoutLabelsNestedInput
    session_labels?: session_labelsUncheckedUpdateManyWithoutLabelsNestedInput
  }

  export type labelsCreateManyInput = {
    id?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    name: string
    abbreviation: string
  }

  export type labelsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
  }

  export type labelsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
  }

  export type session_labelsCreateInput = {
    labels: labelsCreateNestedOneWithoutSession_labelsInput
    sessions: sessionsCreateNestedOneWithoutSession_labelsInput
  }

  export type session_labelsUncheckedCreateInput = {
    session_id: string
    label_id: string
  }

  export type session_labelsUpdateInput = {
    labels?: labelsUpdateOneRequiredWithoutSession_labelsNestedInput
    sessions?: sessionsUpdateOneRequiredWithoutSession_labelsNestedInput
  }

  export type session_labelsUncheckedUpdateInput = {
    session_id?: StringFieldUpdateOperationsInput | string
    label_id?: StringFieldUpdateOperationsInput | string
  }

  export type session_labelsCreateManyInput = {
    session_id: string
    label_id: string
  }

  export type session_labelsUpdateManyMutationInput = {

  }

  export type session_labelsUncheckedUpdateManyInput = {
    session_id?: StringFieldUpdateOperationsInput | string
    label_id?: StringFieldUpdateOperationsInput | string
  }

  export type sessionsCreateInput = {
    id?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    name: string
    description?: string | null
    user_id: string
    extracted_resources?: extracted_resourcesCreateNestedManyWithoutSessionsInput
    session_labels?: session_labelsCreateNestedManyWithoutSessionsInput
  }

  export type sessionsUncheckedCreateInput = {
    id?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    name: string
    description?: string | null
    user_id: string
    extracted_resources?: extracted_resourcesUncheckedCreateNestedManyWithoutSessionsInput
    session_labels?: session_labelsUncheckedCreateNestedManyWithoutSessionsInput
  }

  export type sessionsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    extracted_resources?: extracted_resourcesUpdateManyWithoutSessionsNestedInput
    session_labels?: session_labelsUpdateManyWithoutSessionsNestedInput
  }

  export type sessionsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    extracted_resources?: extracted_resourcesUncheckedUpdateManyWithoutSessionsNestedInput
    session_labels?: session_labelsUncheckedUpdateManyWithoutSessionsNestedInput
  }

  export type sessionsCreateManyInput = {
    id?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    name: string
    description?: string | null
    user_id: string
  }

  export type sessionsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export type sessionsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
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

  export type alembic_versionCountOrderByAggregateInput = {
    version_num?: SortOrder
  }

  export type alembic_versionMaxOrderByAggregateInput = {
    version_num?: SortOrder
  }

  export type alembic_versionMinOrderByAggregateInput = {
    version_num?: SortOrder
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

  export type Extracted_resourcesRelationFilter = {
    is?: extracted_resourcesWhereInput
    isNot?: extracted_resourcesWhereInput
  }

  export type LabelsRelationFilter = {
    is?: labelsWhereInput
    isNot?: labelsWhereInput
  }

  export type extracted_resource_labelsExtracted_resource_idLabel_idCompoundUniqueInput = {
    extracted_resource_id: string
    label_id: string
  }

  export type extracted_resource_labelsCountOrderByAggregateInput = {
    extracted_resource_id?: SortOrder
    label_id?: SortOrder
  }

  export type extracted_resource_labelsMaxOrderByAggregateInput = {
    extracted_resource_id?: SortOrder
    label_id?: SortOrder
  }

  export type extracted_resource_labelsMinOrderByAggregateInput = {
    extracted_resource_id?: SortOrder
    label_id?: SortOrder
  }

  export type DateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | null
    notIn?: Enumerable<Date> | Enumerable<string> | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableFilter | Date | string | null
  }

  export type EnumresourcetypeFilter = {
    equals?: resourcetype
    in?: Enumerable<resourcetype>
    notIn?: Enumerable<resourcetype>
    not?: NestedEnumresourcetypeFilter | resourcetype
  }
  export type JsonNullableFilter = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase>, Exclude<keyof Required<JsonNullableFilterBase>, 'path'>>,
        Required<JsonNullableFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase>, 'path'>>

  export type JsonNullableFilterBase = {
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

  export type UuidNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    mode?: QueryMode
    not?: NestedUuidNullableFilter | string | null
  }

  export type SessionsRelationFilter = {
    is?: sessionsWhereInput
    isNot?: sessionsWhereInput
  }

  export type Extracted_resource_labelsListRelationFilter = {
    every?: extracted_resource_labelsWhereInput
    some?: extracted_resource_labelsWhereInput
    none?: extracted_resource_labelsWhereInput
  }

  export type extracted_resource_labelsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type extracted_resourcesResource_pathSession_idCompoundUniqueInput = {
    resource_path: string
    session_id: string
  }

  export type extracted_resourcesCountOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    resource_path?: SortOrder
    filetype?: SortOrder
    feature?: SortOrder
    raw_resource_id?: SortOrder
    patient_id?: SortOrder
    session_id?: SortOrder
  }

  export type extracted_resourcesMaxOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    resource_path?: SortOrder
    filetype?: SortOrder
    raw_resource_id?: SortOrder
    patient_id?: SortOrder
    session_id?: SortOrder
  }

  export type extracted_resourcesMinOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    resource_path?: SortOrder
    filetype?: SortOrder
    raw_resource_id?: SortOrder
    patient_id?: SortOrder
    session_id?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | null
    notIn?: Enumerable<Date> | Enumerable<string> | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableWithAggregatesFilter | Date | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedDateTimeNullableFilter
    _max?: NestedDateTimeNullableFilter
  }

  export type EnumresourcetypeWithAggregatesFilter = {
    equals?: resourcetype
    in?: Enumerable<resourcetype>
    notIn?: Enumerable<resourcetype>
    not?: NestedEnumresourcetypeWithAggregatesFilter | resourcetype
    _count?: NestedIntFilter
    _min?: NestedEnumresourcetypeFilter
    _max?: NestedEnumresourcetypeFilter
  }
  export type JsonNullableWithAggregatesFilter = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase = {
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
    _count?: NestedIntNullableFilter
    _min?: NestedJsonNullableFilter
    _max?: NestedJsonNullableFilter
  }

  export type UuidNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type Session_labelsListRelationFilter = {
    every?: session_labelsWhereInput
    some?: session_labelsWhereInput
    none?: session_labelsWhereInput
  }

  export type session_labelsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type labelsCountOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    name?: SortOrder
    abbreviation?: SortOrder
  }

  export type labelsMaxOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    name?: SortOrder
    abbreviation?: SortOrder
  }

  export type labelsMinOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    name?: SortOrder
    abbreviation?: SortOrder
  }

  export type UuidFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    mode?: QueryMode
    not?: NestedUuidFilter | string
  }

  export type session_labelsSession_idLabel_idCompoundUniqueInput = {
    session_id: string
    label_id: string
  }

  export type session_labelsCountOrderByAggregateInput = {
    session_id?: SortOrder
    label_id?: SortOrder
  }

  export type session_labelsMaxOrderByAggregateInput = {
    session_id?: SortOrder
    label_id?: SortOrder
  }

  export type session_labelsMinOrderByAggregateInput = {
    session_id?: SortOrder
    label_id?: SortOrder
  }

  export type UuidWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type StringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableFilter | string | null
  }

  export type Extracted_resourcesListRelationFilter = {
    every?: extracted_resourcesWhereInput
    some?: extracted_resourcesWhereInput
    none?: extracted_resourcesWhereInput
  }

  export type extracted_resourcesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type sessionsNameUser_idCompoundUniqueInput = {
    name: string
    user_id: string
  }

  export type sessionsCountOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    name?: SortOrder
    description?: SortOrder
    user_id?: SortOrder
  }

  export type sessionsMaxOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    name?: SortOrder
    description?: SortOrder
    user_id?: SortOrder
  }

  export type sessionsMinOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    name?: SortOrder
    description?: SortOrder
    user_id?: SortOrder
  }

  export type StringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type extracted_resourcesCreateNestedOneWithoutExtracted_resource_labelsInput = {
    create?: XOR<extracted_resourcesCreateWithoutExtracted_resource_labelsInput, extracted_resourcesUncheckedCreateWithoutExtracted_resource_labelsInput>
    connectOrCreate?: extracted_resourcesCreateOrConnectWithoutExtracted_resource_labelsInput
    connect?: extracted_resourcesWhereUniqueInput
  }

  export type labelsCreateNestedOneWithoutExtracted_resource_labelsInput = {
    create?: XOR<labelsCreateWithoutExtracted_resource_labelsInput, labelsUncheckedCreateWithoutExtracted_resource_labelsInput>
    connectOrCreate?: labelsCreateOrConnectWithoutExtracted_resource_labelsInput
    connect?: labelsWhereUniqueInput
  }

  export type extracted_resourcesUpdateOneRequiredWithoutExtracted_resource_labelsNestedInput = {
    create?: XOR<extracted_resourcesCreateWithoutExtracted_resource_labelsInput, extracted_resourcesUncheckedCreateWithoutExtracted_resource_labelsInput>
    connectOrCreate?: extracted_resourcesCreateOrConnectWithoutExtracted_resource_labelsInput
    upsert?: extracted_resourcesUpsertWithoutExtracted_resource_labelsInput
    connect?: extracted_resourcesWhereUniqueInput
    update?: XOR<extracted_resourcesUpdateWithoutExtracted_resource_labelsInput, extracted_resourcesUncheckedUpdateWithoutExtracted_resource_labelsInput>
  }

  export type labelsUpdateOneRequiredWithoutExtracted_resource_labelsNestedInput = {
    create?: XOR<labelsCreateWithoutExtracted_resource_labelsInput, labelsUncheckedCreateWithoutExtracted_resource_labelsInput>
    connectOrCreate?: labelsCreateOrConnectWithoutExtracted_resource_labelsInput
    upsert?: labelsUpsertWithoutExtracted_resource_labelsInput
    connect?: labelsWhereUniqueInput
    update?: XOR<labelsUpdateWithoutExtracted_resource_labelsInput, labelsUncheckedUpdateWithoutExtracted_resource_labelsInput>
  }

  export type sessionsCreateNestedOneWithoutExtracted_resourcesInput = {
    create?: XOR<sessionsCreateWithoutExtracted_resourcesInput, sessionsUncheckedCreateWithoutExtracted_resourcesInput>
    connectOrCreate?: sessionsCreateOrConnectWithoutExtracted_resourcesInput
    connect?: sessionsWhereUniqueInput
  }

  export type extracted_resource_labelsCreateNestedManyWithoutExtracted_resourcesInput = {
    create?: XOR<Enumerable<extracted_resource_labelsCreateWithoutExtracted_resourcesInput>, Enumerable<extracted_resource_labelsUncheckedCreateWithoutExtracted_resourcesInput>>
    connectOrCreate?: Enumerable<extracted_resource_labelsCreateOrConnectWithoutExtracted_resourcesInput>
    createMany?: extracted_resource_labelsCreateManyExtracted_resourcesInputEnvelope
    connect?: Enumerable<extracted_resource_labelsWhereUniqueInput>
  }

  export type extracted_resource_labelsUncheckedCreateNestedManyWithoutExtracted_resourcesInput = {
    create?: XOR<Enumerable<extracted_resource_labelsCreateWithoutExtracted_resourcesInput>, Enumerable<extracted_resource_labelsUncheckedCreateWithoutExtracted_resourcesInput>>
    connectOrCreate?: Enumerable<extracted_resource_labelsCreateOrConnectWithoutExtracted_resourcesInput>
    createMany?: extracted_resource_labelsCreateManyExtracted_resourcesInputEnvelope
    connect?: Enumerable<extracted_resource_labelsWhereUniqueInput>
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type EnumresourcetypeFieldUpdateOperationsInput = {
    set?: resourcetype
  }

  export type sessionsUpdateOneWithoutExtracted_resourcesNestedInput = {
    create?: XOR<sessionsCreateWithoutExtracted_resourcesInput, sessionsUncheckedCreateWithoutExtracted_resourcesInput>
    connectOrCreate?: sessionsCreateOrConnectWithoutExtracted_resourcesInput
    upsert?: sessionsUpsertWithoutExtracted_resourcesInput
    disconnect?: boolean
    delete?: boolean
    connect?: sessionsWhereUniqueInput
    update?: XOR<sessionsUpdateWithoutExtracted_resourcesInput, sessionsUncheckedUpdateWithoutExtracted_resourcesInput>
  }

  export type extracted_resource_labelsUpdateManyWithoutExtracted_resourcesNestedInput = {
    create?: XOR<Enumerable<extracted_resource_labelsCreateWithoutExtracted_resourcesInput>, Enumerable<extracted_resource_labelsUncheckedCreateWithoutExtracted_resourcesInput>>
    connectOrCreate?: Enumerable<extracted_resource_labelsCreateOrConnectWithoutExtracted_resourcesInput>
    upsert?: Enumerable<extracted_resource_labelsUpsertWithWhereUniqueWithoutExtracted_resourcesInput>
    createMany?: extracted_resource_labelsCreateManyExtracted_resourcesInputEnvelope
    set?: Enumerable<extracted_resource_labelsWhereUniqueInput>
    disconnect?: Enumerable<extracted_resource_labelsWhereUniqueInput>
    delete?: Enumerable<extracted_resource_labelsWhereUniqueInput>
    connect?: Enumerable<extracted_resource_labelsWhereUniqueInput>
    update?: Enumerable<extracted_resource_labelsUpdateWithWhereUniqueWithoutExtracted_resourcesInput>
    updateMany?: Enumerable<extracted_resource_labelsUpdateManyWithWhereWithoutExtracted_resourcesInput>
    deleteMany?: Enumerable<extracted_resource_labelsScalarWhereInput>
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type extracted_resource_labelsUncheckedUpdateManyWithoutExtracted_resourcesNestedInput = {
    create?: XOR<Enumerable<extracted_resource_labelsCreateWithoutExtracted_resourcesInput>, Enumerable<extracted_resource_labelsUncheckedCreateWithoutExtracted_resourcesInput>>
    connectOrCreate?: Enumerable<extracted_resource_labelsCreateOrConnectWithoutExtracted_resourcesInput>
    upsert?: Enumerable<extracted_resource_labelsUpsertWithWhereUniqueWithoutExtracted_resourcesInput>
    createMany?: extracted_resource_labelsCreateManyExtracted_resourcesInputEnvelope
    set?: Enumerable<extracted_resource_labelsWhereUniqueInput>
    disconnect?: Enumerable<extracted_resource_labelsWhereUniqueInput>
    delete?: Enumerable<extracted_resource_labelsWhereUniqueInput>
    connect?: Enumerable<extracted_resource_labelsWhereUniqueInput>
    update?: Enumerable<extracted_resource_labelsUpdateWithWhereUniqueWithoutExtracted_resourcesInput>
    updateMany?: Enumerable<extracted_resource_labelsUpdateManyWithWhereWithoutExtracted_resourcesInput>
    deleteMany?: Enumerable<extracted_resource_labelsScalarWhereInput>
  }

  export type extracted_resource_labelsCreateNestedManyWithoutLabelsInput = {
    create?: XOR<Enumerable<extracted_resource_labelsCreateWithoutLabelsInput>, Enumerable<extracted_resource_labelsUncheckedCreateWithoutLabelsInput>>
    connectOrCreate?: Enumerable<extracted_resource_labelsCreateOrConnectWithoutLabelsInput>
    createMany?: extracted_resource_labelsCreateManyLabelsInputEnvelope
    connect?: Enumerable<extracted_resource_labelsWhereUniqueInput>
  }

  export type session_labelsCreateNestedManyWithoutLabelsInput = {
    create?: XOR<Enumerable<session_labelsCreateWithoutLabelsInput>, Enumerable<session_labelsUncheckedCreateWithoutLabelsInput>>
    connectOrCreate?: Enumerable<session_labelsCreateOrConnectWithoutLabelsInput>
    createMany?: session_labelsCreateManyLabelsInputEnvelope
    connect?: Enumerable<session_labelsWhereUniqueInput>
  }

  export type extracted_resource_labelsUncheckedCreateNestedManyWithoutLabelsInput = {
    create?: XOR<Enumerable<extracted_resource_labelsCreateWithoutLabelsInput>, Enumerable<extracted_resource_labelsUncheckedCreateWithoutLabelsInput>>
    connectOrCreate?: Enumerable<extracted_resource_labelsCreateOrConnectWithoutLabelsInput>
    createMany?: extracted_resource_labelsCreateManyLabelsInputEnvelope
    connect?: Enumerable<extracted_resource_labelsWhereUniqueInput>
  }

  export type session_labelsUncheckedCreateNestedManyWithoutLabelsInput = {
    create?: XOR<Enumerable<session_labelsCreateWithoutLabelsInput>, Enumerable<session_labelsUncheckedCreateWithoutLabelsInput>>
    connectOrCreate?: Enumerable<session_labelsCreateOrConnectWithoutLabelsInput>
    createMany?: session_labelsCreateManyLabelsInputEnvelope
    connect?: Enumerable<session_labelsWhereUniqueInput>
  }

  export type extracted_resource_labelsUpdateManyWithoutLabelsNestedInput = {
    create?: XOR<Enumerable<extracted_resource_labelsCreateWithoutLabelsInput>, Enumerable<extracted_resource_labelsUncheckedCreateWithoutLabelsInput>>
    connectOrCreate?: Enumerable<extracted_resource_labelsCreateOrConnectWithoutLabelsInput>
    upsert?: Enumerable<extracted_resource_labelsUpsertWithWhereUniqueWithoutLabelsInput>
    createMany?: extracted_resource_labelsCreateManyLabelsInputEnvelope
    set?: Enumerable<extracted_resource_labelsWhereUniqueInput>
    disconnect?: Enumerable<extracted_resource_labelsWhereUniqueInput>
    delete?: Enumerable<extracted_resource_labelsWhereUniqueInput>
    connect?: Enumerable<extracted_resource_labelsWhereUniqueInput>
    update?: Enumerable<extracted_resource_labelsUpdateWithWhereUniqueWithoutLabelsInput>
    updateMany?: Enumerable<extracted_resource_labelsUpdateManyWithWhereWithoutLabelsInput>
    deleteMany?: Enumerable<extracted_resource_labelsScalarWhereInput>
  }

  export type session_labelsUpdateManyWithoutLabelsNestedInput = {
    create?: XOR<Enumerable<session_labelsCreateWithoutLabelsInput>, Enumerable<session_labelsUncheckedCreateWithoutLabelsInput>>
    connectOrCreate?: Enumerable<session_labelsCreateOrConnectWithoutLabelsInput>
    upsert?: Enumerable<session_labelsUpsertWithWhereUniqueWithoutLabelsInput>
    createMany?: session_labelsCreateManyLabelsInputEnvelope
    set?: Enumerable<session_labelsWhereUniqueInput>
    disconnect?: Enumerable<session_labelsWhereUniqueInput>
    delete?: Enumerable<session_labelsWhereUniqueInput>
    connect?: Enumerable<session_labelsWhereUniqueInput>
    update?: Enumerable<session_labelsUpdateWithWhereUniqueWithoutLabelsInput>
    updateMany?: Enumerable<session_labelsUpdateManyWithWhereWithoutLabelsInput>
    deleteMany?: Enumerable<session_labelsScalarWhereInput>
  }

  export type extracted_resource_labelsUncheckedUpdateManyWithoutLabelsNestedInput = {
    create?: XOR<Enumerable<extracted_resource_labelsCreateWithoutLabelsInput>, Enumerable<extracted_resource_labelsUncheckedCreateWithoutLabelsInput>>
    connectOrCreate?: Enumerable<extracted_resource_labelsCreateOrConnectWithoutLabelsInput>
    upsert?: Enumerable<extracted_resource_labelsUpsertWithWhereUniqueWithoutLabelsInput>
    createMany?: extracted_resource_labelsCreateManyLabelsInputEnvelope
    set?: Enumerable<extracted_resource_labelsWhereUniqueInput>
    disconnect?: Enumerable<extracted_resource_labelsWhereUniqueInput>
    delete?: Enumerable<extracted_resource_labelsWhereUniqueInput>
    connect?: Enumerable<extracted_resource_labelsWhereUniqueInput>
    update?: Enumerable<extracted_resource_labelsUpdateWithWhereUniqueWithoutLabelsInput>
    updateMany?: Enumerable<extracted_resource_labelsUpdateManyWithWhereWithoutLabelsInput>
    deleteMany?: Enumerable<extracted_resource_labelsScalarWhereInput>
  }

  export type session_labelsUncheckedUpdateManyWithoutLabelsNestedInput = {
    create?: XOR<Enumerable<session_labelsCreateWithoutLabelsInput>, Enumerable<session_labelsUncheckedCreateWithoutLabelsInput>>
    connectOrCreate?: Enumerable<session_labelsCreateOrConnectWithoutLabelsInput>
    upsert?: Enumerable<session_labelsUpsertWithWhereUniqueWithoutLabelsInput>
    createMany?: session_labelsCreateManyLabelsInputEnvelope
    set?: Enumerable<session_labelsWhereUniqueInput>
    disconnect?: Enumerable<session_labelsWhereUniqueInput>
    delete?: Enumerable<session_labelsWhereUniqueInput>
    connect?: Enumerable<session_labelsWhereUniqueInput>
    update?: Enumerable<session_labelsUpdateWithWhereUniqueWithoutLabelsInput>
    updateMany?: Enumerable<session_labelsUpdateManyWithWhereWithoutLabelsInput>
    deleteMany?: Enumerable<session_labelsScalarWhereInput>
  }

  export type labelsCreateNestedOneWithoutSession_labelsInput = {
    create?: XOR<labelsCreateWithoutSession_labelsInput, labelsUncheckedCreateWithoutSession_labelsInput>
    connectOrCreate?: labelsCreateOrConnectWithoutSession_labelsInput
    connect?: labelsWhereUniqueInput
  }

  export type sessionsCreateNestedOneWithoutSession_labelsInput = {
    create?: XOR<sessionsCreateWithoutSession_labelsInput, sessionsUncheckedCreateWithoutSession_labelsInput>
    connectOrCreate?: sessionsCreateOrConnectWithoutSession_labelsInput
    connect?: sessionsWhereUniqueInput
  }

  export type labelsUpdateOneRequiredWithoutSession_labelsNestedInput = {
    create?: XOR<labelsCreateWithoutSession_labelsInput, labelsUncheckedCreateWithoutSession_labelsInput>
    connectOrCreate?: labelsCreateOrConnectWithoutSession_labelsInput
    upsert?: labelsUpsertWithoutSession_labelsInput
    connect?: labelsWhereUniqueInput
    update?: XOR<labelsUpdateWithoutSession_labelsInput, labelsUncheckedUpdateWithoutSession_labelsInput>
  }

  export type sessionsUpdateOneRequiredWithoutSession_labelsNestedInput = {
    create?: XOR<sessionsCreateWithoutSession_labelsInput, sessionsUncheckedCreateWithoutSession_labelsInput>
    connectOrCreate?: sessionsCreateOrConnectWithoutSession_labelsInput
    upsert?: sessionsUpsertWithoutSession_labelsInput
    connect?: sessionsWhereUniqueInput
    update?: XOR<sessionsUpdateWithoutSession_labelsInput, sessionsUncheckedUpdateWithoutSession_labelsInput>
  }

  export type extracted_resourcesCreateNestedManyWithoutSessionsInput = {
    create?: XOR<Enumerable<extracted_resourcesCreateWithoutSessionsInput>, Enumerable<extracted_resourcesUncheckedCreateWithoutSessionsInput>>
    connectOrCreate?: Enumerable<extracted_resourcesCreateOrConnectWithoutSessionsInput>
    createMany?: extracted_resourcesCreateManySessionsInputEnvelope
    connect?: Enumerable<extracted_resourcesWhereUniqueInput>
  }

  export type session_labelsCreateNestedManyWithoutSessionsInput = {
    create?: XOR<Enumerable<session_labelsCreateWithoutSessionsInput>, Enumerable<session_labelsUncheckedCreateWithoutSessionsInput>>
    connectOrCreate?: Enumerable<session_labelsCreateOrConnectWithoutSessionsInput>
    createMany?: session_labelsCreateManySessionsInputEnvelope
    connect?: Enumerable<session_labelsWhereUniqueInput>
  }

  export type extracted_resourcesUncheckedCreateNestedManyWithoutSessionsInput = {
    create?: XOR<Enumerable<extracted_resourcesCreateWithoutSessionsInput>, Enumerable<extracted_resourcesUncheckedCreateWithoutSessionsInput>>
    connectOrCreate?: Enumerable<extracted_resourcesCreateOrConnectWithoutSessionsInput>
    createMany?: extracted_resourcesCreateManySessionsInputEnvelope
    connect?: Enumerable<extracted_resourcesWhereUniqueInput>
  }

  export type session_labelsUncheckedCreateNestedManyWithoutSessionsInput = {
    create?: XOR<Enumerable<session_labelsCreateWithoutSessionsInput>, Enumerable<session_labelsUncheckedCreateWithoutSessionsInput>>
    connectOrCreate?: Enumerable<session_labelsCreateOrConnectWithoutSessionsInput>
    createMany?: session_labelsCreateManySessionsInputEnvelope
    connect?: Enumerable<session_labelsWhereUniqueInput>
  }

  export type extracted_resourcesUpdateManyWithoutSessionsNestedInput = {
    create?: XOR<Enumerable<extracted_resourcesCreateWithoutSessionsInput>, Enumerable<extracted_resourcesUncheckedCreateWithoutSessionsInput>>
    connectOrCreate?: Enumerable<extracted_resourcesCreateOrConnectWithoutSessionsInput>
    upsert?: Enumerable<extracted_resourcesUpsertWithWhereUniqueWithoutSessionsInput>
    createMany?: extracted_resourcesCreateManySessionsInputEnvelope
    set?: Enumerable<extracted_resourcesWhereUniqueInput>
    disconnect?: Enumerable<extracted_resourcesWhereUniqueInput>
    delete?: Enumerable<extracted_resourcesWhereUniqueInput>
    connect?: Enumerable<extracted_resourcesWhereUniqueInput>
    update?: Enumerable<extracted_resourcesUpdateWithWhereUniqueWithoutSessionsInput>
    updateMany?: Enumerable<extracted_resourcesUpdateManyWithWhereWithoutSessionsInput>
    deleteMany?: Enumerable<extracted_resourcesScalarWhereInput>
  }

  export type session_labelsUpdateManyWithoutSessionsNestedInput = {
    create?: XOR<Enumerable<session_labelsCreateWithoutSessionsInput>, Enumerable<session_labelsUncheckedCreateWithoutSessionsInput>>
    connectOrCreate?: Enumerable<session_labelsCreateOrConnectWithoutSessionsInput>
    upsert?: Enumerable<session_labelsUpsertWithWhereUniqueWithoutSessionsInput>
    createMany?: session_labelsCreateManySessionsInputEnvelope
    set?: Enumerable<session_labelsWhereUniqueInput>
    disconnect?: Enumerable<session_labelsWhereUniqueInput>
    delete?: Enumerable<session_labelsWhereUniqueInput>
    connect?: Enumerable<session_labelsWhereUniqueInput>
    update?: Enumerable<session_labelsUpdateWithWhereUniqueWithoutSessionsInput>
    updateMany?: Enumerable<session_labelsUpdateManyWithWhereWithoutSessionsInput>
    deleteMany?: Enumerable<session_labelsScalarWhereInput>
  }

  export type extracted_resourcesUncheckedUpdateManyWithoutSessionsNestedInput = {
    create?: XOR<Enumerable<extracted_resourcesCreateWithoutSessionsInput>, Enumerable<extracted_resourcesUncheckedCreateWithoutSessionsInput>>
    connectOrCreate?: Enumerable<extracted_resourcesCreateOrConnectWithoutSessionsInput>
    upsert?: Enumerable<extracted_resourcesUpsertWithWhereUniqueWithoutSessionsInput>
    createMany?: extracted_resourcesCreateManySessionsInputEnvelope
    set?: Enumerable<extracted_resourcesWhereUniqueInput>
    disconnect?: Enumerable<extracted_resourcesWhereUniqueInput>
    delete?: Enumerable<extracted_resourcesWhereUniqueInput>
    connect?: Enumerable<extracted_resourcesWhereUniqueInput>
    update?: Enumerable<extracted_resourcesUpdateWithWhereUniqueWithoutSessionsInput>
    updateMany?: Enumerable<extracted_resourcesUpdateManyWithWhereWithoutSessionsInput>
    deleteMany?: Enumerable<extracted_resourcesScalarWhereInput>
  }

  export type session_labelsUncheckedUpdateManyWithoutSessionsNestedInput = {
    create?: XOR<Enumerable<session_labelsCreateWithoutSessionsInput>, Enumerable<session_labelsUncheckedCreateWithoutSessionsInput>>
    connectOrCreate?: Enumerable<session_labelsCreateOrConnectWithoutSessionsInput>
    upsert?: Enumerable<session_labelsUpsertWithWhereUniqueWithoutSessionsInput>
    createMany?: session_labelsCreateManySessionsInputEnvelope
    set?: Enumerable<session_labelsWhereUniqueInput>
    disconnect?: Enumerable<session_labelsWhereUniqueInput>
    delete?: Enumerable<session_labelsWhereUniqueInput>
    connect?: Enumerable<session_labelsWhereUniqueInput>
    update?: Enumerable<session_labelsUpdateWithWhereUniqueWithoutSessionsInput>
    updateMany?: Enumerable<session_labelsUpdateManyWithWhereWithoutSessionsInput>
    deleteMany?: Enumerable<session_labelsScalarWhereInput>
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

  export type NestedDateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | null
    notIn?: Enumerable<Date> | Enumerable<string> | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableFilter | Date | string | null
  }

  export type NestedEnumresourcetypeFilter = {
    equals?: resourcetype
    in?: Enumerable<resourcetype>
    notIn?: Enumerable<resourcetype>
    not?: NestedEnumresourcetypeFilter | resourcetype
  }

  export type NestedUuidNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    not?: NestedUuidNullableFilter | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | null
    notIn?: Enumerable<Date> | Enumerable<string> | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableWithAggregatesFilter | Date | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedDateTimeNullableFilter
    _max?: NestedDateTimeNullableFilter
  }

  export type NestedIntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
  }

  export type NestedEnumresourcetypeWithAggregatesFilter = {
    equals?: resourcetype
    in?: Enumerable<resourcetype>
    notIn?: Enumerable<resourcetype>
    not?: NestedEnumresourcetypeWithAggregatesFilter | resourcetype
    _count?: NestedIntFilter
    _min?: NestedEnumresourcetypeFilter
    _max?: NestedEnumresourcetypeFilter
  }
  export type NestedJsonNullableFilter = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase>, Exclude<keyof Required<NestedJsonNullableFilterBase>, 'path'>>,
        Required<NestedJsonNullableFilterBase>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase>, 'path'>>

  export type NestedJsonNullableFilterBase = {
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

  export type NestedUuidNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    not?: NestedUuidNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type NestedStringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableFilter | string | null
  }

  export type NestedUuidFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    not?: NestedUuidFilter | string
  }

  export type NestedUuidWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    not?: NestedUuidWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type NestedStringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type extracted_resourcesCreateWithoutExtracted_resource_labelsInput = {
    id?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    resource_path: string
    filetype: resourcetype
    feature?: NullableJsonNullValueInput | InputJsonValue
    raw_resource_id: string
    patient_id: string
    sessions?: sessionsCreateNestedOneWithoutExtracted_resourcesInput
  }

  export type extracted_resourcesUncheckedCreateWithoutExtracted_resource_labelsInput = {
    id?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    resource_path: string
    filetype: resourcetype
    feature?: NullableJsonNullValueInput | InputJsonValue
    raw_resource_id: string
    patient_id: string
    session_id?: string | null
  }

  export type extracted_resourcesCreateOrConnectWithoutExtracted_resource_labelsInput = {
    where: extracted_resourcesWhereUniqueInput
    create: XOR<extracted_resourcesCreateWithoutExtracted_resource_labelsInput, extracted_resourcesUncheckedCreateWithoutExtracted_resource_labelsInput>
  }

  export type labelsCreateWithoutExtracted_resource_labelsInput = {
    id?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    name: string
    abbreviation: string
    session_labels?: session_labelsCreateNestedManyWithoutLabelsInput
  }

  export type labelsUncheckedCreateWithoutExtracted_resource_labelsInput = {
    id?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    name: string
    abbreviation: string
    session_labels?: session_labelsUncheckedCreateNestedManyWithoutLabelsInput
  }

  export type labelsCreateOrConnectWithoutExtracted_resource_labelsInput = {
    where: labelsWhereUniqueInput
    create: XOR<labelsCreateWithoutExtracted_resource_labelsInput, labelsUncheckedCreateWithoutExtracted_resource_labelsInput>
  }

  export type extracted_resourcesUpsertWithoutExtracted_resource_labelsInput = {
    update: XOR<extracted_resourcesUpdateWithoutExtracted_resource_labelsInput, extracted_resourcesUncheckedUpdateWithoutExtracted_resource_labelsInput>
    create: XOR<extracted_resourcesCreateWithoutExtracted_resource_labelsInput, extracted_resourcesUncheckedCreateWithoutExtracted_resource_labelsInput>
  }

  export type extracted_resourcesUpdateWithoutExtracted_resource_labelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resource_path?: StringFieldUpdateOperationsInput | string
    filetype?: EnumresourcetypeFieldUpdateOperationsInput | resourcetype
    feature?: NullableJsonNullValueInput | InputJsonValue
    raw_resource_id?: StringFieldUpdateOperationsInput | string
    patient_id?: StringFieldUpdateOperationsInput | string
    sessions?: sessionsUpdateOneWithoutExtracted_resourcesNestedInput
  }

  export type extracted_resourcesUncheckedUpdateWithoutExtracted_resource_labelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resource_path?: StringFieldUpdateOperationsInput | string
    filetype?: EnumresourcetypeFieldUpdateOperationsInput | resourcetype
    feature?: NullableJsonNullValueInput | InputJsonValue
    raw_resource_id?: StringFieldUpdateOperationsInput | string
    patient_id?: StringFieldUpdateOperationsInput | string
    session_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type labelsUpsertWithoutExtracted_resource_labelsInput = {
    update: XOR<labelsUpdateWithoutExtracted_resource_labelsInput, labelsUncheckedUpdateWithoutExtracted_resource_labelsInput>
    create: XOR<labelsCreateWithoutExtracted_resource_labelsInput, labelsUncheckedCreateWithoutExtracted_resource_labelsInput>
  }

  export type labelsUpdateWithoutExtracted_resource_labelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    session_labels?: session_labelsUpdateManyWithoutLabelsNestedInput
  }

  export type labelsUncheckedUpdateWithoutExtracted_resource_labelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    session_labels?: session_labelsUncheckedUpdateManyWithoutLabelsNestedInput
  }

  export type sessionsCreateWithoutExtracted_resourcesInput = {
    id?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    name: string
    description?: string | null
    user_id: string
    session_labels?: session_labelsCreateNestedManyWithoutSessionsInput
  }

  export type sessionsUncheckedCreateWithoutExtracted_resourcesInput = {
    id?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    name: string
    description?: string | null
    user_id: string
    session_labels?: session_labelsUncheckedCreateNestedManyWithoutSessionsInput
  }

  export type sessionsCreateOrConnectWithoutExtracted_resourcesInput = {
    where: sessionsWhereUniqueInput
    create: XOR<sessionsCreateWithoutExtracted_resourcesInput, sessionsUncheckedCreateWithoutExtracted_resourcesInput>
  }

  export type extracted_resource_labelsCreateWithoutExtracted_resourcesInput = {
    labels: labelsCreateNestedOneWithoutExtracted_resource_labelsInput
  }

  export type extracted_resource_labelsUncheckedCreateWithoutExtracted_resourcesInput = {
    label_id: string
  }

  export type extracted_resource_labelsCreateOrConnectWithoutExtracted_resourcesInput = {
    where: extracted_resource_labelsWhereUniqueInput
    create: XOR<extracted_resource_labelsCreateWithoutExtracted_resourcesInput, extracted_resource_labelsUncheckedCreateWithoutExtracted_resourcesInput>
  }

  export type extracted_resource_labelsCreateManyExtracted_resourcesInputEnvelope = {
    data: Enumerable<extracted_resource_labelsCreateManyExtracted_resourcesInput>
    skipDuplicates?: boolean
  }

  export type sessionsUpsertWithoutExtracted_resourcesInput = {
    update: XOR<sessionsUpdateWithoutExtracted_resourcesInput, sessionsUncheckedUpdateWithoutExtracted_resourcesInput>
    create: XOR<sessionsCreateWithoutExtracted_resourcesInput, sessionsUncheckedCreateWithoutExtracted_resourcesInput>
  }

  export type sessionsUpdateWithoutExtracted_resourcesInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    session_labels?: session_labelsUpdateManyWithoutSessionsNestedInput
  }

  export type sessionsUncheckedUpdateWithoutExtracted_resourcesInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    session_labels?: session_labelsUncheckedUpdateManyWithoutSessionsNestedInput
  }

  export type extracted_resource_labelsUpsertWithWhereUniqueWithoutExtracted_resourcesInput = {
    where: extracted_resource_labelsWhereUniqueInput
    update: XOR<extracted_resource_labelsUpdateWithoutExtracted_resourcesInput, extracted_resource_labelsUncheckedUpdateWithoutExtracted_resourcesInput>
    create: XOR<extracted_resource_labelsCreateWithoutExtracted_resourcesInput, extracted_resource_labelsUncheckedCreateWithoutExtracted_resourcesInput>
  }

  export type extracted_resource_labelsUpdateWithWhereUniqueWithoutExtracted_resourcesInput = {
    where: extracted_resource_labelsWhereUniqueInput
    data: XOR<extracted_resource_labelsUpdateWithoutExtracted_resourcesInput, extracted_resource_labelsUncheckedUpdateWithoutExtracted_resourcesInput>
  }

  export type extracted_resource_labelsUpdateManyWithWhereWithoutExtracted_resourcesInput = {
    where: extracted_resource_labelsScalarWhereInput
    data: XOR<extracted_resource_labelsUpdateManyMutationInput, extracted_resource_labelsUncheckedUpdateManyWithoutExtracted_resource_labelsInput>
  }

  export type extracted_resource_labelsScalarWhereInput = {
    AND?: Enumerable<extracted_resource_labelsScalarWhereInput>
    OR?: Enumerable<extracted_resource_labelsScalarWhereInput>
    NOT?: Enumerable<extracted_resource_labelsScalarWhereInput>
    extracted_resource_id?: StringFilter | string
    label_id?: StringFilter | string
  }

  export type extracted_resource_labelsCreateWithoutLabelsInput = {
    extracted_resources: extracted_resourcesCreateNestedOneWithoutExtracted_resource_labelsInput
  }

  export type extracted_resource_labelsUncheckedCreateWithoutLabelsInput = {
    extracted_resource_id: string
  }

  export type extracted_resource_labelsCreateOrConnectWithoutLabelsInput = {
    where: extracted_resource_labelsWhereUniqueInput
    create: XOR<extracted_resource_labelsCreateWithoutLabelsInput, extracted_resource_labelsUncheckedCreateWithoutLabelsInput>
  }

  export type extracted_resource_labelsCreateManyLabelsInputEnvelope = {
    data: Enumerable<extracted_resource_labelsCreateManyLabelsInput>
    skipDuplicates?: boolean
  }

  export type session_labelsCreateWithoutLabelsInput = {
    sessions: sessionsCreateNestedOneWithoutSession_labelsInput
  }

  export type session_labelsUncheckedCreateWithoutLabelsInput = {
    session_id: string
  }

  export type session_labelsCreateOrConnectWithoutLabelsInput = {
    where: session_labelsWhereUniqueInput
    create: XOR<session_labelsCreateWithoutLabelsInput, session_labelsUncheckedCreateWithoutLabelsInput>
  }

  export type session_labelsCreateManyLabelsInputEnvelope = {
    data: Enumerable<session_labelsCreateManyLabelsInput>
    skipDuplicates?: boolean
  }

  export type extracted_resource_labelsUpsertWithWhereUniqueWithoutLabelsInput = {
    where: extracted_resource_labelsWhereUniqueInput
    update: XOR<extracted_resource_labelsUpdateWithoutLabelsInput, extracted_resource_labelsUncheckedUpdateWithoutLabelsInput>
    create: XOR<extracted_resource_labelsCreateWithoutLabelsInput, extracted_resource_labelsUncheckedCreateWithoutLabelsInput>
  }

  export type extracted_resource_labelsUpdateWithWhereUniqueWithoutLabelsInput = {
    where: extracted_resource_labelsWhereUniqueInput
    data: XOR<extracted_resource_labelsUpdateWithoutLabelsInput, extracted_resource_labelsUncheckedUpdateWithoutLabelsInput>
  }

  export type extracted_resource_labelsUpdateManyWithWhereWithoutLabelsInput = {
    where: extracted_resource_labelsScalarWhereInput
    data: XOR<extracted_resource_labelsUpdateManyMutationInput, extracted_resource_labelsUncheckedUpdateManyWithoutExtracted_resource_labelsInput>
  }

  export type session_labelsUpsertWithWhereUniqueWithoutLabelsInput = {
    where: session_labelsWhereUniqueInput
    update: XOR<session_labelsUpdateWithoutLabelsInput, session_labelsUncheckedUpdateWithoutLabelsInput>
    create: XOR<session_labelsCreateWithoutLabelsInput, session_labelsUncheckedCreateWithoutLabelsInput>
  }

  export type session_labelsUpdateWithWhereUniqueWithoutLabelsInput = {
    where: session_labelsWhereUniqueInput
    data: XOR<session_labelsUpdateWithoutLabelsInput, session_labelsUncheckedUpdateWithoutLabelsInput>
  }

  export type session_labelsUpdateManyWithWhereWithoutLabelsInput = {
    where: session_labelsScalarWhereInput
    data: XOR<session_labelsUpdateManyMutationInput, session_labelsUncheckedUpdateManyWithoutSession_labelsInput>
  }

  export type session_labelsScalarWhereInput = {
    AND?: Enumerable<session_labelsScalarWhereInput>
    OR?: Enumerable<session_labelsScalarWhereInput>
    NOT?: Enumerable<session_labelsScalarWhereInput>
    session_id?: UuidFilter | string
    label_id?: UuidFilter | string
  }

  export type labelsCreateWithoutSession_labelsInput = {
    id?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    name: string
    abbreviation: string
    extracted_resource_labels?: extracted_resource_labelsCreateNestedManyWithoutLabelsInput
  }

  export type labelsUncheckedCreateWithoutSession_labelsInput = {
    id?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    name: string
    abbreviation: string
    extracted_resource_labels?: extracted_resource_labelsUncheckedCreateNestedManyWithoutLabelsInput
  }

  export type labelsCreateOrConnectWithoutSession_labelsInput = {
    where: labelsWhereUniqueInput
    create: XOR<labelsCreateWithoutSession_labelsInput, labelsUncheckedCreateWithoutSession_labelsInput>
  }

  export type sessionsCreateWithoutSession_labelsInput = {
    id?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    name: string
    description?: string | null
    user_id: string
    extracted_resources?: extracted_resourcesCreateNestedManyWithoutSessionsInput
  }

  export type sessionsUncheckedCreateWithoutSession_labelsInput = {
    id?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    name: string
    description?: string | null
    user_id: string
    extracted_resources?: extracted_resourcesUncheckedCreateNestedManyWithoutSessionsInput
  }

  export type sessionsCreateOrConnectWithoutSession_labelsInput = {
    where: sessionsWhereUniqueInput
    create: XOR<sessionsCreateWithoutSession_labelsInput, sessionsUncheckedCreateWithoutSession_labelsInput>
  }

  export type labelsUpsertWithoutSession_labelsInput = {
    update: XOR<labelsUpdateWithoutSession_labelsInput, labelsUncheckedUpdateWithoutSession_labelsInput>
    create: XOR<labelsCreateWithoutSession_labelsInput, labelsUncheckedCreateWithoutSession_labelsInput>
  }

  export type labelsUpdateWithoutSession_labelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    extracted_resource_labels?: extracted_resource_labelsUpdateManyWithoutLabelsNestedInput
  }

  export type labelsUncheckedUpdateWithoutSession_labelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    extracted_resource_labels?: extracted_resource_labelsUncheckedUpdateManyWithoutLabelsNestedInput
  }

  export type sessionsUpsertWithoutSession_labelsInput = {
    update: XOR<sessionsUpdateWithoutSession_labelsInput, sessionsUncheckedUpdateWithoutSession_labelsInput>
    create: XOR<sessionsCreateWithoutSession_labelsInput, sessionsUncheckedCreateWithoutSession_labelsInput>
  }

  export type sessionsUpdateWithoutSession_labelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    extracted_resources?: extracted_resourcesUpdateManyWithoutSessionsNestedInput
  }

  export type sessionsUncheckedUpdateWithoutSession_labelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    extracted_resources?: extracted_resourcesUncheckedUpdateManyWithoutSessionsNestedInput
  }

  export type extracted_resourcesCreateWithoutSessionsInput = {
    id?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    resource_path: string
    filetype: resourcetype
    feature?: NullableJsonNullValueInput | InputJsonValue
    raw_resource_id: string
    patient_id: string
    extracted_resource_labels?: extracted_resource_labelsCreateNestedManyWithoutExtracted_resourcesInput
  }

  export type extracted_resourcesUncheckedCreateWithoutSessionsInput = {
    id?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    resource_path: string
    filetype: resourcetype
    feature?: NullableJsonNullValueInput | InputJsonValue
    raw_resource_id: string
    patient_id: string
    extracted_resource_labels?: extracted_resource_labelsUncheckedCreateNestedManyWithoutExtracted_resourcesInput
  }

  export type extracted_resourcesCreateOrConnectWithoutSessionsInput = {
    where: extracted_resourcesWhereUniqueInput
    create: XOR<extracted_resourcesCreateWithoutSessionsInput, extracted_resourcesUncheckedCreateWithoutSessionsInput>
  }

  export type extracted_resourcesCreateManySessionsInputEnvelope = {
    data: Enumerable<extracted_resourcesCreateManySessionsInput>
    skipDuplicates?: boolean
  }

  export type session_labelsCreateWithoutSessionsInput = {
    labels: labelsCreateNestedOneWithoutSession_labelsInput
  }

  export type session_labelsUncheckedCreateWithoutSessionsInput = {
    label_id: string
  }

  export type session_labelsCreateOrConnectWithoutSessionsInput = {
    where: session_labelsWhereUniqueInput
    create: XOR<session_labelsCreateWithoutSessionsInput, session_labelsUncheckedCreateWithoutSessionsInput>
  }

  export type session_labelsCreateManySessionsInputEnvelope = {
    data: Enumerable<session_labelsCreateManySessionsInput>
    skipDuplicates?: boolean
  }

  export type extracted_resourcesUpsertWithWhereUniqueWithoutSessionsInput = {
    where: extracted_resourcesWhereUniqueInput
    update: XOR<extracted_resourcesUpdateWithoutSessionsInput, extracted_resourcesUncheckedUpdateWithoutSessionsInput>
    create: XOR<extracted_resourcesCreateWithoutSessionsInput, extracted_resourcesUncheckedCreateWithoutSessionsInput>
  }

  export type extracted_resourcesUpdateWithWhereUniqueWithoutSessionsInput = {
    where: extracted_resourcesWhereUniqueInput
    data: XOR<extracted_resourcesUpdateWithoutSessionsInput, extracted_resourcesUncheckedUpdateWithoutSessionsInput>
  }

  export type extracted_resourcesUpdateManyWithWhereWithoutSessionsInput = {
    where: extracted_resourcesScalarWhereInput
    data: XOR<extracted_resourcesUpdateManyMutationInput, extracted_resourcesUncheckedUpdateManyWithoutExtracted_resourcesInput>
  }

  export type extracted_resourcesScalarWhereInput = {
    AND?: Enumerable<extracted_resourcesScalarWhereInput>
    OR?: Enumerable<extracted_resourcesScalarWhereInput>
    NOT?: Enumerable<extracted_resourcesScalarWhereInput>
    id?: StringFilter | string
    created_at?: DateTimeNullableFilter | Date | string | null
    updated_at?: DateTimeNullableFilter | Date | string | null
    resource_path?: StringFilter | string
    filetype?: EnumresourcetypeFilter | resourcetype
    feature?: JsonNullableFilter
    raw_resource_id?: StringFilter | string
    patient_id?: StringFilter | string
    session_id?: UuidNullableFilter | string | null
  }

  export type session_labelsUpsertWithWhereUniqueWithoutSessionsInput = {
    where: session_labelsWhereUniqueInput
    update: XOR<session_labelsUpdateWithoutSessionsInput, session_labelsUncheckedUpdateWithoutSessionsInput>
    create: XOR<session_labelsCreateWithoutSessionsInput, session_labelsUncheckedCreateWithoutSessionsInput>
  }

  export type session_labelsUpdateWithWhereUniqueWithoutSessionsInput = {
    where: session_labelsWhereUniqueInput
    data: XOR<session_labelsUpdateWithoutSessionsInput, session_labelsUncheckedUpdateWithoutSessionsInput>
  }

  export type session_labelsUpdateManyWithWhereWithoutSessionsInput = {
    where: session_labelsScalarWhereInput
    data: XOR<session_labelsUpdateManyMutationInput, session_labelsUncheckedUpdateManyWithoutSession_labelsInput>
  }

  export type extracted_resource_labelsCreateManyExtracted_resourcesInput = {
    label_id: string
  }

  export type extracted_resource_labelsUpdateWithoutExtracted_resourcesInput = {
    labels?: labelsUpdateOneRequiredWithoutExtracted_resource_labelsNestedInput
  }

  export type extracted_resource_labelsUncheckedUpdateWithoutExtracted_resourcesInput = {
    label_id?: StringFieldUpdateOperationsInput | string
  }

  export type extracted_resource_labelsUncheckedUpdateManyWithoutExtracted_resource_labelsInput = {
    label_id?: StringFieldUpdateOperationsInput | string
  }

  export type extracted_resource_labelsCreateManyLabelsInput = {
    extracted_resource_id: string
  }

  export type session_labelsCreateManyLabelsInput = {
    session_id: string
  }

  export type extracted_resource_labelsUpdateWithoutLabelsInput = {
    extracted_resources?: extracted_resourcesUpdateOneRequiredWithoutExtracted_resource_labelsNestedInput
  }

  export type extracted_resource_labelsUncheckedUpdateWithoutLabelsInput = {
    extracted_resource_id?: StringFieldUpdateOperationsInput | string
  }

  export type session_labelsUpdateWithoutLabelsInput = {
    sessions?: sessionsUpdateOneRequiredWithoutSession_labelsNestedInput
  }

  export type session_labelsUncheckedUpdateWithoutLabelsInput = {
    session_id?: StringFieldUpdateOperationsInput | string
  }

  export type session_labelsUncheckedUpdateManyWithoutSession_labelsInput = {
    session_id?: StringFieldUpdateOperationsInput | string
  }

  export type extracted_resourcesCreateManySessionsInput = {
    id?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    resource_path: string
    filetype: resourcetype
    feature?: NullableJsonNullValueInput | InputJsonValue
    raw_resource_id: string
    patient_id: string
  }

  export type session_labelsCreateManySessionsInput = {
    label_id: string
  }

  export type extracted_resourcesUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resource_path?: StringFieldUpdateOperationsInput | string
    filetype?: EnumresourcetypeFieldUpdateOperationsInput | resourcetype
    feature?: NullableJsonNullValueInput | InputJsonValue
    raw_resource_id?: StringFieldUpdateOperationsInput | string
    patient_id?: StringFieldUpdateOperationsInput | string
    extracted_resource_labels?: extracted_resource_labelsUpdateManyWithoutExtracted_resourcesNestedInput
  }

  export type extracted_resourcesUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resource_path?: StringFieldUpdateOperationsInput | string
    filetype?: EnumresourcetypeFieldUpdateOperationsInput | resourcetype
    feature?: NullableJsonNullValueInput | InputJsonValue
    raw_resource_id?: StringFieldUpdateOperationsInput | string
    patient_id?: StringFieldUpdateOperationsInput | string
    extracted_resource_labels?: extracted_resource_labelsUncheckedUpdateManyWithoutExtracted_resourcesNestedInput
  }

  export type extracted_resourcesUncheckedUpdateManyWithoutExtracted_resourcesInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resource_path?: StringFieldUpdateOperationsInput | string
    filetype?: EnumresourcetypeFieldUpdateOperationsInput | resourcetype
    feature?: NullableJsonNullValueInput | InputJsonValue
    raw_resource_id?: StringFieldUpdateOperationsInput | string
    patient_id?: StringFieldUpdateOperationsInput | string
  }

  export type session_labelsUpdateWithoutSessionsInput = {
    labels?: labelsUpdateOneRequiredWithoutSession_labelsNestedInput
  }

  export type session_labelsUncheckedUpdateWithoutSessionsInput = {
    label_id?: StringFieldUpdateOperationsInput | string
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