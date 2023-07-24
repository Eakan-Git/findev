export default [
    {
        id: 1,
        label: "Home",
        items: [
            {
                name: "Trang chủ",
                routePath: "/",
            },
            {
                name: "Tìm việc",
                routePath: "/find-jobs",
            },
            {
                name: "Công ty",
                routePath: "/employers",
            },
            
        ]
    },
    {
        id: 2,
        label: "Danh sách công việc",
        items: [
            {
                name: "Tìm việc",
                routePath: "/find-jobs",
            },
            {
                name: "Công việc gợi ý",
                routePath: "/recommend-jobs",
            },
        ],
    },
    {
        id: 3,
        label: "Hồ sơ",
        items: [
            {
                name: "Thông tin cá nhân",
                routePath: "/profile/my-profile",
            },
            {
                name: "Công việc đã lưu",
                routePath: "/profile/saved-jobs",
            },
            {
                name: "Đơn ứng tuyển",
                routePath: "/profile/applied-jobs",
            },
            {
                name: "Quản lý CV",
                routePath: "/profile/cv-manager",
            },
            {
                name: "Thời gian biểu",
                routePath: "/profile/my-schedule",
            },
            {
                name: "Đổi mật khẩu",
                routePath: "/profile/change-password",
            },
            {
                name: "Đăng xuất",
                routePath: "/logout",
            }
        ],
    },
];
