import React, { useEffect, useState, useCallback } from 'react';
import {
  Steps,
  Row,
  Button,
  Upload,
  Col,
  Input,
  Statistic,
  Slider,
  Progress,
  Spin,
  InputNumber,
  Form,
  Typography,
  Space,
  Layout
} from 'antd';
import { up_choice_skin,up_choice_tee,up_choice_pant,up_choice_eye,up_choice_hair } from './upview';
import { ArtCard } from './../../components/ArtCard';
import { UserSearch, UserValue } from './../../components/UserSearch';
import { Confetti } from './../../components/Confetti';
import { uppy } from '../../actions/update';
import {
  MAX_METADATA_LEN,
  useConnection,
  IMetadataExtension,
  Attribute,
  MetadataCategory,
  useConnectionConfig,
  Creator,
  shortenAddress,
  MetaplexModal,
  MetaplexOverlay,
  MetadataFile,
  StringPublicKey,
  toPublicKey,
} from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { getAssetCostToStore, LAMPORT_MULTIPLIER } from '../../utils/assets';
import { Connection } from '@solana/web3.js';
import { MintLayout } from '@solana/spl-token';
import { Link, useHistory, useParams } from 'react-router-dom';
import { cleanName, getLast } from '../../utils/utils';
import { AmountLabel } from '../../components/AmountLabel';
import useWindowDimensions from '../../utils/layout';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useArt } from '../../hooks';
const { Step } = Steps;
const { Dragger } = Upload;
const { Text } = Typography;

export const UpCreateView = () => {
  const connection = useConnection();
  const { env } = useConnectionConfig();
  const wallet = useWallet();
  const { step_param }: { step_param: string } = useParams();
  const history = useHistory();
  const { width } = useWindowDimensions();

  const [step, setStep] = useState<number>(0);
  const [stepsVisible, setStepsVisible] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [nft, setNft] =
    useState<{ metadataAccount: StringPublicKey } | undefined>(undefined);
  const [files, setFiles] = useState<File[]>([]);
  const [mintKey, setMintKey] = useState<string>('');
  const [attributes, setAttributes] = useState<IMetadataExtension>({
    name: '',
    symbol: '',
    description: '',
    external_url: '',
    image: '',
    animation_url: undefined,
    attributes: undefined,
    seller_fee_basis_points: 0,
    creators: [],
    properties: {
      files: [],
      category: MetadataCategory.Image,
    },
  });

  
  const gotoStep = useCallback(
    (_step: number) => {
      history.push(`/upup/create/${_step.toString()}`);
      if (_step === 0) setStepsVisible(true);
    },
    [history],
  );

  useEffect(() => {
    if (step_param) setStep(parseInt(step_param));
    else gotoStep(0);
  }, [step_param, gotoStep]);

  // store files
  const update = async () => {
    const metadata = {
      name: attributes.name,
      symbol: attributes.symbol,
      creators: attributes.creators,
      description: attributes.description,
      sellerFeeBasisPoints: attributes.seller_fee_basis_points,
      image: attributes.image,
      animation_url: attributes.animation_url,
      attributes: attributes.attributes,
      external_url: attributes.external_url,
      properties: {
        files: attributes.properties.files,
        category: attributes.properties?.category,
      },
    };
    setStepsVisible(false);
    const inte = setInterval(
      () => setProgress(prog => Math.min(prog + 1, 99)),
      600,
    );
    // Update progress inside mintNFT
    const _nft = await uppy(
      connection,
      wallet,
      env,
      files,
      mintKey,
      metadata,
      attributes.properties?.maxSupply,
    );
    if (_nft) setNft(_nft);
    clearInterval(inte);
  };

  return (
    <>
      <Row style={{ paddingTop: 50 }}>
        {stepsVisible && (
          <Col span={24} md={4}>
            <Steps
              progressDot
              direction={width < 768 ? 'horizontal' : 'vertical'}
              current={step}
              style={{
                width: 'fit-content',
                margin: '0 auto 30px auto',
                overflowX: 'auto',
                maxWidth: '100%',
              }}
            >
              {/* <Step title="Category" /> */}
              <Step title="Upload" />
              <Step title="Info" />
              <Step title="Royalties" />
              <Step title="Launch" />
            </Steps>
          </Col>
        )}
        <Col span={24} {...(stepsVisible ? { md: 20 } : { md: 24 })}>
          {/* {step === 0 && (
            <CategoryStep
              confirm={(category: MetadataCategory) => {
                setAttributes({
                  ...attributes,
                  properties: {
                    ...attributes.properties,
                    category,
                  },
                });
                gotoStep(1);
              }}
            />
          )} */}
          {step === 0 && (
            <UploadStep
              attributes={attributes}
              setAttributes={setAttributes}
              files={files}
              setFiles={setFiles}
              mintKey={mintKey}
              setMintKey={setMintKey}
              confirm={() => gotoStep(1)}
            />
          )}

          {step === 1 && (
            <InfoStep
              attributes={attributes}
              files={files}
              setAttributes={setAttributes}
              confirm={() => gotoStep(2)}
            />
          )}
          {step === 2 && (
            <RoyaltiesStep
              attributes={attributes}
              confirm={() => gotoStep(3)}
              setAttributes={setAttributes}
            />
          )}
          {step === 3 && (
            <LaunchStep
              attributes={attributes}
              files={files}
              confirm={() => gotoStep(4)}
              connection={connection}
            />
          )}
          {step === 4 && (
            <WaitingStep
              mint={update}
              progress={progress}
              confirm={() => gotoStep(5)}
            />
          )}
          {0 < step && step < 4 && (
            <div style={{ margin: 'auto', width: 'fit-content' }}>
              <Button onClick={() => gotoStep(step - 1)}>Back</Button>
            </div>
          )}
        </Col>
      </Row>
      <MetaplexOverlay visible={step === 5}>
        <Congrats nft={nft} />
      </MetaplexOverlay>
    </>
  );
};

