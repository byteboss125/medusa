import {
  CartLineItemDTO,
  Context,
  DAL,
  FilterableLineItemProps,
  FindConfig,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"
import { LineItem } from "@models"
import { LineItemRepository } from "@repositories"
import { CreateLineItemDTO, UpdateLineItemDTO } from "../types"

type InjectedDependencies = {
  lineItemRepository: DAL.RepositoryService
}

export default class LineItemService<TEntity extends LineItem = LineItem> {
  protected readonly lineItemRepository_: DAL.RepositoryService<LineItem>

  constructor({ lineItemRepository }: InjectedDependencies) {
    this.lineItemRepository_ = lineItemRepository
  }

  @InjectManager("lineItemRepository_")
  async retrieve(
    id: string,
    config: FindConfig<CartLineItemDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<LineItem, CartLineItemDTO>({
      id: id,
      entityName: LineItem.name,
      repository: this.lineItemRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("lineItemRepository_")
  async list(
    filters: FilterableLineItemProps = {},
    config: FindConfig<CartLineItemDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<LineItem>(filters, config)

    return (await this.lineItemRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("lineItemRepository_")
  async listAndCount(
    filters: FilterableLineItemProps = {},
    config: FindConfig<CartLineItemDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    const queryOptions = ModulesSdkUtils.buildQuery<LineItem>(filters, config)

    return (await this.lineItemRepository_.findAndCount(
      queryOptions,
      sharedContext
    )) as [TEntity[], number]
  }

  @InjectTransactionManager("lineItemRepository_")
  async create(
    data: CreateLineItemDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.lineItemRepository_ as LineItemRepository).create(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("lineItemRepository_")
  async update(
    data: UpdateLineItemDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const existingLines = await this.list(
      { id: [...data.map((d) => d.id)] },
      {},
      sharedContext
    )

    const existingLinesMap = new Map(
      existingLines.map<[string, LineItem]>((li) => [li.id, li])
    )

    const updates: UpdateLineItemDTO[] = []

    for (const update of data) {
      const lineItem = existingLinesMap.get(update.id)

      if (!lineItem) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Line item with id "${update.id}" not found`
        )
      }

      updates.push({ ...update, id: lineItem.id })
    }

    return (await (this.lineItemRepository_ as LineItemRepository).update(
      updates,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("lineItemRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.lineItemRepository_.delete(ids, sharedContext)
  }
}
