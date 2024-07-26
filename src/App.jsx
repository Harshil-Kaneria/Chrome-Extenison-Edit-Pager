import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card,Button,Divider } from 'antd';
import { StopOutlined,EditOutlined } from '@ant-design/icons';

const App = () => {
  const [mainLoadings, setMainLoadings] = useState(true);
  const [startEditingLoading, setStartEditingLoading] = useState(false);
  const [endEditingLoading, setEndEditingLoading] = useState(false);
  setTimeout(() => {
    setMainLoadings(false)
  }, 1500);
  return (
    <>
      <div
        className="main_body p-3"
        style={{ backgroundColor: '#f5f4ff' }}
      >
        <Card loading={mainLoadings} title={<Divider>Edit Pager</Divider>
        } style={{ width: '100%', height:'100%' }}><div className="center_button">
            <Button
              ghost
              type="primary"
              icon={<EditOutlined />}
              loading={startEditingLoading}
              onClick={() => {
                setStartEditingLoading(true)
                setTimeout(() => {
                  setStartEditingLoading(false)
                }, 1000);
              }}
            >
              On editing
            </Button>
            <Button
              danger
              icon={<StopOutlined />}
              loading={endEditingLoading}
              onClick={() => {
                setEndEditingLoading(true)
                setTimeout(() => {
                  setEndEditingLoading(false)
                }, 1000);
              }}
            >
              Off editing
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default App;
