import { Constructor, IDmlEntity, ModuleExports } from "@medusajs/types"
import { MedusaServiceModelObjectsSymbol } from "./medusa-service"
import {
  buildLinkConfigFromLinkableKeys,
  buildLinkConfigFromModelObjects,
  defineJoinerConfig,
} from "./joiner-config-builder"
import { InfersLinksConfig } from "./types/links-config"
import { DmlEntity } from "../dml"

/**
 * Wrapper to build the module export and auto generate the joiner config if not already provided in the module service, as well as
 * return a linkable object based on the models
 *
 * @param serviceName
 * @param service
 * @param loaders
 */
export function Module<
  const ServiceName extends string,
  const Service extends Constructor<any>,
  ModelObjects extends Record<string, IDmlEntity<any, any>> = Service extends {
    $modelObjects: any
  }
    ? Service["$modelObjects"]
    : {},
  Linkable = keyof ModelObjects extends never
    ? Record<string, any>
    : InfersLinksConfig<ServiceName, ModelObjects>
>(
  serviceName: ServiceName,
  { service, loaders }: ModuleExports<Service>
): ModuleExports<Service> & {
  linkable: Linkable
} {
  const defaultJoinerConfig = defineJoinerConfig(serviceName)
  service.prototype.__joinerConfig ??= () => defaultJoinerConfig

  const modelObjects = service[MedusaServiceModelObjectsSymbol] ?? {}

  let linkable = {} as Linkable

  if (Object.keys(modelObjects)?.length) {
    const dmlObjects = Object.entries(modelObjects).filter(([, model]) =>
      DmlEntity.isDmlEntity(model)
    )

    if (dmlObjects.length) {
      linkable = buildLinkConfigFromModelObjects<ServiceName, ModelObjects>(
        serviceName,
        modelObjects
      ) as Linkable
    } else {
      linkable = buildLinkConfigFromLinkableKeys(
        serviceName,
        defaultJoinerConfig.linkableKeys
      ) as Linkable
    }
  }

  return {
    service,
    loaders,
    linkable,
  }
}
