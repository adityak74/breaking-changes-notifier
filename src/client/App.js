/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import './app.css';
import {
  Input,
  Image,
  Layout,
  Skeleton,
  Typography,
} from 'antd';
import 'antd/dist/antd.css';
import {
  compose,
  withHandlers,
  withState,
} from 'recompose';
import parseGithubURL from 'parse-github-url';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './Codeblock';
import shipBlowImage from './ship_blow.png';
import NotFoundImage from './404.png';

const { Header, Content, Footer } = Layout;
const { Search } = Input;
const { Title } = Typography;

const ErrorComponent = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
  }}
  >
    <Image
      preview={false}
      src={NotFoundImage}
      width={400}
    />
  </div>
);

const API_BASE = process.env.API_URL;

const AppComponent = ({
  errorData,
  getGithubRepoChanges,
  onGithubRepoChanged,
  repoDiffsData,
  submitting,
}) => (
  <div>
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Header>
        <Search
          onChange={onGithubRepoChanged}
          onSearch={getGithubRepoChanges}
          style={{ padding: '10px 50px' }}
          placeholder="https://github.com/mui-org/material-ui"
          enterButton="Search"
          size="large"
          loading={submitting}
        />
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Title level={3} style={{ padding: '20px 0' }}>Breaking Changes and Versions</Title>
        <div className="site-layout-content">
          {repoDiffsData.length ? repoDiffsData : (
            <div>
              <Skeleton active />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
              }}
              >
                <Image
                  preview={false}
                  src={shipBlowImage}
                  width={200}
                />
                <Title>
                  Save your app from blowing up.
                </Title>
              </div>
            </div>
          )}
          {errorData}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design | Created with
        <span role="img" aria-label="heart-emoji">
          ❤️
        </span>
        by Aditya Karnam
      </Footer>
    </Layout>
  </div>
);

AppComponent.propTypes = {
  errorData: PropTypes.node,
  getGithubRepoChanges: PropTypes.func,
  onGithubRepoChanged: PropTypes.func,
  repoDiffsData: PropTypes.arrayOf(PropTypes.node),
  submitting: PropTypes.bool,
};

const enhance = compose(
  withState('repoDiffsData', 'setRepoDiffsData', []),
  withState('errorData', 'setErrorData', null),
  withState('submitting', 'setSubmitting', false),
  withState('githubRepo', 'setGithubRepo', null),
  withHandlers({
    onGithubRepoChanged: ({ setErrorData, setGithubRepo, setRepoDiffsData }) => (e) => {
      setGithubRepo(e.target.value);
      if (e.target.value === '') {
        setErrorData(null);
        setRepoDiffsData([]);
      }
    },
    getGithubRepoChanges: ({
      githubRepo,
      setErrorData,
      setRepoDiffsData,
      setSubmitting,
    }) => () => {
      if (githubRepo === '') return;
      const parsedGithubInfo = parseGithubURL(githubRepo);
      const { owner, name } = parsedGithubInfo;
      if (owner && name) {
        setSubmitting(true);
        fetch(`${API_BASE}/repo/${owner}/${name}/changes/breaking`)
          .then(res => res.json())
          .then((repoData) => {
            setSubmitting(false);
            setErrorData(null);
            setRepoDiffsData(repoData.data.map((diffData, index) => (
              <div key={Math.random() * index}>
                <Title level={3}>
                  Release:
                  {diffData.release}
                </Title>
                <ReactMarkdown
                  allowDangerousHtml
                  renderers={{ code: CodeBlock }}
                >
                  {diffData.diffs[0]}
                </ReactMarkdown>
              </div>
            )));
          }).catch(() => {
            setSubmitting(false);
            setRepoDiffsData([]);
            setErrorData(ErrorComponent);
          });
      } else {
        setRepoDiffsData([]);
        setErrorData(ErrorComponent);
      }
    },
  }),
);

export default enhance(AppComponent);
