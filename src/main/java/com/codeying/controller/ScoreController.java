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

/** 成绩控制器 关于成绩的增删改查操作都在这 */
@Controller
@RequestMapping({"score"})
public class ScoreController extends BaseController {

  // 成绩列表数据
  @RequestMapping("list")
  @ResponseBody
  public ApiResult list(Integer current, Integer size) {
    current = current == null ? 1 : current; // 默认第一页
    size = size == null ? 20 : size; // 分页大小
    // 获取列表数据
    QueryWrapper<Score> queryWrapper = getQueryWrapper();
    LoginUser loginUser = tokenService.getLoginInfo();
    // Student只能看关联了自己的
    if (loginUser != null && loginUser.getRole().equals("student")) {
      queryWrapper.eq("sid", loginUser.getId()); // 只能查看和自己相关的内容
    }
    IPage<Score> pageInfo = new Page<Score>().setCurrent(current).setSize(size); // 分页大小
    pageInfo = scoreService.page(pageInfo, queryWrapper);

    // 循环遍历list数据获取外键数据
    for (Score e : pageInfo.getRecords()) {
      // 获取外键数据:学生
      e.setSidFrn(studentService.getById(e.getSid()));
      // 获取外键数据:课程
      e.setCidFrn(courseService.getById(e.getCid()));
    }

    PagerVO<Score> pagerVO = new PagerVO<>(pageInfo); // 可以承载除了page的额外信息

    return successData(pagerVO);
  }

  private QueryWrapper<Score> getQueryWrapper() {
    // 用于存储查询的条件
    QueryWrapper<Score> paramMap = new QueryWrapper<>();
    String id = req.getParameter("id");
    paramMap.eq(!StringUtils.isEmpty(id), "id", id);
    String sid = req.getParameter("sid");
    if (!StringUtils.isEmpty(sid)) {
      paramMap.eq("sid", sid);
    }
    String cid = req.getParameter("cid");
    if (!StringUtils.isEmpty(cid)) {
      paramMap.eq("cid", cid);
    }

    String orderByStr = "id desc"; // 默认根据id降序排序
    // 默认按照id排序
    paramMap.last("order by " + orderByStr);
    return paramMap;
  }

  // 成绩详情
  @RequestMapping("detail")
  @ResponseBody
  public ApiResult detail(String id) {
    Score entity = scoreService.getById(id);
    // 获取外键数据：学生
    entity.setSidFrn(studentService.getById(entity.getSid()));
    // 获取外键数据：课程
    entity.setCidFrn(courseService.getById(entity.getCid()));

    return successData(entity);
  }

  // 成绩保存
  @RequestMapping("save")
  @ResponseBody
  public ApiResult save(@RequestBody Score entityTemp) {
    String id = entityTemp.getId(); // 成绩主键
    String sid = entityTemp.getSid(); // 学生
    String cid = entityTemp.getCid(); // 课程
    Date createtime = entityTemp.getCreatetime(); // 创建时间
    Integer score = entityTemp.getScore(); // 分数

    // 新增或更新
    if (entityTemp.getId() == null || "".equals(entityTemp.getId())) { // 新增
      id = CommonUtils.newId();
      entityTemp.setId(id);
      createtime = new Date();
      entityTemp.setCreatetime(createtime);
      score = 0;
      entityTemp.setScore(score);
      // before add

      scoreService.save(entityTemp);
    } else {
      // before edit

      scoreService.updateById(entityTemp);
    }
    return ApiResult.successMsg("操作成功"); // 返回保存成功
  }

  // 成绩删除
  @RequestMapping("delete")
  @ResponseBody
  public ApiResult delete(String id) {
    Score delTemp = scoreService.getById(id);
    // before del

    // 根据ID删除记录
    scoreService.removeById(id);
    return success();
  }
}

