import Link from 'next/link';
import styles from './styles.module.scss';

interface NavigationProps {
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
}

const Navigation = ({ prevPost, nextPost }: NavigationProps) => {

  return (
    <div className={styles.container}>
      {prevPost ? (
        <div>
          <h4>{prevPost.data.title}</h4>
          <Link href={`/post/${prevPost.uid}`}>
            <a>Post anterior</a>
          </Link>
        </div>
      ) : (
        <div></div>
      )}

      {nextPost ? (
        <div className={styles.nextPost}>
          <h4>{nextPost.data.title}</h4>
          <Link href={`/post/${nextPost.uid}`}>
            <a>Próximo post</a>
          </Link>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export { Navigation };
