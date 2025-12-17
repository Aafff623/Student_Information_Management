/**
 * 菜单
 */
export default [
    {
        name: "首页",
        id: "0",
        path: "/hello"
    },
    {
        name: "功能列表",
        id: "1",
        path: "/hello/codeying",
        children: [
            {path: "/admin", name: "管理员", id: "1_0", parent: "1",roles:['admin',]},
            {path: "/student", name: "学生", id: "1_1", parent: "1",roles:['admin',]},
            {path: "/clazz", name: "班级", id: "1_2", parent: "1",roles:['admin',]},
            {path: "/course", name: "课程", id: "1_3", parent: "1",roles:['admin','student',]},
            {path: "/score", name: "成绩", id: "1_4", parent: "1",roles:['admin','student',]},
        ]
    },
]