const CategoryStep = (props: {
  confirm: (category: MetadataCategory) => void;
}) => {
  const { width } = useWindowDimensions();
  return (
    <>
      <Row className="call-to-action">
        <h2>Create a new item</h2>
        <p>
          First time creating on Metaplex?{' '}
          <a href="#">Read our creators’ guide.</a>
        </p>
      </Row>
      <Row justify={width < 768 ? 'center' : 'start'}>
        <Col>
          <Row>
            <Button
              className="type-btn"
              size="large"
              onClick={() => props.confirm(MetadataCategory.Image)}
            >
              <div>
                <div>Image</div>
                <div className="type-btn-description">JPG, PNG, GIF</div>
              </div>
            </Button>
          </Row>
          <Row>
            <Button
              className="type-btn"
              size="large"
              onClick={() => props.confirm(MetadataCategory.Video)}
            >
              <div>
                <div>Video</div>
                <div className="type-btn-description">MP4, MOV</div>
              </div>
            </Button>
          </Row>
          <Row>
            <Button
              className="type-btn"
              size="large"
              onClick={() => props.confirm(MetadataCategory.Audio)}
            >
              <div>
                <div>Audio</div>
                <div className="type-btn-description">MP3, WAV, FLAC</div>
              </div>
            </Button>
          </Row>
          <Row>
            <Button
              className="type-btn"
              size="large"
              onClick={() => props.confirm(MetadataCategory.VR)}
            >
              <div>
                <div>AR/3D</div>
                <div className="type-btn-description">GLB</div>
              </div>
            </Button>
          </Row>
        </Col>
      </Row>
    </>
  );
};

