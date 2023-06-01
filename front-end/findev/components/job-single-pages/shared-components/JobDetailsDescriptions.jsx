const JobDetailsDescriptions = ({job}) => {
  return (
    <div className="job-detail">
      <h4>Mô tả công việc</h4>
      <p>
        {job.description}
      </p>
      <h4>Yêu cầu</h4>
      {/* <ul className="list-style-three"> */}
      <p>
        {job.requirement}
      </p>
      {/* </ul> */}
      <h4>Quyền lợi</h4>
      {/* <ul className="list-style-three">
        <li>
          You have at least 3 years’ experience working as a Product Designer.
        </li>
        <li>You have experience using Sketch and InVision or Framer X</li>
        <li>
          You have some previous experience working in an agile environment –
          Think two-week sprints.
        </li>
        <li>You are familiar using Jira and Confluence in your workflow</li>
      </ul> */}
      <p>
        {job.benefit}
      </p>
    </div>
  );
};

export default JobDetailsDescriptions;
