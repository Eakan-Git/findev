const Block2 = () => {
  const blockContent = [
    {
      id: 1,
      icon: "images/resource/process-1.png",
      title: (
        <>
          Đăng ký tài khoản <br />
          tại FinDev
        </>
      ),
    },
    {
      id: 2,
      icon: "images/resource/process-2.png",
      title: (
        <>
          Khám phá hàng ngàn <br />
          công việc chất lượng
        </>
      ),
    },
    {
      id: 3,
      icon: "images/resource/process-3.png",
      title: (
        <>
          Lựa chọn công việc phù hợp <br />
          và ứng tuyển
        </>
      ),
    },
  ];
  return (
    <>
      {blockContent.map((item) => (
        <div
          className="process-block col-lg-4 col-md-6 col-sm-12"
          key={item.id}
        >
          <div className="icon-box">
            <img src={item.icon} alt="how it works" />
          </div>
          <h4>{item.title}</h4>
        </div>
      ))}
    </>
  );
};

export default Block2;
