package com.codeying.service;

import com.codeying.entity.Student;
import java.util.List;
/** 服务类 */
public interface StudentService extends MyService<Student> {

  /**
   * 查询
   *
   * @param qo
   * @return
   */
  List<Student> sqlSelectList(Student qo);

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
  int sqlUpdate(Student e);

  /**
   * 保存
   *
   * @param e
   * @return
   */
  int sqlSave(Student e);
}

