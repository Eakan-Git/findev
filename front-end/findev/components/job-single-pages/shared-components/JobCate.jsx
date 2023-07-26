const JobCate = ({ cates }) => {
  if (!cates || cates.length === 0) {
    return (
      <ul className="job-cates">
        <li>
          <a>Chưa cập nhật</a>
        </li>
      </ul>
    );
  }

  return (
    <ul className="job-skills">
      {cates.map((cate) => (
        <li key={cate.id}>
          <a href={`/search?categories=${cate.description}`}>{cate.description}</a>
        </li>
      ))}
    </ul>
  );
};

export default JobCate;