const UploadStep = (props: {
  attributes: IMetadataExtension;
  setAttributes: (attr: IMetadataExtension) => void;
  files: File[];
  setFiles: (files: File[]) => void;
  mintKey: string
  setMintKey: (mintKey: string) => void;
  confirm: () => void;
}) => {
  const [coverFile, setCoverFile] = useState<File | undefined>(
    props.files?.[0],
  );
  const [mainFile, setMainFile] = useState<File | undefined>(props.files?.[1]);
  const [customURL, setCustomURL] = useState<string>('');
  const [customURLErr, setCustomURLErr] = useState<string>('');
  const disableContinue = !coverFile || !!customURLErr;

  useEffect(() => {
    props.setAttributes({
      ...props.attributes,
      properties: {
        ...props.attributes.properties,
        files: [],
      },
    });
  }, []);

  const fil = () => {
    const i = Math.floor(Math.random() * 10); // random value //0 - 9
    fetch(`https://bakerstreetphantom.github.io/Hosting/${up_choice_skin}${up_choice_tee}${up_choice_pant}${up_choice_eye}${up_choice_hair}.jpg`)
      .then((e) => {
        return e.blob()
      })
      .then((blob) => {
        let b: any = blob
        const file = new File([b], `${i}.jpg`, {lastModified: Number((new Date()).toString)});
        console.log(file); 
        setCoverFile(file);
        // setMainFile(file);
      })
    };

  const uploadMsg = (category: MetadataCategory) => {
    switch (category) {
      case MetadataCategory.Audio:
        return 'Upload your audio creation (MP3, FLAC, WAV)';
      case MetadataCategory.Image:
        return 'Upload your image creation (PNG, JPG, GIF)';
      case MetadataCategory.Video:
        return 'Upload your video creation (MP4, MOV, GLB)';
      case MetadataCategory.VR:
        return 'Upload your AR/VR creation (GLB)';
      default:
        return 'Please go back and choose a category';
    }
  };

  const acceptableFiles = (category: MetadataCategory) => {
    switch (category) {
      case MetadataCategory.Audio:
        return '.mp3,.flac,.wav';
      case MetadataCategory.Image:
        return '.png,.jpg,.gif';
      case MetadataCategory.Video:
        return '.mp4,.mov,.webm';
      case MetadataCategory.VR:
        return '.glb';
      default:
        return '';
    }
  };

  return (
    <>
      <Row className="call-to-action">
        <h2>Now, let's upload your ChibiChan</h2>
        <p style={{ fontSize: '1.2rem' }}>
          Your Chibi will be uploaded to the decentralized web via Arweave.
          This can take up to 1 minute. Arweave is a new type of storage that backs data with sustainable and perpetual endowments,
          allowing users and developers to truly store data forever – for the very first time.
        </p>
      </Row>
      <Row className="content-action">
        {/* <h3>Upload a cover image (PNG, JPG, GIF)</h3>
        <Dragger
          accept=".png,.jpg,.gif,.mp4"
          style={{ padding: 20 }}
          multiple={false}
          customRequest={info => {
            // dont upload files here, handled outside of the control
            info?.onSuccess?.({}, null as any);
          }}
          fileList={coverFile ? [coverFile as any] : []}
          onChange={async info => {
            const file = info.file.originFileObj;
            if (file) setCoverFile(file);
          }}
        >
          <div className="ant-upload-drag-icon">
            <h3 style={{ fontWeight: 700 }}>
              Upload your cover image (PNG, JPG, GIF)
            </h3>
          </div>
          <p className="ant-upload-text">Drag and drop, or click to browse</p>
        </Dragger> */}
        <Layout style={{ margin: 100, marginTop: 100, alignItems: 'center' }}>
          <Button onClick={fil}>
          Upload
        </Button> </Layout>
        
      </Row>
      {props.attributes.properties?.category !== MetadataCategory.Image && (
        <Row
          className="content-action"
          style={{ marginBottom: 5, marginTop: 30 }}
        >
          <h3>{uploadMsg(props.attributes.properties?.category)}</h3>
          {/* <Dragger
            accept={acceptableFiles(props.attributes.properties?.category)}
            style={{ padding: 20, background: 'rgba(255, 255, 255, 0.08)' }}
            multiple={false}
            customRequest={info => {
              // dont upload files here, handled outside of the control
              info?.onSuccess?.({}, null as any);
            }}
            fileList={mainFile ? [mainFile as any] : []}
            onChange={async info => {
              const file = info.file.originFileObj;

              // Reset image URL
              setCustomURL('');
              setCustomURLErr('');

              if (file) setMainFile(file);
            }}
            onRemove={() => {
              setMainFile(undefined);
            }}
          >
            <div className="ant-upload-drag-icon">
              <h3 style={{ fontWeight: 700 }}>Upload your creation</h3>
            </div>
            <p className="ant-upload-text">Drag and drop, or click to browse</p>
          </Dragger> */}
        </Row>
      )}
      <Form.Item
        style={{
          width: '100%',
          flexDirection: 'column',
          paddingTop: 30,
          marginBottom: 4,
        }}
        label={<h3>Enter your NFT MintKey</h3>}
        labelAlign="left"
        colon={false}
      >
        <Input
          disabled={false}
          placeholder="You can find the mint key on explorer"
          value={props.mintKey}
          onChange={ev => props.setMintKey(ev.target.value)}
          onFocus={() => props.setMintKey('')}
          onBlur={() => {
            if (!props.mintKey) {
              setCustomURLErr('');
              return;
            }

            try {
              // Validate URL and save
              new String(props.mintKey);
              props.setMintKey(props.mintKey);
              setCustomURLErr('');
              console.log(props.mintKey)
            } catch (e) {
              console.error(e);
              setCustomURLErr('Please enter a valid Mint Key');
            }
          }}
        />
      </Form.Item>
      <Row>
        <Button
          type="primary"
          size="large"
          disabled={disableContinue}
          onClick={() => {
            props.setAttributes({
              ...props.attributes,
              properties: {
                ...props.attributes.properties,
                files: [coverFile, mainFile, customURL]
                  .filter(f => f)
                  .map(f => {
                    const uri = typeof f === 'string' ? f : f?.name || '';
                    const type =
                      typeof f === 'string' || !f
                        ? 'unknown'
                        : f.type || getLast(f.name.split('.')) || 'unknown';

                    return {
                      uri,
                      type,
                    } as MetadataFile;
                  }),
              },
              image: coverFile?.name || '',
              animation_url: mainFile && mainFile.name,
            });
            props.setFiles([coverFile, mainFile].filter(f => f) as File[]);
            props.confirm();
          }}
          style={{ marginTop: 24 }}
          className="action-btn"
        >
          Continue to Mint
        </Button>
      </Row>
    </>
  );
};

