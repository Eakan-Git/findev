import GalleryBox from "./GalleryBox";

const CompanyDetailsDescriptions = ({employer}) => {
  return (
    <div className="job-detail">
      <h4>Giới thiệu</h4>
      <p>
        {employer?.description}
      </p>
    </div>
  );
};

export default CompanyDetailsDescriptions;
