package com.codeying.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import org.springframework.format.annotation.DateTimeFormat;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;
import java.util.List;

import java.io.Serializable;
/** 班级实体类 */
@TableName("tb_clazz")
public class Clazz implements Serializable {

  /** 班级主键 */
  @TableId private String id;

  /** 班级名 */
  @TableField("name")
  private String name;

  /** 班主任 */
  @TableField("bzr")
  private String bzr;

  /** 班主任电话 */
  @TableField("tele")
  private String tele;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getBzr() {
    return bzr;
  }

  public void setBzr(String bzr) {
    this.bzr = bzr;
  }

  public String getTele() {
    return tele;
  }

  public void setTele(String tele) {
    this.tele = tele;
  }
}

