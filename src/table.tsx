import React, { useState } from "react";
import {
  Alert,
  Table as AntTable,
  Button,
  ConfigProvider,
  message,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { DocumentData, SortOption, TableProps } from "./types";
import { PAGE_SIZE } from "./constants";
import "./table.css";
import DocumentModal from "./documentModal";
import { useDocumentsQuery, fetchZip } from "./service";
import { SorterResult, TablePaginationConfig } from "antd/es/table/interface";

const Table: React.FC<TableProps> = ({ searchTerms }) => {
  const [sortOption, setSortOption] = useState<SortOption>({});
  const [pageNum, setPageNum] = useState<number>(1);

  const [selectedDocs, setSelectedDocs] = useState<React.Key[]>([]);
  const [openedDoc, setOpenedDoc] = useState<DocumentData>({} as DocumentData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useDocumentsQuery(
    searchTerms,
    pageNum,
    sortOption
  );

  if (isError) {
    return (
      <Alert
        message={"Error fetching document data. Please try again"}
        type="error"
      ></Alert>
    );
  }

  let numDocs: number | undefined = undefined;
  let documents: DocumentData[] | undefined = undefined;

  if (data) {
    [numDocs, documents] = data;
  }

  const columns: ColumnsType<DocumentData> = [
    {
      title: "Document Name",
      dataIndex: "documentName",
      render: (text, doc) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            setOpenedDoc(doc);
            setIsModalOpen(true);
          }}
        >
          {text}
        </a>
      ),
      ellipsis: true,
      sorter: true,
      width: "23%",
    },
    {
      title: "Project Name",
      dataIndex: "projectName",
      render: (text) => <>{text}</>,
      ellipsis: true,
      sorter: true,
      width: "17%",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      render: (text) => <>{text}</>,
      ellipsis: true,
      sorter: true,
      width: "17%",
    },
    {
      title: "Resource",
      dataIndex: "resource",
      render: (text) => <>{text}</>,
      ellipsis: true,
      sorter: true,
      width: "19%",
    },
    {
      title: "Committment Period",
      dataIndex: "commitment_period",
      render: (_, doc) => (
        <>{`${doc.startDate.slice(-4)} - ${doc.endDate.slice(-4)}`}</>
      ),
      ellipsis: true,
    },
  ];

  // TODO: Fix this unnecessarily big download function
  const downloadSelected = async () => {
    try {
      const base64obj = await fetchZip(selectedDocs as number[]);
      const base64str = base64obj["zipFiles"][0];
      const byteCharacters = atob(base64str);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      const url = window.URL.createObjectURL(
        new Blob(byteArrays, { type: "application/zip" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "documents.zip");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch {
      message.error(`Could not download selected files. Please try again.`, 5);
    }
  };

  const moveModal = (direction: "left" | "right") => {
    if (documents === undefined) {
      return;
    }
    if (direction === "left") {
      setOpenedDoc(
        documents[
          documents.indexOf(openedDoc) - 1 < 0
            ? documents.length - 1
            : documents.indexOf(openedDoc) - 1
        ]
      );
    } else {
      setOpenedDoc(
        documents[
          documents.indexOf(openedDoc) + 1 > documents.length - 1
            ? 0
            : documents.indexOf(openedDoc) + 1
        ]
      );
    }
  };

  // Helper function for row-click selection functionality
  const selectRow = (doc: DocumentData) => {
    const newSelectedRowKeys = [...selectedDocs];
    if (newSelectedRowKeys.indexOf(doc.attachmentId) >= 0) {
      newSelectedRowKeys.splice(
        newSelectedRowKeys.indexOf(doc.attachmentId),
        1
      );
    } else {
      newSelectedRowKeys.push(doc.attachmentId);
    }
    setSelectedDocs(newSelectedRowKeys);
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _: any,
    sorter: SorterResult<DocumentData> | SorterResult<DocumentData>[]
  ) => {
    setPageNum(pagination.current as number);
    if (!Array.isArray(sorter)) {
      setSortOption({
        sortField: sorter.field as string,
        sortOrder: sorter.order as string,
      });
    }
  };

  const rowClassName = (index: number) =>
    index % 2 === 0 ? "even-row" : "odd-row";

  const footerContent = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        borderBottomRightRadius: "6px",
        borderBottomLeftRadius: "6px",
      }}
    >
      <Button
        type="primary"
        disabled={selectedDocs.length === 0}
        size="middle"
        onClick={downloadSelected}
      >
        {`Download ${selectedDocs.length} items`}
      </Button>
    </div>
  );

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            bodySortBg: "rgba(0,0,0,0)",
            borderColor: "#e0e0e0",
            headerBorderRadius: 6,
            borderRadius: 6,
            cellFontSizeSM: 13,
            rowHoverBg: "#e1effa",
            headerBg: "white",
            headerSortHoverBg: "#f0f0f0",
            headerSortActiveBg: "#f0f0f0",
            footerBg: "white",
          },
        },
      }}
    >
      <div
        className="table-shadow"
        style={{
          borderRadius: "6px",
          boxShadow: "0px 0px 3px 1px hsl(43, 47%, 80%)",
        }}
      >
        <AntTable
          columns={columns}
          loading={isLoading}
          dataSource={documents}
          rowSelection={{
            selectedRowKeys: selectedDocs,
            onSelect: (doc, _, __, ___) => selectRow(doc),
          }}
          onRow={(doc) => {
            return {
              onClick: () => {
                selectRow(doc);
              },
            };
          }}
          pagination={{
            current: pageNum,
            pageSize: PAGE_SIZE,
            total: numDocs,
            size: "default",
            rootClassName: "pagination-root",
            showLessItems: true,
            showSizeChanger: false,
          }}
          footer={() => footerContent}
          className="main-table"
          size="small"
          onChange={handleTableChange}
          rowClassName={(_, index) => rowClassName(index)}
          rowKey={"attachmentId"}
        ></AntTable>
      </div>
      {isModalOpen && (
        <DocumentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onMove={moveModal}
          ISOdocument={openedDoc}
        ></DocumentModal>
      )}
    </ConfigProvider>
  );
};

export default Table;
