import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { AuthUserDTO, IAuthModuleService } from "@medusajs/types"
import { NextFunction, RequestHandler } from "express"
import { MedusaRequest, MedusaResponse } from "../types/routing"

const SESSION_AUTH = "session"
const BEARER_AUTH = "bearer"

type MedusaSession = {
  auth: {
    [authScope: string]: {
      user_id: string
    }
  }
}

type AuthType = "session" | "bearer"

export default (
  authScope: string,
  authType: AuthType | AuthType[],
  options: { allowUnauthenticated?: boolean } = {}
): RequestHandler => {
  return async (
    req: MedusaRequest,
    res: MedusaResponse,
    next: NextFunction
  ): Promise<void> => {
    const authTypes = Array.isArray(authType) ? authType : [authType]
    const authModule = req.scope.resolve<IAuthModuleService>(
      ModuleRegistrationName.AUTH
    )

    // @ts-ignore
    const session: MedusaSession = req.session || {}

    let authUser: AuthUserDTO | null = null
    if (authTypes.includes(SESSION_AUTH)) {
      if (session.auth && session.auth[authScope]) {
        authUser = await authModule
          .retrieveAuthUser(session.auth[authScope].user_id)
          .catch(() => null)
      }
    }

    if (authTypes.includes(BEARER_AUTH)) {
      const authHeader = req.headers.authorization
      if (authHeader) {
        const re = /(\S+)\s+(\S+)/
        const matches = authHeader.match(re)

        if (matches) {
          const tokenType = matches[1]
          const token = matches[2]
          if (tokenType.toLowerCase() === "bearer") {
            authUser = await authModule
              .retrieveAuthUserFromJwtToken(token, authScope)
              .catch(() => null)
          }
        }
      }
    }

    if (authUser) {
      req.auth_user = {
        id: authUser.id,
        app_metadata: authUser.app_metadata,
        scope: authScope,
      }
      return next()
    }

    if (options.allowUnauthenticated) {
      return next()
    }

    res.status(401).json({ message: "Unauthorized" })
  }
}