interface Royalty {
  creatorKey: string;
  amount: number;
}

const useArtworkFiles = (files: File[], attributes: IMetadataExtension) => {
  const [data, setData] = useState<{ image: string; animation_url: string }>({
    image: '',
    animation_url: '',
  });

  useEffect(() => {
    if (attributes.image) {
      const file = files.find(f => f.name === attributes.image);
      if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          setData((data: any) => {
            return {
              ...(data || {}),
              image: (event.target?.result as string) || '',
            };
          });
        };
        if (file) reader.readAsDataURL(file);
      }
    }

    if (attributes.animation_url) {
      const file = files.find(f => f.name === attributes.animation_url);
      if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          setData((data: any) => {
            return {
              ...(data || {}),
              animation_url: (event.target?.result as string) || '',
            };
          });
        };
        if (file) reader.readAsDataURL(file);
      }
    }
  }, [files, attributes]);

  return data;
};

const InfoStep = (props: {
  attributes: IMetadataExtension;
  files: File[];
  setAttributes: (attr: IMetadataExtension) => void;
  confirm: () => void;
}) => {
  const [creators, setCreators] = useState<Array<UserValue>>([]);
  const [royalties, setRoyalties] = useState<Array<Royalty>>([]);
  const { image, animation_url } = useArtworkFiles(
    props.files,
    props.attributes,
  );
  const [form] = Form.useForm();

  useEffect(() => {
    setRoyalties(
      creators.map(creator => ({
        creatorKey: creator.key,
        amount: Math.trunc(100 / creators.length),
      })),
    );
  }, [creators]);
  return (
    <>
      <Row className="call-to-action">
        <h2>Describe your item</h2>
        <p>
          Provide detailed description of your creative process to engage with
          your audience.
        </p>
      </Row>
      <Row className="content-action" justify="space-around">
        <Col>
          {props.attributes.image && (
            <ArtCard
              image={image}
              animationURL={animation_url}
              category={props.attributes.properties?.category}
              name={props.attributes.name}
              symbol={props.attributes.symbol}
              small={true}
            />
          )}
        </Col>
        <Col className="section" style={{ minWidth: 300 }}>
          <label className="action-field">
            <span className="field-title">Title</span>
            <Input
              autoFocus
              className="input"
              placeholder="Max 50 characters"
              allowClear
              value={props.attributes.name}
              onChange={info =>
                props.setAttributes({
                  ...props.attributes,
                  name: info.target.value,
                })
              }
            />
          </label>
          {/* <label className="action-field">
            <span className="field-title">Symbol</span>
            <Input
              className="input"
              placeholder="Max 10 characters"
              allowClear
              value={props.attributes.symbol}
              onChange={info =>
                props.setAttributes({
                  ...props.attributes,
                  symbol: info.target.value,
                })
              }
            />
          </label> */}

          <label className="action-field">
            <span className="field-title">Description</span>
            <Input.TextArea
              className="input textarea"
              placeholder="Max 500 characters"
              value={props.attributes.description}
              onChange={info =>
                props.setAttributes({
                  ...props.attributes,
                  description: info.target.value,
                })
              }
              allowClear
            />
          </label>
          <label className="action-field">
            <span className="field-title">Maximum Supply</span>
            <InputNumber
              placeholder="Quantity"
              onChange={(val: number) => {
                props.setAttributes({
                  ...props.attributes,
                  properties: {
                    ...props.attributes.properties,
                    maxSupply: val,
                  },
                });
              }}
              className="royalties-input"
            />
          </label>
          <label className="action-field">
            <span className="field-title">Attributes</span>
          </label>
          <Form
            name="dynamic_attributes"
            form={form}
            autoComplete="off"
          >
            <Form.List name="attributes">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey }) => (
                      <Space key={key} align="baseline">
                      <Form.Item
                        name={[name, 'trait_type']}
                        fieldKey={[fieldKey, 'trait_type']}
                        hasFeedback
                      >
                        <Input placeholder="trait_type (Optional)" />
                      </Form.Item>
                      <Form.Item
                        name={[name, 'value']}
                        fieldKey={[fieldKey, 'value']}
                        rules={[{ required: true, message: 'Missing value' }]}
                        hasFeedback
                      >
                        <Input placeholder="value" />
                      </Form.Item>
                      <Form.Item

                        name={[name, 'display_type']}
                        fieldKey={[fieldKey, 'display_type']}
                        hasFeedback
                      >
                        <Input placeholder="display_type (Optional)" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add attribute
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </Col>
      </Row>

      <Row>
        <Button
          type="primary"
          size="large"
          onClick={() => {
            form.validateFields()
              .then(values => {
                const nftAttributes = values.attributes;
                // value is number if possible
                for (const nftAttribute of nftAttributes || []) {
                  const newValue = Number(nftAttribute.value);
                  if (!isNaN(newValue)) {
                    nftAttribute.value = newValue;
                  }
                }
                console.log('Adding NFT attributes:', nftAttributes)
                props.setAttributes({
                  ...props.attributes,
                  attributes: nftAttributes,
                });

                props.confirm();
              })
          }}
          className="action-btn"
        >
          Continue to royalties
        </Button>
      </Row>
    </>
  );
};

