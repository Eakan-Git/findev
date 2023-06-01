const CopyrightFooter = () => {
  return (
    <div className="copyright-text">
      <p>
        © {new Date().getFullYear()} FinDev -{" "}
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          StuckOverFlow
        </a>
        . All Right Reserved.
      </p>
    </div>
  );
};

export default CopyrightFooter;
