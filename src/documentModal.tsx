import React from "react";
import { DocumentModalProps, SimpleDocumentAttributeProps } from "./types";
import { Button, Modal, message } from "antd";
import "./documentModal.css";
import { useRawDocumentDetailQuery, fetchZip } from "./service";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import DocViewer, {
  DocViewerRenderers,
  IDocument,
} from "@cyntler/react-doc-viewer";
import { lookup } from "mimeish";
import * as XLSX from "xlsx";

const SimpleDocumentAttribute: React.FC<SimpleDocumentAttributeProps> = ({
  label,
  content,
}) => (
  <div className="document-attr-container">
    <p className="document-attr-label">{label}</p>
    <p className="document-attr-content">{content || "N/A"}</p>
  </div>
);

const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  ISOdocument,
  onMove,
}) => {
  const { data, isLoading, isError } = useRawDocumentDetailQuery(
    ISOdocument.attachmentId as number
  );

  const downloadSelected = async () => {
    try {
      const base64obj = await fetchZip([ISOdocument.attachmentId as number]);
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
      message.error(`Could not download file. Please try again.`, 5);
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      centered
      width="min(1080px, 70%)"
      footer={null}
    >
      <main className="modal-content">
        <div className="document-content">
          {(() => {
            const docs: IDocument[] = [];
            if (!isError && !isLoading && data && data.base64) {
              const mimeType = lookup.mime(ISOdocument.documentName);
              const fileExtension = ISOdocument.documentName.split(".").pop();
              if (fileExtension === "xlsm" || fileExtension === "xlsx") {
                const workbook = XLSX.read(data.base64, { type: "base64" });
                const csv = XLSX.utils.sheet_to_csv(
                  workbook.Sheets[workbook.SheetNames[0]]
                );
                console.log(csv);
                const csvBase64 = btoa(encodeURIComponent(csv));

                docs.push({
                  uri: `data:text/csv,${csv}`,
                  fileName: ISOdocument.documentName,
                });
              } else {
                docs.push({
                  uri: `data:${mimeType};base64,${data.base64}`,
                  fileName: ISOdocument.documentName,
                });
              }
            }

            //TODO preview still does not work
            return (
              <DocViewer
                documents={docs}
                pluginRenderers={DocViewerRenderers}
              />
            );
          })()}
        </div>
        <div className="non-document-content">
          <div className="document-details">
            <h2 className="document-title">{ISOdocument.documentName}</h2>
            <SimpleDocumentAttribute
              label="Project Name"
              content={ISOdocument.projectName}
            />
            <SimpleDocumentAttribute
              label="Project Type"
              content={ISOdocument.projectType}
            />
            <SimpleDocumentAttribute
              label="Customer"
              content={ISOdocument.customer}
            />
            <SimpleDocumentAttribute
              label="Resource"
              content={ISOdocument.resource}
            />
            <SimpleDocumentAttribute
              label="Commitment Period"
              content={`${ISOdocument.startDate} - ${ISOdocument.endDate}`}
            />
            <SimpleDocumentAttribute
              label="Auction Type"
              content={ISOdocument.auctionType}
            />
            <SimpleDocumentAttribute
              label="Auction Period"
              content={`${ISOdocument.auctionStart} - ${ISOdocument.auctionEnd}`}
            />
            <SimpleDocumentAttribute
              label="Proposal Label"
              content={ISOdocument.proposalLabel}
            />
            <SimpleDocumentAttribute
              label="Document Type"
              content={ISOdocument.attachmentType}
            />
            <SimpleDocumentAttribute
              label="File Size"
              content={String(data?.metaData.fileSize) + " bytes"}
            />
          </div>
          <Button style={{ margin: 5 }} onClick={() => onMove("left")}>
            <ArrowLeftOutlined></ArrowLeftOutlined>
          </Button>
          <Button
            type="primary"
            className="download-button"
            onClick={downloadSelected}
          >
            Download
          </Button>
          <Button style={{ margin: 5 }} onClick={() => onMove("right")}>
            <ArrowRightOutlined></ArrowRightOutlined>
          </Button>
        </div>
      </main>
    </Modal>
  );
};

export default DocumentModal;
