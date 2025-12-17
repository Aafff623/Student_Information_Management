package com.codeying.service;

import com.codeying.entity.Course;
import java.util.List;
/** 服务类 */
public interface CourseService extends MyService<Course> {

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