const RoyaltiesSplitter = (props: {
  creators: Array<UserValue>;
  royalties: Array<Royalty>;
  setRoyalties: Function;
  isShowErrors?: boolean;
}) => {
  return (
    <Col>
      <Row gutter={[0, 24]}>
        {props.creators.map((creator, idx) => {
          const royalty = props.royalties.find(
            royalty => royalty.creatorKey === creator.key,
          );
          if (!royalty) return null;

          const amt = royalty.amount;

          const handleChangeShare = (newAmt: number) => {
            props.setRoyalties(
              props.royalties.map(_royalty => {
                return {
                  ..._royalty,
                  amount:
                    _royalty.creatorKey === royalty.creatorKey
                      ? newAmt
                      : _royalty.amount,
                };
              }),
            );
          };

          return (
            <Col span={24} key={idx}>
              <Row
                align="middle"
                gutter={[0, 16]}
                style={{ margin: '5px auto' }}
              >
                <Col span={4} style={{ padding: 10 }}>
                  {creator.label}
                </Col>
                <Col span={3}>
                  <InputNumber<number>
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    value={amt}
                    parser={value => parseInt(value?.replace('%', '') ?? '0')}
                    onChange={handleChangeShare}
                    className="royalties-input"
                  />
                </Col>
                <Col span={4} style={{ paddingLeft: 12 }}>
                  <Slider value={amt} onChange={handleChangeShare} />
                </Col>
                {props.isShowErrors && amt === 0 && (
                  <Col style={{ paddingLeft: 12 }}>
                    <Text type="danger">
                      The split percentage for this creator cannot be 0%.
                    </Text>
                  </Col>
                )}
              </Row>
            </Col>
          );
        })}
      </Row>
    </Col>
  );
};

