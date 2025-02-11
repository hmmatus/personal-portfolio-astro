import styles from "./Header.module.scss";
export const Header = () => {
  return (
    <header>
      <h2>
        <a className={styles["header-logo"]} href="/">
          Hector Matus
        </a>
      </h2>

      <nav>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};
