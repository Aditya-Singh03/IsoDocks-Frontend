import {
  RawDocumentDetailData,
  DocumentData,
  RawDocumentData,
  FieldType,
  SearchTerms,
  SortOption,
} from "./types";
import { LOCAL_SERVER_PORT, PAGE_SIZE } from "./constants";
import { useQuery } from "react-query";
import { toDocumentData, toBackendSearchParams } from "./utils";

export const checkLoginCredentials = async (res: FieldType) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:${LOCAL_SERVER_PORT}/logIn`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(res),
      }
    );
    if (response.ok) {
      const data = await response.json();
      if (data.message === "Log-in successful") {
        return data;
      }
    }
    return Promise.reject("Bad response");
  } catch (failedResponse) {
    return Promise.reject("Failed fetch");
  }
};

export const fetchZip = async (attachmentIds: number[]) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:${LOCAL_SERVER_PORT}/zipFiles?attachment_ids=${attachmentIds.join(
        ","
      )}`
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return Promise.reject("Bad response");
  } catch {
    return Promise.reject(`Failed fetch`);
  }
};

const toBackendSortField: Record<string, string> = {
  documentName: "file_name",
  projectName: "project_name",
  customer: "customer_name",
  resource: "resource_name",
};

const fetchRawDocuments: (
  searchParams: SearchTerms,
  pageNum: number,
  sortOption: SortOption
) => Promise<RawDocumentData[]> = async (searchParams, pageNum, sortOption) => {
  try {
    let queryStr = "?";
    if (!Object.values(searchParams).every((e) => e === undefined)) {
      queryStr += Object.entries(toBackendSearchParams(searchParams))
        .map(([key, value]) => key + "=" + value)
        .join("&");
    }
    if (pageNum > 1) {
      queryStr += "&page=" + pageNum;
    }
    if (sortOption.sortField && sortOption.sortOrder) {
      queryStr += "&sortBy=" + toBackendSortField[sortOption.sortField];
    }
    queryStr += "&lim=" + PAGE_SIZE;
    const response = await fetch(
      `http://127.0.0.1:${LOCAL_SERVER_PORT}/filterDocs${queryStr}`
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return Promise.reject("Bad response");
  } catch {
    return Promise.reject(`Failed fetch`);
  }
};

export const useDocumentsQuery = (
  searchParams: SearchTerms,
  pageNum: number,
  sortOption: SortOption
) => {
  return useQuery<[number, DocumentData[]]>({
    queryKey: [...Object.values(searchParams), pageNum, sortOption],
    queryFn: () =>
      fetchRawDocuments(searchParams, pageNum, sortOption).then((rawDocs) => {
        if (rawDocs.length === 0) {
          return [0, []];
        }
        const numDocs = Number(rawDocs[0].itemCount);
        return [numDocs, rawDocs.map(toDocumentData)];
      }),
  });
};

const fetchRawDocumentDetail: (
  id: number
) => Promise<RawDocumentDetailData> = async (attachmentId: number) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:${LOCAL_SERVER_PORT}/documentDetail?attachment_id=${attachmentId}`
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return Promise.reject("Bad response");
  } catch {
    return Promise.reject(`Failed fetch`);
  }
};

export const useRawDocumentDetailQuery = (id: number) => {
  return useQuery<RawDocumentDetailData>({
    queryKey: [id],
    queryFn: () => fetchRawDocumentDetail(id),
  });
};
