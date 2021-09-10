import { useWallet } from '@solana/wallet-adapter-react';
import { Col, Layout, Row, Tabs, Card, Button } from 'antd';
import BN from 'bn.js';
import React, { useMemo, useState } from 'react';
import Masonry from 'react-masonry-css';
import { Link } from 'react-router-dom';
import { AuctionRenderCard } from '../../components/AuctionRenderCard';
import { CardLoader } from '../../components/MyLoader';
import { PreSaleBanner } from '../../components/PreSaleBanner';
import { useMeta } from '../../contexts';
import { AuctionView, AuctionViewState, useAuctions } from '../../hooks';
export var choice_skin,choice_tee,choice_pant,choice_eye,choice_hair;
const { TabPane } = Tabs;
const { Content } = Layout;
const { Meta } = Card;

export enum LiveAuctionViewState {
  All = '0',
  Participated = '1',
  Ended = '2',
  Resale = '3',
}

export const AuctionListView = () => {
  const auctions = useAuctions(AuctionViewState.Live);
  const auctionsEnded = useAuctions(AuctionViewState.Ended);
  const [activeKey, setActiveKey] = useState(LiveAuctionViewState.All);
  const { isLoading } = useMeta();
  const { connected, publicKey } = useWallet();
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };
  // const [showStep_hair, setShowStep_hair] = useState(false);
  // const [showStep_pant, setShowStep_pant] = useState(false);
  // const [showStep_skin, setShowStep_skin] = useState(false);
  // const [showStep_tee, setShowStep_tee] = useState(false);
  // const [showStep_completed, setShowStep_completed] = useState(false);
  const [showStep, setShowStep] = useState({
    skin: true,
    tee: false,
    pant: false,
    eye: false,
    hair: false,
    completed: false,
  });
  const onClick_skin1 = () => { 
    choice_skin=1
    setShowStep({
      skin: false,
      tee: true,
      pant: false,
      eye: false,
      hair: false,
      completed: false,
    })
  }
  const onClick_skin2 = () => {
    choice_skin=2 
    setShowStep({
      skin: false,
      tee: true,
      pant: false,
      eye: false,
      hair: false,
      completed: false,
    })
  }
  const onClick_skin3 = () => {
    choice_skin=3 
    setShowStep({
      skin: false,
      tee: true,
      pant: false,
      eye: false,
      hair: false,
      completed: false,
    })
  }
  const onClick_skin4 = () => { 
    choice_skin=4
    setShowStep({
      skin: false,
      tee: true,
      pant: false,
      eye: false,
      hair: false,
      completed: false,
    })
  }
  const onClick_skin5 = () => { 
    choice_skin=5
    setShowStep({
      skin: false,
      tee: true,
      pant: false,
      eye: false,
      hair: false,
      completed: false,
    })
  }
  const onClick_tee1 = () => { 
    choice_tee=1
    setShowStep({
      skin: false,
      tee: false,
      pant: true,
      eye: false,
      hair: false,
      completed: false,
    })
  }
  const onClick_tee2 = () => { 
    choice_tee=2
    setShowStep({
      skin: false,
      tee: false,
      pant: true,
      eye: false,
      hair: false,
      completed: false,
    })
  }
  const onClick_tee3 = () => { 
    choice_tee=3
    setShowStep({
      skin: false,
      tee: false,
      pant: true,
      eye: false,
      hair: false,
      completed: false,
    })
  }
  const onClick_pant1 = () => { 
    choice_pant=1
    setShowStep({
      skin: false,
      tee: false,
      pant: false,
      eye: true,
      hair: false,
      completed: false,
    })
  }
  const onClick_pant2 = () => { 
    choice_pant=2
    setShowStep({
      skin: false,
      tee: false,
      pant: false,
      eye: true,
      hair: false,
      completed: false,
    })
  }
  const onClick_pant3 = () => { 
    choice_pant=3
    setShowStep({
      skin: false,
      tee: false,
      pant: false,
      eye: true,
      hair: false,
      completed: false,
    })
  }
  const onClick_pant4 = () => { 
    choice_pant=4
    setShowStep({
      skin: false,
      tee: false,
      pant: false,
      eye: true,
      hair: false,
      completed: false,
    })
  }
  const onClick_eye1 = () => { 
    choice_eye=1
    setShowStep({
      skin: false,
      tee: false,
      pant: false,
      eye: false,
      hair: true,
      completed: false,
    })
  }
  const onClick_eye2 = () => { 
    choice_eye=2
    setShowStep({
      skin: false,
      tee: false,
      pant: false,
      eye: false,
      hair: true,
      completed: false,
    })
  }
  const onClick_eye3 = () => { 
    choice_eye=3
    setShowStep({
      skin: false,
      tee: false,
      pant: false,
      eye: false,
      hair: true,
      completed: false,
    })
  }
  const onClick_hair1 = () => { 
    choice_hair=1
    setShowStep({
      skin: false,
      tee: false,
      pant: false,
      eye: false,
      hair: false,
      completed: true,
    })
  }
  const onClick_hair2 = () => { 
    choice_hair=2
    setShowStep({
      skin: false,
      tee: false,
      pant: false,
      eye: false,
      hair: false,
      completed: true,
    })
  }
  const onClick_hair3 = () => { 
    choice_hair=3
    setShowStep({
      skin: false,
      tee: false,
      pant: false,
      eye: false,
      hair: false,
      completed: true,
    })
  }
  // const onClick_hair = () => setShowStep_pant(true);
  // const onClick_pant = () => setShowStep_skin(true);
  // const onClick_skin = () => setShowStep_tee(true);
  // const onClick_tee = () => setShowStep_completed(true);

  const ButtonEye = () => <div><Row className="fixed" style={{ width:'100vw', height:'100vh' }} gutter={16}>
    <Col span={3.5}>
      <Button value="1" style={{ border:'none' }} onClick={onClick_eye1}>
        <Card
            hoverable
            style={{ width: 300 }}
            cover={<img alt="example" src="ChibiChans/ImageFiles/outeye/1.jpg" />}
          >
            <Meta title="VR Headset"/>
        </Card>
      </Button>
    </Col>
    <Col span={3.5}>
      <Button value="2" style={{ border:'none' }} onClick={onClick_eye2}>
        <Card
            hoverable
            style={{ width: 300 }}
            cover={<img alt="example" src="ChibiChans/ImageFiles/outeye/2.jpg" />}
          >
            <Meta title="Glasses"/>
        </Card>
      </Button>
    </Col>
    <Col span={3.5}>
      <Button value="3" style={{ border:'none' }} onClick={onClick_eye3}>
        <Card
            hoverable
            style={{ width: 300 }}
            cover={<img alt="example" src="ChibiChans/ImageFiles/outeye/3.jpg" />}
          >
            <Meta title="Duality"/>
        </Card>
      </Button>
    </Col>
  </Row>
  </div>;

  {/* Choose hair section */}
  const ButtonHair = () => <div><Row className="fixed" style={{ width:'100vw', height:'100vh' }} gutter={16}>
    <Col span={3.5}>
      <Button value="1" style={{ border:'none' }} onClick={onClick_hair1}>
        <Card
            hoverable
            style={{ width: 300 }}
            cover={<img alt="example" src="ChibiChans/ImageFiles/outhair/1.jpg" />}
          >
            <Meta title="Pink Pony"/>
        </Card>
      </Button>
    </Col>
    <Col span={3.5}>
      <Button value="2" style={{ border:'none' }} onClick={onClick_hair2}>
        <Card
            hoverable
            style={{ width: 300 }}
            cover={<img alt="example" src="ChibiChans/ImageFiles/outhair/2.jpg" />}
          >
            <Meta title="Pirate"/>
        </Card>
      </Button>
    </Col>
    <Col span={3.5}>
      <Button value="3" style={{ border:'none' }} onClick={onClick_hair3}>
        <Card
            hoverable
            style={{ width: 300 }}
            cover={<img alt="example" src="ChibiChans/ImageFiles/outhair/3.jpg" />}
          >
            <Meta title="Hazel Hair"/>
        </Card>
      </Button>
    </Col>
  </Row>
  </div>;

  

  {/* Choose Pant section */}
  const ButtonPant = () => <div><Row className="fixed" style={{ width:'100vw', height:'100vh' }} gutter={16}>
    <Col span={3.5}>
      <Button value="1" style={{ border:'none' }} onClick={onClick_pant1}>
        <Card
            hoverable
            style={{ width: 250 }}
            cover={<img alt="example" src="ChibiChans/ImageFiles/outpant/1.jpg" />}
          >
            <Meta title="Undy or Nothing"/>
        </Card>
      </Button>
    </Col>
    <Col span={3.5}>
      <Button value="2" style={{ border:'none' }} onClick={onClick_pant2}>
        <Card
            hoverable
            style={{ width: 250 }}
            cover={<img alt="example" src="ChibiChans/ImageFiles/outpant/2.jpg" />}
          >
            <Meta title="Denim J"/>
        </Card>
      </Button>
    </Col>
    <Col span={3.5}>
      <Button value="3" style={{ border:'none' }} onClick={onClick_pant3}>
        <Card
            hoverable
            style={{ width: 250 }}
            cover={<img alt="example" src="ChibiChans/ImageFiles/outpant/3.jpg" />}
          >
            <Meta title="Karate Pant"/>
        </Card>
      </Button>
    </Col>
    <Col span={3.5}>
      <Button value="4" style={{ border:'none' }} onClick={onClick_pant4}>
        <Card
            hoverable
            style={{ width: 250 }}
            cover={<img alt="example" src="ChibiChans/ImageFiles/outpant/4.jpg" />}
          >
            <Meta title="Hawaii Baby"/>
        </Card>
      </Button>
    </Col>
  </Row>
  </div>;

  {/* Choose skin section */}
  const ButtonSkin = () => <div><Row className="fixed" style={{ width:'100vw', height:'100vh' }} gutter={16}>
    <Col span={3.5}>
      <Button value="1" style={{ border:'none' }} onClick={onClick_skin1}>
        <Card
            hoverable
            style={{ width: 200 }}
            cover={<img alt="example" src="ChibiChans/ImageFiles/outskin/1.jpg" />}
          >
            <Meta title="Zombie"/>
        </Card>
      </Button>
    </Col>
    <Col span={3.5}>
      <Button value="2" style={{ border:'none' }} onClick={onClick_skin2}>
        <Card
            hoverable
            style={{ width: 200 }}
            cover={<img alt="example" src="ChibiChans/ImageFiles/outskin/2.jpg" />}
          >
            <Meta title="Lovely Light"/>
        </Card>
      </Button>
    </Col>
    <Col span={3.5}>
      <Button value="3" style={{ border:'none' }} onClick={onClick_skin3}>
        <Card
            hoverable
            style={{ width: 200 }}
            cover={<img alt="example" src="ChibiChans/ImageFiles/outskin/3.jpg" />}
          >
            <Meta title="Dashing Dark"/>
        </Card>
      </Button>
    </Col>
    <Col span={3.5}>
      <Button value="4" style={{ border:'none' }} onClick={onClick_skin4}>
        <Card
            hoverable
            style={{ width: 200 }}
            cover={<img alt="example" src="ChibiChans/ImageFiles/outskin/4.jpg" />}
          >
            <Meta title="Diamond"/>
        </Card>
      </Button>
    </Col>
    <Col span={3.5}>
      <Button value="5" style={{ border:'none' }} onClick={onClick_skin5}>
        <Card
            hoverable
            style={{ width: 200 }}
            cover={<img alt="example" src="ChibiChans/ImageFiles/outskin/5.jpg" />}
          >
            <Meta title="Redurple"/>
        </Card>
      </Button>
    </Col>
  </Row>
  </div>;

  {/* Choose tee section */}
  const ButtonTee = () => <div><Row className="fixed" style={{ width:'100vw', height:'100vh' }} gutter={16}>
    <Col span={3.5}>
      <Button value="1" style={{ border:'none' }} onClick={onClick_tee1}>
        <Card
            hoverable
            style={{ width: 300 }}
            cover={<img alt="example" src="ChibiChans/ImageFiles/outtee/1.jpg" />}
          >
            <Meta title="Goku"/>
        </Card>
      </Button>
    </Col>
    <Col span={3.5}>
      <Button value="2" style={{ border:'none' }} onClick={onClick_tee2}>
        <Card
            hoverable
            style={{ width: 300 }}
            cover={<img alt="example" src="ChibiChans/ImageFiles/outtee/2.jpg" />}
          >
            <Meta title="School Uniform"/>
        </Card>
      </Button>
    </Col>
    <Col span={3.5}>
      <Button value="3" style={{ border:'none' }} onClick={onClick_tee3}>
        <Card
            hoverable
            style={{ width: 300 }}
            cover={<img alt="example" src="ChibiChans/ImageFiles/outtee/3.jpg" />}
          >
            <Meta title="Tanjiro"/>
        </Card>
      </Button>
    </Col>
  </Row>
  </div>;

  const ButtonComplete = () => 
  <Layout style={{ margin: 200, marginTop: 300, alignItems: 'center' }}>
  <Link to={`/art/create`}>
    <Button type="primary" className="app-btn">Generate Your ChibiChan</Button>
  </Link>
  </Layout>
  // Check if the auction is primary sale or not
  const checkPrimarySale = (auc: AuctionView) => {
    var flag = 0;
    auc.items.forEach(i => {
      i.forEach(j => {
        if (j.metadata.info.primarySaleHappened == true) {
          flag = 1;
          return true;
        }
      });
      if (flag == 1) return true;
    });
    if (flag == 1) return true;
    else return false;
  };

  const resaleAuctions = auctions
    .sort(
      (a, b) =>
        a.auction.info.endedAt
          ?.sub(b.auction.info.endedAt || new BN(0))
          .toNumber() || 0,
    )
    .filter(m => checkPrimarySale(m) == true);

  // Removed resales from live auctions
  const liveAuctions = auctions
    .sort(
      (a, b) =>
        a.auction.info.endedAt
          ?.sub(b.auction.info.endedAt || new BN(0))
          .toNumber() || 0,
    )
    .filter(a => !resaleAuctions.includes(a));

  let items = liveAuctions;

  switch (activeKey) {
    case LiveAuctionViewState.All:
      items = liveAuctions;
      break;
    case LiveAuctionViewState.Participated:
      items = liveAuctions
        .concat(auctionsEnded)
        .filter(
          (m, idx) =>
            m.myBidderMetadata?.info.bidderPubkey ==
            publicKey?.toBase58(),
        );
      break;
    case LiveAuctionViewState.Resale:
      items = resaleAuctions;
      break;
    case LiveAuctionViewState.Ended:
      items = auctionsEnded;
      break;
  }

  const heroAuction = useMemo(
    () =>
      auctions.filter(a => {
        // const now = moment().unix();
        return !a.auction.info.ended() && !resaleAuctions.includes(a);
        // filter out auction for banner that are further than 30 days in the future
        // return Math.floor(delta / 86400) <= 30;
      })?.[0],
    [auctions],
  );

  const liveAuctionsView = (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {!isLoading
        ? items.map((m, idx) => {
            if (m === heroAuction) {
              return;
            }

            const id = m.auction.pubkey;
            return (
              <Link to={`/auction/${id}`} key={idx}>
                <AuctionRenderCard key={id} auctionView={m} />
              </Link>
            );
          })
        : [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
    </Masonry>
  );

  const endedAuctions = (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {!isLoading
        ? auctionsEnded.map((m, idx) => {
            if (m === heroAuction) {
              return;
            }

            const id = m.auction.pubkey;
            return (
              <Link to={`/auction/${id}`} key={idx}>
                <AuctionRenderCard key={id} auctionView={m} />
              </Link>
            );
          })
        : [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
    </Masonry>
  );

  return (
    <>
      <Layout style={{ maxWidth:'90vw' }}>
        <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
          
          {/* Choose eye section */}
          <div>
            {showStep.skin ? <ButtonSkin /> : null}
            {showStep.tee ? <ButtonTee /> : null}
            {showStep.pant ? <ButtonPant /> : null}
            {showStep.eye ? <ButtonEye /> : null}
            {showStep.hair ? <ButtonHair /> : null}
            {showStep.completed ? <ButtonComplete /> : null}
          </div>
          
        </Content>
      </Layout>
    </>
  );
};


