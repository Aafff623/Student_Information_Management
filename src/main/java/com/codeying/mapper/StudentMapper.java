package com.codeying.mapper;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.codeying.entity.Student;
import java.util.List;
/** 学生 mybatisPlus提供接口，自动实现了各种单表操作 */
public interface StudentMapper extends BaseMapper<Student> {

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

