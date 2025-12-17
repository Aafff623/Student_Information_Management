package com.codeying.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import org.springframework.util.StringUtils;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.codeying.component.*;
import com.codeying.component.utils.*;
import com.codeying.utils.component.*;
import com.codeying.utils.*;
import com.codeying.entity.*;
import com.codeying.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;
import java.io.InputStream;
import java.util.*;
import java.io.File;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;
import org.apache.commons.io.FileUtils;
import jakarta.servlet.ServletOutputStream;
import java.math.BigDecimal;

/** 学生控制器 关于学生的增删改查操作都在这 */
@Controller
@RequestMapping({"student"})
public class StudentController extends BaseController {

  // 前后端分离，做为外键下拉
  @RequestMapping("list/select")
  @ResponseBody
  public ApiResult select() {
    ApiResult res = list(1, 500);
    PagerVO<Student> pagerVO = (PagerVO<Student>) res.getData();
    return successData(pagerVO.getRecords());
  }

  // 学生列表数据
  @RequestMapping("list")
  @ResponseBody
  public ApiResult list(Integer current, Integer size) {
    current = current == null ? 1 : current; // 默认第一页
    size = size == null ? 20 : size; // 分页大小
    // 获取列表数据
    QueryWrapper<Student> queryWrapper = getQueryWrapper();
    LoginUser loginUser = tokenService.getLoginInfo();
    IPage<Student> pageInfo = new Page<Student>().setCurrent(current).setSize(size); // 分页大小
    pageInfo = studentService.page(pageInfo, queryWrapper);

    // 循环遍历list数据获取外键数据
    for (Student e : pageInfo.getRecords()) {
      // 获取外键数据:班级
      e.setClazzidFrn(clazzService.getById(e.getClazzid()));
    }

    PagerVO<Student> pagerVO = new PagerVO<>(pageInfo); // 可以承载除了page的额外信息

    StringBuilder statisticInfo = new StringBuilder();
    {
      QueryWrapper<Student> sumQueryWrapper = queryWrapper.clone();
      sumQueryWrapper.select("IFNULL(avg(age), 0) AS value"); // 设置聚合查询字段
      Map<String, Object> avgResult = studentService.getMap(sumQueryWrapper); // 获取SUM结果
      BigDecimal totalSum =
          avgResult != null ? new BigDecimal(avgResult.get("value").toString()) : BigDecimal.ZERO;
      statisticInfo.append(String.format("平均年龄：%.2f；", totalSum.doubleValue()));
    }
    pagerVO.setStatisticInfo(statisticInfo.toString());

    return successData(pagerVO);
  }

  private QueryWrapper<Student> getQueryWrapper() {
    // 用于存储查询的条件
    QueryWrapper<Student> paramMap = new QueryWrapper<>();
    String id = req.getParameter("id");
    paramMap.eq(!StringUtils.isEmpty(id), "id", id);
    String username = req.getParameter("username");
    if (!StringUtils.isEmpty(username)) {
      paramMap.like("username", username);
    }
    String name = req.getParameter("name");
    if (!StringUtils.isEmpty(name)) {
      paramMap.like("name", name);
    }
    String gender = req.getParameter("gender");
    if (!StringUtils.isEmpty(gender)) {
      paramMap.eq("gender", gender);
    }
    String numb = req.getParameter("numb");
    if (!StringUtils.isEmpty(numb)) {
      paramMap.like("numb", numb);
    }
    String clazzid = req.getParameter("clazzid");
    if (!StringUtils.isEmpty(clazzid)) {
      paramMap.eq("clazzid", clazzid);
    }

    String orderByStr = "id desc"; // 默认根据id降序排序
    // 默认按照id排序
    paramMap.last("order by " + orderByStr);
    return paramMap;
  }

  // 学生详情
  @RequestMapping("detail")
  @ResponseBody
  public ApiResult detail(String id) {
    Student entity = studentService.getById(id);
    // 获取外键数据：班级
    entity.setClazzidFrn(clazzService.getById(entity.getClazzid()));

    return successData(entity);
  }

  // 学生保存
  @RequestMapping("save")
  @ResponseBody
  public ApiResult save(@RequestBody Student entityTemp) {
    String id = entityTemp.getId(); // 学生主键
    String username = entityTemp.getUsername(); // 用户名
    String password = entityTemp.getPassword(); // 密码
    String name = entityTemp.getName(); // 姓名
    String avatar = entityTemp.getAvatar(); // 头像
    String gender = entityTemp.getGender(); // 性别
    Integer age = entityTemp.getAge(); // 年龄
    String tele = entityTemp.getTele(); // 电话
    String place = entityTemp.getPlace(); // 籍贯
    Date ruxsj = entityTemp.getRuxsj(); // 入学时间
    String numb = entityTemp.getNumb(); // 学号
    String clazzid = entityTemp.getClazzid(); // 班级

    // 新增或更新
    if (entityTemp.getId() == null || "".equals(entityTemp.getId())) { // 新增
      id = CommonUtils.newId();
      entityTemp.setId(id);
      // 唯一字段，则在此校验
      QueryWrapper<Student> wrapperusername = new QueryWrapper();
      wrapperusername.eq("username", entityTemp.getUsername());
      if (studentService.list(wrapperusername).size() > 0) {
        return fail("用户名 已存在！");
      }
      // 唯一字段，则在此校验
      QueryWrapper<Student> wrappername = new QueryWrapper();
      wrappername.eq("name", entityTemp.getName());
      if (studentService.list(wrappername).size() > 0) {
        return fail("姓名 已存在！");
      }
      // 唯一字段，则在此校验
      QueryWrapper<Student> wrappernumb = new QueryWrapper();
      wrappernumb.eq("numb", entityTemp.getNumb());
      if (studentService.list(wrappernumb).size() > 0) {
        return fail("学号 已存在！");
      }
      // before add

      studentService.save(entityTemp);
    } else {
      // before edit

      studentService.updateById(entityTemp);
      if (id.equals(getCurrentUser().getId())
          && getCurrentUser().getUsername().equals(username)) { // 刷新用户信息
        tokenService.updateLoginUser(studentService.getById(id));
      }
    }
    return ApiResult.successMsg("操作成功"); // 返回保存成功
  }

  // 学生删除
  @RequestMapping("delete")
  @ResponseBody
  public ApiResult delete(String id) {
    Student delTemp = studentService.getById(id);
    // before del

    // 根据ID删除记录
    studentService.removeById(id);
    return success();
  }
}

