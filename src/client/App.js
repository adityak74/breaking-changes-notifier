/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import './app.css';
import {
  Input,
  Layout,
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

const { Header, Content, Footer } = Layout;
const { Search } = Input;
const { Title } = Typography;

const AppComponent = ({
  getGithubRepoChanges,
  onGithubRepoChanged,
  repoDiffsData,
  submitting,
}) => (
  <div>
    <Layout className="layout">
      <Header>
        <Search
          allowClear
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
          {repoDiffsData}
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
  getGithubRepoChanges: PropTypes.func,
  onGithubRepoChanged: PropTypes.func,
  repoDiffsData: PropTypes.shape([]),
  submitting: PropTypes.bool,
};

const enhance = compose(
  withState('repoDiffsData', 'setRepoDiffsData', []),
  withState('submitting', 'setSubmitting', false),
  withState('githubRepo', 'setGithubRepo', null),
  withHandlers({
    onGithubRepoChanged: ({ setGithubRepo, setRepoDiffsData }) => (e) => {
      setGithubRepo(e.target.value);
      if (e.target.value === '') setRepoDiffsData([]);
    },
    getGithubRepoChanges: ({ githubRepo, setRepoDiffsData, setSubmitting }) => () => {
      if (githubRepo === '') return;
      const parsedGithubInfo = parseGithubURL(githubRepo);
      const { owner, name } = parsedGithubInfo;
      if (owner && name) {
        setSubmitting(true);
        fetch(`/api/repo/${owner}/${name}/changes/breaking`)
          .then(res => res.json())
          .then((repoData) => {
            setSubmitting(false);
            setRepoDiffsData(repoData.data.map(diffData => (
              <div>
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
          });
      }
    },
  }),
);

export default enhance(AppComponent);
