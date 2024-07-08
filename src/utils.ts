import { DocumentData, RawDocumentData, SearchTerms } from "./types";

export const toDocumentData = (document: RawDocumentData) =>
  ({
    attachmentId: Number(document.attachmentId),
    documentName: document.file_name,
    projectName: document.projectName,
    projectType: document.projectType,
    customer: document.custName,
    resource: document.resourceName,
    resourceType: document.resourceType,
    startDate:
      document.beginDate.split("-")[1] +
      "/" +
      document.beginDate.split("-")[2] +
      "/" +
      document.beginDate.split("-")[0],
    endDate:
      document.endDate.split("-")[1] +
      "/" +
      document.endDate.split("-")[2] +
      "/" +
      document.endDate.split("-")[0],
    periodType: document.periodType,
    auctionType: document.aucType,
    proposalLabel: document.proposalLabel,
    attachmentType: document.attachmentType,
    auctionStart:
      document.aucBeginDate.split("-")[1] +
      "/" +
      document.aucBeginDate.split("-")[2] +
      "/" +
      document.aucBeginDate.split("-")[0],
    auctionEnd:
      document.aucEndDate.split("-")[1] +
      "/" +
      document.aucEndDate.split("-")[2] +
      "/" +
      document.aucEndDate.split("-")[0],
  } as DocumentData);

export const toBackendSearchParams = (s: SearchTerms) => {
  const query: { [k: string]: string } = {};
  if (s.project !== undefined) {
    query["project_name"] = s.project;
  }
  if (s.customer !== undefined) {
    query["customer_name"] = s.customer;
  }
  if (s.proposal_label !== undefined) {
    query["proposal_label"] = s.proposal_label;
  }
  if (s.resource !== undefined) {
    query["resource_name"] = s.resource;
  }
  if (s.auction_type !== undefined) {
    query["auction_type"] = s.auction_type;
  }
  if (s.document !== undefined) {
    query["file_name"] = s.document;
  }
  if (s.auction_period !== undefined) {
    query["auc_begin_date"] =
      s.auction_period[0].$M +
      "-" +
      s.auction_period[0].$D +
      "-" +
      s.auction_period[0].$y;
    query["auc_end_date"] =
      s.auction_period[1].$M +
      "-" +
      s.auction_period[1].$D +
      "-" +
      s.auction_period[1].$y;
  }
  if (s.commitment_period !== undefined) {
    query["commitment_begin_date"] =
      s.commitment_period[0].$M +
      "-" +
      s.commitment_period[0].$D +
      "-" +
      s.commitment_period[0].$y;
    query["commitment_end_date"] =
      s.commitment_period[1].$M +
      "-" +
      s.commitment_period[1].$D +
      "-" +
      s.commitment_period[1].$y;
  }
  return query;
};
