// Data Types

export type DocumentData = {
  attachmentId: React.Key;
  documentName: string;
  projectName: string;
  projectType: string;
  customer: string;
  resource: string;
  resourceType: string;
  startDate: string;
  endDate: string;
  periodType: string;
  auctionType: string;
  proposalLabel: string;
  attachmentType: string;
  auctionStart: string;
  auctionEnd: string;
};

export type RawDocumentData = {
  attachmentId: string;
  file_name: string;
  projectName: string;
  projectType: string;
  custName: string;
  resourceName: string;
  resourceType: string;
  beginDate: string;
  endDate: string;
  periodType: string;
  aucType: string;
  proposalLabel: string;
  attachmentType: string;
  aucBeginDate: string;
  aucEndDate: string;
  itemCount: string;
};

export type RawDocumentDetailData = {
  base64: string;
  metaData: {
    documentName: string;
    projectName: string;
    projectType: string;
    periodStart: string;
    periodEnd: string;
    periodType: string;
    customer: string;
    resource: string;
    resourceType: string;
    auctionType: string;
    proposalLabel: string;
    attachmentType: string;
    fileSize: number;
  };
};

// Props

export type LoginProps = {
  setLoggedIn: (status: boolean) => void;
};

export type DocumentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  ISOdocument: DocumentData;
  onMove: (direction: "left" | "right") => void;
};

export type SimpleDocumentAttributeProps = {
  label: string;
  content?: string;
};

export type SearchProps = {
  searchTerms: SearchTerms;
  setSearchTerms: (newSearch: SearchTerms) => void;
};

export type TableProps = {
  searchTerms: SearchTerms;
};

// Miscellaneous

export type FieldType = {
  username?: string;
  password?: string;
};

export type SearchTerms = {
  auction_period?: Date[];
  auction_type?: string;
  commitment_period?: Date[];
  customer?: string;
  document?: string;
  project?: string;
  proposal_label?: string;
  resource?: string;
};

export type Date = {
  $M: number;
  $D: number;
  $y: number;
};

export type SortOption = {
  sortField?: string;
  sortOrder?: string;
};
