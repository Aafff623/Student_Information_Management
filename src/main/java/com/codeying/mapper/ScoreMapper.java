package com.codeying.mapper;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.codeying.entity.Score;
import java.util.List;
/** 成绩 mybatisPlus提供接口，自动实现了各种单表操作 */
public interface ScoreMapper extends BaseMapper<Score> {

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