const RoyaltiesStep = (props: {
  attributes: IMetadataExtension;
  setAttributes: (attr: IMetadataExtension) => void;
  confirm: () => void;
}) => {
  // const file = props.attributes.image;
  const { publicKey, connected } = useWallet();
  const [creators, setCreators] = useState<Array<UserValue>>([]);
  const [fixedCreators, setFixedCreators] = useState<Array<UserValue>>([]);
  const [royalties, setRoyalties] = useState<Array<Royalty>>([]);
  const [totalRoyaltyShares, setTotalRoyaltiesShare] = useState<number>(0);
  const [showCreatorsModal, setShowCreatorsModal] = useState<boolean>(false);
  const [isShowErrors, setIsShowErrors] = useState<boolean>(false);

  useEffect(() => {
    if (publicKey) {
      const key = publicKey.toBase58();
      setFixedCreators([
        {
          key,
          label: shortenAddress(key),
          value: key,
        },
      ]);
    }
  }, [connected, setCreators]);

  useEffect(() => {
    setRoyalties(
      [...fixedCreators, ...creators].map(creator => ({
        creatorKey: creator.key,
        amount: Math.trunc(100 / [...fixedCreators, ...creators].length),
      })),
    );
  }, [creators, fixedCreators]);

  useEffect(() => {
    // When royalties changes, sum up all the amounts.
    const total = royalties.reduce((totalShares, royalty) => {
      return totalShares + royalty.amount;
    }, 0);

    setTotalRoyaltiesShare(total);
  }, [royalties]);

  return (
    <>
      <Row className="call-to-action" style={{ marginBottom: 20 }}>
        <h2>Set royalties and creator splits</h2>
        <p>
          Royalties ensure that you continue to get compensated for your work
          after its initial sale.
        </p>
      </Row>
      <Row className="content-action" style={{ marginBottom: 20 }}>
        <label className="action-field">
          <span className="field-title">Royalty Percentage</span>
          <p>
            This is how much of each secondary sale will be paid out to the
            creators.
          </p>
          <InputNumber
            autoFocus
            min={0}
            max={100}
            placeholder="Between 0 and 100"
            onChange={(val: number) => {
              props.setAttributes({
                ...props.attributes,
                seller_fee_basis_points: val * 100,
              });
            }}
            className="royalties-input"
          />
        </label>
      </Row>
      {[...fixedCreators, ...creators].length > 0 && (
        <Row>
          <label className="action-field" style={{ width: '100%' }}>
            <span className="field-title">Creators Split</span>
            <p>
              This is how much of the proceeds from the initial sale and any
              royalties will be split out amongst the creators.
            </p>
            <RoyaltiesSplitter
              creators={[...fixedCreators, ...creators]}
              royalties={royalties}
              setRoyalties={setRoyalties}
              isShowErrors={isShowErrors}
            />
          </label>
        </Row>
      )}
      <Row>
        <span
          onClick={() => setShowCreatorsModal(true)}
          style={{ padding: 10, marginBottom: 10 }}
        >
          <span
            style={{
              color: 'white',
              fontSize: 25,
              padding: '0px 8px 3px 8px',
              background: 'rgb(57, 57, 57)',
              borderRadius: '50%',
              marginRight: 5,
              verticalAlign: 'middle',
            }}
          >
            +
          </span>
          <span
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              verticalAlign: 'middle',
              lineHeight: 1,
            }}
          >
            Add another creator
          </span>
        </span>
        <MetaplexModal
          visible={showCreatorsModal}
          onCancel={() => setShowCreatorsModal(false)}
        >
          <label className="action-field" style={{ width: '100%' }}>
            <span className="field-title">Creators</span>
            <UserSearch setCreators={setCreators} />
          </label>
        </MetaplexModal>
      </Row>
      {isShowErrors && totalRoyaltyShares !== 100 && (
        <Row>
          <Text type="danger" style={{ paddingBottom: 14 }}>
            The split percentages for each creator must add up to 100%. Current
            total split percentage is {totalRoyaltyShares}%.
          </Text>
        </Row>
      )}
      <Row>
        <Button
          type="primary"
          size="large"
          onClick={() => {
            // Find all royalties that are invalid (0)
            const zeroedRoyalties = royalties.filter(
              royalty => royalty.amount === 0,
            );

            if (zeroedRoyalties.length !== 0 || totalRoyaltyShares !== 100) {
              // Contains a share that is 0 or total shares does not equal 100, show errors.
              setIsShowErrors(true);
              return;
            }

            const creatorStructs: Creator[] = [
              ...fixedCreators,
              ...creators,
            ].map(
              c =>
                new Creator({
                  address: c.value,
                  verified: c.value === publicKey?.toBase58(),
                  share:
                    royalties.find(r => r.creatorKey === c.value)?.amount ||
                    Math.round(100 / royalties.length),
                }),
            );

            const share = creatorStructs.reduce(
              (acc, el) => (acc += el.share),
              0,
            );
            if (share > 100 && creatorStructs.length) {
              creatorStructs[0].share -= share - 100;
            }
            props.setAttributes({
              ...props.attributes,
              creators: creatorStructs,
            });
            props.confirm();
          }}
          className="action-btn"
        >
          Continue to review
        </Button>
      </Row>
    </>
  );
};

