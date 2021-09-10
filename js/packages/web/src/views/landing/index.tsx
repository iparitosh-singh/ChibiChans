import { Layout, Button } from 'antd';
import React from 'react';
import { PreSaleBanner } from '../../components/PreSaleBanner';
import { Link } from 'react-router-dom';

export const LandingView = () => {
  return (
    <Layout style={{ margin: 0, marginTop: 10, alignItems:'center' }}>
      <h1 style={{ fontSize: '36px', textAlign: 'center' }}>
        Welcome To The Chibi World
      </h1>
      <img style={{ marginBottom: 50 }} src="ChibiChans/ImageFiles/bg.jpg" alt="BG Chibichans" width="800" height="600"></img>
      {/* <Link to={`/generate`}>
        <Button className="app-btn">Mint a Customized Chibi</Button>
      </Link>
      <Link to={`/pet/create/`}>
        <Button className="app-btn">Get a Pet for your Chibi</Button>
      </Link> */}
    </Layout>
  );
};
