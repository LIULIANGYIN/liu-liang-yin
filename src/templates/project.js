import React, { Fragment, Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { kebabCase } from 'lodash';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import Lightbox from 'react-images';

import Content, { HTMLContent } from '../components/Content';
import TagList from '../components/TagList';
import NavbarWithLinks from '../components/NavbarWithLinks';

const Section = styled.div`
  padding-top: 140px;
  width: 70%;
  margin: auto;
  min-height: 100%;

  @media (max-width: 768px) {
    width: 100%;
    padding-left: 40px;
    padding-right: 40px;
  }
`;

const Title = styled.h1`
  font-size: 50px;
  font-weight: 500;
  padding-bottom: 20px;
  line-height: 70px;

  @media (max-width: 480px) {
    font-size: 40px;
    line-height: 50px;
  }
`;

const SmallTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  padding-bottom: 10px;

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Year = styled.div`
  padding-top: 20px;

  @media (max-width: 768px) {
    padding-top: 0px;
    padding-right: 65px;
  }

  @media (max-width: 480px) {
    padding-right: 60px;
  }
`;

const YearText = styled.div`
  font-size: 15px;
  font-weight: 400;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const LeftContent = styled.div`
  width: 75%;
  padding-right: 45px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const RightContent = styled.div`
  width: 25%;

  @media (max-width: 768px) {
    width: 100%;
    padding-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
`;

const ImgSection = styled(Section)`
  padding-top: 0;
  @media (max-width: 480px) {
    width: 100%;
    padding: 0 !important;
  }
`;

const ImgWrapper = styled.div`
  width: 100%;
  margin-bottom: 30px;
  cursor: pointer;
`;

const Img = styled.img`
  width: 100%;
`;

const ContentWrapper = styled.div`
  margin: auto;
  padding-top: 30px;
  padding-bottom: 50px;
  display: flex;
  flex-wrap: wrap-reverse;
`;

const Bottom = styled.div`
  ${'' /* bottom: 50px; */} display: flex;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
  color: #000;
`;

const PrevButton = styled.div`
  margin-right: 17px;
  cursor: pointer;

  :before {
    content: '< ';
  }
`;

const NextButton = styled.div`
  margin-left: 17px;
  cursor: pointer;
  :after {
    content: ' >';
  }
`;

export class ProjectTemplate extends Component {
  state = {
    isOpen: false,
    currentImage: 0,
  };

  onOpenLightBox = i => {
    this.setState({
      isOpen: true,
      currentImage: i,
    });
  };

  render() {
    const {
      date,
      content,
      contentComponent,
      tags,
      title,
      helmet,
      galleryImages,
      next,
      previous,
    } = this.props;

    const PostContent = contentComponent || Content;
    return (
      <Fragment>
        <Section>
          {helmet || ''}
          <Title>{title}</Title>
          <ContentWrapper>
            <LeftContent>
              <SmallTitle>Story</SmallTitle>
              <PostContent content={content} className="post" />
            </LeftContent>
            <RightContent>
              <div>
                <SmallTitle>Type</SmallTitle>
                {tags && tags.length && <TagList tags={tags} />}
              </div>
              <Year>
                <SmallTitle>Year</SmallTitle>
                <YearText>{date}</YearText>
              </Year>
            </RightContent>
          </ContentWrapper>
        </Section>
        <ImgSection>
          <ImgWrapper />
          {galleryImages &&
            galleryImages.length > 0 && (
              <Fragment>
                {galleryImages.map((img, i) => (
                  <ImgWrapper
                    key={i}
                    onClick={() => this.onOpenLightBox(i)}
                  >
                    <Img src={img} />
                  </ImgWrapper>
                ))}
                <Lightbox
                  currentImage={this.state.currentImage}
                  onClickPrev={() =>
                    this.setState({
                      currentImage: this.state.currentImage - 1,
                    })
                  }
                  onClickNext={() =>
                    this.setState({
                      currentImage: this.state.currentImage + 1,
                    })
                  }
                  showCloseButton={false}
                  backdropClosesModal
                  showImageCount={false}
                  images={galleryImages.map(img => ({ src: img }))}
                  isOpen={this.state.isOpen}
                  onClose={() => this.setState({ isOpen: false })}
                />
              </Fragment>
            )}
        </ImgSection>
        <Bottom>
          {previous && (
            <PrevButton>
              <Link to={previous}>Previous</Link>
            </PrevButton>
          )}
          {next && (
            <NextButton>
              <Link to={next}>Next</Link>
            </NextButton>
          )}
        </Bottom>
      </Fragment>
    );
  }
}

ProjectTemplate.propTypes = {
  content: PropTypes.string.isRequired,
  contentComponent: PropTypes.func,
  title: PropTypes.string,
  helmet: PropTypes.instanceOf(Helmet),
  date: PropTypes.string,
  galleryImages: PropTypes.array,
};

const BlogPost = ({ data, pageResources }) => {

  const { markdownRemark: post } = data;
  const { json: { pathContext }} = pageResources;
  if (pathContext.prev === '/about/') {
    pathContext.prev = null;
  }
  return (
    <Fragment>
      <NavbarWithLinks />
      <ProjectTemplate
        date={post.frontmatter.date}
        heroImage={post.frontmatter.heroImage}
        galleryImages={post.frontmatter.galleryImages}
        content={post.html}
        contentComponent={HTMLContent}
        next={pathContext.next}
        previous={pathContext.prev}
        helmet={
          <Helmet title={`${post.frontmatter.title} | Project`} />
        }
        tags={post.frontmatter.tags}
        title={post.frontmatter.title}
      />
    </Fragment>
  );
};

BlogPost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
};

export default BlogPost;

export const pageQuery = graphql`
  query ProjectByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        date(formatString: "YYYY")
        title
        tags
        galleryImages
      }
    }
  }
`;