const LaunchStep = (props: {
  confirm: () => void;
  attributes: IMetadataExtension;
  files: File[];
  connection: Connection;
}) => {
  const [cost, setCost] = useState(0);
  const { image, animation_url } = useArtworkFiles(
    props.files,
    props.attributes,
  );
  const files = props.files;
  const metadata = props.attributes;
  useEffect(() => {
    const rentCall = Promise.all([
      props.connection.getMinimumBalanceForRentExemption(MintLayout.span),
      props.connection.getMinimumBalanceForRentExemption(MAX_METADATA_LEN),
    ]);
    if (files.length)
      getAssetCostToStore([
        ...files,
        new File([JSON.stringify(metadata)], 'metadata.json'),
      ]).then(async lamports => {
        const sol = lamports / LAMPORT_MULTIPLIER;

        // TODO: cache this and batch in one call
        const [mintRent, metadataRent] = await rentCall;

        // const uriStr = 'x';
        // let uriBuilder = '';
        // for (let i = 0; i < MAX_URI_LENGTH; i++) {
        //   uriBuilder += uriStr;
        // }

        const additionalSol = (metadataRent + mintRent) / LAMPORT_MULTIPLIER;

        // TODO: add fees based on number of transactions and signers
        setCost(sol + additionalSol);
      });
  }, [files, metadata, setCost]);

  return (
    <>
      <Row className="call-to-action">
        <h2>Launch your creation</h2>
        <p>
          Provide detailed description of your creative process to engage with
          your audience.
        </p>
      </Row>
      <Row className="content-action" justify="space-around">
        <Col>
          {props.attributes.image && (
            <ArtCard
              image={image}
              animationURL={animation_url}
              category={props.attributes.properties?.category}
              name={props.attributes.name}
              symbol={props.attributes.symbol}
              small={true}
            />
          )}
        </Col>
        <Col className="section" style={{ minWidth: 300 }}>
          <Statistic
            className="create-statistic"
            title="Royalty Percentage"
            value={props.attributes.seller_fee_basis_points / 100}
            precision={2}
            suffix="%"
          />
          {cost ? (
            <AmountLabel title="Cost to Create" amount={cost.toFixed(5)} />
          ) : (
            <Spin />
          )}
        </Col>
      </Row>
      <Row>
        <Button
          type="primary"
          size="large"
          onClick={props.confirm}
          className="action-btn"
        >
          Pay with SOL
        </Button>
        <Button
          disabled={true}
          size="large"
          onClick={props.confirm}
          className="action-btn"
        >
          Pay with Credit Card
        </Button>
      </Row>
    </>
  );
};

