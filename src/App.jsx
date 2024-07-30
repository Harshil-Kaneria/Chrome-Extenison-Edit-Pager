import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Button, message, Avatar, List } from "antd";
import Marquee from 'react-fast-marquee';
import { StopOutlined, EditTwoTone, HighlightOutlined, FileImageTwoTone  } from "@ant-design/icons";

const App = () => {

  const data = [
    {
      title: 'Edit pager',
      description: 'Edit web pages directly within the Chrome tab and capture screenshots effortlessly with this chrome extension.'
    }
  ]

  const [startEditingLoading, setStartEditingLoading] = useState(false);
  const [endEditingLoading, setEndEditingLoading] = useState(false);
  const [screenshotLoading, setScreenshotLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleActivateEditing = () => {
    setStartEditingLoading(true);
    chrome.runtime.sendMessage({ action: 'activateEditing' });
    setTimeout(() => setStartEditingLoading(false), 1000);
    messageApi.open({
      type: 'success',
      content: 'Page editing mode is now active.',
    });
  };

  const handleDeactivateEditing = () => {
    setEndEditingLoading(true);
    chrome.runtime.sendMessage({ action: 'deactivateEditing' });
    setTimeout(() => setEndEditingLoading(false), 1000);
    messageApi.open({
      type: 'warning',
      content: 'Page editing mode has been disabled.',
    });
  };

  const handleScreenshotDownload = () => {
    setScreenshotLoading(true)
    chrome.runtime.sendMessage({ action: 'capture' },(response) => {
      if (response.success) {
        messageApi.open({
          type: 'success',
          content: 'Screenshot taken and saved successfully!',
        });
      } else {
        messageApi.open({
          type: 'error',
          content: 'Failed to capture the screenshot.',
        });
      }
      setScreenshotLoading(false)
    });
  }

  return (
    <>
      <div className="main_body p-3" style={{ backgroundColor: "#f5f4ff" }}>
        <Card
          title={<List
              itemLayout="horizontal"
              dataSource={data}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar
                      style={{
                        backgroundColor: '#4e4e4e',
                      }}
                      icon={<HighlightOutlined />}
                    />}
                    title={item.title}
                    description={<Marquee pauseOnHover gradient={false}>{item.description}</Marquee>}
                  />
                </List.Item>
              )}
            />
          }
          style={{ width: "100%", height: "100%" }}
        >
          <div className="center_button_download">
            <Button
              type="dashed"
              icon={<FileImageTwoTone />}
              loading={screenshotLoading}
              onClick={handleScreenshotDownload}
            >Screenshot
            </Button>
          </div>
          <hr/>
          <div className="center_button">
            <Button
              ghost
              type="primary"
              icon={<EditTwoTone />}
              loading={startEditingLoading}
              onClick={handleActivateEditing}
            >Editing on
            </Button>
            <Button
              danger
              icon={<StopOutlined />}
              loading={endEditingLoading}
              onClick={handleDeactivateEditing}
            >Editing off
            </Button>
          </div>
          {contextHolder}
        </Card>
      </div>
    </>
  );
};

export default App;
