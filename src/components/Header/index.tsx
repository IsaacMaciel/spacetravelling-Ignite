import styles from './header.module.scss';
import commonStyles from '../../styles/common.module.scss'
import Image from 'next/image';
import Link from 'next/link';
export default function Header() {
  return (
    <header className={`${styles.container} ${commonStyles.common}`}>
      <Link href="/">
        <a>
          <Image src="/images/logo.svg" alt="logo" width={40} height={23} />
        </a>
      </Link>
      <h1>
        spacetravelling<span>.</span>
      </h1>
    </header>
  );
}
