import React from "react";
import {
  Button,
  Form,
  Input,
  ConfigProvider,
  Typography,
  DatePicker,
} from "antd";
import "./search.css";
import { SearchProps, SearchTerms } from "./types";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const dateFormat = "MM/DD/YYYY";

const Search: React.FC<SearchProps> = ({ searchTerms, setSearchTerms }) => {
  const [searchForm] = Form.useForm();

  const OnSearch = async () => {
    const res: SearchTerms = searchForm.getFieldsValue();
    setSearchTerms(res);
  };

  const onClear = () => {
    searchForm.resetFields();
    setSearchTerms({
      auction_period: undefined,
      auction_type: undefined,
      commitment_period: undefined,
      customer: undefined,
      document: undefined,
      project: undefined,
      proposal_label: undefined,
      resource: undefined,
    });
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            colorBgContainer: "#FBF9F4",
            colorBorder: "#EBE9E4",
            borderRadius: 4,
          },
          DatePicker: {
            colorBgContainer: "#FBF9F4",
            colorBorder: "#EBE9E4",
            borderRadius: 4,
          },
          Form: {
            fontSize: 12,
            itemMarginBottom: 8,
            verticalLabelPadding: "0 0 2px",
          },
          Button: {
            paddingInline: 28,
          },
        },
      }}
    >
      <Typography.Title
        level={3}
        style={{ textAlign: "left", color: "#0A94D7", fontWeight: "300" }}
      >
        Search
      </Typography.Title>
      <Form form={searchForm} layout={"vertical"} style={{ flex: 1 }}>
        <div className="search-section">
          <Form.Item label="Customer" name="customer">
            <Input placeholder="Example Customer" />
          </Form.Item>
          <Form.Item name="project" label="Project">
            <Input placeholder="Example Project" />
          </Form.Item>
          <Form.Item name="commitment_period" label="Commitment Period">
            <RangePicker format={dateFormat} />
          </Form.Item>
          <Form.Item name="resource" label="Resource">
            <Input placeholder="Example Resource" />
          </Form.Item>
          <Form.Item name="proposal_label" label="Proposal Label">
            <Input placeholder="Example Label" />
          </Form.Item>
        </div>
        <div className="search-section">
          <Form.Item label="Document" name="document">
            <Input placeholder="Example Document" />
          </Form.Item>
          <Form.Item label="Auction Type" name="auction_type">
            <Input placeholder="Example Auction Type" />
          </Form.Item>
          <Form.Item label="Auction Period" name="auction_period">
            <RangePicker format={dateFormat} />
          </Form.Item>
        </div>
        <div className="search-buttons-container">
          <Button htmlType="button" onClick={onClear} className="search-button">
            Clear All
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            onClick={OnSearch}
            className="search-button"
          >
            Search
          </Button>
        </div>
      </Form>
    </ConfigProvider>
  );
};

export default Search;
