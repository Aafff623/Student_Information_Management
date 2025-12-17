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

/** 班级控制器 关于班级的增删改查操作都在这 */
@Controller
@RequestMapping({"clazz"})
public class ClazzController extends BaseController {

  // 前后端分离，做为外键下拉
  @RequestMapping("list/select")
  @ResponseBody
  public ApiResult select() {
    ApiResult res = list(1, 500);
    PagerVO<Clazz> pagerVO = (PagerVO<Clazz>) res.getData();
    return successData(pagerVO.getRecords());
  }

  // 班级列表数据
  @RequestMapping("list")
  @ResponseBody
  public ApiResult list(Integer current, Integer size) {
    current = current == null ? 1 : current; // 默认第一页
    size = size == null ? 20 : size; // 分页大小
    // 获取列表数据
    QueryWrapper<Clazz> queryWrapper = getQueryWrapper();
    LoginUser loginUser = tokenService.getLoginInfo();
    IPage<Clazz> pageInfo = new Page<Clazz>().setCurrent(current).setSize(size); // 分页大小
    pageInfo = clazzService.page(pageInfo, queryWrapper);

    PagerVO<Clazz> pagerVO = new PagerVO<>(pageInfo); // 可以承载除了page的额外信息

    return successData(pagerVO);
  }

  private QueryWrapper<Clazz> getQueryWrapper() {
    // 用于存储查询的条件
    QueryWrapper<Clazz> paramMap = new QueryWrapper<>();
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

  // 班级详情
  @RequestMapping("detail")
  @ResponseBody
  public ApiResult detail(String id) {
    Clazz entity = clazzService.getById(id);

    return successData(entity);
  }

  // 班级保存
  @RequestMapping("save")
  @ResponseBody
  public ApiResult save(@RequestBody Clazz entityTemp) {
    String id = entityTemp.getId(); // 班级主键
    String name = entityTemp.getName(); // 班级名
    String bzr = entityTemp.getBzr(); // 班主任
    String tele = entityTemp.getTele(); // 班主任电话

    // 新增或更新
    if (entityTemp.getId() == null || "".equals(entityTemp.getId())) { // 新增
      id = CommonUtils.newId();
      entityTemp.setId(id);
      // 唯一字段，则在此校验
      QueryWrapper<Clazz> wrappername = new QueryWrapper();
      wrappername.eq("name", entityTemp.getName());
      if (clazzService.list(wrappername).size() > 0) {
        return fail("班级名 已存在！");
      }
      // before add

      clazzService.save(entityTemp);
    } else {
      // before edit

      clazzService.updateById(entityTemp);
    }
    return ApiResult.successMsg("操作成功"); // 返回保存成功
  }

  // 班级删除
  @RequestMapping("delete")
  @ResponseBody
  public ApiResult delete(String id) {
    Clazz delTemp = clazzService.getById(id);
    // before del

    // 根据ID删除记录
    clazzService.removeById(id);
    return success();
  }
}

