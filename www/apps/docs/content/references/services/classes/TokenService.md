# TokenService

## Constructors

### constructor

**new TokenService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | `InjectedDependencies` |

#### Defined in

[medusa/src/services/token.ts:16](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/token.ts#L16)

## Properties

### configModule\_

 `Protected` `Readonly` **configModule\_**: `ConfigModule`

#### Defined in

[medusa/src/services/token.ts:14](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/token.ts#L14)

___

### RESOLUTION\_KEY

 `Static` **RESOLUTION\_KEY**: `string`

#### Defined in

[medusa/src/services/token.ts:12](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/token.ts#L12)

## Methods

### signToken

**signToken**(`data`, `options?`): `string`

#### Parameters

| Name |
| :------ |
| `data` | `string` \| `object` \| `Buffer` |
| `options?` | `SignOptions` |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

[medusa/src/services/token.ts:34](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/token.ts#L34)

___

### verifyToken

**verifyToken**(`token`, `options?`): `string` \| `Jwt` \| `JwtPayload`

#### Parameters

| Name |
| :------ |
| `token` | `string` |
| `options?` | `VerifyOptions` |

#### Returns

`string` \| `Jwt` \| `JwtPayload`

-`string \| Jwt \| JwtPayload`: (optional) 

#### Defined in

[medusa/src/services/token.ts:20](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/token.ts#L20)
