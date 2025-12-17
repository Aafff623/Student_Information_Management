package com.codeying.service;

import com.codeying.entity.Clazz;
import java.util.List;
/** 服务类 */
public interface ClazzService extends MyService<Clazz> {

  /**
   * 查询
   *
   * @param qo
   * @return
   */
  List<Clazz> sqlSelectList(Clazz qo);

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
  int sqlUpdate(Clazz e);

  /**
   * 保存
   *
   * @param e
   * @return
   */
  int sqlSave(Clazz e);
}

