module.exports = [
  {
    id: 1,
    title: "Sinh Viên",
    menuList: [
      { name: "Tìm kiếm việc làm", route: "/find-jobs" },
      { name: "Thông tin cá nhân", route: "/profile/my-profile" },
      { name: "Việc làm đã lưu", route: "/profile/saved-jobs" },
      { name: "Việc làm đã ứng tuyển", route: "/profile/applied-jobs" },
    ],
  },
  {
    id: 2,
    title: "Nhà Tuyển Dụng",
    menuList: [
      { name: "Đăng bài tuyển dụng", route: "https://findev-employer.netlify.app/" },
      { name: "Danh sách bài đăng", route: "#" },
    ],
  },
  {
    id: 3,
    title: "Thông Tin Thêm",
    menuList: [
      { name: "Câu hỏi thường gặp", route: "/faq"},
      { name: "Về chúng tôi", route: "#" },
      { name: "Các điều khoản và điều kiện", route: "#" },
      { name: "Liên hệ", route: "#" },
    ],
  },
];
