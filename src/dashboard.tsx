import React, { useState } from "react";
import Table from "./table";
import Search from "./search";
import "./dashboard.css";
import { Button } from "antd";
import Logo from "./images/logo.png";
import { LoginProps, SearchTerms } from "./types";

const Dashboard: React.FC<LoginProps> = ({ setLoggedIn }) => {
  const [searchTerms, setSearchTerms] = useState<SearchTerms>({
    auction_period: undefined,
    auction_type: undefined,
    commitment_period: undefined,
    customer: undefined,
    document: undefined,
    project: undefined,
    proposal_label: undefined,
    resource: undefined,
  });

  return (
    <div className="dashboard-container">
      <div className="banner">
        <img className="logo" src={Logo} alt="logo" width={83} height={50} />
        <Button
          type="text"
          danger
          onClick={() => setLoggedIn(false)}
          className="profile-button"
        >
          Log Out
        </Button>
      </div>
      <main className="content">
        <div className="search-container">
          <Search searchTerms={searchTerms} setSearchTerms={setSearchTerms} />
        </div>
        <div className="table-container">
          <Table searchTerms={searchTerms} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
