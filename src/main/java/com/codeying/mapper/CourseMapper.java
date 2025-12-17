package com.codeying.mapper;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.codeying.entity.Course;
import java.util.List;
/** 课程 mybatisPlus提供接口，自动实现了各种单表操作 */
public interface CourseMapper extends BaseMapper<Course> {

  /**
   * 查询
   *
   * @param qo
   * @return
   */
  List<Course> sqlSelectList(Course qo);

  /**
   * 删掉
   *
   * @param id
   * @return
   */
  int sqlDeleteById(String id);

  /**
   * 更新
   *
   * @param e
   * @return
   */
  int sqlUpdate(Course e);

  /**
   * 保存
   *
   * @param e
   * @return
   */
  int sqlSave(Course e);
}

