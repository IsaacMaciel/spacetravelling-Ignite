import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import { FiUser, FiCalendar } from 'react-icons/fi';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useState } from 'react';
import Link from 'next/link';
import { formatDate } from '../utils/formatDate';


interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const { next_page, results } = postsPagination;
  const [nextPost, setNextPost] = useState(next_page);
  const [ posts, setPosts] = useState<Post[]>(results)

  const handleAddPost = async () => {
    const data = await fetch(next_page).then(resp =>
      resp.json().then(data => data)
    );

    const newsPost: Post[] = data.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author
        }

      }
    })

    setPosts([...posts,...newsPost])
    setNextPost(data.next_page);
  };


  return (
    <main className={`${commonStyles.common} ${styles.container} `}>
      {posts.map(post => (
        <div key={post.uid} className={styles.post}>
          <Link href={`/post/${post.uid}`}>
            <a>
              <h1> {post.data.title}</h1>
            </a>
          </Link>
          <p>{post.data.subtitle}</p>
          <div className={styles.information}>
            <div>
              <FiCalendar />
              <time>{formatDate(post.first_publication_date)}</time>
            </div>
            <div>
              <FiUser />
              <span> {post.data.author} </span>
            </div>
          </div>
        </div>
      ))}

      {nextPost && (
        <button type="button" onClick={handleAddPost}>
          Carregar mais posts
        </button>
      )}
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: [
        'post.title',
        'post.subtitle',
        'post.author',
        'post.banner',
        'post.content',
      ],
      pageSize: 3,
    }
  );

  const { next_page } = postsResponse;
  const postResponseFormatted = postsResponse.results.map(post => {
    const firstPublicationFormatted = format(
      new Date(post.first_publication_date),
      'dd MMM yyyy',
      {
        locale: ptBR,
      }
    );
    const { uid, first_publication_date } = post;
    const { title, subtitle, author } = post.data;
    return {
      uid,
      first_publication_date,
      data: {
        title,
        subtitle,
        author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        next_page,
        results: postResponseFormatted
      }
    },
    revalidate: 60 * 60 * 24, // 24HRS
  };
};
