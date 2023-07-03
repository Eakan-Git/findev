const JobSkills = ({ skills }) => {
  if (!skills || skills.length === 0) {
    return (
      <ul className="job-skills">
        <li>
          <a href="#">Chưa cập nhật</a>
        </li>
      </ul>
    );
  }

  return (
    <ul className="job-skills">
      {skills.map((skill) => (
        <li key={skill.id}>
          <a href={`/search/?keyword=${skill.skill}`}>{skill.skill}</a>
        </li>
      ))}
    </ul>
  );
};

export default JobSkills;
