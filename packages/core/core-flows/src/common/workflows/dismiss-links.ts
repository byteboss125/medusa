import { LinkDefinition } from "@medusajs/modules-sdk"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { dismissRemoteLinkStep } from "../steps/dismiss-remote-links"

export const dismissLinksWorkflowId = "dismiss-link"
export const dismissLinksWorkflow = createWorkflow(
  dismissLinksWorkflowId,
  (input: WorkflowData<LinkDefinition[]>) => {
    return dismissRemoteLinkStep(input)
  }
)
