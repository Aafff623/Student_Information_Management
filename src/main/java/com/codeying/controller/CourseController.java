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

/** 课程控制器 关于课程的增删改查操作都在这 */
@Controller
@RequestMapping({"course"})
public class CourseController extends BaseController {

  // 前后端分离，做为外键下拉
  @RequestMapping("list/select")
  @ResponseBody
  public ApiResult select() {
    ApiResult res = list(1, 500);
    PagerVO<Course> pagerVO = (PagerVO<Course>) res.getData();
    return successData(pagerVO.getRecords());
  }

  // 课程列表数据
  @RequestMapping("list")
  @ResponseBody
  public ApiResult list(Integer current, Integer size) {
    current = current == null ? 1 : current; // 默认第一页
    size = size == null ? 20 : size; // 分页大小
    // 获取列表数据
    QueryWrapper<Course> queryWrapper = getQueryWrapper();
    LoginUser loginUser = tokenService.getLoginInfo();
    IPage<Course> pageInfo = new Page<Course>().setCurrent(current).setSize(size); // 分页大小
    pageInfo = courseService.page(pageInfo, queryWrapper);

    PagerVO<Course> pagerVO = new PagerVO<>(pageInfo); // 可以承载除了page的额外信息

    return successData(pagerVO);
  }

  private QueryWrapper<Course> getQueryWrapper() {
    // 用于存储查询的条件
    QueryWrapper<Course> paramMap = new QueryWrapper<>();
    String id = req.getParameter("id");
    paramMap.eq(!StringUtils.isEmpty(id), "id", id);
    String name = req.getParameter("name");
    if (!StringUtils.isEmpty(name)) {
      paramMap.like("name", name);
    }

    String orderByStr = "id desc"; // 默认根据id降序排序
    // 默认按照id排序
    paramMap.last("order by " + orderByStr);
    return paramMap;
  }

  // 课程详情
  @RequestMapping("detail")
  @ResponseBody
  public ApiResult detail(String id) {
    Course entity = courseService.getById(id);

    return successData(entity);
  }

  // 课程保存
  @RequestMapping("save")
  @ResponseBody
  public ApiResult save(@RequestBody Course entityTemp) {
    String id = entityTemp.getId(); // 课程主键
    String name = entityTemp.getName(); // 课程名称
    String teacherid = entityTemp.getTeacherid(); // 指导老师
    Double score = entityTemp.getScore(); // 学分
    String describtion = entityTemp.getDescribtion(); // 课程简介

    // 新增或更新
    if (entityTemp.getId() == null || "".equals(entityTemp.getId())) { // 新增
      id = CommonUtils.newId();
      entityTemp.setId(id);
      // 唯一字段，则在此校验
      QueryWrapper<Course> wrappername = new QueryWrapper();
      wrappername.eq("name", entityTemp.getName());
      if (courseService.list(wrappername).size() > 0) {
        return fail("课程名称 已存在！");
      }
      // before add

      courseService.save(entityTemp);
    } else {
      // before edit

      courseService.updateById(entityTemp);
    }
    return ApiResult.successMsg("操作成功"); // 返回保存成功
  }

  // 课程删除
  @RequestMapping("delete")
  @ResponseBody
  public ApiResult delete(String id) {
    Course delTemp = courseService.getById(id);
    // before del

    // 根据ID删除记录
    courseService.removeById(id);
    return success();
  }
}

