import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client';

import { RichText } from 'prismic-dom';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import { formatDate } from '../../utils/formatDate';
import { Comments } from '../../components/Comments';
import { Navigation } from '../../components/Navigation';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
  preview: boolean;
  navigation: {
    prevPost: {
      data: {
        title: string;
      };
      uid: string;
    };
    nextPost: {
      data: {
        title: string;
      };
      uid: string;
    };
  };
}

export default function Post({ post, preview, navigation }: PostProps) {
  const { isFallback } = useRouter();
  console.log(isFallback)

  if (!post) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const { data, first_publication_date } = post;
  const { author, title, content, banner } = data;


  const getReadingTime = () => {
    const totalWords = content.reduce((prevValue, currentValue) => {
      const text = currentValue.body
        .map(body => body.text.split(' ').length)
        .reduce((a, b) => a + b, 0);

      return prevValue + text;
    }, 0);

    return Math.ceil(totalWords / 200);
  };

  return (
    <>
      <Head>
        <title>{title} | spacetravelling</title>
      </Head>
      <main>
        <article>
          <img src={banner.url} className={styles.bannerPost} />
          <div className={`${commonStyles.common} ${styles.text}`}>
            <div className={styles.body}>
              <h1>{ isFallback ? 'Carregando...' : title}</h1>
              <div className={styles.informationText}>
                <span>
                  <FiCalendar />{' '}
                  <span>{formatDate(first_publication_date)}</span>
                </span>

                <span>
                  <FiUser /> <span>{author}</span>
                </span>

                <span>
                  <FiClock /> <span>{getReadingTime()} min</span>
                </span>
              </div>
              {content.map((paragraph, index) => (
                <div key={index} className={styles.content}>
                  <h3>{paragraph.heading}</h3>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: RichText.asHtml(paragraph.body),
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <footer className={styles.footer}>
            <div className={styles.containerNavigation}>
              <Navigation
                prevPost={navigation.prevPost}
                nextPost={navigation.nextPost}
              />
            </div>
            <Comments />
          </footer>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      pageSize: 2,
      fetch: ['post.uid'],
    }
  );
  const paths = posts.results.map(post => ({
    params: {
      slug: post.uid,
    },
  }));


  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
  previewData,
}) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  const prevPost = await prismic.query(
    [Prismic.Predicates.at('document.type', 'post')],
    {
      pageSize: 1,
      after: response.id,
      orderings: '[document.first_publication_date]',
    }
  );

  const nextPost = await prismic.query(
    [Prismic.Predicates.at('document.type', 'post')],
    {
      pageSize: 1,
      after: response.id,
      orderings: '[document.last_publication_date desc]',
    }
  );

  const { data, first_publication_date } = response;
  const { author, banner, content, title } = data;

  const contentFormatted = content.map(content => ({
    heading: content.heading,
    body: content.body,
  }));

  const postFormatted = {
    first_publication_date,
    uid: response.uid,
    data: {
      title,
      subtitle: response.data.subtitle,
      banner: {
        url: banner.url,
      },
      author,
      content: contentFormatted,
    },
  };
  return {
    props: {
      post: postFormatted,
      preview,
      navigation: {
        prevPost: prevPost?.results[0] ?? null,
        nextPost: nextPost?.results[0] ?? null,
      },
    },
  };
};
