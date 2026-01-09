export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer items-center p-4 bg-neutral text-neutral-content">
      <div className="items-center grid-flow-col">
        <p>Copyright © {year} - All right reserved</p>
      </div>
    </footer>
  );
}
