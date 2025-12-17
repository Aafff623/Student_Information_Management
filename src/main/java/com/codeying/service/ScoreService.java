package com.codeying.service;

import com.codeying.entity.Score;
import java.util.List;
/** 服务类 */
public interface ScoreService extends MyService<Score> {

  /**
   * 查询
   *
   * @param qo
   * @return
   */
  List<Score> sqlSelectList(Score qo);

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
  int sqlUpdate(Score e);

  /**
   * 保存
   *
   * @param e
   * @return
   */
  int sqlSave(Score e);
}

