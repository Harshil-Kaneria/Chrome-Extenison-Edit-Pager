import React, { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Button, message, Avatar, List, Divider } from "antd";
import Marquee from 'react-fast-marquee';
import { StopOutlined, EditTwoTone, HighlightOutlined, FileImageTwoTone } from "@ant-design/icons";

const App = () => {
  const [screenshotLoading, setScreenshotLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleMessageResponse = (action, successMessage, errorMessage) => {
    return (response) => {
      if (response.success) {
        messageApi.open({
          type: 'success',
          content: successMessage,
        });
      } else {
        messageApi.open({
          type: 'error',
          content: errorMessage,
        });
      }
    };
  };

  const handleActivateEditing = () => {
    chrome.runtime.sendMessage({ action: 'activateEditing' }, handleMessageResponse(
      'activateEditing',
      'Page editing mode is now active.',
      'Failed to activate page editing mode.'
    ));
  };

  const handleDeactivateEditing = () => {
    chrome.runtime.sendMessage({ action: 'deactivateEditing' }, handleMessageResponse(
      'deactivateEditing',
      'Page editing mode has been disabled.',
      'Failed to deactivate page editing mode.'
    ));
  };

  const handleScreenshotDownload = () => {
    setScreenshotLoading(true);
    chrome.runtime.sendMessage({ action: 'capture' }, handleMessageResponse(
      'capture',
      'Screenshot taken and saved successfully!',
      'Failed to capture the screenshot.'
    ));
    setScreenshotLoading(false);
  };

  const data = [
    {
      title: 'Edit pager',
      description: 'Edit web pages directly within the Chrome tab and capture screenshots effortlessly with this extension.'
    }
  ];

  return (
    <div className="main_body p-3" style={{ backgroundColor: "#f5f4ff" }}>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar
                style={{ backgroundColor: '#4e4e4e' }}
                icon={<HighlightOutlined />}
              />}
              title={item.title}
              description={<Marquee pauseOnHover gradient={false}>{item.description}</Marquee>}
            />
          </List.Item>
        )}
      />
      <Card style={{ width: "100%" }}>
        <div className="center_button">
          <Button
            ghost
            type="primary"
            icon={<EditTwoTone />}
            onClick={handleActivateEditing}
          >
            Editing on
          </Button>
          <Button
            danger
            icon={<StopOutlined />}
            onClick={handleDeactivateEditing}
          >
            Editing off
          </Button>
        </div>
        <Divider className="mt-3 mb-3" dashed />
        <div className="center_button_download">
          <Button
            type="dashed"
            icon={<FileImageTwoTone />}
            loading={screenshotLoading}
            onClick={handleScreenshotDownload}
          >
            Screenshot
          </Button>
        </div>
        {contextHolder}
      </Card>
    </div>
  );
};

export default App;