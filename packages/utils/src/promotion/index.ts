export enum PromotionType {
  STANDARD = "standard",
  BUYGET = "buyget",
}

export enum ApplicationMethodType {
  FIXED = "fixed",
  PERCENTAGE = "percentage",
}

export enum ApplicationMethodTargetType {
  ORDER = "order",
  SHIPPING_METHODS = "shipping_methods",
  ITEMS = "items",
}

export enum ApplicationMethodAllocation {
  EACH = "each",
  ACROSS = "across",
}

export enum PromotionRuleOperator {
  GTE = "gte",
  LTE = "lte",
  GT = "gt",
  LT = "lt",
  EQ = "eq",
  NE = "ne",
  IN = "in",
}

export enum CampaignBudgetType {
  SPEND = "spend",
  USAGE = "usage",
}