const WaitingStep = (props: {
  mint: Function;
  progress: number;
  confirm: Function;
}) => {
  useEffect(() => {
    const func = async () => {
      await props.mint();
      props.confirm();
    };
    func();
  }, []);

  return (
    <div
      style={{
        marginTop: 70,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Progress type="circle" percent={props.progress} />
      <div className="waiting-title">
        Your creation is being uploaded to the decentralized web...
      </div>
      <div className="waiting-subtitle">This can take up to 1 minute.</div>
    </div>
  );
};

const Congrats = (props: {
  nft?: {
    metadataAccount: StringPublicKey;
  };
}) => {
  const history = useHistory();

  const newTweetURL = () => {
    const params = {
      text: "I've created a new NFT artwork on Metaplex, check it out!",
      url: `${
        window.location.origin
      }/#/art/${props.nft?.metadataAccount.toString()}`,
      hashtags: 'NFT,Crypto,Metaplex',
      // via: "Metaplex",
      related: 'Metaplex,Solana',
    };
    const queryParams = new URLSearchParams(params).toString();
    return `https://twitter.com/intent/tweet?${queryParams}`;
  };

  return (
    <>
      <div className="waiting-title">Congratulations, you created an NFT!</div>
      <div className="congrats-button-container">
{/*       <Button
          className="metaplex-button"
          onClick={_ => window.open(newTweetURL(), '_blank')}
        >
          <span>Share it on Twitter</span>
          <span>&gt;</span>
        </Button>
        <Button
          className="metaplex-button"
          onClick={_ =>
            history.push(`/art/${props.nft?.metadataAccount.toString()}`)
          }
        >
          <span>See it in your collection</span>
          <span>&gt;</span>
        </Button> */}
        <Link to="/">
        <Button
          className="metaplex-button"
        >
          <span>Return to homepage</span>
          <span>&gt;</span>
        </Button>
        </Link>  
      </div>
      <Confetti />
    </>
  );
};